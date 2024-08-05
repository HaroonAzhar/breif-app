import React, {useEffect, useState} from "react";
import styles from "./styles.module.css";
import classnames from "classnames";

const ReviewsComponent = () => {
    const [cms, setCms] = useState();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_CMS_URL}/pricing-page`, {
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(data => {
            setCms(data);
        });
    }, []);

    useEffect(() => {

    }, []);

    return <div className={styles.wrapper}>
        <h1 className={classnames(styles.title, styles.topTitle)}>
            Reviews
        </h1>

        <div className={styles.testimonialsWrapper}>
            {cms?.reviews.map((review: any) => <div className={styles.testimonialWrapper}>
                <p className={styles.testimonialText}>
                    "{review.text}"
                </p>

                <p className={styles.testimonialAuthor}>
                    - {review.author}
                </p>
            </div>)}
        </div>
    </div>
}

export default ReviewsComponent;
