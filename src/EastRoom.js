import * as THREE from 'three'
import { createPlant } from './Plant.js'

// Östra rummet. Origo i rummets mitt; placeras med set(14, 0, 0) i main.js.
// Ännu glest möblerat – mest plats kvar att fylla.
export function createEastRoom() {
  const room = new THREE.Group()

  const plant = createPlant()
  plant.position.set(4.5, 0, -6.5) // bortre hörnet
  room.add(plant)

  return room
}