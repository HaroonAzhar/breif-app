import React, {useEffect, useState} from "react";
import styles from "./styles.module.css";
import {getAllPosts} from "../../app/api";
import {BlogPreviewComponent} from "./BlogPreviewComponent/BlogPreviewComponent";
import {Button, LinearProgress} from "@material-ui/core";

export default function BlogComponent() {
    const [posts, setPosts] = useState([]);
    const [perPage, setPerPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

    }, []);

    useEffect(() => {
        setLoading(true);
        getAllPosts(perPage).then(data => {
            setPosts(data["posts"]);
            setLoading(false);
        });
    }, [perPage]);

    const handleViewMoreOnClick = () => {
        setPerPage(perPage + 10);
    }

    return <div>
        {loading && <LinearProgress className={styles.loading}/>}

        <div className={styles.wrapper}>

            <h1>News Brief</h1>

            <div className={styles.blogPreviews}>
                {posts.map((item, index) => <BlogPreviewComponent key={index} post={item}/>)}
            </div>

            <Button color="primary" onClick={handleViewMoreOnClick}>View More</Button>
        </div>
    </div>
}
