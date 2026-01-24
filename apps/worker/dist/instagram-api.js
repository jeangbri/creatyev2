"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDM = sendDM;
exports.replyComment = replyComment;
const axios_1 = __importDefault(require("axios"));
const shared_1 = require("@repo/shared"); // Wait, decrypt is in web? 
const GRAPH_URL = 'https://graph.facebook.com/v21.0';
async function sendDM(accessToken, recipientId, text) {
    try {
        const decryptedToken = (0, shared_1.decrypt)(accessToken);
        const res = await axios_1.default.post(`${GRAPH_URL}/me/messages`, {
            recipient: { id: recipientId },
            message: { text }
        }, {
            params: { access_token: decryptedToken }
        });
        return res.data;
    }
    catch (e) {
        console.error('Send DM Error', e.response?.data || e.message);
        throw new Error(JSON.stringify(e.response?.data || e.message));
    }
}
async function replyComment(accessToken, commentId, text) {
    try {
        const decryptedToken = (0, shared_1.decrypt)(accessToken);
        const res = await axios_1.default.post(`${GRAPH_URL}/${commentId}/replies`, {
            message: text
        }, {
            params: { access_token: decryptedToken }
        });
        return res.data;
    }
    catch (e) {
        // Sometimes use /comments edge on the comment ID
        console.error('Reply Comment Error', e.response?.data || e.message);
        throw new Error(JSON.stringify(e.response?.data || e.message));
    }
}
