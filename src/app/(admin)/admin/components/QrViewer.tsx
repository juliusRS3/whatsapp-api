type QrViewerProps = {
  qrDataUrl: string | null;
  pairingCode?: string | null;
};

export function QrViewer({ qrDataUrl, pairingCode }: QrViewerProps) {
  if (pairingCode) {
    const shown = pairingCode.length === 8 ? `${pairingCode.slice(0, 4)}-${pairingCode.slice(4)}` : pairingCode;
    return (
      <div className="rounded-lg border border-zinc-700/60 bg-zinc-800/70 p-4 text-center">
        <p className="text-xs uppercase tracking-wide text-zinc-400">Pairing code</p>
        <p className="my-2 select-all font-mono text-3xl font-bold tracking-widest">{shown}</p>
        <p className="text-xs text-zinc-400">
          On the phone: WhatsApp &gt; Linked devices &gt; Link a device &gt; Link with phone number instead, then type this code.
          A new code appears about every 3 minutes.
        </p>
      </div>
    );
  }

  if (!qrDataUrl) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-700/60 bg-zinc-800/70 p-6 text-center text-sm text-zinc-400">
        QR is unavailable. Session might already be connected.
      </div>
    );
  }

  return (
    <div className="flex justify-center rounded-lg border border-zinc-700/60 bg-zinc-800/70 p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qrDataUrl} alt="WhatsApp QR" className="h-64 w-64 rounded-md border border-zinc-700/60 bg-white" />
    </div>
  );
}
