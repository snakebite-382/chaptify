import { React, Component } from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import RoomListEntry from './Room-list-entry';
import '../../css/room-list.scss'

class RoomList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            error: false,
            rooms: []
        };
    }

    async componentDidMount() {
        this.setState({ isLoading: true });
        let { user, getAccessTokenSilently } = this.props.auth0;

        let token = await getAccessTokenSilently();

        let options = {
            method: "GET",
            url: `${process.env.REACT_APP_SERVER_URL}/api/users/get-metadata/${user.sub}`,
            headers: { 'authorization': `Bearer ${token}` },
        };

        let response = await axios.request(options);

        if (response.status !== 200) {
            this.setState({isLoading: false})
            this.setState({ error: true });
        } else if (typeof response.data.rooms !== "object") {
            this.setState({rooms: []});
            this.setState({isLoading: false});
        } else {

            let rooms = [];
            console.log("LOOP")
            for(let room of response.data.rooms) {
                // get room info based on id
                console.log("LOOP")
                options = {
                    method: "GET",
                    url: `${process.env.REACT_APP_SERVER_URL}/api/rooms/get-room-data/basics/${room._id}`,
                    headers: { 'authorization': `Bearer ${token}` },
                };

                await axios.request(options).then(res => {
                    rooms.push(res.data);
                    console.table(res.data);
                });

            }

            console.log("SETTING")
            this.setState({rooms: rooms});

            this.setState({ isLoading: false });
        }
    };

    render() {

        if (this.state.isLoading) {
            return (
                <div >
                    <h1 > Loading... </h1>
                </div>
            )
        } else if (this.state.error) {
            return (
                <div className = "error" >
                    <h1 > An Internal Server Error Occurred </h1>
                </div >
            )
        }

        if (this.state.rooms.length === 0) {
            return (
                <h2>You are not in any rooms</h2>
            )
        }

        return (
            <ul className = "room-list" >
                {this.state.rooms.map(room => (
                    <RoomListEntry name={room.name} owner={room.ownerName} id={room.id}/>
                ))}
            </ul>
        );
    }
}

export default withAuth0(RoomList);