import * as THREE from 'three'

export function createChair() {
  const chair = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: 0x2e3338 })
  const seatH = 0.45

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.05, 0.45), mat)
  seat.position.y = seatH
  chair.add(seat)

  const back = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.5, 0.05), mat)
  back.position.set(0, seatH + 0.25, -0.2)
  chair.add(back)

  const legGeo = new THREE.BoxGeometry(0.05, seatH, 0.05)
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const leg = new THREE.Mesh(legGeo, mat)
      leg.position.set(sx * 0.185, seatH / 2, sz * 0.185)
      chair.add(leg)
    }
  }

  return chair
}