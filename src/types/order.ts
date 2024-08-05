import _ from "lodash";
import {Package, RequestStatus} from "../components/StepsComponent/types";
import {Journalist, JournalistMapper} from "./journalist";

export class OrderInfo {
    constructor
    (
        public email: string | null,
        public selectedPackage: Package | null,
        public lookingToCreate: string[],
        public purposeOfContent: string[],
        public newsHook: string | null,
        public quote: string | null,
        public importantInfo: string | null,
        public supportingMaterial: string[],
        public linksToMedia: string[],
        public distributionUpload: string | null,
        public audienceDemographics: string | null,
        public audienceAgeRange: string | null,
        public audienceHouseholdIncome: string | null,
        public audienceLocation: string | null,
        public audienceLocationRegional: string | null,
        public audienceLocationLocal: string | null,
        public outlet: string[],
        public genre: string[],
        public publicationsToIgnore: string | null,
        public releaseDate: string | null,
        public embargoDate: string | null,
        public name: string | null,
        public tel: string | null,
        public web: string | null,
        public instagram: string | null,
        public otherSocials: string | null,
        public payment: any | null,
        public id: string,
        public unix: string,
        public date: string,
        public status: RequestStatus,
    ) {
    }
}

export class OrderInfoMapper {
    static map(data: any): OrderInfo {
        const date = new Date(data.created);

        return new OrderInfo(
            _.get(data, "email-collect-step.emailInput.value", null),
            {
                name: _.get(data, "press-release-plan-selection.selected-package.metaDescription", "Unknown"),
                cost: data.amount,
                id: 0
            },
            _.map(data["looking-to-create-step"], (item: any) => {
                if (item.value && item.value === true && item.metaDescription) {
                    return item.metaDescription;
                }
            }),
            _.map(data["purpose-of-content-step"], (item: any) => {
                if (item.value && item.value === true && item.metaDescription) {
                    return item.metaDescription;
                }
            }),
            _.get(data, "news-hook-step.news-hook.value", null),
            _.get(data, "quote-step.quote.value", null),
            _.get(data, "important-info-step.important-info.value", null),
            [],
            [],
            null,
            _.get(data, "audience-demographics.value", null),
            _.get(data, "audience-age-range.value", null),
            _.get(data, "audience-household-income.value", null),
            _.get(data, "audience-location.value", null),
            _.get(data, "audience-location-regional.value", null),
            _.get(data, "audience-location-local.value", null),
            _.map(data["outlet-select-step"], (item: any) => {
                if (item.value && item.value === true && item.metaDescription) {
                    return item.metaDescription;
                }
            }),
            _.map(data["genre-step"], (item: any) => {
                if (item.value && item.value === true && item.metaDescription) {
                    return item.metaDescription;
                }
            }),
            _.get(data, "publications-to-ignore-step.publications-to-ignore.value", null),
            _.get(data, "embargo-step.release-date.value", null),
            _.get(data, "embargo-step.embargo-date.value", null),
            _.get(data, "about-you-step.name.value", null),
            _.get(data, "about-you-step.tel.value", null),
            _.get(data, "about-you-step.site.value", null),
            _.get(data, "about-you-step.instagram.value", null),
            _.get(data, "about-you-step.other-socials.value", null),
            _.get(data, "amount", null),
            data.id,
            data.created,
            date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
            data.status
        )
    }
}

export interface OrderComment {
    text: string,
    user: { id: number, username: string },
    createdAt: Date,
}

export const OrderCommentMapper = (c: any): OrderComment => {
    const date = new Date(c?.created_at);

    return {
        text: c?.text,
        user: {
            id: c?.user.id,
            username: c?.user.username
        },
        createdAt: date
    }
}

export interface Order {
    id: number,
    orderNumber: string,
    orderInfo: OrderInfo,
    orderStatus: OrderStatus,
    user: number,
    payment: number,
    supportingMaterial: any, // TODO: type
    release: {
        url: string,
        name: string,
        created_at: string
    }, // TODO: type,
    orderDistributions?: { outlets: { name: string, opened: number, clicked: number }[], clicked: number, delivered: number, opened: number, file: { name: string } }[],
    createdAt: string,
    comments: OrderComment[],
    releaseStatus: ReleaseStatus,
    clicked: number,
    opened: number,
    delivered: number,
    audience: Journalist[],
    releaseRT: string,
    reviewComments: string,
    replyTo: string,
    emailSubject: string,
    scheduledFor: Date,
    audienceApproved: boolean,
    updatedAt: Date,
    processing: boolean,
    filters: {jobTitles: string[], outletTypes: string[], outlets: string[], sectors: string[]}
}

export enum ReleaseStatus {
    WAITING_REVIEW = "WAITING_REVIEW",
    APPROVED = "APPROVED",
    REQUESTED_CHANGES = "REQUESTED_CHANGES"
}

export enum OrderStatus {
    IN_PROGRESS = "in_progress",
    WAITING_APPROVAL = "waiting_approval",
    APPROVED_RELEASE_SENT = "approved_release_sent",
    APPROVED_RELEASE_SCHEDULED = "approved_release_scheduled",
    RETURNED_FOR_REVIEW = "returned_for_review"
}

export const orderStatusToString = (status: OrderStatus): string => {
    switch (status) {
        case OrderStatus.IN_PROGRESS:
            return "In progress";
        case OrderStatus.WAITING_APPROVAL:
            return "Waiting approval";
        case OrderStatus.APPROVED_RELEASE_SENT:
            return "Approved release sent";
        case OrderStatus.APPROVED_RELEASE_SCHEDULED:
            return "Approved release scheduled";
        case OrderStatus.RETURNED_FOR_REVIEW:
            return "Returned for review";
    }
}

const OrderMapper = (data: any): Order => {
    const scheduledFor = new Date(data?.scheduledFor);
    const updatedAt = new Date(data?.updated_at);

    const today = new Date();

    // Has it been 10 minutes since it last got updated
    const processing = (((today.getTime() - updatedAt.getTime()) / 1000) / 60) <= 10;

    return {
        id: data?.id,
        orderNumber: data?.orderNumber,
        orderInfo: OrderInfoMapper.map(data?.orderInfo),
        orderStatus: data?.orderStatus,
        user: data?.user,
        payment: data?.payment,
        supportingMaterial: data?.supportingMaterial,
        release: data?.release,
        orderDistributions: data?.order_distributions,
        createdAt: data?.created_at,
        comments: data?.comments ? data.comments.map((c: any) => OrderCommentMapper(c)) : [],
        releaseStatus: data?.releaseStatus,
        clicked: data?.clicked,
        opened: data?.opened,
        delivered: data?.delivered,
        audience: data?.audience?.map((d: any) => JournalistMapper(d)) || [],
        releaseRT: data?.releaseRT,
        reviewComments: data?.reviewComments,
        emailSubject: data?.emailSubject,
        replyTo: data?.replyTo,
        scheduledFor,
        audienceApproved: Boolean(data?.audienceApproved),
        updatedAt,
        processing,
        filters: data?.filters
    }
}

export {OrderMapper};
