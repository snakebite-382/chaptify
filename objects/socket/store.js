class Store {
    constructor(id, user, channel) {
        this.storage = {
            id: id,
            user: user,
            channel: channel,
        }
    }

    set = (key, value) => {
        switch (key) {
            case "user":
                this.storage.user = value;
                break;
            case "channel":
                this.storage.channel = value;
                break;
            default:
                return "ERROR"
        }
    }

    get = (searchTerm) => {
        switch (searchTerm) {
            case "id":
                return this.storage.id;
            case "user":
                return this.storage.user;
            case "channel":
                return this.storage.channel;
            default:
                return "ERROR"
        }
    }
}

module.exports = Store