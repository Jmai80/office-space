import * as THREE from 'three'

export function createLaptop() {
  const laptop = new THREE.Group()
  const body    = new THREE.MeshStandardMaterial({ color: 0x9a9a9a })
  const display = new THREE.MeshStandardMaterial({ color: 0x223044 })

  // underdel (tangentbord)
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.02, 0.22), body)
  base.position.y = 0.01
  laptop.add(base)

  // skärm på ett gångjärn vid bakkanten
  const hinge = new THREE.Group()
  hinge.position.set(0, 0.02, -0.11)
  laptop.add(hinge)

  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.2, 0.012), body)
  screen.position.y = 0.1
  hinge.add(screen)

  const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.16), display)
  glass.position.set(0, 0.1, 0.007)
  hinge.add(glass)

  hinge.rotation.x = -0.4 // lutar skärmen bakåt = öppen

  return laptop
}