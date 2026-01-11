import { useRef, useEffect } from 'react'
import { Application, Graphics, Container, Text, TextStyle } from 'pixi.js'
import { useGameStore } from '../store/gameStore'

// Configuration de la grille de ville
const GRID_SIZE = 8
const CELL_SIZE = 80
const ROAD_WIDTH = 12

export default function CityCanvas() {
  const containerRef = useRef(null)
  const appRef = useRef(null)
  const stateRef = useRef({
    cars: [],
    people: [],
    bikes: [],
    cityGrid: null,
    initialized: false,
    graphics: null
  })

  // Initialiser la grille de ville
  const initCityGrid = () => {
    const grid = []
    for (let y = 0; y < GRID_SIZE; y++) {
      grid[y] = []
      for (let x = 0; x < GRID_SIZE; x++) {
        // Distribution initiale
        let type = 'empty'
        const dist = Math.sqrt(Math.pow(x - GRID_SIZE/2, 2) + Math.pow(y - GRID_SIZE/2, 2))

        if (dist < 1.5) {
          type = 'commercial' // Centre-ville
        } else if (dist < 3) {
          type = Math.random() > 0.3 ? 'residential' : 'empty'
        } else if (Math.random() > 0.7) {
          type = 'residential'
        }

        grid[y][x] = {
          type,
          height: type === 'commercial' ? 3 : type === 'residential' ? 1 + Math.floor(Math.random() * 2) : 0,
          trees: type === 'empty' ? Math.floor(Math.random() * 4) : 0,
          quality: 50
        }
      }
    }
    return grid
  }

  useEffect(() => {
    if (!containerRef.current || appRef.current) return

    const initPixi = async () => {
      const container = containerRef.current
      const w = container.clientWidth
      const h = container.clientHeight

      const app = new Application()

      await app.init({
        width: w,
        height: h,
        backgroundColor: 0x2d4a3e,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
      })

      app.canvas.style.width = '100%'
      app.canvas.style.height = '100%'

      container.appendChild(app.canvas)
      appRef.current = app

      // Initialiser la grille
      if (!stateRef.current.initialized) {
        stateRef.current.cityGrid = initCityGrid()
        stateRef.current.initialized = true

        // Initialiser les voitures
        for (let i = 0; i < 12; i++) {
          stateRef.current.cars.push({
            road: Math.floor(Math.random() * GRID_SIZE),
            pos: Math.random() * GRID_SIZE * CELL_SIZE,
            horizontal: Math.random() > 0.5,
            speed: 0.5 + Math.random() * 1,
            color: [0xe74c3c, 0x3498db, 0xf1c40f, 0x2ecc71, 0x9b59b6, 0xe67e22][Math.floor(Math.random() * 6)]
          })
        }

        // Initialiser les piétons
        for (let i = 0; i < 20; i++) {
          stateRef.current.people.push({
            x: Math.random() * GRID_SIZE * CELL_SIZE,
            y: Math.random() * GRID_SIZE * CELL_SIZE,
            targetX: Math.random() * GRID_SIZE * CELL_SIZE,
            targetY: Math.random() * GRID_SIZE * CELL_SIZE,
            speed: 0.3 + Math.random() * 0.4,
            color: [0xffdbac, 0xf1c27d, 0xe0ac69, 0xc68642, 0x8d5524][Math.floor(Math.random() * 5)]
          })
        }
      }

      app.ticker.add(() => render(app))
    }

    initPixi()

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true })
        appRef.current = null
        stateRef.current.graphics = null
      }
    }
  }, [])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (appRef.current && containerRef.current) {
        const w = containerRef.current.clientWidth
        const h = containerRef.current.clientHeight
        appRef.current.renderer.resize(w, h)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mettre à jour la grille selon les actions
  const updateGridFromState = (state) => {
    const grid = stateRef.current.cityGrid
    if (!grid) return

    const { cityElements, environnement, economie, cohesion, usedActions } = state

    // Ajouter des HLM
    cityElements.buildings.forEach((b, idx) => {
      const x = (idx * 2 + 1) % GRID_SIZE
      const y = Math.floor((idx * 2 + 1) / GRID_SIZE) % GRID_SIZE
      if (grid[y] && grid[y][x]) {
        grid[y][x].type = 'hlm'
        grid[y][x].height = 4
      }
    })

    // Ajouter des parcs
    cityElements.parks.forEach((p, idx) => {
      const x = (idx * 3 + 2) % GRID_SIZE
      const y = (idx * 2 + 3) % GRID_SIZE
      if (grid[y] && grid[y][x]) {
        grid[y][x].type = 'park'
        grid[y][x].trees = 8
      }
    })

    // Ajouter des panneaux solaires
    cityElements.solarPanels.forEach((sp, idx) => {
      const x = (idx + 5) % GRID_SIZE
      const y = (idx + 1) % GRID_SIZE
      if (grid[y] && grid[y][x] && grid[y][x].type !== 'park') {
        grid[y][x].solar = true
      }
    })

    // Ajouter des hopitaux
    if (cityElements.hospitals) {
      cityElements.hospitals.forEach((h, idx) => {
        const x = (idx * 2 + 6) % GRID_SIZE
        const y = (idx + 2) % GRID_SIZE
        if (grid[y] && grid[y][x]) {
          grid[y][x].type = 'hospital'
          grid[y][x].height = 3
        }
      })
    }

    // Pistes cyclables si politique velo
    if (usedActions && usedActions['velo']) {
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          grid[y][x].bikeLane = true
        }
      }
    }

    // Trains si plan_rail
    if (usedActions && usedActions['plan_rail']) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (grid[GRID_SIZE - 1] && grid[GRID_SIZE - 1][x]) {
          grid[GRID_SIZE - 1][x].trainStation = x === Math.floor(GRID_SIZE / 2)
        }
      }
    }

    // Qualité des bâtiments selon indicateurs
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        grid[y][x].quality = (environnement + economie + cohesion) / 3
      }
    }
  }

  const render = (app) => {
    if (!app || !app.stage) return

    const state = useGameStore.getState()
    const { environnement, cohesion, economie, hidden, population } = state
    const grid = stateRef.current.cityGrid

    if (!grid) return

    updateGridFromState(state)

    const w = app.screen.width
    const h = app.screen.height

    // Reutiliser le Graphics existant au lieu d'en creer un nouveau
    let g = stateRef.current.graphics
    if (!g) {
      g = new Graphics()
      stateRef.current.graphics = g
      app.stage.addChild(g)
    }
    g.clear()

    // Calculer l'offset pour centrer la ville
    const gridWidth = GRID_SIZE * CELL_SIZE
    const gridHeight = GRID_SIZE * CELL_SIZE
    const offsetX = (w - gridWidth) / 2
    const offsetY = (h - gridHeight) / 2 - 20

    // Couleur de fond selon environnement
    const bgGreen = Math.floor(74 + environnement * 0.4)
    const bgColor = (45 << 16) | (bgGreen << 8) | 62
    g.rect(0, 0, w, h)
    g.fill(bgColor)

    // Dessiner la grille de la ville
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cell = grid[y][x]
        const px = offsetX + x * CELL_SIZE
        const py = offsetY + y * CELL_SIZE

        // Routes autour de chaque cellule
        g.rect(px, py, CELL_SIZE, ROAD_WIDTH)
        g.rect(px, py, ROAD_WIDTH, CELL_SIZE)
        g.fill(0x3d3d3d)

        // Pistes cyclables si activees
        if (cell.bikeLane) {
          // Bande verte sur le bord de la route
          g.rect(px, py + ROAD_WIDTH - 3, CELL_SIZE, 3)
          g.fill(0x2ecc71)
          g.rect(px + ROAD_WIDTH - 3, py, 3, CELL_SIZE)
          g.fill(0x2ecc71)
        }

        // Marquages routiers
        for (let i = 0; i < CELL_SIZE; i += 20) {
          g.rect(px + i + 5, py + ROAD_WIDTH/2 - 1, 8, 2)
          g.fill(0xcccccc)
        }

        // Gare si train station
        if (cell.trainStation) {
          g.rect(px + CELL_SIZE/2 - 20, py + CELL_SIZE - 15, 40, 12)
          g.fill(0x8b4513)
          g.rect(px + CELL_SIZE/2 - 15, py + CELL_SIZE - 12, 30, 6)
          g.fill(0xdaa520)
        }

        // Intérieur de la cellule
        const innerX = px + ROAD_WIDTH
        const innerY = py + ROAD_WIDTH
        const innerSize = CELL_SIZE - ROAD_WIDTH

        // Sol de la cellule
        const grassGreen = Math.floor(120 + environnement * 0.5)
        g.rect(innerX, innerY, innerSize, innerSize)
        g.fill((80 << 16) | (grassGreen << 8) | 70)

        // Contenu selon le type
        if (cell.type === 'hospital') {
          drawHospital(g, innerX, innerY, innerSize, cell, environnement)
        } else if (cell.type === 'residential' || cell.type === 'commercial' || cell.type === 'hlm') {
          drawBuilding(g, innerX, innerY, innerSize, cell, environnement, economie)
        } else if (cell.type === 'park') {
          drawPark(g, innerX, innerY, innerSize, cell, environnement)
        } else if (cell.type === 'empty') {
          drawEmptyLot(g, innerX, innerY, innerSize, cell, environnement)
        }

        // Panneaux solaires sur les toits
        if (cell.solar && cell.type !== 'park' && cell.type !== 'empty') {
          drawSolarPanels(g, innerX, innerY, innerSize)
        }
      }
    }

    // Routes principales (bordures)
    g.rect(offsetX, offsetY + gridHeight, gridWidth, ROAD_WIDTH)
    g.rect(offsetX + gridWidth, offsetY, ROAD_WIDTH, gridHeight)
    g.fill(0x3d3d3d)

    // Dessiner les voitures
    stateRef.current.cars.forEach(car => {
      car.pos += car.speed
      if (car.pos > GRID_SIZE * CELL_SIZE) car.pos = 0

      let cx, cy
      if (car.horizontal) {
        cx = offsetX + car.pos
        cy = offsetY + car.road * CELL_SIZE + ROAD_WIDTH / 2
      } else {
        cx = offsetX + car.road * CELL_SIZE + ROAD_WIDTH / 2
        cy = offsetY + car.pos
      }

      // Corps de la voiture (vue du dessus)
      g.roundRect(cx - 4, cy - 6, 8, 12, 2)
      g.fill(car.color)

      // Pare-brise
      g.rect(cx - 2, cy - 4, 4, 3)
      g.fill(0x87ceeb)
    })

    // Dessiner les velos si politique velo active
    const usedActions = state.usedActions || {}
    if (usedActions['velo']) {
      // Ajouter des velos si pas encore fait
      if (stateRef.current.bikes.length < usedActions['velo'] * 6) {
        for (let i = 0; i < 6; i++) {
          stateRef.current.bikes.push({
            road: Math.floor(Math.random() * GRID_SIZE),
            pos: Math.random() * GRID_SIZE * CELL_SIZE,
            horizontal: Math.random() > 0.5,
            speed: 0.8 + Math.random() * 0.6
          })
        }
      }

      stateRef.current.bikes.forEach(bike => {
        bike.pos += bike.speed
        if (bike.pos > GRID_SIZE * CELL_SIZE) bike.pos = 0

        let bx, by
        if (bike.horizontal) {
          bx = offsetX + bike.pos
          by = offsetY + bike.road * CELL_SIZE + ROAD_WIDTH - 2
        } else {
          bx = offsetX + bike.road * CELL_SIZE + ROAD_WIDTH - 2
          by = offsetY + bike.pos
        }

        // Velo (petit cercle vert)
        g.circle(bx, by, 3)
        g.fill(0x27ae60)
        g.circle(bx, by, 1.5)
        g.fill(0xffdbac)
      })
    }

    // Dessiner les piétons
    const totalPop = population.poor + population.middle + population.rich
    const targetPeople = Math.min(30, Math.floor(totalPop / 40))

    // Ajouter max 2 personnes par frame pour eviter les pics
    if (stateRef.current.people.length < targetPeople) {
      const toAdd = Math.min(2, targetPeople - stateRef.current.people.length)
      for (let i = 0; i < toAdd; i++) {
        stateRef.current.people.push({
          x: Math.random() * gridWidth,
          y: Math.random() * gridHeight,
          targetX: Math.random() * gridWidth,
          targetY: Math.random() * gridHeight,
          speed: 0.3 + Math.random() * 0.4,
          color: [0xffdbac, 0xf1c27d, 0xe0ac69, 0xc68642, 0x8d5524][Math.floor(Math.random() * 5)]
        })
      }
    }

    stateRef.current.people.forEach(p => {
      // Mouvement vers la cible
      const dx = p.targetX - p.x
      const dy = p.targetY - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 5) {
        p.targetX = Math.random() * gridWidth
        p.targetY = Math.random() * gridHeight
      } else {
        p.x += (dx / dist) * p.speed
        p.y += (dy / dist) * p.speed
      }

      const px = offsetX + p.x
      const py = offsetY + p.y

      // Point pour le piéton (vue du dessus)
      g.circle(px, py, 2.5)
      g.fill(p.color)
    })

    // Pollution overlay
    if (hidden.pollution > 20) {
      const alpha = Math.min(0.35, hidden.pollution / 150)
      g.rect(0, 0, w, h)
      g.fill({ color: 0x554433, alpha })
    }

    // Indicateur de saison/heure (soleil ou lune)
    const sunX = w - 50
    const sunY = 40
    g.circle(sunX, sunY, 18)
    g.fill({ color: 0xffdd44, alpha: Math.max(0.5, environnement / 100) })
    g.circle(sunX, sunY, 25)
    g.fill({ color: 0xffdd44, alpha: 0.2 })
  }

  const drawBuilding = (g, x, y, size, cell, env, eco) => {
    const margin = 8
    const bx = x + margin
    const by = y + margin
    const bw = size - margin * 2
    const bh = size - margin * 2

    // Couleur selon le type
    let color
    switch (cell.type) {
      case 'commercial':
        color = 0x5588bb // Bleu bureau
        break
      case 'hlm':
        color = 0xcc8855 // Orange social
        break
      default:
        color = 0xaa9988 // Beige résidentiel
    }

    // Ajuster selon qualité
    const quality = cell.quality / 100
    const r = ((color >> 16) & 0xff) * (0.7 + quality * 0.3)
    const green = ((color >> 8) & 0xff) * (0.7 + quality * 0.3)
    const b = (color & 0xff) * (0.7 + quality * 0.3)
    const adjustedColor = (Math.floor(r) << 16) | (Math.floor(green) << 8) | Math.floor(b)

    // Ombre
    g.rect(bx + 3, by + 3, bw, bh)
    g.fill({ color: 0x000000, alpha: 0.2 })

    // Toit du bâtiment
    g.rect(bx, by, bw, bh)
    g.fill(adjustedColor)

    // Détails du toit selon la hauteur
    if (cell.height >= 3) {
      // Gratte-ciel : toit avec équipements
      g.rect(bx + bw/3, by + bh/3, bw/3, bh/3)
      g.fill(0x666666)
    } else if (cell.height === 2) {
      // Immeuble moyen
      g.rect(bx + bw/4, by + bh/4, bw/2, bh/2)
      g.fill({ color: 0xffffff, alpha: 0.1 })
    }

    // Fenêtres (points lumineux la nuit / reflets)
    const windowRows = Math.min(3, cell.height)
    const windowCols = 3
    for (let wy = 0; wy < windowRows; wy++) {
      for (let wx = 0; wx < windowCols; wx++) {
        const lit = Math.sin(Date.now() * 0.001 + bx + wx * wy) > 0.2
        g.rect(
          bx + 6 + wx * (bw - 12) / windowCols,
          by + 6 + wy * (bh - 12) / windowRows,
          4, 4
        )
        g.fill(lit ? 0xffffcc : 0x555555)
      }
    }
  }

  const drawPark = (g, x, y, size, cell, env) => {
    // Sol du parc (plus vert)
    const parkGreen = Math.floor(150 + env * 0.5)
    g.rect(x, y, size, size)
    g.fill((60 << 16) | (parkGreen << 8) | 50)

    // Chemins
    g.moveTo(x, y + size/2)
    g.lineTo(x + size, y + size/2)
    g.moveTo(x + size/2, y)
    g.lineTo(x + size/2, y + size)
    g.stroke({ color: 0xddccaa, width: 3 })

    // Arbres
    const treePositions = [
      [0.2, 0.2], [0.8, 0.2], [0.2, 0.8], [0.8, 0.8],
      [0.35, 0.35], [0.65, 0.35], [0.35, 0.65], [0.65, 0.65]
    ]

    treePositions.slice(0, cell.trees).forEach(([tx, ty]) => {
      const treeX = x + tx * size
      const treeY = y + ty * size
      const treeGreen = Math.floor(100 + env * 0.8)

      // Ombre
      g.circle(treeX + 2, treeY + 2, 6)
      g.fill({ color: 0x000000, alpha: 0.15 })

      // Feuillage
      g.circle(treeX, treeY, 6)
      g.fill((30 << 16) | (treeGreen << 8) | 40)
    })

    // Fontaine au centre si grand parc
    if (cell.trees >= 6) {
      g.circle(x + size/2, y + size/2, 8)
      g.fill(0x6699cc)
      g.circle(x + size/2, y + size/2, 4)
      g.fill(0x88bbee)
    }
  }

  const drawEmptyLot = (g, x, y, size, cell, env) => {
    // Terrain vague avec quelques arbres
    cell.trees = cell.trees || 0

    for (let i = 0; i < cell.trees; i++) {
      const tx = x + 15 + (i % 3) * 20
      const ty = y + 15 + Math.floor(i / 3) * 20
      const treeGreen = Math.floor(80 + env * 0.6)

      g.circle(tx, ty, 5)
      g.fill((25 << 16) | (treeGreen << 8) | 30)
    }
  }

  const drawHospital = (g, x, y, size, cell, env) => {
    const margin = 6
    const bx = x + margin
    const by = y + margin
    const bw = size - margin * 2
    const bh = size - margin * 2

    // Ombre
    g.rect(bx + 3, by + 3, bw, bh)
    g.fill({ color: 0x000000, alpha: 0.2 })

    // Batiment blanc
    g.rect(bx, by, bw, bh)
    g.fill(0xfafafa)

    // Croix rouge
    const crossSize = Math.min(bw, bh) * 0.4
    const cx = bx + bw / 2
    const cy = by + bh / 2

    g.rect(cx - crossSize / 6, cy - crossSize / 2, crossSize / 3, crossSize)
    g.fill(0xe74c3c)
    g.rect(cx - crossSize / 2, cy - crossSize / 6, crossSize, crossSize / 3)
    g.fill(0xe74c3c)

    // Fenetres
    g.rect(bx + 5, by + 5, 8, 8)
    g.fill(0x87ceeb)
    g.rect(bx + bw - 13, by + 5, 8, 8)
    g.fill(0x87ceeb)
  }

  const drawSolarPanels = (g, x, y, size) => {
    // Panneaux solaires sur le toit
    const panels = [
      [0.3, 0.3], [0.5, 0.3], [0.7, 0.3],
      [0.3, 0.7], [0.5, 0.7], [0.7, 0.7]
    ]

    panels.forEach(([px, py]) => {
      g.rect(x + px * size - 4, y + py * size - 3, 8, 6)
      g.fill(0x1a2a44)
      // Reflet
      g.rect(x + px * size - 2, y + py * size - 2, 3, 2)
      g.fill({ color: 0xffffff, alpha: 0.3 })
    })
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden'
      }}
    />
  )
}
