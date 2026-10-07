import { TextReveal } from "@/components/ui/text-reveal"
import { site } from "@/data/site"

export default function About() {
  return (
    <section id="about" data-section="About" className="relative">
      <TextReveal>{site.about}</TextReveal>
    </section>
  )
}
