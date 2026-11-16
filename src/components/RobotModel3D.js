/**
 * NOVA: a small, self-contained, real 3D robot renderer. All forms are
 * procedurally built from WebGL triangle meshes with depth-tested surfaces,
 * perspective projection, three-dimensional lighting and independent joints.
 * No downloaded model, image, external runtime or third-party robot asset.
 */
const PI = Math.PI;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const mix = (a, b, t) => a + (b - a) * t;
const rad = d => d * PI / 180;

function identity() {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
}
function mul(a, b) {
  const out = new Float32Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
    let value = 0;
    for (let k = 0; k < 4; k++) value += a[k * 4 + r] * b[c * 4 + k];
    out[c * 4 + r] = value;
  }
  return out;
}
function translate(x, y, z) {
  const m = identity(); m[12] = x; m[13] = y; m[14] = z; return m;
}
function scale(x, y, z) {
  const m = identity(); m[0] = x; m[5] = y; m[10] = z; return m;
}
function rotationX(a) {
  const m = identity(), c = Math.cos(a), s = Math.sin(a);
  m[5] = c; m[6] = s; m[9] = -s; m[10] = c; return m;
}
function rotationY(a) {
  const m = identity(), c = Math.cos(a), s = Math.sin(a);
  m[0] = c; m[2] = -s; m[8] = s; m[10] = c; return m;
}
function rotationZ(a) {
  const m = identity(), c = Math.cos(a), s = Math.sin(a);
  m[0] = c; m[1] = s; m[4] = -s; m[5] = c; return m;
}
function node(parent, position = [0, 0, 0], rotation = [0, 0, 0]) {
  let m = mul(parent, translate(...position));
  if (rotation[1]) m = mul(m, rotationY(rotation[1]));
  if (rotation[0]) m = mul(m, rotationX(rotation[0]));
  if (rotation[2]) m = mul(m, rotationZ(rotation[2]));
  return m;
}
function perspective(fov, aspect, near, far) {
  const f = 1 / Math.tan(fov / 2), d = 1 / (near - far);
  const m = new Float32Array(16);
  m[0] = f / aspect; m[5] = f; m[10] = (far + near) * d;
  m[11] = -1; m[14] = 2 * far * near * d; return m;
}
function normalize(v) {
  const l = Math.hypot(...v) || 1; return v.map(x => x / l);
}
function lookAt(eye, target) {
  const z = normalize(eye.map((x, i) => x - target[i]));
  const x = normalize([z[2], 0, -z[0]]);
  const y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]];
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -x.reduce((a, n, i) => a + n * eye[i], 0),
    -y.reduce((a, n, i) => a + n * eye[i], 0),
    -z.reduce((a, n, i) => a + n * eye[i], 0), 1,
  ]);
}

function sphereGeometry(lat = 28, lon = 40) {
  const points = [], normals = [], uvs = [], indices = [];
  for (let j = 0; j <= lat; j++) {
    const theta = PI * j / lat;
    for (let i = 0; i <= lon; i++) {
      const phi = 2 * PI * i / lon;
      const n = [Math.sin(theta) * Math.cos(phi), Math.cos(theta), Math.sin(theta) * Math.sin(phi)];
      points.push(...n); normals.push(...n); uvs.push(i / lon, 1 - j / lat);
    }
  }
  for (let j = 0; j < lat; j++) for (let i = 0; i < lon; i++) {
    const a = j * (lon + 1) + i, b = a + lon + 1;
    indices.push(a, a + 1, b, a + 1, b + 1, b);
  }
  return { points, normals, uvs, indices };
}
function torusGeometry(major = 1, minor = 0.08, ring = 64, tube = 12) {
  const points = [], normals = [], uvs = [], indices = [];
  for (let i = 0; i <= ring; i++) {
    const u = i * 2 * PI / ring, cu = Math.cos(u), su = Math.sin(u);
    for (let j = 0; j <= tube; j++) {
      const v = j * 2 * PI / tube, cv = Math.cos(v), sv = Math.sin(v);
      points.push((major + minor * cv) * cu, minor * sv, (major + minor * cv) * su);
      normals.push(cv * cu, sv, cv * su); uvs.push(i / ring, j / tube);
    }
  }
  for (let i = 0; i < ring; i++) for (let j = 0; j < tube; j++) {
    const a = i * (tube + 1) + j, b = a + tube + 1;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
  return { points, normals, uvs, indices };
}
function cylinderGeometry(segments = 30) {
  const points = [], normals = [], uvs = [], indices = [];
  for (let i = 0; i <= segments; i++) {
    const a = i * 2 * PI / segments, x = Math.cos(a), z = Math.sin(a);
    for (const y of [-1, 1]) {
      points.push(x, y, z); normals.push(x, 0, z); uvs.push(i / segments, (y + 1) / 2);
    }
  }
  for (let i = 0; i < segments; i++) {
    const a = 2 * i;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  for (const sign of [1, -1]) {
    const center = points.length / 3;
    points.push(0, sign, 0); normals.push(0, sign, 0); uvs.push(.5, .5);
    for (let i = 0; i <= segments; i++) {
      const a = i * 2 * PI / segments, x = Math.cos(a), z = Math.sin(a);
      points.push(x, sign, z); normals.push(0, sign, 0); uvs.push(.5 + x / 2, .5 + z / 2);
      if (i < segments) {
        if (sign > 0) indices.push(center, center + i + 2, center + i + 1);
        else indices.push(center, center + i + 1, center + i + 2);
      }
    }
  }
  return { points, normals, uvs, indices };
}
function planeGeometry() {
  return {
    points: [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0],
    normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    uvs: [0, 1, 1, 1, 1, 0, 0, 0],
    indices: [0, 1, 2, 0, 2, 3],
  };
}
function rgba(hex) {
  const c = hex.replace('#', '');
  return [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16) / 255);
}
const vertexShader = `
attribute vec3 aPos;
attribute vec3 aNormal;
attribute vec2 aUV;
uniform mat4 uProj, uView, uModel;
uniform vec3 uNormalFix;
varying vec3 vNormal, vWorld;
varying vec2 vUV;
void main() {
  vec4 world = uModel * vec4(aPos, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(uModel) * (aNormal * uNormalFix));
  vUV = aUV;
  gl_Position = uProj * uView * world;
}`;
const fragmentShader = `
precision highp float;
uniform vec3 uColor, uCam;
uniform float uGlow, uMetal, uAlpha, uUseTexture;
uniform sampler2D uTexture;
varying vec3 vNormal, vWorld;
varying vec2 vUV;
void main() {
  if (uUseTexture > 0.5) {
    vec4 pixel = texture2D(uTexture, vUV);
    if (pixel.a < 0.012) discard;
    gl_FragColor = pixel;
    return;
  }
  vec3 n = normalize(vNormal);
  vec3 view = normalize(uCam - vWorld);
  vec3 key = normalize(vec3(-0.9, 1.3, 1.7));
  vec3 fill = normalize(vec3(1.1, 0.2, -0.65));
  float diffuse = max(dot(n, key), 0.0);
  float cool = max(dot(n, fill), 0.0);
  float spec = pow(max(dot(n, normalize(key + view)), 0.0), mix(24.0, 105.0, uMetal));
  float rim = pow(1.0 - max(dot(n, view), 0.0), 3.0);
  vec3 light = uColor * (0.23 + 0.72 * diffuse + 0.18 * cool);
  light += vec3(1.0, .91, 1.0) * spec * (0.18 + 0.67 * uMetal);
  light += vec3(.23, .65, .82) * rim * (0.12 + 0.28 * uMetal);
  light += uColor * uGlow;
  gl_FragColor = vec4(light, uAlpha);
}`;
function shader(gl, kind, code) {
  const s = gl.createShader(kind);
  gl.shaderSource(s, code); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(s); gl.deleteShader(s); throw new Error(message);
  }
  return s;
}
function program(gl) {
  const vs = shader(gl, gl.VERTEX_SHADER, vertexShader), fs = shader(gl, gl.FRAGMENT_SHADER, fragmentShader);
  const p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
  gl.deleteShader(vs); gl.deleteShader(fs);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  return p;
}
function bufferGeometry(gl, data) {
  const vert = [];
  for (let i = 0; i < data.points.length / 3; i++) {
    vert.push(...data.points.slice(i * 3, i * 3 + 3), ...data.normals.slice(i * 3, i * 3 + 3), ...data.uvs.slice(i * 2, i * 2 + 2));
  }
  const vbo = gl.createBuffer(), ibo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vert), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);
  return { vbo, ibo, count: data.indices.length };
}

/** Returns a real 3D scene controller, or null if WebGL is disabled. */
export function createRobotModel3D(canvas, faceCanvas, { accent = '#B9A5F4', reduced = false, onFailure = () => {}, visibleParts = null } = {}) {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false, depth: true });
  if (!gl) return null;
  const p = program(gl);
  const loc = Object.fromEntries(['uProj', 'uView', 'uModel', 'uNormalFix', 'uColor', 'uCam', 'uGlow', 'uMetal', 'uAlpha', 'uUseTexture', 'uTexture'].map(k => [k, gl.getUniformLocation(p, k)]));
  const attrs = ['aPos', 'aNormal', 'aUV'].map(k => gl.getAttribLocation(p, k));
  const meshes = {
    sphere: bufferGeometry(gl, sphereGeometry()),
    torus: bufferGeometry(gl, torusGeometry()),
    cylinder: bufferGeometry(gl, cylinderGeometry()),
    plane: bufferGeometry(gl, planeGeometry()),
  };
  const faceTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, faceTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
  gl.useProgram(p);
  gl.uniform1i(loc.uTexture, 0);
  gl.uniform3f(loc.uCam, 0, 0.4, 8.3);
  gl.uniformMatrix4fv(loc.uView, false, lookAt([0, 0.4, 8.3], [0, -0.05, 0]));
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.disable(gl.CULL_FACE);
  const lavender = rgba(accent), pearl = rgba('#D9D5F8'), shell = rgba('#75769E'), graphite = rgba('#24283E');
  const purple = rgba('#8178DC'), ink = rgba('#0B1126'), ice = rgba('#80E8EA'), silver = rgba('#A6B1D7');
  const mintDark = rgba('#164554');
  const state = { tx: 0, ty: 0, x: 0, y: 0, expression: 'idle', visible: true, running: true, reduced, frameCount: 0, pointerActive: false, reactionAt: -10000 };
  let request = 0, start = performance.now(), lastFrame = start;

  let drawingPart = 'body';
  const draw = (kind, parent, position, sz, color, opts = {}) => {
    if (visibleParts && !visibleParts.includes(drawingPart)) return;
    const geom = meshes[kind];
    const mat = mul(node(parent, position, opts.rot || [0, 0, 0]), scale(...sz));
    gl.uniformMatrix4fv(loc.uModel, false, mat);
    gl.uniform3f(loc.uNormalFix, 1 / (sz[0] * sz[0]), 1 / (sz[1] * sz[1]), 1 / (sz[2] * sz[2]));
    gl.uniform3fv(loc.uColor, color);
    gl.uniform1f(loc.uGlow, opts.glow || 0);
    gl.uniform1f(loc.uMetal, opts.metal ?? 0.5);
    gl.uniform1f(loc.uAlpha, opts.alpha ?? 1);
    gl.uniform1f(loc.uUseTexture, opts.textured ? 1 : 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, geom.vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geom.ibo);
    for (let i = 0; i < attrs.length; i++) {
      gl.enableVertexAttribArray(attrs[i]);
      gl.vertexAttribPointer(attrs[i], [3, 3, 2][i], gl.FLOAT, false, 32, [0, 12, 24][i]);
    }
    gl.drawElements(gl.TRIANGLES, geom.count, gl.UNSIGNED_SHORT, 0);
  };
  const orb = (parent, pos, sz, color, opts) => draw('sphere', parent, pos, sz, color, opts);
  const ring = (parent, pos, sz, color, opts) => draw('torus', parent, pos, sz, color, opts);
  const rod = (parent, pos, sz, color, opts) => draw('cylinder', parent, pos, sz, color, opts);
  const base = identity();

  function render(now = performance.now()) {
    if (!state.running || !state.visible) return;
    request = 0;
    try {
    state.frameCount += 1;
    const w = Math.max(1, canvas.clientWidth), h = Math.max(1, canvas.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rw = Math.round(w * dpr), rh = Math.round(h * dpr);
    if (canvas.width !== rw || canvas.height !== rh) { canvas.width = rw; canvas.height = rh; }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniformMatrix4fv(loc.uProj, false, perspective(rad(32), w / h, 0.1, 35));
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const t = reduced ? 0 : (now - start) / 1000;
    // Frame-rate-independent head tracking. A fixed per-frame ease felt
    // unresponsive on machines rendering WebGL at 5–20 fps.
    const dt = Math.min(0.18, Math.max(0.001, (now - lastFrame) / 1000));
    lastFrame = now;
    const ease = reduced ? 1 : 1 - Math.exp(-11 * dt);
    state.x = mix(state.x, state.tx, ease);
    state.y = mix(state.y, state.ty, ease);
    const float = reduced ? 0 : 0.115 * Math.sin(t * 1.7);
    const pulse = reduced ? 0 : 0.13 * (Math.sin(t * 3.1) + 1);
    const idleX = state.pointerActive ? 0 : (reduced ? 0 : 0.08 * Math.sin(t * .7));
    const idleY = state.pointerActive ? 0 : (reduced ? 0 : 0.055 * Math.cos(t * .9));
    const reactionAge = (now - state.reactionAt) / 1000;
    const react = reduced || reactionAge < 0 || reactionAge > .85 ? 0 : Math.sin(PI * reactionAge / .85);
    const targetX = state.x + idleX;
    const targetY = state.y + idleY;
    // The body stays almost upright; the neck/head performs the tracking.
    // rotationX(+angle) points the visor downward in our right-handed rig.
    // Previously the sign was inverted, so low pointers made NOVA look UP.
    const body = node(base, [0, float + react * .14, 0], [0.025 * targetY, 0.045 * targetX, .013 * Math.sin(t * 1.2) + react * .025]);
    const head = node(body, [0, 1.01, 0], [0.62 * targetY + react * .07, 0.72 * targetX, -0.014 * targetX - react * .035]);

    // The grounded projection is independent of the floating robot.
    drawingPart = 'base';
    orb(base, [0, -1.64, 0], [0.78, 0.015, 0.38], rgba('#11172A'), { metal: .1 });
    ring(base, [0, -1.61, 0], [0.83, .035, .55], mintDark, { metal: .12, glow: .30 });
    ring(base, [0, -1.60, 0], [0.56, .012, .36], ice, { glow: .21 + pulse * .3, metal: .2 });
    for (let i = 0; i < 9; i++) {
      const a = i * 2 * PI / 9;
      orb(base, [.83 * Math.cos(a), -1.596, .54 * Math.sin(a)], [.017, .017, .017], ice, { glow: .45 });
    }

    // A streamlined single-piece levitating chassis: rounded ceramic shell,
    // recessed graphite panel and a luminous reactor. No dangling wrists or
    // oversized boots to compete with the large expressive helmet.
    drawingPart = 'body';
    orb(body, [0, -.43, -.12], [.44, .57, .36], graphite, { metal: .78 });
    orb(body, [0, -.42, .03], [.485, .60, .35], pearl, { metal: .83 });
    orb(body, [0, -.43, .26], [.405, .52, .145], shell, { metal: .91 });
    orb(body, [0, -.43, .376], [.275, .305, .063], ink, { metal: .94 });
    ring(body, [0, -.43, .433], [.202, .024, .202], ice, { rot: [PI / 2, 0, 0], glow: .35 + pulse, metal: .6 });
    orb(body, [0, -.43, .453], [.137, .137, .048], ice, { glow: .52 + pulse, metal: .35 });
    // Small flush vents, not protruding mechanical joints.
    for (const side of [-1, 1]) {
      orb(body, [side * .23, -.74, .345], [.052, .023, .017], silver, { metal: .7 });
    }

    // Two clean, tapered hover vanes, built into the silhouette rather than
    // dangling from shoulder sockets. They move subtly as stabilizers.
    for (const side of [-1, 1]) {
      drawingPart = side === -1 ? 'arm-left' : 'arm-right';
      const fin = node(body, [side * .50, -.44, -.05], [0, 0, side * (.045 + .035 * Math.sin(t * 1.30 + side) + .095 * react)]);
      orb(fin, [side * .19, -.18, -.015], [.14, .33, .19], shell, { rot: [0, 0, side * .30], metal: .87 });
      orb(fin, [side * .27, -.25, .09], [.039, .21, .042], graphite, { rot: [0, 0, side * .28], metal: .7 });
      orb(fin, [side * .32, -.34, .11], [.023, .075, .031], ice, { glow: .55 + pulse, metal: .2 });
    }

    // Unified tapered hover drive; the underside hides the old boots.
    drawingPart = 'body';
    orb(body, [0, -1.04, -.02], [.32, .27, .32], shell, { metal: .87 });
    orb(body, [0, -1.18, .045], [.25, .16, .29], graphite, { metal: .78 });
    ring(body, [0, -1.28, .03], [.24, .030, .24], ice, { metal: .47, glow: .50 + pulse });
    orb(body, [0, -1.32, .03], [.15, .033, .15], mintDark, { glow: .35 + pulse });

    // Visible neck is a swiveling separate joint.
    rod(body, [0, .48, 0], [.18, .28, .17], pearl, { metal: .86 });
    for (const y of [.32, .42, .52]) ring(body, [0, y, 0], [.175, .017, .175], graphite, { metal: .88 });

    drawingPart = 'head';
    // Spherical, fully curved helmet; not a flat DOM cutout.
    // Matte ceramic shell to avoid an unrealistic overhead glare hotspot.
    orb(head, [0, 0, 0], [1.01, .67, .66], pearl, { metal: .50 });
    orb(head, [0, -.035, -.045], [.97, .605, .65], shell, { metal: .42 });
    // A real curved dark glass bulge, set into the front of the helmet.
    orb(head, [0, -.04, .56], [.82, .445, .195], ink, { metal: 1 });
    orb(head, [0, -.05, .694], [.745, .37, .082], graphite, { metal: .8 });
    // Thin metal lens frame traces the glass contour in 3D.
    ring(head, [0, -.04, .597], [.81, .023, .435], lavender, { rot: [PI / 2, 0, 0], metal: 1, glow: .10 });
    // Existing animated eye engine appears as an alpha texture on the glass.
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, faceTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    if (faceCanvas.width > 0 && faceCanvas.height > 0) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, faceCanvas);
    }
    draw('plane', head, [0, -.058, .784], [.55, .255, 1], lavender, { textured: true, metal: 0, glow: 1 });

    // Curved eyebrow and chin insets, with parallax through head rotation.
    orb(head, [0, .38, .553], [.37, .032, .050], silver, { metal: .72 });
    for (const s of [-1, 1]) {
      orb(head, [s * .76, .37, .28], [.065, .036, .039], ice, { glow: .55 });
      orb(head, [s * .56, -.37, .55], [.12, .032, .045], lavender, { metal: .85, glow: .1 });
      orb(head, [s * 1.015, -.03, 0], [.18, .205, .23], graphite, { metal: .82 });
      orb(head, [s * 1.145, -.03, .025], [.075, .125, .135], lavender, { metal: .74 });
      orb(head, [s * 1.2, -.03, .08], [.035, .07, .074], ice, { metal: .4, glow: .8 });
    }

    // Beacon antenna, offset against the rounded head.
    rod(head, [0, .66, -.05], [.048, .20, .048], silver, { metal: .87 });
    orb(head, [0, .86, -.05], [.115, .115, .115], ice, { metal: .4, glow: .68 + pulse });
    ring(head, [0, .86, -.05], [.165, .012, .165], lavender, { rot: [0, 0, rad(-24)], metal: .6, glow: .2 });
    for (const s of [-1, 1]) {
      orb(head, [s * .38, .57, -.14], [.115, .058, .12], graphite, { metal: .92 });
      orb(head, [s * .38, .61, -.14], [.045, .026, .05], silver, { metal: .6 });
    }

    // Subtle recessed midriff band replaces the awkward external orbit ring.
    drawingPart = 'body';
    ring(body, [0, -.83, -.01], [.37, .014, .31], lavender, { metal: .7, alpha: .48 });
    if (!reduced) request = requestAnimationFrame(render);
    } catch (error) {
      state.running = false;
      request = 0;
      onFailure(error);
    }
  }
  const api = {
    setPointer(x, y) { state.tx = clamp(x, -1, 1); state.ty = clamp(y, -1, 1); state.pointerActive = (x !== 0 || y !== 0); if (reduced) render(); },
    setExpression(name) { state.expression = name; state.reactionAt = performance.now(); if (reduced) render(); },
    getState() { return { ...state, webgl: true }; },
    setVisible(visible) {
      state.visible = visible;
      if (!visible && request) { cancelAnimationFrame(request); request = 0; }
      if (visible && !request && state.running) request = requestAnimationFrame(render);
    },
    render() { render(); },
    pause() { state.running = false; cancelAnimationFrame(request); request = 0; },
    destroy() {
      state.running = false; cancelAnimationFrame(request);
      Object.values(meshes).forEach(g => { gl.deleteBuffer(g.vbo); gl.deleteBuffer(g.ibo); });
      gl.deleteTexture(faceTex); gl.deleteProgram(p);
    },
  };
  request = requestAnimationFrame(render);
  return api;
}
