import React, {useContext, useEffect, useState} from "react";
import styles from "./styles.module.css";
import recipe, {step0, step10_1, step2_1} from "./recipe";
import {StepComponent} from "./StepComponent/StepComponent";
import {Package, Step} from "./types";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Hidden,
    IconButton,
    LinearProgress,
    Modal,
    Typography
} from "@material-ui/core";
import {BasketComponent} from "./BasketComponent/BasketComponent";
import {ArrowBack, Close, KeyboardArrowUp} from "@material-ui/icons";
import {cmsLogin, getOutlets, getPublicationsToIgnore, getRegions, notifyEmailEntry, registerNew} from "../../app/api";
import {toast} from "react-toastify";
import Cookies from "js-cookie";
import UserContext from "../../Context/UserContext";
import {UserMapper} from "../../types/user";
import {useHistory} from "react-router-dom";
import {backConfirm, confirm} from "./helpers";
import {Outlet, OutletMapper} from "../../types/outlet";
import RichTextEditor, {EditorValue} from "react-rte";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import stripeConfig from "../../config/stripe";
import {Journalist} from "../../types/journalist";


export interface JournalistFilterValues {
    sectors: string[],
    outlets: string[],
    outletTypes: string[],
    jobTitles: string[]
}

export default function StepsComponent() {
    const [previousStep, setPreviousStep] = useState(recipe as Step);
    const [currentStep, setCurrentStep] = useState(recipe as Step);
    const [data, setData] = useState({} as any);
    const [conditions, setConditions] = useState({}); // For storing the checked state of deterministic checkboxes
    const [files, setFiles] = useState([] as File[]);
    const [release, setRelease] = useState<null | File>(null);
    const [supportingMaterial, setSupportingMaterial] = useState<File[]>([]);
    const [selectedPackage, setSelectedPackage] = useState({} as Package);

    const stripePromise = loadStripe(stripeConfig.testKey);

    const [stepHistory] = useState([recipe] as Step[]);

    const [progress, setProgress] = useState(0);

    const [notified, setNotified] = useState(false);

    const [offerModalOpen, setOfferModalOpen] = useState(false);

    const [outlets, setOutlets] = useState<Outlet[]>([]);

    const {user} = useContext(UserContext);
    const history = useHistory();

    const [selectedOutlets, setSelectedOutlets] = useState<string[]>([]);

    const [journalistFilterValues, setJournalistFilterValues] = useState<JournalistFilterValues>({
        jobTitles: [], outletTypes: [], outlets: [], sectors: []
    });

    const [result, setResult] = useState<{
        journalists: Journalist[],
        journalistCount: number,
        sectors: string[],
        outlets: string[],
        jobTitles: string[],
        outletTypes: string[],
        totalCount: number
    }>({journalists: [], journalistCount: 0, sectors: [], outlets: [], jobTitles: [], outletTypes: [], totalCount: 0});
    const [audienceResultLoading, setAudienceResultLoading] = useState(false);

    const [rtRelease, setRtRelease] = useState<string>('');
    const [subject, setSubject] = useState("");
    const [replyTo, setReplyTo] = useState("");

    const [publicationsToIgnore, setPublicationsToIgnore] = useState<string[]>([]);
    const [filters, setFilters] = useState<any | null>(null);

    const [regions, setRegions] = useState<string[]>([]);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

    const [journalistsToRemove, setJournalistsToRemove] = useState<Journalist[]>([]);

    useEffect(() => {
        getOutlets().then(data => {
            const outlets = data && data.map((d: any) => OutletMapper(d));
            setOutlets(outlets);
        });

        getPublicationsToIgnore(filters || {sectors: [], outlets: [], outletTypes: [], jobTitles: []}).then(data => {
            setPublicationsToIgnore(data);
        });

        getRegions().then(data => {
            if (data && data.length > 0)
                setRegions(data?.filter((region: string) => Boolean(region)));
        });
    }, []);

    // TODO: refactor
    // This skips the first couple of steps
    const packageId = Number(localStorage.getItem("selected_package"));
    const selectedProduct = JSON.parse(localStorage.getItem("selected_product") || "{}" );
    if (packageId || selectedProduct) {
        const option: any = step0.options.find(o => o.type === "group")?.group?.find(p => p.packageId === packageId);

        if (option) {
            const temp = {...data};

            const stepId = "press-release-plan-selection";
            const optionId = "selected-package";

            if (!temp[stepId]) {
                temp[stepId] = {
                    metaDescription: "Services you require."
                };
            }

            temp[stepId][optionId] = {
                value: true,
                metaDescription: selectedProduct.name || option.metaDescription
            }

            setData(temp);

            if (packageId === 6) {
                setCurrentStep(step10_1);
            } else {
                setCurrentStep(step2_1);
            }

            setSelectedPackage(new class implements Package {
                cost: number = Number(selectedProduct?.price.substring(1));
                id: number = Number(option?.packageId);
                name: string = String(option?.text);
                stripeId = selectedProduct.stripeId;
            });
        }

    }

    localStorage.removeItem("selected_package");

    useEffect(() => {
        window.scrollTo(0, 0);

        window.addEventListener("beforeunload", confirm);
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = backConfirm;

        if (!user || !user.subscription) {
            setOfferModalOpen(true);
        }

        return () => {
            window.removeEventListener("beforeunload", confirm);
            window.onpopstate = () => {
            }
        }
    }, []);

    const previous = () => {
        const step = stepHistory.pop();

        if (step) {
            setPreviousStep(stepHistory[stepHistory.length - 1]);
            setCurrentStep(step);
        }
    }

    const nextStep = (step: Step) => {
        if (user && !notified) {
            setNotified(true);
            notifyEmailEntry({user: user?.id}).then(() => {
            });
        }

        // Turn step history into a stack
        stepHistory.push(currentStep);
        setPreviousStep(currentStep);
        setCurrentStep(step);

        if (step.progress) {
            setProgress(step.progress);
        }
    };

    const updateData = (d: any) => {
        setData(d);
    }

    const updateConditions = (c: any) => {
        setConditions(c);
    }

    const addFiles = (f: FileList) => {
        const temp = files.slice();
        for (let i = 0; i < f.length; i++) {
            temp.push(f[i]);
        }

        setFiles(temp);
    }

    const updatePackage = (p: Package) => {
        setSelectedPackage(p);
    }

    const signupUser = async () => {
        const username = data["signup-step"]["usernameInput"].value;
        const password = data["signup-step"]["passwordInput"].value;
        const name = data["about-you-step"]["name"].value;
        const website = data["about-you-step"]["site"]?.value;
        const email = data["email-collect-step"]["emailInput"].value;

        delete data["signup-step"]["passwordInput"];

        // TODO: refactor for use with CMS
        registerNew({
            username: username,
            password: password,
            name: name,
            website: website,
            email: email
        }).then(async (res: any) => {
            if (!res || res.error) {
                toast("Something went wrong. Please try again.", {type: "error"});
            } else {
                toast("Successfully registered!", {type: "success"});
                cmsLogin(username, password).then(res => {
                    Cookies.set("token", res.jwt);

                    const user = UserMapper(res.user);
                    Cookies.set("user", user);
                });
            }
        });
    }

    return <Elements stripe={stripePromise}>
            <div className={styles.wrapper}>
            <Modal
                open={offerModalOpen}
                onClose={() => setOfferModalOpen(false)}
            >
                <div className={styles.modalWrapper}>
                    <Card>
                        <CardHeader title={"Subscription Offer"}
                                    action={<IconButton onClick={() => setOfferModalOpen(false)}><Close/></IconButton>}/>
                        <CardContent>
                            <h3>Subscribe today and get</h3>

                            <ul>
                                <li>10% off this and all future orders for the duration of your subscription</li>
                            </ul>

                            <Button variant={"contained"} color={"primary"} fullWidth id={"ga-subscription-offer"}
                                    onClick={() => history.push("/signup")}>Signup</Button>
                        </CardContent>
                    </Card>
                </div>
            </Modal>

            {previousStep && stepHistory.length > 1 && <div className={styles.backButton}>
                <IconButton onClick={() => previous()}>
                    <ArrowBack style={{margin: "auto"}}/>
                    <span>Previous Step</span>
                </IconButton>
            </div>}

            <Grid container>
                <Grid item xs={12} md={8}>
                    {!currentStep.hidePreviousSteps && <Hidden only={["xs", "sm"]}>
                        <div className={styles.previousStepWrapper}>
                            <StepComponent
                                key={previousStep.id}
                                previousStep={true}
                                step={previousStep}
                                nextStep={nextStep}
                                updateData={updateData}
                                data={data}
                                conditions={conditions}
                                updateConditions={updateConditions}
                                files={files}
                                addFiles={addFiles}
                                selectedPackage={selectedPackage}
                                updatePackage={updatePackage}
                                signupUser={signupUser}
                                setRelease={setRelease}
                                setSupportingMaterial={setSupportingMaterial}
                                release={release}
                                supportingMaterial={supportingMaterial}
                                setJournalistFilterValues={setJournalistFilterValues}
                                journalistFilterValues={journalistFilterValues}
                                result={result}
                                setResult={setResult}
                                setAudienceResultLoading={setAudienceResultLoading}
                                outlets={outlets}
                                selectedOutlets={selectedOutlets}
                                setSelectedOutlets={setSelectedOutlets}
                                rtRelease={rtRelease}
                                setRtRelease={setRtRelease}
                                replyTo={replyTo}
                                setReplyTo={setReplyTo}
                                subject={subject}
                                setSubject={setSubject}
                                filters={filters}
                                setFilters={setFilters}
                                publicationsToIgnore={publicationsToIgnore}
                                regions={regions}
                                selectedRegions={selectedRegions}
                                setSelectedRegions={setSelectedRegions}
                                audienceResultLoading={audienceResultLoading}
                                journalistsToRemove={journalistsToRemove}
                                setJournalistsToRemove={setJournalistsToRemove}
                            />
                        </div>
                    </Hidden>}

                    <Hidden only={['md', 'lg', 'xl']}>
                        <div className={styles.mobileBackArrow}>
                            <IconButton>
                                <KeyboardArrowUp onClick={previous}/>
                            </IconButton>
                        </div>
                    </Hidden>

                    <StepComponent
                        key={currentStep.id}
                        step={currentStep}
                        nextStep={nextStep}
                        data={data}
                        updateData={updateData}
                        conditions={conditions}
                        updateConditions={updateConditions}
                        files={files}
                        addFiles={addFiles}
                        selectedPackage={selectedPackage}
                        updatePackage={updatePackage}
                        signupUser={signupUser}
                        setRelease={setRelease}
                        setSupportingMaterial={setSupportingMaterial}
                        release={release}
                        supportingMaterial={supportingMaterial}
                        setJournalistFilterValues={setJournalistFilterValues}
                        journalistFilterValues={journalistFilterValues}
                        result={result}
                        setResult={setResult}
                        setAudienceResultLoading={setAudienceResultLoading}
                        outlets={outlets}
                        selectedOutlets={selectedOutlets}
                        setSelectedOutlets={setSelectedOutlets}
                        rtRelease={rtRelease}
                        setRtRelease={setRtRelease}
                        replyTo={replyTo}
                        setReplyTo={setReplyTo}
                        subject={subject}
                        setSubject={setSubject}
                        filters={filters}
                        setFilters={setFilters}
                        publicationsToIgnore={publicationsToIgnore}
                        regions={regions}
                        selectedRegions={selectedRegions}
                        setSelectedRegions={setSelectedRegions}
                        audienceResultLoading={audienceResultLoading}
                        journalistsToRemove={journalistsToRemove}
                        setJournalistsToRemove={setJournalistsToRemove}
                    />

                    {!currentStep.hidePreviousSteps && <div className={styles.progressBar}>
                        <Box display={"flex"} alignItems={"center"}>
                            <Box width={"100%"} mr={1}>
                                <LinearProgress value={progress} variant={"determinate"} color={"secondary"}/>
                            </Box>
                            <Box minWidth={35}>
                                <Typography variant="body2" color="textSecondary">{`${Math.round(
                                    progress,
                                )}%`}</Typography>
                            </Box>
                        </Box>
                    </div>}
                </Grid>

                <Grid item xs={12} md={4}>
                    <Hidden only={['xs', 'sm']}>
                        <div className={"margin-v-md"}>
                            <div className={styles.basketWrapper}>
                                {!currentStep.hideBasket &&
                                <BasketComponent data={data} selectedPackage={selectedPackage}/>}
                            </div>

                            <div>
                                {!currentStep.hideBasket && <div style={{width: "218px"}}>
                                    <h4>Your potential audience</h4>

                                    {audienceResultLoading && <div style={{marginTop: "50px"}}>
                                        <LinearProgress/>
                                    </div>}

                                    {result.journalistCount === 0 && !audienceResultLoading && <div>
                                        No results
                                    </div>}

                                    {result.journalistCount > 0 && !audienceResultLoading && <Grid item xs={12}>
                                        <h4>{result.totalCount - journalistsToRemove.length} Journalists reached.</h4>

                                        {result.sectors.length > 0 && <div>
                                            <h4>In {result.sectors.length} Sectors:</h4>

                                            <ul>
                                                {result.sectors.map(sector => <li>{sector}</li>)}
                                            </ul>
                                        </div>}

                                        {result.outlets.length > 0 && <div>
                                            <h4>Featuring publications such as:</h4>

                                            <ul>
                                                {result.outlets.map(outlet => <li>{outlet}</li>)}
                                            </ul>
                                        </div>}

                                        {result.jobTitles.length > 0 && <div>
                                            <h4>Featuring job titles such as:</h4>

                                            <ul>
                                                {result.jobTitles.map(jobTitle => <li>{jobTitle}</li>)}
                                            </ul>
                                        </div>}

                                        {result.outletTypes.length > 0 && <div>
                                            <h4>Featuring outlet types such as:</h4>

                                            <ul>
                                                {result.outletTypes.map(outletType => <li>{outletType}</li>)}
                                            </ul>
                                        </div>}
                                    </Grid>}


                                </div>}
                            </div>
                        </div>
                    </Hidden>
                </Grid>
            </Grid>

        </div>
    </Elements>
}
