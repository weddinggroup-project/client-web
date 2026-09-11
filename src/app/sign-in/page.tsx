import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { EmailPasswordForm } from "@/features/auth/components/email-password-form";
import { AuthLogo } from "@/features/auth/components/auth-logo";
import { getSession } from "@/lib/auth/session";

const heroImage = {
  src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1400&auto=format&fit=crop",
  alt: "Meja resepsi pernikahan dengan dekorasi bunga",
};

export default async function SignInPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-sm">
          <AuthLogo />

          <p className="mt-8 text-sm text-muted-foreground">
            Selamat Datang Kembali
          </p>

          <div className="mt-6">
            <EmailPasswordForm enabled />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum memiliki akun?{" "}
            <Link href="/sign-up" className="font-semibold text-primary hover:text-primary-hover">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </section>

      <section className="relative hidden overflow-hidden lg:block">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          unoptimized
          sizes="50vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/55 to-transparent"
          aria-hidden="true"
        />

        <div className="relative flex h-full max-w-md flex-col justify-center px-12 xl:px-16">
          <h2 className="font-serif text-4xl leading-tight font-bold text-foreground">
            Mewujudkan Impian Menjadi Kenyataan
          </h2>
          <p className="mt-5 text-base leading-7 text-foreground/70">
            Nikmati perjalanan perencanaan pernikahan yang tenang dan
            terorganisir bersama asisten concierge digital pilihan Anda.
          </p>
        </div>
      </section>
    </main>
  );
}
