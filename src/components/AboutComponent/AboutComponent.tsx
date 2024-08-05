import React, {useEffect, useState} from 'react';
import styles from './styles.module.css';
import {
    HorizontalLayout,
    HorizontalLayoutMapper,
    LandingBanner,
    LandingBannerMapper,
    Section,
    SectionMapper
} from "../Cms/types";
import SectionComponent from "../Cms/Section/SectionComponent";
import LandingBannerComponent from "../Cms/LandingBanner/LandingBannerComponent";
import {HorizontalLayoutComponent} from "../Cms/HorizontalLayout";

export default function AboutComponent() {
    const [sections, setSections] = useState<Section[]>([]);
    const [landingBanner, setLandingBanner] = useState<LandingBanner | null>(null);
    const [landing, setLanding] = useState(false);
    const [horizontalLayout, setHorizontalLayout] = useState<HorizontalLayout | null>(null);
    const [horizontalLayoutEnabled, setHorizontalLayoutEnabled] = useState(false);

    useEffect(() => {

    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_CMS_URL}/how-it-works`, {
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(data => {
            setLandingBanner(LandingBannerMapper(data.landingBanner));
            setSections(data.Sections.map(SectionMapper));
            setLanding(data.landing);
            setHorizontalLayout(HorizontalLayoutMapper(data.horizontalLayout));
            setHorizontalLayoutEnabled(data.horizontalLayoutEnabled);
        });
    }, []);

    return (
        <div style={{paddingBottom: "100px", paddingTop: !landing ? "100px" : ""}}>
            {landingBanner && landing && <LandingBannerComponent banner={landingBanner}/>}

            {horizontalLayout && horizontalLayoutEnabled && <HorizontalLayoutComponent horizontalLayout={horizontalLayout}/>}

            {sections.map((section, index) => <SectionComponent landing={true} key={index} section={section}/>)}
        </div>
    );
}
