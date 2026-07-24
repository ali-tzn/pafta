"use client";

export default function CookieSettingsButton() {
  const hasOptionalServices = Boolean(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  );

  if (!hasOptionalServices) {
    return null;
  }

  function openCookieSettings() {
    window.dispatchEvent(
      new CustomEvent("pafta:open-cookie-settings")
    );
  }

  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="text-left transition hover:text-white"
    >
      Çerez tercihleri
    </button>
  );
}
