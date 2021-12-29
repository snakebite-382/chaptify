import {React, Component} from 'react';
import { io as socketio } from 'socket.io-client';
import { withAuth0 } from '@auth0/auth0-react';
import Loading from '../components/Loading';
import Navbar from '../components/Chat/RoomComponents/NavComponents/Navbar';
import Sidebar from '../components/Chat/RoomComponents/SidebarComponents/Sidebar';
import ChatArea from '../components/Chat/RoomComponents/ChatAreaComponents/ChatArea';

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            chatArea: {
                loading: false,
                channelName: '',
                messages: [],
                requestedChannel: '',
            }
        }
    }

    componentDidMount () {
        // socket.io initialization
        this.io = socketio.connect(process.env.REACT_APP_SERVER_URL + '/')
         // identifying info
        let params = (new URL(document.location)).searchParams;
        this.roomID = params.get('roomID'); // using the this keyward allows the roomID, user object, and io object (most importantly), to be able to be reused throughout the component for things like sending messages and other events outside of componentDidMount
        let { user } = this.props.auth0;
        this.user = user;


        //! TESTING, LOGS RECIEVED EVENTS
        this.io.onAny((event, ...args) => {
            if(args.length === 0) {
                args = "NONE";
            }
            console.log(`Recieved event: ${event} \nwith args: ${args}`);
        });


        this.io.on("GET USER INFO", () => {
            // we need the room ID to identify which room to join on the backend
            // we also need to send them to user object to make sure the user trying to join the room is allowed to do so
            this.io.emit("RETURN USER INFO", {room: this.roomID, user: this.user});
        })

        this.io.on("JOIN SUCCESS", data => {
            console.log(data);
            this.roomData = data;
            this.renderChannel("general")
            this.setState({isLoading: false});
        })

        this.io.on("JOIN CHANNEL SUCCESS", data => {
            console.log(data)
            window.history.replaceState(null, null, `#${data.name}`);

            let newState = this.state.chatArea;
            newState.loading = false;
            newState.renderChannel = data.name;
            newState.messages = data.messages;
            this.setState({chatArea: newState})
        })
    }

    renderChannel = (channelName) => {
        // first we need to put the chat area into a loading screen
        let newState = this.state.chatArea;
        newState.loading = true;
        newState.renderChannel = channelName;
        this.setState({chatArea: newState});
        // then we need to send an event to the backend asking to join a channel
        this.io.emit("JOIN CHANNEL", {channel: channelName, user: this.user})
        // this creates the request which will be handled by an event listener created in componentDidMount
    }

    render () {
        if(this.state.isLoading) {
            return <Loading/>
        }

        return (
            <>
            <Navbar roomName={this.roomData.roomName} username={this.user.name}/>
            <Sidebar users={this.roomData.users} channels={this.roomData.channels}/>
            <ChatArea roomState={this.state.chatArea}/>
            </>
        )
    }
}

export default withAuth0(Room);