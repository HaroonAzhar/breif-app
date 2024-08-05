import React from "react";
import styles from "./styles.module.css";
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import {Package} from "../types";

export function BasketComponent({data, selectedPackage}: { data: any, selectedPackage: Package }) {
    // TODO fix keys for children

    const generateSubItems = (stepId: string) => {
        let items: any[] = [];

        if (data[stepId].singleValue) {
            items.push(<p key={stepId}>{data[stepId].value}</p>)
        } else {
            Object.getOwnPropertyNames(data[stepId]).map((optionId: string) => {
                if (typeof data[stepId][optionId].value === "boolean") {
                    if (data[stepId][optionId].value === true) {
                        items.push(<p key={optionId}>{data[stepId][optionId].metaDescription}</p>);
                    }
                } else {
                    return items.push(<p
                        key={optionId}>{data[stepId][optionId].metaDescription} {data[stepId][optionId].value}</p>);
                }
            });
        }

        return items;
    }

    const generate = () => {
        let items: any[] = [];
        Object.getOwnPropertyNames(data).map((stepId: string, i: number) => {
            if (data[stepId].metaDescription) {
                items.push(<div key={i} className={styles.basketGroup}>
                    <p className={styles.basketGroupTitle}>{data[stepId].metaDescription}</p>

                    {generateSubItems(stepId)}
                </div>);
            }
        });

        return items;
    }

    return <div className={styles.wrapper}>
        <span className={styles.title}><ShoppingBasketIcon/>Basket</span>
        {generate()}

        <div className={styles.bottomWrapper}>
            <span>Total: </span><span> £{selectedPackage.cost}</span>
        </div>
    </div>
}
