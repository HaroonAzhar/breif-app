import React, {useEffect, useState} from "react";
import {Order, OrderMapper, OrderStatus} from "../../../types/order";
import {getMyOrders} from "../../../app/api";
import OrderPreviewComponent from "../Order/OrderPreviewComponent/OrderPreviewComponent";
import {useParams} from "react-router-dom";

interface State {
    orders: Order[]
}

export const OrderListComponent = () => {
    const {type} = useParams();

    const [state, setState] = useState<State>({
        orders: []
    });

    const fetchData = async () => {
        const data = await getMyOrders();
        let _orders: Order[] = data.map((d: any) => OrderMapper(d));

        const today = new Date();

        if (type === 'past') {
            _orders = _orders.filter(order => order.orderStatus !== 'in_progress' && order.orderStatus !== 'waiting_approval' && !(order.orderStatus === OrderStatus.APPROVED_RELEASE_SCHEDULED && order.scheduledFor.getTime() > today.getTime()));
        } else {
            _orders = _orders.filter(order => order.orderStatus === 'in_progress' || order.orderStatus === 'waiting_approval' || (order.orderStatus === OrderStatus.APPROVED_RELEASE_SCHEDULED && order.scheduledFor.getTime() > today.getTime()));
        }

        setState({...state, orders: _orders});
    }

    useEffect(() => {
        fetchData().then(() => console.log("Component loaded"));
    }, [type]);

    return <div>
        <h2>{type === "past" ? "Past orders" : "Current orders"}</h2>
        {state.orders.map(order => <OrderPreviewComponent order={order}/>)}
    </div>
}
