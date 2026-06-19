const canvas = document.getElementById('c');
const lbl    = document.getElementById('lbl');

/* ── Renderer ── */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);

/* ── Scene & Camera ── */
const scene  = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1a);
scene.fog = new THREE.Fog(0x0a0a1a, 18, 32);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(7, 5.5, 9);
camera.lookAt(0, 1.5, 0);

/* ── Aliases ── */
const M = THREE.MeshLambertMaterial;
const B = THREE.BoxGeometry;

/* ── Helper: add a box to the scene ── */
function box(w, h, d, mat, x, y, z, rx, ry, rz) {
  const mesh = new THREE.Mesh(new B(w, h, d), mat);
  mesh.position.set(x, y, z);
  if (rx) mesh.rotation.x = rx;
  if (ry) mesh.rotation.y = ry;
  if (rz) mesh.rotation.z = rz;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

/* ── Materials ── */
const mats = {
  floor:      new M({ color: 0xd4c5a0 }),
  wall:       new M({ color: 0xf0ece0 }),
  ceiling:    new M({ color: 0xfafaf8 }),
  shelf:      new M({ color: 0x8b6914 }),
  shelfMetal: new M({ color: 0xaaaaaa }),
  counter:    new M({ color: 0x5c3d1e }),
  counterTop: new M({ color: 0x2a2a2a }),
  red:        new M({ color: 0xcc2222 }),
  blue:       new M({ color: 0x1a5fa0 }),
  green:      new M({ color: 0x2a8c2a }),
  yellow:     new M({ color: 0xe8c012 }),
  orange:     new M({ color: 0xe8640a }),
  purple:     new M({ color: 0x7a2d8c }),
  white:      new M({ color: 0xffffff }),
  dark:       new M({ color: 0x222222 }),
  fridgeBody: new M({ color: 0x444455 }),
  fridgeGlass: new THREE.MeshPhongMaterial({ color: 0x8af0f8, transparent: true, opacity: 0.35, shininess: 120 }),
  neonPink:   new THREE.MeshBasicMaterial({ color: 0xff2288 }),
  neonBlue:   new THREE.MeshBasicMaterial({ color: 0x22ccff }),
  signBg:     new M({ color: 0x111122 }),
  lamp:       new THREE.MeshBasicMaterial({ color: 0xfff8cc }),
  tile:       new M({ color: 0xe8e4d8 }),
  darkTile:   new M({ color: 0xb8b0a0 }),
  can1:       new M({ color: 0xe02020 }),
  can2:       new M({ color: 0x1060c0 }),
  can3:       new M({ color: 0x20a020 }),
};

/* ── Hover label map ── */
const labels = new Map();
function tagged(mesh, name) { labels.set(mesh.uuid, name); return mesh; }

/* ════════════════════════════════════════
   FLOOR  (checkerboard)
════════════════════════════════════════ */
for (let x = -4; x < 4; x++) {
  for (let z = -4; z < 4; z++) {
    const m = new THREE.Mesh(new B(1, 0.02, 1), (x + z) % 2 === 0 ? mats.tile : mats.darkTile);
    m.position.set(x + 0.5, 0, z + 0.5);
    m.receiveShadow = true;
    scene.add(m);
  }
}

/* ════════════════════════════════════════
   WALLS & CEILING
════════════════════════════════════════ */
box(10, 6, 0.15, mats.wall,  0, 3, -4);   // back wall
box(0.15, 6, 8,  mats.wall, -5, 3,  0);   // left wall
box(0.15, 6, 8,  mats.wall,  5, 3,  0);   // right wall

const ceil = new THREE.Mesh(new B(10, 0.15, 8), mats.ceiling);
ceil.position.set(0, 6, 0);
ceil.receiveShadow = true;
scene.add(ceil);

/* ════════════════════════════════════════
   CEILING LIGHTS (fluorescent strips)
════════════════════════════════════════ */
function ceilLight(x, z) {
  const strip = new THREE.Mesh(new B(0.2, 0.06, 1.5), mats.lamp);
  strip.position.set(x, 5.9, z);
  scene.add(strip);
  const pl = new THREE.PointLight(0xfff5e0, 1.2, 7);
  pl.position.set(x, 5.7, z);
  scene.add(pl);
}
ceilLight(-2,  0);   ceilLight(2,  0);
ceilLight(-2, -2.5); ceilLight(2, -2.5);

/* ── Ambient + Directional ── */
scene.add(new THREE.AmbientLight(0x404060, 0.8));
const sun = new THREE.DirectionalLight(0xffffff, 0.6);
sun.position.set(3, 8, 5);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

/* ════════════════════════════════════════
   NEON SIGN (back wall)
════════════════════════════════════════ */
const signBg = new THREE.Mesh(new B(3.5, 0.8, 0.1), mats.signBg);
signBg.position.set(0, 5.2, -3.9);
scene.add(signBg);

function neonBar(w, h, x, y, mat) {
  const m = new THREE.Mesh(new B(w, h, 0.05), mat);
  m.position.set(x, y, -3.83);
  scene.add(m);
  const pl = new THREE.PointLight(mat.color.getHex(), 0.4, 2);
  pl.position.set(x, y, -3.7);
  scene.add(pl);
}
neonBar(1.2, 0.08, -0.7,  5.35, mats.neonPink);
neonBar(1.2, 0.08,  0.7,  5.35, mats.neonBlue);
neonBar(0.08, 0.4, -0.32, 5.2,  mats.neonPink);
neonBar(0.08, 0.4,  0.32, 5.2,  mats.neonBlue);
neonBar(0.6,  0.08,  0,   5.05, mats.neonPink);

/* ════════════════════════════════════════
   SHELF UNIT  helper
════════════════════════════════════════ */
function shelfUnit(sx, sz, items) {
  const back = box(1.8, 2.2, 0.08, mats.shelfMetal, sx, 1.1, sz);
  tagged(back, 'Shelf');
  for (let i = 0; i < 3; i++) {
    box(1.8, 0.06, 0.45, mats.shelf, sx, 0.35 + i * 0.72, sz + 0.18);
  }
  box(0.06, 2.2, 0.45, mats.shelf, sx - 0.87, 1.1, sz + 0.18);
  box(0.06, 2.2, 0.45, mats.shelf, sx + 0.87, 1.1, sz + 0.18);

  items.forEach(it => {
    const m = new THREE.Mesh(
      new B(it.w || 0.18, it.h || 0.28, it.d || 0.16),
      mats[it.c]
    );
    m.position.set(sx + it.x, it.y, sz + it.z);
    m.castShadow = true;
    tagged(m, it.n || 'Product');
    scene.add(m);
  });
}

/* ── Back-wall shelves ── */
shelfUnit(-2.8, -3.6, [
  { x:-0.5, y:0.52, z:0.22, c:'red',    n:'Cola'     },
  { x:-0.15,y:0.52, z:0.22, c:'red',    n:'Cola'     },
  { x: 0.2, y:0.52, z:0.22, c:'red',    n:'Cola'     },
  { x: 0.55,y:0.52, z:0.22, c:'red',    n:'Cola'     },
  { x:-0.5, y:1.24, z:0.22, c:'blue',   n:'Water'    },
  { x:-0.15,y:1.24, z:0.22, c:'blue',   n:'Water'    },
  { x: 0.2, y:1.24, z:0.22, c:'blue',   n:'Water'    },
  { x:-0.5, y:1.96, z:0.22, c:'yellow', h:0.22, w:0.2, n:'Chips'    },
  { x: 0.1, y:1.96, z:0.22, c:'orange', h:0.22, w:0.2, n:'Snacks'   },
  { x: 0.65,y:1.96, z:0.22, c:'green',  h:0.22, w:0.2, n:'Crackers' },
]);
shelfUnit(0, -3.6, [
  { x:-0.5, y:0.52, z:0.22, c:'purple', n:'Candy'    },
  { x:-0.1, y:0.52, z:0.22, c:'purple', n:'Candy'    },
  { x: 0.3, y:0.52, z:0.22, c:'orange', n:'Cookies'  },
  { x:-0.5, y:1.24, z:0.22, c:'green',  n:'Juice'    },
  { x: 0,   y:1.24, z:0.22, c:'green',  n:'Juice'    },
  { x: 0.5, y:1.24, z:0.22, c:'yellow', n:'Lemonade' },
  { x:-0.4, y:1.96, z:0.22, c:'red',    h:0.2, w:0.15, n:'Hot Sauce' },
  { x: 0,   y:1.96, z:0.22, c:'white',  h:0.2, w:0.15, n:'Mayo'      },
  { x: 0.4, y:1.96, z:0.22, c:'yellow', h:0.2, w:0.15, n:'Mustard'   },
]);
shelfUnit(2.8, -3.6, [
  { x:-0.55,y:0.52, z:0.22, c:'blue',   n:'Pen'      },
  { x:-0.2, y:0.52, z:0.22, c:'red',    n:'Notebook' },
  { x: 0.2, y:0.52, z:0.22, c:'green',  n:'Gum'      },
  { x: 0.55,y:0.52, z:0.22, c:'yellow', n:'Mints'    },
  { x:-0.5, y:1.24, z:0.22, c:'orange', n:'Jerky'    },
  { x: 0.1, y:1.24, z:0.22, c:'red',    n:'Salsa'    },
  { x:-0.3, y:1.96, z:0.22, c:'purple', h:0.24, w:0.22, n:'Cereal' },
  { x: 0.35,y:1.96, z:0.22, c:'blue',   h:0.24, w:0.22, n:'Oats'   },
]);

/* ── Center aisle shelf ── */
shelfUnit(0, 1, [
  { x:-0.5, y:0.52, z:0, c:'orange', n:'Chips'      },
  { x:-0.1, y:0.52, z:0, c:'yellow', n:'Popcorn'    },
  { x: 0.3, y:0.52, z:0, c:'red',    n:'Pretzels'   },
  { x:-0.5, y:1.24, z:0, c:'blue',   n:'Soap'       },
  { x: 0,   y:1.24, z:0, c:'white',  n:'Shampoo'    },
  { x: 0.5, y:1.24, z:0, c:'green',  n:'Toothpaste' },
]);

/* ════════════════════════════════════════
   REFRIGERATOR UNITS  (right wall)
════════════════════════════════════════ */
function fridge(x, z, items) {
  const body = box(1.6, 3.2, 0.8, mats.fridgeBody, x, 1.6, z);
  tagged(body, 'Refrigerator');

  const glass = new THREE.Mesh(new B(1.5, 3.0, 0.05), mats.fridgeGlass);
  glass.position.set(x, 1.6, z + 0.42);
  scene.add(glass);
  tagged(glass, 'Refrigerator');

  const intLight = new THREE.PointLight(0x88ddff, 0.6, 1.5);
  intLight.position.set(x, 2.5, z + 0.1);
  scene.add(intLight);

  for (let sh = 0; sh < 3; sh++) {
    box(1.4, 0.04, 0.6, mats.shelfMetal, x, 0.5 + sh * 0.9, z - 0.05);
    items.forEach((it, i) => {
      if (it.row === sh) {
        const can = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.28, 12),
          mats[it.c]
        );
        can.position.set(x - 0.45 + (i % 4) * 0.3, 0.66 + sh * 0.9, z - 0.05);
        can.castShadow = true;
        tagged(can, it.n || 'Drink');
        scene.add(can);
      }
    });
  }
}

fridge(4.1, -1, [
  { c:'can1', n:'Cola',      row:0 }, { c:'can1', n:'Cola',      row:0 },
  { c:'can1', n:'Cola',      row:0 }, { c:'can1', n:'Cola',      row:0 },
  { c:'can2', n:'Energy',    row:1 }, { c:'can2', n:'Energy',    row:1 },
  { c:'can2', n:'Energy',    row:1 }, { c:'can2', n:'Energy',    row:1 },
  { c:'can3', n:'Green Tea', row:2 }, { c:'can3', n:'Green Tea', row:2 },
  { c:'can3', n:'Green Tea', row:2 },
]);
fridge(4.1, 1, [
  { c:'blue',   n:'Water', row:0 }, { c:'blue',   n:'Water', row:0 },
  { c:'blue',   n:'Water', row:0 }, { c:'blue',   n:'Water', row:0 },
  { c:'orange', n:'OJ',    row:1 }, { c:'orange', n:'OJ',    row:1 },
  { c:'orange', n:'OJ',    row:1 },
  { c:'purple', n:'Grape', row:2 }, { c:'purple', n:'Grape', row:2 },
  { c:'purple', n:'Grape', row:2 },
]);

/* ════════════════════════════════════════
   CHECKOUT COUNTER
════════════════════════════════════════ */
const ctr = box(2.5, 1.0, 0.8, mats.counter, 0, 0.5, 3.2);
tagged(ctr, 'Checkout Counter');
box(2.5, 0.06, 0.8, mats.counterTop, 0, 1.02, 3.2);

// Cash register body
const reg = box(0.5, 0.4, 0.35, mats.dark, -0.6, 1.24, 3.2);
tagged(reg, 'Cash Register');
box(0.5, 0.25, 0.04, mats.dark, -0.6, 1.52, 3.1);

// POS screen
const screen = new THREE.Mesh(new B(0.38, 0.22, 0.02), new THREE.MeshBasicMaterial({ color: 0x44ff88 }));
screen.position.set(-0.6, 1.52, 3.09);
scene.add(screen);
tagged(screen, 'POS Screen');

// Card reader
box(0.15, 0.2, 0.1, mats.dark, 0.2, 1.14, 2.88);

/* ── Candy racks near counter ── */
function candyRack(cx, cz) {
  box(0.5, 1.0, 0.12, mats.shelfMetal, cx, 0.5, cz);
  [['red','yellow','orange'], ['purple','blue','green']].forEach((row, ri) => {
    row.forEach((c, ci) => {
      const m = new THREE.Mesh(new B(0.12, 0.12, 0.06), mats[c]);
      m.position.set(cx - 0.12 + ri * 0.24, 0.22 + ci * 0.22, cz + 0.1);
      m.castShadow = true;
      tagged(m, 'Candy');
      scene.add(m);
    });
  });
}
candyRack(-1.5, 3.4);
candyRack(-0.9, 3.4);

/* ════════════════════════════════════════
   MAGAZINE RACK
════════════════════════════════════════ */
const mRack = box(0.9, 1.4, 0.15, mats.shelfMetal, 1.5, 0.7, 3.5);
tagged(mRack, 'Magazine Rack');
['red','blue','green','yellow','orange','purple'].forEach((c, i) => {
  const m = new THREE.Mesh(new B(0.18, 0.28, 0.03), mats[c]);
  m.position.set(1.2 + (i % 3) * 0.25, 0.6 + Math.floor(i / 3) * 0.38, 3.44);
  scene.add(m);
  tagged(m, 'Magazine');
});

/* ════════════════════════════════════════
   ATM
════════════════════════════════════════ */
const atm = box(0.7, 1.8, 0.5, mats.dark, -4.2, 0.9, 2.5);
tagged(atm, 'ATM');
const atmScreen = new THREE.Mesh(new B(0.45, 0.3, 0.02), new THREE.MeshBasicMaterial({ color: 0x2266ff }));
atmScreen.position.set(-4.2, 1.2, 2.26);
scene.add(atmScreen);
tagged(atmScreen, 'ATM Screen');

/* ════════════════════════════════════════
   ENTRANCE DOOR
════════════════════════════════════════ */
box(0.1, 3, 0.15, mats.shelfMetal, -1.0, 1.5, 3.95);
box(0.1, 3, 0.15, mats.shelfMetal,  1.0, 1.5, 3.95);
box(2.1, 0.1, 0.15, mats.shelfMetal, 0, 3.05, 3.95);
const door = new THREE.Mesh(
  new B(0.9, 2.8, 0.04),
  new THREE.MeshPhongMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3, shininess: 80 })
);
door.position.set(0, 1.5, 3.93);
scene.add(door);
tagged(door, 'Entrance');

/* ════════════════════════════════════════
   FLOOR PROMO DISPLAY
════════════════════════════════════════ */
const dispBase = box(0.8, 0.1, 0.8, mats.counter, 2.5, 0.05, -1.5);
tagged(dispBase, 'Promo Display');
box(0.04, 0.6, 0.04, mats.shelfMetal, 2.1, 0.35, -1.1);
box(0.04, 0.6, 0.04, mats.shelfMetal, 2.9, 0.35, -1.1);
box(0.04, 0.6, 0.04, mats.shelfMetal, 2.1, 0.35, -1.9);
box(0.04, 0.6, 0.04, mats.shelfMetal, 2.9, 0.35, -1.9);
box(0.8, 0.04, 0.8, mats.shelf, 2.5, 0.45, -1.5);
box(0.8, 0.04, 0.8, mats.shelf, 2.5, 0.75, -1.5);
['red','yellow','blue','orange'].forEach((c, i) => {
  const m = new THREE.Mesh(new B(0.14, 0.22, 0.14), mats[c]);
  m.position.set(2.2 + (i % 2) * 0.3, 0.58 + Math.floor(i / 2) * 0.3, -1.3 + Math.floor(i / 2) * 0.3);
  scene.add(m);
  tagged(m, 'Special Offer');
});

/* ── Overhead price tags ── */
[[-2.8, 2.3, -3.55, 'red'], [-0.02, 2.3, -3.55, 'blue'], [2.8, 2.3, -3.55, 'green']]
  .forEach(([x, y, z, c]) => {
    const m = new THREE.Mesh(new B(0.5, 0.15, 0.03), mats[c]);
    m.position.set(x, y, z);
    scene.add(m);
  });

/* ════════════════════════════════════════
   ORBIT CONTROLS (manual)
════════════════════════════════════════ */
let drag = false, button = 0, lastX = 0, lastY = 0;
let theta = 0.2, phi = 1.3, radius = 12;
const target = new THREE.Vector3(0, 1.5, 0);

function updateCamera() {
  camera.position.set(
    target.x + radius * Math.sin(phi) * Math.sin(theta),
    target.y + radius * Math.cos(phi),
    target.z + radius * Math.sin(phi) * Math.cos(theta)
  );
  camera.lookAt(target);
}
updateCamera();

canvas.addEventListener('mousedown', e => { drag = true; button = e.button; lastX = e.clientX; lastY = e.clientY; e.preventDefault(); });
window.addEventListener('mouseup',   () => drag = false);
window.addEventListener('mousemove', e => {
  if (!drag) return;
  const dx = (e.clientX - lastX) * 0.008;
  const dy = (e.clientY - lastY) * 0.008;
  lastX = e.clientX; lastY = e.clientY;
  if (button === 2) {
    target.x -= Math.cos(theta) * dx * radius * 0.3;
    target.z += Math.sin(theta) * dx * radius * 0.3;
    target.y += dy * radius * 0.3;
  } else {
    theta -= dx;
    phi = Math.max(0.1, Math.min(Math.PI / 2, phi + dy));
  }
  updateCamera();
});
canvas.addEventListener('wheel', e => {
  radius = Math.max(3, Math.min(20, radius + e.deltaY * 0.02));
  updateCamera();
  e.preventDefault();
}, { passive: false });
canvas.addEventListener('contextmenu', e => e.preventDefault());

/* ── Touch controls ── */
let touches = [];
canvas.addEventListener('touchstart', e => { touches = [...e.touches]; e.preventDefault(); }, { passive: false });
canvas.addEventListener('touchmove', e => {
  if (e.touches.length === 1 && touches.length === 1) {
    const dx = (e.touches[0].clientX - touches[0].clientX) * 0.008;
    const dy = (e.touches[0].clientY - touches[0].clientY) * 0.008;
    theta -= dx;
    phi = Math.max(0.1, Math.min(Math.PI / 2, phi + dy));
  } else if (e.touches.length === 2 && touches.length === 2) {
    const d0 = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    const d1 = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    radius = Math.max(3, Math.min(20, radius - (d1 - d0) * 0.05));
  }
  touches = [...e.touches];
  updateCamera();
  e.preventDefault();
}, { passive: false });

/* ════════════════════════════════════════
   HOVER LABELS  (raycaster)
════════════════════════════════════════ */
const ray   = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoverTimer;

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
  mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
  ray.setFromCamera(mouse, camera);
  const hits = ray.intersectObjects(scene.children, false);
  clearTimeout(hoverTimer);
  if (hits.length && labels.has(hits[0].object.uuid)) {
    lbl.textContent = labels.get(hits[0].object.uuid);
    lbl.style.opacity = 1;
    hoverTimer = setTimeout(() => lbl.style.opacity = 0, 2000);
  } else {
    lbl.style.opacity = 0;
  }
});

/* ════════════════════════════════════════
   ANIMATION LOOP
════════════════════════════════════════ */
let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.01;
  // subtle fridge-light flicker
  scene.children
    .filter(c => c.isPointLight && c.color.b > 0.5)
    .forEach((l, i) => { l.intensity = 0.5 + Math.sin(t * 3 + i) * 0.08; });
  renderer.render(scene, camera);
}
animate();

/* ── Resize ── */
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});