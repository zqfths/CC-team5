import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module";
import * as dat from "dat.gui";
import * as CANNON from "cannon";

let camera, scene, renderer;
let world; // CannonJs world
let lastTime; // Last timestamp of animation
let tofu; // Parts that remains
let sliced; // sliced parts that fall down
let autopilot;
let gameEnded;
const tofuHeight = 1;
const tofuDepth = 2;

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

init();

function init() {
  lastTime = 0;
  tofu = [];
  sliced = [];
  gameEnded = false;

  // Initialize CannonJS
  world = new CANNON.World();
  world.gravity.set(0, -10, 0); // Gravity pulls things down
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 40;

  // Initialize ThreeJS
  const gui = new dat.GUI();
  const canvas = document.querySelector("canvas.webgl");

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

  //get initial tofu!
  generateTofu(0, 4);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 20, 0);
  scene.add(dirLight);

  // Axes
  const axesHelper = new THREE.AxesHelper();
  scene.add(axesHelper);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setAnimationLoop(animation);
}

/*
-------------------------------------------------------- 
 */

function generateTofu(x, width) {
  //ThreeJS
  const geometry = new THREE.BoxGeometry(width, tofuHeight, tofuDepth);
  const color = new THREE.Color(`hsl(50, 100%, 90%)`);
  const material = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, 0, 0);
  scene.add(mesh);
}

function animation() {
  stats.begin();

  renderer.render(scene, camera);
  stats.end();

  //   // Call animation again on the next frame
  //   window.requestAnimationFrame(animation);
}

//mousePosition
let xPos = 0;
let yPos = 0;
window.addEventListener("click", getClickPosition, true);
function getClickPosition(e) {
  xPos = e.clientX;
  yPos = e.clientY;
  console.log(xPos, yPos);
}

window.addEventListener("resize", () => {
  // Update camera
  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});
