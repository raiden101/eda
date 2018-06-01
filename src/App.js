import React, { Component, Fragment } from 'react';
import Login from './components/Login/Login';
import Default from './components/Default/Default';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';
class App extends Component {
    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Fragment>
                        <Route path="/" component={() => <Default/>} exact />
                        <Route path="/login" component={() => <Login/>} exact />
                        <Route path="/admin" component={() => <b>admin</b>} exact />
                    </Fragment>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
