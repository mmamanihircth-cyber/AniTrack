import Review from '../models/review.model.js';
import UserList from '../models/userList.model.js';
import Notification from '../models/notification.model.js';
import ServerError from '../helpers/serverError.helper.js';
import mongoose from 'mongoose';

class InteractionController {
    async createOrUpdateReview(request, response) {
    try {
        const usuario_id = request.user.id; 
        const { anime_id, puntuacion, comentario } = request.body;

        if (!anime_id || !puntuacion) {
            return response.status(400).json({ 
                ok: false, 
                message: "El ID del anime y la puntuación son obligatorios" 
            });
        }

        const review = await Review.findOneAndUpdate(
            { usuario_id: usuario_id, anime_id }, 
            { puntuacion, comentario },
            { new: true, upsert: true }
        ).populate('usuario_id', 'username avatarUrl'); 

        if (!review) {
            return response.status(400).json({ 
                ok: false, 
                message: "No se pudo crear la review" 
            });
        }

        return response.status(200).json({
            ok: true,
            review
        });

    } catch (error) {
        console.error("Error detallado en el backend:", error);
        return response.status(500).json({ 
            ok: false, 
            message: "Error al procesar el comentario" 
        });
    }
}
async toggleLike(request, response) {
    try {
        const usuario_id = request.user.id;            
        const { review_id } = request.params;

        const review = await Review.findById(review_id);
        if (!review) throw new ServerError("No se encontró el comentario", 404);
        review.dislikes = review.dislikes.filter(id => id.toString() !== usuario_id);
        const yaTieneLike = review.likes.includes(usuario_id);
        if (yaTieneLike) {
            review.likes = review.likes.filter(id => id.toString() !== usuario_id);
        } else {
            review.likes.push(usuario_id);
            if (review.usuario_id.toString() !== usuario_id) {
                const animeId = review.anime_id || review.animeId || 'comentarios';

                await Notification.create({
                    usuario_destino_id: review.usuario_id,
                    tipo: 'like',
                    mensaje: `¡A un usuario le gustó tu comentario!`,
                    leido: false,
                    redirection_url: `/anime/${animeId}#review-${review._id}`
                });
            }
        }

        await review.save();
        return response.status(200).json({ ok: true, message: yaTieneLike ? "Like removido" : "Like agregado", data: { likes: review.likes.length } });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ ok: false, message: "Error al procesar el like" });
    }
}
    async toggleDislike(request, response) {
        try {
            const usuario_id = request.user.id;
            const { review_id } = request.params;

            const review = await Review.findById(review_id);
            if (!review) throw new ServerError("No se encontró el comentario", 404);

            review.likes = review.likes.filter(id => id.toString() !== usuario_id);

            const yaTieneDislike = review.dislikes.includes(usuario_id);
            if (yaTieneDislike) {
                review.dislikes = review.dislikes.filter(id => id.toString() !== usuario_id);
            } else {
                review.dislikes.push(usuario_id);
            }

            await review.save();
            return response.status(200).json({ ok: true, message: yaTieneDislike ? "Dislike removido" : "Dislike agregado", data: { dislikes: review.dislikes.length } });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ ok: false, message: "Error al procesar el dislike" });
        }
    }
    async addReply(request, response) {
        try {
            const usuario_id = request.user.id;
            const { review_id } = request.params;
            const { texto } = request.body;

            if (!texto || texto.trim() === "") throw new ServerError("El texto de la respuesta no puede estar vacío", 400);

            const review = await Review.findById(review_id);
            if (!review) throw new ServerError("No se encontró el comentario", 404);

            review.respuestas.push({ usuario_id, texto });
            await review.save();
            if (review.usuario_id.toString() !== usuario_id) {
                await Notification.create({
                    usuario_destino_id: review.usuario_id,
                    tipo: 'respuesta',
                    mensaje: `Un usuario respondió a tu comentario: "${texto.substring(0, 20)}..."`,
                    leido: false
                });
            }

            return response.status(201).json({ ok: true, message: "Respuesta publicada", data: { respuestas: review.respuestas } });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ ok: false, message: "Error al publicar la respuesta" });
        }
    }

    async addOrUpdateInList(request, response) {
    try {
        const usuario_id = request.user.id;
        const { anime_id, estado } = request.body;

        if (!anime_id || !estado) {
            throw new ServerError("Faltan campos obligatorios", 400);
        }

        let itemLista = await UserList.findOne({
            usuario_id,
            anime_id
        });

        if (!itemLista) {

            itemLista = await UserList.create({
                usuario_id,
                anime_id,
                estado
            });

        } else {

            itemLista.estado = estado;

            await itemLista.save();

        }

        return response.status(200).json({
            ok: true,
            message: `Anime guardado en tu lista como: ${estado}`,
            data: { itemLista }
        });

    } catch (error) {

        console.error(error);

        return response.status(500).json({
            ok: false,
            message: "Error al actualizar tu lista"
        });

    }
}
async toggleFavorite(request, response) {
    try {
        const { anime_id } = request.body;

        if (!anime_id) {
            return response.status(400).json({
                ok: false,
                message: "El ID del anime es obligatorio"
            });
        }
        const usuario_id = new mongoose.Types.ObjectId(request.user.id);

        let itemLista = await UserList.findOne({
            usuario_id: usuario_id,
            anime_id: anime_id
        });
        if (!itemLista) {
            itemLista = await UserList.create({
                usuario_id: usuario_id,
                anime_id: anime_id,
                estado: "plan",
                favorito: true
            });

            return response.status(201).json({
                ok: true,
                favorite: true,
                message: "Anime agregado a favoritos",
                data: { itemLista }
            });
        }
        itemLista.favorito = !itemLista.favorito;
        await itemLista.save();

        return response.status(200).json({
            ok: true,
            favorite: itemLista.favorito,
            message: itemLista.favorito
                ? "Anime agregado a favoritos"
                : "Anime eliminado de favoritos",
            data: { itemLista }
        });

    } catch (error) {
        console.error("Error real en backend:", error); 
        return response.status(500).json({
            ok: false,
            message: error.message || "Error al actualizar favoritos"
        });
    }
}
    async getMyList(request, response) {
        try {
            const usuario_id = request.user.id;
            const miLista = await UserList.find({ usuario_id });

            return response.status(200).json({
                ok: true,
                data: { miLista }
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ ok: false, message: "Error al obtener tu lista" });
        }
    }
async getMyFavorites(request, response) {

    try {

        const usuario_id = request.user.id;

        const favoritos = await UserList.find({
            usuario_id,
            favorito: true
        });

        return response.status(200).json({
            ok: true,
            data: { favoritos }
        });

    } catch (error) {

        console.error(error);

        return response.status(500).json({
            ok: false,
            message: "Error al obtener favoritos"
        });

    }

}
    async getReviewsByAnime(request, response) {
        try {
            const { anime_front_id } = request.params;
            const reviews = await Review.find({ anime_id: anime_front_id })
                .populate('usuario_id', 'nombre email imagen_url') 
                .populate('respuestas.usuario_id', 'nombre imagen_url') 
                .sort({ fecha_publicacion: -1 });

            return response.status(200).json({
                ok: true,
                data: { reviews }
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ ok: false, message: "Error al obtener comentarios" });
        }
    }
}

const interactionController = new InteractionController();
export default interactionController;