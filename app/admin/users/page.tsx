import Link from "next/link";
import { requireAdmin } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { DeleteUserButton, NewUserForm, ResetPasswordButton } from "./UserForms";

/** Admin-only: requireAdmin redirects an author back to /admin. */
export const dynamic = "force-dynamic";

/** Up to two letters, from the first and last word of a name. */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const first = words[0][0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const ERRORS: Record<string, string> = {
  self: "You can't remove your own account.",
  posts: "That person has published posts. Reassign or delete them first.",
  "1": "Couldn't remove that account.",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; error?: string }>;
}) {
  const admin = await requireAdmin();
  const flags = await searchParams;

  let people = null;
  try {
    people = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { posts: true } },
      },
      orderBy: [{ role: "asc" }, { name: "asc" }],
    });
  } catch (error) {
    console.error("[admin] could not load users", error);
  }

  return (
    <>
      <div className="mb-10">
        <Link
          href="/admin"
          className="text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
        >
          ← Posts
        </Link>
        <h1 className="mt-4 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
          People
        </h1>
        <p className="mt-2 text-sm text-muted">
          There is no public signup — accounts are created here.
        </p>
      </div>

      {flags.deleted && (
        <p className="mb-6 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          Account removed.
        </p>
      )}
      {flags.error && (
        <p className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {ERRORS[flags.error] ?? "Something went wrong."}
        </p>
      )}

      {people === null ? (
        <p className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
          The database is unreachable. Check <code>DATABASE_URL</code> in{" "}
          <code>.env</code>, then reload.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr]">
          <ul className="flex flex-col gap-3">
            {people.map((person) => (
              <li
                key={person.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-slate-300"
              >
                <span
                  aria-hidden="true"
                  className={`studio-avatar ${person.id === admin.id ? "studio-avatar-self" : ""}`}
                >
                  {initials(person.name)}
                </span>

                <div className="min-w-0 flex-1">
                  <span className="font-display text-sm font-semibold tracking-tight text-white">
                    {person.name}
                    {person.id === admin.id && (
                      <span className="ml-2 text-xs font-normal text-muted">(you)</span>
                    )}
                  </span>
                  <p className="mt-1 truncate text-xs text-muted">
                    {person.email} · {person._count.posts} post
                    {person._count.posts === 1 ? "" : "s"} · joined{" "}
                    {dateFormat.format(person.createdAt)}
                  </p>
                </div>

                {/* Indigo belongs to the primary action, so roles get their
                    own hues: emerald for elevated, sky for the default. */}
                <span
                  className={`studio-badge shrink-0 uppercase ${
                    person.role === "ADMIN"
                      ? "studio-badge-emerald"
                      : "studio-badge-sky"
                  }`}
                >
                  {person.role === "ADMIN" ? "Admin" : "Author"}
                </span>

                <div className="flex shrink-0 items-center gap-4">
                  <ResetPasswordButton userId={person.id} name={person.name} />
                  {person.id !== admin.id && person._count.posts === 0 && (
                    <DeleteUserButton userId={person.id} name={person.name} />
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="mb-5 font-display text-sm font-semibold text-white">
              Add someone
            </h2>
            <NewUserForm />
          </div>
        </div>
      )}
    </>
  );
}
