from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from dotenv import load_dotenv
from routes.payroll_routes import payroll_bp
import os
from extensions import socketio
from socket_events import register_socket_events

from apscheduler.schedulers.background import BackgroundScheduler

from services.checkin_monitor import check_missed_checkins

load_dotenv()

from config.config import Config
from models.database import db, init_db
from middleware.auth import auth_required, role_required
from routes.auth import auth_bp
from routes.users import users_bp
from routes.clients import clients_bp
from routes.projects import projects_bp
from routes.workflow import workflow_bp
from routes.dashboard import dashboard_bp
from routes.employees import employees_bp
from routes.attendance import attendance_bp
from routes.leaves import leave_bp
from routes.communications import communication_bp
from models.shift_request import ShiftRequest
from routes.shift_request import shift_bp
from routes.employee_details import employee_details_bp
from routes.notifications import notification_bp
from routes.meeting_rooms import meeting_rooms_bp

from services.meeting_room_scheduler import complete_old_bookings


def create_app():
    app = Flask(__name__)

    socketio.init_app(app)

    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True
    )

    app.url_map.strict_slashes = False

    app.config.from_object(Config)

    # Register blueprints
    app.register_blueprint(employees_bp, url_prefix="/api/employees")
    app.register_blueprint(attendance_bp, url_prefix="/api/attendance")
    app.register_blueprint(leave_bp, url_prefix="/api/leaves")
    app.register_blueprint(notification_bp, url_prefix="/api/notifications")
    app.register_blueprint(shift_bp, url_prefix="/api/shifts")
    app.register_blueprint(employee_details_bp, url_prefix="/api")
    app.register_blueprint(payroll_bp, url_prefix="/api/payroll")
    app.register_blueprint(meeting_rooms_bp, url_prefix="/api/meeting-rooms")
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(clients_bp, url_prefix='/api/clients')
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    app.register_blueprint(workflow_bp, url_prefix='/api/workflow')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(communication_bp, url_prefix="/api/communications")

    # JWT
    JWTManager(app)

    # Database + migrations
    init_db(app)
    Migrate(app, db)

    # Background scheduler
    scheduler = BackgroundScheduler()

    def run_checkin_monitor():
        with app.app_context():
            check_missed_checkins()

    scheduler.add_job(run_checkin_monitor, "interval", minutes=1)
    scheduler.add_job(complete_old_bookings, "cron", hour=0, minute=0)
    scheduler.start()

    # Health check
    @app.route('/api/health')
    def health_check():
        return jsonify({'status': 'healthy', 'message': 'WMS API is running'})

    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(os.path.join(os.getcwd(), 'uploads'), filename)

    # Serve React SPA for all non-API routes
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        static_folder = os.path.join(os.path.dirname(__file__), 'static')
        if path and os.path.exists(os.path.join(static_folder, path)):
            return send_from_directory(static_folder, path)
        return send_from_directory(static_folder, 'index.html')

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    register_socket_events(socketio)

    return app


# Module-level app used by gunicorn (app:app) and flask CLI (flask db ...)
app = create_app()


if __name__ == '__main__':
    socketio.run(
        app,
        host="0.0.0.0",
        port=5050,
        debug=True,
        allow_unsafe_werkzeug=True
    )
