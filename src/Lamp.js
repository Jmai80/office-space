import * as THREE from 'three'

export function createLamp({ height = 1.75, color = 0x3b2a1a, intensity = 12 } = {}) {
  const lamp = new THREE.Group()
  const frameMat = new THREE.MeshStandardMaterial({ color })

  const baseH  = 0.04
  const shadeH = 0.22
  const bulbR  = 0.07

  const shadeBottom = height - shadeH
  const bulbY       = shadeBottom + 0.04
  const stemBottom  = baseH
  const stemTop     = bulbY
  const stemH       = stemTop - stemBottom

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, baseH, 16), frameMat)
  base.position.y = baseH / 2
  lamp.add(base)

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, stemH, 16), frameMat)
  stem.position.y = stemBottom + stemH / 2
  lamp.add(stem)

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(bulbR, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffe0b0, emissive: 0xffe0b0, emissiveIntensity: 1 })
  )
  bulb.position.y = bulbY
  lamp.add(bulb)

  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.20, shadeH, 16, 1, true),
    new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide })
  )
  shade.position.y = shadeBottom + shadeH / 2
  lamp.add(shade)

  // SpotLight: en ljuskon som pekar rakt ner, och som kastar skugga
  // (color, intensity, distance, angle, penumbra, decay)
  const light = new THREE.SpotLight(0xffe0b0, intensity, 6, Math.PI / 4, 0.4, 2)
  light.position.y = bulbY
  light.target.position.y = 0      // riktas mot golvet → lyser nedåt
  light.castShadow = true
  light.shadow.mapSize.set(1024, 1024) // skärpa på skuggan
  light.shadow.bias = -0.0005          // motar bort "skugg-akne" (flimrande ränder)
  lamp.add(light)
  lamp.add(light.target)           // målet måste också ligga i scenen

  return lamp
}