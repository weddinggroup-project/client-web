import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import {
  HiOutlineClock,
  HiOutlineCreditCard,
  HiOutlineFaceSmile,
  HiOutlineMap,
  HiOutlineQuestionMarkCircle,
  HiOutlineRectangleGroup,
  HiOutlineBuildingStorefront,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from "react-icons/hi2";
import type { IconType } from "react-icons";

export type NavSubItem = {
  href: string;
  label: string;
};

export type NavItem = {
  href: string;
  label: string;
  submenu?: NavSubItem[];
};

export const navLinks: NavItem[] = [
  {
    href: "#layanan",
    label: "Layanan Kami",
    submenu: [
      { href: "/undangan-digital", label: "Undangan Digital" },
      { href: "#", label: "Buku Tamu Digital" },
      { href: "#", label: "Wedding Planner" },
    ],
  },
  { href: "/panduan-pengguna", label: "Panduan Pengguna" },
  { href: "#kerjasama", label: "Kerjasama" },
];

export const heroSlides: { src: string; alt: string; headline: string }[] = [
  {
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1920&auto=format&fit=crop",
    alt: "Meja resepsi pernikahan dengan dekorasi bunga dan setelan makan",
    headline: "Every Detail Tells Your Story",
  },
  {
    src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1920&auto=format&fit=crop",
    alt: "Sepasang cincin pernikahan emas di atas kain putih",
    headline: "Two Hearts, One Promise",
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop",
    alt: "Pasangan pengantin memegang buket bunga saat golden hour",
    headline: "Love in Every Little Moment",
  },
  {
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1920&auto=format&fit=crop",
    alt: "Pasangan pengantin berciuman dikelilingi taburan bunga oleh tamu",
    headline: "Your Happily Ever After Starts Here",
  },
];

export const painPoints: { icon: IconType; text: string }[] = [
  { icon: HiOutlineClock, text: "Bingung harus mulai darimana?" },
  {
    icon: HiOutlineQuestionMarkCircle,
    text: "Tidak mempunyai banyak waktu untuk mengurusi persiapan?",
  },
  { icon: HiOutlineCreditCard, text: "Takut jika overbudget?" },
  { icon: HiOutlineBuildingStorefront, text: "Bingung milih vendor yang sesuai?" },
  {
    icon: HiOutlineUsers,
    text: "Pusing untuk check tamu-tamu yang akan diundang?",
  },
];

export const solutions: { icon: IconType; title: string; description: string }[] = [
  {
    icon: HiOutlineRectangleGroup,
    title: "Template & Petunjuk",
    description:
      "Dilengkapi template yang dapat langsung digunakan atau disesuaikan kembali.",
  },
  {
    icon: HiOutlineMap,
    title: "Dimana Dan Kapan Saja",
    description:
      "Rencanakan pernikahanmu di manapun dan kapanpun dalam genggaman.",
  },
  {
    icon: HiOutlineFaceSmile,
    title: "Mudah Digunakan",
    description:
      "Mengedepankan kemudahan, seluruh fitur dapat digunakan di perangkat apapun.",
  },
  {
    icon: HiOutlineUserGroup,
    title: "Rencanakan Bersama",
    description:
      "Persiapkan pernikahanmu dengan matang bersama orang terkasih.",
  },
];

export const showcaseSlides: {
  title: string;
  description: string;
  image: { src: string; alt: string };
}[] = [
  {
    title: "Fitur A",
    description:
      "Template undangan dan checklist digital yang bisa disesuaikan dengan tema pernikahanmu, lengkap dengan panduan langkah demi langkah.",
    image: {
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop",
      alt: "Detail buket bunga dan cincin pernikahan sebagai inspirasi template undangan",
    },
  },
  {
    title: "Fitur B",
    description:
      "Kelola anggaran pernikahan dan pantau pengeluaran secara real-time agar rencana selalu sesuai budget.",
    image: {
      src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop",
      alt: "Kalkulator dan dokumen anggaran untuk perencanaan keuangan pernikahan",
    },
  },
  {
    title: "Fitur C",
    description:
      "Atur daftar tamu dan undangan digital, kelola konfirmasi kehadiran dalam satu dashboard yang rapi.",
    image: {
      src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop",
      alt: "Kursi pengantin dengan nama tamu kehormatan di area resepsi",
    },
  },
];

export const testimonials: {
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatar: string;
}[] = [
  {
    name: "Siska & Andi",
    location: "JAKARTA",
    quote:
      "Perencanaan pernikahan jadi jauh lebih mudah dan bebas stres, sangat direkomendasikan!",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Dinda & Raka",
    location: "BANDUNG",
    quote:
      "Semua kebutuhan tercatat rapi dalam satu tempat, kami jadi lebih tenang menuju hari-H.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Alya & Bima",
    location: "SURABAYA",
    quote:
      "Rekomendasi vendornya terpercaya dan template yang tersedia sangat membantu persiapan kami.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
  },
];

export const footerSocialLinks: { href: string; label: string; icon: IconType }[] = [
  { href: "#", label: "Facebook", icon: FaFacebookF },
  { href: "#", label: "Twitter", icon: FaXTwitter },
  { href: "#", label: "Instagram", icon: FaInstagram },
  { href: "#", label: "Tiktok", icon: FaTiktok },
];

export const footerSupportLinks: { href: string; label: string }[] = [
  { href: "#", label: "Tentang Kami" },
  { href: "/panduan-pengguna", label: "Panduan Pengguna" },
  { href: "#", label: "Kebijakan Privasi" },
  { href: "#", label: "Syarat dan Ketentuan" },
  { href: "/panduan-pengguna", label: "Pusat Bantuan" },
];
