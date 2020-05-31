import React, { Fragment } from 'react';
import spinner from './32.gif';

export const Spinner = () => {
    return (
        <Fragment>
            <img src={spinner}
            style ={{width:'20px',margin:'auto',display:'block'}} 
            alt='Loading.....'
            />
        </Fragment>
    )
}


export default Spinner;

