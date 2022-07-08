import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module";
import * as dat from "dat.gui";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import Canvas from "./sketch.js";

/*
-------------------------------------------------------- 
 */

let camera, scene, renderer;

let lastTime;
let remainedPart;
let sliced;
let physicsWorld, cannonDebugger;

//Initial Dimension
const initLength = 4;
const initHeight = 1;
const initDepth = 2;

const gui = new dat.GUI();
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

init();

/*
-------------------------------------------------------- 
 */

function init() {
  const canvasP5 = new Canvas();

  lastTime = 0;
  sliced = [];

  //Initialize CannonJS
  physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0),
    broadphase: new CANNON.NaiveBroadphase(),
  });

  // Initialize ThreeJS
  const canvas = document.getElementById("canvasThreeJS");

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  // Sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const aspect = sizes.width / sizes.height;

  // Base camera
  const width = 10;
  const height = width / aspect;
  camera = new THREE.OrthographicCamera(
    width / -2, // left
    width / 2, // right
    height / 2, // top
    height / -2, // bottom
    0, // near plane
    100 // far plane
  );
  camera.position.set(2, 2, 5);
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  //get initial object!
  addRemainedBox({ x: 0, length: initLength });

  //add gui
  gui
    .add(remainedPart.threejs.position, "x", -initLength / 2, initLength / 2)
    .name("Box Position")
    .onFinishChange((value) => {
      remainedPart.threejs.position.x = value;
    });

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 20, 0);
  scene.add(dirLight);

  // Axes
  const axesHelper = new THREE.AxesHelper();
  scene.add(axesHelper);

  window.addEventListener("resize", () => {
    // Update camera
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.render(scene, camera);
  });

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  canvas.appendChild(renderer.domElement);
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setAnimationLoop(animation);
}

/*
-------------------------------------------------------- 
 */

// Slicing Box
window.addEventListener("keydown", (event) => {
  if (event.key == " ") {
    eventHandler();
    return;
  }
});

function eventHandler() {
  console.log("slice!! yumm..");
  cutBox();
}

/*
-------------------------------------------------------- 
 */

function cutBox() {
  const prevXPos = remainedPart.xPos;
  const prevLength = remainedPart.length;

  const slicePos = prevLength / 2 - 1;
  //   addRemainedBox({ x, length });
  //   addOverHang({ x, length });
}

function getSlicesPos({ slice }) {
  return {
    xRemained,
    lengthRemained,
    xOverHang,
    lengthOverhang,
  };
}

function addRemainedBox({ x, length }) {
  x = x || 0;
  length = length || 4;
  const layer = generateBox({ x, length, falls: false });
  remainedPart = layer;
}

function addOverHang({ x, length }) {
  const layer = generateBox({ x, length, falls: true });
  sliced.unshift(layer);
}

function generateBox({ x, length, falls }) {
  //ThreeJs
  const geometry = new THREE.BoxGeometry(length, initHeight, initDepth);
  const color = new THREE.Color(`hsl(${150}, 100%, 90%)`);
  const material = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, 0, 0);
  scene.add(mesh);

  //CannonJS
  const shape = new CANNON.Box(
    new CANNON.Vec3(length / 2, initHeight / 2, initDepth / 2)
  );
  let mass = falls ? 5 : 0; // If it shouldn't fall then setting the mass to zero will keep it stationary
  mass *= length / initLength; // Reduce mass proportionately by size
  const body = new CANNON.Body({ mass, shape });
  body.position.set(x, 0, 0);
  physicsWorld.addBody(body);

  return {
    threejs: mesh,
    cannonjs: body,
    xPos: x,
    length,
  };
}

function sliceBox() {
  console.log("slice! yumm..");
}

function animation(time) {
  if (lastTime) {
    const timePassed = time - lastTime;
    stats.begin();
    // physicsWorld.fixedStep();
    // cannonDebugger.update();

    renderer.render(scene, camera);
    stats.end();
  }
  lastTime = time;
}
