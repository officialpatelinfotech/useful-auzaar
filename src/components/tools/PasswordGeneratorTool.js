"use client";

import { useMemo, useState } from "react";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/|~",
};

function getRandomInt(max) {
  const arr = new Uint32Array(1);
  window.crypto.getRandomValues(arr);
  return arr[0] % max;
}

function pick(set) {
  return set[getRandomInt(set.length)];
}

function shuffle(chars) {
  for (let i = chars.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars;
}

function generatePassword(length, options) {
  const pools = [];
  if (options.lower) pools.push(SETS.lower);
  if (options.upper) pools.push(SETS.upper);
  if (options.numbers) pools.push(SETS.numbers);
  if (options.symbols) pools.push(SETS.symbols);
  if (pools.length === 0) return "";

  const all = pools.join("");
  const chars = [];

  // Ensure at least one from each selected pool
  for (const pool of pools) chars.push(pick(pool));
  while (chars.length < length) chars.push(pick(all));
  return shuffle(chars).slice(0, length).join("");
}

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({
    lower: true,
    upper: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");

  const canGenerate = useMemo(
    () => opts.lower || opts.upper || opts.numbers || opts.symbols,
    [opts],
  );

  function onGenerate() {
    if (!canGenerate) return;
    setPassword(generatePassword(length, opts));
  }

  async function onCopy() {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium">Length: {length}</label>
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          12–20 characters is a good baseline for most accounts.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["lower", "Lowercase"],
          ["upper", "Uppercase"],
          ["numbers", "Numbers"],
          ["symbols", "Symbols"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={opts[key]}
              onChange={(e) => setOpts((o) => ({ ...o, [key]: e.target.checked }))}
            />
            {label}
          </label>
        ))}
      </div>

      {!canGenerate ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          Select at least one character set.
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate}
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background disabled:opacity-60"
        >
          Generate password
        </button>
        <button
          type="button"
          onClick={onCopy}
          disabled={!password}
          className="inline-flex h-11 items-center justify-center rounded-full border border-black/[.08] px-6 text-sm font-medium hover:bg-black/[.04] disabled:opacity-60 dark:border-white/[.145] dark:hover:bg-white/[.06]"
        >
          Copy
        </button>
      </div>

      <div className="rounded-xl border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-black">
        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Your password
        </p>
        <p className="mt-2 break-all font-mono text-sm">
          {password || "Generate a password to see it here."}
        </p>
      </div>
    </div>
  );
}
