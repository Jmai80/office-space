import * as THREE from 'three'

export function createPlant() {
  const plant = new THREE.Group()

  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.13, 0.3, 16),
    new THREE.MeshStandardMaterial({ color: 0xb5651d })
  )
  pot.position.y = 0.15
  plant.add(pot)

  const soil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.04, 16),
    new THREE.MeshStandardMaterial({ color: 0x3b2a1a })
  )
  soil.position.y = 0.3
  plant.add(soil)

  const leafMat = new THREE.MeshStandardMaterial({ color: 0x3f7d3a })
  for (const [x, y, z, r] of [
    [0, 0.55, 0, 0.22], [0.12, 0.7, 0.05, 0.18],
    [-0.1, 0.72, -0.06, 0.16], [0.02, 0.85, 0.02, 0.14],
  ]) {
    const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), leafMat)
    leaf.position.set(x, y, z)
    plant.add(leaf)
  }

  return plant
}