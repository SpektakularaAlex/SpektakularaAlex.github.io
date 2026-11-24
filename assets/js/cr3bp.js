// Planar Circular Restricted Three-Body Problem, Earth–Moon, rotating frame.
//
// Units: Earth–Moon distance = 1, total mass = 1, angular velocity = 1.
// Equations of motion, with r1, r2 the distances to the Earth and the Moon:
//   x'' =  2y' + x - (1-MU)(x+MU)/r1^3 - MU(x-1+MU)/r2^3
//   y'' = -2x' + y - (1-MU) y    /r1^3 - MU y       /r2^3
// The Jacobi constant C = x^2 + y^2 + 2(1-MU)/r1 + 2MU/r2 - v^2 is conserved.
// With 2*Omega = C + v^2, a particle can never enter the region where 2*Omega < C:
// that "forbidden region" is what is shaded.
(function () {
  "use strict";

  var MU = 0.0121506;                 // Moon's share of the total mass
  var R_EARTH = 0.01659, R_MOON = 0.00452; // radii / Earth–Moon distance
  var DAYS = 4.342;                   // one time unit in days
  var SPEED = 1.4;                    // time units per second
  var TRAIL = 1500;                   // points kept in the trail
  var DEFAULT = [0.8, 0.1];           // bounded orbit that wanders between the Earth and the Moon

  // ---------- Physics ----------
  function accel(s, out) {
    var x = s[0], y = s[1], u = s[2], v = s[3];
    var a = x + MU, b = x - 1 + MU;
    var r1 = a * a + y * y, r2 = b * b + y * y;
    var k1 = (1 - MU) / (r1 * Math.sqrt(r1)), k2 = MU / (r2 * Math.sqrt(r2));
    out[0] = u;
    out[1] = v;
    out[2] = 2 * v + x - k1 * a - k2 * b;
    out[3] = -2 * u + y - (k1 + k2) * y;
  }

  var d1 = [0, 0, 0, 0], d2 = [0, 0, 0, 0], d3 = [0, 0, 0, 0], d4 = [0, 0, 0, 0], tmp = [0, 0, 0, 0];
  function rk4(s, h) {
    var i;
    accel(s, d1);
    for (i = 0; i < 4; i++) tmp[i] = s[i] + 0.5 * h * d1[i];
    accel(tmp, d2);
    for (i = 0; i < 4; i++) tmp[i] = s[i] + 0.5 * h * d2[i];
    accel(tmp, d3);
    for (i = 0; i < 4; i++) tmp[i] = s[i] + h * d3[i];
    accel(tmp, d4);
    for (i = 0; i < 4; i++) s[i] += (h / 6) * (d1[i] + 2 * d2[i] + 2 * d3[i] + d4[i]);
  }

  function distances(x, y) {
    return [Math.hypot(x + MU, y), Math.hypot(x - 1 + MU, y)];
  }
  function twoOmega(x, y) {
    var r = distances(x, y);
    return x * x + y * y + (2 * (1 - MU)) / r[0] + (2 * MU) / r[1];
  }
  function jacobi(s) {
    return twoOmega(s[0], s[1]) - s[2] * s[2] - s[3] * s[3];
  }
  // Step size follows the local orbital time scale, so close passes stay accurate.
  function stepSize(s) {
    var r = distances(s[0], s[1]);
    return Math.min(0.01, 0.03 * Math.sqrt(Math.min((r[0] * r[0] * r[0]) / (1 - MU), (r[1] * r[1] * r[1]) / MU)));
  }
  // Advance by at most `time`. Returns "" or the reason the orbit ended.
  function advance(sim, time, onStep) {
    while (time > 1e-9) {
      var h = Math.min(time, stepSize(sim.s));
      rk4(sim.s, h);
      time -= h;
      sim.t += h;
      if (onStep) onStep(sim.s);
      var r = distances(sim.s[0], sim.s[1]);
      if (r[0] < R_EARTH) return "earth";
      if (r[1] < R_MOON) return "moon";
      if (Math.hypot(sim.s[0], sim.s[1]) > 4) return "escape";
    }
    return "";
  }

  // L1–L3 from bisection on the x-axis; L4, L5 are exact.
  function collinear(lo, hi) {
    var f = function (x) { var o = [0, 0, 0, 0]; accel([x, 0, 0, 0], o); return o[2]; };
    for (var i = 0, up = f(lo) < 0; i < 60; i++) {
      var m = (lo + hi) / 2;
      if (f(m) < 0 === up) lo = m; else hi = m;
    }
    return (lo + hi) / 2;
  }
  var L = [
    ["L1", collinear(0.5, 1 - MU - 1e-3), 0],
    ["L2", collinear(1 - MU + 1e-3, 1.5), 0],
    ["L3", collinear(-1.5, -0.5), 0],
    ["L4", 0.5 - MU, Math.sqrt(3) / 2],
    ["L5", 0.5 - MU, -Math.sqrt(3) / 2]
  ];

  if (typeof document === "undefined") { // allows testing the physics in Node
    module.exports = { advance: advance, jacobi: jacobi, L: L, DEFAULT: DEFAULT, MU: MU };
    return;
  }

  // ---------- Page elements ----------
  var fig = document.getElementById("cr3bp");
  if (!fig) return;
  var canvas = fig.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  var playBtn = fig.querySelector("[data-play]");
  var resetBtn = fig.querySelector("[data-reset]");
  var readout = fig.querySelector("[data-readout]");
  var status = fig.querySelector("[data-status]");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  fig.querySelector(".controls").hidden = false;

  var start = DEFAULT.slice();
  var sim, trail, ended = "", playing = !reduced.matches, visible = false, dragging = false;
  var W = 0, H = 0, scale = 1, color = {}, region = null, raf = 0, last = 0, lastReadout = 0;

  function toScreen(x, y) { return [W / 2 + x * scale, H / 2 - y * scale]; }
  function toWorld(px, py) { return [(px - W / 2) / scale, (H / 2 - py) / scale]; }

  function record(s) {
    var n = trail.length;
    if (n && Math.hypot(s[0] - trail[n - 1][0], s[1] - trail[n - 1][1]) < 0.006) return;
    trail.push([s[0], s[1]]);
    if (trail.length > TRAIL) trail.shift();
  }
  function launch() {
    // Never start inside (or on) a primary.
    [[-MU, R_EARTH], [1 - MU, R_MOON]].forEach(function (p) {
      var dx = start[0] - p[0], d = Math.hypot(dx, start[1]), min = p[1] * 1.5;
      if (d < min) start = d ? [p[0] + (dx / d) * min, (start[1] / d) * min] : [p[0] + min, 0];
    });
    sim = { s: [start[0], start[1], 0, 0], t: 0 };
    trail = [[start[0], start[1]]];
    ended = "";
    status.textContent = "";
    shade();
  }
  function showReadout() {
    readout.textContent = "Jacobi constant C = " + jacobi(sim.s).toFixed(4) + "  ·  " + (sim.t * DAYS).toFixed(0) + " days";
  }

  // ---------- Drawing ----------
  function readColors() {
    var css = getComputedStyle(document.documentElement);
    ["text", "muted", "accent", "bg"].forEach(function (k) { color[k] = css.getPropertyValue("--" + k).trim(); });
  }
  function shade() {
    if (!W) return;
    var w = Math.ceil(W / 2), h = Math.ceil(H / 2), C = twoOmega(start[0], start[1]);
    region = region || document.createElement("canvas");
    region.width = w; region.height = h;
    var g = region.getContext("2d"), data = g.createImageData(w, h);
    var rgb = [1, 3, 5].map(function (i) { return parseInt(color.accent.substr(i, 2), 16); });
    for (var j = 0, k = 0; j < h; j++) {
      for (var i = 0; i < w; i++, k += 4) {
        var p = toWorld(i * 2 + 1, j * 2 + 1);
        data.data[k] = rgb[0]; data.data[k + 1] = rgb[1]; data.data[k + 2] = rgb[2];
        data.data[k + 3] = twoOmega(p[0], p[1]) < C ? 30 : 0;
      }
    }
    g.putImageData(data, 0, 0);
  }
  function dot(x, y, r, fill) {
    var p = toScreen(x, y);
    ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 2 * Math.PI); ctx.fillStyle = fill; ctx.fill();
  }
  function label(str, x, y, dx, dy) {
    var p = toScreen(x, y);
    ctx.fillText(str, p[0] + dx, p[1] + dy);
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(region, 0, 0, W, H);

    ctx.font = '13px "Source Sans 3", system-ui, sans-serif';
    ctx.strokeStyle = ctx.fillStyle = color.muted;
    ctx.lineWidth = 1;
    L.forEach(function (l) {
      var p = toScreen(l[1], l[2]);
      ctx.beginPath();
      ctx.moveTo(p[0] - 4, p[1]); ctx.lineTo(p[0] + 4, p[1]);
      ctx.moveTo(p[0], p[1] - 4); ctx.lineTo(p[0], p[1] + 4);
      ctx.stroke();
      ctx.textAlign = l[0] === "L1" ? "right" : "left";
      label(l[0], l[1], l[2], l[0] === "L1" ? -5 : 7, -6);
    });

    // Trail, fading towards its tail.
    ctx.strokeStyle = color.accent;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    var n = trail.length, size = Math.max(2, Math.ceil(n / 24));
    for (var i = 0; i < n - 1; i += size) {
      ctx.globalAlpha = 0.12 + 0.88 * Math.pow(i / n, 1.5);
      ctx.beginPath();
      for (var j = i; j <= Math.min(i + size, n - 1); j++) {
        var q = toScreen(trail[j][0], trail[j][1]);
        if (j === i) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Primaries (drawn larger than to scale).
    dot(-MU, 0, 10, color.text);
    dot(1 - MU, 0, 4.5, color.text);
    ctx.fillStyle = color.text;
    ctx.textAlign = "center";
    label("Earth", -MU, 0, 0, 27);
    label("Moon", 1 - MU, 0, 0, 21);

    // Start handle and particle.
    var h = toScreen(start[0], start[1]);
    ctx.beginPath(); ctx.arc(h[0], h[1], 8, 0, 2 * Math.PI);
    ctx.strokeStyle = color.accent; ctx.lineWidth = 1.5; ctx.stroke();
    dot(sim.s[0], sim.s[1], 4.5, color.accent);
  }

  // ---------- Loop ----------
  function frame(now) {
    raf = 0;
    var dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    if (!dragging && !ended) {
      ended = advance(sim, dt * SPEED, record);
      if (ended) {
        playing = false;
        var days = " after " + (sim.t * DAYS).toFixed(1) + " days. Drag to launch again.";
        status.textContent = { earth: "Hit the Earth", moon: "Hit the Moon", escape: "Left the Earth–Moon system" }[ended] + days;
        showReadout();
      }
    }
    if (now - lastReadout > 250) { showReadout(); lastReadout = now; }
    draw();
    update();
  }
  function update() {
    playBtn.textContent = playing ? "Pause" : "Play";
    if (playing && visible && !dragging && !raf) raf = requestAnimationFrame(frame);
    if ((!playing || !visible || dragging) && raf) { cancelAnimationFrame(raf); raf = 0; }
    if (!raf) last = 0;
  }
  function refresh() { showReadout(); draw(); update(); }

  function resize() {
    var r = canvas.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    if (!r.width) return;
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scale = Math.min(W / 2.65, H / 2.25);
    shade();
    draw();
  }

  // ---------- Input ----------
  function setStart(e) {
    var r = canvas.getBoundingClientRect();
    start = toWorld(Math.max(0, Math.min(W, e.clientX - r.left)), Math.max(0, Math.min(H, e.clientY - r.top)));
    launch();
    refresh();
  }
  function release() {
    if (!dragging) return;
    dragging = false;
    playing = true;
    refresh();
  }
  function near(e) { // is a touch close to the start handle or the particle?
    var r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    return [start, sim.s].some(function (p) {
      var q = toScreen(p[0], p[1]);
      return Math.hypot(q[0] - x, q[1] - y) < 34;
    });
  }
  // Mouse and pen: drag anywhere.
  canvas.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "touch" || e.button !== 0) return;
    canvas.setPointerCapture(e.pointerId);
    dragging = true;
    setStart(e);
  });
  canvas.addEventListener("pointermove", function (e) {
    if (dragging && e.pointerType !== "touch") setStart(e);
  });
  canvas.addEventListener("pointerup", function (e) { if (e.pointerType !== "touch") release(); });
  canvas.addEventListener("pointercancel", function (e) { if (e.pointerType !== "touch") release(); });
  // Touch: drag the particle or its start ring, or tap anywhere. Other swipes scroll the page.
  var tap = null;
  canvas.addEventListener("touchstart", function (e) {
    tap = null;
    if (e.touches.length !== 1) return;
    var t = e.touches[0];
    if (near(t)) { e.preventDefault(); dragging = true; setStart(t); }
    else tap = [t.clientX, t.clientY];
  }, { passive: false });
  canvas.addEventListener("touchmove", function (e) {
    if (dragging) { e.preventDefault(); setStart(e.touches[0]); }
    else if (tap && Math.hypot(e.touches[0].clientX - tap[0], e.touches[0].clientY - tap[1]) > 10) tap = null;
  }, { passive: false });
  canvas.addEventListener("touchend", function (e) {
    if (tap) { e.preventDefault(); dragging = true; setStart(e.changedTouches[0]); tap = null; }
    release();
  });
  canvas.addEventListener("touchcancel", function () { tap = null; release(); });
  // Keyboard: arrows move the start point.
  canvas.addEventListener("keydown", function (e) {
    var d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
    if (d) {
      e.preventDefault();
      start = [start[0] + d[0] * 0.03, start[1] + d[1] * 0.03];
      launch();
      refresh();
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      playBtn.click();
    }
  });
  playBtn.addEventListener("click", function () {
    if (ended) { launch(); playing = true; } else playing = !playing;
    refresh();
  });
  resetBtn.addEventListener("click", function () {
    start = DEFAULT.slice();
    launch();
    advance(sim, 20, record);
    refresh();
  });

  // ---------- Start ----------
  readColors();
  launch();
  advance(sim, 20, record); // so there is an orbit to see from the first frame
  new ResizeObserver(resize).observe(canvas);
  resize();
  showReadout();
  new IntersectionObserver(function (entries) {
    visible = entries[entries.length - 1].isIntersecting;
    update();
  }).observe(canvas);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { readColors(); shade(); draw(); });
  reduced.addEventListener("change", function () { if (reduced.matches) { playing = false; update(); } });
})();
