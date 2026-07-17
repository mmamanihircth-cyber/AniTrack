import Notification from '../models/notification.model.js';

class NotificationController {
    async getMyNotifications(request, response) {
        try {
            const usuario_id = request.user.id;
            const notifications = await Notification.find({ usuario_destino_id: usuario_id })
                .sort({ fecha: -1 });

            return response.status(200).json({
                ok: true,
                data: { notifications }
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ ok: false, message: "Error al obtener notificaciones" });
        }
    }
    async markAsRead(request, response) {
        try {
            const { notification_id } = request.params;

            await Notification.findByIdAndUpdate(notification_id, { leido: true });

            return response.status(200).json({
                ok: true,
                message: "Notificación marcada como leída"
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ ok: false, message: "Error al actualizar la notificación" });
        }
    }
}

const notificationController = new NotificationController();
export default notificationController;