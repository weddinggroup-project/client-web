import type { IconType } from "react-icons";
import {
  HiOutlineBookOpen,
  HiOutlineCalendarDays,
  HiOutlineDocumentText,
  HiOutlineHandRaised,
  HiOutlinePlayCircle,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";

export type HelpCategory = {
  icon: IconType;
  title: string;
  description: string;
  count: string;
  href: string;
};

export const helpCategories: HelpCategory[] = [
  {
    icon: HiOutlineDocumentText,
    title: "Undangan Digital",
    description:
      "Pelajari cara membuat, mengedit, dan membagikan undangan digital yang elegan untuk tamu Anda.",
    count: "12 Artikel",
    href: "/undangan-digital",
  },
  {
    icon: HiOutlineBookOpen,
    title: "Buku Tamu Digital",
    description:
      "Kelola daftar hadir tamu secara real-time dengan sistem QR Code yang canggih dan praktis.",
    count: "8 Artikel",
    href: "#",
  },
  {
    icon: HiOutlineCalendarDays,
    title: "Wedding Planner",
    description:
      "Optimalkan koordinasi vendor, timeline, dan budget pernikahan Anda dalam satu dashboard terpadu.",
    count: "15 Artikel",
    href: "#",
  },
  {
    icon: HiOutlineHandRaised,
    title: "Kerjasama Mitra",
    description:
      "Panduan bagi vendor dan mitra untuk berkolaborasi dan mengembangkan bisnis bersama kami.",
    count: "6 Artikel",
    href: "#",
  },
  {
    icon: HiOutlineQuestionMarkCircle,
    title: "FAQ",
    description:
      "Jawaban cepat untuk pertanyaan yang paling sering diajukan oleh calon mempelai dan mitra.",
    count: "24 Artikel",
    href: "#",
  },
  {
    icon: HiOutlinePlayCircle,
    title: "Video Tutorial",
    description:
      "Panduan visual langkah demi langkah untuk menguasai seluruh fitur premium Vowly.",
    count: "10 Video",
    href: "#",
  },
];
