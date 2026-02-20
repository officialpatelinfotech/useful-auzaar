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

export default function QrCodeTool() {
  const [mode, setMode] = useState("url");
  const [value, setValue] = useState("");
  const [waPhone, setWaPhone] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [dark, setDark] = useState("#171717");
  const [light, setLight] = useState("#ffffff");
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
        const [pngUrl, svgString] = await Promise.all([
          QRCode.toDataURL(effectiveValue, {
            margin: 2,
            color: { dark, light },
            errorCorrectionLevel: "M",
          }),
          QRCode.toString(effectiveValue, {
            type: "svg",
            margin: 2,
            color: { dark, light },
            errorCorrectionLevel: "M",
          }),
        ]);
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
  }, [effectiveValue, dark, light]);

  const svgDownloadHref = useMemo(() => {
    if (!svg) return "";
    const blob = new Blob([svg], { type: "image/svg+xml" });
    return URL.createObjectURL(blob);
  }, [svg]);

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
