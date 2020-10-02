import * as THREE from './three.module.js'
import {
    GLTFLoader
} from './GLTFLoader.js'

console.log("app started")

const main_container = document.getElementById('main_container');
console.log(main_container.clientWidth, main_container.clientHeight);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, main_container.clientWidth / main_container.clientHeight, 0.1, 1000);
camera.lookAt(new THREE.Vector3(0, 0, -1));
camera.position.set(0, 0, 4);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(main_container.clientWidth, main_container.clientHeight);
renderer.setClearColor(0x020202);
main_container.appendChild(renderer.domElement);

const texture_loader = new THREE.TextureLoader();
const gltf_loader = new GLTFLoader();

//////////////////////////////////////////////

//////////////////////////////////////////////

const target = new THREE.Quaternion().set(0, 0, 0, 1);

const camera_rig = new THREE.Object3D()
camera_rig.add(camera);
scene.add(camera_rig)

const root = new THREE.Object3D();
camera_rig.add(root);

{
    const texture_color = texture_loader.load('textures/uv_debug.jpg');

    const geometry = new THREE.BoxBufferGeometry(1.95, 1.95, 1.95);
    const material = new THREE.MeshStandardMaterial({
        map: texture_color,
        color: 0xffffff,
        metalness: 1,
        roughness: .2,
        envMapIntensity: 3,
    })

    var placeholder = new THREE.Mesh(geometry, material);
    const helper = new THREE.AxesHelper(1.3);
    placeholder.add(helper);
    root.add(placeholder);

    gltf_loader.load('cube.glb', (data) => {
        const cube = data.scene.children[0];
        cube.material.envMapIntensity = 3;
        console.log('loaded cube', cube.material);
        root.add(cube);
        placeholder.visible = false;


        {
            const generator = new THREE.PMREMGenerator(renderer)
            generator.compileEquirectangularShader();

            texture_loader.load('textures/env_map.jpg', (texture) => {
                texture.encoding = THREE.sRGBEncoding;
                const env_map = generator.fromEquirectangular(texture)
                texture.dispose();

                // scene.background = env_map.texture;
                placeholder.material.envMap = env_map.texture;
                placeholder.material.needsUpdate = true;
                cube.material.envMap = env_map.texture;
                cube.material.needsUpdate = true;
            });
        }
    })
}



{
    const light = new THREE.PointLight(0xffffff, .2);
    light.position.set(-2, .5, -2);
    scene.add(light);
}

{
    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, .5);
    scene.add(light);
}

//////////////////////////////////////////////

const visuals = {
    main_animated: true,
    env_animated: true,
};

const rot_right = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
const rot_left = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
const rot_up = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
const rot_down = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

document.onkeydown = (event) => {
    console.log('event keydown', event.which);
    const keyCode = event.which;
    switch (keyCode) {
        case 39: // right
            target.multiplyQuaternions(rot_right, target)
            break;
        case 37: // left
            target.multiplyQuaternions(rot_left, target)
            break;
        case 38: // up
            target.multiplyQuaternions(rot_up, target)
            break;
        case 40: // down
            target.multiplyQuaternions(rot_down, target)
            break;
        case 32: // space
            visuals.env_animated = !visuals.env_animated;
            break;
        default:
            break;
    }
}

const main_gui = new dat.GUI();

const visuals_gui = main_gui.addFolder('Visuals');
visuals_gui.add(visuals, 'env_animated').name('env&nbsp;anim&nbsp;[space]').listen();
visuals_gui.add(visuals, 'main_animated').name('main anim').listen();
visuals_gui.add(placeholder, 'visible').name('placeholder').listen();

//////////////////////////////////////////////

let top_last = Date.now();
let tt = 0
const animate = () => {
    var top_current = Date.now();
    var dt = Math.min(1e-3 * (top_current - top_last), 50e-3);
    top_last = top_current;

    if (visuals.env_animated)
        camera_rig.rotation.y += .3 * dt;

    if (visuals.main_animated)
        THREE.Quaternion.slerp(root.quaternion, target, root.quaternion, Math.min(10 * dt, 1));

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};
animate();
