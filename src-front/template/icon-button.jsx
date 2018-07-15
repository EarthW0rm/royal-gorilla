import React from 'react'
import IF from './helper/if'

export default props => {
    return(
        <IF test={!props.hide == true}>
            <button onClick={props.onClick} className={`btn btn-${props.style}`}>
                <i className={`fa fa-${props.icon}`}></i>
            </button>
        </IF>
    );
}