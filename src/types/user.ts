import {Order, OrderMapper} from "./order";
import {Outlet, OutletMapper} from "./outlet";

export interface PressCoverage {
    seoRanking: number,
    circulation: number,
    readership: number,
    ave: number,
    name: string,
    url: string,
    thumbnail: { url: string } | null,
    outlet: Outlet,
}

export const PressCoverageMapper = (data: any): PressCoverage => {
    return {
        ave: data?.ave,
        circulation: data?.circulation,
        name: data?.name,
        outlet: OutletMapper(data?.outlet),
        readership: data?.readership,
        seoRanking: data?.seoRanking,
        thumbnail: data?.thumbnail,
        url: data?.url,
    }
}

export interface State {
    screen: number;
}

export interface User {
    id: number,
    email?: string,
    business?: string,
    website?: string,
    name?: string,
    username: string,
    admin?: boolean,
    subscription?: boolean,
    subscription_level?: string,
    customer?: string,
    distributions?: Order[],
    pressCoverage: PressCoverage[],
    createdAt: string
}

const UserMapper = (data: any): User => {
    return {
        id: data?.id,
        email: data?.email,
        business: data?.company,
        website: data?.website,
        name: data?.name,
        username: data?.username,
        admin: data?.role?.type === "admin",
        subscription: data?.activeSubscription === true,
        customer: data?.stripeCustomer,
        subscription_level: data?.subscription_level,
        distributions: data?.orders?.map((o: any) => OrderMapper(o)),
        pressCoverage: data?.pressCoverage ? data?.pressCoverage.map((pc: any) => PressCoverageMapper(pc)) : [],
        createdAt: data?.created_at
    }
}

export {UserMapper};
