export const 
    SHOW_ALERT = 'SHOW_ALERT'
    , HIDE_ALERT = 'HIDE_ALERT'
    , CLEAR_ALERTS = 'CLEAR_ALERTS';

export const ShowAlert = (message) => {
    return { type: SHOW_ALERT, payload: message};
};

export const HideAlert = (alert_index) => {
    return { type: HIDE_ALERT, payload: alert_index };
};

export const ClearAlerts = () => {
    return { type: CLEAR_ALERTS };
};