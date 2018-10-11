import { Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import React from 'react';


class Loader extends React.Component {

    render() {
        return (
            <Modal centered={true} isOpen={this.props.showLoading == true} className="loader-modal">
                <ModalBody>
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </ModalBody>
            </Modal>
        );
    }
}

const mapStateToPropd = (state) => ({ showLoading: state.loader.visible });

export default connect(mapStateToPropd)(Loader);