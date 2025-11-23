import * as THREE from './node_modules/three';
import { GLTFLoader } from './node_modules/three/examples/jsm/Addons.js';

export class FrameMaker{
    constructor(loader, scene, modelPath, position, scale, url) {
        this.loader = loader;
        this.scene = scene;
        this.modelPath = modelPath;
        this.position = position;
        this.scale = scale;
        this.url = url;
        this.loadFrame(this.loader, this.scene, this.modelPath,this.position, this.scale);
    }

    loadFrame(loader, scene, modelPath, position, scale) {
        loader.load(modelPath, function (gltf) {
            const model = gltf.scene;
            model.position.set(position[0], position[1], position[2]);
            model.scale.set(scale[0], scale[1], scale[2]);
            scene.add(model);
            model.traverse((child) => {
                if (child.isMesh) {
                    
                }
            });
        }, undefined, function (error) {
            console.error(error);
        });
    };

    objectURL() {
        return this.url;
    };
};