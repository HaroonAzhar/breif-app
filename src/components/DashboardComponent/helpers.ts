import {Order} from "../../types/order";

const mergeOutlets = (order: Order, outlets: { name: string, clicked: number, opened: number }[]) => {
    order.orderDistributions?.map(od => {
        od.outlets.map(outlet => {
            const filteredOutlets = outlets.filter(a => a.name === outlet.name);
            if (filteredOutlets.length > 0) {
                const existingOutlet = filteredOutlets[0];
                existingOutlet.opened += outlet.opened;
                existingOutlet.clicked += outlet.clicked;
            } else {
                outlets.push(outlet);
            }
        });
    });
}

export const getOutletStats = (orders: Order[]): { name: string, contacted: number }[] => {
    const outletStats: { name: string, contacted: number }[] = [];

    for (const order of orders) {
        for (const journalist of order.audience) {
            for (const outlet of journalist.outlet) {
                if (outletStats.find(os => os.name === outlet)) {
                    const index = outletStats.findIndex(os => os.name === outlet);
                    outletStats[index].contacted += 1;
                } else {
                    outletStats.push({name: outlet, contacted: 1});
                }
            }
        }
    }

    return outletStats;
}

export const getTotalOutlets = (orders: Order[]) => {
    const outlets: { name: string, clicked: number, opened: number, contacted: number }[] = [];

    orders.map(order => {
        mergeOutlets(order, outlets);
    });

    return outlets;
}

export const getOutlets = (order: Order) => {
    const outlets: { name: string, clicked: number, opened: number }[] = [];

    mergeOutlets(order, outlets);

    return outlets;
}

export const countStats = (order: Order) => {
    let tmp = {delivered: 0, opened: 0, clicked: 0};
    order.orderDistributions?.map(od => {
        tmp.delivered += Number(od.delivered);
        tmp.opened += Number(od.opened);
        tmp.clicked += Number(od.clicked);
    });

    return tmp;
}
