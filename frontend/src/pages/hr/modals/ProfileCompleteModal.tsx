import React from 'react';
import { theme } from '../data/hrMockData';

interface ProfileCompleteModalProps {
  currentEmployee: any;
  profileData: any;
  setProfileData: (val: any) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const fieldStyle: React.CSSProperties = { width: "100%", padding: 12, background: "#F0F4FF", border: "1px solid #DCDEF5", borderRadius: 8, fontSize: 13, outline: "none" };
const labelS: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 6 };
const sectionTitle: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "#1F7A8C", marginBottom: 10 };

const ProfileCompleteModal: React.FC<ProfileCompleteModalProps> = ({
  currentEmployee, profileData, setProfileData, onSubmit, onClose,
}) => {
  const upd = (key: string, val: string) => setProfileData({ ...profileData, [key]: val });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16, overflowY: "auto" }}>
      <div style={{ background: theme.surface, borderRadius: 20, padding: 28, width: 600, maxWidth: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Complete Your Profile</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>Welcome, {currentEmployee?.name}! Please fill the remaining details</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", fontSize: 24, cursor: "pointer", color: theme.textMuted }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: "70vh", overflowY: "auto", padding: "0 4px" }}>

          {/* Personal Information */}
          <div style={sectionTitle}>PERSONAL INFORMATION</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><label style={labelS}>DATE OF BIRTH *</label><input type="date" value={profileData.dob} onChange={(e) => upd("dob", e.target.value)} style={fieldStyle} /></div>
            <div>
              <label style={labelS}>GENDER *</label>
              <select value={profileData.gender} onChange={(e) => upd("gender", e.target.value)} style={fieldStyle}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={labelS}>MARITAL STATUS *</label>
              <select value={profileData.marital_status} onChange={(e) => upd("marital_status", e.target.value)} style={fieldStyle}>
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
            <div>
              <label style={labelS}>BLOOD GROUP *</label>
              <select value={profileData.blood_group} onChange={(e) => upd("blood_group", e.target.value)} style={fieldStyle}>
                <option value="">Select Blood Group</option>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
          </div>

          {/* Address */}
          <div style={sectionTitle}>ADDRESS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelS}>ADDRESS *</label>
              <textarea value={profileData.address} onChange={(e) => upd("address", e.target.value)} rows={2} placeholder="Enter full address" style={{ ...fieldStyle, resize: "vertical" }} />
            </div>
            {[
              { label: "CITY *", key: "city" },
              { label: "STATE *", key: "state" },
              { label: "COUNTRY *", key: "country", placeholder: "e.g., India" },
              { label: "PINCODE *", key: "pincode", placeholder: "e.g., 600032" },
            ].map((f) => (
              <div key={f.key}>
                <label style={labelS}>{f.label}</label>
                <input value={profileData[f.key]} onChange={(e) => upd(f.key, e.target.value)} placeholder={f.placeholder || ""} style={fieldStyle} />
              </div>
            ))}
          </div>

          {/* Identity Documents */}
          <div style={sectionTitle}>IDENTITY DOCUMENTS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><label style={labelS}>PAN NUMBER *</label><input value={profileData.pan_number} onChange={(e) => upd("pan_number", e.target.value.toUpperCase())} placeholder="e.g., ABCDE1234F" style={fieldStyle} /></div>
            <div><label style={labelS}>AADHAAR NUMBER *</label><input value={profileData.aadhaar_number} onChange={(e) => upd("aadhaar_number", e.target.value)} placeholder="e.g., 1234 5678 9012" style={fieldStyle} /></div>
          </div>

          {/* Bank Details */}
          <div style={sectionTitle}>BANK DETAILS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><label style={labelS}>BANK NAME *</label><input value={profileData.bank_name} onChange={(e) => upd("bank_name", e.target.value)} placeholder="e.g., HDFC Bank" style={fieldStyle} /></div>
            <div><label style={labelS}>ACCOUNT NUMBER *</label><input value={profileData.account_number} onChange={(e) => upd("account_number", e.target.value)} placeholder="Enter account number" style={fieldStyle} /></div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelS}>IFSC CODE *</label>
              <input value={profileData.ifsc_code} onChange={(e) => upd("ifsc_code", e.target.value.toUpperCase())} placeholder="e.g., HDFC0001234" style={fieldStyle} />
            </div>
          </div>

          {/* Education */}
          <div style={sectionTitle}>EDUCATION</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelS}>QUALIFICATION *</label>
              <select value={profileData.qualification} onChange={(e) => upd("qualification", e.target.value)} style={fieldStyle}>
                <option value="">Select Qualification</option>
                {["10th","12th","Diploma","B.E/B.Tech","M.E/M.Tech","MBA","MCA","B.Sc","M.Sc","B.Com","M.Com","PhD"].map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div><label style={labelS}>COLLEGE/UNIVERSITY *</label><input value={profileData.college} onChange={(e) => upd("college", e.target.value)} placeholder="e.g., Anna University" style={fieldStyle} /></div>
            <div><label style={labelS}>PASSING YEAR *</label><input type="number" value={profileData.passing_year} onChange={(e) => upd("passing_year", e.target.value)} placeholder="e.g., 2022" style={fieldStyle} /></div>
          </div>

          {/* Skills */}
          <div>
            <label style={labelS}>SKILLS</label>
            <textarea value={profileData.skills} onChange={(e) => upd("skills", e.target.value)} rows={2} placeholder="e.g., JavaScript, React, Node.js (comma separated)" style={{ ...fieldStyle, resize: "vertical" }} />
          </div>

          {/* Emergency Contact */}
          <div style={sectionTitle}>EMERGENCY CONTACT</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><label style={labelS}>CONTACT NAME *</label><input value={profileData.emergency_contact_name} onChange={(e) => upd("emergency_contact_name", e.target.value)} placeholder="e.g., Parent/Spouse Name" style={fieldStyle} /></div>
            <div><label style={labelS}>CONTACT NUMBER *</label><input value={profileData.emergency_contact_number} onChange={(e) => upd("emergency_contact_number", e.target.value)} placeholder="e.g., +91 9876543210" style={fieldStyle} /></div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 8, paddingTop: 8 }}>
            <button onClick={onClose} style={{ flex: 1, padding: 12, background: "transparent", color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Skip for Now</button>
            <button onClick={onSubmit} style={{ flex: 1, padding: 12, background: theme.accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Complete Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompleteModal;