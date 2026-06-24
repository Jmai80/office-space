import * as THREE from 'three'

function makeLimb(geometry, material, length) {
  const pivot = new THREE.Group()
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = -length / 2  // toppen hamnar vid pivotens origo
  pivot.add(mesh)
  return pivot
}

export class Player extends THREE.Group {
  constructor() {
    super()

    const skin  = new THREE.MeshStandardMaterial({ color: 0xe0b89a })
    const shirt = new THREE.MeshStandardMaterial({ color: 0x3f6fa3 })
    const pants = new THREE.MeshStandardMaterial({ color: 0x2e3338 })

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 20), skin)
    head.position.y = 1.62
    this.add(head)

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 12), skin)
    neck.position.y = 1.48
    this.add(neck)

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.6, 0.24), shirt)
    torso.position.y = 1.15
    this.add(torso)

    // armar – pivot vid axeln
    this.leftArm = makeLimb(new THREE.CylinderGeometry(0.07, 0.07, 0.55, 10), shirt, 0.55)
    this.leftArm.position.set(-0.28, 1.42, 0)
    this.add(this.leftArm)

    this.rightArm = makeLimb(new THREE.CylinderGeometry(0.07, 0.07, 0.55, 10), shirt, 0.55)
    this.rightArm.position.set(0.28, 1.42, 0)
    this.add(this.rightArm)

    // ben – pivot vid höften
    this.leftLeg = makeLimb(new THREE.CylinderGeometry(0.09, 0.09, 0.85, 10), pants, 0.85)
    this.leftLeg.position.set(-0.11, 0.85, 0)
    this.add(this.leftLeg)

    this.rightLeg = makeLimb(new THREE.CylinderGeometry(0.09, 0.09, 0.85, 10), pants, 0.85)
    this.rightLeg.position.set(0.11, 0.85, 0)
    this.add(this.rightLeg)

    this.moveSpeed = 5
    this.turnSpeed = 2.5
    this.walkTime = 0

    this.raycaster = new THREE.Raycaster()
    this.collisionBuffer = 0.4
  }

isBlocked(direction, colliders) {
  // vinkelrät riktning i golvplanet, så strålarna kan utgå från kroppens kanter
  const perp = new THREE.Vector3(-direction.z, 0, direction.x)
  const halfWidth = 0.35
  const offsets = [-halfWidth, 0, halfWidth]

  for (const offset of offsets) {
    const origin = this.position.clone()
    origin.y = 1.0
    origin.addScaledVector(perp, offset)
    this.raycaster.set(origin, direction)
    const hits = this.raycaster.intersectObjects(colliders, true)
    if (hits.length > 0 && hits[0].distance < this.collisionBuffer) {
      return true
    }
  }
  return false
}

update(delta, keys, colliders) {
  // svängning
  if (keys['ArrowLeft'])  this.rotation.y += this.turnSpeed * delta
  if (keys['ArrowRight']) this.rotation.y -= this.turnSpeed * delta

  // tänkt förflyttning i världskoordinater
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.quaternion)
  forward.y = 0
  forward.normalize()

  const move = new THREE.Vector3()
  if (keys['ArrowUp'])   move.add(forward)
  if (keys['ArrowDown']) move.sub(forward)

  let moved = false
  if (move.lengthSq() > 0) {
    move.normalize().multiplyScalar(this.moveSpeed * delta)

    // testa X- och Z-axeln var för sig → glid längs väggar
    if (Math.abs(move.x) > 1e-4 &&
        !this.isBlocked(new THREE.Vector3(Math.sign(move.x), 0, 0), colliders)) {
      this.position.x += move.x
      moved = true
    }
    if (Math.abs(move.z) > 1e-4 &&
        !this.isBlocked(new THREE.Vector3(0, 0, Math.sign(move.z)), colliders)) {
      this.position.z += move.z
      moved = true
    }
  }

  // gång-animation
  if (moved) {
    this.walkTime += delta * 8
    const swing = Math.sin(this.walkTime) * 0.5
    this.leftLeg.rotation.x  = swing
    this.rightLeg.rotation.x = -swing
    this.leftArm.rotation.x  = -swing
    this.rightArm.rotation.x = swing
  } else {
    this.leftLeg.rotation.x  *= 0.8
    this.rightLeg.rotation.x *= 0.8
    this.leftArm.rotation.x  *= 0.8
    this.rightArm.rotation.x *= 0.8
  }
}
}