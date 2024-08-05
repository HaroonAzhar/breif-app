import {Package, PackageGroup, PackageMapper} from "../PricingComponent/types";

export interface DashboardPackageGroup {
    title: string,
    subtitle: string,
    packages: Package[],
    toPackageGroup: () => PackageGroup,
    requiresPremium: boolean
}

export const DashboardPackageGroupMapper = (data: any): DashboardPackageGroup => {
    const packages = data?.packages.map((p: any) => PackageMapper(p));

    return {
        title: data?.title,
        subtitle: data?.subtitle,
        packages,
        toPackageGroup: () => {
            return {
                name: data?.title,
                packages,
                infoText: data?.infoText
            }
        },
        requiresPremium: data?.requiresPremium
    }
}
