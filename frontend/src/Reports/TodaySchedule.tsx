import React, { useMemo, useState } from "react";
import { Search, CalendarDays, Building2 } from "lucide-react";

type MilestoneStatus = "Pending" | "In Progress" | "Completed";

type ScheduleRow = {
  client: string;
  projectNumber: string;
  projectName: string;
  author: string;
  batch: string;
  chapter: string;
  cell: string;
  mssCount: number;
  receivedDate: string;
  dueDate: string;
  projectType: string;
  stage: string;
  planner: string;
  projectedPrinterDate: string;
  milestoneStatus: MilestoneStatus;
};

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const TodaySchedule = () => {
  const currentUser = {
    name: "Selva Bharath",
    team: "Copywriting",
  };

  const departmentData: Record<string, ScheduleRow[]> = {
    Copywriting: [
      {
        client: "Elsevier",
        projectNumber: "PRJ101",
        projectName: "Medical Science Draft",
        author: "John",
        batch: "B001",
        chapter: "Chapter 1",
        cell: "Cell A",
        mssCount: 250,
        receivedDate: getTodayDate(),
        dueDate: "2026-06-05",
        projectType: "Book",
        stage: "Copy Writing",
        planner: "David",
        projectedPrinterDate: "2026-06-10",
        milestoneStatus: "In Progress",
      },
      {
        client: "Pearson",
        projectNumber: "PRJ102",
        projectName: "Learning Content",
        author: "Arun",
        batch: "B002",
        chapter: "Chapter 3",
        cell: "Cell B",
        mssCount: 180,
        receivedDate: getTodayDate(),
        dueDate: "2026-06-06",
        projectType: "Book",
        stage: "Drafting",
        planner: "Keerthi",
        projectedPrinterDate: "2026-06-09",
        milestoneStatus: "Pending",
      },
    ],
    "Pre Editing": [
      {
        client: "Springer",
        projectNumber: "PRJ201",
        projectName: "Pre Edit Research",
        author: "Robert",
        batch: "B010",
        chapter: "Chapter 5",
        cell: "Cell C",
        mssCount: 420,
        receivedDate: getTodayDate(),
        dueDate: "2026-06-08",
        projectType: "Journal",
        stage: "Pre Editing",
        planner: "Smith",
        projectedPrinterDate: "2026-06-12",
        milestoneStatus: "In Progress",
      },
    ],
    "Editorial Services": [],
    "Chennai - JBL Team-1": [],
    "Chennai - Data Team": [],
    "Chennai - Wolters Kluwer": [],
    "Wolters Kluwer Health": [],
    "Chennai - Art Team": [],
    "Chennai - Production Control": [],
  };

  const currentRows = departmentData[currentUser.team] || [];

  const [search, setSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [status, setStatus] = useState<"--ALL--" | MilestoneStatus>("--ALL--");
  const [cell, setCell] = useState("--ALL--");
  const [clientName, setClientName] = useState("--ALL--");
  const [receivedFrom, setReceivedFrom] = useState(getTodayDate());
  const [receivedTo, setReceivedTo] = useState(getTodayDate());
  const [entries, setEntries] = useState("10");

  const teamStage = currentUser.team;

  const clientOptions = useMemo(() => {
    const uniqueClients = [...new Set(currentRows.map((item) => item.client))];
    return ["--ALL--", ...uniqueClients];
  }, [currentRows]);

  const cellOptions = useMemo(() => {
    const uniqueCells = [...new Set(currentRows.map((item) => item.cell))];
    return ["--ALL--", ...uniqueCells];
  }, [currentRows]);

  const filteredRows = useMemo(() => {
    return currentRows.filter((row) => {
      const matchesClient = clientName === "--ALL--" || row.client === clientName;
      const matchesStatus =
        status === "--ALL--" || row.milestoneStatus.toLowerCase() === status.toLowerCase();
      const matchesCell = cell === "--ALL--" || row.cell === cell;
      const matchesProjectSearch =
        !projectSearch ||
        row.projectName.toLowerCase().includes(projectSearch.toLowerCase()) ||
        row.projectNumber.toLowerCase().includes(projectSearch.toLowerCase());
      const matchesHeaderSearch =
        !search ||
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        );
      const matchesReceivedFrom =
        !receivedFrom || new Date(row.receivedDate) >= new Date(receivedFrom);
      const matchesReceivedTo =
        !receivedTo || new Date(row.receivedDate) <= new Date(receivedTo);

      return (
        matchesClient &&
        matchesStatus &&
        matchesCell &&
        matchesProjectSearch &&
        matchesHeaderSearch &&
        matchesReceivedFrom &&
        matchesReceivedTo
      );
    });
  }, [currentRows, clientName, status, cell, projectSearch, search, receivedFrom, receivedTo]);

  const displayedRows = filteredRows.slice(0, Number(entries));

  const stats = useMemo(() => {
    return filteredRows.reduce(
      (acc, item) => {
        acc.total += 1;
        acc[item.milestoneStatus.toLowerCase().replace(/\s+/g, "") as "completed" | "pending" | "inprogress"] += 1;
        return acc;
      },
      { total: 0, completed: 0, pending: 0, inprogress: 0 }
    );
  }, [filteredRows]);

  const stageSummary = useMemo(() => {
    const summaryMap = filteredRows.reduce<Record<string, number>>((acc, row) => {
      acc[row.stage] = (acc[row.stage] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(summaryMap).map(([stage, count]) => ({
      stage,
      count,
    }));
  }, [filteredRows]);

  const resetFilters = () => {
    setStatus("--ALL--");
    setCell("--ALL--");
    setClientName("--ALL--");
    setProjectSearch("");
    setReceivedFrom(getTodayDate());
    setReceivedTo(getTodayDate());
    setSearch("");
    setEntries("10");
  };

  const getStatusBadge = (statusValue: MilestoneStatus) => {
    const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold";
    if (statusValue === "Completed") return `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200`;
    if (statusValue === "In Progress") return `${base} bg-amber-50 text-amber-700 ring-1 ring-amber-200`;
    return `${base} bg-rose-50 text-rose-700 ring-1 ring-rose-200`;
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Daily Operations Dashboard</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-800">
                Today&apos;s Team Schedule
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Showing work for the logged-in team only.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200">
              Team:
              <span className="ml-1 font-semibold text-slate-800">{currentUser.team}</span>
              <span className="ml-3">
                Logged in as:
                <span className="ml-1 font-semibold text-slate-800">{currentUser.name}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
              <p className="text-sm text-slate-500">
                Team stage auto-set to: <span className="font-semibold">{teamStage}</span>
              </p>
            </div>

            <button
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={resetFilters}
              type="button"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Client Name</label>
              <select
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {clientOptions.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "--ALL--" | MilestoneStatus)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="--ALL--">--ALL--</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Cell</label>
              <select
                value={cell}
                onChange={(e) => setCell(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {cellOptions.map((cellOption) => (
                  <option key={cellOption} value={cellOption}>
                    {cellOption}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Team</label>
              <input
                value={teamStage}
                readOnly
                className="w-full rounded-xl border border-slate-300 bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Search Project</label>
              <input
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                placeholder="Project name or number"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Received From</label>
              <input
                type="date"
                value={receivedFrom}
                onChange={(e) => setReceivedFrom(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Received To</label>
              <input
                type="date"
                value={receivedTo}
                onChange={(e) => setReceivedTo(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Stage Summary</h2>
              <p className="text-sm text-slate-500">Stage-wise workload for the selected team.</p>
            </div>
            <CalendarDays size={18} className="text-slate-500" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {stageSummary.map((item) => (
              <div key={item.stage} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-700">{item.stage}</p>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-600">
              Show
              <select
                value={entries}
                onChange={(e) => setEntries(e.target.value)}
                className="mx-2 rounded-lg border border-slate-300 px-2 py-1 outline-none focus:border-slate-500"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              entries
            </div>

            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search in table..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1500px] text-sm">
              <thead className="bg-slate-50 text-left">
                <tr className="text-slate-700">
                  <th className="border-b border-slate-200 px-4 py-3">Client</th>
                  <th className="border-b border-slate-200 px-4 py-3">Project Number</th>
                  <th className="border-b border-slate-200 px-4 py-3">Project Name</th>
                  <th className="border-b border-slate-200 px-4 py-3">Author</th>
                  <th className="border-b border-slate-200 px-4 py-3">Batch</th>
                  <th className="border-b border-slate-200 px-4 py-3">Chapter</th>
                  <th className="border-b border-slate-200 px-4 py-3">Cell</th>
                  <th className="border-b border-slate-200 px-4 py-3">MSS Count</th>
                  <th className="border-b border-slate-200 px-4 py-3">Received Date</th>
                  <th className="border-b border-slate-200 px-4 py-3">Due Date</th>
                  <th className="border-b border-slate-200 px-4 py-3">Project Type</th>
                  <th className="border-b border-slate-200 px-4 py-3">Stage</th>
                  <th className="border-b border-slate-200 px-4 py-3">Planner</th>
                  <th className="border-b border-slate-200 px-4 py-3">Projected Printer Date</th>
                  <th className="border-b border-slate-200 px-4 py-3">Milestone / Due Status</th>
                </tr>
              </thead>

              <tbody>
                {displayedRows.length > 0 ? (
                  displayedRows.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="border-b border-slate-100 px-4 py-3">{row.client}</td>
                      <td className="border-b border-slate-100 px-4 py-3 font-medium text-slate-700">
                        {row.projectNumber}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.projectName}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.author}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.batch}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.chapter}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.cell}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.mssCount}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.receivedDate}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.dueDate}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.projectType}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.stage}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.planner}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.projectedPrinterDate}</td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <span className={getStatusBadge(row.milestoneStatus)}>
                          {row.milestoneStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={15} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                        <Building2 size={28} className="text-slate-400" />
                        <p className="text-sm font-medium">No schedules found</p>
                        <p className="text-xs text-slate-400">
                          Try changing filters or check the team mapping.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 px-5 py-4 text-center text-sm text-slate-500">
            Showing {displayedRows.length === 0 ? 0 : 1} to {displayedRows.length} of {filteredRows.length} entries
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaySchedule;