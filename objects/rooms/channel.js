class Channel {
    constructor(name, allowedRoles, allowedUsers) {
        this.name = name;
        if (allowedRoles.indexOf("owner") === -1) {
            allowedRoles.push("owner");
        }
        this.allowedRoles = allowedRoles;
        this.allowedUsers = allowedUsers;
        this.messages = [];
    }
}

module.exports = Channel;