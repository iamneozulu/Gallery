import * as THREE from './node_modules/three';
import { GLTFLoader } from './node_modules/three/examples/jsm/Addons.js';
import { FrameMaker } from './modelFrames.js';
import { SceneMaker } from './modelFrames.js';

let renderer, scene, camera, raycaster, loader, light;

const loadingScreen = document.getElementById('loadingScreen');
const backgroundLayer = document.getElementById('backgroundLayer');

let isLoaded = false;

const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => {
    isLoaded = true;
    setTimeout(() => backgroundLayer.classList.add('visible'), 10);
    setTimeout(() => loadingScreen.classList.add('visible'), 10);
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
    // Blue
    scene.background = new THREE.Color(0x87ceeb);

    // Camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.75, 4);

    // Raycaster
    raycaster = new THREE.Raycaster();

    // Loader-------------------------------------------------------------------------------------
    loader = new GLTFLoader(loadingManager);
    // Load Gallery Scene
    const GalleryScene = new SceneMaker(
        loader,
        scene,
        './public/models/gallery_scene_mk2.gltf'
    );

    // Lighting-----------------------------------------------------------------------------------
    light = new THREE.AmbientLight(0xffffff, 2);
    scene.add(light);

    // Event Listeners----------------------------------------------------------------------------
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('click', onMouseClick, false);

    loadingScreen.onclick = function(e) {
        e.stopPropagation();

        if (!isLoaded) return;

        loadingScreen.classList.add('hidden');
        backgroundLayer.classList.add('hidden');

        loadingScreen.addEventListener('transitionend', function handler(event ) {
            if (event.propertyName === 'opacity') {
                loadingScreen.style.display = 'none';
                loadingScreen.removeEventListener('transitionend', handler);
            }
        });

        backgroundLayer.addEventListener('transitionend', function handler(event ) {
            if (event.propertyName === 'opacity') {
                backgroundLayer.style.display = 'none';
                backgroundLayer.removeEventListener('transitionend', handler);
            }
        });

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

        while(intersectedObject){
            if(intersectedObject.userData.url){
                window.open(intersectedObject.userData.url, '_blank');
                return;
            }
            intersectedObject = intersectedObject.parent;
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}