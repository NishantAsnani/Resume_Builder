import { useState } from "react";
import axios from "axios";
import * as Yup from "yup";

const STEPS = [
  { id: 1, label: "Personal",     icon: "👤" },
  { id: 2, label: "Education",    icon: "🎓" },
  { id: 3, label: "Experience",   icon: "💼" },
  { id: 4, label: "Projects",     icon: "🚀" },
  { id: 5, label: "Technologies", icon: "⚙️"  },
];

const urlSchema = Yup.string()
  .url("Must be a valid URL starting with https://")
  .nullable()
  .transform(v => v === "" ? null : v);

const schemas = {
  1: Yup.object({
    firstname:    Yup.string().min(2, "At least 2 characters").required("First name is required"),
    lastname:     Yup.string().min(2, "At least 2 characters").required("Last name is required"),
    location:     Yup.string().required("Location is required"),
    emailAddress: Yup.string().email("Enter a valid email").required("Email is required"),
    phoneNumber:  Yup.string()
      .matches(/^[+\d\s\-().]{7,20}$/, "Enter a valid phone number")
      .required("Phone is required"),
    website:  urlSchema,
    linkedin: urlSchema,
    github:   urlSchema,
  }),
  2: Yup.object({
    education: Yup.array().of(
      Yup.object({
        institution: Yup.string().required("Institution is required"),
        degree:      Yup.string().required("Degree is required"),
        field:       Yup.string().required("Field of study is required"),
        startDate:   Yup.string().required("Start date is required"),
        endDate:     Yup.string().nullable(),
        gpa:         Yup.string().nullable(),
        coursework:  Yup.string().nullable(),
      })
    ).min(1, "Add at least one education entry"),
  }),
  // ── Experience is fully optional ──────────────────────────────────────────
  3: Yup.object({
    experience: Yup.array().of(
      Yup.object({
        role:       Yup.string().when('company', {
          is: (v) => !!v,
          then: (s) => s.required("Role is required when company is filled"),
          otherwise: (s) => s.nullable(),
        }),
        company:    Yup.string().nullable(),
        location:   Yup.string().nullable(),
        startDate:  Yup.string().when('company', {
          is: (v) => !!v,
          then: (s) => s.required("Start date is required"),
          otherwise: (s) => s.nullable(),
        }),
        endDate:    Yup.string().nullable(),
        highlights: Yup.string().nullable(),
      })
    ),
  }),
  4: Yup.object({
    projects: Yup.array().of(
      Yup.object({
        name:       Yup.string().required("Project name is required"),
        url:        urlSchema,
        highlights: Yup.string().min(10, "Add at least one bullet point").required("Description is required"),
      })
    ).min(1, "Add at least one project"),
  }),
  5: Yup.object({
    languages:    Yup.string().required("Please list your programming languages"),
    technologies: Yup.string().required("Please list your technologies / tools"),
  }),
};

const defaultForm = {
  firstname: "", lastname: "", location: "",
  emailAddress: "", phoneNumber: "",
  website: "", linkedin: "", github: "",
  education:   [{ institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "", coursework: "" }],
  experience:  [{ role: "", company: "", location: "", startDate: "", endDate: "", highlights: "" }],
  projects:    [{ name: "", url: "", highlights: "" }],
  languages:   "",
  technologies: "",
};

// ─── Shared UI components ─────────────────────────────────────────────────────
function Field({ label, name, type = "text", value, onChange, onBlur, placeholder = "", error, touched, optional }) {
  const hasError = touched && error;
  return (
    <div className="mb-4">
      <label className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-widest mb-1.5">
        {label}
        {optional && <span className="text-gray-400 font-normal normal-case tracking-normal">(optional)</span>}
      </label>
      <input
        type={type} name={name} value={value}
        onChange={onChange} onBlur={onBlur} placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium border-2 bg-white text-gray-800 placeholder-gray-400 focus:outline-none transition-all
          ${hasError
            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 hover:border-indigo-200"
          }`}
      />
      {hasError && <p className="mt-1.5 text-xs text-red-500 font-semibold flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
}

function TextArea({ label, name, value, onChange, onBlur, placeholder = "", error, touched, hint, rows = 4, optional }) {
  const hasError = touched && error;
  return (
    <div className="mb-4">
      <label className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-widest mb-1.5">
        {label}
        {optional && <span className="text-gray-400 font-normal normal-case tracking-normal">(optional)</span>}
      </label>
      {hint && <p className="text-xs text-indigo-400 mb-1.5 italic">{hint}</p>}
      <textarea
        name={name} value={value}
        onChange={onChange} onBlur={onBlur}
        placeholder={placeholder} rows={rows}
        className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium border-2 bg-white text-gray-800 placeholder-gray-400 focus:outline-none transition-all resize-y
          ${hasError
            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 hover:border-indigo-200"
          }`}
      />
      {hasError && <p className="mt-1.5 text-xs text-red-500 font-semibold flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
}

function SectionCard({ title, index, onRemove, showRemove, children, optional }) {
  const gradients = [
    "from-indigo-50 to-blue-50 border-indigo-100",
    "from-violet-50 to-purple-50 border-violet-100",
    "from-sky-50 to-cyan-50 border-sky-100",
    "from-teal-50 to-emerald-50 border-teal-100",
  ];
  return (
    <div className={`bg-gradient-to-br ${gradients[index % gradients.length]} border-2 rounded-2xl p-5 mb-4`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{title}</p>
          {optional && <span className="text-xs text-gray-400 italic">(optional)</span>}
        </div>
        {showRemove && (
          <button onClick={onRemove} className="text-xs text-red-400 border border-red-200 bg-white px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors font-semibold">
            🗑 Remove
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function StepHeader({ icon, title, sub }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function AddMoreBtn({ onClick, label }) {
  return (
    <button onClick={onClick}
      className="w-full py-3 border-2 border-dashed border-indigo-200 rounded-xl text-sm text-indigo-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold mt-1">
      + {label}
    </button>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState(defaultForm);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [pdfUrl, setPdfUrl]   = useState("");
  const [loading, setLoading] = useState(false);

  // ── Validation ───────────────────────────────────────────────────────────
  const validateStep = async () => {
    try {
      await schemas[step].validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const errs = {};
      err.inner.forEach(e => { errs[e.path] = e.message; });
      setErrors(errs);
      const t = {};
      Object.keys(errs).forEach(k => { t[k] = true; });
      setTouched(prev => ({ ...prev, ...t }));
      return false;
    }
  };

  const validateLive = async (name, value) => {
    try {
      await schemas[step].validateAt(name, { ...form, [name]: value });
      setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    } catch (e) {
      setErrors(prev => ({ ...prev, [name]: e.message }));
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (touched[name]) validateLive(name, value);
  };

  const handleBlur = e => {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    validateLive(name, value);
  };

  const handleArrayChange = (key, idx, field, value) => {
    setForm(f => ({ ...f, [key]: f[key].map((item, i) => i === idx ? { ...item, [field]: value } : item) }));
    const path = `${key}[${idx}].${field}`;
    if (touched[path]) validateLive(path, value);
  };

  const handleArrayBlur = (key, idx, field, value) => {
    const path = `${key}[${idx}].${field}`;
    setTouched(p => ({ ...p, [path]: true }));
    validateLive(path, value);
  };

  const addItem    = (key, template) => setForm(f => ({ ...f, [key]: [...f[key], { ...template }] }));
  const removeItem = (key, idx)      => setForm(f => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }));

  const ae = (key, idx, field) => errors[`${key}[${idx}].${field}`];
  const at = (key, idx, field) => touched[`${key}[${idx}].${field}`];
  const e  = n => errors[n];
  const t  = n => touched[n];

  const goNext = async () => { if (await validateStep()) setStep(s => s + 1); };
  const goPrev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!await validateStep()) return;
    setLoading(true);
    try {
      // Filter out fully empty experience entries before sending
      const cleanedExperience = form.experience.filter(exp => exp.company.trim() || exp.role.trim());
      const payload = { ...form, experience: cleanedExperience };

      const response = await axios.post("http://localhost:3000/getData", payload, { responseType: "arraybuffer" });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      window.open(url);
    } catch (err) {
      console.error(err);
      alert("Error generating PDF. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-blue-100">

      {/* Header */}
      <header className="bg-white/90 backdrop-blur sticky top-0 z-20 border-b border-indigo-100 shadow-sm px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow">R</div>
          <span className="font-bold text-indigo-900 text-lg tracking-tight">ResuméCraft</span>
          <span className="hidden sm:inline text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">LaTeX Style</span>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
          <span className="text-sm">{STEPS[step - 1].icon}</span>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{STEPS[step - 1].label}</span>
        </div>
      </header>

      {/* Stepper */}
      <div className="bg-white/80 backdrop-blur border-b border-indigo-100 px-6 py-3 flex gap-2 flex-wrap justify-center">
        {STEPS.map(s => (
          <button key={s.id} onClick={() => setStep(s.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all duration-200
              ${s.id === step
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                : s.id < step
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                  : "bg-white text-gray-400 border-gray-200 hover:border-indigo-300 hover:text-indigo-500"
              }`}>
            <span>{s.id < step ? "✓" : s.icon}</span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-indigo-100">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <main className="max-w-2xl mx-auto px-5 py-10">
        <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-xl shadow-indigo-100/40 p-8">

          {/* ── STEP 1: Personal ──────────────────────────────────────────── */}
          {step === 1 && (
            <>
              <StepHeader icon="👤" title="Personal Information" sub="Shown in the resume header" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" name="firstname" value={form.firstname} onChange={handleChange} onBlur={handleBlur} error={e("firstname")} touched={t("firstname")} />
                <Field label="Last Name"  name="lastname"  value={form.lastname}  onChange={handleChange} onBlur={handleBlur} error={e("lastname")}  touched={t("lastname")} />
              </div>
              <Field label="Location" name="location" value={form.location} onChange={handleChange} onBlur={handleBlur} error={e("location")} touched={t("location")} placeholder="City, State / Country" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email" name="emailAddress" type="email" value={form.emailAddress} onChange={handleChange} onBlur={handleBlur} error={e("emailAddress")} touched={t("emailAddress")} placeholder="you@example.com" />
                <Field label="Phone" name="phoneNumber"  type="tel"   value={form.phoneNumber}  onChange={handleChange} onBlur={handleBlur} error={e("phoneNumber")}  touched={t("phoneNumber")}  placeholder="+1 234 567 8900" />
              </div>
              <div className="mt-3 mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-indigo-100" />
                <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Online Presence</span>
                <div className="h-px flex-1 bg-indigo-100" />
              </div>
              <Field label="Website / Portfolio" name="website"  value={form.website}  onChange={handleChange} onBlur={handleBlur} error={e("website")}  touched={t("website")}  placeholder="https://yoursite.com" optional />
              <Field label="LinkedIn URL"         name="linkedin" value={form.linkedin} onChange={handleChange} onBlur={handleBlur} error={e("linkedin")} touched={t("linkedin")} placeholder="https://linkedin.com/in/username" optional />
              <Field label="GitHub URL"            name="github"   value={form.github}   onChange={handleChange} onBlur={handleBlur} error={e("github")}   touched={t("github")}   placeholder="https://github.com/username" optional />
            </>
          )}

          {/* ── STEP 2: Education ─────────────────────────────────────────── */}
          {step === 2 && (
            <>
              <StepHeader icon="🎓" title="Education" sub="Most recent first. GPA and coursework are optional." />
              {form.education.map((edu, i) => (
                <SectionCard key={i} title={`Education ${i + 1}`} index={i} showRemove={form.education.length > 1} onRemove={() => removeItem("education", i)}>
                  <Field label="Institution" name="institution" value={edu.institution}
                    onChange={e => handleArrayChange("education", i, "institution", e.target.value)}
                    onBlur={e   => handleArrayBlur("education",   i, "institution", e.target.value)}
                    error={ae("education", i, "institution")} touched={at("education", i, "institution")}
                    placeholder="University of Pennsylvania" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Degree" name="degree" value={edu.degree}
                      onChange={e => handleArrayChange("education", i, "degree", e.target.value)}
                      onBlur={e   => handleArrayBlur("education",   i, "degree", e.target.value)}
                      error={ae("education", i, "degree")} touched={at("education", i, "degree")}
                      placeholder="BS / MS / PhD" />
                    <Field label="Field of Study" name="field" value={edu.field}
                      onChange={e => handleArrayChange("education", i, "field", e.target.value)}
                      onBlur={e   => handleArrayBlur("education",   i, "field", e.target.value)}
                      error={ae("education", i, "field")} touched={at("education", i, "field")}
                      placeholder="Computer Science" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Start Date" name="startDate" type="month" value={edu.startDate}
                      onChange={e => handleArrayChange("education", i, "startDate", e.target.value)}
                      onBlur={e   => handleArrayBlur("education",   i, "startDate", e.target.value)}
                      error={ae("education", i, "startDate")} touched={at("education", i, "startDate")} />
                    <Field label="End Date" name="endDate" type="month" value={edu.endDate}
                      onChange={e => handleArrayChange("education", i, "endDate", e.target.value)}
                      onBlur={e   => handleArrayBlur("education",   i, "endDate", e.target.value)}
                      error={ae("education", i, "endDate")} touched={at("education", i, "endDate")} optional />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="GPA" name="gpa" value={edu.gpa}
                      onChange={e => handleArrayChange("education", i, "gpa", e.target.value)}
                      onBlur={e   => handleArrayBlur("education",   i, "gpa", e.target.value)}
                      error={ae("education", i, "gpa")} touched={at("education", i, "gpa")}
                      placeholder="3.9/4.0" optional />
                    <div />
                  </div>
                  <TextArea label="Relevant Coursework" name="coursework" value={edu.coursework}
                    onChange={e => handleArrayChange("education", i, "coursework", e.target.value)}
                    onBlur={e   => handleArrayBlur("education",   i, "coursework", e.target.value)}
                    error={ae("education", i, "coursework")} touched={at("education", i, "coursework")}
                    placeholder="Algorithms, Data Structures, Operating Systems, Machine Learning"
                    hint="Comma-separated list of courses" rows={2} optional />
                </SectionCard>
              ))}
              <AddMoreBtn onClick={() => addItem("education", { institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "", coursework: "" })} label="Add Another Education" />
            </>
          )}

          {/* ── STEP 3: Experience (optional) ─────────────────────────────── */}
          {step === 3 && (
            <>
              <StepHeader icon="💼" title="Work Experience" sub="Optional — skip if you have no work experience yet." />

              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3.5 mb-5 text-xs text-amber-700 font-medium flex items-start gap-2">
                <span className="text-base">💡</span>
                <span>This section is <strong>optional</strong>. If you have no experience, leave all fields blank and click <strong>Next</strong>. Only entries with a Company filled in will appear in the PDF.</span>
              </div>

              {form.experience.map((exp, i) => (
                <SectionCard key={i} title={`Experience ${i + 1}`} index={i} showRemove={form.experience.length > 1} onRemove={() => removeItem("experience", i)} optional>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Role / Title" name="role" value={exp.role}
                      onChange={e => handleArrayChange("experience", i, "role", e.target.value)}
                      onBlur={e   => handleArrayBlur("experience",   i, "role", e.target.value)}
                      error={ae("experience", i, "role")} touched={at("experience", i, "role")}
                      placeholder="Software Engineer" />
                    <Field label="Company" name="company" value={exp.company}
                      onChange={e => handleArrayChange("experience", i, "company", e.target.value)}
                      onBlur={e   => handleArrayBlur("experience",   i, "company", e.target.value)}
                      error={ae("experience", i, "company")} touched={at("experience", i, "company")}
                      placeholder="Apple" />
                  </div>
                  <Field label="Company Location" name="location" value={exp.location}
                    onChange={e => handleArrayChange("experience", i, "location", e.target.value)}
                    onBlur={e   => handleArrayBlur("experience",   i, "location", e.target.value)}
                    error={ae("experience", i, "location")} touched={at("experience", i, "location")}
                    placeholder="Cupertino, CA" optional />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Start Date" name="startDate" type="month" value={exp.startDate}
                      onChange={e => handleArrayChange("experience", i, "startDate", e.target.value)}
                      onBlur={e   => handleArrayBlur("experience",   i, "startDate", e.target.value)}
                      error={ae("experience", i, "startDate")} touched={at("experience", i, "startDate")} optional />
                    <Field label="End Date" name="endDate" type="month" value={exp.endDate}
                      onChange={e => handleArrayChange("experience", i, "endDate", e.target.value)}
                      onBlur={e   => handleArrayBlur("experience",   i, "endDate", e.target.value)}
                      error={ae("experience", i, "endDate")} touched={at("experience", i, "endDate")} optional />
                  </div>
                  <TextArea label="Highlights (bullet points)" name="highlights" value={exp.highlights}
                    onChange={e => handleArrayChange("experience", i, "highlights", e.target.value)}
                    onBlur={e   => handleArrayBlur("experience",   i, "highlights", e.target.value)}
                    error={ae("experience", i, "highlights")} touched={at("experience", i, "highlights")}
                    placeholder={"Reduced render time by 75% by implementing a prediction algorithm\nIntegrated search by creating a metadata extraction tool"}
                    hint="One bullet per line → each line becomes a • point in the PDF." rows={5} optional />
                </SectionCard>
              ))}
              <AddMoreBtn onClick={() => addItem("experience", { role: "", company: "", location: "", startDate: "", endDate: "", highlights: "" })} label="Add Another Experience" />
            </>
          )}

          {/* ── STEP 4: Projects ──────────────────────────────────────────── */}
          {step === 4 && (
            <>
              <StepHeader icon="🚀" title="Projects" sub="GitHub URLs show as an icon + repo name in the PDF." />
              {form.projects.map((proj, i) => (
                <SectionCard key={i} title={`Project ${i + 1}`} index={i} showRemove={form.projects.length > 1} onRemove={() => removeItem("projects", i)}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Project Name" name="name" value={proj.name}
                      onChange={e => handleArrayChange("projects", i, "name", e.target.value)}
                      onBlur={e   => handleArrayBlur("projects",   i, "name", e.target.value)}
                      error={ae("projects", i, "name")} touched={at("projects", i, "name")}
                      placeholder="Multi-User Drawing Tool" />
                    <Field label="GitHub / Live URL" name="url" value={proj.url}
                      onChange={e => handleArrayChange("projects", i, "url", e.target.value)}
                      onBlur={e   => handleArrayBlur("projects",   i, "url", e.target.value)}
                      error={ae("projects", i, "url")} touched={at("projects", i, "url")}
                      placeholder="https://github.com/user/repo" optional />
                  </div>

                  {/* Preview badge showing how the link will appear in PDF */}
                  {proj.url && proj.url.includes("github.com") && (
                    <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current text-gray-700" aria-hidden="true">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                      <span className="text-gray-600 font-medium">PDF will show:</span>
                      <span className="font-mono text-gray-800">{proj.url.replace(/^https?:\/\/github\.com\//, '')}</span>
                    </div>
                  )}

                  <TextArea label="Highlights (bullet points)" name="highlights" value={proj.highlights}
                    onChange={e => handleArrayChange("projects", i, "highlights", e.target.value)}
                    onBlur={e   => handleArrayBlur("projects",   i, "highlights", e.target.value)}
                    error={ae("projects", i, "highlights")} touched={at("projects", i, "highlights")}
                    placeholder={"Developed a real-time collaborative drawing board using WebSockets\nTools Used: React, Node.js, Socket.io"}
                    hint="One bullet per line → each becomes a • point in the PDF." rows={4} />
                </SectionCard>
              ))}
              <AddMoreBtn onClick={() => addItem("projects", { name: "", url: "", highlights: "" })} label="Add Another Project" />
            </>
          )}

          {/* ── STEP 5: Technologies ──────────────────────────────────────── */}
          {step === 5 && (
            <>
              <StepHeader icon="⚙️" title="Technologies" sub='Renders as two separate lines: "Languages:" and "Technologies:" in the PDF.' />

              <div className="bg-indigo-50 border-2 border-indigo-100 rounded-xl p-4 mb-5 text-xs text-indigo-600 font-medium flex items-start gap-2">
                <span className="text-base">📋</span>
                <div>
                  <p className="mb-1">These appear <strong>on separate lines</strong> in the PDF exactly as shown:</p>
                  <p className="font-mono bg-white px-2 py-1 rounded border border-indigo-100 text-gray-700">
                    <strong>Languages:</strong> C++, Java, Python…<br />
                    <strong>Technologies:</strong> React, Docker, AWS…
                  </p>
                </div>
              </div>

              <TextArea label="Languages" name="languages" value={form.languages}
                onChange={handleChange} onBlur={handleBlur}
                error={e("languages")} touched={t("languages")}
                placeholder="C++, Java, Python, JavaScript, SQL, TypeScript"
                hint="Programming languages only — comma-separated" rows={2} />

              <TextArea label="Technologies / Tools" name="technologies" value={form.technologies}
                onChange={handleChange} onBlur={handleBlur}
                error={e("technologies")} touched={t("technologies")}
                placeholder=".NET, React, Node.js, PostgreSQL, Docker, AWS, Git"
                hint="Frameworks, databases, platforms, tools — comma-separated" rows={2} />

              <div className="mt-8 pt-6 border-t-2 border-indigo-50">
                <button onClick={handleSubmit} disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 uppercase tracking-wide">
                  {loading ? "⏳ Generating PDF…" : "🚀 Generate Resume PDF"}
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">Generates a LaTeX-style PDF using Liberation Serif font</p>
              </div>
            </>
          )}
        </div>

        {/* Nav */}
        <div className="flex justify-between items-center mt-5">
          <button onClick={goPrev} disabled={step === 1}
            className="px-6 py-2.5 border-2 border-indigo-100 bg-white text-indigo-600 rounded-xl text-sm font-semibold hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            ← Back
          </button>
          <span className="text-xs text-gray-400 font-medium">Step {step} of {STEPS.length}</span>
          {step < STEPS.length && (
            <button onClick={goNext}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200">
              Next →
            </button>
          )}
        </div>
      </main>

      {/* PDF Preview */}
      {pdfUrl && (
        <div className="max-w-2xl mx-auto px-5 pb-16">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-indigo-100" />
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">PDF Preview</p>
            <div className="h-px flex-1 bg-indigo-100" />
          </div>
          <iframe src={pdfUrl} title="Resume PDF" className="w-full h-[700px] border-2 border-indigo-100 rounded-2xl shadow-lg" />
        </div>
      )}
    </div>
  );
}