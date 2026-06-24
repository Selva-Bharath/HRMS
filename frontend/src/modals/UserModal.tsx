import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { apiService } from "../services/api";
import { User, Role, Team } from "../types/index";

interface UserModalProps {
  user: User | null;
  onClose: (refresh: boolean) => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [formData, setFormData] = useState({
    employee_id: 0,
    full_name: "",
    email: "",
    password: "",
    company_email: "",
    role_id: 0,
    team_id: 0,
    access_level: "user",
    status: "active",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name,
        email: user.email,
        password: "",
        company_email: user.company_email || "",
        role_id: user.role_id,
        team_id: user.team_id || 0,
        access_level: user.access_level,
        status: user.status,
      });
    }
    fetchRolesAndTeams();
  }, [user]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees/");

      const data = await response.json();

      console.log("Employees:", data);

      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setEmployees([]);
    }
  };

  const fetchRolesAndTeams = async () => {
    try {
      const [rolesRes, teamsRes] = await Promise.all([
        apiService.getRoles(),
        apiService.getTeams(),
      ]);
      setRoles(rolesRes.data.roles);
      setTeams(teamsRes.data.teams);
    } catch (error) {
      console.error("Failed to fetch roles/teams");
    }
  };

  const handleTeamChange = async (teamId: string) => {
    setFormData({
      ...formData,
      team_id: teamId,
      role_id: "",
    });

    try {
      const response = await apiService.getRolesByTeam(teamId);

      setRoles(response.data.roles);
      setRoles(response.data.roles);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        await apiService.updateUser(user.id, formData);
        toast.success("User updated successfully");
      } else {
        if (!formData.password) {
          toast.error("Password is required for new users");
          setLoading(false);
          return;
        }
        await apiService.createUser(formData);
        toast.success("User created successfully");
      }
      onClose(true);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const employeeId = Number(e.target.value);

    setSelectedEmployee(employeeId);

    const employee = employees.find((emp: any) => emp.id === employeeId);

    if (!employee) return;

    const selectedRole = roles.find((role: any) => role.name === employee.role);

    const selectedTeam = teams.find(
      (team: any) => team.name === employee.designation,
    );

    setFormData({
      ...formData,

      employee_id: employee.id,

      full_name: `${employee.first_name} ${employee.last_name}`,

      email: employee.email,

      role_id: selectedRole ? selectedRole.id : "",

      team_id: selectedTeam ? selectedTeam.id : "",
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-white px-6 py-5">
            <div>
              <div className="text-xl font-bold text-slate-900">
                {user ? "Edit User" : "Create New User"}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Fill in the employee access and account details below
              </div>
            </div>

            <button
              onClick={() => onClose(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Select Employee
              </label>
              <select
                value={selectedEmployee}
                onChange={handleEmployeeSelect}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="">Select Employee</option>
                {employees.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Company Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.company_email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      company_email: e.target.value,
                    })
                  }
                  placeholder="employee@s4carlisle.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password {!user && "*"}
                </label>
                <input
                  type="password"
                  required={!user}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder={
                    user ? "Leave blank to keep same" : "Enter password"
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Team *
                </label>
                <select
                  required
                  value={formData.team_id}
                  onChange={(e) => handleTeamChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Role *
                </label>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  value={formData.role_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select Role</option>

                  {roles.map((role: any) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Access Level
                </label>

                <select
                  value={formData.access_level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      access_level: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="hr">HR</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={() => onClose(false)}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Saving..." : user ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserModal;
