import * as THREE from 'three'
import { createCabinet } from './Cabinet.js'
import { createPlant } from './Plant.js'

// Rum 1 – det mittersta rummet där spelaren börjar.
// Origo ligger redan i världens mitt, så main.js placerar det på (0, 0, 0).
export function createCenterRoom() {
  const room = new THREE.Group()

  const eastCabinet = createCabinet({ width: 1.6, height: 0.85, color: 0x6f4e37 })
  eastCabinet.position.set(5.5, 0, 0)
  eastCabinet.rotation.y = -Math.PI / 2 // framsidan in mot rummet (−x)
  room.add(eastCabinet)

  const westCabinet = createCabinet({ width: 1.6, height: 1.85, color: 0x4f4e37 })
  westCabinet.position.set(-5.5, 0, 0.5)
  westCabinet.rotation.y = Math.PI / 2 // framsidan in mot rummet (+x)
  room.add(westCabinet)

  const plant = createPlant()
  plant.position.set(4.5, 0, 4.5) // bortre hörnet
  room.add(plant)

  return room
}