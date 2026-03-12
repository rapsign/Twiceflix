"use client";

// src/app/(main)/shorts/ShortsClient.jsx
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import useDataManager from "@/hooks/useDataManager";
import { useLazyShuffledShorts } from "./_hooks/useLazyShuffledShorts";
import {
  MobileSkeletonLoader,
  DesktopSkeletonLoader,
} from "./_components/skeletons";
import MobileShorts from "./_components/MobileShorts";
import DesktopShorts from "./_components/DesktopShorts";
import { MOBILE_BREAKPOINT } from "./_components/constants";

function ShortContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? null;
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: shorts, loading } = useDataManager("youtube-short");
  const { getShort, total } = useLazyShuffledShorts(shorts, id);

  useEffect(() => {
    setMounted(true);
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!loading) NProgress.done();
    else NProgress.start();
  }, [loading]);

  if (!mounted) return null;
  if (loading)
    return isMobile ? <MobileSkeletonLoader /> : <DesktopSkeletonLoader />;

  return isMobile ? (
    <MobileShorts getShort={getShort} total={total} />
  ) : (
    <DesktopShorts getShort={getShort} total={total} />
  );
}

export default function ShortsClient() {
  return (
    <Suspense fallback={<MobileSkeletonLoader />}>
      <ShortContent />
    </Suspense>
  );
}
