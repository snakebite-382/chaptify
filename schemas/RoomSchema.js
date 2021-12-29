const mongoose = require("mongoose");

const RoomScheme = new mongoose.Schema({
    ownerID: {
        type: String
    },
    roomName: {
        type: String
    },
    userList: {
        type: Array
    },
    settings: {
        type: Object
    },
    channels: {
        type: Array
    },
    roles: {
        type: Array
    },
    public: {
        type: Boolean,
    },
    inviteOnly: {
        type: Boolean,
    },
    password: {
        type: String,
    }
})

module.exports = mongoose.model('Room', RoomScheme);