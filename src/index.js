import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './pages/main/Main';
import Map from './pages/map/Map';
import registerServiceWorker from './registerServiceWorker';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link
} from 'react-router-dom'

ReactDOM.render(
    <Router>
        <Switch>
            <Route path="/Map" component={Map} />
            <Route path="/" component={Main} />
        </Switch>
    </Router>,
    document.getElementById('root'));
registerServiceWorker();
