export interface Post {
    ID: number;
    author: {
        id: number,
        name: string,
        URL: string,
        avatar_URL: string,
        profile_URL: string
    };
    date: string;
    modified: string;
    title: string;
    URL: string;
    short_URL: string;
    content: string;
    excerpt: string;
    featured_image: string;
    slug: string;
}