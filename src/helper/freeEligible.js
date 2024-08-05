import moment from 'moment';

export const isFreeElegible = (dateOfSubscription, lastOrderDate) => {
    console.log("dateOfSubscription", "lastOrderDate", dateOfSubscription, lastOrderDate)
    try {
        if (!lastOrderDate) return true;
        const _dateOfSubscription = moment(dateOfSubscription);
        const _todayDate = moment();
        const _lastOrderDate = moment(lastOrderDate);

        const _subscriptionDays = _todayDate.diff(_dateOfSubscription, "day") % 30;
        const _lastOrderDays = _todayDate.diff(_lastOrderDate, "day");
        console.log("_lastOrderDays", _lastOrderDays, "_subscriptionDays", _subscriptionDays)
        if (_lastOrderDays > 30) {
            return true;
        }
        if (_subscriptionDays < _lastOrderDays) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
};

export const isSendPressReleaseFreeElegible = (dateOfSubscription, lastOrderDate) => {
    try {
        if (!lastOrderDate) return true;
        const _dateOfSubscription = moment(dateOfSubscription);
        const _todayDate = moment();
        const _lastOrderDate = moment(lastOrderDate);

        const _subscriptionDays = _todayDate.diff(_dateOfSubscription, "day") % 30;
        const _lastOrderDays = _todayDate.diff(_lastOrderDate, "day");
        if (_lastOrderDays > 30) {
            return true;
        }
        if (_subscriptionDays < _lastOrderDays) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
};
