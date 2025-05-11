import { combineReducers } from '@reduxjs/toolkit';
// Import reducer từ slice
import authenSlice from './authenSlice';
import appSlice from './appSlice';
import chatSlice from './chatSlice';
import scheduleSlice from './scheduleSlice';

const reducers = combineReducers({
    authen: authenSlice,
    app: appSlice,
    chat: chatSlice,
    schedule: scheduleSlice,
});

export default reducers;
