import mongoose from "mongoose";
import { WORKSPACE_COLLECTION_NAME } from "./workspace.model.js";
import { USER_COLLECTION_NAME } from "./user.model.js";

const WORKSPACE_REF_NAME = "Workspace";
const USER_REF_NAME = "User";

const interactionSchema = new mongoose.Schema({
    fk_workspace_id: {
        type: mongoose.Schema.ObjectId, 
        required: true,
        ref: WORKSPACE_REF_NAME 
    },
    fk_user_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: USER_REF_NAME 
    },
    contenido: {
        type: String,
        required: true,
        trim: true,
        maxLength: 1000 
    },
    fecha_creacion: {
        type: Date,
        default: Date.now,
        required: true
    }
});

export const INTERACTION_COLLECTION_NAME = "Interaction";
const Interaction = mongoose.model(INTERACTION_COLLECTION_NAME, interactionSchema);

export default Interaction;