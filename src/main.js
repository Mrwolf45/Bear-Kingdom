
import * as THREE from 'three';
import './style.css';

const mount = document.querySelector('#game');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9fc2c2);
scene.fog = new THREE.Fog(0x9fc2c2, 24, 105);

const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 180);
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xd9edff, 0x425536, 2.0));

const sun = new THREE.DirectionalLight(0xffe2ae, 2.2);
sun.position.set(-25, 45, 20);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

const mat = (color, roughness = 1) => new THREE.MeshStandardMaterial({ color, roughness });
const groundMat = mat(0x527744);
const trunkMat = mat(0x60432b);
const leafMat = mat(0x245b38);
const leaf2 = mat(0x347047);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(180, 180), groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const grid = new THREE.GridHelper(180, 45, 0x6b8c58, 0x6b8c58);
grid.position.y = 0.015;
grid.material.opacity = 0.12;
grid.material.transparent = true;
scene.add(grid);

function tree(x, z, s = 1) {
    const g = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22 * s, 0.34 * s, 2.5 * s, 7),
        trunkMat
    );
    trunk.position.y = 1.25 * s;
    trunk.castShadow = true;
    g.add(trunk);

    for (let i = 0; i < 3; i++) {
        const crown = new THREE.Mesh(
            new THREE.ConeGeometry((1.35 - i * 0.18) * s, 2.2 * s, 7),
            i % 2 ? leaf2 : leafMat
        );
        crown.position.y = (2.3 + i * 0.72) * s;
        crown.castShadow = true;
        g.add(crown);
    }

    g.position.set(x, 0, z);
    scene.add(g);
}

for (let i = 0; i < 105; i++) {
    let x = (Math.random() - 0.5) * 145;
    let z = (Math.random() - 0.5) * 145;

    if (Math.abs(x) < 12 && Math.abs(z) < 16) continue;
    tree(x, z, 0.7 + Math.random() * 0.8);
}

function building(x, z, color = 0x9a7448, scale = 1) {
    const group = new THREE.Group();

    const base = new THREE.Mesh(
        new THREE.BoxGeometry(5 * scale, 3.2 * scale, 4 * scale),
        mat(color)
    );
    base.position.y = 1.6 * scale;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(3.8 * scale, 2.3 * scale, 4),
        mat(0x503b2d)
    );
    roof.position.y = 4.25 * scale;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    group.position.set(x, 0, z);
    scene.add(group);
    return group;
}

const castle = building(0, -13, 0xb29a70, 1.65);
const market = building(15, 4, 0xb98b4e, 0.9);

const sign = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.7, 0.2),
    mat(0x4a2d1c)
);
sign.position.set(15, 2.2, 1.9);
scene.add(sign);

const path = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 34),
    mat(0xb7a078)
);
path.rotation.x = -Math.PI / 2;
path.position.set(7.5, 0.025, -8);
scene.add(path);

function makePerson() {
    const g = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.48, 0.9, 4, 8),
        mat(0x355c73)
    );
    body.position.y = 1.15;
    body.castShadow = true;
    g.add(body);

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.34, 10, 8),
        mat(0xd7a77c)
    );
    head.position.y = 2;
    head.castShadow = true;
    g.add(head);

    const hood = new THREE.Mesh(
        new THREE.ConeGeometry(0.42, 0.55, 8),
        mat(0x493629)
    );
    hood.position.y = 2.35;
    g.add(hood);

    const bow = new THREE.Mesh(
        new THREE.TorusGeometry(0.42, 0.045, 5, 12, Math.PI),
        mat(0x9b6a32)
    );
    bow.position.set(0.58, 1.25, 0.05);
    bow.rotation.z = -Math.PI / 2;
    g.add(bow);

    return g;
}

const player = makePerson();
player.position.set(0, 0, 4);
scene.add(player);

function makeBear(x, z) {
    const g = new THREE.Group();
    const brown = mat(0x68432b);
    const dark = mat(0x35251b);

    const torso = new THREE.Mesh(
        new THREE.SphereGeometry(1, 12, 10),
        brown
    );
    torso.scale.set(1.05, 0.78, 1.45);
    torso.position.y = 1.05;
    torso.castShadow = true;
    g.add(torso);

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.58, 10, 8),
        brown
    );
    head.position.set(0, 1.65, -1.12);
    head.castShadow = true;
    g.add(head);

    const muzzle = new THREE.Mesh(
        new THREE.SphereGeometry(0.27, 8, 6),
        dark
    );
    muzzle.scale.set(1, 0.65, 1);
    muzzle.position.set(0, 1.48, -1.58);
    g.add(muzzle);

    for (const a of [-1, 1]) {
        const ear = new THREE.Mesh(
            new THREE.SphereGeometry(0.19, 8, 6),
            brown
        );
        ear.position.set(a * 0.42, 2.08, -1.08);
        g.add(ear);

        const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.25, 0.85, 7),
            brown
        );
        leg.position.set(a * 0.62, 0.48, 0.68);
        g.add(leg);
    }

    g.position.set(x, 0, z);
    scene.add(g);

    return {
        group: g,
        hp: 2,
        alive: true,
        phase: Math.random() * 6
    };
}

const bears = [
    makeBear(-10, -5),
    makeBear(18, -19),
    makeBear(-22, 20),
    makeBear(27, 27),
    makeBear(-32, -26)
];

let coins = 0;
let meat = 0;
let health = 100;
let castleLevel = 1;
let workers = 0;
let xp = 0;

const $ = id => document.getElementById(id);

function updateHud() {
    $('coins').textContent = coins;
    $('meat').textContent = meat;
    $('health').textContent = health;

    $('objective').textContent =
        meat === 0
            ? 'Find a bear and hunt it'
            : meat < 5
                ? 'Collect more meat, then sell it'
                : 'Visit the market and sell your meat';
}

let toastTimer;

function toast(msg) {
    $('toast').textContent = msg;
    $('toast').style.display = 'block';

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        $('toast').style.display = 'none';
    }, 2600);
}

const keys = { x: 0, z: 0 };
let joyPointer = null;

const joy = $('joystick');
const stick = $('stick');

joy.addEventListener('pointerdown', e => {
    joyPointer = e.pointerId;
    joy.setPointerCapture(e.pointerId);
    moveJoy(e);
});

joy.addEventListener('pointermove', e => {
    if (e.pointerId === joyPointer) moveJoy(e);
});

function moveJoy(e) {
    const r = joy.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    let dx = e.clientX - cx;
    let dy = e.clientY - cy;

    const len = Math.hypot(dx, dy);
    const max = 31;

    if (len > max) {
        dx = dx / len * max;
        dy = dy / len * max;
    }

    stick.style.transform = `translate(${dx}px,${dy}px)`;
    keys.x = dx / max;
    keys.z = dy / max;
}

function releaseJoy(e) {
    if (e.pointerId === joyPointer) {
        joyPointer = null;
        keys.x = 0;
        keys.z = 0;
        stick.style.transform = 'translate(0,0)';
    }
}

joy.addEventListener('pointerup', releaseJoy);
joy.addEventListener('pointercancel', releaseJoy);

let lastAttack = 0;

$('attack').onclick = () => {
    const now = performance.now();

    if (now - lastAttack < 650) return;
    lastAttack = now;

    let target = null;
    let dist = 999;

    for (const b of bears) {
        if (!b.alive) continue;

        const d = player.position.distanceTo(b.group.position);

        if (d < dist) {
            dist = d;
            target = b;
        }
    }

    if (!target || dist > 5.5) {
        toast('Bear ke qareeb jao!');
        return;
    }

    target.hp--;

    toast(
        target.hp <= 0
            ? 'Bear hunted! Meat collected.'
            : 'Good hit! One more hit.'
    );

    if (target.hp <= 0) {
        target.alive = false;
        target.group.visible = false;
        meat += 3;
        xp += 20;

        updateHud();
        toast('+3 meat • +20 hunting XP');
    }
};

$('sell').onclick = () => {
    const d = player.position.distanceTo(market.position);

    if (d > 9) {
        toast('Market ke paas jao!');
        return;
    }

    if (meat === 0) {
        toast('Sell karne ke liye meat nahi hai.');
        return;
    }

    const earned = meat * 12;
    coins += earned;
    meat = 0;

    updateHud();
    toast(`Meat sold! +${earned} coins`);
};

$('upgrade').onclick = () => {
    const cost = castleLevel * 100;

    if (coins < cost) {
        toast(`Castle upgrade ke liye ${cost} coins chahiye.`);
        return;
    }

    coins -= cost;
    castleLevel++;

    castle.scale.multiplyScalar(1.08);

    castle.traverse(o => {
        if (o.isMesh) o.material = o.material.clone();
    });

    updateHud();
    toast(`Castle upgraded to level ${castleLevel}!`);
};

$('hire').onclick = () => {
    const cost = workers * 75 + 75;

    if (coins < cost) {
        toast(`Worker hire karne ke liye ${cost} coins chahiye.`);
        return;
    }

    coins -= cost;
    workers++;

    const npc = makePerson();
    npc.scale.set(0.75, 0.75, 0.75);
    npc.position.set(4 + workers * 1.2, 0, -11);
    scene.add(npc);

    updateHud();
    toast(`Worker hired! Total workers: ${workers}`);
};

const cameraOffset = new THREE.Vector3(0, 8, 12);

let prev = performance.now();

function animate(now) {
    requestAnimationFrame(animate);

    const dt = Math.min((now - prev) / 1000, 0.04);
    prev = now;

    const move = new THREE.Vector3(keys.x, 0, keys.z);

    if (move.length() > 1) move.normalize();

    player.position.x += move.x * dt * 8;
    player.position.z += move.z * dt * 8;

    player.position.x = THREE.MathUtils.clamp(player.position.x, -72, 72);
    player.position.z = THREE.MathUtils.clamp(player.position.z, -72, 72);

    if (move.lengthSq() > 0.01) {
        player.rotation.y = Math.atan2(move.x, move.z);
    }

    for (const b of bears) {
        if (!b.alive) continue;

        b.phase += dt;

        const d = b.group.position.distanceTo(player.position);

        if (d < 11) {
            const dir = new THREE.Vector3()
                .subVectors(player.position, b.group.position)
                .setY(0)
                .normalize();

            b.group.position.addScaledVector(dir, dt * (d < 3 ? 1.5 : 1.0));
            b.group.rotation.y = Math.atan2(dir.x, dir.z);
        } else {
            b.group.position.x += Math.sin(b.phase * 0.5) * dt * 0.35;
            b.group.position.z += Math.cos(b.phase * 0.4) * dt * 0.35;
        }
    }

    const desired = player.position.clone().add(cameraOffset);

    camera.position.lerp(desired, 0.08);
    camera.lookAt(
        player.position.x,
        player.position.y + 1.1,
        player.position.z - 2
    );

    renderer.render(scene, camera);
}

requestAnimationFrame(animate);

window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

updateHud();
toast('Welcome hunter! Explore the forest.');
  
