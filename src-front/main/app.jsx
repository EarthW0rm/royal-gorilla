import React from 'react'
import Routes from './routes'
import Menu from '../template/menu'



export default props => (
    <div>
        <Menu />
        <div className="container">
            <Routes/>
        </div>
    </div>
)