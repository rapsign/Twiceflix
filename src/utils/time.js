import { formatDistanceStrict } from "date-fns";
import { enUS } from "date-fns/locale";

export function formatPublishedDistance(published_at) {
  if (!published_at) return "";

  const date = new Date(published_at); // parse ISO string

  return formatDistanceStrict(date, new Date(), {
    addSuffix: true,
    locale: enUS,
  });
}
