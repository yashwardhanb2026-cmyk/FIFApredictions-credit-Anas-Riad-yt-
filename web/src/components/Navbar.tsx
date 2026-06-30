"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Probabilities" },
  { href: "/match-explorer", label: "Match Explorer" },
  { href: "/live-simulation", label: "Live Simulation" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 w-full z-50 border-b border-white/10 shadow-2xl"
      style={{
        background: "rgba(14, 19, 34, 0.7)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div className="flex justify-between items-center h-20 px-6 md:px-12 max-w-[1440px] mx-auto w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-3xl" style={{ color: "#f5c518", fontVariationSettings: "'FILL' 1" }}>
            sports_soccer
          </span>
          <span
            className="font-extrabold text-xl tracking-tight"
            style={{ color: "#f5c518", textShadow: "0 0 20px rgba(245,197,24,0.4)" }}
          >
            FIFA 2026 PREDICTOR
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-all duration-200 pb-1 ${
                pathname === link.href
                  ? "text-[#f5c518] border-b-2 border-[#f5c518]"
                  : "text-[#d1c5ac] hover:text-white border-b-2 border-transparent"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#d1c5ac] hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0e1322]/95 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-semibold py-2 transition-colors ${
                pathname === link.href ? "text-[#f5c518]" : "text-[#d1c5ac] hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
