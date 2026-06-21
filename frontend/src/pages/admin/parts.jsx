import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

export function ImageUpload({ value, onChange, testId = "image-upload" }) {
  const [uploading, setUploading] = useState(false);
  const onPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="flex items-center gap-3">
      <label className="btn-outline cursor-pointer text-sm" data-testid={`${testId}-btn`}>
        <Upload size={14} /> {uploading ? "Uploading..." : "Upload image"}
        <input type="file" accept="image/*" onChange={onPick} className="hidden" data-testid={`${testId}-input`} />
      </label>
      {value && (
        <div className="flex items-center gap-2">
          <span className="text-xs truncate max-w-[200px]" style={{ color: "var(--ink-soft)" }}>{value.split("/").pop()}</span>
          <button type="button" onClick={() => onChange("")} className="text-xs underline" data-testid={`${testId}-clear`}><X size={12} /></button>
        </div>
      )}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="overline">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function TextInput({ value, onChange, type = "text", testId, ...rest }) {
  return (
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      data-testid={testId}
      className="w-full px-3 py-2 bg-transparent text-sm"
      style={{ border: "1px solid var(--line)", color: "var(--ink)" }}
      {...rest}
    />
  );
}

export function TextArea({ value, onChange, testId, rows = 3, ...rest }) {
  return (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      data-testid={testId}
      rows={rows}
      className="w-full px-3 py-2 bg-transparent text-sm"
      style={{ border: "1px solid var(--line)", color: "var(--ink)" }}
      {...rest}
    />
  );
}

export function useCrud(resource) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get(`/${resource}`); setItems(data); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);
  const create = async (body) => { await api.post(`/${resource}`, body); await load(); };
  const update = async (id, body) => { await api.put(`/${resource}/${id}`, body); await load(); };
  const remove = async (id) => { await api.delete(`/${resource}/${id}`); await load(); };
  return { items, loading, load, create, update, remove };
}
