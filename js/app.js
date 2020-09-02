String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

console.log("app started")

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.getContext().lineWidth(100);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();


/*{
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const cube = new THREE.Mesh( geometry, material );
    cube.scale.x *= .5;
    cube.scale.y *= .5;
    cube.scale.z *= .5;

    //scene.add( cube );

    const wireframe = new THREE.WireframeGeometry( geometry );
    console.log("wireframe", wireframe);

    const line = new THREE.LineSegments( wireframe, new THREE.LineBasicMaterial( {
        color: 0xf00fff,
        linewidth: 1,
        linecap: 'round', //ignored by WebGLRenderer
        linejoin:  'round' //ignored by WebGLRenderer
    } ));
    line.scale.x *= .55;
    line.scale.y *= .55;
    line.scale.z *= .55;
    //line.material.depthTest = false;
    //line.material.opacity = 0.25;
    //line.material.transparent = true;
    // line.material.color = 0xff0000;

    // scene.add(line);
}*/

let objs = [];
let root = new THREE.Mesh();
root.rotation.z = Math.PI / 10;
root.rotation.x = Math.PI / 10;
scene.add(root);

const ss = .5;
let points = [];

{
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

let current_vertex = 0;
let vertices = [];
let is_animated = false;
let display_all = true;

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

const update_current_position = () => {
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
let go_east = () => {
    const next = [
        3, 8, 13, 10,
        15, 12, 9, 14,
        11, 0, 5, 2,
        7, 4, 1, 6,
    ];
    // console.log("before", current_vertex)
    current_vertex = next[current_vertex];
    // console.log("after", current_vertex)
    update_current_position();
};
let go_west = () => {
    const next = [
        9, 14, 11, 0,
        13, 10, 15, 12,
        1, 6, 3, 8,
        5, 2, 7, 4,
    ];
    // console.log("before", current_vertex)
    current_vertex = next[current_vertex];
    // console.log("after", current_vertex)
    update_current_position();
};

document.onkeydown = (event) => {
    console.log('event.which', event.which);
    const keyCode = event.which;
    if (keyCode == 38) { // up
        current_vertex++;
        current_vertex %= 16;
        update_current_position();
    } else if (keyCode == 40) { // down
        current_vertex += 15;
        current_vertex %= 16;
        update_current_position();
    } else if (keyCode == 76) { // ll
        current_vertex = 0;
        vertices = [];
        update_current_position();
        display_all = !display_all;
    } else if (keyCode == 39) { // right
        go_east();
    } else if (keyCode == 37) { // left
        go_west();
    } else if (keyCode == 32) { // space
        is_animated = !is_animated;
    }
    // animate();
};

let xx_prev = 0;
let yy_prev = 0;
let target_angle = 0;
const update_target_angle = () => {
    const label = document.getElementById("target_angle");
    label.textContent = `${Math.round(180*target_angle/Math.PI)}°`;
};
update_target_angle();

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
    if (is_animated) {
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
        obj.visible = (selection == kk++) || display_all;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
animate();

console.log("app main loop")
