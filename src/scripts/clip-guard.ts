// Dev-only guard: warns when glyphs are actually being cut off.
// Display type (especially italic serifs) draws ink past its box, so two things clip it:
//   1. an overflow box tight around text (use `text-mask`, or `overflow-x-clip` for
//      sideways scrollers so ascenders/descenders stay visible)
//   2. bg-clip-text gradient text without padding (global.css adds it)
// Ink bounds come from canvas text metrics, so it checks drawn glyphs, not line boxes.
// Runs once the intro animations have settled; call window.__clipGuard() to rerun.

const TOLERANCE = 1 // px

type Box = { top: number; bottom: number; left: number; right: number }
type Problem = [string, Element]

const ctx = document.createElement("canvas").getContext("2d")!

function clips(cs: CSSStyleDeclaration) {
  return { x: cs.overflowX !== "visible", y: cs.overflowY !== "visible" }
}

// Nearest ancestor of `node` that clips overflow on either axis.
function clipParent(node: Node): Element | null {
  for (let el = node.parentElement; el; el = el.parentElement) {
    const c = clips(getComputedStyle(el))
    if (c.x || c.y) return el
  }
  return null
}

// Drawn-glyph bounds for a text node, one box per rendered line.
function inkBoxes(node: Text): { boxes: Box[]; singleLine: boolean } {
  const parent = node.parentElement!
  const cs = getComputedStyle(parent)
  let text = node.textContent ?? ""
  if (cs.textTransform === "uppercase") text = text.toUpperCase()
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
  if ("letterSpacing" in ctx) ctx.letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing
  const m = ctx.measureText(text.trim() || text)

  const range = document.createRange()
  range.selectNodeContents(node)
  const rects = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0)
  const fontHeight = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent
  const boxes = rects.map((r) => {
    const scale = fontHeight ? r.height / fontHeight : 1 // accounts for CSS transforms
    const baseline = r.top + m.fontBoundingBoxAscent * scale
    return {
      top: baseline - m.actualBoundingBoxAscent * scale,
      bottom: baseline + m.actualBoundingBoxDescent * scale,
      left: r.left - m.actualBoundingBoxLeft * scale,
      right: r.left + m.actualBoundingBoxRight * scale,
    }
  })
  return { boxes, singleLine: rects.length === 1 }
}

function check() {
  const problems: Problem[] = []
  const flagged = new Set<Element>()

  // 1. Gradient text: the gradient (and so the glyph) only exists inside the padding box.
  for (const el of document.body.querySelectorAll("*")) {
    const cs = getComputedStyle(el)
    const clipText = cs.backgroundClip === "text" || cs.getPropertyValue("-webkit-background-clip") === "text"
    if (!clipText || !el.textContent?.trim()) continue
    const need = parseFloat(cs.fontSize) * 0.1
    if (parseFloat(cs.paddingLeft) < need || parseFloat(cs.paddingRight) < need) {
      problems.push(["gradient text needs side padding (see .bg-clip-text in global.css)", el])
    }
  }

  // 2. Glyph ink that crosses the edge of its nearest clipping box.
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
    if (!n.textContent?.trim() || !n.parentElement) continue
    if (getComputedStyle(n.parentElement).visibility === "hidden") continue // layout-only copies
    const clip = clipParent(n)
    if (!clip || clip === document.body || clip === document.documentElement || flagged.has(clip)) continue

    const ccs = getComputedStyle(clip)
    const c = clips(ccs)
    const r = clip.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    const box: Box = {
      top: r.top + parseFloat(ccs.borderTopWidth),
      bottom: r.bottom - parseFloat(ccs.borderBottomWidth),
      left: r.left + parseFloat(ccs.borderLeftWidth),
      right: r.right - parseFloat(ccs.borderRightWidth),
    }
    // Sideways scrollers/marquees hide content horizontally on purpose.
    const scroller = clip.scrollWidth > clip.clientWidth + 1

    const { boxes, singleLine } = inkBoxes(n)
    for (const ink of boxes) {
      // Only judge text that is meant to be on screen inside this box.
      const overlapsX = ink.right > box.left && ink.left < box.right
      const overlapsY = ink.bottom > box.top && ink.top < box.bottom
      if (!overlapsX || !overlapsY) continue

      const cutY = c.y && (ink.top < box.top - TOLERANCE || ink.bottom > box.bottom + TOLERANCE)
      const cutX = c.x && !scroller && singleLine && (ink.left < box.left - TOLERANCE || ink.right > box.right + TOLERANCE)
      if (cutY || cutX) {
        problems.push([
          `"${n.textContent.trim().slice(0, 20)}" is cut ${cutY ? "top/bottom" : "left/right"} by an overflow clip; use text-mask${cutY ? " or overflow-x-clip" : ""}`,
          clip,
        ])
        flagged.add(clip)
        break
      }
    }
  }

  for (const [why, el] of problems) console.warn(`[clip-guard] ${why}`, el)
  if (!problems.length) console.info("[clip-guard] no clipped glyphs found")
  return problems.length
}

;(window as unknown as { __clipGuard: typeof check }).__clipGuard = check
const run = () => setTimeout(check, 4000)
if (document.readyState === "complete") run()
else addEventListener("load", run, { once: true })

export {}
