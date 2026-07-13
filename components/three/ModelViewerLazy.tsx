"use client";

import dynamic from "next/dynamic";

const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

/** Pembungkus client agar ModelViewer (butuh browser) bisa dipakai dari
 *  Server Component tanpa SSR. */
export default function ModelViewerLazy(props: {
  src?: string;
  className?: string;
}) {
  return <ModelViewer {...props} />;
}
