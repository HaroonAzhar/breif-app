import React, {useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import SectionComponent from "./Cms/Section/SectionComponent";
import {Section, SectionMapper} from "./Cms/types";

export const LandingPageRework = () => {
    const [sections, setSections] = useState<Section[]>([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_CMS_URL}/landing-page`, {
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(data => {

            if (data.Sections) {
                setSections(data.Sections.map(SectionMapper));
            }
        });

    }, []);

    return <div style={{paddingBottom: "100px"}}>
        <div className={"page"} style={{background: "#FF5757"}}>
            <div className={"content"} style={{width: "90%", display: "inline-block"}}>
                <div className={"flex-row flex-wrap"}>
                    <div className={"margin-v-md mobile-full-width"} style={{width: "40%"}}>
                        <h1 style={{textAlign: "left", color: "white", fontWeight: "bold"}}>PR tools designed for small and busy businesses</h1>
                        <h3 style={{textAlign: "left", color: "white"}}>Press releases, powered by journalists. Smart distribution. Pay-as-you-go.</h3>

                        <div className={"flex-row flex-wrap mobile-no-h-margin margin-h-md margin-v-md"}>
                            <div>
                                <Button
                                    style={{padding: "25px", width: "200px"}}
                                    color={"primary"}
                                    variant={"contained"}
                                    href={"/signup"}
                                >
                                    Sign up
                                </Button>
                            </div>

                            <div>
                                <Button
                                    style={{padding: "25px", width: "200px"}}
                                    color={"primary"}
                                    variant={"contained"}
                                    href={"/form"}
                                >
                                    Start a release
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className={"flex-row justify-end mobile-full-width"} style={{width: "60%"}}>
                        <img alt={"Hero"} width={1000} src={"/briefecwc.jpeg"} className={"mobile-full-width"}/>
                    </div>
                </div>
            </div>
        </div>

        {sections.map((section, index) => <SectionComponent landing={true} key={index} section={section}/>)}
    </div>
}

export default LandingPageRework;
