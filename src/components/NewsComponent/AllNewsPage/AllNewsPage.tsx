import React, { useEffect, useState } from "react";
import { getAllPostsByPage } from "../../../app/api";
import { Button, Grid, LinearProgress, useMediaQuery } from "@material-ui/core";
import "../styles.scss";
import {ExpandMore} from "@material-ui/icons";
import { CategoryNews } from "../Components/CategoryNews/CategoryNews";
import { TopNews } from "../Components/TopNews/TopNews";
import { sortPosts, getModifiedTitle } from "../utils";
import { SearchBar } from "../Components/SearchBar/SearchBar";

export interface AllPosts {
    posts: any[];
    category: string;
}

export default function AllNewsPage() {
    const isMobile = useMediaQuery('(max-width: 1000px)');
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const allPosts: AllPosts[] = sortPosts(posts.slice(4));

    useEffect(() => {
        setLoading(true);
        getAllPostsByPage(page).then(data => {
            setPosts([].concat(posts, data["posts"]));
            setLoading(false);
        });
    }, [page]);

    const handleReadMore = () => {
        setPage(page + 1);
    }

    return <div>
        {loading && <LinearProgress style={{ marginTop: 65 }} />}
        <div style={{ margin: isMobile ? "70px 12px 70px 20px" : "70px 100px" }}>
            <Grid container>
                {/* <SearchBar /> */}
                <TopNews posts={posts.slice(0, 4)} />
                {allPosts.map((allpost: AllPosts) => {
                    return (
                        <CategoryNews posts={allpost.posts} title={getModifiedTitle(allpost.category)}/>
                    )
                })}
            </Grid>
            {allPosts.length > 0 && <Button variant="outlined" onClick={handleReadMore} endIcon={<ExpandMore />}>Read More</Button>}
        </div>
    </div>
}
