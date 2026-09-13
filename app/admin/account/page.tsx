import Link from "next/link";
import { requireUser } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { studio } from "../../lib/paths";
import { ChangePasswordForm, ProfileForm } from "./AccountForms";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireUser();

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, bio: true },
  });

  // requireUser has just confirmed the account; this covers a deletion landing
  // in the moment between the two reads.
  if (!profile) return null;

  return (
    <>
      <div className="mb-10">
        <Link
          href={studio()}
          className="text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
        >
          ← Posts
        </Link>
        <h1 className="mt-4 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
          Your account
        </h1>
        <p className="mt-2 text-sm text-muted">
          {profile.email} · {user.role === "ADMIN" ? "Admin" : "Author"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-6 lg:self-start">
          <h2 className="font-display text-sm font-semibold text-white">Profile</h2>
          <p className="mb-5 mt-1 text-xs text-muted">
            Your name and bio appear on the posts you write.
          </p>
          <ProfileForm name={profile.name} bio={profile.bio ?? ""} />
        </section>

        <section className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-display text-sm font-semibold text-white">Password</h2>
          <p className="mb-5 mt-1 text-xs text-muted">
            Changing it signs you out on every other device. This one stays signed in.
          </p>
          <ChangePasswordForm email={profile.email} name={profile.name} />
        </section>
      </div>
    </>
  );
}
