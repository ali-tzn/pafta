"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type EventCategory = "Teslim" | "Sınav" | "Jüri" | "Ders" | "Diğer";

type CalendarEvent = {
  id: number;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  reminderMinutes: number;
  notified: boolean;
};

const reminderOptions = [
  { label: "Uyarı yok", value: 0 },
  { label: "10 dakika önce", value: 10 },
  { label: "30 dakika önce", value: 30 },
  { label: "1 saat önce", value: 60 },
  { label: "3 saat önce", value: 180 },
  { label: "1 gün önce", value: 1440 },
  { label: "3 gün önce", value: 4320 },
  { label: "1 hafta önce", value: 10080 },
];

const categories: EventCategory[] = [
  "Teslim",
  "Sınav",
  "Jüri",
  "Ders",
  "Diğer",
];

export default function StudentCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<EventCategory>("Teslim");
  const [date, setDate] = useState(getToday());
  const [time, setTime] = useState("18:00");
  const [reminderMinutes, setReminderMinutes] = useState(1440);

  useEffect(() => {
    const savedEvents = localStorage.getItem("pafta-calendar-events");

    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents) as CalendarEvent[];
        setEvents(parsedEvents);
      } catch {
        localStorage.removeItem("pafta-calendar-events");
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    localStorage.setItem(
      "pafta-calendar-events",
      JSON.stringify(events)
    );
  }, [events, loaded]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = Date.now();

      setEvents((currentEvents) =>
        currentEvents.map((event) => {
          if (
            event.notified ||
            event.reminderMinutes === 0
          ) {
            return event;
          }

          const eventTime = getEventTimestamp(event);
          const reminderTime =
            eventTime - event.reminderMinutes * 60 * 1000;

          const shouldNotify =
            now >= reminderTime && now < eventTime;

          if (!shouldNotify) {
            return event;
          }

          sendNotification(event);

          return {
            ...event,
            notified: true,
          };
        })
      );
    }, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (firstEvent, secondEvent) =>
        getEventTimestamp(firstEvent) -
        getEventTimestamp(secondEvent)
    );
  }, [events]);

  const upcomingEvents = sortedEvents.filter(
    (event) => getEventTimestamp(event) >= Date.now()
  );

  const pastEvents = sortedEvents.filter(
    (event) => getEventTimestamp(event) < Date.now()
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !date || !time) {
      return;
    }

    const newEvent: CalendarEvent = {
      id: Date.now(),
      title: title.trim(),
      category,
      date,
      time,
      reminderMinutes,
      notified: false,
    };

    setEvents((currentEvents) => [
      ...currentEvents,
      newEvent,
    ]);

    setTitle("");
    setCategory("Teslim");
    setReminderMinutes(1440);
  }

  function removeEvent(id: number) {
    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== id)
    );
  }

  async function requestNotificationPermission() {
    if (!("Notification" in window)) {
      alert("Bu tarayıcı bildirimleri desteklemiyor.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      new Notification("PAFTA bildirimleri açıldı", {
        body: "Yaklaşan teslim ve etkinlikler için uyarı alacaksın.",
        icon: "/icon.png",
      });
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link
            href="/"
            className="transition hover:text-cyan-400"
          >
            Ana Sayfa
          </Link>

          <span className="mx-2">/</span>

          <Link
            href="/student-tools"
            className="transition hover:text-cyan-400"
          >
            Öğrenci Araçları
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">
            Öğrenci Takvimi
          </span>
        </nav>

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              PAFTA Öğrenci Araçları
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Öğrenci Takvimi
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Teslim, sınav, jüri ve derslerini kaydet.
              Etkinlik yaklaşmadan önce tarayıcı bildirimi al.
            </p>
          </div>

          <button
            type="button"
            onClick={requestNotificationPermission}
            className="h-fit rounded-xl border border-cyan-400/40 px-5 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
          >
            Bildirimleri aç
          </button>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[380px_1fr]">
          <section className="h-fit rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold">
              Yeni etkinlik
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              <div>
                <label
                  htmlFor="event-title"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Etkinlik adı
                </label>

                <input
                  id="event-title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Örneğin Mimari Proje teslimi"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label
                  htmlFor="event-category"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Kategori
                </label>

                <select
                  id="event-category"
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value as EventCategory
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                >
                  {categories.map((categoryName) => (
                    <option
                      key={categoryName}
                      value={categoryName}
                    >
                      {categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="event-date"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Tarih
                  </label>

                  <input
                    id="event-date"
                    type="date"
                    value={date}
                    onChange={(event) =>
                      setDate(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="event-time"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Saat
                  </label>

                  <input
                    id="event-time"
                    type="time"
                    value={time}
                    onChange={(event) =>
                      setTime(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="event-reminder"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Ne zaman uyarılsın?
                </label>

                <select
                  id="event-reminder"
                  value={reminderMinutes}
                  onChange={(event) =>
                    setReminderMinutes(
                      Number(event.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                >
                  {reminderOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Takvime ekle
              </button>
            </form>
          </section>

          <section>
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold">
                  Yaklaşan etkinlikler
                </h2>

                <span className="rounded-full bg-slate-950 px-3 py-1 text-sm text-slate-400">
                  {upcomingEvents.length} etkinlik
                </span>
              </div>

              {!loaded ? (
                <p className="mt-6 text-slate-400">
                  Takvim yükleniyor...
                </p>
              ) : upcomingEvents.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-700 p-8 text-center">
                  <p className="font-semibold">
                    Yaklaşan etkinlik yok
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    İlk teslimini veya sınavını takvime ekle.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onRemove={removeEvent}
                    />
                  ))}
                </div>
              )}
            </div>

            {pastEvents.length > 0 && (
              <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">
                  Geçmiş etkinlikler
                </h2>

                <div className="mt-5 space-y-3 opacity-60">
                  {pastEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onRemove={removeEvent}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
          <p className="font-semibold text-amber-300">
            Bildirim notu
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Bu ilk sürümde tarayıcı bildiriminin çalışması için
            PAFTA sayfasının açık olması gerekir. Site kapalıyken
            de uyarı göndermek için daha sonra PWA desteği
            ekleyeceğiz.
          </p>
        </div>
      </div>
    </main>
  );
}

function EventCard({
  event,
  onRemove,
}: {
  event: CalendarEvent;
  onRemove: (id: number) => void;
}) {
  const eventTimestamp = getEventTimestamp(event);
  const remainingText = getRemainingTimeText(eventTimestamp);

  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
            {event.category}
          </span>

          <span className="text-sm text-slate-500">
            {remainingText}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold">
          {event.title}
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          {formatEventDate(event.date)} · {event.time}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {getReminderLabel(event.reminderMinutes)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(event.id)}
        className="rounded-xl border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
      >
        Sil
      </button>
    </article>
  );
}

function sendNotification(event: CalendarEvent) {
  if (
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return;
  }

  new Notification(`PAFTA: ${event.title}`, {
    body: `${event.category} etkinliğin ${formatEventDate(
      event.date
    )} tarihinde saat ${event.time}.`,
    icon: "/icon.png",
  });
}

function getEventTimestamp(event: CalendarEvent) {
  return new Date(`${event.date}T${event.time}:00`).getTime();
}

function getToday() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;

  return new Date(today.getTime() - timezoneOffset)
    .toISOString()
    .split("T")[0];
}

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function getReminderLabel(minutes: number) {
  const option = reminderOptions.find(
    (item) => item.value === minutes
  );

  return option?.label ?? "Uyarı yok";
}

function getRemainingTimeText(timestamp: number) {
  const difference = timestamp - Date.now();

  if (difference <= 0) {
    return "Etkinlik geçti";
  }

  const totalMinutes = Math.floor(difference / 60_000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days} gün ${hours} saat kaldı`;
  }

  if (hours > 0) {
    return `${hours} saat ${minutes} dakika kaldı`;
  }

  return `${minutes} dakika kaldı`;
}