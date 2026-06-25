import * as THREE from 'three'
import { createDesk } from './Desk.js'
import { createLaptop } from './Laptop.js'
import { createChair } from './Chair.js'
import { createLamp } from './Lamp.js'
import { createPlant } from './Plant.js'

// Västra rummet. Origo i rummets mitt; placeras med set(-14, 0, 0) i main.js.
export function createWestRoom() {
  const room = new THREE.Group()

  const desk = createDesk({ monitor: false })
  desk.position.set(0, 0, -4)
  room.add(desk)

  const laptop = createLaptop()
  laptop.position.set(0, 0.77, -3.9) // ovanpå skivan
  room.add(laptop)

  const chair = createChair()
  chair.position.set(0, 0, -2.9)
  chair.rotation.y = Math.PI // tittar mot skrivbordet
  room.add(chair)

  const deskLamp = createLamp({ height: 0.7 })
  deskLamp.position.set(-0.5, 0.75, -4) // bordslampa på skivan
  room.add(deskLamp)

  const floorLamp = createLamp()
  floorLamp.position.set(5.5, 0, -1)
  room.add(floorLamp)

  const plant = createPlant()
  plant.position.set(-5, 0, 7) // hörnet närmast söder
  room.add(plant)

  return room
}