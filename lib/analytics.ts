type EventDetails = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      details?: EventDetails
    ) => void;
  }
}

export function trackToolEvent(
  toolName: string,
  action: string,
  details: EventDetails = {}
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "tool_action", {
    tool_name: toolName,
    tool_action: action,
    ...details,
  });
}
