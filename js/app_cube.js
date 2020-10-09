import * as THREE from './three.module.js'
import {
    GLTFLoader
} from './GLTFLoader.js'

String.prototype.rpad = function(padString, length) {
    let str = this;
    while (str.length < length)
        str += padString;
    return str;
}

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
    const helper = new THREE.AxesHelper(2);
    placeholder.add(helper);
    root.add(placeholder);

    var dice = new THREE.Group();
    var cube = new THREE.Group();
    root.add(dice);
    root.add(cube);
    dice.visible = false;
    {
        const generator = new THREE.PMREMGenerator(renderer)
        generator.compileEquirectangularShader();

        texture_loader.load('textures/env_map.jpg', (texture) => {
            console.log('loaded envmap');

            texture.encoding = THREE.sRGBEncoding;
            const env_map = generator.fromEquirectangular(texture)
            texture.dispose();

            // scene.background = env_map.texture;
            placeholder.material.envMap = env_map.texture;
            placeholder.material.needsUpdate = true;

            const load_and_add = (group) => (data) => {
                const mesh = data.scene.children[0];
                mesh.material.envMapIntensity = 3;
                console.log('loaded mesh', mesh.material);
                group.add(mesh);

                mesh.material.envMap = env_map.texture;
                mesh.material.needsUpdate = true;
                for (const child of mesh.children)
                {
                    child.material.envMap = env_map.texture;
                    child.material.needsUpdate = true;
                }
            };

            gltf_loader.load('dice.glb', load_and_add(dice));
            gltf_loader.load('cube.glb', load_and_add(cube));
        });
    }
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
console.log('rot_right', rot_right);
console.log('rot_up', rot_up);

const get_forward_facing = () => {
    const forward_facing = new THREE.Vector3(0, 0, 1);
    forward_facing.applyQuaternion(target);
    return forward_facing;
};

const get_backward_facing = () => {
    const forward_facing = new THREE.Vector3(0, 0, 1);
    const target_inv = target.clone();
    target_inv.inverse();
    forward_facing.applyQuaternion(target_inv);
    return forward_facing;
};

const get_directions = (forward) => {
    const directions = {
        "I": new THREE.Vector3(0, 0, 1),
        "II": new THREE.Vector3(0, -1, 0),
        "III": new THREE.Vector3(1, 0, 0),
        "IV": new THREE.Vector3(-1, 0, 0),
        "V": new THREE.Vector3(0, 1, 0),
        "VI": new THREE.Vector3(0, 0, -1),
    };
    let ret = "";
    for (const [label, vv] of Object.entries(directions)) {
        const close_enough = vv.distanceTo(forward) < 1e-3;
        if (close_enough) ret += label;
    }
    return ret;
};

const update_target = () => {
    const format_vec3 = (vv) => `(${vv.x.toFixed(3)},${vv.y.toFixed(3)},${vv.z.toFixed(3)})[${vv.length().toFixed(3)}]`;
    const format_vec4 = (vv) => `(${vv.x.toFixed(3)},${vv.y.toFixed(3)},${vv.z.toFixed(3)},${vv.w.toFixed(3)})[${vv.length().toFixed(3)}]`;
    const forward = get_backward_facing();
    const forward_label = document.getElementById("forward_vector");
    const target_label = document.getElementById("target_quaternion");

    forward_label.textContent = `forward ${get_directions(forward).rpad('_', 4)} ${format_vec3(forward)}`;
    target_label.textContent = `target ${format_vec4(target)}`;
};
update_target();

document.onkeydown = (event) => {
    console.log('event keydown', event.which);
    const keyCode = event.which;
    switch (keyCode) {
        case 39: // right
            target.multiplyQuaternions(rot_right, target)
            update_target();
            break;
        case 37: // left
            target.multiplyQuaternions(rot_left, target)
            update_target();
            break;
        case 38: // up
            target.multiplyQuaternions(rot_up, target)
            update_target();
            break;
        case 40: // down
            target.multiplyQuaternions(rot_down, target)
            update_target();
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
visuals_gui.add(dice, 'visible').name('display dice').listen();
visuals_gui.add(cube, 'visible').name('display cube').listen();

//////////////////////////////////////////////

let top_last = Date.now();
let tt = 0
const animate = () => {
    var top_current = Date.now();
    var dt = Math.min(1e-3 * (top_current - top_last), 50e-3);
    top_last = top_current;

    const dice_loaded_and_visible = dice.children.length > 0 && dice.visible;
    const cube_loaded_and_visible = cube.children.length > 0 && cube.visible;
    placeholder.visible = !dice_loaded_and_visible && !cube_loaded_and_visible;

    if (visuals.env_animated)
        camera_rig.rotation.y += .3 * dt;

    if (visuals.main_animated)
        THREE.Quaternion.slerp(root.quaternion, target, root.quaternion, Math.min(10 * dt, 1));

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};
animate();
