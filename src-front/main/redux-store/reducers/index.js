import { combineReducers } from 'redux';

import LoaderReducer from '$redux-reducers/loader-reducer';
import MessageReducer from '$redux-reducers/message-reducer';

const rootReducer = combineReducers({
    messages: MessageReducer
    , loader: LoaderReducer
});

export default rootReducer;