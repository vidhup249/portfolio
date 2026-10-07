import { motion } from "motion/react"
import { MagicCard } from "@/components/ui/magic-card"
import { NumberTicker } from "@/components/ui/number-ticker"
import { Marquee } from "@/components/ui/marquee"
import { Particles } from "@/components/ui/particles"
import { services, stack, stats } from "@/data/site"

const ease = [0.2, 0.8, 0.2, 1] as const

const reveal = (i: number) => ({
  initial: { opacity: 0, y: 40, filter: "blur(10px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-10%" },
  transition: { duration: 1, ease, delay: i * 0.08 },
})

export default function Services() {
  return (
    <section id="services" data-section="Services" className="relative overflow-hidden py-32 md:py-48">
      <Particles className="absolute inset-0" quantity={120} ease={80} color="#ffffff" staticity={40} />
      <div aria-hidden className="absolute inset-x-0 top-[35%] h-[60%]">
        <div className="glow top-0 left-[5%] size-[32rem] bg-[#c6ff3d]/50" />
        <div className="glow top-[20%] left-[40%] size-[28rem] bg-[#22d3ee]/50 [animation-delay:-6s]" />
        <div className="glow top-[5%] right-[2%] size-[30rem] bg-[#a855f7]/50 [animation-delay:-12s]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-16 flex flex-col justify-between gap-6 md:mb-24 md:flex-row md:items-end">
          <motion.h2 {...reveal(0)} className="text-6xl font-semibold tracking-[-0.06em] md:text-[10rem] md:leading-[0.85]">
            What I <span className="font-serif font-normal text-white/40 italic">do</span>
          </motion.h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <motion.div key={s.no} {...reveal(i)}>
              <MagicCard
                className="glass h-full rounded-[1.75rem] [--color-background:rgb(10_10_10/0.35)] [--color-border:rgb(255_255_255/0.1)]"
                gradientColor="#ffffff"
                gradientOpacity={0.06}
                gradientFrom="#c6ff3d"
                gradientTo="#22d3ee"
                gradientSize={260}
              >
                <div className="flex h-full min-h-80 flex-col justify-between p-7">
                  <span className="font-mono text-xs text-white/40">{s.no}</span>
                  <div>
                    <h3 className="text-3xl font-medium tracking-[-0.04em]">{s.title}</h3>
                    <p className="mt-3 text-white/50">{s.body}</p>
                  </div>
                </div>
              </MagicCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...reveal(i)} className="glass rounded-[1.75rem] p-7">
              <div className="text-6xl font-semibold tracking-[-0.06em] md:text-8xl">
                <NumberTicker value={s.value} className="text-white" />
                <span className="font-serif font-normal text-white/40 italic">{s.suffix}</span>
              </div>
              <p className="mt-2 font-mono text-xs tracking-widest text-white/40 uppercase">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative mt-24 [mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]">
        <Marquee pauseOnHover className="[--duration:40s] [--gap:0.75rem]">
          {stack.map((t) => (
            <span key={t} className="glass rounded-full px-6 py-3 text-lg text-white/70">
              {t}
            </span>
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:45s] [--gap:0.75rem]">
          {[...stack].reverse().map((t) => (
            <span key={t} className="rounded-full border border-white/10 px-6 py-3 font-serif text-lg text-white/50 italic">
              {t}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
