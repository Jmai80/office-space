import * as THREE from 'three'

const THICKNESS = 0.2

// wallSpecs: lista av { x1, z1, x2, z2, doors? }
// varje vägg är axelriktad: z1===z2 (löper längs x) eller x1===x2 (löper längs z)
// doors: [{ at, width }] där `at` är dörrens mittpunkt längs väggen
export function buildWalls(wallSpecs, height, defaultMaterial) {
  const group = new THREE.Group()

  for (const spec of wallSpecs) {
    const horizontal = spec.z1 === spec.z2
    const from = horizontal ? Math.min(spec.x1, spec.x2) : Math.min(spec.z1, spec.z2)
    const to   = horizontal ? Math.max(spec.x1, spec.x2) : Math.max(spec.z1, spec.z2)

    // klipp ut solida segment mellan dörröppningarna
    const doors = (spec.doors || []).slice().sort((a, b) => a.at - b.at)
    let cursor = from
    const segments = []
    for (const door of doors) {
      const gapStart = door.at - door.width / 2
      if (gapStart > cursor) segments.push([cursor, gapStart])
      cursor = door.at + door.width / 2
    }
    if (to > cursor) segments.push([cursor, to])

    // en låda per solitt segment
    for (const [start, end] of segments) {
      const span = end - start
      const mid = (start + end) / 2
      const geometry = horizontal
        ? new THREE.BoxGeometry(span, height, THICKNESS)
        : new THREE.BoxGeometry(THICKNESS, height, span)
      const wall = new THREE.Mesh(geometry, defaultMaterial)
      wall.position.set(
        horizontal ? mid : spec.x1,
        height / 2,
        horizontal ? spec.z1 : mid
      )
      group.add(wall)
    }
  }

  return group
}