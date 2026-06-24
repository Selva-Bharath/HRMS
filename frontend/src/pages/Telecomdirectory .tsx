import React, { useEffect, useState } from "react";

const TelecomDirectory = () => {
  const [telecoms, setTelecoms] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const canManage =
    user.role === "Admin" ||
    user.role === "HR";

  useEffect(() => {
    loadTelecoms();
  }, []);

  const loadTelecoms = async () => {
    const res = await fetch(
      "/api/telecom"
    );

    const data = await res.json();

setTelecoms(
  Array.isArray(data)
    ? data
    : []
);
  };

  return (
    <div className="p-6">

      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold">
          Telecom Directory
        </h1>

        {canManage && (
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            + Add Telecom
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Search Team / Extension"
        className="border p-3 rounded w-full mb-5"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="bg-white rounded-xl shadow">

        <table className="w-full">

          <thead>
            <tr className="bg-gray-100">

              <th className="p-3">
                Extension
              </th>

              <th className="p-3">
                Department
              </th>

              <th className="p-3">
                Team
              </th>

              <th className="p-3">
                Contact Person
              </th>

              <th className="p-3">
                Direct Number
              </th>

              <th className="p-3">
                Location
              </th>

              <th className="p-3">
                Status
              </th>

              {canManage && (
                <th className="p-3">
                  Action
                </th>
              )}

            </tr>
          </thead>

          <tbody>

            {Array.isArray(telecoms) &&
            telecoms
              .filter(
                (item: any) =>
                  item.team_name
                    ?.toLowerCase()
                    .includes(
                      search.toLowerCase()
                    ) ||
                  item.extension_number
                    ?.includes(search)
              )
              .map((item: any) => (

                <tr
                  key={item.id}
                  className="border-b"
                >

                  <td className="p-3">
                    {item.extension_number}
                  </td>

                  <td className="p-3">
                    {item.department_name}
                  </td>

                  <td className="p-3">
                    {item.team_name}
                  </td>

                  <td className="p-3">
                    {item.contact_person}
                  </td>

                  <td className="p-3">
                    {item.direct_number}
                  </td>

                  <td className="p-3">
                    {item.location}
                  </td>

                  <td className="p-3">
                    {item.status}
                  </td>

                  {canManage && (
                    <td className="p-3 flex gap-2">

                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      {user.role ===
                        "Admin" && (
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      )}

                    </td>
                  )}

                </tr>
              ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default TelecomDirectory;