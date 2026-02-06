"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: any;
  }
}

type Props = {
  postUrls: string[];
};

function loadInstagramEmbedScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.instgrm?.Embeds?.process) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.instagram.com/embed.js"]'
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      setTimeout(() => resolve(), 400);
      return;
    }

    const s = document.createElement("script");
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

export default function InstagramEmbedGrid({ postUrls }: Props) {
  useEffect(() => {
    let alive = true;

    (async () => {
      await loadInstagramEmbedScript();
      if (!alive) return;

      // ✅ embed 처리 (가끔 1번으로 안 뜨는 경우 대비해 2번 호출)
      try {
        window.instgrm?.Embeds?.process?.();
        setTimeout(() => window.instgrm?.Embeds?.process?.(), 300);
      } catch {}
    })();

    return () => {
      alive = false;
    };
  }, [postUrls]);

  const urls = [...postUrls].slice(0, 9);
  while (urls.length < 9) urls.push("");

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {urls.map((url, i) => (
        <div
          key={`${url}-${i}`}
          className="relative aspect-square overflow-hidden rounded-xl bg-gray-100"
        >
          {url ? (
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={url}
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                margin: 0,
                padding: 0,
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <a
              href="https://linktr.ee/leegafnb"
              target="_blank"
              rel="noreferrer"
              className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-600"
              aria-label="linktr.ee로 이동"
            >
              더보기
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
