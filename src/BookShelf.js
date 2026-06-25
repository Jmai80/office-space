import * as THREE from 'three'

// ── Blueprint för en bokhylla ─────────────────────────────────────────
// Styrs av parametrar precis som Cabinet.js. Hyllplanen räknas ut från
// height; böckerna slumpas (se det inramade blocket längre ner).
export function createBookshelf({
  width  = 0.9,      // bredd (lokal x)
  height = 0.8,      // total höjd
  depth  = 0.3,      // djup (lokal z) – öppningen pekar mot +z
  color  = 0x6f4e37,
} = {}) {
  const shelf = new THREE.Group()

  const frameMat = new THREE.MeshStandardMaterial({ color })
  const t = 0.03     // tjocklek på sidor, topp, botten och hyllplan

  // ── Stommen ───────────────────────────────────────────────────────
  // två sidor
  const sideGeo = new THREE.BoxGeometry(t, height, depth)
  const left = new THREE.Mesh(sideGeo, frameMat)
  left.position.set(-width / 2 + t / 2, height / 2, 0)
  shelf.add(left)

  const right = new THREE.Mesh(sideGeo, frameMat)
  right.position.set(width / 2 - t / 2, height / 2, 0)
  shelf.add(right)

  // topp och botten
  const plankGeo = new THREE.BoxGeometry(width, t, depth)
  const bottom = new THREE.Mesh(plankGeo, frameMat)
  bottom.position.set(0, t / 2, 0)
  shelf.add(bottom)

  const top = new THREE.Mesh(plankGeo, frameMat)
  top.position.set(0, height - t / 2, 0)
  shelf.add(top)

  // baksida (tunn skiva längst bak)
  const back = new THREE.Mesh(new THREE.BoxGeometry(width, height, t), frameMat)
  back.position.set(0, height / 2, -depth / 2 + t / 2)
  shelf.add(back)

  // ── Hyllplan ──────────────────────────────────────────────────────
  // antal fack härleds ur höjden: ~ett fack per 35 cm, minst två
  const rowCount = Math.max(2, Math.round(height / 0.35))
  const innerBottom = t            // ovansidan av bottenskivan
  const innerTop    = height - t   // undersidan av toppskivan
  const cellH = (innerTop - innerBottom) / rowCount  // höjd per fack

  // ytorna där böcker står (fack 0 vilar på bottenskivan; övriga får ett hyllplan)
  const surfaceY = []
  for (let r = 0; r < rowCount; r++) {
    const y = innerBottom + r * cellH
    surfaceY.push(y)
    if (r > 0) {
      const board = new THREE.Mesh(plankGeo, frameMat)
      board.position.set(0, y - t / 2, 0)  // ovansidan hamnar exakt på y
      shelf.add(board)
    }
  }

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║   RANDOMISERADE BÖCKER   –   lek fritt med värdena här inne       ║
  // ╚══════════════════════════════════════════════════════════════════╝

  const rand = (min, max) => min + Math.random() * (max - min)  // slumptal

  // palett av bokryggsfärger – en plockas slumpvis per bok
  const bookColors = [0x8c3b3b, 0x3b5e8c, 0x4f7d4f, 0xb08a3e, 0x6f4e8c, 0xc46a3a]
  const bookMats = bookColors.map((c) => new THREE.MeshStandardMaterial({ color: c }))

  const innerWidth = width - 2 * t   // bredden böckerna delar på
  const margin = 0.02                // liten lucka in från sidorna

  // fyll varje fack med böcker, vänster → höger
  for (const y of surfaceY) {
    const maxBookH = cellH - t - 0.02            // får inte slå i hyllan ovanför
    let x = -innerWidth / 2 + margin             // börja vid vänsterkanten

    while (x < innerWidth / 2 - margin) {
      // slumpa den här bokens mått och färg
      const bookW = rand(0.025, 0.05)            // ryggens tjocklek
      const bookH = rand(maxBookH * 0.55, maxBookH)  // höjd (skalas med facket)
      const bookD = rand(depth * 0.6, depth * 0.8)   // hur djup boken är
      const mat   = bookMats[Math.floor(Math.random() * bookMats.length)]

      if (x + bookW > innerWidth / 2 - margin) break   // får inte plats → klar med facket

      const book = new THREE.Mesh(new THREE.BoxGeometry(bookW, bookH, bookD), mat)
      book.position.set(
        x + bookW / 2,                 // nästa lediga plats i sidled
        y + bookH / 2,                 // står på hyllytan
        depth / 2 - bookD / 2 - 0.01,  // skjuts fram mot öppningen, jämn framkant
      )
      shelf.add(book)

      // gå vidare; ibland en liten lucka (en "saknad" bok)
      x += bookW + (Math.random() < 0.15 ? rand(0.02, 0.05) : 0.004)
    }
  }

  // ╚═════════════════  slut på randomiserade böcker  ══════════════════╝

  // alla delar kastar skugga (du har ju skuggor påslagna)
  shelf.traverse((obj) => { if (obj.isMesh) obj.castShadow = true })

  return shelf
}