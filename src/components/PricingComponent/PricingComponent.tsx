import React, {useEffect, useState} from 'react';
import classnames from 'classnames';
import styles from './styles.module.css';
import {PackageGroup, PackageGroupMapper} from "./types";
import PlanGroupComponent from "./PlanGroupComponent/PlanGroupComponent";
import {LandingBanner, LandingBannerMapper} from "../Cms/types";
import LandingBannerComponent from "../Cms/LandingBanner/LandingBannerComponent";
import { Button, Tooltip, useMediaQuery } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';

export default function PricingComponent() {
    const isMobile = useMediaQuery('(max-width: 1000px)');
    const [cms, setCms] = useState<any>();
    const [packages, setPackages] = useState<PackageGroup[]>([]);
    const [landingBanner, setLandingBanner] = useState<LandingBanner | null>(null);
    const [landing, setLanding] = useState(false);
    const [pricingPlanMonthly, setPricingPlanMonthly] = useState(true);

    useEffect(() => {

    }, []);

    useEffect(() => {
        try {
            fetch(`${process.env.REACT_APP_CMS_URL}/pricing-page`, {
                method: "GET"
            }).then(response => {
                return response.json();
            }).then(data => {
                setCms(data);
                console.log(data);
                setLandingBanner(LandingBannerMapper(data.landingBanner));
                setLanding(data.landing);
            });

            fetch(`${process.env.REACT_APP_CMS_URL}/package-groups`, {
                method: "GET"
            }).then(response => {
                return response.json();
            }).then(data => {
                if (isMobile) {
                    setPackages(data.map(PackageGroupMapper));
                } else {
                    setPackages(data.map(PackageGroupMapper).reverse());
                }
            });
        } catch (e) {
            console.error(e);
        }
    }, [isMobile]);
    const getPackageFeatures = (servicePackage: any[]) => {
        try {
            return servicePackage.filter(p => p.Active)[0]?.packages[0]?.features || []
        } catch (e) {
            return [];
        }
    };

    return (
        <div style={{paddingBottom: "100px", paddingTop: !landing ? "100px" : ""}}>
            {landingBanner && landing && <LandingBannerComponent banner={landingBanner}/>}

            <h1 className={classnames(styles.title, styles.topTitle)}>
                {cms?.title}
            </h1>
            <h2 className={styles.subTitle}>
                {cms?.subtitle}
            </h2>
            <div className={styles.billingCycleSwitch}>
                <Button
                    className={styles.billingCycleSwitch__button}
                    onClick={() => setPricingPlanMonthly(true)}
                    variant={pricingPlanMonthly ? "contained" : "outlined"}
                    color={"primary"}
                >Monthly
                </Button>
                <Button
                    className={styles.billingCycleSwitch__button}
                    onClick={() => setPricingPlanMonthly(false)}
                    variant={!pricingPlanMonthly ? "contained" : "outlined"}
                    color={"primary"}
                >Annual (2 months free)
                </Button>
            </div>
            <div className={styles.packages}>
                <div className={styles.planGroup}>
                    <div className={styles.planWrapper}>
                        {getPackageFeatures(packages).map((p: any) => (
                            <div key={p.text} className={styles.planFeature}>
                                <b>{p.text} {p.text === "Media Pack Hosting" && <i className={styles.comingSoon}>Coming soon.</i>}</b>
                                <Tooltip title={p.tooltip} enterTouchDelay={0} leaveTouchDelay={3000}>
                                    <div className={styles.moreInfoWrapper}>
                                        <HelpOutline fontSize="inherit" className={styles.moreInfo}/>
                                    </div>
                                </Tooltip>
                            </div>
                        ))}
                    </div>
                </div>
                <PlanGroupComponent packages={packages} selectedBillingCycle={pricingPlanMonthly} />
            </div>
        </div>
    );
}
