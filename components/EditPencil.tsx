export default function EditPencil({
  editing,
  onClick,
  label,
  disabled = false,
}: {
  editing: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={editing ? `Done editing ${label}` : `Edit ${label}`}
      title={editing ? "Done editing" : "Edit this section"}
      className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${
        editing
          ? "bg-ink text-paper border-ink"
          : "bg-white/60 text-ink/50 border-ink/15 hover:bg-ink/5 hover:text-ink/80"
      } disabled:opacity-40`}
    >
      {editing ? (
        <svg viewBox="0 0 12 10" className="w-3 h-3" fill="none">
          <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" className="w-3 h-3" fill="none">
          <path
            d="M13.5 3.5l3 3L6 17l-4 1 1-4L13.5 3.5z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
