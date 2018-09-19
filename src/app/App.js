import React, { Component} from 'react';
import { render } from 'react-dom';

class App extends Component {

    constructor() {
        super();
        this.state = {
            title: '',
            description: '',
            _id: '',
            tasks: []
        }
        this.addTask = this.addTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        console.log('component mountet');
        this.fetchTasks();
    }

    addTask(e) {
        e.preventDefault();
       // console.log(this.state)
       if(this.state._id){
           fetch(`/api/tasks/${this.state._id}`, {
               method: 'PUT',
               body: JSON.stringify(this.state),
               headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
               }
               
           })
           .then( res => res.json())
           .then(data => {
               M.toast({html: data.status});
               this.setState({
                   title:'',
                   description: '',
                   _id: ''
               });
               this.fetchTasks();
           })
       }else{
            fetch('/api/tasks', {
                method: 'POST',
                body: JSON.stringify(this.state),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                M.toast({html: 'Task Saved'});
                this.setState({title: '', description: ''});
                this.fetchTasks();
            })
            .catch(err => console.log(err))
        }
        
    }

    fetchTasks(){
        fetch('/api/tasks')
        .then(res => res.json()
        .then(data => {
            console.log(data);
            this.setState({
                tasks: data
            });
            console.log(this.state.tasks);
        }))
    }

    deleteTask(id) {
        console.log("deleting:", id);
        if(confirm('Are you sure you want to delete it?')){
            fetch(`/api/tasks/${id}`, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            } )
            .then(res => res.json())
            .then( data => {
                console.log(data);
                M.toast({html: data.status});
                this.fetchTasks();
            })
            .catch(err => console.log(data))
        }
        
    }

    editTask(id) {
        fetch(`/api/tasks/${id}`)
        .then(res => res.json())
        .then( data => {
            this.setState({
                title: data.title,
                description: data.description,
                _id: data._id
            })
        })
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({            
                [name]: value            
        });
    }

    render(){
        return(
            <div>
                {/* NAVIGATION */}
                <nav className="light-blue darken-4">
                    <div className="container">
                        <a className="brand-logo" href="/">MERN Stack</a>
                    </div>
                </nav>

                <div className="container">
                    <div className="row">
                        <div className="col s5">
                            <div className="card">
                                <div className="card-content">
                                {/* Formulari */}
                                    <form onSubmit={this.addTask}>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input name="title" 
                                                value={this.state.title}
                                                onChange={this.handleChange}
                                                type="text" 
                                                placeholder="Task Title"></input>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <textarea name="description" 
                                                value={this.state.description}
                                                onChange={this.handleChange}
                                                placeholder="Task Description"
                                                 className="materialize-textarea"></textarea>
                                            </div>
                                        </div>
                                        <button type="submit" 
                                        className="btn light-blue darken-4">
                                        Send
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col s7">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.tasks.map((task, i) => {
                                            return(
                                                <tr key={i} id={task._id}>
                                                    <td>{task.title}</td>
                                                    <td>{task.description}</td>
                                                    <td>
                                                        <button className="btn light-blue darken-4"
                                                        onClick={() => this.deleteTask(task._id)}>
                                                            <i className="material-icons">
                                                                delete
                                                            </i>
                                                        </button>
                                                        <button className="btn light-blue 
                                                        darken-4" style={{margin: '4px'}}
                                                        onClick={() => this.editTask(task._id)}>
                                                            <i className="material-icons">
                                                                edit
                                                            </i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;