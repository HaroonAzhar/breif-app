import React from "react";
import styles from "./styles.module.css";
import {CalendarToday, PermIdentity} from "@material-ui/icons";
import {Button, Paper} from "@material-ui/core";
import {removeUnicode} from "../helpers";
import {useHistory} from "react-router-dom";
import {Post} from "../types";

export function BlogPreviewComponent({post}: { post: Post }) {
    const history = useHistory();

    const handleContinueReadingOnClick = () => {
        history.push(`/news/post/${post.ID}/${post.slug}`)
    }

    return <Paper elevation={1} className={styles.wrapper}>
        <img onClick={handleContinueReadingOnClick} className={styles.previewImg}
             src={post.featured_image || "https://brief.app/poly.png"} alt="Featured"/>
        <div className={styles.titleWrapper}>
            <p className={styles.title}>{post.title}</p>
        </div>
        <div className={styles.infoWrapper}>
            <CalendarToday/><p className={styles.date}>{post.date}</p>
            <PermIdentity/><p className={styles.authorName}>{post.author.name}</p>
        </div>
        <p className={styles.excerpt}>{removeUnicode(post.excerpt)}</p>

        <div className={styles.button}>
            <Button variant="contained" color="primary" onClick={handleContinueReadingOnClick}>Continue Reading</Button>
        </div>
    </Paper>
}
