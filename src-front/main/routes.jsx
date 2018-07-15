import React from 'react'
import {  BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import Todo from './todo/todo'
import About from './about/about'

export default props => (
    <Switch>
        <Route exact path="/" component={About} />
        <Route path="/todos" component={About} />
        <Route path="/about" component={About} />
        <Route component={Todo} />
    </Switch>
)