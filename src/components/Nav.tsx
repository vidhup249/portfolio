import { useState } from "react"
import { motion, useMotionValueEvent, useScroll } from "motion/react"
import { HyperText } from "@/components/ui/hyper-text"
import { site } from "@/data/site"

export default function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 200)
  })

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav className="glass flex w-full max-w-3xl items-center justify-between gap-4 rounded-full py-2 pr-2 pl-5">
        <a href="#top" className="font-mono text-sm tracking-tight">
          <HyperText as="span" className="py-0 font-mono text-sm" duration={600}>
            {site.brand}
          </HyperText>
        </a>
        <ul className="hidden items-center gap-1 sm:flex">
          {site.nav.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          Let's talk
        </a>
      </nav>
    </motion.header>
  )
}
