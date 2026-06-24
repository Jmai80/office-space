import * as THREE from 'three'

export function createRoom(width, depth, height) {
  const room = new THREE.Group()
  const material = new THREE.MeshStandardMaterial({ color: 0xb0a99f })
  const thickness = 0.2

  function makeWall(w, h, d, x, y, z) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
    wall.position.set(x, y, z)
    room.add(wall)
  }

  const wy = height / 2

  // tre hela väggar
  makeWall(width, height, thickness, 0, wy, depth / 2)    // främre
  makeWall(thickness, height, depth, -width / 2, wy, 0)   // vänster
  makeWall(thickness, height, depth, width / 2, wy, 0)    // höger

  // bakre vägg med dörröppning (rakt fram när du startar)
  const doorWidth = 1.2
  const doorHeight = 2.2
  const sideWidth = (width - doorWidth) / 2

  makeWall(sideWidth, height, thickness, -(doorWidth / 2 + sideWidth / 2), wy, -depth / 2)  // vänster om dörren
  makeWall(sideWidth, height, thickness, doorWidth / 2 + sideWidth / 2, wy, -depth / 2)     // höger om dörren
  makeWall(doorWidth, height - doorHeight, thickness, 0, doorHeight + (height - doorHeight) / 2, -depth / 2)  // överstycke

  return room
}