import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import interactionController from '../controllers/interaction.controller.js';
import workspacefeedcontroller from '../controllers/workspaceFeed.controller.js'

const interactionRouter = express.Router();

interactionRouter.get('/review/anime/:anime_front_id', (req, res, next) => {
    return interactionController.getReviewsByAnime(req, res, next);
});


interactionRouter.use(authMiddleware);


interactionRouter.post('/review', (req, res, next) => {
    return interactionController.createOrUpdateReview(req, res, next);
});


interactionRouter.post('/review/:review_id/like', (req, res, next) => {
    return interactionController.toggleLike(req, res, next);
});


interactionRouter.post('/review/:review_id/dislike', (req, res, next) => {
    return interactionController.toggleDislike(req, res, next);
});


interactionRouter.post('/review/:review_id/reply', (req, res, next) => {
    return interactionController.addReply(req, res, next);
});


interactionRouter.post('/list', (req, res, next) => {
    return interactionController.addOrUpdateInList(req, res, next);
});


interactionRouter.get('/list', (req, res, next) => {
    return interactionController.getMyList(req, res, next);
});


interactionRouter.post('/favorite', (req, res, next) => {
    return interactionController.toggleFavorite(req, res, next);
});


interactionRouter.get('/favorite', (req, res, next) => {
    return interactionController.getMyFavorites(req, res, next);
});


interactionRouter.get('/workspace/:workspace_id', (req, res, next) => {
    return workspacefeedcontroller.getFeedByWorkspace(req, res, next);
});


interactionRouter.post('/workspace/:workspace_id', (req, res, next) => {
    return workspacefeedcontroller.createPost(req, res, next);
});

export default interactionRouter;