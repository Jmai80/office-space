import * as THREE from 'three'
export function createDesk({ monitor = true } = {}) {
  const desk = new THREE.Group()
  const wood  = new THREE.MeshStandardMaterial({ color: 0x6b4f3a })
  const metal = new THREE.MeshStandardMaterial({ color: 0x3a3a3a })

  const topW = 1.6, topD = 0.8, topH = 0.05, legH = 0.72

  // bordsskiva
  const top = new THREE.Mesh(new THREE.BoxGeometry(topW, topH, topD), wood)
  top.position.y = legH + topH / 2
  top.castShadow = true
  desk.add(top)

  // fyra ben
  const legGeo = new THREE.BoxGeometry(0.06, legH, 0.06)
  const inset = 0.08
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const leg = new THREE.Mesh(legGeo, metal)
      leg.position.set(sx * (topW / 2 - inset), legH / 2, sz * (topD / 2 - inset))
      desk.add(leg)
    }
  }

  // en skärm för lite kontorskänsla
  if (monitor) {
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.32, 0.04), metal)
    screen.position.set(0, legH + topH + 0.16, 0.15)
    desk.add(screen)
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.05), metal)
    stand.position.set(0, legH + topH + 0.04, 0.15)
    desk.add(stand)
  }

  return desk
}