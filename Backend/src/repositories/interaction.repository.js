import Interaction from "../models/interaction.model.js";

class InteractionRepository {

    // 🚀 Crear una nueva interacción (publicación) en el foro de la comunidad
    async create(workspace_id, user_id, contenido) {
        return await Interaction.create({
            fk_workspace_id: workspace_id,
            fk_user_id: user_id,
            contenido
        });
    }

    // 🔍 Obtener un post específico por su ID si lo necesitás en el futuro
    async getById(interaction_id) {
        return await Interaction.findById(interaction_id);
    }

    // 🗑️ Eliminar un post por ID
    async deleteById(interaction_id) {
        return await Interaction.findByIdAndDelete(interaction_id);
    }

    // 📥 Obtener el feed de una comunidad con la información integrada del usuario (nombre e imagen)
    async getByWorkspaceId(workspace_id) {
        try {
            // Buscamos las interacciones de este workspace
            const result = await Interaction
                .find({ fk_workspace_id: workspace_id })
                .populate('fk_user_id', 'nombre imagen_url') // Trae los campos del usuario
                .sort({ fecha_creacion: -1 });

            // 🛡️ Seguridad 1: Si no hay resultados o viene nulo, devolvemos un array vacío al instante sin mapear
            if (!result || result.length === 0) {
                return [];
            }

            // Mapeamos los resultados de forma segura
            const feed_mapped = result.map((interaction) => {
                // 🛡️ Seguridad 2: Si el objeto de la interacción viene corrupto por algún motivo, lo salteamos
                if (!interaction) return null;
                return new InteractionWithUserInfo(interaction);
            }).filter(Boolean); // Filtramos cualquier elemento null que haya quedado

            return feed_mapped;

        } catch (error) {
            // 🛡️ Seguridad 3: Capturamos cualquier fallo de casteo o base de datos y evitamos el crash del servidor
            console.error("Error en InteractionRepository.getByWorkspaceId:", error);
            return []; // Retornamos un array vacío para que el frontend no se rompa
        }
    }
}

const interactionRepository = new InteractionRepository();
export default interactionRepository;


// 📐 Formateador/Mapper idéntico al tuyo para escupir una estructura impecable hacia el controlador
class InteractionWithUserInfo {
    constructor(raw_interaction) {
        this.post_id = raw_interaction._id;
        this.workspace_id = raw_interaction.fk_workspace_id;
        this.contenido = raw_interaction.contenido;
        this.fecha_creacion = raw_interaction.fecha_creacion;
        
        // Desestructuramos el populate del usuario de forma segura
        this.user_id = raw_interaction.fk_user_id ? raw_interaction.fk_user_id._id : null;
        this.user_nombre = raw_interaction.fk_user_id ? raw_interaction.fk_user_id.nombre : "Usuario";
        this.user_avatar = raw_interaction.fk_user_id ? (raw_interaction.fk_user_id.imagen_url || "/Avatars/avatar1.png") : "/Avatars/avatar1.png";
    }
}