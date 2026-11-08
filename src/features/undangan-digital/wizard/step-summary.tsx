"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { WizardTopBar } from "./wizard-top-bar";
import type { ValidatedCode } from "@/lib/vowly/types";
import { paymentMethods, formatRupiah } from "./wizard-data";

/** Only Mandiri Virtual Account is supported by the API today (PRD Q4); other methods are shown disabled. */
const SUPPORTED_METHOD = "Mandiri";

type StepSummaryProps = {
  packageName: string;
  packagePrice: number;
  codes: { voucher?: ValidatedCode; referral?: ValidatedCode };
  onApplyCode: (kind: "voucher" | "referral", code: string) => Promise<string | undefined>;
  busy: boolean;
  selectedPaymentMethod: string | null;
  onSelectPaymentMethod: (method: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function StepSummary({
  packageName,
  packagePrice,
  codes,
  onApplyCode,
  busy,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  onBack,
  onNext,
}: StepSummaryProps) {
  const [voucherCode, setVoucherCode] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [codeError, setCodeError] = useState<string>();
  // Display only: the order total is computed by the API when the order is created.
  const discount = (codes.voucher?.amount ?? 0) + (codes.referral?.amount ?? 0);
  const estimatedTotal = Math.max(packagePrice - discount, 0);

  async function apply(kind: "voucher" | "referral", code: string) {
    if (!code.trim()) return;
    setCodeError(await onApplyCode(kind, code));
  }

  return (
    <div className="min-h-screen bg-background">
      <WizardTopBar onBack={onBack} />

      <div className="mx-auto max-w-md px-6 pb-16 sm:px-10">
        <h1 className="text-center font-serif text-xl font-bold text-foreground sm:text-2xl">
          Rincian Pemesanan
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Cek kembali pesanan kamu
        </p>

        <Card className="mt-8 rounded-2xl border-card-border p-6 shadow-sm shadow-black/5">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Detail Pembayaran
          </p>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-foreground/80">Nama Paket</span>
            <span className="font-semibold text-foreground">
              {packageName}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-foreground/80">Harga</span>
            <span className="font-semibold text-foreground">
              {formatRupiah(packagePrice)}
            </span>
          </div>
          {codes.voucher ? (
            <div className="mt-1 flex items-center justify-between text-sm text-emerald-700">
              <span>Voucher {codes.voucher.code}</span>
              <span>-{formatRupiah(codes.voucher.amount)}</span>
            </div>
          ) : null}
          {codes.referral ? (
            <div className="mt-1 flex items-center justify-between text-sm text-emerald-700">
              <span>Referral {codes.referral.code}</span>
              <span>-{formatRupiah(codes.referral.amount)}</span>
            </div>
          ) : null}

          <div className="mt-5 flex gap-2">
            <Input
              value={voucherCode}
              onChange={(event) => setVoucherCode(event.target.value)}
              placeholder="Masukkan Kode Voucher"
              className="h-10 flex-1 rounded-lg text-sm"
            />
            <Button type="button" variant="outline-brand" className="h-10 px-4 text-xs" onClick={() => void apply("voucher", voucherCode)}>
              Gunakan
            </Button>
          </div>

          <div className="mt-3 flex gap-2">
            <Input
              value={referralCode}
              onChange={(event) => setReferralCode(event.target.value)}
              placeholder="Masukkan Kode Referral"
              className="h-10 flex-1 rounded-lg text-sm"
            />
            <Button type="button" variant="outline-brand" className="h-10 px-4 text-xs" onClick={() => void apply("referral", referralCode)}>
              Gunakan
            </Button>
          </div>

          {codeError ? (
            <p role="alert" className="mt-2 text-xs text-red-700">
              {codeError}
            </p>
          ) : null}

          <p className="mt-6 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Metode Pembayaran
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {paymentMethods.map((method) => {
              const isSelected = method.label === selectedPaymentMethod;

              return (
                <button
                  key={method.label}
                  type="button"
                  onClick={() => onSelectPaymentMethod(method.label)}
                  disabled={method.label !== SUPPORTED_METHOD}
                  title={method.label === SUPPORTED_METHOD ? undefined : "Segera hadir"}
                  className={cn(
                    "disabled:cursor-not-allowed disabled:opacity-40",
                    "flex items-center gap-1.5 rounded-lg border border-card-border bg-background px-2 py-2 text-xs font-medium text-foreground/80 transition",
                    isSelected && "border-primary ring-2 ring-primary/30",
                  )}
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: method.dotColor }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{method.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-lg font-bold text-primary">
              {formatRupiah(estimatedTotal)}
            </span>
          </div>
          <p className="mt-1 text-right text-[11px] text-muted-foreground">Total akhir dihitung sistem saat pesanan dibuat.</p>
        </Card>

        <Button
          type="button"
          variant="rose"
          className="mt-6 h-12 w-full px-8"
          disabled={selectedPaymentMethod !== SUPPORTED_METHOD || busy}
          onClick={onNext}
        >
          {busy ? "Memproses…" : "Bayar Sekarang"}
        </Button>
      </div>
    </div>
  );
}
