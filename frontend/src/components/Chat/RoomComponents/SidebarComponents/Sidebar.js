import { React, Component } from 'react';
import '../../../../css/Chat/sidebar.scss';
import UserList from './UserList';
import ChannelList from './ChannelList';

class Sidebar extends Component {


    render() {
        return (
            <div className="sidebar">
                <ChannelList channels={this.props.channels}/>
                <div className="break-line"></div>
                <UserList users={this.props.users}/>
            </div>
        );
    }
}

export default Sidebar;