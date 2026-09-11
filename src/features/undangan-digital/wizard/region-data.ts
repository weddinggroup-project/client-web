/**
 * A self-contained Indonesian region dataset, standing in for a real region
 * API (e.g. a wilayah-Indonesia service) so the location step works fully
 * offline in this starter — no network dependency, no rate limits. Swap
 * this for a live API call later without touching the form itself.
 *
 * Every province and city/regency is covered so Provinsi → Kabupaten/Kota
 * always cascades correctly. Full depth down to Kecamatan → Kelurahan →
 * Kode Pos is only seeded for a set of major cities (the ones most likely
 * to be picked in a demo) — for every other city, the form falls back to
 * free-text Kecamatan/Kelurahan and a manual Kode Pos field.
 */
export type Kelurahan = {
  name: string;
  postalCode: string;
};

export type Kecamatan = {
  name: string;
  kelurahan: Kelurahan[];
};

export type City = {
  name: string;
  districts?: Kecamatan[];
};

export type Region = {
  province: string;
  cities: City[];
};

function withDistricts(name: string, districts: Kecamatan[]): City {
  return { name, districts };
}

const jakartaPusat = withDistricts("Jakarta Pusat", [
  { name: "Menteng", kelurahan: [{ name: "Menteng", postalCode: "10310" }, { name: "Gondangdia", postalCode: "10350" }] },
  { name: "Tanah Abang", kelurahan: [{ name: "Bendungan Hilir", postalCode: "10210" }, { name: "Karet Tengsin", postalCode: "10220" }] },
]);

const jakartaSelatan = withDistricts("Jakarta Selatan", [
  { name: "Kebayoran Baru", kelurahan: [{ name: "Senayan", postalCode: "12190" }, { name: "Gunung", postalCode: "12120" }] },
  { name: "Setiabudi", kelurahan: [{ name: "Karet Kuningan", postalCode: "12940" }, { name: "Setiabudi", postalCode: "12920" }] },
]);

const jakartaBarat = withDistricts("Jakarta Barat", [
  { name: "Grogol Petamburan", kelurahan: [{ name: "Grogol", postalCode: "11450" }, { name: "Tomang", postalCode: "11440" }] },
  { name: "Kebon Jeruk", kelurahan: [{ name: "Kebon Jeruk", postalCode: "11530" }, { name: "Sukabumi Selatan", postalCode: "11560" }] },
]);

const jakartaTimur = withDistricts("Jakarta Timur", [
  { name: "Cakung", kelurahan: [{ name: "Cakung Timur", postalCode: "13910" }, { name: "Rawa Terate", postalCode: "13930" }] },
  { name: "Duren Sawit", kelurahan: [{ name: "Duren Sawit", postalCode: "13440" }, { name: "Klender", postalCode: "13470" }] },
]);

const jakartaUtara = withDistricts("Jakarta Utara", [
  { name: "Kelapa Gading", kelurahan: [{ name: "Kelapa Gading Barat", postalCode: "14240" }, { name: "Kelapa Gading Timur", postalCode: "14250" }] },
  { name: "Pademangan", kelurahan: [{ name: "Pademangan Barat", postalCode: "14420" }, { name: "Ancol", postalCode: "14430" }] },
]);

const bandung = withDistricts("Bandung", [
  { name: "Coblong", kelurahan: [{ name: "Dago", postalCode: "40135" }, { name: "Lebak Siliwangi", postalCode: "40132" }] },
  { name: "Sumur Bandung", kelurahan: [{ name: "Braga", postalCode: "40111" }, { name: "Merdeka", postalCode: "40117" }] },
]);

const surabaya = withDistricts("Surabaya", [
  { name: "Gubeng", kelurahan: [{ name: "Airlangga", postalCode: "60286" }, { name: "Gubeng", postalCode: "60281" }] },
  { name: "Genteng", kelurahan: [{ name: "Genteng", postalCode: "60275" }, { name: "Embong Kaliasin", postalCode: "60271" }] },
]);

const yogyakarta = withDistricts("Yogyakarta", [
  { name: "Gondokusuman", kelurahan: [{ name: "Baciro", postalCode: "55225" }, { name: "Terban", postalCode: "55223" }] },
  { name: "Kraton", kelurahan: [{ name: "Panembahan", postalCode: "55131" }, { name: "Patehan", postalCode: "55133" }] },
]);

const semarang = withDistricts("Semarang", [
  { name: "Semarang Tengah", kelurahan: [{ name: "Miroto", postalCode: "50131" }, { name: "Jagalan", postalCode: "50134" }] },
  { name: "Candisari", kelurahan: [{ name: "Jomblang", postalCode: "50249" }, { name: "Karanganyar Gunung", postalCode: "50252" }] },
]);

const denpasar = withDistricts("Denpasar", [
  { name: "Denpasar Selatan", kelurahan: [{ name: "Sanur", postalCode: "80227" }, { name: "Renon", postalCode: "80235" }] },
  { name: "Denpasar Barat", kelurahan: [{ name: "Padangsambian", postalCode: "80117" }, { name: "Pemecutan", postalCode: "80119" }] },
]);

const medan = withDistricts("Medan", [
  { name: "Medan Baru", kelurahan: [{ name: "Padang Bulan", postalCode: "20153" }, { name: "Babura", postalCode: "20154" }] },
  { name: "Medan Kota", kelurahan: [{ name: "Sei Rengas", postalCode: "20214" }, { name: "Teladan Barat", postalCode: "20217" }] },
]);

const makassar = withDistricts("Makassar", [
  { name: "Panakkukang", kelurahan: [{ name: "Karuwisi", postalCode: "90232" }, { name: "Masale", postalCode: "90231" }] },
  { name: "Ujung Pandang", kelurahan: [{ name: "Losari", postalCode: "90111" }, { name: "Maloku", postalCode: "90112" }] },
]);

const malang = withDistricts("Malang", [
  { name: "Klojen", kelurahan: [{ name: "Klojen", postalCode: "65119" }, { name: "Kasin", postalCode: "65117" }] },
  { name: "Lowokwaru", kelurahan: [{ name: "Lowokwaru", postalCode: "65141" }, { name: "Dinoyo", postalCode: "65144" }] },
]);

const bekasi = withDistricts("Bekasi", [
  { name: "Bekasi Timur", kelurahan: [{ name: "Margahayu", postalCode: "17113" }, { name: "Duren Jaya", postalCode: "17111" }] },
  { name: "Bekasi Selatan", kelurahan: [{ name: "Marga Jaya", postalCode: "17141" }, { name: "Jaka Setia", postalCode: "17147" }] },
]);

const tangerangSelatan = withDistricts("Tangerang Selatan", [
  { name: "Serpong", kelurahan: [{ name: "Ciater", postalCode: "15310" }, { name: "Rawa Buntu", postalCode: "15318" }] },
  { name: "Ciputat", kelurahan: [{ name: "Ciputat", postalCode: "15411" }, { name: "Sawah Baru", postalCode: "15413" }] },
]);

export const regions: Region[] = [
  { province: "DKI Jakarta", cities: [jakartaPusat, jakartaSelatan, jakartaBarat, jakartaTimur, jakartaUtara] },
  { province: "Jawa Barat", cities: [bandung, bekasi, { name: "Bogor" }, { name: "Depok" }, { name: "Cimahi" }, { name: "Sukabumi" }] },
  { province: "Jawa Tengah", cities: [semarang, { name: "Solo" }, { name: "Magelang" }, { name: "Salatiga" }, { name: "Pekalongan" }] },
  { province: "DI Yogyakarta", cities: [yogyakarta, { name: "Sleman" }, { name: "Bantul" }, { name: "Kulon Progo" }, { name: "Gunungkidul" }] },
  { province: "Jawa Timur", cities: [surabaya, malang, { name: "Sidoarjo" }, { name: "Kediri" }, { name: "Batu" }] },
  { province: "Banten", cities: [tangerangSelatan, { name: "Tangerang" }, { name: "Serang" }, { name: "Cilegon" }] },
  { province: "Bali", cities: [denpasar, { name: "Badung" }, { name: "Gianyar" }, { name: "Tabanan" }, { name: "Buleleng" }] },
  { province: "Nusa Tenggara Barat", cities: [{ name: "Mataram" }, { name: "Lombok Barat" }, { name: "Lombok Tengah" }, { name: "Sumbawa" }] },
  { province: "Nusa Tenggara Timur", cities: [{ name: "Kupang" }, { name: "Ende" }, { name: "Maumere" }, { name: "Labuan Bajo" }] },
  { province: "Sumatera Utara", cities: [medan, { name: "Binjai" }, { name: "Pematangsiantar" }, { name: "Tebing Tinggi" }] },
  { province: "Sumatera Barat", cities: [{ name: "Padang" }, { name: "Bukittinggi" }, { name: "Payakumbuh" }, { name: "Solok" }] },
  { province: "Sumatera Selatan", cities: [{ name: "Palembang" }, { name: "Prabumulih" }, { name: "Lubuklinggau" }] },
  { province: "Riau", cities: [{ name: "Pekanbaru" }, { name: "Dumai" }] },
  { province: "Kepulauan Riau", cities: [{ name: "Batam" }, { name: "Tanjungpinang" }] },
  { province: "Jambi", cities: [{ name: "Jambi" }, { name: "Sungai Penuh" }] },
  { province: "Bengkulu", cities: [{ name: "Bengkulu" }] },
  { province: "Lampung", cities: [{ name: "Bandar Lampung" }, { name: "Metro" }] },
  { province: "Bangka Belitung", cities: [{ name: "Pangkalpinang" }] },
  { province: "Aceh", cities: [{ name: "Banda Aceh" }, { name: "Langsa" }, { name: "Lhokseumawe" }] },
  { province: "Kalimantan Barat", cities: [{ name: "Pontianak" }, { name: "Singkawang" }] },
  { province: "Kalimantan Tengah", cities: [{ name: "Palangka Raya" }] },
  { province: "Kalimantan Selatan", cities: [{ name: "Banjarmasin" }, { name: "Banjarbaru" }] },
  { province: "Kalimantan Timur", cities: [{ name: "Samarinda" }, { name: "Balikpapan" }, { name: "Bontang" }] },
  { province: "Kalimantan Utara", cities: [{ name: "Tarakan" }] },
  { province: "Sulawesi Utara", cities: [{ name: "Manado" }, { name: "Bitung" }, { name: "Tomohon" }] },
  { province: "Sulawesi Tengah", cities: [{ name: "Palu" }] },
  { province: "Sulawesi Selatan", cities: [makassar, { name: "Parepare" }, { name: "Palopo" }] },
  { province: "Sulawesi Tenggara", cities: [{ name: "Kendari" }, { name: "Baubau" }] },
  { province: "Gorontalo", cities: [{ name: "Gorontalo" }] },
  { province: "Sulawesi Barat", cities: [{ name: "Mamuju" }] },
  { province: "Maluku", cities: [{ name: "Ambon" }, { name: "Tual" }] },
  { province: "Maluku Utara", cities: [{ name: "Ternate" }, { name: "Tidore Kepulauan" }] },
  { province: "Papua", cities: [{ name: "Jayapura" }] },
  { province: "Papua Barat", cities: [{ name: "Manokwari" }, { name: "Sorong" }] },
];
