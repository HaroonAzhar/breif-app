import Cookies from "js-cookie";
import {Order, ReleaseStatus} from "../types/order";
import {User} from "../types/user";
import {Journalist} from "../types/journalist";

const firebaseFunctionsURL = process.env.REACT_APP_FIREBASE_URL;
const wordPressSiteURL = process.env.REACT_APP_WORDPRESS_URL;
export const cmsURL = process.env.REACT_APP_CMS_URL;

export async function postContactUs(from: string, name: string, message: string, token: string) {
    const response = await fetch(`${cmsURL}/contact-uses`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: from, firstName: name, message: message, token: token})
    });

    const responseJSON = await response.json();
    return response.ok && responseJSON;
}

export async function getAllPosts(perPage: number) {
    const response = await fetch(`${wordPressSiteURL}/posts?per_page=${perPage}`, {
        method: 'get',
    });

    const responseJSON = await response.json();
    return response.ok && responseJSON;
}

export async function getAllPostsByPage(perPage: number) {
    const response = await fetch(`${wordPressSiteURL}/posts?page=${perPage}`, {
        method: 'get',
    });

    const responseJSON = await response.json();
    return response.ok && responseJSON;
}

export async function getPostById(id: number) {
    const response = await fetch(`${wordPressSiteURL}/posts/${id}`, {
        method: 'get',
    });

    const responseJSON = await response.json();
    return response.ok && responseJSON;
}

export async function notifyEmailEntry(data: {
    email?: string, user?: number
}) {
    const response = await fetch(`${cmsURL}/form-email-entries`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const responseJSON = await response.json();
    return response.ok && responseJSON;
}

export async function postIdea(idea: string) {
    const response = await fetch(`${cmsURL}/ideas`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify({text: idea})
    });

    const responseJSON = await response.json();
    return response.ok && responseJSON;
}

export async function registerNew(user: any, type = "SUBSCRIBER"): Promise<any | null> {
    const response = await fetch(`${cmsURL}/auth/local/register`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    const responseJSON = await response.json();

    if (response.ok) {
        await fetch(`${cmsURL}/notify-user-signup`, {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: user.email,
                type
            })
        });

        await addToAudience({name: user.name, email: user.email, business: user.company});
    }

    return response.ok && responseJSON;
}

export async function updateUserNew(user: any) {
    const response = await fetch(`${cmsURL}/users/updateSelf`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify(user)
    });
    if (response.status === 200) {
        return Promise.resolve({ error: false });
    }
    return Promise.reject({ error: true });

}

export async function forgotPassword(email: string) {
    const response = await fetch(`${cmsURL}/auth/forgot-password`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email})
    });

    const responseJSON = await response.json();
    return response.ok && responseJSON;
}

export async function resetPassword(code: string, newPassword: string) {
    const response = await fetch(`${cmsURL}/auth/reset-password`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({code: code, password: newPassword, passwordConfirmation: newPassword})
    });

    const responseJSON = await response.json();
    return response.ok && responseJSON;
}

export async function getCheckoutSessionIdCms(sCode: string, code?: string) {
    const response = await fetch(`${cmsURL}/stripe/generateCheckoutSession`, {
        method: 'post',
        headers: {
            'Authorization': 'Bearer ' + Cookies.get("token"),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            referralCode: code,
            code: sCode
        })
    });

    const responseJSON = await response.json();
    return response.ok && responseJSON;

}

export async function getBillingUrlCms() {
    const response = await fetch(`${cmsURL}/stripe/generateBillingPortalSession`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
    });

    const responseJSON = await response.json();
    return response.ok && responseJSON;
}

// TODO: ughhh....
export async function postDistributionStatsFileUpload(file: any, orderId: number) {
    const formData = new FormData();
    formData.append('files.file', file);
    formData.append('data', JSON.stringify({order: orderId}))
    const response = await fetch(
        `${cmsURL}/order-distributions`,
        {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + Cookies.get("token")
            },
            body: formData,
        }
    );
    const responseJSON = await response.json();
    return response.ok && responseJSON;
}

export async function cmsLogin(username: string, password: string): Promise<any | null> {
    const response = await fetch(`${cmsURL}/auth/local`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({identifier: username, password: password})
    });

    const responseJson = await response.json();

    return response.ok && responseJson;
}

export async function getUsers(): Promise<any | null> {
    const response = await fetch(`${cmsURL}/users?_limit=10000`, {
        method: "get",
        headers: {
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
    });

    const responseJson = await response.json();

    return response.ok && responseJson;
}

export async function generateOrderCheckoutSession(formData: FormData): Promise<{ id: string } | null> {
    let headers: any = {};

    if (Cookies.get("token")) {
        headers["Authorization"] = 'Bearer ' + Cookies.get("token");
    }

    const response = await fetch(`${cmsURL}/stripe/generateOrderCheckoutSession`, {
        method: "post",
        headers,
        body: formData
    });

    const responseJson = await response.json();
    return response.ok && responseJson;
}

export async function graphqlQuery(query: string) {
    let headers: any = {
        'Content-Type': 'application/json'
    };

    if (Cookies.get("token")) {
        headers["Authorization"] = 'Bearer ' + Cookies.get("token");
    }

    const response = await fetch(`${cmsURL}/graphql`, {
        method: "post",
        headers,
        body: JSON.stringify({
            query
        })
    });

    const responseJson = await response.json();
    return response.ok && responseJson;
}

export async function getMyOrders() {
    let headers: any = {
        'Content-Type': 'application/json'
    };

    if (Cookies.get("token")) {
        headers["Authorization"] = 'Bearer ' + Cookies.get("token");
    }

    const response = await fetch(`${cmsURL}/orders/me`, {
        method: "get",
        headers,
    });

    const responseJson = await response.json();
    return response.ok && responseJson;
}

export async function getMyOrder(id: number) {
    const response = await fetch(`${cmsURL}/orders/getMyOrder/${id}`, {
        method: "get",
        headers: {
            Authorization: 'Bearer ' + Cookies.get("token")
        }
    });

    const responseJson = await response.json();
    return response.ok && responseJson;
}

export async function postPressRelease(pressRelease: File, moreInfo: string) {
    const formData = new FormData();
    formData.append("data", JSON.stringify({moreInfo}));
    formData.append("files.pressRelease", pressRelease);

    const response = await fetch(`${cmsURL}/sent-press-releases`, {
        method: "post",
        headers: {
            Authorization: 'Bearer ' + Cookies.get("token")
        },
        body: formData
    });

    const responseJson = await response.json();
    return response.ok && responseJson;
}


export async function generateReferral(friendsEmail: string) {
    const response = await fetch(`${cmsURL}/refer-a-friend/generateReferral`, {
        method: "post",
        headers: {
            Authorization: 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify({
            friendsEmail
        })
    });

    return response.ok;
}

export async function refreshPressCoverage() {
    const response = await fetch(`${cmsURL}/users/refreshPressCoverage`, {
        method: "get",
        headers: {
            Authorization: 'Bearer ' + Cookies.get("token")
        }
    });

    return response.ok && response.json();
}

export async function getJournalistAlerts() {
    const response = await fetch(`${cmsURL}/tweets?_limit=-1`, {
        method: "get",
        headers: {
            Authorization: 'Bearer ' + Cookies.get("token")
        }
    });

    return response.ok && response.json();
}


export async function addToAudience(args: { name: string, email: string, business: string }) {
    const response = await fetch(`${cmsURL}/mailchimp/addToAudience`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

export async function sendJournalistAssignedEmail(args: { journalistName: string, order: Order, user: User }) {
    const response = await fetch(`${cmsURL}/admin-emails/journalist-assigned`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

export async function sendReleaseScheduledEmail(args: { date: string, time: string, order: Order, user: User }) {
    const response = await fetch(`${cmsURL}/admin-emails/release-scheduled`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

export async function sendReleaseDistributedEmail(args: { journalists: string, order: Order, user: User }) {
    const response = await fetch(`${cmsURL}/admin-emails/release-distributed`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

export async function sendPressCoverageEmail(args: { order: Order, user: User }) {
    const response = await fetch(`${cmsURL}/admin-emails/press-coverage`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

export async function postComment(text: string, order: number) {
    const response = await fetch(`${cmsURL}/press-release-comments`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify({text, order})
    });

    return response.ok;
}

export async function changeOrderStatus(order: number, newStatus: ReleaseStatus) {
    const response = await fetch(`${cmsURL}/orders/changeOrderStatus`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify({order, newStatus})
    });

    return response.ok;
}

export async function getPRCalendar() {
    const response = await fetch(`${cmsURL}/pr-calendars?_limit=-1`, {
        method: "get",
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + Cookies.get("token")
        }
    });

    return response.ok && response.json();
}

export async function postJournalistsDatabaseUpload(file: File) {
    const formData = new FormData();
    formData.append('files.journalists', file);
    formData.append('data', JSON.stringify({}))
    const response = await fetch(
        `${cmsURL}/journalists/import`,
        {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + Cookies.get("token")
            },
            body: formData,
        }
    );

    return response.ok;
}

export async function postOutletsDatabaseUpload(file: File) {
    const formData = new FormData();
    formData.append('files.outlets', file);
    formData.append('data', JSON.stringify({}))
    const response = await fetch(
        `${cmsURL}/outlets/import`,
        {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + Cookies.get("token")
            },
            body: formData,
        }
    );

    return response.ok;
}

export async function getAllJournalists() {
    const response = await fetch(`${cmsURL}/journalists?_limit=-1`,
        {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + Cookies.get("token")
            },
        }
    );

    return response.ok && response.json();
}

export async function postJournalistAlert(args: { name: string, contact: string, address: string, text: string, date: Date }) {
    const response = await fetch(`${cmsURL}/tweets`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

export async function sendTestRelease(args: { orderId: number }) {
    const response = await fetch(`${cmsURL}/journalists/sendTestRelease`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

export async function sendRelease(args: { orderId: number, audience:any }) {
    const response = await fetch(`${cmsURL}/journalists/sendRelease`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

export async function postJournalistGroup(args: { journalists: number[], name: string, user: number }) {
    const response = await fetch(`${cmsURL}/journalist-groups`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

export async function putJournalistGroup(id: number, args: { journalists: number[] }) {
    const response = await fetch(`${cmsURL}/journalist-groups/${id}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

export async function getJournalistGroups(user: number) {
    const response = await fetch(`${cmsURL}/journalist-groups?user=${user}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        }
    });

    return response.ok && response.json();
}

export async function postAnalysePressPressRelease(args: { filters: {jobTitles: string[], sectors: string[], outlets: string[], outletTypes: string[]}, page?: number }) {
    const response = await fetch(`${cmsURL}/journalists/analyse`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(args)
    });

    return response.ok && response.json();
}

export async function getAudienceAnalysisFilters() {
    const response = await fetch(`${cmsURL}/journalists/getFilters`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return response.ok && response.json();
}

export async function getAllOrders() {
    const response = await fetch(`${cmsURL}/orders`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        }
    });

    return response.ok && response.json();
}


export async function getUsersOrders(user: number) {
    const response = await fetch(`${cmsURL}/orders?user=${user}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        }
    });

    return response.ok && response.json();
}

export async function updateOrder(order: number, attributes: any) {
    const response = await fetch(`${cmsURL}/orders/${order}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify(attributes)
    });

    return response.ok;
}

export async function approveSendRelease(orderId: number) {
    const response = await fetch(`${cmsURL}/orders/approveSendRelease`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify({orderId})
    });

    return response.ok;
}

export async function approveScheduleRelease(orderId: number, datetime: string) {
    const response = await fetch(`${cmsURL}/orders/approveScheduleRelease`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify({orderId, datetime})
    });

    return response.ok;
}

export async function returnReleaseForReview(orderId: number, comments: string) {
    const response = await fetch(`${cmsURL}/orders/returnReleaseForReview`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify({orderId, comments})
    });

    return response.ok;
}

export async function updateMyOrder(orderId: number, args: any) {
    const response = await fetch(`${cmsURL}/orders/my/${orderId}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

export async function journalistUnsubscribe(args: { email: string, orderId: number }) {
    const response = await fetch(`${cmsURL}/journalists/unsubscribe`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

export async function postSaveAudience(args: { audience: number[], orderId: number }) {
    const response = await fetch(`${cmsURL}/journalists/saveAudience`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

export async function getMailingListStatus(args: { orderId: number }) {
    const response = await fetch(`${cmsURL}/journalists/getMailingListStatus`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify(args)
    });

    return response.ok && response.json();
}

export async function postSaveAudienceFromFilters(args: { orderId: number, filters: any, journalistsToRemove: Journalist[] }) {
    const response = await fetch(`${cmsURL}/journalists/saveAudienceFromFilters`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

// FOR USERS SENDING THEIR OWN RELEASE
export async function postSendTestRelease(args: { orderId: number }) {
    const response = await fetch(`${cmsURL}/orders/sendTestRelease`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

export async function getOutlets() {
    const response = await fetch(`${cmsURL}/outlets?_limit=-1`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        }
    });

    return response.ok && response.json();
}

export async function postNotifyUser(args: { orderId: number }) {
    const response = await fetch(`${cmsURL}/orders/notifyUser`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: JSON.stringify(args)
    });

    return response.ok;
}

export async function postMediaUpload(media: File) {
    const formData = new FormData();
    formData.append("files.media", media);
    formData.append("data", JSON.stringify({}));

    const response = await fetch(`${cmsURL}/release-medias`, {
        method: 'post',
        headers: {
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        body: formData
    });

    return response.ok && response.json();
}

export async function getPublicationsToIgnore(filters: any) {
    const response = await fetch(`${cmsURL}/journalists/getPublicationsToIgnore`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
    });

    return response.ok && response.json();
}

export async function getRegions() {
    const response = await fetch(`${cmsURL}/journalists/getRegions`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response.ok && response.json();
}


export async function getTopPublications() {
    const response = await fetch(`${cmsURL}/users/getTopPublications`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        }
    });

    return response.ok && response.json();
}
