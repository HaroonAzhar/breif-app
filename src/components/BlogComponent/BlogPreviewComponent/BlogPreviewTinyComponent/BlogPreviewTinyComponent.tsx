import React from "react";
import styles from "./styles.module.css";
import {Grid} from "@material-ui/core";
import {Post} from "../../types";

const BlogPreviewTinyComponent = (({post}: { post: Post }) => {
    return <div className={styles.wrapper}>
        <Grid container>
            <Grid item xs={12}>
                <img className={styles.tinyImg} src={post.featured_image || "https://brief.app/poly.png"}
                     alt={"Featured_image"}/>
            </Grid>
            <Grid item xs={12}>
                <a href={`/news/post/${post.ID}`}><p className={styles.title}>{post.title}</p></a>
            </Grid>
            <Grid item xs={12}>
                <p className={styles.date}>{post.date}</p>
            </Grid>
        </Grid>
    </div>
})

export {BlogPreviewTinyComponent};
