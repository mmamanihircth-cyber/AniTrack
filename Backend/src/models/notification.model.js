import mongoose from 'mongoose';
import { USER_COLLECTION_NAME } from './user.model.js';

const notificationSchema = new mongoose.Schema(
    {
        usuario_destino_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: USER_COLLECTION_NAME, 
            required: true
        },
        tipo: {
            type: String,
            required: true,
            enum: ['like', 'dislike', 'respuesta', 'invitacion'] 
        },
        mensaje: {
            type: String,
            required: true 
        },
        leido: {
            type: Boolean,
            default: false 
        },
        fecha: {
            type: Date,
            default: Date.now
        },
        redirection_url: { type: String }
    }
);

export const NOTIFICATION_COLLECTION_NAME = 'Notification';
const Notification = mongoose.model(NOTIFICATION_COLLECTION_NAME, notificationSchema);

export default Notification;