import React, {useContext, useState, useEffect} from "react";
import styles from "./styles.module.css";
import classnames from "classnames";
import classNames from "classnames";
import { Button, Tooltip, useMediaQuery } from "@material-ui/core";
import { PackageGroup } from "../types";
import { HelpOutline } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import UserContext from "../../../Context/UserContext";
import { FULL_SERVICE_PRESS_RELEASE } from "../../../constants";
import Carousel from "react-material-ui-carousel";

interface PlanGroupProps {
    packages: PackageGroup[],
    hideButtons?: boolean,
    customHeader?: string,
    selectedBillingCycle?: boolean
};

const PlanGroupComponent = ({
    packages,
    hideButtons = false,
    customHeader,
    selectedBillingCycle
}: PlanGroupProps) => {
    const isMobile = useMediaQuery('(max-width: 1000px)');
    const history = useHistory();
    const [freePackage, setFreePackage] = useState<any>({});
    const {user} = useContext(UserContext);
    const isFullServicePro = (name: string, packageName: string) => name.includes(FULL_SERVICE_PRESS_RELEASE) && packageName.includes("Pro");
    const isSendOnlyServicePro = (name: string, packageName: string) => name.includes("Press Release Send Only") && packageName.includes("Pro");
    useEffect(() => {
        findFreePackage()
    }, [packages]);
    const selectPackage = (selected: any) => {
        if (!selectedBillingCycle) {
                const pack = { ...selected[1], price: '£' + parseInt(selected[1].price) * 12, cycle: "Annual"  };
                console.log("pack 2 3 4 5", pack, selected[1])
                localStorage.setItem("selected_package", JSON.stringify(pack));
                history.push(selected[0].redirectPath);
            return;
        }
        setTimeout(() => {
            const pack = { ...selected[0], cycle: "a month"  };
            localStorage.setItem("selected_package", JSON.stringify(pack));
            history.push(selected[0].redirectPath);
        }, 500)
    };
    const planFeature = (included: boolean, name: string, tooltip: string, price: string, packageName: string) => {
        const keys = [FULL_SERVICE_PRESS_RELEASE, 'Press Release', 'Add-On Journalist Briefing', 'Press Release Writing', 'Press Release Writing Only', 'Press Release Send Only'];
        return <span className={classNames(styles.planFeature, included && styles.included)}> 
            {isFullServicePro(name, packageName) && <>
                    <div>
                        <div className={styles.freeServiceInPro}>1 FREE / month </div>
                    </div>
                </>
            }

            {isSendOnlyServicePro(name, packageName) && <>
                    <div>
                      <div className={styles.freeServiceInPro}>1 FREE / month </div> 
                    </div>
                </>
            }
            {(keys.some(k => k === name) && price)
            ? (
                <span className={styles.priceBold}>
                    {isFullServicePro(name, packageName) && <span className={styles.freeServiceInPro}>then </span>}
                    {isSendOnlyServicePro(name, packageName) && <span className={styles.freeServiceInPro}>then </span>}
                    {(packageName.includes("Pro") && name === "Press Release Send Only") && <del>£99</del>}
                    {(packageName !== "Free user" && keys.some(k => k === name)) && <del>{freePackage[name]}</del>}{" "}
                    {price}
                </span>
            ): <i className="material-icons"/>
            }
                            {/* <b>{name}</b> */}
            {included && <Tooltip title={tooltip} enterTouchDelay={0} leaveTouchDelay={3000}>
                <div className={styles.moreInfoWrapper}>
                    {/* <HelpOutline fontSize="inherit" className={styles.moreInfo}/> */}
                </div>
        
            </Tooltip>}
                 </span>
    }
    const planFeature2 = (included: boolean, name: string, tooltip: string, price: string, packageName: string) => {
        const keys = [FULL_SERVICE_PRESS_RELEASE, 'Press Release', 'Add-On Journalist Briefing', 'Press Release Writing', 'Press Release Writing Only', 'Press Release Send Only'];
        return (
        <div className={styles.mobilePackages}>
            <span className={styles.packageLabel}><span>{name}</span>
            <Tooltip title={tooltip} enterTouchDelay={0} leaveTouchDelay={3000}>
                <div className={styles.moreInfoWrapper}>
                    <HelpOutline fontSize="inherit" className={styles.moreInfo}/>
                </div>
        
            </Tooltip></span>
            {planFeature(included, name, tooltip, price, packageName)}
                 </div>
        )
    }
    const findFreePackage = () => {
        try {
            const freePackage = packages.find(p => p.name === "Free");
            const feat: any = {};
            freePackage?.packages[0].features.forEach((k) => {
                feat[k.text] = k.price;
            })
            setFreePackage(feat);

        } catch (e) {
            console.log("error", e);
        }
    }

    return (
        <div className={styles.pricingWrapper}>
            {isMobile ? <Carousel animation="slide" navButtonsAlwaysVisible={true} autoPlay={false} cycleNavigation={false} indicatorContainerProps={{style: {position: "absolute", top: 0}}}>
                {packages.filter(p => p.Active).map(pg =>
                (
                    <div className={styles.planGroup} style={{ marginTop: 50 }}>
                        <p>{customHeader ? customHeader : pg.name}</p>

                        {/* {pg.infoText && <div className={styles.infoText}>
                            <span>{pg.infoText}</span>
                        </div>} */}

                        {<div className={classnames(styles.planWrapper, styles.selected)}>

                            {/* <img src={p.image} alt={"Icon"}/> */}
                            <div className={styles.planHeader}>
                                {/* <span className={styles.planName}>{p.name}</span> */}
                                {selectedBillingCycle ? (
                                    <div className={styles.price}>
                                        <span className={styles.planPriceMonthly}>{pg.packages[0].price}<span className={styles.smallFont}>/month</span></span>
                                        <span className={styles.planDescription}>{pg.packages[0].subtitle}</span>
                                    </div>
                                ) : (
                                    <div className={styles.price}>
                                        {pg.packages[1] && <span className={styles.planPriceMonthly}>&pound;{pg.packages[1]?.price}<span className={styles.smallFont}>/month Annual</span></span>}
                                        {pg.packages[1] && <span className={styles.planDescription}>{pg.packages[1]?.subtitle}</span>}
                                    </div>
                                )}
                                <div className={styles.price}>
                                    <span className={styles.planName}>{pg.infoText}</span>
                                </div>
                            </div>

                            <div className={classNames(styles.planFeatures, styles.desktop)}>
                                {pg.packages[0].features.map(f => planFeature(f.has, f.text, f.tooltip, f.price, pg.packages[0].name))}
                            </div>
                            <div className={classNames(styles.planFeatures, styles.mobile)}>
                                {pg.packages[0].features.map(f => planFeature2(f.has, f.text, f.tooltip, f.price, pg.packages[0].name))}
                            </div>

                            <div className={styles.bottomButton}>
                                {!hideButtons && <Button onClick={() => selectPackage(pg.packages)}
                                    variant="outlined" color="primary">Choose</Button>}
                            </div>
                        </div>}
                    </div>
                ))}
            </Carousel> : (<>
                {packages.filter(p => p.Active).map(pg =>
                (
                    <div className={styles.planGroup} style={{ marginTop: 20 }}>
                        <p>{customHeader ? customHeader : pg.name}</p>

                        {/* {pg.infoText && <div className={styles.infoText}>
                                <span>{pg.infoText}</span>
                            </div>} */}

                        {<div className={classnames(styles.planWrapper, styles.selected)}>

                            {/* <img src={p.image} alt={"Icon"}/> */}
                            <div className={styles.planHeader}>
                                {/* <span className={styles.planName}>{p.name}</span> */}
                                {selectedBillingCycle ? (
                                    <div className={styles.price}>
                                        <span className={styles.planPriceMonthly}>{pg.packages[0].price}<span className={styles.smallFont}>/month</span></span>
                                        <span className={styles.planDescription}>{pg.packages[0].subtitle}</span>
                                    </div>
                                ) : (
                                    <div className={styles.price}>
                                        {pg.packages[1] && <span className={styles.planPriceMonthly}>&pound;{pg.packages[1]?.price}<span className={styles.smallFont}>/month Annual</span></span>}
                                        {pg.packages[1] && <span className={styles.planDescription}>{pg.packages[1]?.subtitle}</span>}
                                    </div>
                                )}
                                <div className={styles.price}>
                                    <span className={styles.planName}>{pg.infoText}</span>
                                </div>
                            </div>

                            <div className={classNames(styles.planFeatures, styles.desktop)}>
                                {pg.packages[0].features.map(f => planFeature(f.has, f.text, f.tooltip, f.price, pg.packages[0].name))}
                            </div>
                            <div className={classNames(styles.planFeatures, styles.mobile)}>
                                {pg.packages[0].features.map(f => planFeature2(f.has, f.text, f.tooltip, f.price, pg.packages[0].name))}
                            </div>

                            <div className={styles.bottomButton}>
                                {!hideButtons && <Button onClick={() => selectPackage(pg.packages)}
                                    variant="outlined" color="primary">Choose</Button>}
                            </div>
                        </div>}
                    </div>
                ))}
            </>)}
        </div>
    )
}

export default PlanGroupComponent;
