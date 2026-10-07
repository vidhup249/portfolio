import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity"

const words = ["Design", "Develop", "Animate", "Ship"]

export default function Velocity() {
  return (
    <ScrollVelocityContainer className="border-y border-white/10 py-8 md:py-12">
      <ScrollVelocityRow baseVelocity={3} direction={1} className="py-1">
        {words.map((w) => (
          <span key={w} className="mx-6 inline-flex items-center gap-12 text-7xl font-semibold tracking-[-0.05em] md:text-[9rem]">
            {w}
            <span className="font-serif text-6xl text-white/30 italic md:text-8xl">✦</span>
          </span>
        ))}
      </ScrollVelocityRow>
      <ScrollVelocityRow baseVelocity={3} direction={-1} className="py-1">
        {words.map((w) => (
          <span key={w} className="text-outline mx-6 inline-flex items-center gap-12 font-serif text-7xl italic md:text-[9rem]">
            {w}
            <span className="font-sans text-6xl not-italic md:text-8xl">—</span>
          </span>
        ))}
      </ScrollVelocityRow>
    </ScrollVelocityContainer>
  )
}
