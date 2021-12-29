const axios = require('axios').default;

let getUserMetaData = async(id, res) => {
    let options = {
        method: 'GET',
        url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${id}`,
        headers: { authorization: `Bearer ${process.env.AUTH0_ACCESS_TOKEN}` }
    };

    await axios.request(options).then((response) => {
        res.status(200).send(JSON.stringify(response.data.user_metadata));
    }).catch(err => {
        console.error(err);
        res.status(500).send("INTERNAL SERVER ERROR")
    });
}

let getUserName = async(id, res = false) => {
    let options = {
        method: 'GET',
        url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${id}`,
        headers: { authorization: `Bearer ${process.env.AUTH0_ACCESS_TOKEN}` }
    };

    let response = await axios.request(options).catch(err => {
        console.error(err);
        if (res) res.status(500).send("INTERNAL SERVER ERROR");
        else return null
    });

    if (res) res.status(200).send(JSON.stringify(response.data.name));
    else {
        return response.data.name;
    }

    return null;
}


module.exports = { getUserMetaData, getUserName };