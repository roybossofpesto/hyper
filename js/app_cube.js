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

//////////////////////////////////////////////

console.log("app started")

const main_container = document.getElementById('main_container');
console.log("main_container", main_container.clientWidth, main_container.clientHeight);
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

            const load_and_add = (group, name) => (data) => {
                const mesh = data.scene.children[0];
                mesh.material.envMapIntensity = 3;
                console.log('loaded mesh', name);
                group.add(mesh);

                mesh.material.envMap = env_map.texture;
                mesh.material.needsUpdate = true;
                for (const child of mesh.children) {
                    child.material.envMap = env_map.texture;
                    child.material.needsUpdate = true;
                }
            };

            gltf_loader.load('dice.glb', load_and_add(dice, "dice"));
            gltf_loader.load('cube.glb', load_and_add(cube, "cube"));
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

// const get_forward_front = (qq) => {
//     const front = new THREE.Vector3(0, 0, 1);
//     front.applyQuaternion(qq);
//     return front;
// };

const get_backward_front = (qq) => {
    const front = new THREE.Vector3(0, 0, 1);
    const qq_inv = qq.clone();
    qq_inv.inverse();
    front.applyQuaternion(qq_inv);
    return front;
};

const get_forward_up = (qq, direction) => {
    const ups = {
        "I": new THREE.Vector3(0, 1, 0),
        "II": new THREE.Vector3(0, 0, 1),
        "III": new THREE.Vector3(0, 1, 0),
        "IV": new THREE.Vector3(0, 1, 0),
        "V": new THREE.Vector3(0, 0, -1),
        "VI": new THREE.Vector3(0, 1, 0),
    };
    const up = ups[direction];
    up.applyQuaternion(qq);
    return up;
};

// const get_backward_up = (qq, direction) => {
//     const up = new THREE.Vector3(0, 1, 0);
//     const qq_inv = qq.clone();
//     qq_inv.inverse();
//     up.applyQuaternion(qq_inv);
//     return up;
// };

const get_direction = (ww) => {
    const directions = {
        "I": new THREE.Vector3(0, 0, 1),
        "II": new THREE.Vector3(0, -1, 0),
        "III": new THREE.Vector3(1, 0, 0),
        "IV": new THREE.Vector3(-1, 0, 0),
        "V": new THREE.Vector3(0, 1, 0),
        "VI": new THREE.Vector3(0, 0, -1),
    };
    for (const [label, vv] of Object.entries(directions)) {
        const close_enough = ww.distanceTo(vv) < 1e-3;
        if (close_enough) return label;
    }
    return "??";
};

const get_angle_to_unit = (qq) => {
    const unit = new THREE.Quaternion();
    return unit.angleTo(qq);
}

const update_target = () => {
    const format_vec3 = (vv) => `(${vv.x.toFixed(3)},${vv.y.toFixed(3)},${vv.z.toFixed(3)})[${vv.length().toFixed(3)}]`;
    const format_vec4 = (vv) => `(${vv.x.toFixed(3)},${vv.y.toFixed(3)},${vv.z.toFixed(3)},${vv.w.toFixed(3)})[${vv.length().toFixed(3)}]`;
    const state_label = document.getElementById("state_label");
    const vector_label = document.getElementById("vector_label");

    const front = get_backward_front(target);
    const direction = get_direction(front);
    const up = get_forward_up(target, direction);

    const angle = get_angle_to_unit(target) * 180 / Math.PI;
    state_label.textContent = `${direction.rpad('_', 4)} ${angle.toFixed(1)}°`;
    vector_label.innerHTML = `target ${format_vec4(target)}<br/>front ${format_vec3(front)}<br/>up ${format_vec3(up)}`;
};
update_target();

//////////////////////////////////////////////

const visuals = {
    main_animated: true,
    env_animated: true,
};

const rot_right = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
const rot_left = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
const rot_up = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
const rot_down = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
const rot_cw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
const rot_ccw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2);

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
        case 79: // o
            target.multiplyQuaternions(rot_cw, target)
            update_target();
            break;
        case 80: // p
            target.multiplyQuaternions(rot_ccw, target)
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
