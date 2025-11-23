export class SceneMaker{
    constructor(loader, scene, modelPath,) {
        this.loader = loader;
        this.scene = scene;
        this.modelPath = modelPath;
        this.loadScene(this.loader, this.scene, this.modelPath);
    };

    loadScene(loader, scene, modelPath) {
        loader.load(modelPath, function (gltf) {
            const model = gltf.scene;
            scene.add(model);
        }, undefined, function (error) {
            console.error(error);
        });
    };
};

export class FrameMaker{
    constructor(loader, scene, modelPath, position, scale, url) {
        this.loader = loader;
        this.scene = scene;
        this.modelPath = modelPath;
        this.position = position;
        this.scale = scale;
        this.url = url;
        this.loadFrame(this.loader, this.scene, this.modelPath,this.position, this.scale, this.url);
    }

    loadFrame(loader, scene, modelPath, position, scale, url) {
        loader.load(modelPath, function (gltf) {
            const model = gltf.scene;
            model.position.set(position[0], position[1], position[2]);
            model.scale.set(scale[0], scale[1], scale[2]);

            model.userData.url = url;
            model.traverse((child) => {
                if (child.isMesh) {
                    child.userData.url = url;
                }
            });

            scene.add(model);
        }, undefined, function (error) {
            console.error(error);
        });
    };

    objectURL() {
        return this.url;
    };
};