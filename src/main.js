import './style.css'
import * as THREE from 'three'
import { Player } from './Player.js'
import { createFloorplan } from './Floorplan.js'
import { createDesk } from './Desk.js'
import { createMirror } from './Mirror.js'
import { createPlant } from './Plant.js'
import { createChair } from './Chair.js'
import { createLaptop } from './Laptop.js'
import { floorMaterial } from './Textures.js'

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
document.body.appendChild(renderer.domElement)

// golvet
const floorGeometry = new THREE.PlaneGeometry(40, 40)
const floorMat = floorMaterial()
const floor = new THREE.Mesh(floorGeometry, floorMat)
floor.rotation.x = -Math.PI / 2
scene.add(floor)

// hela våningsplanet (väggar, korridor, rum)
const floorplan = createFloorplan(3)
scene.add(floorplan)

// inredning i norra rummet
const desk = createDesk()
desk.position.set(-4, 0, -15)
scene.add(desk)

const mirror = createMirror(2.4, 2.2)
mirror.position.set(0, 1.25, -19.88)
scene.add(mirror)

// inredning i västra rummet
const plant = createPlant()
plant.position.set(-19, 0, 7) // hörnet närmast söder
scene.add(plant)

const westDesk = createDesk({ monitor: false })
westDesk.position.set(-14, 0, -4)
scene.add(westDesk)

const laptop = createLaptop()
laptop.position.set(-14, 0.77, -3.9) // ovanpå skivan (0.72 ben + 0.05 skiva)
scene.add(laptop)

const chair = createChair()
chair.position.set(-14, 0, -2.9)
chair.rotation.y = Math.PI // vänd så den tittar mot skrivbordet
scene.add(chair)

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
player.position.set(0, 0, 0)
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