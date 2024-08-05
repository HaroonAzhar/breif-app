export interface Outlet {
    id: number,
    name: string,
    email: string,
    phone: string,
    address: string,
    website: string,
    twitter: string,
    mediaType: string,
    frequency: string,
    circulation: string,
    onlineUniqueUsers: string,
    sectors: string,
    seoRanking: string
}

export const OutletMapper = (data: any): Outlet => {
    return {
        id: data?.id,
        address: data?.address,
        circulation: data?.circulation,
        email: data?.email,
        frequency: data?.frequency,
        mediaType: data?.mediaType,
        name: data?.name,
        onlineUniqueUsers: data?.onlineUniqueUsers,
        phone: data?.phone,
        sectors: data?.sectors,
        twitter: data?.twitter,
        website: data?.website,
        seoRanking: data?.seoRanking,
    }
}
