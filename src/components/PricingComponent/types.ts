export interface PackageGroup {
    name: string,
    packages: Package[],
    infoText: string,
    Active?: boolean
}

export interface Package {
    id: number,
    name: string,
    subtitle: string,
    price: string,
    features: PackageFeature[],
    image: string,
    redirectPath: string,
    requiresSubscription: boolean,
    stripeId: string,
    subscriptions? : any
}

export interface PackageFeature {
    has: boolean,
    text: string,
    tooltip: string,
    price: string,
}

const PackageGroupMapper = (data: any): PackageGroup => {
    return {
        name: data.name,
        packages: data.packages.map(PackageMapper),
        infoText: data.infoText,
        Active: data.Active
    }
}

const PackageMapper = (data: any): Package => {
    return {
        id: data?.id,
        name: data.name,
        subtitle: data.subtitle,
        price: data.price,
        stripeId: data.stripeId,
        subscriptions: data.subscription_level.map((s: any) => ({ ...s, role: s.user_role.role, price: s.price })),
        features: data.features.map((feature: any) => {
            return {
                has: feature.has,
                text: feature.package_feature.text,
                tooltip: feature.package_feature.tooltip,
                price: feature.price,
            }
        }),
        image: `${process.env.REACT_APP_CMS_URL}${data.image?.url}`,
        redirectPath: data.redirectPath,
        requiresSubscription: data.requiresSubscription
    }
}
export {PackageMapper, PackageGroupMapper}
