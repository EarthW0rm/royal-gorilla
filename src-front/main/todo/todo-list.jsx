import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import IconButton from '../../template/icon-button'

import { markAsDone, markAsPending, deleteTodo } from './todoActions'

class TodoList extends Component{

    constructor(props){
        super(props);
    }



    
    renderRows(){
        const list = this.props.list || [];
        return list.map(todo => (
            <tr key={todo._id}>
                <td>{todo.description}</td>
                <td>
                    <div className="btn-group pull-right">
                        <IconButton style="success" icon="check" hide={todo.done}
                            onClick={()=> this.props.markAsDone(todo)}>
                        </IconButton>
                        <IconButton style="warning" icon="undo" hide={!todo.done}
                            onClick={()=> this.props.markAsPending(todo)}>
                        </IconButton>
                        <IconButton style="danger" icon="trash-o" hide={!todo.done}
                            onClick={()=> this.props.deleteTodo(todo)}>
                        </IconButton>
                    </div>
                </td>
            </tr>
        ));
    }

    render(){
        return (
            <table className="table todo-list">
                <thead>
                    <tr>
                        <th>Lista das tarefas</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }
}

const mapStateToProps = state => ( {list: state.todo.list} )
const mapDispatchToProps = dispatch => 
    bindActionCreators({markAsDone, markAsPending, deleteTodo}, dispatch)
export default connect(mapStateToProps,  mapDispatchToProps)(TodoList)