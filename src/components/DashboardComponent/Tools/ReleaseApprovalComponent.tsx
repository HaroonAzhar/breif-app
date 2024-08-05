import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Order, OrderMapper} from "../../../types/order";
import {getMyOrder, updateOrder} from "../../../app/api";
import RichTextEditor, {EditorValue} from "react-rte";
import Editor from "../../RichTextEditor/TextEditor";
import {Button} from "@material-ui/core";
import {toast} from "react-toastify";

interface State {
    order: Order | null,
    saving: boolean,
    release: string
}

export const ReleaseApprovalComponent = () => {
    const {orderId} = useParams();
    const [state, setState] = useState<State>({order: null, saving: false, release: ''});

    const saveRelease = async () => {
        if (!state.order) {
            return;
        }

        setState({...state, saving: true});

        const ok = await updateOrder(state.order.id, {"releaseRT": state.release.toString()});

        if (ok) {
            toast("Release saved", {type: "success"});
        } else {
            toast("Something went wrong", {type: "error"})
        }

        setState({...state, saving: false});
    }

    const handleReleaseOnChange = (e: string) => {
        setState({...state, release: e});
    }

    const fetchData = async () => {
        const data = await getMyOrder(orderId);
        const _order = OrderMapper(data);

        if (_order.releaseRT) {
            const _release = _order.releaseRT;
            setState({...state, order: _order, release: _release});
        } else {
            setState({...state, order: _order});
        }
    }

    useEffect(() => {
        fetchData().then(() => console.log("Component loaded"));
    }, [orderId]);

    return <div className={"content"}>
        <div className="margin-v-md">
            <h2 style={{textAlign: "left"}}>Here is your release</h2>

            {/* <RichTextEditor value={state.release} onChange={handleReleaseOnChange}/> */}
            <Editor value={state.release} onChange={handleReleaseOnChange}  />

            <Button
                color={"primary"}
                variant={"contained"}
                disableElevation
                disabled={state.saving}
                onClick={saveRelease}
            >
                {state.saving ? "Loading" : "Save changes"}
            </Button>

            <h2 style={{textAlign: "left"}}>Audience</h2>

            Your release will go to {state.order?.audience.length} journalists

            <h2 style={{textAlign: "left"}}>Send you release</h2>

            <h4 style={{color: "black"}}>Make sure you have saved any changes to your release before sending.</h4>

            <div className="flex-row margin-h-md">
                <Button
                    variant={"contained"}
                    color="primary"
                    disableElevation
                >
                    Approve: Send Now
                </Button>

                <Button
                    variant={"contained"}
                    color="primary"
                    disableElevation
                >
                    Approve: Schedule
                </Button>

                <Button
                    variant={"contained"}
                    color="primary"
                    disableElevation
                >
                    Return for review
                </Button>
            </div>
        </div>
    </div>
}
