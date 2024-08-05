import { Divider, Grid, LinearProgress, useMediaQuery } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getPostById, getAllPosts } from "../../../app/api";
import { NewsCategoryCard } from "../Components/CategoryNews/CategoryNews";
import { Post } from "../Types/Post";
import { AccessTimeOutlined } from "@material-ui/icons";
import "../styles.scss";
import { htmlDecode } from "../utils";

export default function NewsDetailPage(props: any) {
    const [height, setHeight] = useState(0);
    const isMobile = useMediaQuery('(max-width: 1000px)');
    const id = props.match.params.postId || -1;
    const [post, setPost] = useState({} as Post);
    const [otherPosts, setOtherPosts] = useState([{} as Post, {} as Post, {} as Post])
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getPostById(id).then(data => {
            if (!data) {
                setError(true);
                return;
            }
            setPost(data);
        });

        getAllPosts(3).then(data => {
            if (!data || !data.posts) {
                setError(true);
                return;
            }
            setOtherPosts(data.posts.filter((item: Post) => item.ID !== Number(id)));
            setLoading(false);
        });
    }, [id]);

    const onHeightChange = (value: number) => {
        setHeight(value)
    }

    if (error) return <Error />

    return (
        <div>
            {loading && <LinearProgress style={{ marginTop: 65 }} />}
            {!loading && (
                <div style={{ margin: isMobile ? "70px 20px" : "100px 100px" }}>
                    <Grid container>
                        {!isMobile && <SideStories posts={otherPosts} height={height}/>}
                        <Grid item xs={12} md={10}>
                            {post.ID && <NewsArticle post={post} onHeightChange={onHeightChange}/>}
                        </Grid>
                        {isMobile && <SideStories posts={otherPosts} />}
                    </Grid>
                </div>
            )}
        </div>
    )
}

function Error() {
    return (
        <h3>
            There was a problem loading this post. Please click <Link to="/news">here</Link> to return.
        </h3>
    )
}

function NewsArticle({ post, onHeightChange }: { post: Post, onHeightChange: (value: number) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 1000px)');
    const today = new Date();
    const postDate = new Date(post.date);
    const numDays = Math.floor((today.getTime() - postDate.getTime()) / (1000 * 3600 * 24));
    const numHours = Math.floor((today.getTime() - postDate.getTime()) / (1000 * 3600));

    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const properDate = postDate.toLocaleDateString("en-US", options);

    useEffect(() => {
        onHeightChange(ref.current ? ref.current.clientHeight : 0);
    })

    return (
        <div ref={ref} style={isMobile ? {} : { marginLeft: 40, borderLeft: "2px solid #cacaca", paddingLeft: 40 }}>
            <div style={{ color: "black", marginBottom: 40 }}>
                <div style={{ fontSize: "18px", fontWeight: 400 }}>{post.author.name}</div>
                <div style={{ fontSize: "48px", fontWeight: 500 }}>{htmlDecode(post.title)}</div>
                <div style={{ display: "inline-flex", marginTop: 10, alignItems: "center" }}>
                    <AccessTimeOutlined style={{ marginRight: 5, fontSize: 20 }} />
                    <div style={{ fontSize: "15px", fontWeight: 400 }}>
                        {numDays > 7 ? properDate : numDays > 0 ? `${numDays} Days ago` : `${numHours} Hours ago`}
                    </div>
                </div>
            </div>
            <div className="content">
                <span dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
        </div>
    )
}

function SideStories({ posts, height }: { posts: Post[], height?: number }) {
    const isMobile = useMediaQuery('(max-width: 1000px)');
    const numberOfItems = Math.floor((height || 2250) / 250);
    const fullHeight = 135;
    return (
        <Grid item xs={12} md={2}>
            <Divider style={{ height: 4, background: "black", width: "52%", marginLeft: isMobile ? "24%" : "48%", marginTop: isMobile ? 50 : 0 }} />
            <p style={{ margin: "15px 0", fontWeight: 500, fontSize: 18, textAlign: isMobile ? "center" : "right" }}>POPULAR STORIES</p>
            {posts.slice(0, numberOfItems).filter(post => post.ID).map((post: Post) => {
                return (
                    <Grid item xs={12} md={12} style={{ marginBottom: 25 }}>
                        <NewsCategoryCard height={fullHeight} post={post} size="small" />
                    </Grid>
                )
            })}
        </Grid>
    )
}
