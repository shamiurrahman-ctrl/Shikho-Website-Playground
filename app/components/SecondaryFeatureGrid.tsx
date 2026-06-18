const tiles = [
  "Search + Explore",
  "E-Book",
  "Archive Course Access",
  "FutureBook",
];

export default function SecondaryFeatureGrid() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-emerald-200">
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-emerald-600 mb-2">Section 3</p>
        <h2 className="text-3xl font-bold text-emerald-900">Secondary Feature Grid</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {tiles.map((tile) => (
            <div key={tile} className="rounded-xl bg-emerald-300 px-4 py-5 text-sm font-medium text-emerald-900">
              {tile}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
