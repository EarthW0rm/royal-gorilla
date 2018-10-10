
import { ShowAlert, HideAlert } from '$redux-actions/message';
import { Alert } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

class AlertDisclaimer extends React.Component {

    render(){
        const list = this.props.alerts || [];

        return list.map((alert, index) => {
            return (
                <Alert key={index} color="danger" isOpen={alert.visible} toggle={
                    () => { 
                    this.props.HideAlert(index); 
                } 
                } fade={true}>
                    <span className="alert-disclaimer__message">
                        {alert.message}
                    </span>
                </Alert>
            );
        });
        
    }
}

const mapStateToPropd = (state) => ({alerts: state.messages.alerts });
const mapDispatchToProps = (dispatch) => bindActionCreators({ShowAlert, HideAlert}, dispatch);
export default connect(mapStateToPropd, mapDispatchToProps)(AlertDisclaimer);