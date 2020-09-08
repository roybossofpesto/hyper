String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

console.log("app started")

const main_container = document.getElementById('main_container');
console.log(main_container.clientWidth, main_container.clientHeight);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, main_container.clientWidth / main_container.clientHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(main_container.clientWidth, main_container.clientHeight);
renderer.setClearColor(0x070707);
main_container.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

let objs = [];
let root = new THREE.Mesh();
root.rotation.z = Math.PI / 10;
root.rotation.x = Math.PI / 10;
scene.add(root);

let points = [];

{
    const ss = .5;

    points.push(new THREE.Vector3(1, 1, 1));
    points.push(new THREE.Vector3(1, 1, -1));
    points.push(new THREE.Vector3(1, -1, -1));
    points.push(new THREE.Vector3(1, -1, 1));

    points.push(new THREE.Vector3(ss, -ss, ss));
    points.push(new THREE.Vector3(-ss, -ss, ss));
    points.push(new THREE.Vector3(-ss, ss, ss));
    points.push(new THREE.Vector3(-ss, ss, -ss));

    points.push(new THREE.Vector3(-1, 1, -1));
    points.push(new THREE.Vector3(-1, 1, 1));
    points.push(new THREE.Vector3(-1, -1, 1));
    points.push(new THREE.Vector3(-1, -1, -1));

    points.push(new THREE.Vector3(-ss, -ss, -ss));
    points.push(new THREE.Vector3(ss, -ss, -ss));
    points.push(new THREE.Vector3(ss, ss, -ss));
    points.push(new THREE.Vector3(ss, ss, ss));

    points.push(new THREE.Vector3(1, 1, 1));
}

{ // north south hamiltonian
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({
        color: 0xffffff
    });

    const north_south = new THREE.Line(geometry, material);
    objs.push(north_south);
}

{
    const make_scaled_segments = (indices, color, scale = new THREE.Vector4(1, 1, 1, 1)) => {
        var points_ = [];

        for (let kk = 0, kk_max = indices.length; kk < kk_max; kk += 2) {
            const ii = indices[kk];
            const jj = indices[kk + 1];
            let pii = new THREE.Vector3(scale.x * points[ii].x, scale.y * points[ii].y, scale.z * points[ii].z);
            let pjj = new THREE.Vector3(scale.x * points[jj].x, scale.y * points[jj].y, scale.z * points[jj].z);
            const factor = 1 / (1 - scale.w / 2);
            pii.multiplyScalar(factor)
            pjj.multiplyScalar(factor)
            // pii.x += delta;
            // pjj += delta;
            // console.log("*****", ii, jj, pii, pjj);
            points_.push(pii);
            points_.push(pjj);
        }
        var geometry_ = new THREE.BufferGeometry().setFromPoints(points_);

        var material_ = new THREE.LineBasicMaterial({
            color: color,
        });
        var object_ = new THREE.LineSegments(geometry_, material_);

        return object_;
    }

    const edges_rot_x = [
        0, 1, 1, 2, 2, 3, 3, 0,
        8, 9, 9, 10, 10, 11, 11, 8,
        4, 13, 13, 14, 14, 15, 15, 4,
        5, 6, 6, 7, 7, 12, 12, 5,

    ];

    const edges_rot_y = [
        0, 1, 1, 8, 8, 9, 9, 0,
        15, 14, 14, 7, 7, 6, 6, 15,
        4, 13, 13, 12, 12, 5, 5, 4,
        3, 2, 2, 11, 11, 10, 10, 3,
    ];

    const edges_rot_z = [
        0, 3, 3, 10, 10, 9, 9, 0,
        4, 5, 5, 6, 6, 15, 15, 4,
        12, 13, 13, 14, 14, 7, 7, 12,
        11, 2, 2, 1, 1, 8, 8, 11,
    ];

    const edges_rot_w = [
        0, 15, 15, 4, 4, 3, 3, 0,
        2, 13, 13, 14, 14, 1, 1, 2,
        7, 8, 8, 11, 11, 12, 12, 7,
        6, 9, 9, 10, 10, 5, 5, 6,
    ];

    const bevel_width = .95;

    objs.push(make_scaled_segments(edges_rot_x, 0x550000, new THREE.Vector4(1, bevel_width, bevel_width, 0)));
    objs.push(make_scaled_segments(edges_rot_y, 0x005500, new THREE.Vector4(bevel_width, 1, bevel_width, 0)));
    objs.push(make_scaled_segments(edges_rot_z, 0x000055, new THREE.Vector4(bevel_width, bevel_width, 1, 0)));
    objs.push(make_scaled_segments(edges_rot_w, 0x555555, new THREE.Vector4(1, bevel_width, 1, -.1)));

    for (let obj of objs)
        root.add(obj);
}

{
    const geometry = new THREE.IcosahedronBufferGeometry(.2, 2);
    const material = new THREE.MeshPhongMaterial({
        color: 0xaa0000
    });
    var marker_tip = new THREE.Mesh(geometry, material);
    root.add(marker_tip);
}

{
    const geometry = new THREE.IcosahedronBufferGeometry(.1, 2);
    const material = new THREE.MeshPhongMaterial({
        color: 0xffaa00
    });

    var markers_trail = new THREE.InstancedMesh(geometry, material, 7);
    root.add(markers_trail);
}

{
    // const geometry = new THREE.BoxBufferGeometry(2, .15, .15);
    const geometry = new THREE.CylinderBufferGeometry(.075, .075, 2);
    const texture = loader.load('uv_pattern.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 8);
    const material = new THREE.MeshPhongMaterial({
        map: texture
    });

    var tubes_trail = new THREE.InstancedMesh(geometry, material, 7);
    root.add(tubes_trail);
}

{
    const directionalLight = new THREE.DirectionalLight(0xaaaaaa, 0.5);
    directionalLight.position.set(-2, 2, 1);
    scene.add(directionalLight);
}

{
    var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(light);
}

camera.position.z = 4;

const make_tube = (tubes, kk, ii, jj) => {
    const pi = points[ii];
    const pj = points[jj];

    const center = new THREE.Vector3();
    center.addVectors(pj, pi);
    center.divideScalar(2);

    const ex = new THREE.Vector3();
    ex.subVectors(pj, pi);
    ex.divideScalar(2);

    const ey = new THREE.Vector3();
    ey.crossVectors(ex, new THREE.Vector3(0, 0, 1));
    if (ey.lengthSq() < 1e-3) ey.crossVectors(ex, new THREE.Vector3(0, 1, 0));
    if (ey.lengthSq() < 1e-3) ey.crossVectors(ex, new THREE.Vector3(1, 0, 0));
    ey.normalize();

    const ez = new THREE.Vector3();
    ez.crossVectors(ex, ey);
    ez.normalize();

    const transform = new THREE.Matrix4();
    transform.makeBasis(ez, ex, ey);
    transform.setPosition(center);

    // console.log("***", kk, center, ey.lengthSq());
    tubes.setMatrixAt(kk, transform);
}

const reset_trail = (tubes, markers) => {
    const transform = new THREE.Matrix4().set(
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    );
    for (let kk = 0; kk < tubes.count; kk++)
        tubes.setMatrixAt(kk, transform);
    for (let kk = 0; kk < markers.count; kk++)
        markers.setMatrixAt(kk, transform);
}

const disto = new Tone.Distortion(0.8).toDestination();

const synth = new Tone.Synth().connect(disto);

const reverb_ = new Tone.Reverb({
    decay: 4.,
    preDelay: 0.01
}).connect(disto);
const synth_ = new Tone.Synth().connect(reverb_);

// const synth = new Tone.Synth().toDestination();

const notes_penta = [ // penta
    "C2", "D2", "E2", "G2", "B2",
    "C3", "D3", "E3", "G3", "B3",
    "C4", "D4", "E4", "G4", "B4",
    "C5",
];

const notes_diatonic = [ // diatonic
    "C2", "D2", "E2", "F2", "G2", "A2", "B2",
    "C3", "D3", "E3", "F3", "G3", "A3", "B3",
    "C4", "D4",
];

scales = {
    "penta": notes_penta,
    "diatonic": notes_diatonic,
}

notes = scales["penta"];

const get_note = (vertex, pitch) => {
    let aa = new Tone.Frequency(notes[vertex]);
    aa = aa.transpose(pitch);
    return aa;
}

let sampler_loaded = false;
let sampler = new Tone.Sampler({
    "C3": 'samples/kick.wav',
    "D3": 'samples/snare.wav',
    "E3": 'samples/tom.wav',
    "F3": 'samples/hihat.wav',
}, () => {
    console.log("loaded samples");
    sampler_loaded = true;
}).toDestination();

sampler.volume.value = -13;
synth.volume.value = -27;
synth_.volume.value = -25;

let current_vertex = 0;
let vertices = [];
const visuals = {
    is_animated: false,
    display_all: true,
};

const update_current_position = (drum_note) => {
    if (drum_note) {
        Tone.context.lookAhead = 0
        Tone.start();
        const top = Tone.now() - .15;
        if (top > 0) {
            const note = new Tone.Frequency(get_note(current_vertex, 0));
            const note_ = new Tone.Frequency(get_note(current_vertex, 24));
            synth.triggerAttackRelease(note, "1n", top);
            synth_.triggerAttackRelease(note_, "1n", top);
            if (sampler_loaded)
                sampler.triggerAttack(drum_note, top);
        }

    }

    const label = document.getElementById("current_position");
    label.textContent = "";
    label.textContent += `p${(current_vertex+1).toString().lpad("0", 2)} ... `;

    for (let kk = vertices.length - 1; kk >= 0; kk--)
        label.textContent += `p${(vertices[kk]+1).toString().lpad("0", 2)} `;

    for (let kk = 0; kk < markers_trail.count; kk++) {
        if (kk >= vertices.length)
            break;
        const point = points[vertices[kk]];
        const transform = new THREE.Matrix4();
        transform.setPosition(point);
        markers_trail.setMatrixAt(kk, transform);
    }
    markers_trail.instanceMatrix.needsUpdate = true;

    let ii = current_vertex;
    for (let kk = 0; kk < markers_trail.count; kk++) {
        if (kk >= vertices.length)
            break;
        const jj = vertices[vertices.length - 1 - kk];
        make_tube(tubes_trail, kk, ii, jj)
        ii = jj;
    }
    tubes_trail.instanceMatrix.needsUpdate = true;

    vertices.push(current_vertex);
    while (vertices.length > 7)
        vertices.shift();
    // console.log(vertices);
};
update_current_position();
const go_east = () => {
    const next = [
        3, 8, 13, 10,
        15, 12, 9, 14,
        11, 0, 5, 2,
        7, 4, 1, 6,
    ];
    // console.log("before", current_vertex)
    current_vertex = next[current_vertex];
    // console.log("after", current_vertex)
    update_current_position("E3");
};
const go_west = () => {
    const next = [
        9, 14, 11, 0,
        13, 10, 15, 12,
        1, 6, 3, 8,
        5, 2, 7, 4,
    ];
    // console.log("before", current_vertex)
    current_vertex = next[current_vertex];
    // console.log("after", current_vertex)
    update_current_position("F3");
};
const go_north = () => {
    current_vertex++;
    current_vertex %= 16;
    update_current_position("D3");
};
const go_south = () => {
    current_vertex += 15;
    current_vertex %= 16;
    update_current_position("C3");
};


let xx_prev = 0;
let yy_prev = 0;
let target_angle = 0;
const update_target_angle = () => {
    const label = document.getElementById("target_angle");
    label.textContent = `${Math.round(180*target_angle/Math.PI)}°`;
};
update_target_angle();

const reset = () => {
    target_angle = 0;
    root.rotation.y = 0;
    current_vertex = 0;
    vertices = [];
    reset_trail(tubes_trail, markers_trail);
    update_current_position();
    update_target_angle();
};

document.onkeydown = (event) => {
    console.log('event.which', event.which);
    const keyCode = event.which;
    if (keyCode == 38) { // up
        go_north();
    } else if (keyCode == 40) { // down
        go_south();
    } else if (keyCode == 39) { // right
        go_east();
    } else if (keyCode == 37) { // left
        go_west();
    } else if (keyCode == 32) { // space
        visuals.is_animated = !visuals.is_animated;
    } else if (keyCode == 82) { // rr
        reset();
    } else if (keyCode == 83) { // ss
        shuffle(notes);
    } else if (keyCode == 76) { // ll
        visuals.display_all = !visuals.display_all;
    }

    // animate();
};
renderer.domElement.onmousemove = (event) => {
    if (event.buttons != 1)
        return;
    const xx_delta = -3.5e-3 * Math.max(Math.min(xx_prev - event.clientX, 200), -200);
    const yy_delta = 3.5e-3 * Math.max(Math.min(yy_prev - event.clientY, 200), -200);
    // console.log('mouse', xx_prev - event.clientX)
    xx_prev = event.clientX;
    yy_prev = event.clientY;
    target_angle += xx_delta;
    update_target_angle();
};
renderer.domElement.onmousedown = (event) => {
    if (event.buttons != 1)
        return;
    // console.log("down", event);
    xx_prev = event.clientX;
    yy_prev = event.clientY;
}
renderer.domElement.onmouseup = (event) => {
    // console.log("up", event);
    xx_prev = 0;
    yy_prev = 0;
}

let top_last = Date.now();
const animate = () => {
    var top_current = Date.now();
    var dt = Math.min(1e-3 * (top_current - top_last), 50e-3);
    top_last = top_current;

    tubes_trail.material.map.offset.y += 2.5 * dt;
    tubes_trail.material.map.offset.x += 1.5 * dt;
    if (visuals.is_animated) {
        target_angle += dt;
        update_target_angle();
    }

    const angle_delta = target_angle - root.rotation.y;
    // console.log("angle_delta", angle_delta * dt, target_angle, root.rotation.y);
    root.rotation.y += 7.5 * angle_delta * dt;

    const current_point = points[current_vertex];
    // console.log(current_vertex, current_point);
    marker_tip.position.x = current_point.x;
    marker_tip.position.y = current_point.y;
    marker_tip.position.z = current_point.z;

    let kk = 0;
    const selection = getRandomInt(objs.length);
    for (let obj of objs)
        obj.visible = (selection == kk++) || visuals.display_all;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};
animate();

const main_gui = new dat.GUI();

const audio_gui = main_gui.addFolder('Audio');
audio_gui.add(sampler.volume, 'value').min(-60).max(0).name('sampler');
audio_gui.add(synth.volume, 'value').min(-60).max(0).name('synth');
audio_gui.add(synth_.volume, 'value').min(-60).max(0).name('synth_');

const callbacks = {
    reset: reset,
    north: go_north,
    south: go_south,
    east: go_east,
    west: go_west,
    set_penta_scale: () => {
        console.log("penta")
        notes = scales["penta"];
    },
    set_diatonic_scale: () => {
        console.log("diatonic")
        notes = scales["diatonic"];
    },
};

const scales_gui = main_gui.addFolder('Scale');
scales_gui.add(callbacks, 'set_penta_scale').name('penta');
scales_gui.add(callbacks, 'set_diatonic_scale').name('diatonic');

const callbacks_gui = main_gui.addFolder('Controls');
callbacks_gui.add(callbacks, 'reset').name('reset [r]');
callbacks_gui.add(callbacks, 'north').name('N snare [up]');
callbacks_gui.add(callbacks, 'south').name('S kick [down]');
callbacks_gui.add(callbacks, 'east').name('E tom [right]');
callbacks_gui.add(callbacks, 'west').name('W hihat [left]');

const visuals_gui = main_gui.addFolder('Visuals');
visuals_gui.add(visuals, 'display_all').name('not strobe [l]').listen();
visuals_gui.add(visuals, 'is_animated').name('animation&nbsp;[space]').listen();

console.log("app main loop");
