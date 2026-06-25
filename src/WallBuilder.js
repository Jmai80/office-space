import * as THREE from 'three'

const THICKNESS = 0.2
const DOOR_HEIGHT = 2.1 // dörröppningens höjd; allt däröver blir överstycke

// wallSpecs: lista av { x1, z1, x2, z2, doors?, material? }
// varje vägg är axelriktad: z1===z2 (löper längs x) eller x1===x2 (löper längs z)
// doors: [{ at, width }] där `at` är dörrens mittpunkt längs väggen
export function buildWalls(wallSpecs, height, defaultMaterial) {
  const group = new THREE.Group()

  for (const spec of wallSpecs) {
    const horizontal = spec.z1 === spec.z2
    const material = spec.material || defaultMaterial
    const from = horizontal ? Math.min(spec.x1, spec.x2) : Math.min(spec.z1, spec.z2)
    const to   = horizontal ? Math.max(spec.x1, spec.x2) : Math.max(spec.z1, spec.z2)

    const doors = (spec.doors || []).slice().sort((a, b) => a.at - b.at)

    // 1) solida segment mellan dörröppningarna – fulla höjden
    let cursor = from
    const segments = []
    for (const door of doors) {
      const gapStart = door.at - door.width / 2
      if (gapStart > cursor) segments.push([cursor, gapStart])
      cursor = door.at + door.width / 2
    }
    if (to > cursor) segments.push([cursor, to])

    for (const [start, end] of segments) {
      const span = end - start
      const mid = (start + end) / 2
      const geometry = horizontal
        ? new THREE.BoxGeometry(span, height, THICKNESS)
        : new THREE.BoxGeometry(THICKNESS, height, span)
      const wall = new THREE.Mesh(geometry, material)
      wall.position.set(
        horizontal ? mid : spec.x1,
        height / 2,
        horizontal ? spec.z1 : mid
      )
      group.add(wall)
    }

    // 2) överstycke ovanför varje dörr – från DOOR_HEIGHT upp till height
    const lintelHeight = height - DOOR_HEIGHT
    if (lintelHeight > 0) {
      for (const door of doors) {
        const geometry = horizontal
          ? new THREE.BoxGeometry(door.width, lintelHeight, THICKNESS)
          : new THREE.BoxGeometry(THICKNESS, lintelHeight, door.width)
        const lintel = new THREE.Mesh(geometry, material)
        lintel.position.set(
          horizontal ? door.at : spec.x1,
          DOOR_HEIGHT + lintelHeight / 2,
          horizontal ? spec.z1 : door.at
        )
        group.add(lintel)
      }
    }
  }

  return group
}