import * as THREE from 'three'

export function wallMaterial(baseColor, streakColor) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  // grundfärg
  ctx.fillStyle = baseColor
  ctx.fillRect(0, 0, 256, 256)

  // svaga vertikala streck = struktur
  ctx.strokeStyle = streakColor
  ctx.globalAlpha = 0.15
  for (let x = 0; x < 256; x += 8) {
    ctx.beginPath()
    ctx.moveTo(x + Math.random() * 2, 0)
    ctx.lineTo(x + Math.random() * 2, 256)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 1)

  return new THREE.MeshStandardMaterial({ map: texture })
}

export function floorMaterial(baseColor = '#5c5f63', seamColor = '#3f4347') {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  // grundfärg
  ctx.fillStyle = baseColor
  ctx.fillRect(0, 0, 256, 256)

  // korn: massor av små ljusa och mörka prickar = mattkänsla
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 256
    const y = Math.random() * 256
    const shade = Math.random() < 0.5 ? 255 : 0
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, 0.04)`
    ctx.fillRect(x, y, 2, 2)
  }

  // mörk söm runt kanten → bildar ett rutnät när plattorna upprepas
  ctx.strokeStyle = seamColor
  ctx.lineWidth = 4
  ctx.strokeRect(0, 0, 256, 256)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(10, 10) // 10×10 plattor över 40 m → ca 4 m per platta

  return new THREE.MeshStandardMaterial({ map: texture })
}