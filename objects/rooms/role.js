class Role {
    constructor(name, heirarchyLevel, permissions = {}, nameColor = "#000000") {
        this.name = name;
        this.heirarchyLevel = heirarchyLevel;
        this.permissions = permissions;
        this.nameColor = nameColor;
    }
}

module.exports = Role;