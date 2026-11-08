"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { HiOutlinePaperAirplane, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import { useFeedback } from "@/components/dash/feedback";
import { Badge, DashHeader, Panel, btn, type Tone } from "@/components/dash/primitives";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/dash/states";
import { useResource } from "@/components/dash/use-resource";
import { api, ApiError } from "@/lib/vowly/client";
import { cn } from "@/lib/utils";
import { formatDate, formatRupiah } from "@/lib/vowly/format";
import type { BudgetSummary, ChatAction, ChatActionStatus, ChatMessage, Conversation, ConversationDetail } from "@/lib/vowly/types";
import { ProgressBar } from "@/components/dash/primitives";
import { useProject, useProjectApi } from "../project-context";

const actionStatus: Record<ChatActionStatus, { label: string; tone: Tone }> = {
  proposed: { label: "Menunggu konfirmasi", tone: "warning" },
  confirmed: { label: "Dikonfirmasi", tone: "gold" },
  executed: { label: "Terkirim", tone: "success" },
  rejected: { label: "Ditolak", tone: "neutral" },
  failed: { label: "Gagal", tone: "danger" },
};

function ActionCard({ action, onConfirm, onReject, busy }: { action: ChatAction; onConfirm: (message: string) => void; onReject: () => void; busy: boolean }) {
  const [draft, setDraft] = useState(action.draft);
  const status = actionStatus[action.status];
  return (
    <div className="mt-2 rounded-xl border border-gold/60 bg-cream p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold">{action.label}</p>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>
      {action.status === "proposed" ? (
        <>
          <label className="mt-2 block text-xs font-semibold" htmlFor={`draft-${action.id}`}>
            Pesan (boleh diubah sebelum dikirim)
          </label>
          <textarea
            id={`draft-${action.id}`}
            rows={3}
            maxLength={1000}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gold/70 bg-white p-2 text-sm"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className={btn.secondary} disabled={busy} onClick={onReject}>
              Tolak
            </button>
            <button type="button" className={btn.primary} disabled={busy} onClick={() => onConfirm(draft)}>
              Konfirmasi & kirim
            </button>
          </div>
        </>
      ) : (
        <p className="mt-1 text-xs text-ink-soft">{action.draft}</p>
      )}
    </div>
  );
}

/** Quick prompts that fill the message box; the user still reviews and sends them. */
const suggestions = ["Hitung kebutuhan souvenir", "Buat draf rundown 30 menit", "Cari efisiensi anggaran 10%", "Tulis sambutan keluarga"];

function ContextPanel() {
  const { project, daysUntil } = useProject();
  const path = useProjectApi();
  const budget = useResource<BudgetSummary>(path("/budget-summary"));
  const rows: [string, string][] = [
    ["Mempelai", project.title],
    ["Tanggal Acara", formatDate(project.event_date)],
    ["Venue", [project.venue, project.city].filter(Boolean).join(", ") || "-"],
    ["Target Tamu", project.guest_count ? `${project.guest_count} Undangan` : "-"],
  ];
  return (
    <Panel className="h-fit">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold">Konteks Pernikahan</h2>
        {daysUntil !== null && daysUntil > 0 ? <Badge tone="gold">H-{daysUntil} Hari</Badge> : null}
      </div>
      <dl className="mt-4 space-y-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 border-b border-gold/30 pb-2">
            <dt className="text-xs text-ink-soft">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      {budget.data ? (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span>Alokasi Anggaran Total</span>
            <strong className="text-ink">{formatRupiah(budget.data.total_budget)}</strong>
          </div>
          <div className="mt-2">
            <ProgressBar value={budget.data.actual_total} max={Math.max(budget.data.total_budget, 1)} tone={budget.data.over_budget ? "danger" : "primary"} />
          </div>
          <p className="mt-1 text-xs text-ink-soft">
            Terpakai {formatRupiah(budget.data.actual_total)} • Sisa {formatRupiah(budget.data.remaining)}
          </p>
        </div>
      ) : null}
      <p className="mt-4 text-[11px] leading-4 text-ink-soft">Asisten hanya menerima ringkasan proyek dan nama vendor. Data tamu, keluarga, dan rekening tidak dikirim.</p>
    </Panel>
  );
}

function Chat({ conversationId, onDeleted }: { conversationId: string; onDeleted: () => void }) {
  const path = useProjectApi();
  const feedback = useFeedback();
  const detail = useResource<ConversationDetail>(path(`/ai/conversations/${conversationId}`));
  // Messages re-read after a send/confirm override the initially loaded ones.
  const [fresh, setFresh] = useState<ChatMessage[]>();
  const messages = fresh ?? detail.data?.messages ?? [];
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [busyAction, setBusyAction] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function send(event: FormEvent) {
    event.preventDefault();
    const content = text.trim();
    if (!content || sending) return;
    setSending(true);
    try {
      await api.post(path(`/ai/conversations/${conversationId}/messages`), { content });
      setText("");
      // The reply (with proposed actions) is read back from the conversation so the UI shows what is stored.
      const { data } = await api.get<ConversationDetail>(path(`/ai/conversations/${conversationId}`));
      setFresh(data.messages);
    } catch (cause) {
      feedback.error("Pesan tidak terkirim", cause instanceof ApiError ? cause.message : undefined);
    } finally {
      setSending(false);
    }
  }

  async function act(action: ChatAction, kind: "confirm" | "reject", message?: string) {
    setBusyAction(true);
    try {
      await api.post(path(`/ai/conversations/${conversationId}/actions/${action.id}/${kind}`), kind === "confirm" ? { message: message ?? "" } : {});
      feedback.success(kind === "confirm" ? "Tindakan dikonfirmasi" : "Tindakan ditolak");
      const { data } = await api.get<ConversationDetail>(path(`/ai/conversations/${conversationId}`));
      setFresh(data.messages);
    } catch (cause) {
      feedback.error("Gagal memproses tindakan", cause instanceof ApiError ? cause.message : undefined);
    } finally {
      setBusyAction(false);
    }
  }

  async function remove() {
    const ok = await feedback.confirm({ title: "Hapus percakapan?", description: "Seluruh pesan dalam percakapan ini dihapus.", confirmLabel: "Hapus", danger: true });
    if (!ok) return;
    try {
      await api.delete(path(`/ai/conversations/${conversationId}`));
      onDeleted();
    } catch (cause) {
      feedback.error("Gagal menghapus", cause instanceof ApiError ? cause.message : undefined);
    }
  }

  if (detail.loading) return <LoadingBlock rows={5} />;
  if (detail.error || !detail.data) return <ErrorState error={detail.error} onRetry={detail.reload} />;

  return (
    <div className="flex h-[70vh] flex-col">
      <div className="flex items-center justify-between border-b border-gold/40 pb-3">
        <div>
          <p className="font-semibold">{detail.data.conversation.title || "Percakapan"}</p>
          <p className="text-xs text-ink-soft">Berlaku sampai {formatDate(detail.data.conversation.expires_at, "short")} • privat untuk Anda</p>
        </div>
        <button type="button" className={btn.icon} aria-label="Hapus percakapan" onClick={() => void remove()}>
          <HiOutlineTrash className="size-4" aria-hidden />
        </button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto py-4" aria-live="polite">
        {messages.length === 0 ? <EmptyState title="Mulai bertanya" description="Contoh: “Tolong hubungi vendor katering soal penawaran.” Tidak ada pesan terkirim tanpa konfirmasi Anda." /> : null}
        {messages.map((message) => (
          <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm", message.role === "user" ? "bg-blush text-blush-foreground" : "border border-gold/50 bg-white")}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.actions.map((action) => (
                <ActionCard key={action.id} action={action} busy={busyAction} onConfirm={(draft) => void act(action, "confirm", draft)} onReject={() => void act(action, "reject")} />
              ))}
            </div>
          </div>
        ))}
        <div ref={bottom} />
      </div>
      <div className="flex flex-wrap gap-2 border-t border-gold/40 pt-3">
        {suggestions.map((suggestion) => (
          <button key={suggestion} type="button" onClick={() => setText(suggestion)} className="rounded-full border border-gold/60 bg-cream px-3 py-1 text-xs hover:bg-gold/30">
            {suggestion}
          </button>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2 pt-3">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={2000}
          aria-label="Pesan"
          placeholder="Tulis pesan…"
          className="h-10 flex-1 rounded-lg border border-gold/70 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        <button type="submit" className={btn.primary} disabled={sending || text.trim() === ""}>
          <HiOutlinePaperAirplane className="size-4" aria-hidden />
          {sending ? "Mengirim…" : "Kirim"}
        </button>
      </form>
    </div>
  );
}

export function AiView() {
  const path = useProjectApi();
  const feedback = useFeedback();
  const list = useResource<Conversation[]>(path("/ai/conversations"), { limit: 50 });
  const [activeId, setActiveId] = useState<string>();

  const current = activeId ?? list.data?.[0]?.id;

  async function create() {
    try {
      const { data } = await api.post<Conversation>(path("/ai/conversations"), {});
      setActiveId(data.id);
      list.reload();
    } catch (cause) {
      feedback.error("Gagal membuat percakapan", cause instanceof ApiError ? cause.message : undefined);
    }
  }

  return (
    <>
      <DashHeader eyebrow="Assistant" title="Konsultasi & Ide Konsep" description="Asisten hanya menyarankan. Pesan ke vendor baru dikirim setelah Anda mengonfirmasi. Ini masih mode simulasi." />
      <div className="grid gap-4 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_300px]">
        <Panel className="p-3 sm:p-3">
          <button type="button" className={`${btn.primary} mb-3 w-full`} onClick={() => void create()}>
            <HiOutlinePlus className="size-4" aria-hidden />
            Percakapan baru
          </button>
          {list.loading ? (
            <LoadingBlock rows={3} />
          ) : list.error ? (
            <ErrorState error={list.error} onRetry={list.reload} />
          ) : (
            <ul className="space-y-1">
              {(list.data ?? []).map((conversation) => (
                <li key={conversation.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(conversation.id)}
                    aria-current={conversation.id === current ? "true" : undefined}
                    className={cn("w-full truncate rounded-lg px-3 py-2 text-left text-sm", conversation.id === current ? "bg-blush" : "hover:bg-cream")}
                  >
                    {conversation.title || formatDate(conversation.created_at, "short")}
                  </button>
                </li>
              ))}
              {(list.data ?? []).length === 0 ? <li className="px-3 py-2 text-xs text-ink-soft">Belum ada percakapan.</li> : null}
            </ul>
          )}
        </Panel>
        <Panel>
          {current ? (
            <Chat
              key={current}
              conversationId={current}
              onDeleted={() => {
                setActiveId(undefined);
                list.reload();
              }}
            />
          ) : (
            <EmptyState title="Belum ada percakapan" description="Buat percakapan baru untuk mulai berkonsultasi." />
          )}
        </Panel>
        <ContextPanel />
      </div>
    </>
  );
}
