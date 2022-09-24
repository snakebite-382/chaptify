// ## IMPORTS ## //
const express = require("express");
const path = require("path");
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const socketio = require('socket.io');
const dotenv = require("dotenv");
dotenv.config();


// ## SETUP APP ## //
const clientOrigins = ["http://localhost:3000", "http://localhost:5000", "http://127.0.0.1:3000", "http://127.0.0.1:5000"];

// create our app and get our port
const App = express();
const http = require('http').createServer(App);
const io = socketio(http, {
    cors: {
        origin: clientOrigins,
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 5000;

// ## SECURITY ## //
App.use(cors({ origin: clientOrigins }));
App.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["*", "'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["*", "'self'"],
            imgSrc: ["*", 'data:'],
            connectSrc: [`${process.env.AUTH0_DOMAIN}`, "'self'"],
            frameSrc: ["*", "'self'"],
        },
    }
}));

// ## FORM PARSING ## //
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: true }));

// ## DATABASE ## //
mongoose.connect(process.env.MONGODB_CONNECT_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database'))
    .catch((e) => console.error('Failed to connect to database: ' + e));

// ## IMPORTS ## //
// get a path to frontend static files
const STATIC_PATH = "frontend/build";

// serve files from our frontend first
App.use(express.static(path.join(__dirname, STATIC_PATH)));

// ## API ## //
// then process any api requests
const APIRouter = express.Router();
App.use("/api", APIRouter);
/* add different API routes like so:
const ROUTERNAME = require("./path/to/router/file.router");
APIRouter.use('/route', ROUTERNAME);
*/
const roomsApi = require("./apis/Rooms/Rooms.router");
APIRouter.use("/rooms", roomsApi);

const usersApi = require('./apis/Users/Users.router');
APIRouter.use('/users', usersApi);

// ## SOCKET.IO SERVER ## //
let cachedRooms = []; // a list of rooms cached because more information is needed to complete a request (e.g. on password protected rooms we need to prompt for a password but that is done in two parts so we store the room info here to cut down on the number of requests)
const Room = require('./schemas/RoomSchema');
const { getUserName } = require('./apis/Users/Users.service');

const Store = require('./objects/socket/store');
const { channel } = require("diagnostics_channel");

let activeRooms = [];

io.on("connection", (socket) => {
    io.to(socket.id).emit("GET USER INFO", socket.id)

    socket.on("RETURN USER INFO", async data => {
        // we need to unpack the data
        let room = data.room; // get the room to join if they pass the checks
        let user = data.user; // get the user that we will be checking

        // the checking is pretty simple

        // first get the room

        let roomData
        try {
            roomData = await Room.findById(room).exec();
            for (let [i, userData] of roomData.userList.entries()) {
                roomData.userList[i].username = "" + (await getUserName(userData.userID));
            }
        } catch (error) {
            roomData = null;
        }

        // add a function to add them to the room to reduce repetitive code
        const joinRoom = async() => {
            // and set them to online
            let userEntry;
            for (let entry of roomData.userList) {
                if (entry.userID == user.sub) {
                    userEntry = entry;
                }
            }

            let index = roomData.userList.indexOf(userEntry);
            userEntry.online = true
            roomData.userList[index].online = true

            await roomData.save();
            // have them join the socket room
            socket.join(room);

            let store = new Store(socket.id, user, null, data.room);

            let foundActiveRoom = false;

            activeRooms.forEach(activeRoom => {
                if (activeRoom.id == data.room) {
                    activeRoom.userStores.push(store);
                    activeRoom.userCount++;
                    foundActiveRoom = true;
                }
            })

            if (!foundActiveRoom) {
                let newActiveRoom = {
                    userStores: [],
                    id: data.room,
                    userCount: 1
                }
                newActiveRoom.userStores.push(store);
                activeRooms.push(newActiveRoom);
            }

            io.to(socket.id).emit("JOIN SUCCESS", { roomName: roomData.roomName, users: roomData.userList, channels: roomData.channels }); // this is where we send info needed to load the page
        }

        // if no room is found return a 404 error to the frontend
        if (roomData === null) {
            io.to(socket.id).emit("ERROR 404", "couldn't find requested room");
            return;
        }
        // if the room is found then first we check if it's public
        if (roomData.public) {
            // if it is then boom we let em in
            joinRoom();
            return;
        } else if (roomData.inviteOnly) { // if not then we check if it's invite only
            // if it is we check the user list
            let inRoom = false;

            roomData.userList.forEach(listUser => {
                if (listUser.userID === user.sub && !listUser.banned) {
                    inRoom = true;
                }
            })

            // if they're on it then they're in
            if (inRoom) {
                joinRoom();
                return;
            }

        } else { // if it's not then we need to prompt for a password so we send a GET ROOM PASSWORD event and store the room in the cachedRooms array
            return; // [ ] add password protected code
        }

        io.to(socket.id).emit("ERROR 401", "Unauthorized to access room")
            // they aren't then return a 401 error
    });

    socket.on('JOIN CHANNEL', async data => {
        // get room data
        let room = Array.from(socket.rooms)[1];

        let roomData
        try {
            roomData = await Room.findById(room).exec();
            for (let [i, userData] of roomData.userList.entries()) {
                roomData.userList[i].username = "" + (await getUserName(userData.userID));
            }
        } catch (error) {
            console.error(error)
            roomData = null;
        }

        let allowed;
        let channel = null;

        if (roomData !== null) {
            //get userdata
            let userData;

            roomData.userList.forEach(listUser => {
                if (listUser.userID === data.user.sub) {
                    userData = listUser;
                }
            })


            //get channel data

            roomData.channels.forEach(listChannel => {
                if (listChannel.name == data.channel) {
                    channel = listChannel;
                }
            })


            allowed = (channel.allowedRoles.indexOf("*") > -1 || channel.allowedUsers.indexOf("*") > -1) ? true : false;

            //check roles

            userData.roles.forEach(role => {
                if (channel.allowedRoles.indexOf(role) > -1) {
                    allowed = true;
                }
            })

            //check users
            if (channel.allowedUsers.indexOf(userData.sub) > -1) {
                allowed = true;
            }
        }

        if (roomData === null || channel === null || !allowed) {
            io.to(socket.id).emit("ERROR", "Channel Join Failed")
        } else {


            let activeRoom

            activeRooms.forEach(getRoom => {
                if (getRoom.id == room) {
                    activeRoom = getRoom
                }
            })

            if (activeRoom) {
                activeRoom.userStores.forEach(store => {
                    if (store.storage.id == socket.id) {
                        store.storage.channel = channel;
                    }
                })
            } else return null

            let resData = {};

            resData.name = channel.name;

            if (channel.messages.length > 100) {
                resData.messages = channel.messages.splice(0, 100);
            } else {
                resData.messages = channel.messages;
            }

            io.to(socket.id).emit("JOIN CHANNEL SUCCESS", resData)
        }
    })

    socket.on("SEND MESSAGE", async data => {
        // we already know the channel they're authed for because it's stored on the socket variable server side
        // because we know where they can speak currently we can check the two against eachother and if they mismatch send an error back
        let storeRef;
        let activeRoom;

        for (let i = 0; i < activeRooms.length; i++) {
            if (Array.from(socket.rooms)[1] = activeRooms[i].id) {
                activeRoom = activeRooms[i];
                break;
            }
        }

        for (let i = 0; i < activeRoom.userStores.length; i++) {
            let store = activeRoom.userStores[i];
            if (store.get("id").toString().trim() == socket.id.toString().trim()) {
                storeRef = store;
                break;
            }
        }
        let channel = storeRef.get("channel")

        if (!(data.channel != channel)) {
            io.to(socket.id).emit("ERROR: CHANNEL MISSMATCH", { status: 501, message: `The channel authenticated on the server side doesn't match the requested channel, failed to send message ${data.message} to channel ${data.channel}` })
        }

        // next up is the fun part find the channel and update it
        let room = Array.from(socket.rooms)[1];
        let roomData = await Room.findById(room).exec();

        //reassign channel to be a reference to the actual channel data

        for (i = 0; i < roomData.channels.length; i++) {
            if (roomData.channels[i].name == channel.name) {
                channel = roomData.channels[i];
                break;
            }
        }

        let newMessage = {
            sender: storeRef.storage.user.name,
            message: data.message
        }

        channel.messages.push(newMessage);

        await Room.updateOne({ _id: roomData._id }, { channels: roomData.channels });

        let sendClients = []

        activeRoom.userStores.forEach(userStore => {
            if (userStore.storage.channel.name == channel.name) {
                sendClients.push(userStore.storage.id);
            }
        })


        sendClients.forEach(client => {
            io.to(client).emit("NEW MESSAGE", { message: newMessage })
        })

    })

    socket.on("disconnecting", () => {
        //find the active room

        let activeRoom;

        activeRooms.forEach(room => {
            if (room.id == Array.from(socket.rooms)[1]) {
                activeRoom = room;
            }
        })

        activeRoom.userCount -= 1;

        if (activeRoom.userCount < 1) {
            console.log("delete")
            activeRooms = activeRooms.filter((el) => {
                return el.id != activeRoom.id
            })
        }
    })
})


// ## HANDLE 404 ## //
// then any requests not caught by the API or the frontend files is a 404 however 404s are handled by react router so we send the index.html page which will then handle the 404 with react router
App.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, STATIC_PATH + '/index.html'));
});

// ## START APP ##//
// start app on the specified port and log that the port is open
http.listen(PORT, () => {
    // get token

    var axios = require("axios").default;

    var options = {
        method: 'POST',
        url: 'https://chaptify.us.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        data: {
            grant_type: 'client_credentials',
            client_id: 'KbFUk08Qq24VA03i1mVAkLc3uPKc6V79',
            client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
            audience: process.env.AUTH0_AUDIENCE
        }
    };

    axios.request(options).then(function(response) {
        process.env.AUTH0_ACCESS_TOKEN = response.data.access_token
    }).catch(function(error) {
        console.error(error);
    });

    console.log("Listening on port: " + PORT);
})