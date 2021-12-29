import {React, Component} from 'react';
import { withRouter } from 'react-router';
import Button from '../Button';

class RoomListEntry extends Component {
    render() {
        return (
            <li className="room-list-entry">
                <h2 className="room-name">{this.props.name}</h2>
                <h2 className="room-owner">{this.props.owner}</h2>
                <Button type="primary" text="Enter" onClick={() => {
                    this.props.history.push(`/rooms/chat?roomID=${this.props.id}`);
                }}/>
            </li>
        );
    }
}

export default withRouter(RoomListEntry);