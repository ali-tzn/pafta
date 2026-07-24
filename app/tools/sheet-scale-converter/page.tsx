import type { Metadata } from "next";
import SheetScaleConverter from "./SheetScaleConverter";

export const metadata: Metadata = {
  title: "Pafta Boyutu ve Ölçek Dönüştürücü",
  description:
    "A0, A1, A2, A3 ve özel pafta boyutları arasında baskı yüzdesini ve yeni çizim ölçeğini ücretsiz hesaplayın.",
  alternates: {
    canonical: "/tools/sheet-scale-converter",
  },
};

export default function SheetScaleConverterPage() {
  return <SheetScaleConverter />;
}
