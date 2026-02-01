// LoadingBar.jsx
import { ScrollProgress } from "./ui/scroll-progress";

export default function LoadingBar({ loading }) {
  if (!loading) return null;

  return (
    <ScrollProgress
      forceMount
      disableScroll
      className="fixed top-0 left-0 right-0 z-50 h-0.5"
    />
  );
}
