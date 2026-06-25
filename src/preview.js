import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { createBookshelf } from './BookShelf.js' // ← anpassa namnet till din export

// minimal scen – bara för att titta på en sak i taget
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x2a2a30)

const camera = new THREE.PerspectiveCamera(
  50, window.innerWidth / window.innerHeight, 0.1, 100
)
camera.position.set(1.5, 1.5, 2.5)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

// ljus så geometrin syns oavsett om lampans egen lampa är tänd
scene.add(new THREE.AmbientLight(0xffffff, 0.6))
const dir = new THREE.DirectionalLight(0xffffff, 1)
dir.position.set(3, 5, 4)
scene.add(dir)

// rutnät + axlar: lampan svävar inte, och man ser skala och riktning
scene.add(new THREE.GridHelper(6, 12))   // 6 m brett, 12 rutor → 0,5 m per ruta
scene.add(new THREE.AxesHelper(0.5))     // röd = x, grön = y, blå = z

// själva objektet vi vill granska
const bookShelf = createBookshelf({ width: 1.4, height: 1.85, depth: 0.45, color: 0x8a5a2b })
scene.add(bookShelf)

// muskontroll: dra för att rotera, scrolla för att zooma
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0.5, 0) // sikta ungefär på lampans mitt
controls.update()

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})