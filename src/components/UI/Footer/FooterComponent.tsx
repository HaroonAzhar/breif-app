import React from "react";
import styles from "./styles.module.css";
import {Grid} from "@material-ui/core";
// @ts-ignore
import {SocialIcon} from 'react-social-icons';
import {useLocation} from "react-router-dom";
import LazyLoad from "react-lazyload";

export function FooterComponent() {
    const location = useLocation();

    return <div className="hide" style={location.pathname.includes("dashboard") ? {display: "none"} : {}}>
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <Grid container spacing={10}>
                    <Grid item xs={12} md={3}>
                        <LazyLoad>
                            <img className={styles.logo} alt="Logo" src="/static/media/logo.e48fe700.png"/>
                        </LazyLoad>


                        <LazyLoad>
                            <div className={styles.socialsWrapper}>
                                <div className={styles.socialWrapper}>
                                    <SocialIcon url="https://twitter.com/wearebrief" bgColor="#ffffff"/>
                                </div>
                                <div className={styles.socialWrapper}>
                                    <SocialIcon url="https://www.instagram.com/wearebrief/" bgColor="#ffffff"/>
                                </div>
                                <div className={styles.socialWrapper}>
                                    <SocialIcon url="https://www.facebook.com/wearebrief/" bgColor="#ffffff"/>
                                </div>
                                <div className={styles.socialWrapper}>
                                    <SocialIcon url="https://www.linkedin.com/company/65583681/" bgColor="#ffffff"/>
                                </div>
                            </div>
                        </LazyLoad>

                    </Grid>
                    <Grid item xs={12} md={3}>
                        <p className={styles.itemHeader}>Support</p>
                        <p className={styles.itemOption}><a href={"https://brief.app/contact-us"}>Contact Us</a></p>
                        <p className={styles.itemOption}><a href={"https://brief.app/legal/disclaimer"}>Disclaimer</a>
                        </p>
                        <p className={styles.itemOption}><a href={"https://brief.app/legal/tos"}>Terms of Service</a>
                        </p>
                        <p className={styles.itemOption}><a href={"https://brief.app/legal/privacy"}>Privacy and
                            Cookie policy</a></p>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <p className={styles.itemHeader}>brief</p>
                        <p className={styles.itemOption}><a href={"https://brief.app/news"}>News</a></p>
                        <p className={styles.itemOption}><a href={"https://brief.app/about"}>About</a></p>
                        <p className={styles.itemOption}><a href={"https://brief.app/journalists"}>Journalists</a></p>
                        <p className={styles.itemOption}><a href={"https://brief.app/pricing"}>Pricing</a></p>
                        <p className={styles.itemOption}><a href={"https://brief.app/faq"}>FAQ</a></p>
                        <p className={styles.itemOption}><a href={"https://brief.app/reviews"}>Reviews</a></p>
                        <p className={styles.itemOption}><a href={"https://brief.app/submit-alert"}>Submit your
                            alert</a></p>
                    </Grid>
                    <Grid item xs={12} md={3}>

                    </Grid>
                </Grid>

                <LazyLoad>
                    <div className="trustpilot-widget" data-locale="en-GB" data-template-id="5419b6a8b0d04a076446a9ad"
                         data-businessunit-id="5f57c7fd82e183000173c4d4" data-style-height="24px"
                         data-style-width="100%"
                         data-theme="dark">
                        <a href="https://uk.trustpilot.com/review/brief.app" target="_blank"
                           rel="noopener noreferrer">Trustpilot</a>
                    </div>
                </LazyLoad>


            </div>
        </div>
    </div>
}
