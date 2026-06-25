import * as THREE from 'three'

// Blueprint för ett sidoskåp / byrå.
// Allt styrs av parametrar → ett nytt skåp är bara ett anrop med andra värden.
export function createCabinet({
  width  = 1.4,    // bredd (lokal x)
  height = 0.85,   // total höjd inkl. ben
  depth  = 0.45,   // djup (lokal z) – framsidan pekar mot +z
  color  = 0x8a5a2b,
} = {}) {
  const cabinet = new THREE.Group()

  // kroppen i vald färg, luckorna en aning ljusare, ben/handtag i mörk accent
  const bodyColor  = new THREE.Color(color)
  const frontColor = bodyColor.clone().multiplyScalar(1.15) // ljusare nyans av samma färg
  const bodyMat   = new THREE.MeshStandardMaterial({ color: bodyColor })
  const frontMat  = new THREE.MeshStandardMaterial({ color: frontColor })
  const accentMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b })

  const legH  = 0.1                          // korta ben
  const bodyH = Math.max(height - legH, 0.1) // resten är skåpkroppen

  // skåpkroppen
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, bodyH, depth), bodyMat)
  body.position.y = legH + bodyH / 2
  cabinet.add(body)

  // lådfronter: ungefär en per 0,5 m bredd, minst en
  const frontCount = Math.max(1, Math.round(width / 0.5))
  const gap    = 0.03
  const frontW = (width - gap * (frontCount + 1)) / frontCount
  const frontH = bodyH - gap * 2
  const frontGeo = new THREE.BoxGeometry(frontW, frontH, 0.02)

  for (let i = 0; i < frontCount; i++) {
    const cx = -width / 2 + gap + frontW / 2 + i * (frontW + gap)

    const front = new THREE.Mesh(frontGeo, frontMat)
    front.position.set(cx, legH + bodyH / 2, depth / 2 + 0.011) // strax utanför framsidan
    cabinet.add(front)

    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(frontW * 0.35, 0.02, 0.02),
      accentMat
    )
    handle.position.set(cx, legH + bodyH * 0.7, depth / 2 + 0.03)
    cabinet.add(handle)
  }

  // fyra ben
  const legGeo = new THREE.BoxGeometry(0.06, legH, 0.06)
  const inset = 0.05
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const leg = new THREE.Mesh(legGeo, accentMat)
      leg.position.set(sx * (width / 2 - inset), legH / 2, sz * (depth / 2 - inset))
      cabinet.add(leg)
    }
  }

  return cabinet
}