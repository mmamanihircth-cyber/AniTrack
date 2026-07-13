import mongoose from "mongoose";
import { WORKSPACE_COLLECTION_NAME } from "./workspace.model.js";
import { USER_COLLECTION_NAME } from "./user.model.js";

const interactionSchema = new mongoose.Schema({
    fk_workspace_id: {
        type: mongoose.Schema.ObjectId, // Copiado exacto de tu modelo de miembros
        required: true,
        ref: WORKSPACE_COLLECTION_NAME // Apunta dinámicamente a tu colección de comunidades/workspaces
    },
    fk_user_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: USER_COLLECTION_NAME // Apunta a tu colección de usuarios para poder hacer el populate
    },
    contenido: {
        type: String,
        required: true,
        trim: true,
        maxLength: 1000 // Un buen margen para teorías de anime o debates largos
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