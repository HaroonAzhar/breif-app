import { Section } from "../types";
import React from "react";
import SectionOldComponent from "../SectionOld/SectionOldComponent";
import { LongCard } from "../Elements/LongCard/LongCard";
import { HorizontalCarousel } from "../Elements/HorizontalCarousel/HorizontalCarousel";
import { Paragraph } from "../Elements/Paragraph/Paragraph";
import { SingleParagraph } from "../Elements/SingleParagraph/SingleParagraph";
import { LogoBanner } from "../Elements/LogoBanner/LogoBanner";
import { Video } from "../Elements/Video/Video";
import { TileView } from "../Elements/TileView/TileView";
import { ButtonSection } from "../Elements/ButtonSection/ButtonSection";

const SectionComponent = ({ section, landing, first = false }: { section: Section, landing: boolean, first?: boolean }) => {
    if (section.genericButton?.text === "LONG_CARD") {
        return (
            <LongCard section={section} />
        )
    } else if (section.genericButton?.text === "HORIZONTAL_AUTO_SCROLL") {
        return (
            <HorizontalCarousel section={section} />
        )
    } else if (section.genericButton?.text === "PARAGRAPHS") {
        return (
            <Paragraph section={section} />
        )
    } else if (section.genericButton?.text === "SINGLE_PARAGRAPH") {
        return (
            <SingleParagraph section={section} />
        )
    } else if (section.genericButton?.text === "BUTTON_WHITE") {
        return (
            <ButtonSection section={section} variant={"white"}/>
        )
    } else if (section.genericButton?.text === "BUTTON_GREY") {
        return (
            <ButtonSection section={section} variant={"grey"}/>
        )
    } else if (section.showLogoBanner) {
        return (
            <LogoBanner section={section} />
        )
    } else if (section.video) {
        return (
            <Video section={section} />
        )
    } else if (section.genericButton?.text === "TILE_VIEW") {
        return (
            <TileView section={section} />
        )
    } else  {
        return (
            <SectionOldComponent first={first} section={section} landing={landing} />
        )
    }    
}

export default SectionComponent;
