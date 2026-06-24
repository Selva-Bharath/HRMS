import { useState } from "react";
import { createBooking } from "../../../services/meetingRoomService";

const BookingForm = () => {
  const today = new Date().toISOString().split("T")[0];

  const initialForm = {
    room_id: "",
    meeting_title: "",
    organizer_name: "",
    department: "",
    meeting_date: today,
    start_time: "",
    end_time: "",
    attendees_count: "",
    remarks: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "";
    text: string;
  }>({
    type: "",
    text: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.meeting_title.trim()) {
      newErrors.meeting_title = "Meeting title is required";
    }

    if (!form.room_id) {
      newErrors.room_id = "Please select a room";
    }

    if (!form.organizer_name.trim()) {
      newErrors.organizer_name = "Organizer name is required";
    }

    if (!form.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!form.meeting_date) {
      newErrors.meeting_date = "Meeting date is required";
    }

    if (!form.start_time) {
      newErrors.start_time = "Start time is required";
    }

    if (!form.end_time) {
      newErrors.end_time = "End time is required";
    }

    if (
      form.start_time &&
      form.end_time &&
      form.start_time >= form.end_time
    ) {
      newErrors.end_time = "End time must be later than start time";
    }

    if (
      form.attendees_count &&
      Number(form.attendees_count) < 1
    ) {
      newErrors.attendees_count = "Attendees must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const inputClass = (fieldName: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
      errors[fieldName]
        ? "border-red-300 bg-red-50 focus:border-red-500"
        : "border-slate-300 bg-slate-50 focus:border-blue-500 focus:bg-white"
    }`;

  const handleBooking = async () => {
    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "Please fix the highlighted fields.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...form,
        attendees_count: form.attendees_count
          ? Number(form.attendees_count)
          : "",
      };

      const response = await createBooking(payload);

      setMessage({
        type: "success",
        text:
          response?.data?.message || "Booking created successfully",
      });

      setForm(initialForm);
      setErrors({});
    } catch (error: any) {
      console.error("BOOKING ERROR:", error);

      setMessage({
        type: "error",
        text:
          error?.response?.data?.message || "Booking failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Create Booking
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Schedule a meeting room with date, time, and organizer details.
        </p>
      </div>

      {message.text && (
        <div
          className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Meeting Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="meeting_title"
            placeholder="Enter meeting title"
            value={form.meeting_title}
            onChange={handleChange}
            className={inputClass("meeting_title")}
          />
          {errors.meeting_title && (
            <p className="mt-1 text-xs text-red-500">
              {errors.meeting_title}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Room <span className="text-red-500">*</span>
          </label>
          <select
            name="room_id"
            value={form.room_id}
            onChange={handleChange}
            className={inputClass("room_id")}
          >
            <option value="">Select Room</option>
            <option value="1">Conference Room A</option>
            <option value="2">Board Room</option>
            <option value="3">Training Room</option>
          </select>
          {errors.room_id && (
            <p className="mt-1 text-xs text-red-500">
              {errors.room_id}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Organizer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="organizer_name"
            placeholder="Enter organizer name"
            value={form.organizer_name}
            onChange={handleChange}
            className={inputClass("organizer_name")}
          />
          {errors.organizer_name && (
            <p className="mt-1 text-xs text-red-500">
              {errors.organizer_name}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Department <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="department"
            placeholder="Enter department"
            value={form.department}
            onChange={handleChange}
            className={inputClass("department")}
          />
          {errors.department && (
            <p className="mt-1 text-xs text-red-500">
              {errors.department}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Meeting Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="meeting_date"
            value={form.meeting_date}
            min={today}
            onChange={handleChange}
            className={inputClass("meeting_date")}
          />
          {errors.meeting_date && (
            <p className="mt-1 text-xs text-red-500">
              {errors.meeting_date}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Attendees
          </label>
          <input
            type="number"
            name="attendees_count"
            placeholder="Enter attendee count"
            value={form.attendees_count}
            onChange={handleChange}
            className={inputClass("attendees_count")}
          />
          {errors.attendees_count && (
            <p className="mt-1 text-xs text-red-500">
              {errors.attendees_count}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            className={inputClass("start_time")}
          />
          {errors.start_time && (
            <p className="mt-1 text-xs text-red-500">
              {errors.start_time}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            className={inputClass("end_time")}
          />
          {errors.end_time && (
            <p className="mt-1 text-xs text-red-500">
              {errors.end_time}
            </p>
          )}
        </div>

        <div className="md:col-span-2 xl:col-span-3">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Remarks
          </label>
          <textarea
            name="remarks"
            placeholder="Add meeting notes or booking remarks"
            value={form.remarks}
            onChange={handleChange}
            rows={4}
            className={inputClass("remarks")}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setForm(initialForm);
            setErrors({});
            setMessage({ type: "", text: "" });
          }}
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleBooking}
          disabled={isSubmitting}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating Booking..." : "Create Booking"}
        </button>
      </div>
    </div>
  );
};

export default BookingForm;