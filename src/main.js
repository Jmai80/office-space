import './style.css'
import * as THREE from 'three'
import { Player } from './Player.js'
import { createFloorplan } from './Floorplan.js'
import { floorMaterial } from './Textures.js'
import { createNorthRoom } from './NorthRoom.js'
import { createSouthRoom } from './SouthRoom.js'
import { createEastRoom } from './EastRoom.js'
import { createWestRoom } from './WestRoom.js'
import { createCenterRoom } from './CenterRoom.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1e1e24)

// kamera
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
)

// renderaren
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap // mjukare skuggkanter
document.body.appendChild(renderer.domElement)

// golvet
const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), floorMaterial())
floor.receiveShadow = true
floor.rotation.x = -Math.PI / 2
scene.add(floor)

// väggar, korridor, dörrar
const floorplan = createFloorplan(3)
scene.add(floorplan)

// rummen – var och en byggd kring sin egen mitt, placerad på sin plats i världen
const rooms = [
  [createNorthRoom(),   0, -14],
  [createSouthRoom(),   0,  14],
  [createEastRoom(),   14,   0],
  [createWestRoom(),  -14,   0],
  [createCenterRoom(),  0,   0],
]
for (const [room, x, z] of rooms) {
  room.position.set(x, 0, z)
  scene.add(room)
}

// allt som spelaren och kameran kan krocka med
const colliders = [floorplan]

// ljuset
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 10, 7)
scene.add(directionalLight)

// spelaren
const player = new Player()
player.position.set(18, 0, 12)
scene.add(player)

// input
const clock = new THREE.Clock()
const keys = {}
window.addEventListener('keydown', (event) => { keys[event.key] = true })
window.addEventListener('keyup', (event) => { keys[event.key] = false })

// kamera-config
const cameraOffset = new THREE.Vector3(0, 1.9, 2.8) // bakom + ovanför
const cameraRay = new THREE.Raycaster()
const desiredCameraPos = new THREE.Vector3()
const cameraTarget = new THREE.Vector3()

// renderloop
function animate() {
  requestAnimationFrame(animate)

  const delta = clock.getDelta()

  player.update(delta, keys, colliders)

  desiredCameraPos.copy(cameraOffset)
  player.localToWorld(desiredCameraPos)

  cameraTarget.set(player.position.x, player.position.y + 1.4, player.position.z)

  const toCamera = desiredCameraPos.clone().sub(cameraTarget)
  const desiredDist = toCamera.length()
  toCamera.normalize()
  cameraRay.set(cameraTarget, toCamera)
  const camHits = cameraRay.intersectObjects(colliders, true)

  let camDist = desiredDist
  if (camHits.length > 0 && camHits[0].distance < desiredDist) {
    camDist = camHits[0].distance - 0.15
  }
  camDist = Math.max(camDist, 0.3)

  camera.position.copy(cameraTarget).addScaledVector(toCamera, camDist)
  camera.lookAt(cameraTarget)

  renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})