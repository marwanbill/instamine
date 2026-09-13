import { useState, type ChangeEvent, type FormEvent } from "react";
import { X } from "lucide-react";
import { useUploadGalleryPost } from "../../hooks/useGallery";

interface GalleryUploadModalProps {
  onClose: () => void;
}

export function GalleryUploadModal({ onClose }: GalleryUploadModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { mutate, isPending, error } = useUploadGalleryPost();

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) return;

    mutate(
      {
        file,
        title: title.trim(),
        description: description.trim() || undefined,
      },
      { onSuccess: onClose },
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-line bg-paper p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-ink/50 hover:text-ink"
        >
          <X size={18} />
        </button>

        <h2 className="font-display text-lg font-semibold text-blue-deep">
          Add a picture
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block cursor-pointer">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-40 w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-40 w-full items-center justify-center rounded-lg border-2 border-dashed border-line text-sm text-ink/50">
                Click to choose a photo
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              required
            />
          </label>

          <div>
            <label className="text-xs font-medium text-ink/70">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue-mid"
              placeholder="Reunion 2025"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ink/70">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={280}
              rows={3}
              className="mt-1 w-full resize-none rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue-mid"
              placeholder="A short caption for this photo…"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600">
              {(error as any)?.response?.data?.error ??
                "Something went wrong — try again."}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || !file || !title.trim()}
            className="w-full rounded-full bg-blue-deep py-2 text-sm font-medium text-paper disabled:opacity-50"
          >
            {isPending ? "Uploading…" : "Post picture"}
          </button>
        </form>
      </div>
    </div>
  );
}
