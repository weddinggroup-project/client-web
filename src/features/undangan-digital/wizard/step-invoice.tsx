"use client";

import { useState } from "react";
import { HiCheck, HiOutlineClipboardDocument } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WizardTopBar } from "./wizard-top-bar";
import { packages, formatRupiah } from "./wizard-data";

const virtualAccountNumber = "8801 2345 6789 0123";

const transferTabs = [
  { id: "mbanking", label: "Petunjuk Transfer M-Banking" },
  { id: "atm", label: "Petunjuk Transfer ATM" },
] as const;

const mBankingSteps = [
  'Buka aplikasi Livin’ by Mandiri, masukkan PASSWORD atau lakukan verifikasi wajah',
  'Pilih menu "IDR Transfer"',
  'Pilih "Transfer to new recipient"',
];

const atmSteps = [
  "Masukkan kartu ATM dan PIN Anda",
  'Pilih menu "Transfer" lalu "Virtual Account"',
  "Masukkan nomor virtual account di atas",
  "Konfirmasi nominal dan selesaikan transaksi",
];

const paymentDetailSteps = [
  "Masukkan nomor Virtual Account xxxxxxxxxx",
  'Konfirmasi detail VA dan klik "Continue"',
  'Masukkan nominal yang ingin dibayarkan (jika tidak terisi secara otomatis)',
  'Tinjau dan konfirmasi detail transaksi lalu klik "Continue"',
  "Selesaikan transaksi dengan memasukkan MPIN anda",
];

const successSteps = [
  "Setelah transaksi pembayaran Anda selesai, simpan bukti pembayaran",
  "Invoice ini akan diperbarui secara otomatis. Ini bisa memakan waktu hingga 5 menit",
];

type StepInvoiceProps = {
  packageId: string;
  onBack: () => void;
  onFinish: () => void;
};

export function StepInvoice({ packageId, onBack, onFinish }: StepInvoiceProps) {
  const selectedPackage = packages.find((pkg) => pkg.id === packageId) ?? packages[0]!;
  const [activeTab, setActiveTab] = useState<(typeof transferTabs)[number]["id"]>(
    "mbanking",
  );
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(virtualAccountNumber.replace(/\s/g, ""));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Clipboard access can fail (e.g. insecure context) — the number is still visible to copy manually.
    }
  }

  const activeSteps = activeTab === "mbanking" ? mBankingSteps : atmSteps;

  return (
    <div className="min-h-screen bg-background">
      <WizardTopBar onBack={onBack} />

      <div className="mx-auto max-w-md px-6 pb-16 sm:px-10">
        <h1 className="text-center font-serif text-xl font-bold text-foreground sm:text-2xl">
          Penyelesaian Pembayaran
        </h1>

        <Card className="mt-8 rounded-2xl border-card-border p-6 shadow-sm shadow-black/5">
          <div className="flex items-center justify-between rounded-xl border border-card-border bg-muted px-4 py-3">
            <div>
              <p className="text-xs text-muted-foreground">Nomor Virtual Akun</p>
              <p className="mt-0.5 font-mono text-base font-semibold text-foreground">
                {virtualAccountNumber}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Nama Virtual Akun: VOWLY
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Salin nomor virtual akun"
              className="grid size-9 shrink-0 place-items-center rounded-lg bg-background text-primary transition hover:bg-secondary"
            >
              {isCopied ? (
                <HiCheck className="size-4" aria-hidden="true" />
              ) : (
                <HiOutlineClipboardDocument className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-foreground/80">Total Pembayaran</span>
            <span className="font-semibold text-primary">
              {formatRupiah(selectedPackage.price)}
            </span>
          </div>

          <p className="mt-3 rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
            Pembayaran berakhir dalam 23 jam 59 menit
          </p>
        </Card>

        <div className="mt-6 flex rounded-full border border-border p-1">
          {transferTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 rounded-full py-2 text-xs font-semibold transition",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <InstructionList title="Masuk Ke Akun Anda" steps={activeSteps} />
        <InstructionList title="Detail Pembayaran" steps={paymentDetailSteps} />
        <InstructionList title="Transaksi Berhasil" steps={successSteps} />

        <Button
          type="button"
          variant="rose"
          className="mt-8 h-12 w-full px-8"
          onClick={onFinish}
        >
          Selesai
        </Button>
      </div>
    </div>
  );
}

function InstructionList({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <ol className="mt-3 space-y-2">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3 text-sm text-muted-foreground">
            <span className="mt-0.5 shrink-0 font-semibold text-primary">
              {index + 1}.
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
