class roomUser {
    constructor(id, defaultRole = "default") {
        this.userID = id;
        this.online = false;
        this.roles = [defaultRole];
        this.compiledPermissions = [];
        this.banned = false;
        this.banLength = null;
        this.unbanDate = null;
        this.banReason = null;
    }
}

module.exports = roomUser;