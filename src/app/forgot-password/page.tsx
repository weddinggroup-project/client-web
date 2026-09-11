import { redirect } from "next/navigation";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { AuthLogo } from "@/features/auth/components/auth-logo";
import { getSession } from "@/lib/auth/session";

export default async function ForgotPasswordPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted px-6 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-background p-8 text-center shadow-lg shadow-black/5 sm:p-10">
        <AuthLogo className="mx-auto" />

        <h1 className="mt-6 font-serif text-2xl font-bold text-foreground">
          Atur Ulang Kata Sandi
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Kami akan mengirimkan instruksi pemulihan ke kontak Anda.
        </p>

        <div className="mt-8 text-left">
          <ForgotPasswordForm />
        </div>

        <Link
          href="/sign-in"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <HiArrowLeft className="size-3.5" aria-hidden="true" />
          Kembali ke Login
        </Link>
      </div>

      <p className="mt-8 text-xs tracking-wide text-muted-foreground uppercase">
        © Vowly. All rights reserved.
      </p>
    </main>
  );
}
