import React, {useEffect, useState} from 'react';
import {HorizontalLayout, HorizontalLayoutMapper, Section, SectionMapper} from "../Cms/types";
import SectionComponent from "../Cms/Section/SectionComponent";
import LandingBannerComponent from "../Cms/LandingBanner/LandingBannerComponent";
import {HorizontalLayoutComponent} from "../Cms/HorizontalLayout";

export default function IntroComponent() {
    const [cms, setCms] = useState<any>();
    const [sections, setSections] = useState<Section[]>([]);
    const [horizontalLayout, setHorizontalLayout] = useState<HorizontalLayout | null>(null);
    const [horizontalLayoutEnabled, setHorizontalLayoutEnabled] = useState(false);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_CMS_URL}/landing-page`, {
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(data => {
            setCms(data);

            if (data.Sections) {
                setSections(data.Sections.map(SectionMapper));
            }

            setHorizontalLayout(HorizontalLayoutMapper(data.horizontalLayout));
            setHorizontalLayoutEnabled(data.horizontalLayoutEnabled);
        });

    }, []);

    return (
        <div style={{paddingBottom: "100px"}}>
            {cms && <LandingBannerComponent banner={cms.bannerImage ? {
                ...cms,
                bannerImage: cms.bannerImage?.url
            } : cms}/>}

            {horizontalLayout && horizontalLayoutEnabled && <HorizontalLayoutComponent horizontalLayout={horizontalLayout}/>}

            {sections.map((section, index) => <SectionComponent landing={true} key={index} section={section}/>)}
        </div>
    );
}
