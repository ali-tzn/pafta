import type { Metadata } from "next";
import SunOrientationAssistant from "./SunOrientationAssistant";

export const metadata: Metadata = {
  title: "Güneş, Yönlenme ve Cephe Karar Asistanı | PAFTA",
  description:
    "Cephe yönü, konum, tarih ve kullanım saatine göre güneş alma durumunu inceleyin; açıklık ve gölgeleme kararları için tasarım önerileri alın.",
  alternates: { canonical: "/proje-araclari/gunes-yonlenme" },
};

export default function SunOrientationPage() {
  return <SunOrientationAssistant />;
}
