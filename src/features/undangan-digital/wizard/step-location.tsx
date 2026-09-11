import { useMemo, useState } from "react";
import { HiExclamationCircle, HiOutlineMapPin } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AuthField, authLabelClassName } from "@/features/auth/components/auth-field";
import { WizardTopBar } from "./wizard-top-bar";
import { WizardSelect, type WizardSelectOption } from "./wizard-select";
import { regions } from "./region-data";
import type { LocationDetails } from "./order-wizard";

const provinceOptions: WizardSelectOption[] = regions.map((region) => ({
  value: region.province,
  label: region.province,
}));

type StepLocationProps = {
  location: LocationDetails;
  onChange: (location: LocationDetails) => void;
  onBack: () => void;
  onNext: () => void;
};

export function StepLocation({
  location,
  onChange,
  onBack,
  onNext,
}: StepLocationProps) {
  const [error, setError] = useState<string>();

  function updateField<K extends keyof LocationDetails>(
    key: K,
    value: LocationDetails[K],
  ) {
    onChange({ ...location, [key]: value });
  }

  function handleProvinceChange(value: string) {
    // Downstream choices may not exist under the newly picked province.
    onChange({
      ...location,
      province: value,
      city: "",
      district: "",
      village: "",
      postalCode: "",
    });
  }

  function handleCityChange(value: string) {
    onChange({ ...location, city: value, district: "", village: "", postalCode: "" });
  }

  function handleDistrictChange(value: string) {
    onChange({ ...location, district: value, village: "", postalCode: "" });
  }

  function handleVillageChange(value: string, postalCode: string) {
    onChange({ ...location, village: value, postalCode });
  }

  const cityOptions: WizardSelectOption[] = useMemo(() => {
    const selectedRegion = regions.find(
      (region) => region.province === location.province,
    );
    return (selectedRegion?.cities ?? []).map((city) => ({
      value: city.name,
      label: city.name,
    }));
  }, [location.province]);

  const selectedCity = useMemo(() => {
    const selectedRegion = regions.find(
      (region) => region.province === location.province,
    );
    return selectedRegion?.cities.find((city) => city.name === location.city);
  }, [location.province, location.city]);

  // Only major cities are seeded with Kecamatan/Kelurahan/Kode Pos data —
  // everywhere else falls back to free-text fields further down.
  const hasDistrictData = Boolean(selectedCity?.districts?.length);

  const districtOptions: WizardSelectOption[] = useMemo(
    () =>
      (selectedCity?.districts ?? []).map((district) => ({
        value: district.name,
        label: district.name,
      })),
    [selectedCity],
  );

  const selectedDistrict = selectedCity?.districts?.find(
    (district) => district.name === location.district,
  );

  const villageOptions: WizardSelectOption[] = useMemo(
    () =>
      (selectedDistrict?.kelurahan ?? []).map((village) => ({
        value: village.name,
        label: village.name,
      })),
    [selectedDistrict],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !location.province ||
      !location.city ||
      !location.district ||
      !location.village ||
      !location.postalCode
    ) {
      setError("Lengkapi seluruh detail alamat terlebih dahulu.");
      return;
    }

    setError(undefined);
    onNext();
  }

  const selectedProvinceOption =
    provinceOptions.find((option) => option.value === location.province) ?? null;
  const selectedCityOption =
    cityOptions.find((option) => option.value === location.city) ?? null;
  const selectedDistrictOption =
    districtOptions.find((option) => option.value === location.district) ?? null;
  const selectedVillageOption =
    villageOptions.find((option) => option.value === location.village) ?? null;

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="hidden flex-col items-center justify-center bg-secondary/40 p-10 lg:flex">
        <p className="max-w-xs text-center text-lg font-semibold text-foreground">
          Dimana lokasi pernikahanmu?
        </p>

        <div className="relative mt-8 h-80 w-44 rounded-[2rem] border-4 border-foreground/80 bg-background shadow-xl">
          <div className="absolute inset-2 overflow-hidden rounded-[1.5rem] bg-[linear-gradient(160deg,#eef0e6_0%,#dfe6d8_100%)]">
            <div
              className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(107,63,69,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(107,63,69,0.15)_1px,transparent_1px)] [background-size:14px_14px]"
              aria-hidden="true"
            />
            <HiOutlineMapPin
              className="absolute top-1/2 left-1/2 size-9 -translate-x-1/2 -translate-y-1/2 text-primary"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <WizardTopBar onBack={onBack} />

        <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
            <h1 className="font-serif text-2xl font-bold text-foreground lg:hidden">
              Dimana lokasi pernikahanmu?
            </h1>

            <AuthField
              label="Alamat"
              id="address"
              value={location.address}
              onChange={(event) => updateField("address", event.target.value)}
              placeholder="Nama jalan dan nomor rumah"
              required
            />

            <AuthField
              label="Tempat"
              id="venue"
              value={location.venue}
              onChange={(event) => updateField("venue", event.target.value)}
              placeholder="Gedung atau rumah"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province" className={authLabelClassName}>
                  Provinsi
                </Label>
                <WizardSelect
                  inputId="province"
                  options={provinceOptions}
                  value={selectedProvinceOption}
                  onChange={(option) => handleProvinceChange(option?.value ?? "")}
                  placeholder="Pilih provinsi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className={authLabelClassName}>
                  Kabupaten/Kota
                </Label>
                <WizardSelect
                  inputId="city"
                  options={cityOptions}
                  value={selectedCityOption}
                  onChange={(option) => handleCityChange(option?.value ?? "")}
                  placeholder={
                    location.province ? "Pilih kota" : "Pilih provinsi dulu"
                  }
                  isDisabled={!location.province}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {hasDistrictData ? (
                <div className="space-y-2">
                  <Label htmlFor="district" className={authLabelClassName}>
                    Kecamatan
                  </Label>
                  <WizardSelect
                    inputId="district"
                    options={districtOptions}
                    value={selectedDistrictOption}
                    onChange={(option) => handleDistrictChange(option?.value ?? "")}
                    placeholder="Pilih kecamatan"
                  />
                </div>
              ) : (
                <AuthField
                  label="Kecamatan"
                  id="district"
                  value={location.district}
                  onChange={(event) => updateField("district", event.target.value)}
                  placeholder="Nama kecamatan"
                  required
                  disabled={!location.city}
                />
              )}

              {hasDistrictData ? (
                <div className="space-y-2">
                  <Label htmlFor="village" className={authLabelClassName}>
                    Kelurahan
                  </Label>
                  <WizardSelect
                    inputId="village"
                    options={villageOptions}
                    value={selectedVillageOption}
                    onChange={(option) => {
                      const village = selectedDistrict?.kelurahan.find(
                        (item) => item.name === option?.value,
                      );
                      handleVillageChange(option?.value ?? "", village?.postalCode ?? "");
                    }}
                    placeholder={
                      location.district ? "Pilih kelurahan" : "Pilih kecamatan dulu"
                    }
                    isDisabled={!location.district}
                  />
                </div>
              ) : (
                <AuthField
                  label="Kelurahan"
                  id="village"
                  value={location.village}
                  onChange={(event) => updateField("village", event.target.value)}
                  placeholder="Nama kelurahan"
                  required
                  disabled={!location.city}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <AuthField
                label="Kode Pos"
                id="postalCode"
                inputMode="numeric"
                value={location.postalCode}
                onChange={(event) => updateField("postalCode", event.target.value)}
                placeholder="Kode pos"
                required
              />

              <AuthField
                label="Jumlah Tamu"
                id="guestCount"
                type="number"
                min={1}
                value={location.guestCount}
                onChange={(event) => updateField("guestCount", event.target.value)}
                placeholder="Jumlah tamu"
                required
              />
            </div>

            {error ? (
              <p className="flex items-start gap-2 rounded-xl bg-error/10 p-3 text-sm leading-6 text-error">
                <HiExclamationCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                {error}
              </p>
            ) : null}

            <Button type="submit" variant="rose" className="h-12 w-full px-8">
              Lanjut
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
