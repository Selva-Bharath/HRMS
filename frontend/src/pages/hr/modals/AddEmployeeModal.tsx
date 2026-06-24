import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { labelStyle, inputStyle } from "../utils/hrHelpers";

interface AddEmployeeModalProps {
  newEmp: any;
  setNewEmp: (val: any) => void;
  employees: any[];
  teams: any[];
  roles: any[];
  profileImage: any;
  setProfileImage: (val: any) => void;
  onSubmit: (e: any) => void;
  onClose: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  newEmp,
  setNewEmp,
  employees,
  teams,
  roles,
  profileImage,
  setProfileImage,
  onSubmit,
  onClose,
}) => {
  const [filteredRoles, setFilteredRoles] = useState<any[]>([]);
  const [isEmptyField, setIsEmptyField] = useState(false);

  useEffect(() => {
    if (!newEmp.team_id) {
      setFilteredRoles([]);
      return;
    }

    fetch(`/api/employees/roles/${newEmp.team_id}`)
      .then((res) => res.json())
      .then((data) => {
        setFilteredRoles(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [newEmp.team_id]);

  const validateForm = (e: any) => {
    console.log("VALIDATE FORM CALLED");

    const requiredFields = [
      "employee_id",
      "first_name",
      "last_name",
      "email",
      "phone",
      "joining_date",
      "salary",
      "team_id",
      "reporting_manager",
      "role",
      "status",
    ];

    for (const field of requiredFields) {
      console.log(field, "=", newEmp[field]);

      if (
        newEmp[field] === undefined ||
        newEmp[field] === null ||
        newEmp[field] === ""
      ) {
        setIsEmptyField(true);

        return;
      }
    }

    console.log("PROFILE IMAGE =", profileImage);

    if (!profileImage) {
      setIsEmptyField(true);

      return;
    }

    console.log("ALL VALID");

    setIsEmptyField(false);

    console.log("NEW EMP =", newEmp);

    onSubmit(e);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 24,
          width: 920,
          maxWidth: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 24px 60px rgba(15,23,42,0.25)",
          border: "1px solid #E2E8F0",
        }}
      >
        <div
          style={{
            padding: "22px 26px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #EEF2FF, #FFFFFF)",
          }}
        >
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A" }}>
              Add New Employee
            </div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
              HR can create a new employee record with essential details
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "none",
              background: "#F1F5F9",
              width: 38,
              height: 38,
              borderRadius: 12,
              cursor: "pointer",
              fontSize: 22,
              color: "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        <form style={{ padding: 26 }}>
          {isEmptyField && (
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 8,
                color: "#DC2626",
                fontSize: 14,
              }}
            >
              ⚠️ Please fill all mandatory fields including Profile Image before
              adding employee.
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 18,
            }}
          >
            {[
              {
                label: "EMPLOYEE ID *",
                key: "employee_id",
                placeholder: "e.g., EMP001",
              },
              {
                label: "FIRST NAME *",
                key: "first_name",
                placeholder: "e.g., John",
              },
              {
                label: "LAST NAME *",
                key: "last_name",
                placeholder: "e.g., Smith",
              },
              {
                label: "EMAIL *",
                key: "email",
                placeholder: "e.g., john@company.com",
                type: "email",
              },
              {
                label: "PHONE *",
                key: "phone",
                placeholder: "e.g., +91 9876543210",
              },
              { label: "JOINING DATE *", key: "joining_date", type: "date" },
              {
                label: "SALARY *",
                key: "salary",
                placeholder: "e.g., 150000",
                type: "number",
              },
            ].map((field) => (
              <div key={field.key}>
                <label style={labelStyle}>{field.label}</label>
                <input
                  required
                  type={field.type || "text"}
                  value={newEmp[field.key]}
                  onChange={(e) =>
                    setNewEmp({ ...newEmp, [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder || ""}
                  style={inputStyle}
                />
              </div>
            ))}

            <div>
              <label style={labelStyle}>Designation *</label>
              <select
                required
                value={newEmp.team_id || ""}
                onChange={(e) => {
                  const selectedTeam = teams.find(
                    (team) => team.id === Number(e.target.value),
                  );

                  setNewEmp({
                    ...newEmp,

                    team_id: e.target.value,

                    // Save department/designation automatically
                    department: selectedTeam?.name || "",
                    designation: selectedTeam?.name || "",

                    role: "",
                  });
                }}
                style={inputStyle}
              >
                <option value="">Select Team</option>

                {teams?.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>REPORTING MANAGER *</label>
              <select
                required
                value={newEmp.reporting_manager}
                onChange={(e) =>
                  setNewEmp({ ...newEmp, reporting_manager: e.target.value })
                }
                style={inputStyle}
              >
                <option value="">Select Manager</option>
                {employees?.map((emp) => (
                  <option
                    key={emp.id}
                    value={`${emp.first_name} ${emp.last_name}`}
                  >
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Role *</label>
              <select
                required
                value={newEmp.role}
                onChange={(e) =>
                  setNewEmp({
                    ...newEmp,
                    role: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="">Select Role</option>
                {filteredRoles?.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>STATUS *</label>
              <select
                required
                value={newEmp.status}
                onChange={(e) =>
                  setNewEmp({ ...newEmp, status: e.target.value })
                }
                style={inputStyle}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>PROFILE IMAGE *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e: any) => setProfileImage(e.target.files[0])}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 28,
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={onClose}
              type="button"
              style={{
                padding: "12px 20px",
                background: "#F8FAFC",
                color: "#334155",
                border: "1px solid #CBD5E1",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
                minWidth: 120,
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={validateForm}
              style={{
                padding: "12px 20px",
                background: "#4C5C68",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
                minWidth: 140,
              }}
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
