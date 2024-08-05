import React, {lazy, Suspense, useEffect, useState} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';


import {LegalPopup} from './UI/LegalPopup';

import {User} from '../types/user';
import stripeConfig from '../config/stripe';


import {NavBarComponent} from "./UI/NavBar";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";


import {FooterComponent} from "./UI/Footer";


import {ToastContainer} from "react-toastify";
import UserContext from "../Context/UserContext";


import Cookies from "js-cookie";


import styles from "./styles.module.css";


import {Page, PageMapper} from "./Cms/types";
import PageComponent from "./Cms/Page/PageComponent";


import ReactGA from 'react-ga';
import ChatWidget from "@papercups-io/chat-widget";
import "react-datetime/css/react-datetime.css";
import LazyLoad from "react-lazyload";
import LandingPageRework from "./LandingPageRework";


const IntroComponent = lazy(() => import('./IntroComponent/IntroComponent'));
const StepsComponent = lazy(() => import('./StepsComponent/StepsComponent'));
const PricingComponent = lazy(() => import('./PricingComponent/PricingComponent'));
const AboutComponent = lazy(() => import('./AboutComponent/AboutComponent'));
const ContactUsComponent = lazy(() => import('./ContactUs/ContactUsComponent'));
const JournalistsComponent = lazy(() => import('./JournalistsComponent/JournalistsComponent'));
const BlogComponent = lazy(() => import('./BlogComponent/BlogComponent'));
const BlogFullComponent = lazy(() => import('./BlogComponent/BlogFullComponent/BlogFullComponent'));
const NewsComponent = lazy(() => import('./NewsComponent/AllNewsPage/AllNewsPage'));
const NewsDetailComponent = lazy(() => import('./NewsComponent/NewsDetailPage/NewsDetailPage'));
const FaqComponent = lazy(() => import('./FaqComponent/FaqComponent'));
const LoginComponent = lazy(() => import('./User/LoginComponent/LoginComponent'));
const LogoutComponent = lazy(() => import('./User/LogoutComponent/LogoutComponent'));
const SignupComponent = lazy(() => import('./User/SignupComponent/SignupComponent'));
const AccountSettingsComponent = lazy(() => import('./User/AccountComponent/AccountSettingsComponent'));
const AdminComponent = lazy(() => import('./AdminComponent/AdminComponent'));
const ForgotPasswordComponent = lazy(() => import('./User/ForgotPasswordComponent/ForgotPasswordComponent'));
const ForgotPasswordSuccessComponent = lazy(() => import('./User/ForgotPasswordComponent/ForgotPasswordComponent'));
const ResetPasswordComponent = lazy(() => import('./User/ResetPasswordComponent/ResetPasswordComponent'));
const ResetPasswordSuccessComponent = lazy(() => import('./User/ResetPasswordComponent/ResetPasswordComponent'));
const DashboardComponent = lazy(() => import('./DashboardComponent/DashboardComponent'));
const DistributionManagerComponent = lazy(() => import('./AdminComponent/Tools/DistributionMapperComponent/DistributionManagerComponent'));
const SuccessComponent = lazy(() => import('./StepsComponent/SuccessComponent/SuccessComponent'));
const CancelComponent = lazy(() => import('./StepsComponent/CancelComponent/CancelComponent'));
const TOSComponent = lazy(() => import('./Legal/TOSComponent/TOSComponent'));
const DisclaimerComponent = lazy(() => import('./Legal/DisclaimerComponent/DisclaimerComponent'));
const PrivacyComponent = lazy(() => import('./Legal/PrivacyComponent/PrivacyComponent'));
const SignupSuccessComponent = lazy(() => import('./User/SignupComponent/SignupSuccessComponent/SignupSuccessComponent'));
const SignupSubSuccessComponent = lazy(() => import('./User/SignupComponent/SignupSubSuccessComponent/SignupSubSuccessComponent'));
const ReviewsComponent = lazy(() => import('./ReviewsComponent/ReviewsComponent'));
const HomeComponent = lazy(() => import('./SignupFlow/HomeComponent/HomeComponent'));
const SignupFreeSuccessComponent = lazy(() => import('./SignupFlow/SignupFreeSuccessComponent/SignupFreeSuccessComponent'));
const SignupFreeComponent = lazy(() => import('./SignupFlow/SignupFreeComponent/SignupFreeComponent'));
const SendPressReleaseComponent = lazy(() => import('./AdminComponent/Tools/SendPressRelease/SendPressReleaseComponent'));
const SubmitAlertComponent = lazy(() => import('./SubmitAlertComponent/SubmitAlertComponent'));
const UploadReleaseComponent = lazy(() => import('./AdminComponent/Tools/UploadReleaseComponent/UploadReleaseComponent'));
const JournalistUnsubscribeComponent = lazy(() => import('./JournalistUnsubscribeComponent'));
const NewSignupComponent = lazy(() => import('./User/NewSignupComponent/'));



ReactGA.initialize('UA-155603631-1');

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#e63946',
        }
    },
});

// ADD ANY NEW ROUTES OT sitemap-router.jsx FOR THEM TO BE ADDED TO THE SITE MAP

const App = () => {
    const [user, setUser] = useState(null as User | null);
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const token = Cookies.get("token");
        const user = localStorage.getItem("user")

        if (token && user) {
            setUser(JSON.parse(user));

            setLoading(false);
        } else {
            setLoading(false);
        }

        fetch(`${process.env.REACT_APP_CMS_URL}/pages`, {
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(data => {
            if (Array.isArray(data) && mounted) {
                setPages(data.map(PageMapper));
            }
        });

        return () => {
            mounted = false
        };
    }, []);

    const updateUser = (u: User | null) => {
        setUser(u);
    }

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <UserContext.Provider value={{user, setUser: updateUser}}>
            <ThemeProvider theme={theme}>

                    <Suspense fallback={() => <p>Loading</p>}>
                        <Router>
                            <NavBarComponent/>
                            <ToastContainer/>
                            <LegalPopup/>
                            <div className={styles.content}>

                                <Switch>
                                    <Route exact path='/' component={IntroComponent}/>

                                        <Route exact path='/form/success/:orderId' component={SuccessComponent}/>
                                        <Route exact path='/form/cancel' component={CancelComponent}/>
                                        <Route path='/form' component={StepsComponent}/>
                                        <Route path='/pricing' component={PricingComponent}/>
                                        <Route path='/about' component={AboutComponent}/>
                                        <Route path='/legal/privacy' component={PrivacyComponent}/>
                                        <Route path='/legal/tos' component={TOSComponent}/>
                                        <Route path='/legal/disclaimer' component={DisclaimerComponent}/>
                                        <Route path='/contact-us' component={ContactUsComponent}/>
                                        <Route path='/journalists' component={JournalistsComponent}/>
                                        {/* <Route exact path='/news/post/:postId/:postSlug?' component={BlogFullComponent}/> */}
                                        <Route exact path='/news/post/:postId/:postSlug?' component={NewsDetailComponent}/>
                                        {/* <Route exact path='/news' component={BlogComponent}/> */}
                                        <Route exact path='/news' component={NewsComponent}/>
                                        <Route path='/faq' component={FaqComponent}/>
                                        <Route path='/login' component={LoginComponent}/>
                                        <Route path='/logout' component={LogoutComponent}/>
                                        <Route exact path='/signup/success' component={SignupSuccessComponent}/>
                                        <Route exact path='/signup/sub-success' component={SignupSubSuccessComponent}/>
                                        <Route exact path='/signup/:code?' component={NewSignupComponent}/>
                                        <Route exact path='/newsignup' component={
                                            () => <Redirect to="/signup" />
                                        }/>
                                        <Route path='/account' component={AccountSettingsComponent}/>
                                        <Route exact path='/admin' component={AdminComponent}/>
                                        <Route path='/admin/sendPressRelease' component={SendPressReleaseComponent}/>
                                        <Route path='/admin/distributions' component={DistributionManagerComponent}/>
                                        <Route path='/admin/uploadRelease' component={UploadReleaseComponent}/>
                                        <Route exact path='/forgot-password' component={ForgotPasswordComponent}/>
                                        <Route path='/forgot-password/success' component={ForgotPasswordSuccessComponent}/>
                                        <Route path='/reset-password/reset/' component={ResetPasswordComponent}/>
                                        <Route path='/reset-password/success' component={ResetPasswordSuccessComponent}/>
                                        <Route path='/dashboard' component={DashboardComponent}/>
                                        <Route exact path='/reviews' component={ReviewsComponent}/>
                                        <Route exact path='/home' component={HomeComponent}/>
                                        <Route exact path='/sign-up-free-success' component={SignupFreeSuccessComponent}/>
                                        <Route exact path='/sign-up-free' component={SignupFreeComponent}/>
                                        <Route exact path='/submit-alert' component={SubmitAlertComponent}/>
                                        <Route exact path='/journalist-unsubscribe/:orderId'
                                               component={JournalistUnsubscribeComponent}/>

                                        <Route exact path='/landing' component={LandingPageRework}       />

                                        {pages.map((page, index) => <Route key={index} exact path={page.path}
                                                                           component={() => <PageComponent
                                                                               page={page}/>}/>)}



                                </Switch>
                            </div>

                            <LazyLoad>
                                <ChatWidget
                                    accountId="79f6ee23-daba-4fff-a486-5e246b91ba09"
                                    title="Welcome to Briesl"
                                    subtitle="Ask us anything in the chat window below 😊"
                                    primaryColor="#ec5858"
                                    greeting=""
                                    awayMessage=""
                                    newMessagePlaceholder="Start typing..."
                                    showAgentAvailability={true}
                                    agentAvailableText="We're online right now!"
                                    agentUnavailableText="We're away at the moment."
                                    requireEmailUpfront={true}
                                    iconVariant="outlined"
                                    baseUrl="https://app.papercups.io"
                                    // Optionally include data about your customer here to identify them
                                    // customer={{
                                    //   name: __CUSTOMER__.name,
                                    //   email: __CUSTOMER__.email,
                                    //   external_id: __CUSTOMER__.id,
                                    //   metadata: {
                                    //     plan: "premium"
                                    //   }
                                    // }}
                                />
                            </LazyLoad>

                            <FooterComponent/>
                        </Router>
                    </Suspense>

            </ThemeProvider>
        </UserContext.Provider>
    );
}

export default App;
