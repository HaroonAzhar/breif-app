import React, {useState} from "react";
import {Button, TextField} from "@material-ui/core";
import {useHistory, useParams} from "react-router-dom";
import {journalistUnsubscribe} from "../app/api";
import {toast} from "react-toastify";

interface State {
    email: string,
    loading: boolean
}

const JournalistUnsubscribeComponent = () => {
    const {orderId} = useParams();
    const [state, setState] = useState<State>({email: "", loading: false});
    const history = useHistory();

    const handleUnsubscribeOnClick = async () => {
        setState({...state, loading: true});

        const ok = await journalistUnsubscribe({email: state.email, orderId});

        setState({...state, loading: false});

        if (ok) {
            toast("You have been unsubscribed.", {type: "info"});
            history.push("/");
        } else {
            toast("Something went wrong.", {type: "error"});
        }
    }

    const handleEmailOnChange = (next: React.ChangeEvent<HTMLInputElement>) => {
        setState({...state, email: next.target.value});
    }

    return <div className={'page'}>
        <div className={'content margin-v-md'}>
            <h2 style={{textAlign: "left"}}>Unsubscribe from this mailing list</h2>

            <div className={"flex-row"}>
                <TextField
                    label={'Your email'}
                    value={state.email}
                    onChange={handleEmailOnChange}
                    variant={"outlined"}
                />
            </div>
            <div className={"flex-row"}>
                <Button
                    onClick={handleUnsubscribeOnClick}
                    disabled={!state.email || state.loading}
                    variant={"contained"}
                    color={"primary"}
                >
                    {state.loading ? "Loading" : "Unsubscribe"}
                </Button>
            </div>


        </div>
    </div>
}

export default JournalistUnsubscribeComponent;
