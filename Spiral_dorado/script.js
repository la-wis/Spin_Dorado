// ============================================
// CONFIGURACIÓN - Modifica estos valores
// ============================================
const CONFIG = {
  SPIRAL_THICKNESS: 5, // Grosor de las líneas (1-5)
  ANIMATION_SPEED: 0.2, // Velocidad de expansión (0.01-0.2)
  SPIRAL_LIFETIME:4000, // Tiempo de vida del espiral en ms (2000-8000)
  FADE_OUT_TIME: 500, // Tiempo de desvanecimiento en ms (500-2000)
  TURNS: 10000, // Número de vueltas del espiral
}

// ============================================
// CANVAS Y CONTEXTO
// ============================================
const canvas = document.getElementById("spiralCanvas")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let spirals = []
let animationId = null

// ============================================
// CLASE ESPIRAL
// ============================================
class Spiral {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.radius = 0
    this.maxRadius = 200
    this.angle = 0
    this.createdAt = Date.now()
    this.lifespan = CONFIG.SPIRAL_LIFETIME
    this.points = []
    this.rotation = Math.random() * Math.PI * 2
  }

  update() {
    const now = Date.now()
    const elapsed = now - this.createdAt
    const progress = elapsed / this.lifespan

    // Expandir el espiral
    this.radius = progress * this.maxRadius

    // Generar puntos del espiral usando ecuación de Arquímedes
    this.points = []
    for (let i = 0; i < 360; i += 2) {
      const angle = (i * Math.PI) / 180 + this.rotation
      const t = (i / 360) * CONFIG.TURNS * Math.PI * 2
      const r = (t / (CONFIG.TURNS * Math.PI * 2)) * this.radius

      const px = this.x + r * Math.cos(angle)
      const py = this.y + r * Math.sin(angle)

      this.points.push({ x: px, y: py })
    }

    // Retorna true si el espiral sigue vivo
    return progress < 1
  }

  draw() {
    const now = Date.now()
    const elapsed = now - this.createdAt
    const progress = elapsed / this.lifespan

    let opacity = 1
    if (progress > (this.lifespan - CONFIG.FADE_OUT_TIME) / this.lifespan) {
      const fadeProgress =
        (progress - (this.lifespan - CONFIG.FADE_OUT_TIME) / this.lifespan) / (CONFIG.FADE_OUT_TIME / this.lifespan)
      opacity = 1 - fadeProgress
    }

    // Dibujar el espiral
    ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * 0.8})`
    ctx.shadowColor = `rgba(212, 175, 55, ${opacity * 0.6})`
    ctx.shadowBlur = 15
    ctx.lineWidth = CONFIG.SPIRAL_THICKNESS
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    ctx.beginPath()
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i]
      if (i === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    }
    ctx.stroke()

    ctx.fillStyle = `rgba(212, 175, 55, ${opacity})`
    ctx.shadowColor = `rgba(212, 175, 55, ${opacity * 0.8})`
    ctx.shadowBlur = 20
    ctx.beginPath()
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.shadowBlur = 0
  }
}

// ============================================
// MANEJO DE EVENTOS
// ============================================
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  spirals.push(new Spiral(x, y))
})

// Redimensionar canvas al cambiar tamaño de ventana
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

// ============================================
// ANIMACIÓN
// ============================================
function animate() {
  // Limpiar canvas
  ctx.fillStyle = "rgba(26, 26, 46, 0.2)"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  spirals = spirals.filter((spiral) => {
    const isAlive = spiral.update()
    spiral.draw()
    return isAlive
  })

  animationId = requestAnimationFrame(animate)
}

// Iniciar animación
animate()
