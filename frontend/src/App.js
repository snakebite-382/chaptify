import { React, Component} from 'react'
import {
    Switch,
    Route,
    withRouter
} from "react-router-dom";
import ProtectedRoute from "./auth/protected-route";
import { withAuth0 } from "@auth0/auth0-react";
import Home from './pages/Home';
import Dashboard from "./pages/Dashboard";
import Room from './pages/Room';
import CreateRoom from "./pages/Create-room";
import Error404 from "./pages/404";
import Navbar from "./components/NavComponents/Navbar";
import Loading from "./components/Loading";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {isLoading: false};
    }

    setLoading = (loading) => {
        this.setState({isLoading: loading});
    }

    render () {
        let authIsLoading = this.props.auth0.isLoading;
        const { isAuthenticated} = this.props.auth0;

        if(this.state.isLoading || authIsLoading) {
            return <Loading/>
        }

        let homeRoute;

        if(isAuthenticated) {
        homeRoute =  <ProtectedRoute exact path="/" component={Dashboard}/>
        } else {
            homeRoute = <Route exact path="/" component={Home}/>
        }

        return (
            <div className = "App" >
                {this.props.location.pathname === '/rooms/chat' ? null : <Navbar/>}
                <div className="page">
                    <Switch>
                        {homeRoute}
                        <ProtectedRoute path="/rooms/create" component={CreateRoom}/>
                        <ProtectedRoute path="/rooms/chat" component={Room}/>
                        <Route path="*" component={Error404}/>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default withRouter(withAuth0(App));