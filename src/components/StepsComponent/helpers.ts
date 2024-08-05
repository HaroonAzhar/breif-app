import {RequestStatus} from "./types";

export function generateBasket(data: any) {
    const steps = Object.keys(data);

    return steps.map(stepId => {
        if (stepId === "username" || stepId === "created" || stepId === "status") {
            return "";
        }

        if (data[stepId].singleValue) {
            return {description: data[stepId].metaDescription, value: [data[stepId].value]}
        }

        const options = Object.keys(data[stepId]);

        const values = options.map(optionId => {
            const option = data[stepId][optionId];

            if (option.metaDescription && option.value) {
                if (typeof option.value === "boolean" && option.value === true) {
                    return option.metaDescription;
                } else {
                    return option.metaDescription + " : " + option.value;
                }
            } else {
                return "";
            }
        });

        return {
            description: data[stepId].metaDescription,
            value: values
        }
    });
}

export function getOrderStatus(status: number) {
    switch (status) {
        case RequestStatus.IN_PROGRESS:
            return 'In Progress';
        case RequestStatus.READY_FOR_APPROVAL:
            return 'Ready for approval';
        case RequestStatus.DISTRIBUTED:
            return 'Distributed';
    }

    return "Unknown";
}


export const backConfirm = async () => {
    let event = window.confirm("Use the Previous Step button to go back instead. Otherwise you will lose your progress!");
    if (event) {
        window.history.pushState(null, "", window.location.href);
    }
}

export const confirm = (e: any) => {
    const confirmationMessage = "\o/";
    e.returnValue = confirmationMessage;
    return confirmationMessage;
}
