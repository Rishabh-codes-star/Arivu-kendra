"use client";

import { useState } from "react";
import { MessageSquare, ThumbsUp } from "lucide-react";
import type { DiscussionPost } from "@/lib/types";

export function Discussion({ posts: initial, bookSlug }: { posts: DiscussionPost[]; bookSlug: string }) {
  const [posts, setPosts] = useState(initial);
  const [draft, setDraft] = useState("");
  const [name, setName] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setPosts((p) => [
      { id: `${bookSlug}-${Date.now()}`, author: name.trim() || "Guest reader", role: "Reader", when: "Just now", text, likes: 0 },
      ...p,
    ]);
    setDraft("");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <ol className="space-y-4">
        {posts.map((p) => (
          <li key={p.id}>
            <Post post={p} />
            {p.replies?.length ? (
              <ol className="ml-6 mt-3 space-y-3 border-l-2 border-line pl-5 sm:ml-12">
                {p.replies.map((r) => (
                  <li key={r.id}>
                    <Post post={r} reply />
                  </li>
                ))}
              </ol>
            ) : null}
          </li>
        ))}
      </ol>
      <form onSubmit={submit} className="h-fit rounded-xl3 border border-line bg-paper-card p-5 lg:sticky lg:top-28">
        <h3 className="display flex items-center gap-2 text-lg font-semibold">
          <MessageSquare className="h-4 w-4 text-ink-soft" aria-hidden="true" /> Join the discussion
        </h3>
        <p className="mt-1 text-xs text-ink-faint">Posting as a guest. Sign in with your mobile number to keep your posts across devices.</p>
        <label className="mt-4 block text-xs font-medium text-ink-soft">
          Your name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none" />
        </label>
        <label className="mt-3 block text-xs font-medium text-ink-soft">
          Your post
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            placeholder="What did you notice? What would you ask the author?"
            className="mt-1 w-full resize-y rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none"
          />
        </label>
        <button type="submit" disabled={!draft.trim()} className="mt-3 w-full rounded-full bg-ink py-2.5 text-sm font-medium text-paper transition hover:bg-accent disabled:opacity-40">
          Post
        </button>
      </form>
    </div>
  );
}

function Post({ post, reply = false }: { post: DiscussionPost; reply?: boolean }) {
  const [likes, setLikes] = useState(post.likes ?? 0);
  const [liked, setLiked] = useState(false);
  const initials = post.author
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const provider = post.role.toLowerCase().includes("provider") || post.role === "Platform";
  return (
    <article className={`rounded-xl3 ${reply ? "bg-paper-card/60 p-4" : "border border-line bg-paper-card p-5"}`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${provider ? "bg-ink text-paper" : "bg-paper-deep text-ink-soft"}`} aria-hidden="true">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 text-sm">
            <span className="font-semibold">{post.author}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${provider ? "bg-ink text-paper" : "bg-paper-deep text-ink-soft"}`}>{post.role}</span>
            <span className="text-xs text-ink-faint">{post.when}</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-ink">{post.text}</p>
      {!reply && (
        <div className="mt-3 flex items-center gap-3 text-xs text-ink-faint">
          <button
            type="button"
            onClick={() => {
              setLiked((v) => !v);
              setLikes((n) => (liked ? n - 1 : n + 1));
            }}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 transition hover:bg-paper-deep ${liked ? "font-semibold text-ink" : ""}`}
            aria-pressed={liked}
          >
            <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" /> {likes}
          </button>
          <span>Reply</span>
        </div>
      )}
    </article>
  );
}
