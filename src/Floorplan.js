import * as THREE from 'three'
import { buildWalls } from './WallBuilder.js'
import { wallMaterial } from './Textures.js'

export function createFloorplan(height) {
  const base    = wallMaterial('#b0a99f', '#8f897f')  // neutral grundton
  const northMat = wallMaterial('#9fb1c6', '#76869b') // dämpat blått
  const southMat = wallMaterial('#a9bf9c', '#7f9472') // dämpat grönt
  const eastMat  = wallMaterial('#ccb188', '#9e8456') // sand
  const westMat  = wallMaterial('#c2a6b4', '#937787') // dämpat rosa
  const room1Mat = wallMaterial('#bdb6a6', '#938c7d') // varmt grått

  const door = (at) => ({ at, width: 1.2 })

  const walls = [
    // norra/södra skalet (= bortre vägg i norra/södra rummet)
    { x1: -20, z1: -20, x2: 20, z2: -20, material: northMat },
    { x1: -20, z1:  20, x2: 20, z2:  20, material: southMat },

    // västra skalet, uppdelat (mittbiten = västra rummets bortre vägg)
    { x1: -20, z1: -20, x2: -20, z2: -8 },
    { x1: -20, z1:  -8, x2: -20, z2:  8, material: westMat },
    { x1: -20, z1:   8, x2: -20, z2: 20 },

    // östra skalet, uppdelat
    { x1: 20, z1: -20, x2: 20, z2: -8 },
    { x1: 20, z1:  -8, x2: 20, z2:  8, material: eastMat },
    { x1: 20, z1:   8, x2: 20, z2: 20 },

    // korridorens ytterväggar (neutrala, med dörrar)
    { x1: -20, z1: -8, x2: 20, z2: -8, doors: [door(0)] },
    { x1: -20, z1:  8, x2: 20, z2:  8, doors: [door(0)] },
    { x1:   8, z1: -8, x2:  8, z2:  8, doors: [door(0)] },
    { x1:  -8, z1: -8, x2: -8, z2:  8, doors: [door(0)] },

    // Rum 1 i mitten
    { x1: -6, z1: -6, x2:  6, z2: -6, doors: [door(0)], material: room1Mat },
    { x1: -6, z1:  6, x2:  6, z2:  6, material: room1Mat },
    { x1: -6, z1: -6, x2: -6, z2:  6, material: room1Mat },
    { x1:  6, z1: -6, x2:  6, z2:  6, material: room1Mat },
  ]

  return buildWalls(walls, height, base)
}