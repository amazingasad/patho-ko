import { CrystalIcon } from '@/components/Logo';

export const metadata = {
  title: 'About — Pathor-Ko',
};

const STEPS = [
  {
    title: 'iPhone or iPad (Safari)',
    text: 'Tap the Share button, then “Add to Home Screen”.',
  },
  {
    title: 'Android (Chrome)',
    text: 'Open the ⋮ menu, then choose “Install app” or “Add to Home screen”.',
  },
];

export default function AboutPage() {
  return (
    <div className="pb-nav mx-auto max-w-2xl space-y-6 px-4 pt-8 md:px-6 md:pt-12">
      <div className="flex items-center gap-4">
        <CrystalIcon size={56} />
        <div>
          <h1 className="text-4xl font-semibold tracking-tighter">
            Pathor<span className="text-amber">-Ko</span>
          </h1>
          <p className="text-zinc-400">Discover where every stone lives.</p>
        </div>
      </div>

      <section className="glass rounded-3xl p-6">
        <h2 className="text-lg font-semibold tracking-tight">What does the name mean?</h2>
        <p className="mt-2 leading-relaxed text-zinc-400">
          “Pathor” (পাথর) means stone in Bengali, and “Ko” is a friendly, app-like ending. Together it
          reads as Stone-App: a warm, approachable way to explore the minerals under our feet.
        </p>
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="text-lg font-semibold tracking-tight">How it works</h2>
        <p className="mt-2 leading-relaxed text-zinc-400">
          Search a stone to see every known locality on an interactive map, or search a country to see
          which stones turn up there. Filter by chemical elements, hardness, crystal system and color.
        </p>
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="text-lg font-semibold tracking-tight">Install it like an app</h2>
        <ul className="mt-3 space-y-3">
          {STEPS.map((s) => (
            <li key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-zinc-100">{s.title}</p>
              <p className="mt-1 text-sm text-zinc-400">{s.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="text-lg font-semibold tracking-tight">Credits</h2>
        <p className="mt-2 leading-relaxed text-zinc-400">
          Pathor-Ko ships with its own curated reference collection of well-known stones and
          localities, so it works instantly with no account, no key and no setup. The collection
          covers the classic mines, districts and collecting areas rather than every occurrence on
          Earth. Coordinates are approximate. Map tiles are © OpenStreetMap contributors.
        </p>
      </section>
    </div>
  );
}
