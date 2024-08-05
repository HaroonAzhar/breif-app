import { Grid } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { htmlDecode } from "../../utils";

export function CategoryNews({ posts, title }: { posts: any, title: string }) {
    if (posts.length === 0) {
        return <></>
    }

    const fullHeight = 176;
    return (
        <>
            <div style={{ margin: "32px 0 18px 0", fontSize: 24, fontWeight: 500 }}>{title}</div>
            <Grid container spacing={3} style={{ marginRight: "-4px" }}>
                {posts.map((post: any) => {
                    return (
                        <Grid item xs={12} md={3} style={{ marginBottom: 50 }}>
                            <NewsCategoryCard height={fullHeight} post={post} />
                        </Grid>
                    )
                })}
            </Grid>
        </>
    )
}


export function NewsCategoryCard({ height, post, size }: { height: number, post: any, size?: string }) {
    const history = useHistory();

    const handleOnNewsItemClick = () => {
        history.push(`/news/post/${post.ID}/${post.slug}`)
    }

    return (
        <div className="news-category-card" onClick={handleOnNewsItemClick}>
            <img src={post.featured_image} style={{ width: "100%", height: height, objectFit: "cover", borderRadius: 8 }} />
            {size === "small" ? (
                <div style={{ color: "black" }}>
                    <div style={{ fontSize: "14px", fontWeight: 300 }}>{post.author.name}</div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>{htmlDecode(post.title)}</div>
                </div>
            ) : (
                <div style={{ color: "black" }}>
                    <div style={{ fontSize: "18px", fontWeight: 300 }}>{post.author.name}</div>
                    <div style={{ fontSize: "18px", fontWeight: 500 }}>{htmlDecode(post.title)}</div>
                </div>
            )}
        </div>
    )
}