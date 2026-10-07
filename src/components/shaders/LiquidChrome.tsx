// Liquid Chrome — React Bits. Local changes: darkest areas resolve to pure #000
// (only highlights glow), mouse ripples track the window so overlaid content
// does not block them, rendering pauses off-screen, transparent canvas.

import React, { useRef, useEffect } from "react"
import { Renderer, Program, Mesh, Triangle } from "ogl"

interface LiquidChromeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Pass a stable (module-level) array: a new array each render rebuilds the scene. */
  baseColor?: [number, number, number]
  speed?: number
  amplitude?: number
  frequencyX?: number
  frequencyY?: number
  interactive?: boolean
}

const DEFAULT_COLOR: [number, number, number] = [0.1, 0.1, 0.1]

export const LiquidChrome: React.FC<LiquidChromeProps> = ({
  baseColor = DEFAULT_COLOR,
  speed = 0.2,
  amplitude = 0.3,
  frequencyX = 3,
  frequencyY = 3,
  interactive = true,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const renderer = new Renderer({ antialias: true, alpha: true })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)

    const vertexShader = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform float uTime;
      uniform vec3 uResolution;
      uniform vec3 uBaseColor;
      uniform float uAmplitude;
      uniform float uFrequencyX;
      uniform float uFrequencyY;
      uniform vec2 uMouse;
      varying vec2 vUv;

      vec4 renderImage(vec2 uvCoord) {
          vec2 fragCoord = uvCoord * uResolution.xy;
          vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

          for (float i = 1.0; i < 10.0; i++){
              uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
              uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
          }

          vec2 diff = (uvCoord - uMouse);
          float dist = length(diff);
          float falloff = exp(-dist * 20.0);
          float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03;
          uv += (diff / (dist + 0.0001)) * ripple * falloff;

          // Subtract the floor so the troughs are true black; only highlights remain.
          vec3 color = max(uBaseColor / abs(sin(uTime - uv.y - uv.x)) - uBaseColor, 0.0);
          return vec4(color, 1.0);
      }

      void main() {
          vec4 col = vec4(0.0);
          for (int i = -1; i <= 1; i++){
              for (int j = -1; j <= 1; j++){
                  vec2 offset = vec2(float(i), float(j)) * (1.0 / min(uResolution.x, uResolution.y));
                  col += renderImage(vUv + offset);
              }
          }
          gl_FragColor = col / 9.0;
      }
    `

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new Float32Array([gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height]),
        },
        uBaseColor: { value: new Float32Array(baseColor) },
        uAmplitude: { value: amplitude },
        uFrequencyX: { value: frequencyX },
        uFrequencyY: { value: frequencyY },
        uMouse: { value: new Float32Array([0, 0]) },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })

    function resize() {
      renderer.setSize(container.offsetWidth, container.offsetHeight)
      const resUniform = program.uniforms.uResolution.value as Float32Array
      resUniform[0] = gl.canvas.width
      resUniform[1] = gl.canvas.height
      resUniform[2] = gl.canvas.width / gl.canvas.height
    }
    window.addEventListener("resize", resize)
    resize()

    function setMouse(clientX: number, clientY: number) {
      const rect = container.getBoundingClientRect()
      const mouseUniform = program.uniforms.uMouse.value as Float32Array
      mouseUniform[0] = (clientX - rect.left) / rect.width
      mouseUniform[1] = 1 - (clientY - rect.top) / rect.height
    }
    const handleMouseMove = (e: MouseEvent) => setMouse(e.clientX, e.clientY)
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) setMouse(e.touches[0].clientX, e.touches[0].clientY)
    }
    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true })
      window.addEventListener("touchmove", handleTouchMove, { passive: true })
    }

    // Only render while on screen.
    let visible = true
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(container)

    let animationId: number
    function update(t: number) {
      animationId = requestAnimationFrame(update)
      if (!visible) return
      program.uniforms.uTime.value = t * 0.001 * speed
      renderer.render({ scene: mesh })
    }
    animationId = requestAnimationFrame(update)

    container.appendChild(gl.canvas)

    return () => {
      cancelAnimationFrame(animationId)
      io.disconnect()
      window.removeEventListener("resize", resize)
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("touchmove", handleTouchMove)
      }
      if (gl.canvas.parentElement) gl.canvas.parentElement.removeChild(gl.canvas)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [baseColor, speed, amplitude, frequencyX, frequencyY, interactive])

  return <div ref={containerRef} className="h-full w-full" {...props} />
}

export default LiquidChrome
