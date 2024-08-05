import React, {useEffect, useState} from "react";
import styles from './styles.module.css';
import ReCAPTCHA from "react-google-recaptcha";
import {postContactUs} from "../../app/api";
// @ts-ignore
import {SocialIcon} from 'react-social-icons';
import {Button, Grid, TextField} from "@material-ui/core";
import {toast} from "react-toastify";
import LazyLoad from "react-lazyload";

export default function ContactUsComponent(props: any) {
    const [transitioning] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {

    }, []);

    const handleFormSubmission = async (event: any) => {
        if (!email || !firstName || !lastName || !message || !token) {
            return;
        }

        try {
            const response = await postContactUs(email, firstName + " " + lastName, message, token);

            toast("Message sent!", {type: "success"});

            setFirstName("");
            setLastName("");
            setEmail("");
            setMessage("");
        } catch (err) {
            toast("Something went wrong.", {type: "error"});
        }
    }

    const handleFirstNameChange = (event: any) => {
        setFirstName(event.target.value);
    }

    const handleLastNameChange = (event: any) => {
        setLastName(event.target.value);
    }

    const handleEmailChange = (event: any) => {
        setEmail(event.target.value);
    }

    const handleMessageChange = (event: any) => {
        setMessage(event.target.value);
    }

    const handleReCaptchaChange = (token: string | null) => {
        if (token !== null) {
            setToken(token);
        }
    }

    return <div className={styles.wrapper}>
        <Grid container>
            <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                    <h1>Contact Us</h1>
                    {props.location.state && <p>{props.location.state}</p>}
                    <Grid item xs={12}>
                        <TextField
                            variant={"outlined"}
                            fullWidth
                            label={"First name"}
                            onChange={handleFirstNameChange}
                            value={firstName}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            variant={"outlined"}
                            fullWidth
                            label={"Last name"}
                            onChange={handleLastNameChange}
                            value={lastName}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            variant={"outlined"}
                            fullWidth
                            label={"Email"}
                            onChange={handleEmailChange}
                            value={email}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            variant={"outlined"}
                            fullWidth
                            label={"Message"}
                            multiline
                            rows={5}
                            onChange={handleMessageChange}
                            value={message}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <ReCAPTCHA
                            sitekey="6LcYeK8ZAAAAAHQJZ_rOi8gxaTJr78QdJ8tmMWLR"
                            onChange={handleReCaptchaChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            variant={"contained"}
                            color={"primary"}
                            onClick={handleFormSubmission}
                            id={"ga-contact-us-button"}
                            disabled={!email || !firstName || !lastName || !message || !token}
                        >
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
                <Grid container justify={"center"} alignItems={"center"} style={{height: "100%"}}>
                    <h2>Other ways of getting in touch</h2>

                    <Grid item>
                        <LazyLoad>
                            <div className={styles.socialIcons}>
                                <SocialIcon url="https://twitter.com/wearebrief"/>
                                <SocialIcon url="https://www.instagram.com/wearebrief/"/>
                                <SocialIcon url="https://www.facebook.com/wearebrief/"/>
                                <SocialIcon url="https://www.linkedin.com/company/65583681/"/>
                            </div>
                        </LazyLoad>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </div>
}
