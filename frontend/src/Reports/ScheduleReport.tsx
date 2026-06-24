import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Printer,
  Download,
  FileText,
  CalendarDays,
  Building2,
  Layers3,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const ScheduleReport = () => {
  const departments = [
    "Editorial Services",
    "Media Services",
    "Chennai - JBL Team",
    "Wolters Kluwer Health-1",
    "Accessible Team",
    "QBend",
    "Editorial Services 2",
  ];

  const scheduleData = {
    "Editorial Services": [
      {
        client: "Elsevier",
        project: "Advanced Biology",
        chapter: "Chapter 2",
        receivedDate: "2026-05-27",
        dueDate: "2026-06-04",
        workingCycle: "7 Days",
        mssCount: 250,
        castOff: 180,
        stage: "Copy Editing",
        cell: "Cell A",
        milestone: "Pre-Press",
        completed: "No",
        codeType: "Book",
        platform: "InDesign",
        planner: "David",
        batchId: "B1001",
        printerDate: "2026-06-09",
        remarks: "Awaiting review",
        dueStatus: "Pending",
      },
      {
        client: "Pearson",
        project: "Clinical Notes",
        chapter: "Chapter 5",
        receivedDate: "2026-05-29",
        dueDate: "2026-06-08",
        workingCycle: "10 Days",
        mssCount: 310,
        castOff: 205,
        stage: "First Proofs",
        cell: "Cell B",
        milestone: "Proofing",
        completed: "Yes",
        codeType: "Book",
        platform: "3B2",
        planner: "Keerthi",
        batchId: "B1002",
        printerDate: "2026-06-14",
        remarks: "Completed on time",
        dueStatus: "Completed",
      },
    ],
    "Media Services": [
      {
        client: "Springer",
        project: "Media Science",
        chapter: "Chapter 1",
        receivedDate: "2026-05-28",
        dueDate: "2026-06-06",
        workingCycle: "8 Days",
        mssCount: 420,
        castOff: 260,
        stage: "XML",
        cell: "Cell C",
        milestone: "Conversion",
        completed: "No",
        codeType: "Journal",
        platform: "XML Flow",
        planner: "Smith",
        batchId: "B2001",
        printerDate: "2026-06-12",
        remarks: "In conversion",
        dueStatus: "In Progress",
      },
    ],
    "Chennai - JBL Team": [],
    "Wolters Kluwer Health-1": [],
    "Accessible Team": [],
    QBend: [],
    "Editorial Services 2": [],
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [department, setDepartment] = useState("Editorial Services");
  const [clientName, setClientName] = useState("--ALL--");
  const [stageName, setStageName] = useState("--ALL--");
  const [dueDateStatus, setDueDateStatus] = useState("--ALL--");
  const [chapterStatus, setChapterStatus] = useState("--ALL--");
  const [cellChoice, setCellChoice] = useState("--ALL--");
  const [receivedFrom, setReceivedFrom] = useState("");
  const [receivedTo, setReceivedTo] = useState("");
  const [dueAsOn, setDueAsOn] = useState("");
  const [entries, setEntries] = useState("10");

  const currentRows = scheduleData[department] || [];

  const clientOptions = useMemo(() => {
    const uniqueClients = [...new Set(currentRows.map((item) => item.client))];
    return ["--ALL--", ...uniqueClients];
  }, [currentRows]);

  const stageOptions = useMemo(() => {
    const uniqueStages = [...new Set(currentRows.map((item) => item.stage))];
    return ["--ALL--", ...uniqueStages];
  }, [currentRows]);

  const cellOptions = useMemo(() => {
    const uniqueCells = [...new Set(currentRows.map((item) => item.cell))];
    return ["--ALL--", ...uniqueCells];
  }, [currentRows]);

  const filteredRows = useMemo(() => {
    return currentRows.filter((row) => {
      const matchesClient =
        clientName === "--ALL--" || row.client === clientName;

      const matchesStage =
        stageName === "--ALL--" || row.stage === stageName;

      const matchesDueStatus =
        dueDateStatus === "--ALL--" || row.dueStatus === dueDateStatus;

      const matchesCell =
        cellChoice === "--ALL--" || row.cell === cellChoice;

      const matchesProject =
        !projectSearch ||
        row.project.toLowerCase().includes(projectSearch.toLowerCase());

      const matchesSearch =
        !searchTerm ||
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesReceivedFrom =
        !receivedFrom || new Date(row.receivedDate) >= new Date(receivedFrom);

      const matchesReceivedTo =
        !receivedTo || new Date(row.receivedDate) <= new Date(receivedTo);

      const matchesDueAsOn =
        !dueAsOn || new Date(row.dueDate) <= new Date(dueAsOn);

      return (
        matchesClient &&
        matchesStage &&
        matchesDueStatus &&
        matchesCell &&
        matchesProject &&
        matchesSearch &&
        matchesReceivedFrom &&
        matchesReceivedTo &&
        matchesDueAsOn
      );
    });
  }, [
    currentRows,
    clientName,
    stageName,
    dueDateStatus,
    cellChoice,
    projectSearch,
    searchTerm,
    receivedFrom,
    receivedTo,
    dueAsOn,
  ]);

  const displayedRows = filteredRows.slice(0, Number(entries));

  const stats = {
    totalProjects: filteredRows.length,
    mssCount: filteredRows.reduce((sum, item) => sum + item.mssCount, 0),
    completed: filteredRows.filter(
      (item) => item.dueStatus === "Completed"
    ).length,
    pending: filteredRows.filter(
      (item) => item.dueStatus === "Pending"
    ).length,
  };

  const pieChartData = useMemo(() => {
    const grouped = filteredRows.reduce((acc, row) => {
      if (!acc[row.stage]) {
        acc[row.stage] = 0;
      }
      acc[row.stage] += row.mssCount;
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredRows]);

  const resetFilters = () => {
    setDepartment("Editorial Services");
    setClientName("--ALL--");
    setStageName("--ALL--");
    setDueDateStatus("--ALL--");
    setChapterStatus("--ALL--");
    setCellChoice("--ALL--");
    setProjectSearch("");
    setSearchTerm("");
    setReceivedFrom("");
    setReceivedTo("");
    setDueAsOn("");
    setEntries("10");
  };

  const getStatusBadge = (status) => {
    const base =
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold";

    if (status === "Completed") {
      return `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200`;
    }

    if (status === "In Progress") {
      return `${base} bg-amber-50 text-amber-700 ring-1 ring-amber-200`;
    }

    return `${base} bg-rose-50 text-rose-700 ring-1 ring-rose-200`;
  };

  const COLORS = [
    "#2563eb",
    "#0f766e",
    "#7c3aed",
    "#ea580c",
    "#dc2626",
    "#0891b2",
    "#65a30d",
    "#9333ea",
    "#c2410c",
    "#334155",
  ];

  const handleExportToExcel = () => {
    const exportData = filteredRows.map((row) => ({
      Client: row.client,
      Project: row.project,
      Chapter: row.chapter,
      "Received Date": row.receivedDate,
      "Due Date": row.dueDate,
      "Working Cycle": row.workingCycle,
      "MSS Count": row.mssCount,
      "Cast Off": row.castOff,
      Stage: row.stage,
      Cell: row.cell,
      Milestone: row.milestone,
      Completed: row.completed,
      "Code Type": row.codeType,
      Platform: row.platform,
      Planner: row.planner,
      "Batch ID": row.batchId,
      "Printer Date": row.printerDate,
      Remarks: row.remarks,
      "Due Status": row.dueStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule Report");

    const fileName = `schedule-report-${department
      .toLowerCase()
      .replace(/\s+/g, "-")}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF("l", "mm", "a4");

    doc.setFontSize(16);
    doc.text("Schedule Report", 14, 15);

    doc.setFontSize(10);
    doc.text(`Department: ${department}`, 14, 22);
    doc.text(`Total Visible Rows: ${displayedRows.length}`, 14, 28);

    const tableColumn = [
      "Client",
      "Project",
      "Chapter",
      "Received Date",
      "Due Date",
      "Working Cycle",
      "MSS Count",
      "Cast Off",
      "Stage",
      "Cell",
      "Milestone",
      "Completed",
      "Code Type",
      "Platform",
      "Planner",
      "Batch ID",
      "Printer Date",
      "Remarks",
    ];

    const tableRows = displayedRows.map((row) => [
      row.client,
      row.project,
      row.chapter,
      row.receivedDate,
      row.dueDate,
      row.workingCycle,
      row.mssCount,
      row.castOff,
      row.stage,
      row.cell,
      row.milestone,
      row.completed,
      row.codeType,
      row.platform,
      row.planner,
      row.batchId,
      row.printerDate,
      row.remarks,
    ]);

    autoTable(doc, {
      startY: 34,
      head: [tableColumn],
      body: tableRows,
      styles: {
        fontSize: 7,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [30, 41, 59],
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { top: 20, left: 10, right: 10, bottom: 10 },
    });

    doc.save("schedule-report.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Operations Dashboard
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-800">
                Schedules Report
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                View, filter, export, and monitor current project schedules.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200">
                Logged in as:
                <span className="ml-1 font-semibold text-slate-800">
                  Selva Bharath
                </span>
              </div>

              <button className="inline-flex items-center gap-2 rounded-xl bg-[#4C5C68] px-4 py-2.5 text-sm font-medium text-white ">
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>



        {/* Filters */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
              <p className="text-sm text-slate-500">
                Narrow down schedules using key report filters.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetFilters}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>

              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4C5C68] px-4 py-2.5 text-sm font-medium text-white">
                <Filter size={16} />
                Apply Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Client Name
              </label>
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
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Search Project
              </label>
              <input
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder="Project name"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Stage Name
              </label>
              <select
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {stageOptions.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Due Date Status
              </label>
              <select
                value={dueDateStatus}
                onChange={(e) => setDueDateStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="--ALL--">--ALL--</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Chapter Status
              </label>
              <select
                value={chapterStatus}
                onChange={(e) => setChapterStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="--ALL--">--ALL--</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Received From
              </label>
              <input
                type="date"
                value={receivedFrom}
                onChange={(e) => setReceivedFrom(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Received To
              </label>
              <input
                type="date"
                value={receivedTo}
                onChange={(e) => setReceivedTo(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Due As On
              </label>
              <input
                type="date"
                value={dueAsOn}
                onChange={(e) => setDueAsOn(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Cell Choice
              </label>
              <select
                value={cellChoice}
                onChange={(e) => setCellChoice(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {cellOptions.map((cell) => (
                  <option key={cell} value={cell}>
                    {cell}
                  </option>
                ))}
              </select>
            </div>

            <div className="xl:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setClientName("--ALL--");
                  setStageName("--ALL--");
                  setCellChoice("--ALL--");
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Pie Chart: Stages vs MSS Count
            </h2>
            <p className="text-sm text-slate-500">
              Distribution of MSS Count by stage based on current filters.
            </p>
          </div>

          {pieChartData.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={55}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, "MSS Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {pieChartData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 text-slate-500">
              <Building2 size={28} className="text-slate-400" />
              <p className="text-sm font-medium">No chart data available</p>
              <p className="text-xs text-slate-400">
                Try changing department or clearing filters.
              </p>
            </div>
          )}
        </div>

        {/* Export section */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportToExcel}
            className="inline-flex items-center gap-2 rounded-xl bg-[#4C5C68] px-4 py-2.5 text-sm font-medium text-white "
          >
            <Download size={16} />
            Export To Excel
          </button>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 rounded-xl bg-[#4C5C68] px-4 py-2.5 text-sm font-medium text-white"
          >
            <FileText size={16} />
            Export PDF
          </button>

          <button
            onClick={handlePrint}
            className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#4C5C68] px-4 py-2.5 text-sm font-medium text-white"
          >
            <Printer size={16} />
            Print
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
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
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search schedules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1700px] text-sm">
              <thead className="bg-slate-50 text-left">
                <tr className="text-slate-700">
                  <th className="border-b border-slate-200 px-4 py-3">Client</th>
                  <th className="border-b border-slate-200 px-4 py-3">Project</th>
                  <th className="border-b border-slate-200 px-4 py-3">Chapter</th>
                  <th className="border-b border-slate-200 px-4 py-3">Received Date</th>
                  <th className="border-b border-slate-200 px-4 py-3">Due Date</th>
                  <th className="border-b border-slate-200 px-4 py-3">Working Cycle</th>
                  <th className="border-b border-slate-200 px-4 py-3">MSS Count</th>
                  <th className="border-b border-slate-200 px-4 py-3">Cast Off</th>
                  <th className="border-b border-slate-200 px-4 py-3">Stage</th>
                  <th className="border-b border-slate-200 px-4 py-3">Cell</th>
                  <th className="border-b border-slate-200 px-4 py-3">Milestone</th>
                  <th className="border-b border-slate-200 px-4 py-3">Completed</th>
                  <th className="border-b border-slate-200 px-4 py-3">Code Type</th>
                  <th className="border-b border-slate-200 px-4 py-3">Platform</th>
                  <th className="border-b border-slate-200 px-4 py-3">Planner</th>
                  <th className="border-b border-slate-200 px-4 py-3">Batch ID</th>
                  <th className="border-b border-slate-200 px-4 py-3">Printer Date</th>
                  <th className="border-b border-slate-200 px-4 py-3">Remarks</th>
                </tr>
              </thead>

              <tbody>
                {displayedRows.length > 0 ? (
                  displayedRows.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="border-b border-slate-100 px-4 py-3">{row.client}</td>
                      <td className="border-b border-slate-100 px-4 py-3 font-medium text-slate-700">
                        {row.project}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.chapter}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.receivedDate}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.dueDate}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.workingCycle}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.mssCount}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.castOff}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.stage}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.cell}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.milestone}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.completed}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.codeType}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.platform}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.planner}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.batchId}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{row.printerDate}</td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <span className={getStatusBadge(row.dueStatus)}>
                          {row.remarks}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={18} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                        <Building2 size={28} className="text-slate-400" />
                        <p className="text-sm font-medium">No data available in table</p>
                        <p className="text-xs text-slate-400">
                          Try changing department or clearing filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 px-5 py-4 text-center text-sm text-slate-500">
            Showing {displayedRows.length === 0 ? 0 : 1} to {displayedRows.length} of{" "}
            {filteredRows.length} entries
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleReport;