import {Converter} from "showdown";

export interface HorizontalLayout {
    title: string,
    items: SectionItem[]
}

export const HorizontalLayoutMapper = (data: any): HorizontalLayout => {
    return {
        items: data?.items?.map((data: any) => SectionItemMapper(data)) || [],
        title: data?.title
    }
}

export interface SectionItem {
    title: string,
    body: string,
    image: string,
    justImage: boolean,
    showButton: boolean,
    buttonTitle: string,
    buttonLink: string,
    textBackground: string,
    textFontColour: string
}

export enum Alignment {
    HORIZONTAL,
    VERTICAL
}

export interface Section {
    title: string,
    subtitle: string,
    items: SectionItem[],
    alignment: Alignment,
    video: string,
    showLogoBanner: boolean,
    logoBanner: { name: string, logos: { url: string }[] },
    horizontalLayout: boolean,
    genericButton: {text: string, url: string}
}

export interface Page {
    path: string,
    sections: Section[],
    landing: boolean,
    landingBanner: LandingBanner | null,
    title?: string,
    metaDescription?: string
}

export interface LandingBanner {
    title: string,
    subtitle: string,
    landingButton: { text: string, link: string }[],
    bannerImage: string
}

export const LandingBannerMapper = (data: any): LandingBanner => {
    return {
        title: data?.Title,
        subtitle: data?.subtitle,
        landingButton: data?.landingButton || [],
        bannerImage: data?.bannerImage?.url
    }
}

const PageMapper = (data: any): Page => {
    const landing = data?.Landing !== null && data?.Landing;

    return {
        path: data?.path,
        sections: data?.Sections.map(SectionMapper),
        landing: landing,
        landingBanner: landing ? LandingBannerMapper(data?.LandingBanner) : null,
        title: data?.seoTitle,
        metaDescription: data?.metaDescription
    }
}

const SectionMapper = (data: any): Section => {
    return {
        title: data?.title,
        subtitle: data?.subtitle,
        items: data?.item.map(SectionItemMapper),
        alignment: data?.Alignment === "Horizontal" ? Alignment.HORIZONTAL : Alignment.VERTICAL,
        video: data?.Video,
        showLogoBanner: data?.logoBanner,
        logoBanner: {
            name: data?.logo_banner?.name, logos: data?.logo_banner?.logos.map((item: any) => {
                return {url: `${process.env.REACT_APP_CMS_URL}${item.url}`}
            })
        },
        horizontalLayout: data?.horizontalLayout,
        genericButton: data?.genericButton,
    }
}

const SectionItemMapper = (data: any): SectionItem => {
    const converter = new Converter();

    return {
        title: data?.title,
        body: converter.makeHtml(data?.body),
        image: data.image ? `${process.env.REACT_APP_CMS_URL}${data.image?.url}` : "",
        justImage: data.justImage !== null && data.justImage,
        showButton: data.showButton !== null && data.showButton,
        buttonTitle: data?.buttonTitle,
        buttonLink: data?.buttonLink,
        textBackground: data?.textBackground,
        textFontColour: data?.textFontColour
    }
}

export {SectionMapper, PageMapper};
