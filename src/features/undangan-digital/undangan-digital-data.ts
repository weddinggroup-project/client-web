import type { IconType } from "react-icons";
import { FaLeaf } from "react-icons/fa6";
import {
  HiOutlineArrowPath,
  HiOutlineBolt,
  HiOutlinePaintBrush,
} from "react-icons/hi2";

export type ProductBenefit = {
  icon: IconType;
  title: string;
  description: string;
};

export const productBenefits: ProductBenefit[] = [
  {
    icon: FaLeaf,
    title: "Ramah Lingkungan",
    description:
      "Mengurangi penggunaan kertas cetak, menjadikannya pilihan lebih bertanggung jawab untuk hari istimewa Anda.",
  },
  {
    icon: HiOutlineBolt,
    title: "Praktis & Cepat",
    description:
      "Kirim undangan ke ratusan tamu dalam hitungan detik melalui aplikasi pesan singkat atau media sosial.",
  },
  {
    icon: HiOutlineArrowPath,
    title: "Mudah Diubah",
    description:
      "Ada perubahan jadwal atau tempat? Perbarui informasi secara real-time tanpa perlu mencetak ulang undangan.",
  },
  {
    icon: HiOutlinePaintBrush,
    title: "Desain Eksklusif",
    description:
      "Pilih tema desain yang elegan dan dapat disesuaikan dengan konsep pernikahan Anda, dilengkapi animasi dan musik latar.",
  },
];

export type ProductShowcaseSlide = {
  title: string;
  description: string;
  frame: "phone" | "tablet";
  image?: { src: string; alt: string };
};

export const productShowcaseSlides: ProductShowcaseSlide[] = [
  {
    title: "Galeri Foto Premium",
    description:
      "Tampilkan momen-momen indah pre-wedding Anda dalam galeri interaktif yang elegan, memberikan kesan mendalam bagi tamu undangan.",
    frame: "phone",
    image: {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
      alt: "Galeri foto pre-wedding di dalam undangan digital",
    },
  },
  {
    title: "Navigasi Peta Otomatis",
    description:
      "Integrasi peta otomatis membantu tamu menemukan lokasi acara secara langsung, tanpa perlu bertanya arah lagi.",
    frame: "tablet",
  },
];

export type InvitationStep = {
  step: number;
  title: string;
};

export const invitationSteps: InvitationStep[] = [
  { step: 1, title: "Pilih Tamu yang akan diundang" },
  { step: 2, title: "Kirim via WhatsApp" },
  {
    step: 3,
    title: "Buat teks, atur waktu pengiriman dan metode pengiriman",
  },
  { step: 4, title: "Kirim Undangan" },
];
