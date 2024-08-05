import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import Editor from "../../RichTextEditor/TextEditor";
import styles from "./styles.module.css";
import {Package, Step, StepOption, UploadType} from "../types";
import {
    Button,
    Checkbox, CircularProgress,
    FormControlLabel,
    Grid,
    IconButton,
    LinearProgress, List, ListItem, ListItemSecondaryAction, ListItemText,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core";
import InfiniteScroll from 'react-infinite-scroll-component';
import {toast} from "react-toastify";
import classNames from "classnames";
import {CloseOutlined, FileCopyOutlined, HelpOutline} from "@material-ui/icons";
import {
    cmsURL,
    generateOrderCheckoutSession,
    getAudienceAnalysisFilters,
    notifyEmailEntry,
    postAnalysePressPressRelease,
    postMediaUpload
} from "../../../app/api";
import {useHistory} from "react-router-dom";
import {BasketComponent} from "../BasketComponent/BasketComponent";
import UserContext from "../../../Context/UserContext";
import {PackageComponent} from "./PackageComponent/PackageComponent";
import Validator from "validator";
import {useStripe} from "@stripe/react-stripe-js";
import {confirm} from "../helpers";
import Select from "react-select";
import {JournalistFilterValues} from "../StepsComponent";
import {Outlet} from "../../../types/outlet";
import RichTextEditor, {EditorValue} from "react-rte";
import {Journalist} from "../../../types/journalist";

export function StepComponent(
    {
        step,
        nextStep,
        updateData,
        data,
        conditions,
        updateConditions,
        previousStep,
        files,
        addFiles,
        selectedPackage,
        updatePackage,
        signupUser,
        release,
        supportingMaterial,
        setRelease,
        setSupportingMaterial,
        setJournalistFilterValues,
        journalistFilterValues,
        result,
        setResult,
        setAudienceResultLoading,
        outlets,
        selectedOutlets,
        setSelectedOutlets,
        rtRelease,
        setRtRelease,
        replyTo,
        setReplyTo,
        subject,
        setSubject,
        filters,
        setFilters,
        publicationsToIgnore,
        regions,
        selectedRegions,
        setSelectedRegions,
        audienceResultLoading,
        journalistsToRemove,
        setJournalistsToRemove
    }: {
        step: Step,
        nextStep: (s: Step) => void,
        updateData: (d: any) => void,
        data: any,
        conditions: any,
        updateConditions: (c: any) => void,
        previousStep?: boolean,
        files: File[],
        addFiles: (f: FileList) => void,
        selectedPackage: Package,
        updatePackage: (p: Package) => void,
        signupUser: () => void,
        setRelease: (release: File) => void,
        setSupportingMaterial: (supportingMaterial: File[]) => void,
        release: File | null,
        supportingMaterial: File[],
        setJournalistFilterValues: (next: JournalistFilterValues) => void,
        journalistFilterValues: JournalistFilterValues,
        result: {
            journalists: Journalist[]
            journalistCount: number,
            sectors: string[],
            outlets: string[],
            jobTitles: string[],
            outletTypes: string[],
            totalCount: number
        },
        setResult: (next: {
            journalists: Journalist[]
            journalistCount: number,
            sectors: string[],
            outlets: string[],
            jobTitles: string[],
            outletTypes: string[],
            totalCount: number
        }) => void,
        setAudienceResultLoading: (next: boolean) => void,
        outlets: Outlet[],
        selectedOutlets: string[]
        setSelectedOutlets: (outlets: string[]) => void,
        rtRelease: string,
        setRtRelease: (next: string) => void,
        subject: string,
        setSubject: (subject: string) => void,
        replyTo: string,
        setReplyTo: (reply: string) => void,
        filters: any | null,
        setFilters: (next: any) => void,
        publicationsToIgnore: string[],
        regions: string[],
        selectedRegions: string[],
        setSelectedRegions: (regions: string[]) => void,
        audienceResultLoading: boolean,
        journalistsToRemove: Journalist[],
        setJournalistsToRemove: (journalists: Journalist[]) => void
    }) {

    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const {user} = useContext(UserContext);
    const stripe = useStripe();

    const [generatedLink, setGeneratedLink] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getAudienceAnalysisFilters().then(data => {
            if (!data) {
                return;
            }

            const {sectors, jobTitles, outlets, outletTypes} = data;


            const sectorOptions = sectors.sort((a: string, b: string) => a.localeCompare(b)).map((sector: string) => {
                return {
                    value: sector,
                    label: sector
                }
            });

            const jobTitleOptions = jobTitles.filter((a: string | null) => !!a).sort((a: string, b: string) => a.localeCompare(b)).map((sector: string) => {
                return {
                    value: sector,
                    label: sector
                }
            });

            const outletOptions = outlets.sort((a: string, b: string) => a.localeCompare(b)).map((sector: string) => {
                return {
                    value: sector,
                    label: sector
                }
            });

            const outletTypeOptions = outletTypes.sort((a: string, b: string) => a.localeCompare(b)).map((sector: string) => {
                return {
                    value: sector,
                    label: sector
                }
            });

            setFilters({
                jobTitles: jobTitleOptions,
                outletTypes: outletTypeOptions,
                outlets: outletOptions,
                sectors: sectorOptions
            });
        });
    }, [])

    const storeInState = (optionId: string | undefined, value: any, option: StepOption) => { // TODO Clean up signature
        let temp = {...data};

        if (optionId) {
            if (!temp[step.id]) {
                temp[step.id] = {
                    metaDescription: step.metaDescription
                };
            }

            temp[step.id][optionId] = {
                value: value,
                metaDescription: option.metaDescription
            }
        } else if (option.store && (option.type === "button" || option.type === "package")) {
            temp[step.id] = {
                singleValue: true,
                value: value,
                metaDescription: step.metaDescription
            }
        }

        updateData(temp);
    }

    const checkAllConditions = (option: StepOption): boolean => {
        let flag = true;

        if (!option.conditions) return false;

        option.conditions.forEach((condition: any) => {
            if (!conditions[condition] || conditions[condition].value === false) {
                flag = false;
            }
        });

        if (option.conditionsExclusive) {
            for (let condition in conditions) {
                if (Object.prototype.hasOwnProperty.call(conditions, condition)) {
                    if (condition !== option.conditions[0] && conditions[condition].value === true) {
                        flag = false;
                        break;
                    }
                }
            }
        }

        return flag;
    }

    const requiredOptionsFilled = (): boolean => {
        const requiredOptions = step.options.filter(o => o.required);

        let flag = true;
        requiredOptions.forEach(o => {
            if (o.id && (!data[step.id] || !data[step.id][o.id] || !data[step.id][o.id].value || data[step.id][o.id].value === "")) {
                flag = false;
            }

            if ((o.id === "name" || o.id === "site") && user) {
                flag = true;
            }
        });

        if (!flag) toast("Make sure you fill in all the required fields", {type: "error"});

        return flag;
    }

    const stepCallbacks: { [id: string]: () => void } = {
        "email-collect-step": async () => {
            if (data["email-collect-step"]["emailInput"].value !== "test") {
                await notifyEmailEntry(data["email-collect-step"]["emailInput"].value);
            }
        }
    }

    const renderConfig: { [id: string]: (option: StepOption, index: number) => any } = {
        "journalist-filters": (option: StepOption, index: any) => {
            if (!filters) {
                return <span>Loading</span>
            }

            const removeJournalist = (journalist: Journalist) => {
                setJournalistsToRemove([...journalistsToRemove, journalist]);

                setResult({
                    ...result,
                    journalists: result.journalists.filter(j => j.id !== journalist.id)
                });
            }

            const loadItems = () => {

                setAudienceResultLoading(true);
                postAnalysePressPressRelease({filters: journalistFilterValues, page: currentPage}).then(response => {
                    console.log("Loading more")
                    if (response) {
                        setResult({
                            ...response,
                            journalists: result.journalists.concat(response.journalists),
                            sectors: journalistFilterValues.sectors,
                            outlets: journalistFilterValues.outlets,
                            jobTitles: journalistFilterValues.jobTitles,
                            outletTypes: journalistFilterValues.outletTypes,
                        });

                        setCurrentPage(currentPage + 1);
                    } else {
                        toast("Something went wrong.", {type: "error"});
                    }

                    setAudienceResultLoading(false);
                });
            }

            const onClick = () => {
                setAudienceResultLoading(true);
                postAnalysePressPressRelease({filters: journalistFilterValues, page: 0}).then(response => {
                    if (response) {
                        setResult({
                            ...response,
                            sectors: journalistFilterValues.sectors,
                            outlets: journalistFilterValues.outlets,
                            jobTitles: journalistFilterValues.jobTitles,
                            outletTypes: journalistFilterValues.outletTypes,
                        });
                    } else {
                        toast("Something went wrong.", {type: "error"});
                    }

                    setAudienceResultLoading(false);
                });
            }

            return <div className={"content"}>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <Typography variant={"body2"} align={"left"}>
                            Build the audience for your press release using the following filters. Leave a box blank for all or select multiple to widen range.
                        </Typography>

                        <Typography variant={"body2"} align={"left"}>
                            Any audience over 1000 will be submitted for approval before distribution is possible.
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <span>Outlet types</span>
                        <Select
                            options={filters.outletTypes}
                            isMulti
                            onChange={e => setJournalistFilterValues({
                                ...journalistFilterValues,
                                outletTypes: e.map(s => s.value)
                            })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <span>Sectors</span>
                        <Select
                            options={filters.sectors}
                            isMulti
                            onChange={e => setJournalistFilterValues({
                                ...journalistFilterValues,
                                sectors: e.map(s => s.value)
                            })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <span>Job titles</span>
                        <Select
                            options={filters.jobTitles}
                            isMulti
                            onChange={e => setJournalistFilterValues({
                                ...journalistFilterValues,
                                jobTitles: e.map(s => s.value)
                            })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <span>Outlets</span>
                        <Select
                            options={filters.outlets}
                            isMulti
                            onChange={e => setJournalistFilterValues({
                                ...journalistFilterValues,
                                outlets: e.map(s => s.value)
                            })}
                        />
                    </Grid>

                    <Button onClick={onClick} variant={"outlined"} color={"primary"}>Manage Audience</Button>

                    <Grid item xs={12} style={{maxHeight: "300px", overflow: "scroll"}}>
                        <List>
                            {result.journalists.map(journalist => <ListItem>
                                <ListItemText primary={`${journalist.firstName} ${journalist.lastName}`} secondary={journalist.outlet}/>
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => removeJournalist(journalist)}>
                                        <CloseOutlined/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>)}
                        </List>

                        {audienceResultLoading && <h4>Loading...</h4>}

                        {result.journalists.length < result.totalCount  && <Button onClick={loadItems}>Load more</Button>}
                    </Grid>
                </Grid>
            </div>
        },
        "deterministicCheckbox": (option: StepOption, index): any => {
            let onChange = (event: any) => {
                let temp = {...conditions};

                if (option.id) {
                    temp[option.id] = {
                        value: event.target.checked
                    }
                }
                updateConditions(temp);
            };

            const checked = (): boolean => {
                if (option.id && conditions[option.id]) {
                    return conditions[option.id].value || false;
                }

                return false;
            }

            return <div key={index}>
                <FormControlLabel control={<Checkbox onChange={onChange} checked={checked()}/>} label={option.text}/>
            </div>
        },
        "checkbox": (option: StepOption, index): any => {
            let onChange: (event: any) => void = (event: any) => {
                storeInState(option.id, event.target.checked, option);
            };

            const checked = (): boolean => {
                if (data[step.id] && option.id && data[step.id][option.id]) {
                    return data[step.id][option.id].value || false
                }

                return false;
            }

            return <div key={index}>
                <FormControlLabel control={<Checkbox onChange={onChange} checked={checked()}/>} label={option.text}/>
            </div>
        },
        "skip": (option: StepOption, index): any => {
            const onClick = () => {
                if (option.next) {
                    nextStep(option.next);
                }
            }

            return <div key={index} className={styles.optionWrapper}>
                <Button color={"primary"} variant={"outlined"} onClick={onClick}>{option.text}</Button>
            </div>
        },
        "button": (option: StepOption, index): any => {
            // TODO Clean this up!

            let onClick: () => void = () => {
                storeInState(option.id, true, option);
                if (stepCallbacks[step.id]) stepCallbacks[step.id]();
            };

            if (option.end) {
                onClick = () => {
                    history.push("/");
                }
            }

            if (option.next) {
                if (user && step.hideIfLoggedIn) {
                    nextStep(option.next);
                    return;
                }

                onClick = async () => {
                    if (!option.next) return;
                    if (!requiredOptionsFilled()) return;

                    // if (option.analyseJournalists) {
                    //     setAudienceResultLoading(true);
                    //     postAnalysePressPressRelease({filters: journalistFilterValues}).then(response => {
                    //         if (response) {
                    //             setResult({
                    //                 ...response,
                    //                 sectors: journalistFilterValues.sectors,
                    //                 outlets: journalistFilterValues.outlets,
                    //                 jobTitles: journalistFilterValues.jobTitles,
                    //                 outletTypes: journalistFilterValues.outletTypes,
                    //             });
                    //         } else {
                    //             toast("Something went wrong.", {type: "error"});
                    //         }
                    //
                    //         setAudienceResultLoading(false);
                    //     });
                    // }

                    if (option.validate === "email" && !Validator.isEmail(data[step.id]["emailInput"].value)) {
                        return;
                    }

                    if (stepCallbacks[step.id]) stepCallbacks[step.id]();

                    if (option.store) {
                        storeInState(option.id, option.metaDescription, option);
                    }

                    if (option.triggerSignup) {
                        setLoading(true);
                        await signupUser();
                        setLoading(false);
                    }

                    // If the option is the button on the review step
                    // we need to generate a checkout session and redirect!
                    if (option.send) {
                        setLoading(true);
                        const formData = new FormData();
                        formData.append("data", JSON.stringify({
                            orderInfo: data,
                            packageId: selectedPackage.id,
                            stripeId: selectedPackage.stripeId,
                            audienceFilterValues: journalistFilterValues,
                            outletsToIgnore: selectedOutlets,
                            releaseRT: rtRelease.toString(),
                            replyTo: replyTo,
                            emailSubject: subject,
                            region: selectedRegions.join(", "),
                            journalistsToRemove: journalistsToRemove,
                            free: selectedPackage.cost === 0
                        }));

                        if (release) {
                            formData.append("files.release", release);
                        }

                        Array.from(supportingMaterial).forEach(f => {
                            formData.append("files.supportingMaterial", f);
                        });


                        // const checkoutSessionResponse = await generateOrderCheckoutSession(selectedPackage.id, data);
                        const checkoutSessionResponse = await generateOrderCheckoutSession(formData);
                        if (selectedPackage.cost === 0) {
                            nextStep(option.next);
                            return;
                        }

                        if (checkoutSessionResponse) {
                            window.removeEventListener("beforeunload", confirm);
                            window.onpopstate = null;

                            await stripe?.redirectToCheckout({
                                sessionId: checkoutSessionResponse.id
                            });
                            return;
                        } else {
                            toast("We couldn't process your order. Please try again.", {type: "error"});
                            setLoading(false);
                            return;
                        }
                    }

                    nextStep(option.next);
                };
            }

            return <div key={index} className={styles.optionWrapper}>
                <Button color={"primary"} variant={"outlined"} onClick={onClick} id={option.gaId}
                        disabled={loading}>{option.text}</Button>
            </div>
        },
        "package": (option: StepOption, index): any => {
            let onClick = () => {
                storeInState("selected-package", true, option); // TODO no longer needed (modify the basket to use this)

                updatePackage(new class implements Package {
                    cost: number = Number(option.packageCost);
                    id: number = Number(option.packageId);
                    name: string = String(option.text);
                });

                if (option.next) {
                    nextStep(option.next);
                }


            }

            if ((!user || !user.subscription) && (option.packageId === 5 || option.packageId === 6)) {
                onClick = () => {
                };
            }

            return <div key={index}>
                {checkAllConditions(option) && <PackageComponent packageId={option.packageId || 0} onClick={onClick}/>}
            </div>
        },


        "input": (option: StepOption, index): any => {
            const type = option.validate === "email" ? "email" : "text";

            let onChange: (event: any) => void = (event: any) => {
                storeInState(option.id, event.target.value, option);
            };

            if (option.id === "email" && user) {
                // storeInState(option.id, user.email, option);

                return <div key={`${option.id}-${index}`} className={styles.optionWrapper}>
                    <TextField disabled value={user.email} variant={"outlined"} label={option.metaDescription}
                               type={type}/>
                </div>
            }

            if (option.id === "name" && user) {
                // storeInState(option.id, user.name, option);

                return <div key={`${option.id}-${index}`} className={styles.optionWrapper}>
                    <TextField value={user.name} variant={"outlined"} label={option.metaDescription} type={type}/>
                </div>
            }

            if (option.id === "site" && user) {
                // storeInState(option.id, user.website, option);

                return <div key={`${option.id}-${index}`} className={styles.optionWrapper}>
                    <TextField value={user.website} variant={"outlined"} label={option.metaDescription} type={type}/>
                </div>
            }


            if (option.id && data[step.id] && data[step.id][option.id]) {
                return <div key={`${option.id}-${index}`} className={styles.optionWrapper}>
                    <TextField multiline={option.multiline} rows={5} placeholder={option.placeholder}
                               value={data[step.id][option.id].value} onChange={onChange} variant={"outlined"}
                               required={option.required} label={option.metaDescription} type={type}/>
                </div>
            } else {
                return <div key={`${option.id}-${index}`} className={styles.optionWrapper}>
                    <TextField multiline={option.multiline} rows={5} placeholder={option.placeholder} value={""}
                               onChange={onChange} variant={"outlined"} required={option.required}
                               label={option.metaDescription} type={type}/>
                </div>
            }
        },
        "group": (option: StepOption, index): any => {
            if (!option.group || option.group.length === 0) return <div/>

            return <div className={styles.optionGroup} key={index}>
                {option.group.map((o, i) => renderConfig[o.type](o, i))}
            </div>
        },
        "upload": (option: StepOption, index) => {
            const onChange = (event: any) => { // TODO Replace event any type with correct type
                addFiles(event.target.files); // TODO: remove since redundant

                if (option.uploadType === UploadType.supporting_material) {
                    setSupportingMaterial(event.target.files);
                } else if (option.uploadType === UploadType.release) {
                    setRelease(event.target.files[0]);
                }
            }

            // const onChange2 = async (next: EditorValue) => {
            //     setRtRelease(next);
            // }
            const onChange2 = async (next: string) => {
                setRtRelease(next);
            }

            if (option.uploadType === UploadType.release) {
                const imageOnChange = async (next: ChangeEvent<HTMLInputElement>) => {
                    if (!next.target.files) {
                        return;
                    }

                    const file = next.target.files[0];
                    const response = await postMediaUpload(file);
                    const remoteUrl = `${cmsURL}${response.media.url}`;

                    setGeneratedLink(remoteUrl);
                }

                const copyToClipboardOnClick = () => {
                    textToClipboard(generatedLink);
                    toast("Link copied!", {type: "success"});
                }

                return <div>
                    <div className={"margin-v-md"}>
                        {/* <h2>Your Release</h2>

                        <div className={"info-box"}>
                            Copy and paste your release into the editor below. If you're images don't show up properly
                            generate a link for them with the tool below and insert them manually with the editor's
                            image button.
                        </div>

                        <h4>Generate image link</h4>

                        <h5>1. Select Image</h5>

                        <div className={"flex-row"}>
                            <input type={"file"} onChange={imageOnChange}/>
                        </div>

                        <h5>2. Copy Link</h5>

                        {!generatedLink && <div>
                            No image selected
                        </div>}

                        {generatedLink && <div className={"flex-row"}>
                            <a href={generatedLink}>{generatedLink}</a>

                            <IconButton>
                                <FileCopyOutlined onClick={copyToClipboardOnClick}/>
                            </IconButton>
                        </div>}

                        <div className={"flex-row"}>
                            <TextField
                                label={"Subject"}
                                variant={"outlined"}
                                color={"primary"}
                                fullWidth
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        <div className={"flex-row"}>
                            <TextField
                                label={"Reply to"}
                                variant={"outlined"}
                                color={"primary"}
                                fullWidth
                                value={replyTo}
                                onChange={(e) => setReplyTo(e.target.value)}
                            />
                        </div> */}
                        <Editor value={rtRelease}  onChange={onChange2} />
                        

                        {/* <RichTextEditor  /> */}
                    </div>
                </div>
            }

            return <div key={index} className={styles.optionWrapper}>
                <h4>You can select multiple files at once in the upload window.</h4>
                <input type={"file"} multiple onChange={onChange}/>
            </div>
        },
        "date": (option: StepOption, index) => {
            let onChange: (event: any) => void = (event: any) => {
                storeInState(option.id, event.target.value, option);
            };

            return <div key={index} className={styles.optionWrapper}>
                <TextField type={"input"} label={option.metaDescription} variant={"outlined"} onChange={onChange}/>
            </div>
        },
        "basketReview": (option: StepOption, index) => { // TODO Finish
            return <div key={index}>
                <BasketComponent data={data} selectedPackage={selectedPackage}/>
            </div>
        },
        "audience-location-regional-name": (option: StepOption, index) => {
            const onChange = (next: any) => {
                setSelectedRegions(next.map((item: any) => item.value));
            }

            const value: { label: string, value: string }[] = selectedRegions.map(region => ({
                label: region,
                value: region
            }));

            return <div key={index} style={{width: "90%", maxWidth: "350px"}}>
                <Select isMulti value={value} onChange={onChange}
                        options={regions.map(region => ({label: region, value: region}))}/>
            </div>
        },
        "publicationSelect": (option: StepOption, index) => {
            const onChange = (event: any) => {
                const next = event as { label: string, value: string }[];
                setSelectedOutlets(next.map(e => e.value));
            }

            if (option.id) {
                const value = publicationsToIgnore.filter(outlet => selectedOutlets.includes(outlet)).map(outlet => {
                    return {
                        label: outlet,
                        value: outlet
                    }
                });

                return <div key={index} style={{width: "90%", maxWidth: "350px"}}>
                    <Select isMulti value={value} onChange={onChange}
                            options={publicationsToIgnore.map(outlet => ({label: outlet, value: outlet}))}/>
                </div>
            }

            return <></>
        }

    }


    return <div className={classNames(styles.wrapper, previousStep && styles.previousStep)}>
        <span className={styles.stepTitle}>{step.title}</span>
        <h3>{step.description} {step.tooltip &&
        <Tooltip enterTouchDelay={0} leaveTouchDelay={3000} title={step.tooltip}>
            <HelpOutline/>
        </Tooltip>}</h3>
        {step.options.map((option, index) => renderConfig[option.type](option, index))}
        {loading && <LinearProgress style={{marginTop: "20px"}}/>}
    </div>
}

function textToClipboard(text: string) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}
