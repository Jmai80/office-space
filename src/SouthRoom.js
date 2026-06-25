import * as THREE from 'three'
import { createBookshelf } from './BookShelf.js'
import { createCabinet } from './Cabinet.js'
import { createPlant } from './Plant.js'
import { createDesk } from './Desk.js'

// Södra rummet. Origo i rummets mitt; placeras med set(0, 0, 14) i main.js.
export function createSouthRoom() {
  const room = new THREE.Group()

  // hyllor och skåp längs bortre väggen (framsidan in mot rummet, −z)
  const tallShelf = createBookshelf({ height: 2.5, width: 1.5 })
  tallShelf.position.set(14, 0, 5.7)
  tallShelf.rotation.y = Math.PI
  room.add(tallShelf)

  const shelf2 = createBookshelf({ height: 1.85, width: 1.4, depth: 0.45, color: 0x8a5a2b })
  shelf2.position.set(18, 0, 5.7)
  shelf2.rotation.y = Math.PI
  room.add(shelf2)

  const cabinet = createCabinet({ width: 1.6, height: 0.85, color: 0x6f4e37 })
  cabinet.position.set(16, 0, 5.7)
  cabinet.rotation.y = -Math.PI
  room.add(cabinet)

  const shelf4 = createBookshelf({ height: 1.85, width: 1.4, depth: 0.45, color: 0x8a5a2b })
  shelf4.position.set(2, 0, 5.7)
  shelf4.rotation.y = -Math.PI
  room.add(shelf4)

  // bokhylla längs östra väggen (framsidan in mot rummet, −x)
  const shelf3 = createBookshelf({ height: 1.85, width: 1.4, depth: 0.45, color: 0x8a5a2b })
  shelf3.position.set(19.7, 0, 1.7)
  shelf3.rotation.y = -Math.PI / 2
  room.add(shelf3)

  const plantByShelf = createPlant()
  plantByShelf.position.set(4, 0, 5.7)
  room.add(plantByShelf)

  const cornerPlant = createPlant()
  cornerPlant.position.set(-18, 0, 4) // sydvästra hörnet
  room.add(cornerPlant)

  // skrivbordet vid norra väggen (framsidan mot rummet, +z)
  const desk = createDesk()
  desk.position.set(0, 0, -5.7)
  room.add(desk)

  return room
}