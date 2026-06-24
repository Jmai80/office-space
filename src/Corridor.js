import * as THREE from 'three'

export function createCorridor(length, depth, height) {
  const corridor = new THREE.Group()
  const material = new THREE.MeshStandardMaterial({ color: 0xb0a99f })
  const thickness = 0.2
  const wy = height / 2

  function makeWall(w, h, d, x, y, z) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
    wall.position.set(x, y, z)
    corridor.add(wall)
  }

  // bortre långväggen – parallell med dörrväggen, löper längs x
  makeWall(length, height, thickness, 0, wy, -depth)

  // gavlar i båda ändar – löper längs z
  makeWall(thickness, height, depth, -length / 2, wy, -depth / 2)
  makeWall(thickness, height, depth,  length / 2, wy, -depth / 2)

  return corridor
}