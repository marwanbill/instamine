import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

interface SkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
}

export function SkillsInput({ value, onChange }: SkillsInputProps) {
  const [draft, setDraft] = useState("");

  function addSkill() {
    const skill = draft.trim();
    if (!skill || value.includes(skill)) {
      setDraft("");
      return;
    }
    onChange([...value, skill]);
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  }

  function removeSkill(skill: string) {
    onChange(value.filter((s) => s !== skill));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-lg border border-line p-2">
        {value.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1 rounded-full bg-blue-deep/10 px-2.5 py-1 text-xs font-medium text-blue-deep"
          >
            {skill}
            <button type="button" onClick={() => removeSkill(skill)}>
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addSkill}
          placeholder="Type a skill and press Enter…"
          className="min-w-[140px] flex-1 border-none px-1 py-1 text-sm outline-none"
        />
      </div>
    </div>
  );
}