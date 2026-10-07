import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import Orb from "@/components/shaders/Orb"
import { ShineBorder } from "@/components/ui/shine-border"
import { site } from "@/data/site"

const ease = [0.2, 0.8, 0.2, 1] as const

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(id)
  }, [copied])

  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(site.email).then(() => setCopied(true))}
      className="glass relative overflow-hidden rounded-full px-8 py-5 text-lg transition-transform hover:scale-[1.03] md:text-2xl"
    >
      <ShineBorder shineColor={["#c6ff3d", "#22d3ee", "#a855f7"]} borderWidth={1} />
      <span className="relative">{copied ? "Copied to clipboard ✓" : site.email}</span>
    </button>
  )
}

// Immersive closer: interactive shader orb behind oversized type.
export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.6, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1])

  return (
    <section id="contact" data-section="Contact" ref={ref} className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 py-32">
      <motion.div style={{ scale, opacity }} className="absolute inset-0 m-auto aspect-square w-[min(110vw,1000px)]">
        <Orb hue={40} hoverIntensity={0.4} rotateOnHover backgroundColor="#000000" />
      </motion.div>

      <div className="pointer-events-none relative z-10 flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 60, filter: "blur(16px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1.4, ease }}
          className="text-[18vw] leading-[0.8] font-semibold tracking-[-0.07em] mix-blend-difference md:text-[13vw]"
        >
          Let's <span className="font-serif font-normal italic">talk</span>
        </motion.h2>
        <div className="glass glass-thick pointer-events-auto mt-12 flex max-w-xl flex-col items-center gap-6 rounded-[2rem] px-6 py-8 md:px-12 md:py-10">
          <p className="max-w-md text-lg text-white/75">
            Have a project, a wild idea or just want to say hi? My inbox is always open.
          </p>
          <CopyEmail />
        </div>
      </div>
    </section>
  )
}
