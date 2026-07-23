import { useState } from "react"
import { ArrowUpRight, Award, Crown, X } from "lucide-react"

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4"

const NAV_LINKS = ["Projects", "Studio", "Offerings", "Inquire"]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative h-screen w-full overflow-hidden font-inter">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src={VIDEO_URL}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col h-full text-white">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 lg:py-7">
          {/* Brand */}
          <span className="font-podium text-2xl sm:text-3xl tracking-wider uppercase">
            VANGUARD
          </span>

          {/* Center links — hidden below md */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="font-inter text-sm text-white/80 hover:text-white tracking-widest uppercase transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right — desktop */}
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-2 border border-white/30 hover:border-white/60 px-6 py-3 text-xs tracking-widest uppercase hover:bg-white/10 transition-all"
          >
            GET IN TOUCH
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Hamburger — below md */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex flex-col items-end space-y-1.5"
            aria-label="Open menu"
          >
            <span className="block w-6 h-0.5 bg-white rounded" />
            <span className="block w-6 h-0.5 bg-white rounded" />
            <span className="block w-4 h-0.5 bg-white rounded" />
          </button>
        </nav>

        {/* Hero Content — vertically centered */}
        <div className="flex-1 flex items-center px-6 sm:px-10 lg:px-16 pb-12 sm:pb-16 lg:pb-20">
          <div className="w-full">
            {/* Tagline */}
            <div className="animate-fade-up flex items-center gap-2 mb-6 lg:mb-8">
              <Crown className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-xs sm:text-sm font-inter tracking-[0.3em] uppercase">
                World-Class Digital Collective
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="animate-fade-up-delay-1 font-podium text-white uppercase leading-[0.92] tracking-tight">
              <span className="block text-[clamp(2.8rem,8vw,7rem)]">Design.</span>
              <span className="block text-[clamp(2.8rem,8vw,7rem)]">Disrupt.</span>
              <span className="block text-[clamp(2.8rem,8vw,7rem)]">Conquer.</span>
            </h1>

            {/* Subtext */}
            <p className="animate-fade-up-delay-2 text-white/70 text-sm sm:text-base font-inter leading-relaxed max-w-md mt-6 lg:mt-8">
              We build fierce brand identities<br />
              that don't just turn heads —&nbsp;
              <strong className="text-white font-semibold">they lead.</strong>
            </p>

            {/* CTA Row */}
            <div className="animate-fade-up-delay-3 mt-8 lg:mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href="#"
                className="group inline-flex items-center gap-2 bg-black hover:bg-neutral-900 px-5 sm:px-7 py-3 sm:py-4 text-[11px] sm:text-xs tracking-widest uppercase transition-colors"
              >
                SEE OUR WORK
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <div className="hidden sm:flex items-center gap-3">
                <Award className="w-8 h-8 text-white/50" />
                <div>
                  <p className="text-white/60 text-xs tracking-wider uppercase leading-tight">Top-Rated</p>
                  <p className="text-white/60 text-xs tracking-wider uppercase leading-tight">Brand Studio</p>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="animate-fade-up-delay-4 mt-8 sm:mt-10 lg:mt-14 flex flex-wrap gap-6 sm:gap-12 lg:gap-16">
              <div>
                <p className="font-inter text-white text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  250+
                </p>
                <p className="text-white/50 text-[9px] sm:text-xs tracking-widest uppercase mt-1">
                  Brands Transformed
                </p>
              </div>
              <div>
                <p className="font-inter text-white text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  95%
                </p>
                <p className="text-white/50 text-[9px] sm:text-xs tracking-widest uppercase mt-1">
                  Client Retention
                </p>
              </div>
              <div>
                <p className="font-inter text-white text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  10+
                </p>
                <p className="text-white/50 text-[9px] sm:text-xs tracking-widest uppercase mt-1">
                  Years in the Game
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm transition-all duration-500 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col h-full px-6 sm:px-10 py-5 lg:py-7">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <span className="font-podium text-2xl sm:text-3xl tracking-wider uppercase text-white">
              VANGUARD
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Centered nav links */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8 sm:gap-10">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link}
                href="#"
                onClick={() => setMenuOpen(false)}
                className="font-podium text-4xl sm:text-5xl text-white uppercase hover:text-white/70 transition-colors"
                style={{
                  transitionDelay: menuOpen ? `${i * 80 + 100}ms` : "0ms",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                  transitionProperty: "opacity, transform",
                  transitionDuration: "0.5s",
                }}
              >
                {link}
              </a>
            ))}

            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 px-6 py-3 text-xs tracking-widest uppercase hover:bg-white/10 transition-colors"
              style={{
                transitionDelay: menuOpen ? `${NAV_LINKS.length * 80 + 100}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transitionProperty: "opacity, transform",
                transitionDuration: "0.5s",
              }}
            >
              GET IN TOUCH
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
