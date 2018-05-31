import React, { Component, Fragment } from 'react';
import Login from './components/Login/Login';
import { BrowserRouter } from 'react-router-dom';
import checkAuth from './checkAuth';
import { Redirect, Route } from 'react-router-dom';
class App extends Component {
    state = {
        status:2
    };
    componentDidMount() {
        checkAuth().then((data) => {
            this.setState({...data});
        }).catch(err => console.log);
    }
    render() {
        let renderItem = <b>Loading...</b>
        if(!this.state.status)
            renderItem = <Redirect to="/login" />
        else if(this.state.status === 1){
            if(this.state.admin)
                renderItem = <Redirect to="/admin" />
            else
                renderItem = <b>Normal route</b>
        }
        return (
            <div className="App">
                <BrowserRouter>
                    <Fragment>
                        <Route path="/" component={() => renderItem} exact />
                        <Route path="/login" component={() => <Login/>} exact />
                        <Route path="/admin" component={() => <b>admin</b>} exact />
                    </Fragment>
                </BrowserRouter>
                </div>
        );
    }
}

export default App;
