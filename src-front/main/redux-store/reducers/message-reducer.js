import { SHOW_ALERT, HIDE_ALERT, CLEAR_ALERTS } from '$redux-actions/message';

const INITIAL_STATE = {
    alerts: []
};

export default function MessageReducer(state = INITIAL_STATE, action) {

    switch(action.type){
        case SHOW_ALERT:
            return {...state, alerts: [...state.alerts, { message: action.payload , visible: true }]};
        case HIDE_ALERT:
            return {...state, alerts: state.alerts.filter((item, index) => index !== action.payload) };
        case CLEAR_ALERTS:
            return {...INITIAL_STATE };
        default:
            return state;
    }
}