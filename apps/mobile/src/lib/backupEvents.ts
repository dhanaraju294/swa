// Kept separate from engine/UI modules to avoid initialization cycles.
let listener: (() => Promise<void>) | null = null;
export function setBackupListener(next: (() => Promise<void>) | null) { listener = next; }
export async function requestDeviceBackup(): Promise<void> { await listener?.(); }
