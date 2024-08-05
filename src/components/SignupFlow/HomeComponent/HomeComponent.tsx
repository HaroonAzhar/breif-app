import React, {useEffect, useState} from "react";
import LandingBannerComponent from "../../Cms/LandingBanner/LandingBannerComponent";
import SectionComponent from "../../Cms/Section/SectionComponent";
import {Section, SectionMapper} from "../../Cms/types";

const HomeComponent = () => {
    const [cms, setCms] = useState<any>();
    const [sections, setSections] = useState<Section[]>([]);

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
        });
    }, []);

    useEffect(() => {

    }, []);

    return (
        <div>
            {cms && <LandingBannerComponent banner={{
                ...cms,
                landingButton: {link: "/sign-up-free", text: "Sign up for FREE to access our tools"}
            }}/>}

            {sections.map((section, index) => <SectionComponent landing={true} key={index} section={section}/>)}
        </div>
    );
}

export default HomeComponent;
