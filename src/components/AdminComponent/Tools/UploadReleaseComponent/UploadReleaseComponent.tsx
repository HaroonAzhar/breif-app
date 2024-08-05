import React, {useEffect, useState} from "react";
import RichTextEditor, {EditorValue} from "react-rte";
import Editor from "../../../RichTextEditor/TextEditor";
import {Order} from "../../../../types/order";
import Select from "react-select";
import {getAllOrders} from "../../../../app/api";

//TODO: DELETE
const UploadReleaseComponent = () => {
    const [release, setRelease] = useState<string>('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

    useEffect(() => {
        getAllOrders().then(data => {
            setOrders(data);
        }).catch(error => {
            console.log(error);
        });
    }, []);

    const orderOptions = orders.map(order => {
        return {
            value: order.id,
            label: `${order.orderNumber}`
        }
    });

    const handleReleaseOnChange = (value: string) => {
        setRelease(value);
    };

    const handleOrderOnChange = (next: { value: number, label: string } | null) => {
        if (next) {
            setSelectedOrder(next.value);
        }
    };

    return <div className={"page"}>
        <div className="content margin-v-md">
            <h1>Upload a release</h1>

            <h2 style={{textAlign: "left"}}>Release</h2>

            {/* <RichTextEditor value={release} onChange={handleReleaseOnChange}/> */}

            <Editor value={release} onChange={handleReleaseOnChange}  />

            <h2 style={{textAlign: "left"}}>Order</h2>

            <Select
                options={orderOptions}
                onChange={handleOrderOnChange}
            />
        </div>
    </div>
}

export default UploadReleaseComponent;
