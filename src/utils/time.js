import { formatDistanceStrict } from "date-fns";
import { enUS } from "date-fns/locale";

export function formatPublishedDistance(published_at) {
  if (!published_at?.seconds) return "";

  const date = new Date(published_at.seconds * 1000);

  return formatDistanceStrict(date, new Date(), {
    addSuffix: true,
    locale: enUS,
  });
}
