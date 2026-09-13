import { Plus, Trash2 } from "lucide-react";
import type { CareerEntryDraft } from "../../types/alumniProfile";

interface CareerEntriesEditorProps {
  value: CareerEntryDraft[];
  onChange: (entries: CareerEntryDraft[]) => void;
}

const emptyEntry: CareerEntryDraft = {
  title: "",
  company: "",
  startMonth: "",
  endMonth: "",
  isCurrent: false,
};

export function CareerEntriesEditor({ value, onChange }: CareerEntriesEditorProps) {
  function updateEntry(index: number, patch: Partial<CareerEntryDraft>) {
    const next = value.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
    onChange(next);
  }

  function removeEntry(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function addEntry() {
    onChange([...value, { ...emptyEntry }]);
  }

  return (
    <div className="space-y-3">
      {value.map((entry, index) => (
        <div key={index} className="rounded-lg border border-line p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="grid flex-1 grid-cols-2 gap-2">
              <input
                value={entry.title}
                onChange={(e) => updateEntry(index, { title: e.target.value })}
                placeholder="Job title"
                className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue-mid"
              />
              <input
                value={entry.company}
                onChange={(e) => updateEntry(index, { company: e.target.value })}
                placeholder="Company"
                className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue-mid"
              />
            </div>
            <button
              type="button"
              onClick={() => removeEntry(index)}
              className="mt-1 shrink-0 text-ink/40 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <label className="text-xs text-ink/60">From</label>
            <input
              type="month"
              value={entry.startMonth}
              onChange={(e) => updateEntry(index, { startMonth: e.target.value })}
              className="rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-blue-mid"
            />

            <label className="text-xs text-ink/60">To</label>
            <input
              type="month"
              value={entry.endMonth}
              disabled={entry.isCurrent}
              onChange={(e) => updateEntry(index, { endMonth: e.target.value })}
              className="rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-blue-mid disabled:opacity-40"
            />

            <label className="flex items-center gap-1.5 text-xs text-ink/70">
              <input
                type="checkbox"
                checked={entry.isCurrent}
                onChange={(e) => updateEntry(index, { isCurrent: e.target.checked, endMonth: "" })}
              />
              Current role
            </label>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEntry}
        className="flex items-center gap-1.5 text-sm font-medium text-blue-mid hover:underline"
      >
        <Plus size={14} /> Add another role
      </button>
    </div>
  );
}