const mongoose = require('mongoose');
const Room = require("../../schemas/RoomSchema");
const roomUser = require("../../objects/rooms/roomUser");
const role = require("../../objects/rooms/role");
const channel = require('../../objects/rooms/channel');
const axios = require('axios').default;
const hash = require('crypto').createHash('md5');

const createRoom = async(res, user, name, public, inviteOnly = false, password = null) => {
    let ownerID = user.sub;
    let owner = new roomUser(ownerID, "owner");
    let ownerRole = new role("owner", 0, { owner: true });
    let defaultRole = new role("default", 1);
    let generalChannel = new channel("general", ["*"], ["*"]);

    if (password) password = hash.update(password).digest('hex');

    let newRoom = new Room({ ownerID: ownerID, roomName: name, userList: [owner], settings: {}, channels: [generalChannel], roles: [ownerRole, defaultRole], public: public, inviteOnly: inviteOnly, password: password })

    let response = await newRoom.save();

    let roomID = response._id;

    // get client metadata
    let options = {
        method: 'GET',
        url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${ownerID}`,
        headers: { authorization: `Bearer ${process.env.AUTH0_ACCESS_TOKEN}` }
    };

    await axios.request(options).then(async response => {

        let data;

        if (response.data.user_metadata.rooms) {
            newMetadata = response.data.user_metadata;
            newMetadata.rooms.push({ name: name, _id: roomID });
        } else {
            newMetadata = { rooms: [{ name: name, _id: roomID }] };
        }

        options = {
            method: 'PATCH',
            url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${ownerID}`,
            headers: { authorization: `Bearer ${process.env.AUTH0_ACCESS_TOKEN}`, 'content-type': 'application/json' },
            data: {
                user_metadata: newMetadata
            }
        }

        await axios.request(options).then(function(response) {}).catch(function(error) {
            res.status(500).send("INTERNAL ERROR");
            console.error(err);
            return false;
        });

    }).catch(err => {
        res.status(500).send("INTERNAL ERROR");
        console.error(err);
        return false;
    });

    res.status(200).send("Created!");
    return true;
}

const getRoomBasics = async(id) => {
    let roomDetails = await Room.findById(id).exec();

    if (!roomDetails.ownerID) {
        return false;
    }

    let options = {
        method: 'GET',
        url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${roomDetails.ownerID}`,
        headers: { authorization: `Bearer ${process.env.AUTH0_ACCESS_TOKEN}` }
    };

    let res = await axios.request(options).catch(err => {
        if (err) {
            console.error(error);
        }
    })

    if (res.status == 200) {
        let result = {
            name: roomDetails.roomName,
            ownerID: roomDetails.ownerID,
            ownerName: res.data.name,
            public: roomDetails.public,
            inviteOnly: roomDetails.inviteOnly,
            id: roomDetails._id
        }
        return result
    }

    return false
}



module.exports = {
    createRoom,
    getRoomBasics
}