const features = [
  { id: 1, name: "Smart Class AI", headline: "ভিডিও দেখো, AI দিয়ে বুঝে নাও।" },
  { id: 2, name: "Shikho AI", headline: "যেকোনো প্রশ্ন, তাৎক্ষণিক উত্তর।" },
  { id: 3, name: "Priority Subjects + Report Card", headline: "কী পড়তে হবে, রিপোর্ট কার্ডই বলে দেবে।" },
  { id: 4, name: "Course Progress", headline: "ধাপে ধাপে এগিয়ে যাও, পরিকল্পনামাফিক।" },
  { id: 5, name: "Practice MCQ", headline: "নিজেকে যাচাই করো, যেকোনো সময়।" },
  { id: 6, name: "Leaderboard", headline: "নিজের জায়গা জানো, এগিয়ে যাওয়ার অনুপ্রেরণা পাও।" },
];

export default function ScrollytellingFeatures() {
  return (
    <section className="bg-indigo-200">
      <div className="sticky top-0 h-screen flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-indigo-500 mb-2">Section 1 (cont.)</p>
          <h2 className="text-3xl font-bold text-indigo-900">Scrollytelling Features</h2>
          <p className="mt-2 text-indigo-700 text-sm">Pinned phone morphs through 6 feature beats</p>
        </div>
      </div>
      {features.map((f) => (
        <div key={f.id} className="min-h-screen flex items-center justify-center">
          <div className="text-center px-8">
            <p className="text-xs font-mono uppercase tracking-widest text-indigo-500 mb-2">Feature {f.id}</p>
            <h3 className="text-2xl font-bold text-indigo-900">{f.name}</h3>
            <p className="mt-2 text-indigo-700">{f.headline}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
