import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  ChevronDown,
  X,
  FolderSearch,
} from "lucide-react";

type ProjectRow = {
  clientName: string;
  projectCode: string;
  projectTitle: string;
  batch: string;
  startDate: string;
  dueDate: string;
  remarks: string;
};

const projectData: ProjectRow[] = [
  {
    clientName: "Elsevier",
    projectCode: "BK-1001",
    projectTitle: "Medical Science",
    batch: "B001",
    startDate: "2026-05-29",
    dueDate: "2026-06-05",
    remarks: "In Progress",
  },
  {
    clientName: "Springer",
    projectCode: "BK-2001",
    projectTitle: "Data Analytics",
    batch: "B002",
    startDate: "2026-05-28",
    dueDate: "2026-06-08",
    remarks: "Pending Review",
  },
  {
    clientName: "WK",
    projectCode: "BK-3001",
    projectTitle: "Health Guide",
    batch: "B003",
    startDate: "2026-05-27",
    dueDate: "2026-06-15",
    remarks: "Assigned",
  },
  {
    clientName: "Pearson",
    projectCode: "BK-4001",
    projectTitle: "Physics Guide",
    batch: "B004",
    startDate: "2026-05-25",
    dueDate: "2026-06-12",
    remarks: "Completed",
  },
  {
    clientName: "McGraw Hill",
    projectCode: "BK-5001",
    projectTitle: "Chemistry Basics",
    batch: "B005",
    startDate: "2026-05-24",
    dueDate: "2026-06-15",
    remarks: "Ready For Print",
  },
];

const clientOptions = ["--ALL--", "Elsevier", "Springer", "Pearson", "WK", "McGraw Hill"];

const ProjectSchedule = () => {
  const [client, setClient] = useState("--ALL--");
  const [projectSearch, setProjectSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectRow | null>(null);

  const filteredData = useMemo(() => {
    if (selectedProject) return [selectedProject];

    const q = projectSearch.toLowerCase().trim();

    return projectData.filter((row) => {
      const matchesClient = client === "--ALL--" || row.clientName === client;
      const matchesProject =
        !q ||
        row.projectCode.toLowerCase().includes(q) ||
        row.projectTitle.toLowerCase().includes(q);

      return matchesClient && matchesProject;
    });
  }, [client, projectSearch, selectedProject]);

  const projectSuggestions = useMemo(() => {
    const q = projectSearch.toLowerCase().trim();
    if (!q) return [];
    return projectData.filter(
      (row) =>
        row.projectCode.toLowerCase().includes(q) ||
        row.projectTitle.toLowerCase().includes(q)
    );
  }, [projectSearch]);

  const getRemarksStyles = (remarks: string) => {
    const styles: Record<string, string> = {
      Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
      "Pending Review": "bg-amber-50 text-amber-700 border-amber-200",
      Assigned: "bg-violet-50 text-violet-700 border-violet-200",
      "Ready For Print": "bg-orange-50 text-orange-700 border-orange-200",
    };
    return styles[remarks] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getRemarksIcon = (remarks: string) => {
    const icons: Record<string, React.ReactNode> = {
      Completed: <CheckCircle size={14} />,
      "In Progress": <Clock size={14} />,
      "Pending Review": <AlertCircle size={14} />,
      Assigned: <FileText size={14} />,
      "Ready For Print": <Calendar size={14} />,
    };
    return icons[remarks] || <FileText size={14} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <FolderSearch size={14} />
                Project Management
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Project Info
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Track project timelines, status, batches, and delivery progress.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Logged in as
              </div>
              <div className="mt-1 font-semibold text-slate-800">Selva Bharath</div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Filter size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
              <p className="text-sm text-slate-500">Search and narrow down projects quickly</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Client
              </label>
              <div className="relative">
                <select
                  value={client}
                  onChange={(e) => {
                    setClient(e.target.value);
                    setSelectedProject(null);
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {clientOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>

            <div className="relative lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Project Info
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => {
                    setProjectSearch(e.target.value);
                    setShowSuggestions(true);
                    setSelectedProject(null);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 150);
                  }}
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Type project code or title..."
                />
              </div>

              {showSuggestions && projectSuggestions.length > 0 && (
                <div className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
                  {projectSuggestions.map((item) => (
                    <button
                      key={`${item.projectCode}-${item.batch}`}
                      type="button"
                      onClick={() => {
                        setSelectedProject(item);
                        setProjectSearch(`${item.projectCode} - ${item.projectTitle}`);
                        setShowSuggestions(false);
                      }}
                      className="flex w-full flex-col border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50"
                    >
                      <span className="text-sm font-semibold text-slate-900">
                        {item.projectCode}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.projectTitle} • {item.clientName}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Project List</h2>
                <p className="text-sm text-slate-500">
                  {filteredData.length} project{filteredData.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {selectedProject && (
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setProjectSearch("");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <X size={16} />
                  Clear selection
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Project Info</th>
                  <th className="px-6 py-4">Batch</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredData.length > 0 ? (
                  filteredData.map((row) => (
                    <tr
                      key={`${row.projectCode}-${row.batch}`}
                      onClick={() => setSelectedProject(row)}
                      className="cursor-pointer transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">
                          {row.clientName}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900">
                            {row.projectCode}
                          </span>
                          <span className="text-xs text-slate-500">
                            {row.projectTitle}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-sm text-slate-600">
                        {row.batch}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {row.startDate}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {row.dueDate}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${getRemarksStyles(
                            row.remarks
                          )}`}
                        >
                          {getRemarksIcon(row.remarks)}
                          {row.remarks}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-14 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="rounded-full bg-slate-100 p-4 text-slate-400">
                          <FileText size={36} />
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-slate-900">
                          No projects found
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Try changing the client filter or search text.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedProject && (
  <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

    {/* Header */}
    <div className="border-b border-slate-200 px-6 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {selectedProject.projectTitle}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete project information and tracking details
          </p>
        </div>

        <button
          onClick={() => setSelectedProject(null)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Close
        </button>
      </div>
    </div>

    {/* Project Summary */}
    <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-4">

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Client
        </p>
        <h3 className="mt-2 text-base font-semibold text-slate-900">
          {selectedProject.clientName}
        </h3>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Project Code
        </p>
        <h3 className="mt-2 text-base font-semibold text-slate-900">
          {selectedProject.projectCode}
        </h3>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Start Date
        </p>
        <h3 className="mt-2 text-base font-semibold text-slate-900">
          {selectedProject.startDate}
        </h3>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Due Date
        </p>
        <h3 className="mt-2 text-base font-semibold text-slate-900">
          {selectedProject.dueDate}
        </h3>
      </div>

    </div>

    {/* Details */}
    <div className="border-t border-slate-200 p-6">

      <h3 className="mb-5 text-lg font-semibold text-slate-900">
        Project Information
      </h3>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500">
            Project Title
          </label>
          <p className="mt-1 text-sm font-medium text-slate-900">
            {selectedProject.projectTitle}
          </p>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500">
            Batch
          </label>
          <p className="mt-1 text-sm font-medium text-slate-900">
            {selectedProject.batch}
          </p>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500">
            Client Name
          </label>
          <p className="mt-1 text-sm font-medium text-slate-900">
            {selectedProject.clientName}
          </p>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500">
            Status
          </label>

          <div className="mt-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${getRemarksStyles(
                selectedProject.remarks
              )}`}
            >
              {getRemarksIcon(selectedProject.remarks)}
              {selectedProject.remarks}
            </span>
          </div>
        </div>

      </div>

      {/* Progress */}
      <div className="mt-8">
        <div className="mb-2 flex justify-between">
          <span className="text-sm text-slate-600">
            Project Progress
          </span>

          <span className="text-sm font-semibold text-slate-900">
            78%
          </span>
        </div>

        <div className="h-2 rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-slate-900"
            style={{ width: "78%" }}
          />
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default ProjectSchedule;