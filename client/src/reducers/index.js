import {combineReducers} from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';

export default combineReducers({
    alertReducer:alert,
    authReducer:auth,
    profile
});
