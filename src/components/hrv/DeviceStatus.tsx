interface DeviceStatusProps {
  connected: boolean;
}

export function DeviceStatus({ connected }: DeviceStatusProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
        connected
          ? 'bg-green-50 text-green-700'
          : 'bg-red-50 text-red-700'
      }`}
    >
      <span
        className={`w-3 h-3 rounded-full ${
          connected
            ? 'bg-green-500 animate-pulse'
            : 'bg-red-500'
        }`}
        aria-hidden="true"
      />
      <span className="text-sm font-medium">
        {connected ? 'Device Connected' : 'Connection Lost'}
      </span>
    </div>
  );
}
