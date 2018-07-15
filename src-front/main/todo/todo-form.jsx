import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Grid  from '../../template/grid'
import IconButton from '../../template/icon-button'
import { changeDescription, searchTodos, addTodo, clear } from './todoActions'

class TodoForm extends Component{

    constructor(props){
        super(props);

        this.keyHandler = this.keyHandler.bind(this);
    }

    componentWillMount(){
        this.props.searchTodos();
    }
    
    keyHandler(e){
        const { addTodo, searchTodos, description } = this.props

        if(e.key === 'Enter')
        {
            e.shiftKey ? searchTodos() : addTodo(description);
        } else if (e.key === 'Escape'){
            this.props.clear()
        }
    }

    render(){
        const { addTodo, searchTodos, description, clear } = this.props

        return(
            <div role="form" className="todo__todo-form row">
                <Grid cols="12 9 10">
                    <input type="text" name="" id="description" className="form-control"
                        placeholder="Adicione uma tarefa" 
                        value={this.props.description}
                        onKeyUp={this.keyHandler}
                        onChange={this.props.changeDescription}/>
                </Grid>

                <Grid  cols="12 3 2">
                    <div className="btn-group">
                        <IconButton style="primary" icon="plus" onClick={() => addTodo(description) }/>
                        <IconButton style="info" icon="search" onClick={searchTodos}/>
                        <IconButton style="default" icon="close" onClick={clear}/>
                    </div>
                </Grid>
            </div>
        )
    }
}

const mapStateToPropd = state => ({description: state.todo.description})
const mapDispatchToProps = dispatch => 
    bindActionCreators({changeDescription, searchTodos, addTodo, clear}, dispatch)

export default connect(mapStateToPropd, mapDispatchToProps)(TodoForm)