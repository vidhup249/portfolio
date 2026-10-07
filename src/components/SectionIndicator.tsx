import { useEffect, useState } from "react"
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react"
import { HyperText } from "@/components/ui/hyper-text"

type Active = { index: number; label: string; el: HTMLElement }

// One fixed corner readout instead of a label at the top of every section.
// Tracks whichever [data-section] crosses the middle of the viewport and
// scrambles to its name (Magic UI HyperText) when it changes.
export default function SectionIndicator() {
  const [active, setActive] = useState<Active | null>(null)

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-section]")]
    const visible = new Set<HTMLElement>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target as HTMLElement)
          else visible.delete(e.target as HTMLElement)
        }
        const el = sections.find((s) => visible.has(s))
        setActive(el ? { index: sections.indexOf(el) + 1, label: el.dataset.section!, el } : null)
      },
      // A section counts as current while it covers the vertical middle of the screen.
      { rootMargin: "-50% 0px -50% 0px" }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="pointer-events-none fixed bottom-6 left-5 z-40 flex items-center gap-3 font-mono text-[11px] text-white mix-blend-difference md:bottom-8 md:left-10"
        >
          <span className="tabular-nums">{String(active.index).padStart(2, "0")}</span>
          <Progress el={active.el} />
          <HyperText key={active.label} as="span" duration={500} className="py-0 font-mono text-[11px] font-normal tracking-[0.2em]">
            {active.label}
          </HyperText>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Thin line that fills as you move through the current section.
function Progress({ el }: { el: HTMLElement }) {
  const { scrollYProgress } = useScroll({ target: { current: el }, offset: ["start end", "end start"] })
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  return (
    <span className="relative h-px w-10 overflow-hidden bg-white/25 md:w-14">
      <motion.span style={{ scaleX }} className="absolute inset-0 origin-left bg-white" />
    </span>
  )
}
