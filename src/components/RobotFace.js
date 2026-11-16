/* ═══════════════════════════════════════════════════════════════════
   RobotFace
   A browser port of face.py from the elder-care companion robot.

   Same idea as the original: nothing here is a sprite. Each eye is drawn
   every frame from a handful of numbers (scale, look offset, eyelid
   coverage), and an emotion is just those numbers smoothly interpolated
   toward a preset. That is why expressions never pop mid-transition.

   Preset values, timings and the lid-curve maths are carried over from
   face.py unchanged, so this is the same face the hardware runs.
   Design lineage: pycozmo, the Cozmo SDK, playfultechnology's esp32-eyes,
   and FluxGarage's RoboEyes, which face.py already borrows its confused
   shake from and which the curious behaviour below comes from.
   ═══════════════════════════════════════════════════════════════════ */
const RobotFace = (function (global) {
  "use strict";

  var LERP = 0.22;                 // per frame at 60fps, rescaled for real dt
  var BLINK_DURATION = 0.16;
  var BLINK_MIN = 0.07;
  var BLINK_SQUASH = 0.35;

  var TALK_FREQ = 10.0;
  var TALK_AMPLITUDE = 0.10;

  var LOOK_LERP = 0.12;
  var LOOK_RANGE_X = 0.55;
  var LOOK_RANGE_Y = 0.70;
  var LOOK_HOLD_MIN = 2.0, LOOK_HOLD_MAX = 5.0;

  var SHAKE_DURATION = 0.5;
  var SHAKE_CYCLES = 3;
  var SHAKE_AMPLITUDE = 0.14;

  var APEX_FRAC = 0.55;
  var LID_CURVE_STEPS = 8;

  var CURIOUS_GROW = 0.20;              // how much the craning eye gains

  /* Straight from face.py. ws/hs scale the eye, oy glances vertically,
     top_in/top_out/bottom are eyelid coverage as a fraction of height,
     bend arcs the bottom lid up in the middle, taper curls the outer
     corner to a point. */
  var PRESETS = {
    idle:      { ws: 0.86, hs: 0.86, oy:  0.00, top_in: 0.06, top_out: 0.06, bottom: 0.06, bend: 0.00, taper: 0 },
    happy:     { ws: 1.02, hs: 0.92, oy: -0.10, top_in: 0.00, top_out: 0.00, bottom: 0.42, bend: 0.22, taper: 0 },
    sad:       { ws: 0.94, hs: 0.86, oy:  0.12, top_in: 0.10, top_out: 0.42, bottom: 0.05, bend: 0.00, taper: 0 },
    thinking:  { ws: 0.90, hs: 0.78, oy: -0.06, top_in: 0.16, top_out: 0.16, bottom: 0.04, bend: 0.00, taper: 0 },
    listening: { ws: 1.08, hs: 1.06, oy: -0.04, top_in: 0.02, top_out: 0.02, bottom: 0.02, bend: 0.00, taper: 0 },
    speaking:  { ws: 1.02, hs: 1.00, oy: -0.01, top_in: 0.10, top_out: 0.10, bottom: 0.04, bend: 0.00, taper: 0 }
  };

  var KEYS = ["ws", "hs", "oy", "top_in", "top_out", "bottom", "bend", "taper"];

  function lerp(a, b, t) { return a + (b - a) * t; }
  function rand(a, b) { return a + Math.random() * (b - a); }

  /* One eyelid as an N-point smoothstep curve, sweeping from cov_left to
     cov_right. `bend` adds coverage in the middle only, which is what
     turns happy's bottom cut into an upward-arcing smile. */
  function lidCurve(left, right, edgeY, h, covL, covR, fromTop, bend) {
    var pts = [];
    var sign = fromTop ? 1 : -1;
    for (var i = 0; i <= LID_CURVE_STEPS; i++) {
      var xf = i / LID_CURVE_STEPS;
      var ease = xf * xf * (3 - 2 * xf);
      var cov = lerp(covL, covR, ease) + bend * Math.sin(xf * Math.PI);
      pts.push([lerp(left, right, xf), edgeY + sign * h * cov]);
    }
    return pts;
  }

  function Eye(side) {
    this.side = side;                       // -1 left, +1 right
    var p = PRESETS.idle;
    this.v = {};
    this.t = {};
    for (var i = 0; i < KEYS.length; i++) { this.v[KEYS[i]] = p[KEYS[i]]; this.t[KEYS[i]] = p[KEYS[i]]; }
  }

  Eye.prototype.setTarget = function (preset) {
    for (var i = 0; i < KEYS.length; i++) this.t[KEYS[i]] = preset[KEYS[i]];
  };

  Eye.prototype.update = function (k) {
    for (var i = 0; i < KEYS.length; i++) {
      var key = KEYS[i];
      this.v[key] = lerp(this.v[key], this.t[key], k);
    }
  };

  Eye.prototype.draw = function (ctx, cx, cy, baseW, baseH, blink, breathe, color, grow) {
    var v = this.v;
    // squash and stretch: flattening also widens, so a blink closes into a
    // wide thin line rather than a shrinking slit
    var w = baseW * v.ws * (1 + (1 - blink) * BLINK_SQUASH);
    // RoboEyes' "curious": the eye further from the direction of gaze grows
    // a little, as though craning to see. Sells a sideways look far better
    // than sliding both eyes across does.
    var h = baseH * v.hs * blink * (1 + (grow || 0) * CURIOUS_GROW);
    cy = cy + baseH * v.oy + breathe;

    var left = cx - w / 2, right = cx + w / 2;
    var top = cy - h / 2, bottom = cy + h / 2;
    var radius = Math.min(w, h) * 0.42;

    // the eye body is ALWAYS this same rounded rect, for every preset.
    // Eyelids are carved on top; never a different draw path, because
    // switching rendering mid-morph is what makes expressions pop.
    ctx.fillStyle = color;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(left, top, w, Math.max(2, h), Math.max(1, radius));
    else ctx.rect(left, top, w, Math.max(2, h));
    ctx.fill();

    // taper pulls the outer corner's top and bottom coverage toward a
    // shared apex so they meet at a point, leaving the inner side thick
    var taper = v.taper;
    var effTopOut = v.top_out + taper * (APEX_FRAC - v.top_out);
    var effBotOut = v.bottom + taper * ((1 - APEX_FRAC) - v.bottom);

    var topL, topR, botL, botR;
    if (this.side < 0) {           // left eye: inner edge is on the right
      topL = effTopOut; topR = v.top_in;
      botL = effBotOut; botR = v.bottom;
    } else {                       // right eye: inner edge is on the left
      topL = v.top_in; topR = effTopOut;
      botL = v.bottom; botR = effBotOut;
    }

    // Carve the lids out to transparency so whatever sits behind the
    // canvas (here, the robot's drawn head) shows through the gaps.
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";

    if (topL > 0.001 || topR > 0.001) {
      this._carve(ctx, lidCurve(left, right, top, h, topL, topR, true, 0), left, right, top - 2);
    }
    if (botL > 0.001 || botR > 0.001 || v.bend > 0.001) {
      this._carve(ctx, lidCurve(left, right, bottom, h, botL, botR, false, v.bend), left, right, bottom + 2);
    }
    ctx.restore();
  };

  Eye.prototype._carve = function (ctx, curve, left, right, edge) {
    ctx.beginPath();
    ctx.moveTo(left, edge);
    for (var i = 0; i < curve.length; i++) ctx.lineTo(curve[i][0], curve[i][1]);
    ctx.lineTo(right, edge);
    ctx.closePath();
    ctx.fill();
  };

  /* ── the face ──────────────────────────────────────────────────── */
  function RobotFace(canvas, opts) {
    opts = opts || {};
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.color = opts.color || "#F0B56F";
    this.autoLook = opts.autoLook !== false;   // idle glancing about
    this.reduced = !!opts.reduced;

    this.left = new Eye(-1);
    this.right = new Eye(+1);
    this.state = "idle";

    this._t = 0;
    this._blinkT = null;
    this._nextBlink = rand(2.5, 5.0);
    this._lookX = this._lookY = 0;
    this._lookTX = this._lookTY = 0;
    this._nextLook = rand(LOOK_HOLD_MIN, LOOK_HOLD_MAX);
    this._shakeT = null;
    this._pointer = null;                       // {x,y} in -1..1, overrides idle glance
    this._raf = null;
    this._last = 0;

    this.resize();

    // the canvas is sized in percentages of the drawn robot, so its box can
    // settle after construction (fonts, images, layout). Track it rather
    // than measuring once and trusting it.
    if (global.ResizeObserver) {
      var self = this;
      this._ro = new ResizeObserver(function () { self.resize(); });
      this._ro.observe(canvas);
    }
  }

  RobotFace.prototype.resize = function () {
    var r = this.canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var w = Math.round(r.width * dpr);
    var h = Math.round(r.height * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this._w = r.width;
    this._h = r.height;
    if (this.reduced) this.draw();     // static render has no loop to redraw it
  };

  RobotFace.prototype.setState = function (state) {
    if (!PRESETS[state]) return;
    if (state === "thinking" && this.state !== "thinking") this._shakeT = 0;
    this.state = state;
    this.left.setTarget(PRESETS[state]);
    this.right.setTarget(PRESETS[state]);
  };

  RobotFace.prototype.blink = function () {
    if (this._blinkT === null) this._blinkT = 0;
  };

  // hand the eyes a pointer position in -1..1; null hands control back
  RobotFace.prototype.lookAt = function (nx, ny) {
    this._pointer = (nx === null) ? null : { x: nx, y: ny };
  };

  RobotFace.prototype.update = function (dt) {
    this._t += dt;

    // rescale the per-frame lerp so it behaves the same at any framerate
    var k = 1 - Math.pow(1 - LERP, dt * 60);
    var lookK = 1 - Math.pow(1 - LOOK_LERP, dt * 60);

    if (this.state === "idle") {
      this._nextBlink -= dt;
      if (this._nextBlink <= 0 && this._blinkT === null) {
        this.blink();
        this._nextBlink = rand(2.5, 5.5);
      }
    }

    if (this._pointer) {
      this._lookTX = this._pointer.x;
      this._lookTY = this._pointer.y;
    } else if (this.autoLook && (this.state === "idle" || this.state === "listening")) {
      this._nextLook -= dt;
      if (this._nextLook <= 0) {
        this._lookTX = rand(-1, 1);
        this._lookTY = rand(-1, 1);
        this._nextLook = rand(LOOK_HOLD_MIN, LOOK_HOLD_MAX);
      }
    } else {
      this._lookTX = this._lookTY = 0;
    }
    this._lookX = lerp(this._lookX, this._lookTX, lookK);
    this._lookY = lerp(this._lookY, this._lookTY, lookK);

    this.left.update(k);
    this.right.update(k);

    if (this._blinkT !== null) {
      this._blinkT += dt;
      if (this._blinkT >= BLINK_DURATION) this._blinkT = null;
    }
    if (this._shakeT !== null) {
      this._shakeT += dt;
      if (this._shakeT >= SHAKE_DURATION) this._shakeT = null;
    }
  };

  RobotFace.prototype._blinkFactor = function () {
    if (this._blinkT === null) return 1;
    var p = this._blinkT / BLINK_DURATION;
    return 1 - Math.sin(p * Math.PI) * (1 - BLINK_MIN);
  };

  RobotFace.prototype._talkFactor = function () {
    if (this.state !== "speaking") return 1;
    var t = this._t;
    var pulse = (Math.sin(t * TALK_FREQ) + Math.sin(t * TALK_FREQ * 1.7 + 1.3)) * 0.25 + 0.5;
    return 1 - pulse * TALK_AMPLITUDE;
  };

  RobotFace.prototype._shakeOffset = function (baseW) {
    if (this._shakeT === null) return 0;
    var p = this._shakeT / SHAKE_DURATION;
    return Math.sin(p * Math.PI * SHAKE_CYCLES * 2) * SHAKE_AMPLITUDE * baseW * (1 - p);
  };

  RobotFace.prototype.draw = function () {
    var W = this._w, H = this._h;
    if (!W || !H) return;
    var ctx = this.ctx;
    ctx.clearRect(0, 0, W, H);

    var baseW = W * 0.30;
    var baseH = H * 0.62;
    var gap = W * 0.20;
    var cy = H * 0.5;

    // a slow breath so an idle face still feels alive
    var breathe = this.reduced ? 0 : Math.sin(this._t * 1.6) * (H * 0.012);
    var bf = this._blinkFactor() * this._talkFactor();

    var lookX = this._lookX * gap * LOOK_RANGE_X + this._shakeOffset(baseW);
    var lookY = this._lookY * baseH * LOOK_RANGE_Y * 0.5;

    // whichever eye is trailing the gaze cranes to see (RoboEyes' curious)
    var craneL = this._lookX < 0 ? Math.min(1, -this._lookX) : 0;
    var craneR = this._lookX > 0 ? Math.min(1, this._lookX) : 0;

    this.left.draw(ctx, W * 0.5 - gap + lookX, cy + lookY, baseW, baseH, bf, breathe, this.color, craneL);
    this.right.draw(ctx, W * 0.5 + gap + lookX, cy + lookY, baseW, baseH, bf, breathe, this.color, craneR);
  };

  RobotFace.prototype.start = function () {
    if (this._raf) return;
    var self = this;

    if (this.reduced) {                 // no loop: settle on idle and draw once
      for (var i = 0; i < 40; i++) self.update(1 / 60);
      self.draw();
      return;
    }

    this._last = performance.now();
    var tick = function (now) {
      var dt = Math.min((now - self._last) / 1000, 0.05);
      self._last = now;
      self.update(dt);
      self.draw();
      self._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  };

  RobotFace.prototype.stop = function () {
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
  };

  RobotFace.STATES = Object.keys(PRESETS);
  return RobotFace;
})(window);

export default RobotFace;
