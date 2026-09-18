"use client";

import { useEffect, useState } from "react";
import EditPencil from "./EditPencil";

interface Item {
  id: string;
  text: string;
  done: boolean;
}

export default function TodoListPersonal() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [editDrafts, setEditDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/todolist")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]));
  }, []);

  async function addItem() {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    const res = await fetch("/api/todolist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      const { item } = await res.json();
      setItems((prev) => [...(prev ?? []), item]);
    }
  }

  async function toggleDone(item: Item) {
    setItems((prev) => prev?.map((it) => (it.id === item.id ? { ...it, done: !it.done } : it)) ?? prev);
    await fetch(`/api/todolist/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !item.done }),
    });
  }

  async function deleteItem(id: string) {
    setItems((prev) => prev?.filter((it) => it.id !== id) ?? prev);
    await fetch(`/api/todolist/${id}`, { method: "DELETE" });
  }

  async function toggleEditMode() {
    if (editing && items) {
      const changed = items.filter((it) => editDrafts[it.id] !== undefined && editDrafts[it.id].trim() && editDrafts[it.id] !== it.text);
      await Promise.all(
        changed.map((it) =>
          fetch(`/api/todolist/${it.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: editDrafts[it.id].trim() }),
          })
        )
      );
      if (changed.length) {
        setItems((prev) =>
          prev?.map((it) => (editDrafts[it.id]?.trim() ? { ...it, text: editDrafts[it.id].trim() } : it)) ?? prev
        );
      }
      setEditDrafts({});
    } else if (items) {
      const drafts: Record<string, string> = {};
      items.forEach((it) => {
        drafts[it.id] = it.text;
      });
      setEditDrafts(drafts);
    }
    setEditing((e) => !e);
  }

  return (
    <div>
      <div className="flex items-center justify-end -mt-1 mb-2">
        <EditPencil editing={editing} onClick={toggleEditMode} label="My To-Do List" disabled={!items || items.length === 0} />
      </div>

      {!editing && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem();
              }
            }}
            placeholder="Add a task…"
            maxLength={200}
            className="flex-1 min-w-0 rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm outline-none focus:border-sage"
          />
          <button
            onClick={addItem}
            className="shrink-0 rounded-lg bg-sage text-white text-sm font-semibold px-4 hover:opacity-90"
          >
            Add
          </button>
        </div>
      )}

      {editing && <p className="text-xs font-semibold text-terracotta mb-3">Click a task to rename it — check to save.</p>}

      {!items ? (
        <div className="h-16 rounded-lg bg-paper2 animate-pulse" />
      ) : items.length === 0 ? (
        <p className="text-sm text-ink/40 italic">Nothing on your list yet — add one above.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              {!editing && (
                <label className="flex items-center shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleDone(item)}
                    className="sr-only"
                  />
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      item.done ? "bg-sage border-sage" : "border-ink/30"
                    }`}
                  >
                    {item.done && (
                      <svg viewBox="0 0 12 10" className="w-2.5 h-2.5" fill="none">
                        <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </label>
              )}
              {editing ? (
                <input
                  type="text"
                  value={editDrafts[item.id] ?? item.text}
                  onChange={(e) => setEditDrafts((d) => ({ ...d, [item.id]: e.target.value }))}
                  className="flex-1 min-w-0 rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1 text-sm outline-none focus:border-terracotta"
                />
              ) : (
                <span className={`flex-1 text-[15px] ${item.done ? "line-through text-ink/40" : "text-ink/90"}`}>
                  {item.text}
                </span>
              )}
              {!editing && (
                <button
                  onClick={() => deleteItem(item.id)}
                  aria-label="Delete task"
                  className="shrink-0 text-ink/30 hover:text-terracotta text-lg leading-none w-5"
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
