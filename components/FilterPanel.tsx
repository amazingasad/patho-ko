'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, RotateCcw, X } from 'lucide-react';
import { COLOR_CHIPS, CRYSTAL_SYSTEMS, ELEMENT_CHIPS } from '@/lib/color';
import { DEFAULT_FILTERS, type StoneFilters } from '@/lib/types';

export function countActiveFilters(f: StoneFilters): number {
  let n = 0;
  if (f.elements.length > 0) n += 1;
  if (f.hardnessMin > DEFAULT_FILTERS.hardnessMin || f.hardnessMax < DEFAULT_FILTERS.hardnessMax) n += 1;
  if (f.crystalSystem) n += 1;
  if (f.color) n += 1;
  return n;
}

interface FieldsProps {
  value: StoneFilters;
  onChange: (next: StoneFilters) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{title}</h3>
      {children}
    </section>
  );
}

function FilterFields({ value, onChange }: FieldsProps) {
  const toggleElement = (el: string) => {
    const has = value.elements.includes(el);
    onChange({
      ...value,
      elements: has ? value.elements.filter((e) => e !== el) : [...value.elements, el],
    });
  };

  const STEP = 0.5;
  const span = 10 - 1;
  const left = ((value.hardnessMin - 1) / span) * 100;
  const right = ((value.hardnessMax - 1) / span) * 100;
  const minOnTop = value.hardnessMin > 5;

  return (
    <div className="space-y-7">
      <Section title="Chemical elements">
        <div className="flex flex-wrap gap-2">
          {ELEMENT_CHIPS.map((el) => {
            const active = value.elements.includes(el);
            return (
              <motion.button
                key={el}
                type="button"
                whileTap={{ scale: 0.96 }}
                aria-pressed={active}
                onClick={() => toggleElement(el)}
                className={`chip min-w-[48px] ${active ? 'chip-active' : ''}`}
              >
                {el}
              </motion.button>
            );
          })}
        </div>
      </Section>

      <Section title="Hardness (Mohs)">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold text-zinc-100">{value.hardnessMin}</span>
          <span className="text-zinc-500">to</span>
          <span className="font-semibold text-zinc-100">{value.hardnessMax}</span>
        </div>
        <div className="dual-range">
          <div className="track" />
          <div className="fill" style={{ left: `${left}%`, right: `${100 - right}%` }} />
          <input
            type="range"
            min={1}
            max={10}
            step={STEP}
            value={value.hardnessMin}
            aria-label="Minimum hardness"
            style={{ zIndex: minOnTop ? 5 : 3 }}
            onChange={(e) =>
              onChange({
                ...value,
                hardnessMin: Math.min(parseFloat(e.target.value), value.hardnessMax),
              })
            }
          />
          <input
            type="range"
            min={1}
            max={10}
            step={STEP}
            value={value.hardnessMax}
            aria-label="Maximum hardness"
            style={{ zIndex: minOnTop ? 3 : 5 }}
            onChange={(e) =>
              onChange({
                ...value,
                hardnessMax: Math.max(parseFloat(e.target.value), value.hardnessMin),
              })
            }
          />
        </div>
        <div className="flex justify-between text-[11px] text-zinc-600">
          <span>1 · Talc</span>
          <span>10 · Diamond</span>
        </div>
      </Section>

      <Section title="Crystal system">
        <div className="relative">
          <select
            value={value.crystalSystem}
            onChange={(e) => onChange({ ...value, crystalSystem: e.target.value })}
            aria-label="Crystal system"
            className="field h-12 appearance-none pr-10"
          >
            <option value="" className="bg-[#14141c]">
              Any crystal system
            </option>
            {CRYSTAL_SYSTEMS.map((cs) => (
              <option key={cs} value={cs} className="bg-[#14141c]">
                {cs}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          />
        </div>
      </Section>

      <Section title="Color">
        <div className="flex flex-wrap gap-2">
          {COLOR_CHIPS.map(({ name, hex }) => {
            const active = value.color === name;
            return (
              <motion.button
                key={name}
                type="button"
                whileTap={{ scale: 0.96 }}
                aria-pressed={active}
                onClick={() => onChange({ ...value, color: active ? '' : name })}
                className={`chip ${active ? 'chip-active' : ''}`}
              >
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full border border-white/30"
                  style={{ background: hex }}
                >
                  {active && <Check className="h-3 w-3 text-black/70" aria-hidden="true" />}
                </span>
                {name}
              </motion.button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function Actions({
  onApply,
  onClear,
}: {
  onApply: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex gap-3">
      <motion.button type="button" whileTap={{ scale: 0.96 }} onClick={onClear} className="btn-ghost select-none">
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Clear all
      </motion.button>
      <motion.button type="button" whileTap={{ scale: 0.96 }} onClick={onApply} className="btn-primary flex-1 select-none">
        Apply filters
      </motion.button>
    </div>
  );
}

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  value: StoneFilters;
  onChange: (next: StoneFilters) => void;
  onApply: () => void;
  onClear: () => void;
}

/** Slide-up sheet on mobile, left sidebar on desktop. */
export default function FilterPanel({ open, onClose, value, onChange, onApply, onClear }: FilterPanelProps) {
  // Lock page scroll while the mobile sheet is open.
  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      {/* Desktop sidebar */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.aside
            key="sidebar"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="hidden w-72 shrink-0 md:block"
            aria-label="Filters"
          >
            <div className="glass sticky top-24 max-h-[calc(100dvh-8rem)] space-y-7 overflow-y-auto rounded-3xl p-5 no-scrollbar">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Filters</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Hide filters"
                  className="tap flex items-center justify-center rounded-xl text-zinc-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <FilterFields value={value} onChange={onChange} />
              <Actions onApply={onApply} onClear={onClear} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {open && (
          <div className="md:hidden">
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 40 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120 || info.velocity.y > 600) onClose();
              }}
              className="glass-strong fixed inset-x-0 bottom-0 z-[61] flex max-h-[88dvh] flex-col rounded-t-4xl will-change-transform"
            >
              <div className="flex shrink-0 flex-col items-center px-5 pb-2 pt-3">
                <span className="mb-3 h-1.5 w-10 rounded-full bg-white/20" />
                <div className="flex w-full items-center justify-between">
                  <h2 className="text-xl font-semibold tracking-tight">Filters</h2>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close filters"
                    className="tap flex items-center justify-center rounded-xl text-zinc-400"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4 pt-3">
                <FilterFields value={value} onChange={onChange} />
              </div>
              <div
                className="shrink-0 border-t border-white/10 px-5 pt-4"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
              >
                <Actions onApply={onApply} onClear={onClear} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
