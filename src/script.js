import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module";
import * as dat from "dat.gui";

/* 
BASE
 */
// Debug
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 20, 0);
scene.add(dirLight);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const aspect = sizes.width / sizes.height;

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Base camera
const width = 10;
const height = width / aspect;
const camera = new THREE.OrthographicCamera(
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

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/*
-------------------------------------------------------- 
 */

// Axes
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// Objects
const geometry = new THREE.BoxGeometry(4, 1.2, 1);
const color = new THREE.Color(`hsl(50, 100%, 90%)`);
const material = new THREE.MeshLambertMaterial({ color });
// material.color = new THREE.Color(0xff0000);
const box = new THREE.Mesh(geometry, material);
scene.add(box);

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  stats.begin();

  // Update objects
  const elapsedTime = clock.getElapsedTime();
  //   box.rotation.y = 0.5 * elapsedTime;

  // Update Orbital Controls
  controls.update();

  // Render
  renderer.render(scene, camera);
  stats.end();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();
