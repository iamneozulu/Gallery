import * as THREE from './node_modules/three';
import { GLTFLoader } from './node_modules/three/examples/jsm/Addons.js';
import { FrameMaker } from './modelFrames.js';

let renderer, scene, camera, raycaster, loader;

const launchButton = document.getElementById('launchButton');
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => {
    launchButton.style.display = 'block';
    setTimeout(() => launchButton.classList.add('visible'), 10);
};
loadingManager.onError = (url) => {
    console.error(`There was an error loading ${url}`);
};

init();
animate();

function init() {
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    // Camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.75, 4);

    // Raycaster
    raycaster = new THREE.Raycaster();

    // Loader-------------------------------------------------------------------------------------
    loader = new GLTFLoader(loadingManager);
    // Load Gallery Scene
    loader.load('./public/models/gallery_scene.gltf', function (gltf) {
        const Gallery = gltf.scene;
        scene.add(Gallery);
    }, undefined, function (error) {
        console.error(error);
    });
    // Load Solar System Frame
    const SolarSystemFrame = new FrameMaker(
        loader,
        scene,
        './public/models/solar_system_frame.gltf',
        [0, 0.75, -5.6],
        [1, 1, 1],
        'https://en.wikipedia.org/wiki/Solar_System'
    );
    // Load Periodic Table Frame
    const PeriodicTableFrame = new FrameMaker(
        loader,
        scene,
        './public/models/periodic_table_frame.gltf',
        [-2.85, 1, -3],
        [0.7, 0.7, 0.7],
        'https://en.wikipedia.org/wiki/Periodic_table'
    );

    // Event Listeners----------------------------------------------------------------------------
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('click', onMouseClick, false);

    document.getElementById('launchButton').onclick = function() {
        document.getElementById('loadingScreen').style.display = 'none';
    };
    //--------------------------------------------------------------------------------------------
}

// Handles window resizing
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handles mouse click events
function onMouseClick(event) {
    event.preventDefault();
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.userData.info) {
            alert(intersectedObject.userData.info);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}