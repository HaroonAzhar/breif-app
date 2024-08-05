import React from "react";
import {SectionItem} from "../types";
import styles from "./styles.module.css";
import {Button} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import LazyLoad from 'react-lazyload';

const ItemOldComponent = ({item, index}: { item: SectionItem, index: number }) => {
    const history = useHistory();

    const renderImage = () => <div className={styles.imgWrapper}>
        <LazyLoad height={200}>
            <img width={400} height={"auto"} alt={"Item"} src={item.image}/>
        </LazyLoad>
    </div>

    if (item.justImage) {
        return renderImage();
    }

    return <div className={styles.itemWrapper}>
        {item.image && <img className={styles.itemImg} alt={"Item"} src={item.image}/>}
        <h2 className={styles.itemHeader}>{item.title}</h2>
        <pre className={styles.itemBody} dangerouslySetInnerHTML={{__html: item.body}}
             style={{background: item.textBackground, color: item.textFontColour, margin: "auto", marginTop: "25px"}}/>
        {item.showButton && <Button className={styles.button} color={"primary"} variant={"outlined"}
                                    onClick={() => history.push(item.buttonLink)}>{item.buttonTitle}</Button>}
    </div>;
}

export default ItemOldComponent;
