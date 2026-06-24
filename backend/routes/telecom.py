from flask import Blueprint, jsonify, request
from models.database import db
from models.telecom import TelecomDirectory
from datetime import datetime

telecom_bp = Blueprint("telecom", __name__, url_prefix="/api/telecom")


# ─────────────────────────────────────────────
# GET  /api/telecom/
# Query params:
#   ?search=   — filter by team_name, extension_number, department_name
#   ?department= — filter by exact department_name
#   ?status=   — Active | Inactive
#   ?sort=ext  — sort by extension_number ASC
#   ?page=1    — page number (default 1)
#   ?per_page=10 — records per page (default 10)
# ─────────────────────────────────────────────
@telecom_bp.route("/", methods=["GET"])
def get_all():
    try:
        query = TelecomDirectory.query

        # Search
        search = request.args.get("search", "").strip()
        if search:
            like = f"%{search}%"
            query = query.filter(
                db.or_(
                    TelecomDirectory.team_name.ilike(like),
                    TelecomDirectory.extension_number.ilike(like),
                    TelecomDirectory.department_name.ilike(like),
                    TelecomDirectory.contact_person.ilike(like),
                )
            )

        # Department filter
        department = request.args.get("department", "").strip()
        if department:
            query = query.filter_by(department_name=department)

        # Status filter
        status = request.args.get("status", "").strip()
        if status in ("Active", "Inactive"):
            query = query.filter_by(status=status)

        # Sort
        sort = request.args.get("sort", "")
        if sort == "ext":
            query = query.order_by(TelecomDirectory.extension_number.asc())
        else:
            query = query.order_by(TelecomDirectory.id.asc())

        # Pagination
        page     = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))
        paginated = query.paginate(page=page, per_page=per_page, error_out=False)

        # Dashboard stats (always from full unfiltered table)
        total_records = TelecomDirectory.query.count()
        active_count  = TelecomDirectory.query.filter_by(status="Active").count()
        dept_count    = db.session.query(
            db.func.count(db.func.distinct(TelecomDirectory.department_name))
        ).scalar()
        thirty_days_ago = datetime.utcnow().replace(hour=0, minute=0, second=0) \
                          .__class__(datetime.utcnow().year, datetime.utcnow().month, datetime.utcnow().day) \
                          .__class__(*[datetime.utcnow().timetuple()[:3]])
        # simpler approach
        from datetime import timedelta
        cutoff = datetime.utcnow() - timedelta(days=30)
        recent_count = TelecomDirectory.query.filter(
            TelecomDirectory.created_at >= cutoff
        ).count()

        # Unique departments for filter dropdown
        depts = db.session.query(TelecomDirectory.department_name)\
            .distinct()\
            .order_by(TelecomDirectory.department_name)\
            .all()
        departments = [d[0] for d in depts]

        return jsonify({
            "success": True,
            "data": [r.to_dict() for r in paginated.items],
            "pagination": {
                "page":       paginated.page,
                "per_page":   paginated.per_page,
                "total":      paginated.total,
                "total_pages": paginated.pages,
                "has_next":   paginated.has_next,
                "has_prev":   paginated.has_prev,
            },
            "stats": {
                "total":      total_records,
                "active":     active_count,
                "departments": dept_count,
                "recent":     recent_count,
            },
            "departments": departments,
        }), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ─────────────────────────────────────────────
# GET  /api/telecom/<id>
# ─────────────────────────────────────────────
@telecom_bp.route("/<int:id>", methods=["GET"])
def get_one(id):
    try:
        record = TelecomDirectory.query.get(id)
        if not record:
            return jsonify({"success": False, "message": "Record not found"}), 404
        return jsonify({"success": True, "data": record.to_dict()}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ─────────────────────────────────────────────
# POST /api/telecom/
# Body (JSON):
#   extension_number*, department_name*, team_name*,
#   contact_person, direct_number, location, status
# ─────────────────────────────────────────────
@telecom_bp.route("/", methods=["POST"])
def create():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400

        # Required fields
        required = ["extension_number", "department_name", "team_name"]
        missing  = [f for f in required if not data.get(f, "").strip()]
        if missing:
            return jsonify({
                "success": False,
                "message": f"Missing required fields: {', '.join(missing)}"
            }), 422

        # Duplicate extension check
        exists = TelecomDirectory.query.filter_by(
            extension_number=data["extension_number"].strip()
        ).first()
        if exists:
            return jsonify({
                "success": False,
                "message": f"Extension number {data['extension_number']} already exists"
            }), 409

        record = TelecomDirectory(
            extension_number = data["extension_number"].strip(),
            department_name  = data["department_name"].strip(),
            team_name        = data["team_name"].strip(),
            contact_person   = data.get("contact_person", "").strip() or None,
            direct_number    = data.get("direct_number", "").strip() or None,
            location         = data.get("location", "").strip() or None,
            status           = data.get("status", "Active"),
        )
        db.session.add(record)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Telecom record created successfully",
            "data": record.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


# ─────────────────────────────────────────────
# PUT  /api/telecom/<id>
# Body (JSON): any subset of fields to update
# ─────────────────────────────────────────────
@telecom_bp.route("/<int:id>", methods=["PUT"])
def update(id):
    try:
        record = TelecomDirectory.query.get(id)
        if not record:
            return jsonify({"success": False, "message": "Record not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400

        # Duplicate extension check (skip self)
        new_ext = data.get("extension_number", "").strip()
        if new_ext and new_ext != record.extension_number:
            conflict = TelecomDirectory.query.filter_by(
                extension_number=new_ext
            ).first()
            if conflict:
                return jsonify({
                    "success": False,
                    "message": f"Extension number {new_ext} already exists"
                }), 409

        # Apply updates
        updatable = [
            "extension_number", "department_name", "team_name",
            "contact_person", "direct_number", "location", "status"
        ]
        for field in updatable:
            if field in data:
                setattr(record, field, data[field].strip() if data[field] else None)

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Record updated successfully",
            "data": record.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


# ─────────────────────────────────────────────
# PATCH /api/telecom/<id>/toggle-status
# Toggles Active ↔ Inactive
# ─────────────────────────────────────────────
@telecom_bp.route("/<int:id>/toggle-status", methods=["PATCH"])
def toggle_status(id):
    try:
        record = TelecomDirectory.query.get(id)
        if not record:
            return jsonify({"success": False, "message": "Record not found"}), 404

        record.status = "Inactive" if record.status == "Active" else "Active"
        db.session.commit()

        return jsonify({
            "success": True,
            "message": f"Status updated to {record.status}",
            "data": record.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


# ─────────────────────────────────────────────
# DELETE /api/telecom/<id>
# ─────────────────────────────────────────────
@telecom_bp.route("/<int:id>", methods=["DELETE"])
def delete(id):
    try:
        record = TelecomDirectory.query.get(id)
        if not record:
            return jsonify({"success": False, "message": "Record not found"}), 404

        db.session.delete(record)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Record deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500