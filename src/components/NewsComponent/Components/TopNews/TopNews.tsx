import React from "react";
import { Grid, useMediaQuery } from "@material-ui/core";
import {useHistory} from "react-router-dom";
import { htmlDecode } from "../../utils";

export function TopNews({ posts }: { posts: any }) {
    const isMobile = useMediaQuery('(max-width: 1000px)');
    const history = useHistory();
    if (posts.length !== 4) {
        return <></>
    }

    const NewsHeaderCard = (height: number, post: any) => {
        const handleOnNewsItemClick = () => {
            history.push(`/news/post/${post.ID}/${post.slug}`)
        }
        return (
            <div className="news-header-card" onClick={handleOnNewsItemClick}>
                <img className="news-image" style={{ top: 0, left: 0, width: "100%", height: height, backgroundColor: "#4a4a4a7a", position: "absolute" }} />
                <img src={post.featured_image} style={{ width: "100%", height: height, objectFit: "cover" }} />
                <div style={{ position: "absolute", bottom: 16, left: 16, color: "white" }}>
                    <div>{post.author.name}</div>
                    <div style={{ fontSize: "24px", fontWeight: 500 }}>{htmlDecode(post.title)}</div>
                </div>
            </div>
        )
    }

    const fullHeight = 470;
    const marginGap = 8;
    return (
        <>
            <div style={{ margin: "18px 0", fontSize: 24, fontWeight: 500 }}>Latest News</div>
            <Grid container spacing={1}>
                <Grid item xs={12} md={7} style={{marginRight: isMobile ? marginGap : 0}}>
                    {NewsHeaderCard(fullHeight + marginGap, posts[0])}
                </Grid>
                <Grid container item xs={12} md={5} spacing={1}>
                    <Grid item xs={12} md={6}>
                        {NewsHeaderCard(fullHeight / 2, posts[1])}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {NewsHeaderCard(fullHeight / 2, posts[2])}
                    </Grid>
                    <Grid item xs={12} md={12} style={{ marginTop: `-${marginGap / 2}px` }}>
                        {NewsHeaderCard(fullHeight / 2, posts[3])}
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}
