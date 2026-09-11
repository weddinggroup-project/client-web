import { Navbar } from "@/components/landing/navbar/navbar";
import { Footer } from "@/components/landing/footer/footer";
import { Container } from "@/components/ui/container";
import { HelpSearch } from "@/features/help-center/components/help-search";
import { HelpSupportBanner } from "@/features/help-center/components/help-support-banner";

export const metadata = {
  title: "Panduan Pengguna",
};

export default function PanduanPenggunaPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-background py-16 sm:py-20">
          <Container className="text-center">
            <div className="flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
              <span className="h-px w-8 bg-border" aria-hidden="true" />
              Pusat Bantuan
              <span className="h-px w-8 bg-border" aria-hidden="true" />
            </div>

            <h1 className="mx-auto mt-4 max-w-2xl font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Bagaimana kami dapat membantu Anda hari ini?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Temukan panduan lengkap untuk merencanakan pernikahan impian Anda
              dengan presisi dan ketenangan.
            </p>
          </Container>
        </section>

        <section className="bg-background pb-20 sm:pb-24">
          <HelpSearch />
        </section>

        <section className="bg-background pb-20 sm:pb-24">
          <HelpSupportBanner />
        </section>
      </main>
      <Footer />
    </>
  );
}
