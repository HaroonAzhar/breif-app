import React, {useEffect, useState} from "react";
import {Order, OrderMapper} from "../../../types/order";
import {getMyOrders} from "../../../app/api";
import OrderPreviewComponent from "../Order/OrderPreviewComponent/OrderPreviewComponent";

interface State {
    orders: Order[];
}

export const PastOrdersComponent = () => {
    const [state, setState] = useState<State>({orders: []});

    const fetchData = async () => {
        const data = await getMyOrders();
        const _orders: Order[] = data.map((d: any) => OrderMapper(d));
        setState({...state, orders: _orders});
    }

    useEffect(() => {
        fetchData().then(() => console.log("Component loaded"));
    }, [])

    return <div>
        <h2>Past orders</h2>

        {state.orders.map(order => <OrderPreviewComponent order={order}/>)}
    </div>
}
