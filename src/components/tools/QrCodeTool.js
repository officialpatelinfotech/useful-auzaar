"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

function buildWhatsAppUrl(phone, message) {
  const normalized = String(phone || "").replace(/[^0-9]/g, "");
  const text = String(message || "");
  if (!normalized) return "";
  const params = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${normalized}${params}`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("File read failed"));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = src;
  });
}

function roundedRectPath(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

async function embedLogoInPngCanvas(canvas, logoDataUrl, light) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const size = Math.min(canvas.width, canvas.height);
  const logoSize = Math.round(size * 0.22);
  const pad = Math.round(size * 0.04);
  const boxSize = logoSize + pad * 2;
  const boxX = Math.round((size - boxSize) / 2);
  const boxY = Math.round((size - boxSize) / 2);
  const radius = Math.round(size * 0.04);

  const img = await loadImage(logoDataUrl);

  // Draw a light background behind the logo for scan reliability
  ctx.save();
  ctx.fillStyle = light;
  roundedRectPath(ctx, boxX, boxY, boxSize, boxSize, radius);
  ctx.fill();
  ctx.restore();

  const logoX = Math.round((size - logoSize) / 2);
  const logoY = Math.round((size - logoSize) / 2);
  ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
}

function getSvgSize(svgString) {
  const viewBoxMatch = svgString.match(/viewBox\s*=\s*"\s*0\s+0\s+([0-9.]+)\s+([0-9.]+)\s*"/i);
  if (viewBoxMatch) {
    const w = Number(viewBoxMatch[1]);
    const h = Number(viewBoxMatch[2]);
    if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) return { w, h };
  }

  const widthMatch = svgString.match(/\swidth\s*=\s*"\s*([0-9.]+)\s*"/i);
  const heightMatch = svgString.match(/\sheight\s*=\s*"\s*([0-9.]+)\s*"/i);
  const w = widthMatch ? Number(widthMatch[1]) : NaN;
  const h = heightMatch ? Number(heightMatch[1]) : NaN;
  if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) return { w, h };

  return { w: 256, h: 256 };
}

function embedLogoInSvg(svgString, logoDataUrl, light) {
  if (!svgString || !logoDataUrl) return svgString;
  if (!svgString.includes("</svg>")) return svgString;

  const { w, h } = getSvgSize(svgString);
  const size = Math.min(w, h);
  const logoSize = size * 0.22;
  const pad = size * 0.04;
  const boxSize = logoSize + pad * 2;
  const x = (w - boxSize) / 2;
  const y = (h - boxSize) / 2;
  const rx = size * 0.04;
  const logoX = (w - logoSize) / 2;
  const logoY = (h - logoSize) / 2;

  const overlay = `\n  <rect x="${x}" y="${y}" width="${boxSize}" height="${boxSize}" rx="${rx}" ry="${rx}" fill="${light}" />\n  <image href="${logoDataUrl}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" />\n`;

  return svgString.replace("</svg>", `${overlay}</svg>`);
}

export default function QrCodeTool() {
  const [mode, setMode] = useState("url");
  const [value, setValue] = useState("");
  const [waPhone, setWaPhone] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [dark, setDark] = useState("#171717");
  const [light, setLight] = useState("#ffffff");
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [png, setPng] = useState("");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  const effectiveValue = useMemo(() => {
    if (mode === "whatsapp") return buildWhatsAppUrl(waPhone, waMessage);
    return value;
  }, [mode, value, waPhone, waMessage]);

  useEffect(() => {
    let cancelled = false;
    async function generate() {
      setError("");
      setPng("");
      setSvg("");
      if (!effectiveValue) return;
      try {
        const errorCorrectionLevel = logoDataUrl ? "H" : "M";
        const options = {
          margin: 2,
          color: { dark, light },
          errorCorrectionLevel,
        };

        const canvas = document.createElement("canvas");
        await QRCode.toCanvas(canvas, effectiveValue, options);
        if (logoDataUrl) {
          await embedLogoInPngCanvas(canvas, logoDataUrl, light);
        }
        const pngUrl = canvas.toDataURL("image/png");

        let svgString = await QRCode.toString(effectiveValue, {
          type: "svg",
          ...options,
        });
        if (logoDataUrl) {
          svgString = embedLogoInSvg(svgString, logoDataUrl, light);
        }
        if (cancelled) return;
        setPng(pngUrl);
        setSvg(svgString);
      } catch {
        if (cancelled) return;
        setError("Could not generate a QR code for this input.");
      }
    }

    generate();
    return () => {
      cancelled = true;
    };
  }, [effectiveValue, dark, light, logoDataUrl]);

  const svgDownloadHref = useMemo(() => {
    if (!svg) return "";
    const blob = new Blob([svg], { type: "image/svg+xml" });
    return URL.createObjectURL(blob);
  }, [svg]);

  useEffect(() => {
    return () => {
      if (svgDownloadHref) URL.revokeObjectURL(svgDownloadHref);
    };
  }, [svgDownloadHref]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">QR type</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full rounded-xl border border-black/[.08] bg-transparent px-4 py-3 text-sm outline-none dark:border-white/[.145]"
          >
            <option value="url">URL</option>
            <option value="text">Text</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        {mode === "whatsapp" ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone number</label>
              <input
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
                placeholder="e.g. 919999999999"
                className="w-full rounded-xl border border-black/[.08] bg-transparent px-4 py-3 text-sm outline-none dark:border-white/[.145]"
                inputMode="tel"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Use country code. No +, spaces, or dashes.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message (optional)</label>
              <textarea
                value={waMessage}
                onChange={(e) => setWaMessage(e.target.value)}
                placeholder="Hi!"
                className="min-h-24 w-full rounded-xl border border-black/[.08] bg-transparent px-4 py-3 text-sm outline-none dark:border-white/[.145]"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {mode === "text" ? "Text" : "URL"}
            </label>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={mode === "text" ? "Enter text" : "https://example.com"}
              className="min-h-24 w-full rounded-xl border border-black/[.08] bg-transparent px-4 py-3 text-sm outline-none dark:border-white/[.145]"
            />
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">QR color</label>
            <input
              type="color"
              value={dark}
              onChange={(e) => setDark(e.target.value)}
              className="h-11 w-full rounded-xl border border-black/[.08] bg-transparent px-2 dark:border-white/[.145]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Background</label>
            <input
              type="color"
              value={light}
              onChange={(e) => setLight(e.target.value)}
              className="h-11 w-full rounded-xl border border-black/[.08] bg-transparent px-2 dark:border-white/[.145]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Logo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              setError("");
              const file = e.target.files?.[0];
              if (!file) {
                setLogoDataUrl("");
                return;
              }
              try {
                const dataUrl = await readFileAsDataUrl(file);
                setLogoDataUrl(dataUrl);
              } catch {
                setLogoDataUrl("");
                setError("Could not read that logo file.");
              }
            }}
            className="block w-full text-sm file:mr-3 file:rounded-full file:border file:border-black/[.08] file:bg-transparent file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-black/[.04] dark:file:border-white/[.145] dark:hover:file:bg-white/[.06]"
          />
          {logoDataUrl ? (
            <button
              type="button"
              onClick={() => setLogoDataUrl("")}
              className="rounded-full border border-black/[.08] px-4 py-2 text-sm hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
            >
              Remove logo
            </button>
          ) : null}
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Tip: use a simple square logo with good contrast.
          </p>
        </div>

        {effectiveValue ? (
          <p className="break-all text-xs text-zinc-500 dark:text-zinc-400">
            Encoded: {effectiveValue}
          </p>
        ) : null}

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Preview</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Download as PNG or SVG.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={png || "#"}
              download="qr-code.png"
              className={`rounded-full border border-black/[.08] px-4 py-2 text-sm dark:border-white/[.145] ${png ? "hover:bg-black/[.04] dark:hover:bg-white/[.06]" : "pointer-events-none opacity-50"}`}
            >
              Download PNG
            </a>
            <a
              href={svgDownloadHref || "#"}
              download="qr-code.svg"
              className={`rounded-full border border-black/[.08] px-4 py-2 text-sm dark:border-white/[.145] ${svg ? "hover:bg-black/[.04] dark:hover:bg-white/[.06]" : "pointer-events-none opacity-50"}`}
            >
              Download SVG
            </a>
          </div>
        </div>

        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-black">
          {png ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={png} alt="Generated QR code" className="h-56 w-56" />
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Enter a value to generate a QR code.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
