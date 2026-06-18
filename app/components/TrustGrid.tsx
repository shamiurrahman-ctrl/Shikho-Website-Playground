const points = [
  "সেরা কন্টেন্ট",
  "সহজ স্টাডি ম্যাটেরিয়াল",
  "স্বল্প খরচে অনেক কিছু",
  "সাবলীল উপস্থাপনা",
];

export default function TrustGrid() {
  return (
    <section className="py-24 flex items-center justify-center bg-orange-200">
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-orange-600 mb-2">Section 5b</p>
        <h2 className="text-3xl font-bold text-orange-900">Trust Grid</h2>
        <p className="mt-1 text-orange-700 text-sm">কেন Shikho-তে আস্থা রাখবে — 4-point grid</p>
        <div className="mt-4 grid grid-cols-2 gap-3 max-w-xs mx-auto">
          {points.map((p) => (
            <div key={p} className="rounded-xl bg-orange-300 px-4 py-4 text-sm font-medium text-orange-900">
              {p}
            </div>
          ))}
        </div>
        <p className="mt-3 text-orange-500 text-xs italic">Carried forward — restyle to match new design</p>
      </div>
    </section>
  );
}
