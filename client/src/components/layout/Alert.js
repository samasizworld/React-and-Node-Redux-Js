import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const Alert = props => {
    const {alerts}=props;
    // checking alerts array is null or not then check length and then map through it
    //and remember alerts  has msg alertType and id object 
    //i.e alerts=[{msg,alertType,id}]
    return (alerts !==null && alerts.length>0 && alerts.map(alert=>(
        <div key ={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
        </div>
    )));
}

Alert.propTypes = {
alerts:PropTypes.array.isRequired
}

const mapStateToProps =state=>({
alerts:state.alertReducer
});

export default connect(mapStateToProps)(Alert);
