import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import interactionController from '../controllers/interaction.controller.js';
import workspacefeedcontroller from '../controllers/workspaceFeed.controller.js'

const interactionRouter = express.Router();

interactionRouter.get("/workspace/:workspace_id", authMiddleware, workspaceFeedController.getFeedByWorkspace);

// Publicar un nuevo comentario/post en el foro de un Workspace específico
interactionRouter.post("/workspace/:workspace_id", authMiddleware, workspaceFeedController.createPost);


/* ==========================================
   RESEÑAS DE ANIME Y LISTAS (EXISTENTE)
   ========================================== */

// Reseñas e interacciones de animes individuales
interactionRouter.post("/review", authMiddleware, interactionController.createOrUpdateReview);
interactionRouter.get("/review/:anime_front_id", interactionController.getReviewsByAnime);

// Likes / Dislikes / Respuestas a las reseñas
interactionRouter.put("/review/:review_id/like", authMiddleware, interactionController.toggleLike);
interactionRouter.put("/review/:review_id/dislike", authMiddleware, interactionController.toggleDislike);
interactionRouter.post("/review/:review_id/reply", authMiddleware, interactionController.addReply);

// Gestión de listas personales y favoritos del usuario
interactionRouter.post("/list", authMiddleware, interactionController.addOrUpdateInList);
interactionRouter.get("/list", authMiddleware, interactionController.getMyList);
interactionRouter.post("/favorite", authMiddleware, interactionController.toggleFavorite);
interactionRouter.get("/favorite", authMiddleware, interactionController.getMyFavorites);

export default interactionRouter;