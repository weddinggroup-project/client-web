import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { AuthLogo } from "@/features/auth/components/auth-logo";
import { getSession } from "@/lib/auth/session";

const backgroundImage = {
  src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1920&auto=format&fit=crop",
  alt: "Perayaan pernikahan di area outdoor yang rindang",
};

export default async function SignUpPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Image
        src={backgroundImage.src}
        alt={backgroundImage.alt}
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      <div className="relative flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-6 sm:px-10">
          <AuthLogo className="text-white" />
          <Link
            href="#"
            className="text-sm text-white/90 transition hover:text-white"
          >
            Butuh bantuan?
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 pt-6 pb-16 sm:px-10 sm:pt-8 sm:pb-24">
          <div className="w-full max-w-md rounded-2xl bg-background/95 p-8 shadow-2xl backdrop-blur sm:p-10">
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Buat Akun Baru
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Bergabunglah untuk mewujudkan hari bahagia Anda.
            </p>

            <div className="mt-6">
              <SignUpForm />
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Sudah memiliki akun?{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-primary hover:text-primary-hover"
              >
                Login di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
