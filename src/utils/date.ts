export const formatMemberSince = (isoDate: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric"
  }).format(new Date(isoDate));

export const formatRelativeMinutes = (isoDate: string, locale: string) => {
  const diffMs = new Date(isoDate).getTime() - Date.now();
  const minutes = Math.round(diffMs / (1000 * 60));

  if (typeof Intl.RelativeTimeFormat !== "function") {
    const absoluteMinutes = Math.abs(minutes);

    if (absoluteMinutes < 60) {
      return locale.startsWith("fr")
        ? `il y a ${absoluteMinutes} min`
        : `${absoluteMinutes} min ago`;
    }

    const hours = Math.round(absoluteMinutes / 60);
    return locale.startsWith("fr") ? `il y a ${hours} h` : `${hours} h ago`;
  }

  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(minutes, "minute");
};
