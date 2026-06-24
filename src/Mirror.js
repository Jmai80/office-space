import * as THREE from 'three'
import { Reflector } from 'three/addons/objects/Reflector.js'

export function createMirror(width, height) {
  const geometry = new THREE.PlaneGeometry(width, height)
  return new Reflector(geometry, {
    color: 0x8a929c,
    textureWidth: 1024,
    textureHeight: 1024,
  })
}