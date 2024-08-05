import styles from "./styles.module.css";
import {Page} from "../types";
import React, {useEffect} from "react";
import SectionComponent from "../Section/SectionComponent";
import LandingBannerComponent from "../LandingBanner/LandingBannerComponent";
import {Helmet} from "react-helmet";

const PageComponent = ({page}: { page: Page }) => {
    useEffect(() => {

    }, []);

    return <div className={styles.wrapper}>

        <Helmet>
            {page.title && <title>{page.title}</title>}
            {page.metaDescription && <meta name="description" content={page.metaDescription}/>}
        </Helmet>

        {page.landing && page.landingBanner && <LandingBannerComponent banner={page.landingBanner}/>}

        {page.sections.map((section, index) => <SectionComponent key={index} first={index === 0} section={section}
                                                                 landing={page.landing}/>)}
    </div>
}

export default PageComponent;
