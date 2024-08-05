import {User} from "./user";

export interface Journalist {
    id: number,
    firstName: string,
    lastName: string,
    jobTitle: string,
    outlet: string[],
    outletType: string,
    outletUrl: string,
    outletCirculation: string,
    outletOnlineUniqueUsers: string,
    desks: string,
    sectors: string,
    email: string,
    phonePrimary: string,
    phoneSecondary: string,
    phoneMobile: string,
    twitter: string,
    twitterFollowers: string,
    address: string,
    addressPremise: string,
    addressRoute: string,
    addressLocality: string,
    addressSublocality: string,
    addressPostCode: string,
    addressCountry: string,
    extraInfo: string,
    authorLists: string
}

// TODO:
export const JournalistMapper = (data: any): Journalist => {
    return {
        address: data?.address,
        addressCountry: data?.addressCountry,
        addressLocality: data?.addressLocality,
        addressPostCode: data?.addressPostCode,
        addressPremise: data?.addressPremise,
        addressRoute: data?.addressRoute,
        addressSublocality: data?.addressSublocality,
        authorLists: data?.authorLists?.split(", ") || [],
        desks: data?.desks?.split(", ") || [],
        email: data?.email,
        extraInfo: data?.extraInfo,
        firstName: data?.firstName,
        id: data?.id,
        jobTitle: data?.jobTitle?.split(", ") || [],
        lastName: data?.lastName,
        outlet: data?.outlet?.split(", ") || [],
        outletCirculation: data?.outletCirculation,
        outletOnlineUniqueUsers: data?.outletOnlineUniqueUsers,
        outletType: data?.outletType?.split(", ") || [],
        outletUrl: data?.outletUrl,
        phoneMobile: data?.phoneMobile,
        phonePrimary: data?.phonePrimary,
        phoneSecondary: data?.phoneSecondary,
        sectors: data?.sectors?.split(", ") || [],
        twitter: data?.twitter,
        twitterFollowers: data?.twitterFollowers
    }
}

export interface JournalistGroup {
    id: number,
    journalists: Journalist[],
    name: string,
    user: User
}
