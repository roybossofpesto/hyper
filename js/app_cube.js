import * as THREE from './three.module.js'
import { GLTFLoader } from './GLTFLoader.js'

console.log("app started")

const main_container = document.getElementById('main_container');
console.log(main_container.clientWidth, main_container.clientHeight);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, main_container.clientWidth / main_container.clientHeight, 0.1, 1000);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(main_container.clientWidth, main_container.clientHeight);
renderer.setClearColor(0x020202);
main_container.appendChild(renderer.domElement);

const texture_loader = new THREE.TextureLoader();
const gltf_loader = new GLTFLoader();

//////////////////////////////////////////////

//////////////////////////////////////////////

const target = new THREE.Quaternion().set(0, 0, 0, 1);

const root = new THREE.Mesh();
scene.add(root);


gltf_loader.load('cube.glb', (data) => {
    console.log('loaded cube');
    console.log(data.scene)
    root.add(data.scene)
})

/*{
    const texture_color = texture_loader.load('textures/uv_debug.jpg');

    const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
        map: texture_color,
        color: 0xffffff,
        roughness: .2,
    })

    const cube = new THREE.Mesh(geometry, material);
    root.add(cube);
}*/

{
    const helper = new THREE.AxesHelper(1.3);
    root.add(helper);
}

{
    const light = new THREE.PointLight(0xffffff, .2);
    light.position.set(2, .5, 2);
    scene.add(light);
}

{
    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, .5);
    scene.add(light);
}

//////////////////////////////////////////////

const visuals = {
    is_animated: true,
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
        case 32:
            visuals.is_animated = !visuals.is_animated;
            break;
        default:
            break;
    }
}

//////////////////////////////////////////////

let top_last = Date.now();
let tt = 0
const animate = () => {
    var top_current = Date.now();
    var dt = Math.min(1e-3 * (top_current - top_last), 50e-3);
    top_last = top_current;

    if (visuals.is_animated) {
        // console.log(root.quaternion)
        // root.rotation.y += dt;
        THREE.Quaternion.slerp(root.quaternion, target, root.quaternion, Math.min(10 * dt, 1));
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};
animate();
