
  import { createRoot } from "react-dom/client";
  import App from "./App";
  import "./index.css";
  const goWatchIcon = "/GoWatch_Icon-Xxhj5pLQ.png";

  function ensureFavicon(href: string) {
    if (!href) return;
    const linkTypes = [
      'icon',
      'shortcut icon',
      'apple-touch-icon',
    ];
    let link: HTMLLinkElement | null = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = href;
    const existingShortcut = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement | null;
    if (!existingShortcut) {
      const sc = document.createElement('link');
      sc.rel = 'shortcut icon';
      sc.type = 'image/png';
      sc.href = href;
      document.head.appendChild(sc);
    } else {
      existingShortcut.type = 'image/png';
      existingShortcut.href = href;
    }
  }

  async function createFaviconWithBackground(src: string, bgColor: string, size = 64): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(src);
        const r = Math.max(6, Math.round(size * 0.18));
        ctx.clearRect(0, 0, size, size);
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(size - r, 0);
        ctx.quadraticCurveTo(size, 0, size, r);
        ctx.lineTo(size, size - r);
        ctx.quadraticCurveTo(size, size, size - r, size);
        ctx.lineTo(r, size);
        ctx.quadraticCurveTo(0, size, 0, size - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.fillStyle = bgColor;
        ctx.fill();
        ctx.clip();
        const padding = 0.12;
        const target = size * (1 - padding * 2);
        const scale = Math.min(target / img.width, target / img.height);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const x = Math.floor((size - w) / 2);
        const y = Math.floor((size - h) / 2);
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, x, y, w, h);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(src);
      img.src = src;
    });
  }

  ensureFavicon(goWatchIcon);
  createFaviconWithBackground(goWatchIcon, '#EFE4F4', 64).then((dataUrl) => {
    ensureFavicon(dataUrl);
  });

  createRoot(document.getElementById("root")!).render(<App />);
  