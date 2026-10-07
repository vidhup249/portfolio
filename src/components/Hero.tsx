import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import Prism from "@/components/shaders/Prism"
import TechText from "@/components/ui/TechText"
import { site } from "@/data/site"

const ease = [0.2, 0.8, 0.2, 1] as const


// Each letter rises out of a mask.
function MaskedWord({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={`text-mask inline-flex ${className}`} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ y: "135%", rotate: 8 }}
          animate={{ y: "0%", rotate: 0 }}
          transition={{ duration: 1.1, ease, delay: delay + i * 0.05 }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  )
}

// Canvas wordmark half (React Bits TechText) laid over invisible real text, which
// keeps the layout and accessible name. The canvas box overhangs the text so
// TechText's auto-fit never shrinks it; the measured DOM baseline pins it in place.
const PAD_X = 0.1
const PAD_Y = 0.45

function TechWord({
  text,
  delay,
  className = "",
  fontFamily,
  fontWeight,
  fontStyle = "normal",
  color,
  sweep,
}: {
  text: string
  delay: number
  className?: string
  fontFamily: string
  fontWeight: number
  fontStyle?: string
  color: string
  sweep: boolean
}) {
  const textRef = useRef<HTMLSpanElement>(null)
  const markRef = useRef<HTMLSpanElement>(null)
  const [metrics, setMetrics] = useState<{ size: number; spacing: number; baseline: number } | null>(null)

  useEffect(() => {
    const el = textRef.current!
    const measure = () => {
      const h = el.offsetHeight
      const baselineY = markRef.current!.offsetTop
      const cs = getComputedStyle(el)
      const size = parseFloat(cs.fontSize)
      setMetrics({
        size,
        // Copy the real text's tracking so canvas glyphs land on the same spots.
        spacing: (parseFloat(cs.letterSpacing) || 0) / size,
        baseline: (baselineY + h * PAD_Y) / (h * (1 + PAD_Y * 2)),
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [])

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, y: "25%", filter: "blur(14px)" }}
      animate={{ opacity: 1, y: "0%", filter: "blur(0px)" }}
      transition={{ duration: 1.3, ease, delay }}
    >
      <span ref={textRef} aria-hidden className="invisible relative inline-block pb-[0.08em]">
        {text}
        <span ref={markRef} className="inline-block h-0 w-0 align-baseline" />
      </span>
      {metrics && (
        <TechText
          text={text}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          fontStyle={fontStyle}
          fontSize={metrics.size}
          letterSpacing={metrics.spacing}
          baseline={metrics.baseline}
          color={color}
          accentColor="#c6ff3d"
          strokeWidth={1.5}
          sweep={sweep}
          speed={0.8}
          style={{
            position: "absolute",
            left: `${-PAD_X * 100}%`,
            right: `${-PAD_X * 100}%`,
            top: `${-PAD_Y * 100}%`,
            bottom: `${-PAD_Y * 100}%`,
            width: "auto",
            height: "auto",
          }}
        />
      )}
    </motion.span>
  )
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const blur = useTransform(scrollYProgress, [0, 0.8], ["blur(0px)", "blur(12px)"])
  // One idle sweep across the wordmark; it pauses while either half is hovered.
  const [hovered, setHovered] = useState(false)

  return (
    <section id="top" ref={ref} className="relative h-svh min-h-[640px] overflow-hidden">
      <motion.div
        // Prism lives in the upper right so its bright base never sits behind the wordmark.
        className="absolute -top-[8%] -right-[25%] h-[65%] w-[150%] [mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_70%)] md:-top-[16%] md:-right-[6%] md:h-[95%] md:w-[72%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, delay: 0.4 }}
      >
        <Prism animationType="rotate" timeScale={0.4} scale={2.6} glow={1} bloom={1} noise={0} suspendWhenOffscreen />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black" />

      <motion.div
        style={{ y, scale, opacity, filter: blur }}
        className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-10 md:px-10 md:pb-14"
      >

        <h1 aria-label={site.brand} className="leading-[0.82] font-semibold tracking-[-0.06em]">
          <span className="block">
            <MaskedWord
              text={site.wordmark.prefix}
              delay={0.2}
              className="font-serif text-[10vw] font-normal tracking-[-0.02em] text-white/40 italic md:text-[6vw]"
            />
          </span>
          <span
            data-cursor
            className="block text-[17vw] whitespace-nowrap md:text-[14.5vw]"
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            <TechWord
              text={site.wordmark.main}
              delay={0.35}
              fontFamily='"Geist Variable", system-ui, sans-serif'
              fontWeight={600}
              color="#ffffff"
              sweep={!hovered}
            />
            <TechWord
              text={site.wordmark.accent}
              delay={0.6}
              className="font-serif font-normal tracking-[-0.03em] italic"
              fontFamily='"Instrument Serif", Georgia, serif'
              fontWeight={400}
              fontStyle="italic"
              color="rgba(255, 255, 255, 0.4)"
              sweep={false}
            />
          </span>
        </h1>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease, delay: 1.1 }}
            className="max-w-md text-lg leading-snug text-white/60 md:text-2xl"
          >
            {site.tagline}
          </motion.p>
          <motion.a
            href="#work"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="group flex items-center gap-3 font-mono text-xs tracking-widest text-white/50 uppercase"
          >
            Scroll to explore
            <span className="relative flex h-10 w-6 justify-center rounded-full border border-white/20">
              <motion.span
                className="mt-2 size-1 rounded-full bg-white"
                animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.a>
        </div>
      </motion.div>
    </section>
  )
}
