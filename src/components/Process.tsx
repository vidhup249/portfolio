import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import Aurora from "@/components/shaders/Aurora"

const steps = [
  { no: "01", title: "Discover", body: "Workshops, research and teardown. We find the one idea worth building around." },
  { no: "02", title: "Design", body: "Type, grid and motion language, prototyped in the browser, not in slides." },
  { no: "03", title: "Build", body: "Typed components, shaders and performance budgets. 60fps or it does not ship." },
  { no: "04", title: "Launch", body: "Analytics, accessibility audits and a handover your team will enjoy." },
]

// Vertical scroll px spent per px of sideways travel. Below 1 = the track moves
// faster than you scroll, so the section finishes sooner.
const SCROLL_RATIO = 0.6

// Immersive horizontal scroll: vertical scroll drives a sideways track.
export default function Process() {
  const ref = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  // How far the track must slide so its last step ends at the right edge.
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const track = trackRef.current!
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    addEventListener("resize", measure)
    document.fonts?.ready.then(measure)
    return () => {
      ro.disconnect()
      removeEventListener("resize", measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section
      ref={ref}
      id="process"
      data-section="Process"
      className="relative"
      // Section height = one screen + the sideways travel, so it ends exactly on the last step.
      style={{ height: distance ? `calc(100svh + ${Math.round(distance * SCROLL_RATIO)}px)` : "220vh" }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[60%] opacity-60 [mask-image:linear-gradient(to_bottom,transparent,#000_35%)]">
          <Aurora colorStops={["#1e1b4b", "#c6ff3d", "#0e7490"]} amplitude={0.8} blend={0.6} speed={0.6} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/60 to-black" />

        <div className="relative z-10 flex h-full flex-col justify-between pt-28 pb-10">
          <div className="flex items-center justify-end px-5 md:px-10">
            <div className="h-px w-40 bg-white/10 md:w-72">
              <motion.div style={{ width: bar }} className="h-full bg-white" />
            </div>
          </div>

          <motion.div ref={trackRef} style={{ x }} className="flex w-max flex-1 items-center gap-[6vw] px-5 md:gap-[7vw] md:px-10">
            {steps.map((s) => (
              <div key={s.no} className="flex w-[85vw] shrink-0 flex-col items-start justify-center md:w-auto md:flex-row md:items-center">
                {/* Solid gradient numeral so the glass panel frosts over real color. */}
                <span className="bg-gradient-to-br from-[#c6ff3d] via-[#22d3ee] to-[#a855f7] bg-clip-text font-serif text-[48vw] leading-[0.85] text-transparent italic md:text-[22vw]">
                  {s.no}
                </span>
                <div className="glass glass-thick relative -mt-[13.5vw] w-full max-w-md rounded-[1.75rem] p-6 md:mt-0 md:-ml-[3.25vw] md:w-[28rem] md:p-10">
                  <h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{s.title}</h3>
                  <p className="mt-4 text-lg text-white/70 md:text-xl">{s.body}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
