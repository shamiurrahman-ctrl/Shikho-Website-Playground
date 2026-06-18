export default function StatsBar() {
  return (
    <section className="py-20 flex items-center justify-center bg-amber-200">
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-amber-600 mb-2">Section 2</p>
        <h2 className="text-3xl font-bold text-amber-900">Stats Bar</h2>
        <p className="mt-2 text-amber-700 text-sm">
          ৩০ লক্ষ+ শিক্ষার্থী · ২০ জন+ মেন্টর · ৪৫ লক্ষ+ ডাউনলোড · ৫ লক্ষ+ ম্যাটেরিয়াল
        </p>
        <p className="mt-1 text-amber-600 text-xs">Count-up animation on scroll-into-view</p>
      </div>
    </section>
  );
}
