from flask import Blueprint, jsonify

from models.notification import Notification

notification_bp = Blueprint(
    "notifications",
    __name__
)


@notification_bp.route(
    "/<manager_name>",
    methods=["GET"]
)
def get_notifications(manager_name):

    notifications = Notification.query.filter_by(
        receiver_name=manager_name
    ).order_by(
        Notification.created_at.desc()
    ).all()

    return jsonify([
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "is_read": n.is_read,
            "created_at": (
                n.created_at.isoformat()
            )
        }
        for n in notifications
    ])