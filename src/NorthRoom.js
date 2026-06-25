import * as THREE from 'three'
import { createDesk } from './Desk.js'
import { createMirror } from './Mirror.js'
import { createCabinet } from './Cabinet.js'
import { createLamp } from './Lamp.js'
import { createPlant } from './Plant.js'

// Norra rummet. Byggs kring sin egen origo (rummets mitt);
// placeras i världen från main.js med set(0, 0, -14).
export function createNorthRoom() {
  const room = new THREE.Group()

  const desk = createDesk()
  desk.position.set(-4, 0, -1)
  room.add(desk)

  const mirror = createMirror(2.4, 2.2)
  mirror.position.set(0, 1.25, -5.88) // platt mot bortre väggen
  room.add(mirror)

  const cabinet = createCabinet({ width: 1.6, height: 0.85, color: 0x6f4e37 })
  cabinet.position.set(4.5, 0, 5.5)
  cabinet.rotation.y = -Math.PI // framsidan in mot rummet (−z)
  room.add(cabinet)

  const lamp = createLamp()
  lamp.position.set(2, 0, 5.5)
  room.add(lamp)

  const plant = createPlant()
  plant.position.set(18, 0, -4) // nordöstra hörnet
  room.add(plant)

  return room
}