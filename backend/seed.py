"""
seed.py — Populate wms_db with initial data.

Run locally (inside backend/ with venv activated):
    python seed.py

Run inside Docker:
    docker compose exec app python seed.py
"""

from app import app
from models.database import db
from models.user import User, Role, Team, Permission
from models.workflow import Workflow, WorkflowStage
from models.meeting_room import MeetingRoom
from models.telecom import TelecomDirectory
from models.client import Client
from werkzeug.security import generate_password_hash


# ── Teams ─────────────────────────────────────────────────────────────────────

def seed_teams():
    data = [
        {"name": "Administration",  "description": "Admin and HR",                   "workflow_stage": None},
        {"name": "Management",      "description": "Senior management",               "workflow_stage": None},
        {"name": "Pre-Editing",     "description": "Pre-editing and composition",     "workflow_stage": "Pre-Editing"},
        {"name": "Copywriting",     "description": "Copywriting and content",         "workflow_stage": "Copywriting"},
        {"name": "Proofreading",    "description": "Proofreading and review",         "workflow_stage": "Proofreading"},
        {"name": "QA",              "description": "Quality assurance",               "workflow_stage": "QA"},
        {"name": "Delivery",        "description": "Final delivery and dispatch",     "workflow_stage": "Final Delivery"},
    ]
    result = {}
    for item in data:
        team = Team.query.filter_by(name=item["name"]).first()
        if not team:
            team = Team(**item)
            db.session.add(team)
        result[item["name"]] = team
    db.session.flush()
    return result


# ── Roles ─────────────────────────────────────────────────────────────────────

def seed_roles(teams):
    data = [
        {"name": "Admin",               "description": "Full system access",          "team": "Administration"},
        {"name": "HR Manager",          "description": "Human resources manager",     "team": "Administration"},
        {"name": "Manager",             "description": "Team / project manager",      "team": "Management"},
        {"name": "Pre-Editor",          "description": "Pre-editing specialist",      "team": "Pre-Editing"},
        {"name": "Copywriter",          "description": "Copywriting specialist",      "team": "Copywriting"},
        {"name": "Proofreader",         "description": "Proofreading specialist",     "team": "Proofreading"},
        {"name": "QA Analyst",          "description": "Quality assurance analyst",   "team": "QA"},
        {"name": "Delivery Executive",  "description": "Final delivery executive",    "team": "Delivery"},
        {"name": "Employee",            "description": "General employee",            "team": "Administration"},
    ]
    result = {}
    for item in data:
        role = Role.query.filter_by(name=item["name"]).first()
        if not role:
            role = Role(
                name=item["name"],
                description=item["description"],
                team_id=teams[item["team"]].id,
            )
            db.session.add(role)
        result[item["name"]] = role
    db.session.flush()
    return result


# ── Permissions ───────────────────────────────────────────────────────────────

def seed_permissions():
    data = [
        {"name": "view_employees",   "description": "View employee records",            "resource": "employees",  "action": "read"},
        {"name": "manage_employees", "description": "Create and edit employees",        "resource": "employees",  "action": "write"},
        {"name": "view_projects",    "description": "View project records",             "resource": "projects",   "action": "read"},
        {"name": "manage_projects",  "description": "Create and manage projects",       "resource": "projects",   "action": "write"},
        {"name": "view_reports",     "description": "View reports and analytics",       "resource": "reports",    "action": "read"},
        {"name": "manage_users",     "description": "Manage system users",              "resource": "users",      "action": "write"},
        {"name": "manage_payroll",   "description": "Manage payroll",                   "resource": "payroll",    "action": "write"},
        {"name": "approve_leaves",   "description": "Approve or reject leave requests", "resource": "leaves",     "action": "write"},
        {"name": "view_attendance",  "description": "View attendance records",          "resource": "attendance", "action": "read"},
        {"name": "manage_workflows", "description": "Manage workflow configurations",   "resource": "workflows",  "action": "write"},
    ]
    for item in data:
        if not Permission.query.filter_by(name=item["name"]).first():
            db.session.add(Permission(**item))
    db.session.flush()


# ── Users ─────────────────────────────────────────────────────────────────────

def seed_users(roles, teams):
    data = [
        {
            "full_name":     "System Admin",
            "email":         "admin@wms.com",
            "company_email": "admin@company.com",
            "password":      "Admin@1234",
            "role":          "Admin",
            "team":          "Administration",
            "access_level":  "admin",
        },
        {
            "full_name":     "HR Manager",
            "email":         "hr@wms.com",
            "company_email": "hr@company.com",
            "password":      "Hr@12345",
            "role":          "HR Manager",
            "team":          "Administration",
            "access_level":  "manager",
        },
        {
            "full_name":     "Project Manager",
            "email":         "manager@wms.com",
            "company_email": "manager@company.com",
            "password":      "Manager@123",
            "role":          "Manager",
            "team":          "Management",
            "access_level":  "manager",
        },
    ]
    for item in data:
        if not User.query.filter_by(email=item["email"]).first():
            user = User(
                full_name=item["full_name"],
                email=item["email"],
                company_email=item["company_email"],
                password_hash=generate_password_hash(item["password"]),
                role_id=roles[item["role"]].id,
                team_id=teams[item["team"]].id,
                access_level=item["access_level"],
                status="active",
                is_active=True,
            )
            db.session.add(user)
    db.session.flush()


# ── Workflows ─────────────────────────────────────────────────────────────────

def seed_workflows(roles):
    if Workflow.query.filter_by(name="Standard Publishing Workflow").first():
        return

    workflow = Workflow(
        name="Standard Publishing Workflow",
        description="Default workflow for book publishing projects",
        is_active=True,
    )
    db.session.add(workflow)
    db.session.flush()

    stages = [
        {"name": "Pre-Editing",    "order": 1, "sla_hours": 48, "role": "Pre-Editor",         "description": "Manuscript pre-editing and composition"},
        {"name": "Copywriting",    "order": 2, "sla_hours": 72, "role": "Copywriter",          "description": "Copywriting and content corrections"},
        {"name": "Proofreading",   "order": 3, "sla_hours": 24, "role": "Proofreader",         "description": "Final proofreading pass"},
        {"name": "QA",             "order": 4, "sla_hours": 24, "role": "QA Analyst",          "description": "Quality assurance checks"},
        {"name": "Final Delivery", "order": 5, "sla_hours": 12, "role": "Delivery Executive",  "description": "File delivery to client"},
    ]
    for s in stages:
        role = roles.get(s["role"])
        db.session.add(WorkflowStage(
            workflow_id=workflow.id,
            name=s["name"],
            order=s["order"],
            sla_hours=s["sla_hours"],
            required_role_id=role.id if role else None,
            description=s["description"],
            is_active=True,
        ))
    db.session.flush()


# ── Meeting Rooms ─────────────────────────────────────────────────────────────

def seed_meeting_rooms():
    data = [
        {"room_name": "Conference Room A", "location": "HQ", "floor": "1st Floor", "capacity": 10, "room_type": "Conference",  "projector": True,  "tv": True,  "whiteboard": True,  "video_conference": True},
        {"room_name": "Board Room",        "location": "HQ", "floor": "3rd Floor", "capacity": 20, "room_type": "Board Room",  "projector": True,  "tv": True,  "whiteboard": True,  "video_conference": True},
        {"room_name": "Training Room",     "location": "HQ", "floor": "2nd Floor", "capacity": 30, "room_type": "Training",   "projector": True,  "tv": False, "whiteboard": True,  "video_conference": False},
        {"room_name": "Meeting Pod 1",     "location": "HQ", "floor": "1st Floor", "capacity": 4,  "room_type": "Pod",        "projector": False, "tv": True,  "whiteboard": True,  "video_conference": False},
        {"room_name": "Meeting Pod 2",     "location": "HQ", "floor": "2nd Floor", "capacity": 4,  "room_type": "Pod",        "projector": False, "tv": True,  "whiteboard": True,  "video_conference": False},
    ]
    for item in data:
        if not MeetingRoom.query.filter_by(room_name=item["room_name"]).first():
            db.session.add(MeetingRoom(**item, status="Available"))
    db.session.flush()


# ── Telecom Directory ─────────────────────────────────────────────────────────

def seed_telecom():
    data = [
        {"extension_number": "100", "department_name": "Administration", "team_name": "Administration", "contact_person": "System Admin",    "direct_number": "+91-9000000001", "location": "1st Floor"},
        {"extension_number": "101", "department_name": "HR",             "team_name": "Administration", "contact_person": "HR Manager",      "direct_number": "+91-9000000002", "location": "1st Floor"},
        {"extension_number": "200", "department_name": "Pre-Editing",    "team_name": "Pre-Editing",    "contact_person": "Pre-Editing Team","direct_number": "+91-9000000010", "location": "2nd Floor"},
        {"extension_number": "201", "department_name": "Copywriting",    "team_name": "Copywriting",    "contact_person": "Copywriting Team","direct_number": "+91-9000000011", "location": "2nd Floor"},
        {"extension_number": "202", "department_name": "Proofreading",   "team_name": "Proofreading",   "contact_person": "Proofreading Team","direct_number": "+91-9000000012","location": "2nd Floor"},
        {"extension_number": "203", "department_name": "QA",             "team_name": "QA",             "contact_person": "QA Team",         "direct_number": "+91-9000000013", "location": "3rd Floor"},
        {"extension_number": "300", "department_name": "Management",     "team_name": "Management",     "contact_person": "Project Manager", "direct_number": "+91-9000000020", "location": "3rd Floor"},
        {"extension_number": "999", "department_name": "Reception",      "team_name": "Administration", "contact_person": "Front Desk",      "direct_number": "+91-9000000000", "location": "Ground Floor"},
    ]
    for item in data:
        if not TelecomDirectory.query.filter_by(extension_number=item["extension_number"]).first():
            db.session.add(TelecomDirectory(**item, status="Active"))
    db.session.flush()


# ── Clients ───────────────────────────────────────────────────────────────────

def seed_clients():
    data = [
        {"category": "Publisher", "client_type": "Enterprise", "email": "contact@alphabooks.com",  "website": "www.alphabooks.com",  "division": "Academic",  "vendor_number": "VND001", "city": "New York",  "country": "USA",       "status": "active"},
        {"category": "Publisher", "client_type": "SMB",        "email": "info@betapress.co.uk",    "website": "www.betapress.co.uk", "division": "Fiction",   "vendor_number": "VND002", "city": "London",    "country": "UK",        "status": "active"},
        {"category": "Publisher", "client_type": "Enterprise", "email": "projects@gammapub.com",   "website": "www.gammapub.com",   "division": "Technical", "vendor_number": "VND003", "city": "Singapore", "country": "Singapore", "status": "active"},
    ]
    for item in data:
        if not Client.query.filter_by(email=item["email"]).first():
            db.session.add(Client(**item))
    db.session.flush()


# ── Main ──────────────────────────────────────────────────────────────────────

def run():
    with app.app_context():
        print("[*] Seeding teams ...")
        teams = seed_teams()

        print("[*] Seeding roles ...")
        roles = seed_roles(teams)

        print("[*] Seeding permissions ...")
        seed_permissions()

        print("[*] Seeding users ...")
        seed_users(roles, teams)

        print("[*] Seeding workflows ...")
        seed_workflows(roles)

        print("[*] Seeding meeting rooms ...")
        seed_meeting_rooms()

        print("[*] Seeding telecom directory ...")
        seed_telecom()

        print("[*] Seeding clients ...")
        seed_clients()

        db.session.commit()

        print("")
        print("[OK] Database seeded successfully.")
        print("")
        print("Default login credentials:")
        print("  Admin   : admin@wms.com      /  Admin@1234")
        print("  HR      : hr@wms.com         /  Hr@12345")
        print("  Manager : manager@wms.com    /  Manager@123")
        print("")


if __name__ == "__main__":
    run()
