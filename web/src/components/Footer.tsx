export default function Footer() {
  return (
    <footer
      className="w-full py-10 px-6 md:px-12 border-t border-white/5 mt-auto"
      style={{ background: "#090e1c" }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-[1440px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-2xl"
            style={{ color: "#f5c518", fontVariationSettings: "'FILL' 1" }}
          >
            sports_soccer
          </span>
          <span className="font-bold text-lg" style={{ color: "#f5c518" }}>
            FIFA 2026 PREDICTOR
          </span>
        </div>

        {/* Credits */}
        <div className="text-center text-xs tracking-widest uppercase text-[#9a9078] space-y-1">
          <p>Built with Poisson Regression + Monte Carlo Simulation</p>
          <p className="opacity-60">Data: FIFA / Elo Ratings • Credit: Anas Riad</p>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-xs tracking-widest uppercase text-[#9a9078]">
          <a href="https://github.com/yashwardhanb2026-cmyk/FIFApredictions-credit-Anas-Riad-yt-" target="_blank" rel="noopener noreferrer" className="hover:text-[#f5c518] transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-[#f5c518] transition-colors">
            Methodology
          </a>
        </div>
      </div>
    </footer>
  );
}
