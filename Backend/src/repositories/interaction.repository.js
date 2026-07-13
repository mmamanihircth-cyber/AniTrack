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
        const result = await Interaction
            .find({ fk_workspace_id: workspace_id })
            .populate(
                'fk_user_id', 'nombre imagen_url' // Traemos el nombre y el avatar elegido por el usuario para renderizar en el feed
            )
            .sort({ fecha_creacion: -1 }); // Los más recientes arriba de todo

        // Mapeamos los resultados usando el formateador del final del archivo
        const feed_mapped = result.map(
            (interaction) => new InteractionWithUserInfo(interaction)
        );

        return feed_mapped;
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