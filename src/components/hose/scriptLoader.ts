"use client";

const loadedScripts = new Set<string>();

export function loadHoseScript(name: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const src = `/rubber-hose-ui/${name}.js`;
  if (loadedScripts.has(src)) return Promise.resolve();

  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) {
    loadedScripts.add(src);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      loadedScripts.add(src);
      resolve();
    };
    script.onerror = (err) => {
      console.error(`Failed to load Rubber Hose script: ${src}`, err);
      reject(err);
    };
    document.head.appendChild(script);
  });
}
