import { LOADING_START, LOADING_END} from '$redux-actions/loader';

const INITIAL_STATE = { visible: true , calls: [] };

export default function LoaderReducer(state = INITIAL_STATE, action) {

    switch(action.type) {
        case LOADING_START:

            return {...state, calls: [...state.calls, true ], visible: [...state.calls, true ].length > 0};
        case LOADING_END:
            if(state.calls.length == 0){

                return state;
            } else {

                return {...state, calls: state.calls.slice(1), visible: state.calls.slice(1).length > 0};
            }            
        default:
            return state;
    }
}