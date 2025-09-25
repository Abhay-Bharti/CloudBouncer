const { model, Schema } = require("mongoose");

const BlockedIpSchema = new Schema({
    ip: {
        type: String,
        required: true,
        unique: true
    },
    blockedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const BlockedIp = model("BlockedIp", BlockedIpSchema);

module.exports = BlockedIp;