import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"
import { BorderBeam } from "@/components/ui/border-beam"
import { projects, type Project } from "@/data/site"

const ease = [0.2, 0.8, 0.2, 1] as const

// Generated cover: drifting blurred blobs in the project's two colors, full-bleed behind the glass panel.
function Cover({ hues, index }: { hues: [string, string]; index: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <motion.div
        className="absolute -inset-1/4 opacity-90 blur-3xl"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${hues[0]}, transparent 45%), radial-gradient(circle at 70% 70%, ${hues[1]}, transparent 45%)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30 + index * 6, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
      <span className="absolute top-0 right-6 font-serif text-[10rem] leading-none text-white/90 italic mix-blend-overlay md:right-10 md:text-[18rem]">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  )
}

function Card({
  project,
  index,
  total,
  progress,
}: {
  project: Project
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const start = index / total
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - index) * 0.04])
  const dim = useTransform(progress, [start, Math.min(1, start + 1 / total)], [0, index === total - 1 ? 0 : 0.5])

  return (
    <div className="sticky top-0 flex h-svh items-center justify-center px-4 md:px-10">
      <motion.a
        href={project.href}
        data-cursor
        style={{ scale, top: `calc(${index * 24}px)` }}
        className="group relative flex h-[78svh] w-full max-w-[1400px] origin-top items-end overflow-hidden rounded-[2rem] border border-white/10 bg-black p-3 md:items-stretch md:p-4"
      >
        <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-[1.04]">
          <Cover hues={project.hues} index={index} />
        </div>
        <div className="glass glass-thick relative flex w-full flex-col justify-between gap-6 rounded-[1.5rem] p-5 md:w-[46%] md:p-8">
          {/* Dark tint keeps white text readable over bright covers. */}
          <div aria-hidden className="absolute inset-0 -z-10 rounded-[inherit] bg-black/35" />
          <div className="flex items-center justify-between font-mono text-xs tracking-widest text-white/40 uppercase">
            <span>{project.category}</span>
            <span>{project.year}</span>
          </div>
          <div>
            <h3 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl lg:text-8xl">{project.title}</h3>
            <p className="mt-4 max-w-sm text-white/70 md:text-lg">{project.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span key={t} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs text-white/75">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <span className="flex items-center gap-2 text-sm text-white/70 transition-colors group-hover:text-white">
            View case study
            <span className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
          </span>
        </div>
        <BorderBeam size={260} duration={10} delay={index * 2} colorFrom={project.hues[0]} colorTo={project.hues[1]} />
        <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-black" />
      </motion.a>
    </div>
  )
}

export default function Work() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })

  return (
    <section id="work" data-section="Work" className="relative pt-32">
      <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-6 px-5 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease }}
          className="text-6xl font-semibold tracking-[-0.06em] md:text-[10rem] md:leading-[0.85]"
        >
          Selected <span className="font-serif font-normal text-white/40 italic">work</span>
        </motion.h2>
      </div>
      <div ref={ref}>
        {projects.map((p, i) => (
          <Card key={p.title} project={p} index={i} total={projects.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  )
}
