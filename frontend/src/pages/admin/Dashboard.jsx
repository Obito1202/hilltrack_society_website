import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Container } from "@/components/site/common";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, Pencil, Save, X } from "lucide-react";
import { useCrud, Field, TextInput, TextArea, ImageUpload } from "./parts";
import { api } from "@/lib/api";
import { useEffect } from "react";

const TABS = [
  { key: "members", label: "Members" },
  { key: "events", label: "Events" },
  { key: "achievements", label: "Achievements" },
  { key: "schools", label: "Schools" },
  { key: "gallery", label: "Gallery" },
  { key: "settings", label: "Site Settings" },
];

function emptyFor(tab) {
  switch (tab) {
    case "members": return { name: "", role: "", email: "", description: "", image_url: "", order: 0 };
    case "events": return { title: "", date: "", location: "", description: "", image_url: "" };
    case "achievements": return { title: "", year: "", description: "", image_url: "" };
    case "schools": return { name: "", location: "", visit_date: "", description: "", image_url: "" };
    case "gallery": return { caption: "", image_url: "" };
    default: return {};
  }
}

function CrudPanel({ tab }) {
  const { items, create, update, remove } = useCrud(tab);
  const [editing, setEditing] = useState(null); // id or "new"
  const [form, setForm] = useState(emptyFor(tab));

  const startNew = () => { setEditing("new"); setForm(emptyFor(tab)); };
  const startEdit = (item) => { setEditing(item.id); setForm({ ...emptyFor(tab), ...item }); };
  const cancel = () => { setEditing(null); setForm(emptyFor(tab)); };

  const save = async () => {
    try {
      if (editing === "new") await create(form);
      else await update(editing, form);
      toast.success("Saved");
      cancel();
    } catch (e) { toast.error("Save failed"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try { await remove(id); toast.success("Deleted"); } catch { toast.error("Delete failed"); }
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const renderForm = () => {
    const f = form;
    if (tab === "members") return (
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Name"><TextInput value={f.name} onChange={(v) => set("name", v)} testId="form-name" /></Field>
        <Field label="Role"><TextInput value={f.role} onChange={(v) => set("role", v)} testId="form-role" /></Field>
        <Field label="Email"><TextInput value={f.email} onChange={(v) => set("email", v)} testId="form-email" /></Field>
        <Field label="Display Order"><TextInput type="number" value={f.order} onChange={(v) => set("order", Number(v))} testId="form-order" /></Field>
        <div className="sm:col-span-2"><Field label="Description"><TextArea value={f.description} onChange={(v) => set("description", v)} testId="form-description" /></Field></div>
        <div className="sm:col-span-2"><Field label="Photo"><ImageUpload value={f.image_url} onChange={(v) => set("image_url", v)} testId="form-image" /></Field></div>
      </div>
    );
    if (tab === "events") return (
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title"><TextInput value={f.title} onChange={(v) => set("title", v)} testId="form-title" /></Field>
        <Field label="Date"><TextInput type="date" value={f.date} onChange={(v) => set("date", v)} testId="form-date" /></Field>
        <Field label="Location"><TextInput value={f.location} onChange={(v) => set("location", v)} testId="form-location" /></Field>
        <div className="sm:col-span-2"><Field label="Description"><TextArea value={f.description} onChange={(v) => set("description", v)} testId="form-description" /></Field></div>
        <div className="sm:col-span-2"><Field label="Image"><ImageUpload value={f.image_url} onChange={(v) => set("image_url", v)} testId="form-image" /></Field></div>
      </div>
    );
    if (tab === "achievements") return (
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title"><TextInput value={f.title} onChange={(v) => set("title", v)} testId="form-title" /></Field>
        <Field label="Year"><TextInput value={f.year} onChange={(v) => set("year", v)} testId="form-year" /></Field>
        <div className="sm:col-span-2"><Field label="Description"><TextArea value={f.description} onChange={(v) => set("description", v)} testId="form-description" /></Field></div>
        <div className="sm:col-span-2"><Field label="Image"><ImageUpload value={f.image_url} onChange={(v) => set("image_url", v)} testId="form-image" /></Field></div>
      </div>
    );
    if (tab === "schools") return (
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="School Name"><TextInput value={f.name} onChange={(v) => set("name", v)} testId="form-name" /></Field>
        <Field label="Location"><TextInput value={f.location} onChange={(v) => set("location", v)} testId="form-location" /></Field>
        <Field label="Visit Date"><TextInput type="date" value={f.visit_date} onChange={(v) => set("visit_date", v)} testId="form-date" /></Field>
        <div className="sm:col-span-2"><Field label="Description"><TextArea value={f.description} onChange={(v) => set("description", v)} testId="form-description" /></Field></div>
        <div className="sm:col-span-2"><Field label="Image"><ImageUpload value={f.image_url} onChange={(v) => set("image_url", v)} testId="form-image" /></Field></div>
      </div>
    );
    if (tab === "gallery") return (
      <div className="space-y-4">
        <Field label="Caption"><TextInput value={f.caption} onChange={(v) => set("caption", v)} testId="form-caption" /></Field>
        <Field label="Image"><ImageUpload value={f.image_url} onChange={(v) => set("image_url", v)} testId="form-image" /></Field>
      </div>
    );
    return null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif-display text-3xl" style={{ color: "var(--ink)" }}>Manage {tab}</h2>
        {!editing && (
          <button onClick={startNew} className="btn-primary text-sm" data-testid="add-new-btn">
            <Plus size={14} /> Add new
          </button>
        )}
      </div>

      {editing && (
        <div className="mb-8 p-6" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
          <div className="overline mb-4">{editing === "new" ? "New entry" : "Editing"}</div>
          {renderForm()}
          <div className="mt-6 flex gap-3">
            <button onClick={save} className="btn-primary text-sm" data-testid="save-btn"><Save size={14} /> Save</button>
            <button onClick={cancel} className="btn-outline text-sm" data-testid="cancel-btn"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 && <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Nothing here yet.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4" style={{ border: "1px solid var(--line)" }} data-testid={`row-${item.id}`}>
            <div className="flex-1 min-w-0">
              <div className="font-serif-display text-xl" style={{ color: "var(--ink)" }}>
                {item.name || item.title || item.caption || "(untitled)"}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                {item.role || item.year || item.location || item.date || ""}
              </div>
            </div>
            <div className="flex gap-2">
              {tab !== "gallery" && (
                <button onClick={() => startEdit(item)} className="btn-outline text-xs" data-testid={`edit-${item.id}`}><Pencil size={12} /> Edit</button>
              )}
              <button onClick={() => del(item.id)} className="btn-outline text-xs" style={{ borderColor: "var(--error)", color: "var(--error)" }} data-testid={`delete-${item.id}`}><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPanel() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get("/settings").then((r) => setS(r.data)); }, []);
  if (!s) return <p>Loading...</p>;
  const set = (k, v) => setS({ ...s, [k]: v });
  const save = async () => {
    try { await api.put("/settings", s); toast.success("Settings saved"); }
    catch { toast.error("Save failed"); }
  };
  return (
    <div>
      <h2 className="font-serif-display text-3xl mb-6" style={{ color: "var(--ink)" }}>Site Settings</h2>
      <div className="grid gap-5 max-w-3xl">
        <Field label="About text"><TextArea rows={5} value={s.about} onChange={(v) => set("about", v)} testId="settings-about" /></Field>
        <Field label="Aims (one per line)">
          <TextArea rows={10} value={(s.aims || []).join("\n")} onChange={(v) => set("aims", v.split("\n").filter(Boolean))} testId="settings-aims" />
        </Field>
        <Field label="Contact Email"><TextInput value={s.contact_email} onChange={(v) => set("contact_email", v)} testId="settings-email" /></Field>
        <Field label="Contact Phone"><TextInput value={s.contact_phone} onChange={(v) => set("contact_phone", v)} testId="settings-phone" /></Field>
        <Field label="Address"><TextArea value={s.contact_address} onChange={(v) => set("contact_address", v)} testId="settings-address" /></Field>
        <Field label="Bank Details (shown on Donate page)"><TextArea rows={5} value={s.bank_details} onChange={(v) => set("bank_details", v)} testId="settings-bank" /></Field>
        <Field label="UPI ID"><TextInput value={s.upi_id} onChange={(v) => set("upi_id", v)} testId="settings-upi" /></Field>
      </div>
      <div className="mt-6">
        <button onClick={save} className="btn-primary text-sm" data-testid="settings-save"><Save size={14} /> Save settings</button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("members");

  if (user === null) return <div className="p-10">Loading...</div>;
  if (user === false) { nav("/admin/login"); return null; }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="border-b" style={{ borderColor: "var(--line)" }}>
        <Container className="py-5 flex items-center justify-between">
          <div>
            <div className="overline">Admin Console</div>
            <div className="font-serif-display text-2xl" style={{ color: "var(--ink)" }}>Hilltrack Society CMS</div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm nav-link" style={{ color: "var(--ink)" }} data-testid="view-site-link">View site</Link>
            <button onClick={() => { logout(); nav("/admin/login"); }} className="btn-outline text-sm" data-testid="logout-btn"><LogOut size={14} /> Logout</button>
          </div>
        </Container>
      </header>

      <Container className="py-10 grid lg:grid-cols-12 gap-10">
        <nav className="lg:col-span-3">
          <div className="space-y-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${tab === t.key ? "" : "hover:bg-[var(--surface)]"}`}
                style={tab === t.key ? { background: "var(--ink)", color: "var(--bg)" } : { color: "var(--ink)" }}
                data-testid={`tab-${t.key}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </nav>
        <section className="lg:col-span-9">
          {tab === "settings" ? <SettingsPanel /> : <CrudPanel tab={tab} key={tab} />}
        </section>
      </Container>
    </div>
  );
}
