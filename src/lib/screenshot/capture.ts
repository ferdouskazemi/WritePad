import { toPng, toBlob } from "html-to-image";

export interface ScreenshotOptions {
  pixelRatio?: number;
  includeWatermark?: boolean;
  onProgress?: (progress: number) => void;
}

export async function captureElementToPng(
  element: HTMLElement,
  options: ScreenshotOptions = {}
): Promise<string> {
  const { pixelRatio = 2, onProgress } = options;
  onProgress?.(0.2);

  const dataUrl = await toPng(element, {
    pixelRatio,
    cacheBust: true,
    filter: (node) => {
      // Don't include UI controls, selection bubbles, or toast in screenshot
      if (node instanceof HTMLElement) {
        if (
          node.classList.contains("no-screenshot") ||
          node.tagName.toLowerCase().startsWith("hose-") ||
          node.classList.contains("tab-strip-container")
        ) {
          return false;
        }
      }
      return true;
    },
  });

  onProgress?.(1);
  return dataUrl;
}

export async function captureElementToBlob(
  element: HTMLElement,
  options: ScreenshotOptions = {}
): Promise<Blob | null> {
  const { pixelRatio = 2, onProgress } = options;
  onProgress?.(0.3);

  const blob = await toBlob(element, {
    pixelRatio,
    cacheBust: true,
    filter: (node) => {
      if (node instanceof HTMLElement) {
        if (
          node.classList.contains("no-screenshot") ||
          node.tagName.toLowerCase().startsWith("hose-") ||
          node.classList.contains("tab-strip-container")
        ) {
          return false;
        }
      }
      return true;
    },
  });

  onProgress?.(1);
  return blob;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyBlobToClipboard(blob: Blob): Promise<boolean> {
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      return true;
    }
  } catch (err) {
    console.warn("ClipboardItem write failed:", err);
  }
  return false;
}

export async function shareBlob(blob: Blob, title: string): Promise<boolean> {
  try {
    if (navigator.share) {
      const file = new File([blob], `${title.replace(/\s+/g, "_")}.png`, {
        type: "image/png",
      });
      await navigator.share({
        title,
        text: "Note written with Write Pad",
        files: [file],
      });
      return true;
    }
  } catch (err) {
    console.warn("Web Share API failed:", err);
  }
  return false;
}
