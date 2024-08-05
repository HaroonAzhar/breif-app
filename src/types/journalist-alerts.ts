export interface JournalistAlert {
    address: string,
    contact: string,
    createdAt: Date,
    fetchedAt: Date,
    id: number,
    name: string,
    profilePicture: string,
    publishedAt: Date,
    text: string,
    updatedAt: Date,
    userAddress: string,
    userId: number,
    screenName: string,
    approved: boolean,
    sector: {
        name: string
    },
    outlet: string
}

export const JournalistAlertMapper = (data: any): JournalistAlert => {
    const createdAt = new Date(data.created_at);
    const fetchedAt = new Date(data.date);
    const publishedAt = new Date(data.published_at);
    const updatedAt = new Date(data.updated_at);

    return {
        address: data.address,
        contact: data.contact,
        createdAt,
        fetchedAt,
        id: data.id,
        name: data.name,
        profilePicture: data.profilePicture,
        publishedAt,
        text: data.text,
        updatedAt,
        userAddress: data.userAddress,
        userId: data.userId,
        screenName: data?.screenName,
        approved: data?.approved,
        sector: data?.sector,
        outlet: data?.outlet
    }
}
