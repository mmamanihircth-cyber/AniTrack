import mongoose from 'mongoose';
import { USER_COLLECTION_NAME } from './user.model.js';

const userListSchema = new mongoose.Schema(
    {
        usuario_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: USER_COLLECTION_NAME, 
            required: true
        },
        anime_id: {
            type: String, 
            required: true
        },
        estado: {
            type: String,
            enum: ["watching","completed", "plan", "paused", "dropped"], 
            required: true,
            default: 'planeado'
        },
        favorito: {
            type: Boolean,
            default: false
        },
        fecha_agregado: {
            type: Date,
            default: Date.now
        }
    }
);

userListSchema.index({ usuario_id: 1, anime_id: 1 }, { unique: true });

export const USER_LIST_COLLECTION_NAME = 'UserList';
const UserList = mongoose.model(USER_LIST_COLLECTION_NAME, userListSchema);
export default UserList;