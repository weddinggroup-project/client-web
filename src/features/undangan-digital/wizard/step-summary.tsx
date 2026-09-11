"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { WizardTopBar } from "./wizard-top-bar";
import { packages, paymentMethods, formatRupiah } from "./wizard-data";

type StepSummaryProps = {
  packageId: string;
  selectedPaymentMethod: string | null;
  onSelectPaymentMethod: (method: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function StepSummary({
  packageId,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  onBack,
  onNext,
}: StepSummaryProps) {
  const selectedPackage = packages.find((pkg) => pkg.id === packageId) ?? packages[0]!;
  const [voucherCode, setVoucherCode] = useState("");
  const [referralCode, setReferralCode] = useState("");

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
              {selectedPackage.name}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-foreground/80">Harga</span>
            <span className="font-semibold text-foreground">
              {formatRupiah(selectedPackage.price)}
            </span>
          </div>

          <div className="mt-5 flex gap-2">
            <Input
              value={voucherCode}
              onChange={(event) => setVoucherCode(event.target.value)}
              placeholder="Masukkan Kode Voucher"
              className="h-10 flex-1 rounded-lg text-sm"
            />
            <Button type="button" variant="outline-brand" className="h-10 px-4 text-xs">
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
            <Button type="button" variant="outline-brand" className="h-10 px-4 text-xs">
              Gunakan
            </Button>
          </div>

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
                  className={cn(
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
              {formatRupiah(selectedPackage.price)}
            </span>
          </div>
        </Card>

        <Button
          type="button"
          variant="rose"
          className="mt-6 h-12 w-full px-8"
          disabled={!selectedPaymentMethod}
          onClick={onNext}
        >
          Bayar Sekarang
        </Button>
      </div>
    </div>
  );
}
