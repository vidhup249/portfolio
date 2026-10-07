// All site copy lives here. Edit this file to make the portfolio yours.

export const site = {
  brand: "The Brandsmith",
  // Hero and footer wordmark: "The" + "Brand" (sans) + "smith" (serif italic).
  wordmark: { prefix: "The", main: "Brand", accent: "smith" },
  role: "Creative Developer",
  tagline: "I build fast, tactile interfaces where motion, light and code meet.",
  location: "Kerala, India",
  timezone: "Asia/Kolkata",
  email: "hello@example.com",
  available: true,
  about:
    "I design and engineer digital products that feel alive. From WebGL shaders to pixel-perfect type, I care about every frame, every millisecond and every detail between them.",
  socials: [
    { label: "GitHub", href: "https://github.com/vidhup249" },
    { label: "LinkedIn", href: "#" },
    { label: "X / Twitter", href: "#" },
    { label: "Dribbble", href: "#" },
  ],
  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ],
}

export type Project = {
  title: string
  category: string
  year: string
  description: string
  tags: string[]
  href: string
  // Two colors for the generated cover art.
  hues: [string, string]
}

export const projects: Project[] = [
  {
    title: "Nebula OS",
    category: "Product Design · Web App",
    year: "2026",
    description: "A spatial dashboard for cloud infrastructure with real-time WebGL topology maps.",
    tags: ["React", "WebGL", "Rust"],
    href: "#",
    hues: ["#6d28d9", "#22d3ee"],
  },
  {
    title: "Monolith",
    category: "Brand · E-commerce",
    year: "2026",
    description: "Headless storefront for an architecture studio. Brutalist type, buttery transitions.",
    tags: ["Astro", "Shopify", "GSAP"],
    href: "#",
    hues: ["#f97316", "#e11d48"],
  },
  {
    title: "Echo",
    category: "AI · Mobile",
    year: "2025",
    description: "Voice-first journaling app with on-device transcription and reactive audio visuals.",
    tags: ["React Native", "Whisper", "Skia"],
    href: "#",
    hues: ["#c6ff3d", "#059669"],
  },
  {
    title: "Halcyon",
    category: "Immersive · Experience",
    year: "2025",
    description: "Scroll-driven 3D storytelling microsite for a sustainable energy launch.",
    tags: ["Three.js", "GLSL", "Lenis"],
    href: "#",
    hues: ["#3b82f6", "#a855f7"],
  },
]

export const services = [
  { no: "01", title: "Creative Development", body: "Interactive sites with WebGL, shaders and motion that hold 60fps." },
  { no: "02", title: "Product Engineering", body: "Typed, tested front-ends that scale from MVP to millions of users." },
  { no: "03", title: "Interface Design", body: "Minimal systems with sharp type, generous space and intent in every pixel." },
  { no: "04", title: "Motion Direction", body: "Micro-interactions and scroll choreography that give a brand its feel." },
]

export const stats = [
  { value: 7, suffix: "+", label: "Years shipping" },
  { value: 60, suffix: "+", label: "Projects launched" },
  { value: 24, suffix: "", label: "Awards & mentions" },
  { value: 99, suffix: "%", label: "Lighthouse average" },
]

export const stack = [
  "TypeScript", "React", "Astro", "Next.js", "Three.js", "GLSL", "WebGPU", "Motion",
  "GSAP", "Tailwind", "Node", "Rust", "Figma", "Blender", "PostgreSQL", "Vercel",
]
