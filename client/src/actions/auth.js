import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    AUTH_ERROR,
    USER_LOADED,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE} from './types';
import { setAlert } from './alert';
import axios from 'axios';

//import setauth token it is function not a component
import setAuthToken from '../utils/setAuthToken';

//LoadUser
export const loadUser=()=>dispatch=>{
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }
    axios.get('/api/auth').then(res=>{
        dispatch({type:USER_LOADED,
        payload:res.data});

    }).catch(err=>{
        dispatch({
            type:AUTH_ERROR
        });

    });
};

//Register User
export const register =({name,email,password})=> dispatch =>{
    const config ={
        headers:{
            'Content-Type':'application/json'
        }
    };
    
    const body =JSON.stringify({name,email,password});

    axios
    .post('/api/users',body,config)
    .then(res=>{
        dispatch({
            type:REGISTER_SUCCESS,
            payload:res.data
        });
        dispatch(loadUser());
    })
    .catch(err=>{
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger')))
        }
        dispatch({
            type:REGISTER_FAIL
        });

    });


};

//Login
export const login =(email,password)=> dispatch =>{
    const config ={
        headers:{
            'Content-Type':'application/json'
        }
    };
    
    const body =JSON.stringify({email,password});

    axios
    .post('/api/auth',body,config)
    .then(res=>{
        dispatch({
            type:LOGIN_SUCCESS,
            payload:res.data
        });
        dispatch(loadUser());
    })
    .catch(err=>{
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger')))
        }
        dispatch({
            type:LOGIN_FAIL
        });

    });


};

//Logout
export const logout =()=> async dispatch=>{
    dispatch({type:CLEAR_PROFILE});
    dispatch({type:LOGOUT});
}

