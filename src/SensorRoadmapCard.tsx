export function SensorRoadmapCard() {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">感測模式規劃</h2>
      <div className="space-y-3 text-sm text-slate-600">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="font-medium text-slate-800">第一階段：以手動為主</p>
          <p>速度最快、最穩定，也最省電，離線環境下同樣可用。</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="font-medium text-slate-800">第二階段：相機姿勢辨識</p>
          <p>只在支援的裝置上載入 MediaPipe 或 TensorFlow.js，避免拖慢一般使用體驗。</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="font-medium text-slate-800">計數邏輯</p>
          <p>結合下巴過槓、手肘角度與動作狀態機，避免重複計數。</p>
        </div>
      </div>
    </div>
  );
}
