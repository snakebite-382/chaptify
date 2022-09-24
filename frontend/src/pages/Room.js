import {React, Component} from 'react';
import { io as socketio } from 'socket.io-client';
import { withAuth0 } from '@auth0/auth0-react';
import Loading from '../components/Loading';
import Navbar from '../components/Chat/RoomComponents/NavComponents/Navbar';
import Sidebar from '../components/Chat/RoomComponents/SidebarComponents/Sidebar';
import ChatArea from '../components/Chat/RoomComponents/ChatAreaComponents/ChatArea';
import SettingsContainer from '../components/Chat/SettingsComponents/SettingsContainer';

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            isLoading: true,
            currentView: 'Chat',
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
        this.setState({username: user.name})


        //! TESTING, LOGS RECIEVED EVENTS
        this.io.onAny((event, ...args) => {
            if(args.length === 0) {
                args = "NONE";
            }
            //console.log(`Recieved event: ${event} \nwith args: ${args}`);
        });


        this.io.on("GET USER INFO", () => {
            // we need the room ID to identify which room to join on the backend
            // we also need to send them to user object to make sure the user trying to join the room is allowed to do so
            this.io.emit("RETURN USER INFO", {room: this.roomID, user: this.user});
        })

        this.io.on("JOIN SUCCESS", data => {
            //console.log(data);
            this.roomData = data;
            this.renderChannel("general")
            this.setState({isLoading: false});
        })

        this.io.on("JOIN CHANNEL SUCCESS", data => {
            console.table(data.messages)
            window.history.replaceState(null, null, `#${data.name}`);

            let newState = this.state.chatArea;
            newState.loading = false;
            newState.channelName = data.name;
            newState.messages = data.messages;
            this.setState({chatArea: newState})
        })
    }

    recvMessage = message => {
        console.log(message)
        let newState = this.state.chatArea;
        newState.messages.push(message);
        this.setState({chatArea: newState})
        this.setState()
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

    toggleView = () => {
        if(this.state.currentView === "Chat") {
            this.setState({currentView: "Settings"});
        } else {
            this.setState({currentView: "Chat"});
        }
    }

    render () {
        if(this.state.isLoading) {
            return <Loading/>
        }

        if(this.state.currentView === "Chat") {
            return ( //chat view
                <>
                <Navbar roomName={this.roomData.roomName} username={this.user.name} settingsToggle={this.toggleView}/>
                <Sidebar users={this.roomData.users} channels={this.roomData.channels}/>
                <ChatArea roomState={this.state.chatArea} io={this.io} recvMessage={this.recvMessage} username={this.state.username}/>
                </>
            )
        }

        return ( //settings view
            <>
            <Navbar roomName={this.roomData.roomName} username={this.user.name} settingsToggle={this.toggleView}/>
            <SettingsContainer/>
            </>
        )

    }
}

export default withAuth0(Room);