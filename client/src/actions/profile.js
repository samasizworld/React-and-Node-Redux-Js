import axios from 'axios';
import {setAlert} from './alert';

import {GET_PROFILE,PROFILE_ERROR} from './types';

export const getCurrentProfile=()=>dispatch=>{
    axios.get('/api/profile/me').then(res=>{
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        })
    }).catch( err=>{
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    });
};


//create or update profile

export const createProfile =(formData,history,edit=false) => dispatch=> {
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    axios.post('api/profile' ,formData, config).then(res=>{
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });
        dispatch(setAlert(edit?'Profile Updated':'Profile Created','success'));
        if(!edit){
            history.push('/dashboard') //redirecting to dashboard
        }

    }).catch(err=>{
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger')))
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })

    })
}