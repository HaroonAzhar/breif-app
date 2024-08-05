import React from 'react';
import {Route, Switch} from "react-router-dom";

export default (
    <Switch>
        <Route exact path='/'/>
        <Route exact path='/form/success/:orderId'/>
        <Route exact path='/form/cancel'/>
        <Route path='/form'/>
        <Route path='/pricing'/>
        <Route path='/about'/>
        <Route path='/legal/privacy'/>
        <Route path='/legal/tos'/>
        <Route path='/legal/disclaimer'/>
        <Route path='/contact-us'/>
        <Route path='/journalists'/>
        <Route exact path='/news/post/:postId/:postSlug?'/>
        <Route exact path='/news'/>
        <Route path='/faq'/>
        <Route path='/login'/>
        <Route path='/logout'/>
        <Route exact path='/signup'/>
        <Route path='/account'/>
        <Route exact path='/forgot-password'/>
        <Route path='/reset-password/reset/'/>
        <Route exact path='/dashboard'/>
        <Route exact path='/dashboard/analytics/:orderId'/>
        <Route exact path='/dashboard/ideas-clinic'/>
    </Switch>
);
