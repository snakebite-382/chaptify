const express = require("express");
const { checkJwt } = require("../check-jwt");
const { createRoom, getRoomBasics } = require("./Rooms.service")

const router = express.Router();

// protected routes need to include the checkJwt method (eg. router.get("/route", checkJwt, callback(req, res)))

router.post("/create", checkJwt, (req, res) => {
    let formData = req.body;
    if (formData.password === "") formData.password = null;
    // [ ] add form validation
    createRoom(res, formData.user, formData.name, formData.public, formData.inviteOnly, formData.password);
})

router.get('/get-room-data/basics/:id', checkJwt, async(req, res) => {
    let result = await getRoomBasics(req.params.id);
    if (result) {
        res.status(200).send(result);
    }
})

module.exports = router;