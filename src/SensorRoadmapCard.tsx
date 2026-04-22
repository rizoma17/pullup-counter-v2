export function SensorRoadmapCard() {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Sensor Mode</h2>
      <div className="space-y-3 text-sm text-slate-600">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="font-medium text-slate-800">Phase 1: Manual-first</p>
          <p>Fast and reliable. Works offline with the lowest battery impact.</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="font-medium text-slate-800">Phase 2: Camera pose estimation</p>
          <p>Load MediaPipe or TensorFlow.js only on supported devices and only when enabled.</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="font-medium text-slate-800">Counting logic</p>
          <p>Use chin-over-bar threshold, elbow angle validation, and a rep state machine.</p>
        </div>
      </div>
    </div>
  );
}
