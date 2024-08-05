import React from "react";
import {HorizontalLayout} from "./types";

export const HorizontalLayoutComponent = ({horizontalLayout}: {horizontalLayout: HorizontalLayout}) => {
    return <div className={"content margin-v-md"} style={{paddingTop: "100px", paddingBottom: "100px"}}>
        <h1>{horizontalLayout.title}</h1>

        <div className={"flex-row justify-around margin-h-md"}>
            {horizontalLayout.items.map(item => <div>
                <img width={200} src={`${item.image}`} style={{width: "100%"}}/>

                <span style={{textAlign: "center"}} dangerouslySetInnerHTML={{__html: item.body}}/>
            </div>)}
        </div>
    </div>
}
