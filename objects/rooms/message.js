class message {
    constructor(senderID, messageID, content, channel) {
        this.senderID = senderID;
        this.sent = new Date(Date.now());
        this.messageID = messageID;
        this.content = content;
        this.hasBeenEditted = false;
        this.channel = channel;
    }
}

module.exports = message;