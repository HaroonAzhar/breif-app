import React from "react";
import {OrderComment} from "../../../../../types/order";
import styles from "./styles.module.css";
import {Avatar} from "@material-ui/core";

export const Comment = ({comment}: { comment: OrderComment }) => {
    return <div className={styles.commentWrapper}>
        <div className={styles.topRow}>
            <Avatar>{comment.user.username[0].toUpperCase()}</Avatar>
            <span>{comment.user.username} at {comment.createdAt.toDateString()} {comment.createdAt.toTimeString()}</span>
        </div>
        {comment.text}
    </div>
}
