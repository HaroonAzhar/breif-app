import React, {useState} from "react";
import styles from "./styles.module.css";
import {Button, TextField} from "@material-ui/core";
import {postComment} from "../../../../app/api";
import {toast} from "react-toastify";
import {Order} from "../../../../types/order";
import {Comment} from "./Comment/Comment";

export const PressReleaseComments = ({order}: { order: Order }) => {
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(false);

    const attemptPostComment = () => {
        setLoading(true);
        postComment(commentText, order.id).then(ok => {
            if (ok) {
                setCommentText("");
                toast("Comment added!", {type: "success"});
            } else {
                toast("Couldn't post comment", {type: "error"});
            }
            setLoading(false);
        }).catch(error => {
            toast(error.message, {type: "error"});
            setLoading(false);
        });
    }

    return <div className={styles.commentsWrapper}>
        <div className={styles.commentBox}>
            <div>
                <TextField
                    fullWidth
                    multiline
                    rows="5"
                    variant={"outlined"}
                    label={"Leave a comment"}
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                />
            </div>
            <div>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    disabled={!commentText || loading}
                    onClick={attemptPostComment}
                >
                    Post
                </Button>
            </div>
        </div>

        {order.comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((comment, i) => <Comment
            key={i} comment={comment}/>)}
    </div>
}
