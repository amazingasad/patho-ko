'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bookmark, Home, Info, Search } from 'lucide-react';
import { CrystalIcon, Wordmark } from './Logo';

const LINKS = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/search', label: 'Search', Icon: Search },
  { href: '/saved', label: 'Saved', Icon: Bookmark },
  { href: '/about', label: 'About', Icon: Info },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-50 select-none border-b border-white/10 bg-[#0a0a0f]/70 backdrop-blur-xl"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-[height] duration-200 ease-out md:px-6 ${
            scrolled ? 'h-12' : 'h-16'
          }`}
        >
          <motion.div whileTap={{ scale: 0.96 }}>
            <Link
              href="/"
              aria-label="Pathor-Ko home"
              className="tap flex items-center gap-2.5 rounded-2xl"
            >
              <span
                className={`transition-transform duration-200 ease-out will-change-transform ${
                  scrolled ? 'scale-90' : 'scale-100'
                }`}
              >
                <CrystalIcon size={32} />
              </span>
              <span
                className={`transition-opacity duration-200 ${
                  scrolled ? 'hidden opacity-0 md:inline md:opacity-100' : 'inline opacity-100'
                }`}
              >
                <Wordmark className="text-xl" />
              </span>
            </Link>
          </motion.div>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {LINKS.map(({ href, label, Icon }) => {
              const active = isActive(pathname, href);
              return (
                <motion.div key={href} whileTap={{ scale: 0.96 }}>
                  <Link
                    href={href}
                    className={`tap relative flex items-center gap-2 rounded-2xl px-4 text-sm font-medium transition-colors ${
                      active ? 'text-amber-gold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="desktop-nav-pill"
                        className="absolute inset-0 rounded-2xl border border-amber/30 bg-amber/10"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    <Icon className="relative h-4 w-4" aria-hidden="true" />
                    <span className="relative">{label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </header>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-50 select-none border-t border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <ul className="mx-auto grid h-[4.5rem] max-w-md grid-cols-4 items-stretch px-2">
          {LINKS.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href} className="flex">
                <motion.div whileTap={{ scale: 0.96 }} className="flex flex-1">
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-medium transition-colors ${
                      active ? 'text-amber-gold' : 'text-zinc-500'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="bottom-nav-pill"
                        className="absolute inset-x-3 inset-y-1.5 rounded-2xl bg-amber/10"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    <Icon className="relative h-5 w-5" aria-hidden="true" />
                    <span className="relative">{label}</span>
                  </Link>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
