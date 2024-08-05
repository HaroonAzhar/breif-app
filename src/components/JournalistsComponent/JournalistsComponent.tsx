import React, {useEffect, useState} from 'react';
import styles from './styles.module.css';
import {LandingBanner, LandingBannerMapper, Section, SectionMapper} from "../Cms/types";
import SectionComponent from "../Cms/Section/SectionComponent";
import LandingBannerComponent from "../Cms/LandingBanner/LandingBannerComponent";

export default function JournalistsComponent() {
    const [sections, setSections] = useState<Section[]>([]);
    const [landingBanner, setLandingBanner] = useState<LandingBanner | null>(null);
    const [landing, setLanding] = useState(false);

    useEffect(() => {

    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_CMS_URL}/journalists-page`, {
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(data => {
            setSections(data?.Sections.map(SectionMapper));
            setLandingBanner(LandingBannerMapper(data.landingBanner));
            setLanding(data.landing);
        });
    }, []);

    return (
        <div className={styles.wrapper}>
            {landingBanner && landing && <LandingBannerComponent banner={landingBanner}/>}
            {sections.map((section, index) => <SectionComponent landing={false} section={section} key={index}/>)}
        </div>
    );
}
