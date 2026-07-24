"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";

type ConsentChoice = "accepted" | "rejected" | null;

const consentStorageKey = "pafta-cookie-consent";
const analyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const hasOptionalServices = Boolean(analyticsId || adsenseClient);

export default function ConsentManager() {
  const [choice, setChoice] = useState<ConsentChoice>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedChoice = localStorage.getItem(consentStorageKey);

      if (storedChoice === "accepted" || storedChoice === "rejected") {
        setChoice(storedChoice);
      }

      setIsReady(true);
    });

    function openSettings() {
      setIsSettingsOpen(true);
    }

    window.addEventListener("pafta:open-cookie-settings", openSettings);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(
        "pafta:open-cookie-settings",
        openSettings
      );
    };
  }, []);

  function saveChoice(nextChoice: Exclude<ConsentChoice, null>) {
    localStorage.setItem(consentStorageKey, nextChoice);

    if (choice !== null && choice !== nextChoice) {
      window.location.reload();
      return;
    }

    setChoice(nextChoice);
    setIsSettingsOpen(false);
  }

  if (!hasOptionalServices) {
    return null;
  }

  const shouldShowDialog =
    isReady && (choice === null || isSettingsOpen);

  return (
    <>
      {choice === "accepted" && (
        <>
          {analyticsId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
                strategy="afterInteractive"
              />
              <Script id="pafta-google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${analyticsId}', {
                    anonymize_ip: true
                  });
                `}
              </Script>
            </>
          )}

          {adsenseClient && (
            <Script
              id="pafta-google-adsense"
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          )}
        </>
      )}

      {shouldShowDialog && (
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
          className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-5 text-white shadow-2xl sm:inset-x-6 sm:bottom-6 sm:p-6"
        >
          <h2 id="cookie-consent-title" className="text-lg font-semibold">
            Çerez ve gizlilik tercihleri
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Zorunlu işlevler dışında Google Analytics ve reklam hizmetleri
            yalnızca izin verirsen yüklenir. Tercihini daha sonra footer
            üzerinden değiştirebilirsin.{" "}
            <Link
              href="/privacy"
              className="font-medium text-cyan-400 hover:text-cyan-300"
            >
              Gizlilik politikasını incele
            </Link>
          </p>

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => saveChoice("rejected")}
              className="min-h-11 rounded-xl border border-slate-600 px-5 font-semibold transition hover:border-slate-400"
            >
              Reddet
            </button>
            <button
              type="button"
              onClick={() => saveChoice("accepted")}
              className="min-h-11 rounded-xl bg-cyan-400 px-5 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Kabul et
            </button>
          </div>
        </section>
      )}
    </>
  );
}
