const express = require("express");
const { checkJwt } = require("../check-jwt");
const { getUserMetaData, getUserName } = require('./Users.service');

const router = express.Router();

router.get('/get-metadata/:user_id', checkJwt, (req, res) => {
    getUserMetaData(req.params.user_id, res);
})

router.get('/get-username/:user_id', checkJwt, (req, res) => {
    getUserName(req.params.user_id, res);
})

module.exports = router;