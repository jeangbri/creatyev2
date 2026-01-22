import axios from 'axios';
import { decrypt } from '@repo/shared'; // Wait, decrypt is in web? 
// I need encryption logic in Shared or duplicated. 
// I'll duplicate encryption logic in worker/utils or move to shared.
// For speed, I'll put it in `apps/worker/src/utils.ts`
import { decrypt } from './utils';

const GRAPH_URL = 'https://graph.facebook.com/v21.0';

export async function sendDM(accessToken: string, recipientId: string, text: string) {
    try {
        const decryptedToken = decrypt(accessToken);
        const res = await axios.post(`${GRAPH_URL}/me/messages`, {
            recipient: { id: recipientId },
            message: { text }
        }, {
            params: { access_token: decryptedToken }
        });
        return res.data;
    } catch (e: any) {
        console.error('Send DM Error', e.response?.data || e.message);
        throw new Error(JSON.stringify(e.response?.data || e.message));
    }
}

export async function replyComment(accessToken: string, commentId: string, text: string) {
    try {
        const decryptedToken = decrypt(accessToken);
        const res = await axios.post(`${GRAPH_URL}/${commentId}/replies`, {
            message: text
        }, {
            params: { access_token: decryptedToken }
        });
        return res.data;
    } catch (e: any) {
        // Sometimes use /comments edge on the comment ID
        console.error('Reply Comment Error', e.response?.data || e.message);
        throw new Error(JSON.stringify(e.response?.data || e.message));
    }
}
