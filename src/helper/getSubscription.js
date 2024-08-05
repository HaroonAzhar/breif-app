export const getSubscription = (subscription) => {
    try {
        const sub = subscription?.toLowerCase();
        if (sub.includes("pro")) {
            return "pro";
        }
        if (sub.includes("starter")) {
            return "starter";
        }
        return null;
    } catch (e) {
        return null;
    }
};
