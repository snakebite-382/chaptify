import { React, Component } from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import RoomList from '../components/DashboardComponents/Room-list';

class Dashboard extends Component {
    render () {
        const { user } = this.props.auth0;
        return (
            <>
            <h1>Hello, {user.name}!</h1>
            <Link to="/rooms/create">Add new room</Link>
            <RoomList/>
            </>
        )
    }
}

export default withAuth0(Dashboard);