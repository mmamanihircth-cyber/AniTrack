import Interaction from "../models/interaction.model.js";

class InteractionRepository {
    async create(workspace_id, user_id, contenido) {
        return await Interaction.create({
            fk_workspace_id: workspace_id,
            fk_user_id: user_id,
            contenido
        });
    }
    async getById(interaction_id) {
        return await Interaction.findById(interaction_id);
    }
    async deleteById(interaction_id) {
        return await Interaction.findByIdAndDelete(interaction_id);
    }
    async getByWorkspaceId(workspace_id) {
        try {
            const result = await Interaction
                .find({ fk_workspace_id: workspace_id })
                .populate('fk_user_id', 'nombre imagen_url') 
                .sort({ fecha_creacion: -1 });
            if (!result || result.length === 0) {
                return [];
            }
            const feed_mapped = result.map((interaction) => {
                if (!interaction) return null;
                return new InteractionWithUserInfo(interaction);
            }).filter(Boolean); 

            return feed_mapped;

        } catch (error) {
            console.error("Error en InteractionRepository.getByWorkspaceId:", error);
            return []; 
        }
    }
}

const interactionRepository = new InteractionRepository();
export default interactionRepository;

class InteractionWithUserInfo {
    constructor(raw_interaction) {
        this.post_id = raw_interaction._id;
        this.workspace_id = raw_interaction.fk_workspace_id;
        this.contenido = raw_interaction.contenido;
        this.fecha_creacion = raw_interaction.fecha_creacion;
        this.user_id = raw_interaction.fk_user_id ? raw_interaction.fk_user_id._id : null;
        this.user_nombre = raw_interaction.fk_user_id ? raw_interaction.fk_user_id.nombre : "Usuario";
        this.user_avatar = raw_interaction.fk_user_id ? (raw_interaction.fk_user_id.imagen_url || "/Avatars/avatar1.png") : "/Avatars/avatar1.png";
    }
}