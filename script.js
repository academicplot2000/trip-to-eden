/* ─── Cloud generation ────────────────────────────────────────── */
const CLOUD_DATA = [
  { w: 260, h: 80 },
  { w: 180, h: 55 },
  { w: 320, h: 90 },
  { w: 140, h: 45 },
  { w: 220, h: 65 },
  { w: 380, h: 100 },
  { w: 170, h: 50 },
];

function makeSVGCloud(w, h, id) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("width", w);
  svg.setAttribute("height", h);
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

  const defs = document.createElementNS(ns, "defs");
  const filterBlur = document.createElementNS(ns, "filter");
  filterBlur.setAttribute("id", `blur${id}`);
  const feGaussianBlur = document.createElementNS(ns, "feGaussianBlur");
  feGaussianBlur.setAttribute("in", "SourceGraphic");
  feGaussianBlur.setAttribute("stdDeviation", "3");
  filterBlur.appendChild(feGaussianBlur);
  defs.appendChild(filterBlur);

  // Gradient para niebla suave
  const grad = document.createElementNS(ns, "radialGradient");
  grad.setAttribute("id", `smokegradient${id}`);
  grad.setAttribute("cx", "45%");
  grad.setAttribute("cy", "35%");
  grad.setAttribute("r", "55%");
  const stop1 = document.createElementNS(ns, "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "rgba(255,255,255,0.9)");
  const stop2 = document.createElementNS(ns, "stop");
  stop2.setAttribute("offset", "70%");
  stop2.setAttribute("stop-color", "rgba(240,245,255,0.5)");
  const stop3 = document.createElementNS(ns, "stop");
  stop3.setAttribute("offset", "100%");
  stop3.setAttribute("stop-color", "rgba(220,235,255,0)");
  grad.appendChild(stop1);
  grad.appendChild(stop2);
  grad.appendChild(stop3);
  defs.appendChild(grad);
  svg.appendChild(defs);

  // Crear múltiples capas de humo con bezier curves para efecto más natural
  const smokeLayers = [
    // Capa base difusa
    {
      scale: 1,
      opacity: 0.6,
      offsetY: 0,
      offsetX: 0,
    },
    // Capa superior más etérea
    {
      scale: 0.85,
      opacity: 0.4,
      offsetY: -h * 0.15,
      offsetX: w * 0.1,
    },
    // Capa media sombreada
    {
      scale: 0.95,
      opacity: 0.35,
      offsetY: h * 0.05,
      offsetX: -w * 0.08,
    },
  ];

  smokeLayers.forEach((layer, idx) => {
    const g = document.createElementNS(ns, "g");
    g.setAttribute("opacity", layer.opacity);
    g.setAttribute("filter", `url(#blur${id})`);

    // Crear forma de humo orgánica con múltiples curvas
    const path = document.createElementNS(ns, "path");
    const centerX = w * 0.5 + layer.offsetX;
    const centerY = h * 0.5 + layer.offsetY;
    const scaleW = w * layer.scale * 0.5;
    const scaleH = h * layer.scale * 0.4;

    // SVG path que simula humo con bordes irregulares
    const d = `
      M ${centerX - scaleW * 0.8} ${centerY + scaleH * 0.3}
      Q ${centerX - scaleW} ${centerY - scaleH * 0.2}, ${centerX - scaleW * 0.6} ${centerY - scaleH * 0.6}
      Q ${centerX - scaleW * 0.2} ${centerY - scaleH * 0.8}, ${centerX} ${centerY - scaleH * 0.9}
      Q ${centerX + scaleW * 0.2} ${centerY - scaleH * 0.8}, ${centerX + scaleW * 0.6} ${centerY - scaleH * 0.6}
      Q ${centerX + scaleW} ${centerY - scaleH * 0.2}, ${centerX + scaleW * 0.8} ${centerY + scaleH * 0.3}
      Q ${centerX + scaleW * 0.7} ${centerY + scaleH * 0.7}, ${centerX + scaleW * 0.3} ${centerY + scaleH * 0.85}
      Q ${centerX} ${centerY + scaleH * 0.9}, ${centerX - scaleW * 0.3} ${centerY + scaleH * 0.85}
      Q ${centerX - scaleW * 0.7} ${centerY + scaleH * 0.7}, ${centerX - scaleW * 0.8} ${centerY + scaleH * 0.3}
      Z
    `;

    path.setAttribute("d", d);
    path.setAttribute("fill", `url(#smokegradient${id})`);
    path.setAttribute("stroke", "none");

    g.appendChild(path);
    svg.appendChild(g);
  });
  return svg;
}

function spawnClouds() {
  const wrap = document.getElementById("cloudsWrap");
  const count = 14;
  for (let i = 0; i < count; i++) {
    const def = CLOUD_DATA[i % CLOUD_DATA.length];
    const scale = 0.7 + Math.random() * 0.9;
    const w = Math.round(def.w * scale);
    const h = Math.round(def.h * scale);

    const cloud = document.createElement("div");
    cloud.classList.add("cloud");
    cloud.style.top = Math.random() * 90 + "%";
    cloud.style.left = -w + "px";

    const dur = 45 + Math.random() * 50;
    const delay = -Math.random() * dur;
    cloud.style.animation = `floatCloud ${dur}s linear ${delay}s infinite`;
    cloud.style.opacity = (0.4 + Math.random() * 0.5).toString();

    cloud.appendChild(makeSVGCloud(w, h, i));
    wrap.appendChild(cloud);
  }
}

spawnClouds();

/* ─── Nav dots & scroll tracking ─────────────────────────────── */
const sections = ["page-entry", "page-letter", "page-seats"];
const dots = document.querySelectorAll(".nav-dot");

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const idx = parseInt(dot.dataset.page);
    document
      .getElementById(sections[idx])
      .scrollIntoView({ behavior: "smooth" });
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const idx = sections.indexOf(e.target.id);
        dots.forEach((d, i) => d.classList.toggle("active", i === idx));
      }
    });
  },
  { threshold: 0.6 },
);

sections.forEach((id) => observer.observe(document.getElementById(id)));

/* ─── Page 1 – Name & Enter ───────────────────────────────────── */
let userName = "";
const nameInput = document.getElementById("nameInput");
const btnEnter = document.getElementById("btnEnter");

btnEnter.addEventListener("click", goToLetter);
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") goToLetter();
});

function goToLetter() {
  userName = nameInput.value.trim() || "";
  const greeting = document.getElementById("greetingName");
  greeting.textContent = userName ? `Bienvenida, ${userName}` : "Bienvenida";
  document.getElementById("letterSalutation").textContent = userName
    ? `Querida ${userName},`
    : "Querida,";
  document.getElementById("page-letter").scrollIntoView({ behavior: "smooth" });
}

/* ─── Page 2 – Envelope & Slider ─────────────────────────────── */
const envelopeWrap = document.getElementById("envelopeWrap");
const puzzleOverlay = document.getElementById("puzzleOverlay");
const letterOverlay = document.getElementById("letterOverlay");
const letterClose = document.getElementById("letterClose");

envelopeWrap.addEventListener("click", () => {
  puzzleOverlay.classList.add("active");
});

letterClose.addEventListener("click", () => {
  letterOverlay.classList.remove("active");
});

// Slider drag
const track = document.getElementById("sliderTrack");
const handle = document.getElementById("sliderHandle");
const fill = document.getElementById("sliderFill");
const label = document.getElementById("sliderLabel");

let dragging = false,
  startX = 0,
  currentLeft = 0;
const handleW = 52;

function getTrackWidth() {
  return track.getBoundingClientRect().width;
}

function startDrag(clientX) {
  dragging = true;
  startX = clientX - currentLeft;
  handle.style.transition = "none";
  fill.style.transition = "none";
}

function doDrag(clientX) {
  if (!dragging) return;
  const tw = getTrackWidth();
  const max = tw - handleW;
  let pos = clientX - startX;
  pos = Math.max(0, Math.min(pos, max));
  currentLeft = pos;
  handle.style.left = pos + "px";
  fill.style.width = pos + handleW + "px";

  const pct = pos / max;
  label.style.opacity = Math.max(0, 1 - pct * 2.5).toString();

  if (pct >= 0.92) finishSlide();
}

function endDrag() {
  if (!dragging) return;
  dragging = false;
  const tw = getTrackWidth();
  const max = tw - handleW;
  if (currentLeft / max < 0.92) resetSlider();
}

function resetSlider() {
  handle.style.transition = "left 0.4s cubic-bezier(.16,1,.3,1)";
  fill.style.transition = "width 0.4s cubic-bezier(.16,1,.3,1)";
  handle.style.left = "0";
  fill.style.width = handleW + "px";
  label.style.opacity = "1";
  currentLeft = 0;
}

function finishSlide() {
  dragging = false;
  puzzleOverlay.classList.remove("active");
  resetSlider();
  setTimeout(() => letterOverlay.classList.add("active"), 300);
}

// Mouse events
handle.addEventListener("mousedown", (e) => startDrag(e.clientX));
window.addEventListener("mousemove", (e) => doDrag(e.clientX));
window.addEventListener("mouseup", () => endDrag());

// Touch events
handle.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    startDrag(e.touches[0].clientX);
  },
  { passive: false },
);
window.addEventListener("touchmove", (e) => doDrag(e.touches[0].clientX));
window.addEventListener("touchend", () => endDrag());

/* ─── Page 3 – Seat map ───────────────────────────────────────── */
const SEAT_INFO = {
  window: {
    icon: "🌅",
    title: "Asiento de ventanilla",
    desc: "El horizonte es tuyo. Contempla el cielo despejado y siente la suave luz del amanecer mientras el mundo queda atrás.",
  },
  innerLeft: {
    icon: "🌸",
    title: "Asiento interior izquierdo",
    desc: "Rodeada de tranquilidad. Un aroma suave a flores envuelve el ambiente, perfecto para reflexionar en calma.",
  },
  innerRight: {
    icon: "✨",
    title: "Asiento interior derecho",
    desc: "Lleno de luz difusa y calidez. Cada instante aquí vibra con una energía serena y misteriosa.",
  },
  aisle: {
    icon: "🕊️",
    title: "Asiento de pasillo",
    desc: "Libertad y movimiento. Eres la primera en alzar el vuelo y la primera en descubrir lo que te espera.",
  },
};

const ROWS = ["A", "B", "C", "D"];
const cabin = document.getElementById("cabin");

ROWS.forEach((row, ri) => {
  const rowEl = document.createElement("div");
  rowEl.classList.add("seat-row");

  // Row number
  const rn = document.createElement("span");
  rn.classList.add("row-num");
  rn.textContent = row;
  rowEl.appendChild(rn);

  // 4 seats: [window, inner | aisle, inner-right, window]
  // Layout: W  I  |  I  W
  const seatTypes = ["window", "innerLeft", "innerRight", "aisle"];
  const labels = [`${row}1`, `${row}2`, `${row}3`, `${row}4`];
  const types = ["window", "innerLeft", "aisle", "window"]; // per column

  [
    { id: `${row}1`, type: "window" },
    { id: `${row}2`, type: "innerLeft" },
  ].forEach((s) => rowEl.appendChild(makeSeat(s.id, s.type)));

  const aisle = document.createElement("div");
  aisle.classList.add("aisle");
  rowEl.appendChild(aisle);

  [
    { id: `${row}3`, type: "innerRight" },
    { id: `${row}4`, type: "window" },
  ].forEach((s) => rowEl.appendChild(makeSeat(s.id, s.type)));

  cabin.appendChild(rowEl);
});

function makeSeat(id, type) {
  const info = SEAT_INFO[type];
  const seat = document.createElement("div");
  seat.classList.add("seat");
  seat.setAttribute("data-id", id);

  const ping = document.createElement("div");
  ping.classList.add("seat-ping");
  seat.appendChild(ping);

  const tip = document.createElement("div");
  tip.classList.add("seat-tooltip");
  tip.innerHTML = `
    <div class="tooltip-icon">${info.icon}</div>
    <div class="tooltip-seat-id">Asiento ${id}</div>
    <div class="tooltip-body">${info.desc}</div>
  `;

  seat.appendChild(tip);
  return seat;
}

/* ─── Takeoff button ─────────────────────────────────────────── */
document.getElementById("btnTakeoff").addEventListener("click", () => {
  const btn = document.getElementById("btnTakeoff");
  btn.style.opacity = "0.5";
  btn.style.pointerEvents = "none";
  btn.innerHTML = "✦ &nbsp; Despegando…";
  setTimeout(startCountdown, 800);
});

/* ─── Countdown 3 2 1 ────────────────────────────────────────── */
function startCountdown() {
  const overlay = document.getElementById("countdownOverlay");
  overlay.classList.add("active");
  const num = document.getElementById("countdownNum");
  const counts = ["3", "2", "1", "✦"];
  let i = 0;
  function tick() {
    num.classList.remove("pop");
    void num.offsetWidth;
    num.textContent = counts[i];
    num.classList.add("pop");
    i++;
    if (i < counts.length) {
      setTimeout(tick, 900);
    } else {
      setTimeout(() => {
        overlay.classList.remove("active");
        showFormPage();
      }, 700);
    }
  }
  tick();
}

/* ─── Form logic ─────────────────────────────────────────────── */
const QUESTIONS = [
  {
    id: "q1",
    type: "single",
    question: "¿Crees en el amor a primera vista?",
    sub: "Esa chispa que lo cambia todo en un instante.",
    options: ["Completamente", "Puede que sí", "Soy escéptica", "No lo creo"],
  },
  {
    id: "q2",
    type: "single",
    question: "¿Crees en el destino?",
    sub: "Que hay alguien escrito para ti en algún lugar del universo.",
    options: [
      "Sí, lo siento profundamente",
      "Creo que el destino se construye",
      "A veces lo dudo",
      "Prefiero la casualidad",
    ],
  },
  {
    id: "q3",
    type: "slider_range",
    question: "¿Qué importancia tiene el aspecto físico?",
    sub: "Desliza para indicar cuánto peso tiene en tu decisión.",
    min: 0,
    max: 10,
    labels: ["Nada", "Es lo primero"],
  },
  {
    id: "q4",
    type: "multi",
    question: "¿Qué cualidades buscas en tu media naranja?",
    sub: "Elige todas las que resuenen contigo.",
    options: [
      "Sentido del humor",
      "Inteligencia emocional",
      "Ambición",
      "Ternura",
      "Aventurero/a",
      "Estabilidad",
      "Creatividad",
      "Lealtad",
    ],
  },
  {
    id: "q5",
    type: "slider_range",
    question: "¿Introvertido/a o extrovertido/a?",
    sub: "Describe cómo te imaginas a esa persona en sociedad.",
    min: 0,
    max: 10,
    labels: ["Muy introvertido/a", "Muy extrovertido/a"],
  },
  {
    id: "q6",
    type: "text",
    question: "Describe tu plan de cita perfecta.",
    sub: "Con todo detalle. No hay respuesta incorrecta.",
    placeholder: "Una cena tranquila al atardecer, tal vez junto al mar…",
  },
  {
    id: "q7",
    type: "single",
    question: "¿Cómo prefieres que sea la relación al principio?",
    sub: "El ritmo marca mucho el tono de todo lo que viene después.",
    options: [
      "Lenta y misteriosa",
      "Natural y espontánea",
      "Intensa desde el inicio",
      "Que fluya sola",
    ],
  },
  {
    id: "q8",
    type: "multi",
    question: "¿Qué planes os imaginas compartiendo?",
    sub: "Elige los que sientas como tuyos.",
    options: [
      "Viajes al extranjero",
      "Noches en casa",
      "Aventuras al aire libre",
      "Conciertos y cultura",
      "Proyectos en común",
      "Cocinar juntos",
      "Deporte",
      "Lectura en silencio",
    ],
  },
  {
    id: "q9",
    type: "slider_range",
    question: "¿Qué equilibrio buscas entre independencia y unión?",
    sub: "Cada pareja tiene su propia constelación.",
    min: 0,
    max: 10,
    labels: ["Mucha independencia", "Siempre juntos"],
  },
  {
    id: "q10",
    type: "single",
    question: "¿Qué te enamora primero de alguien?",
    sub: "Ese pequeño detalle que lo cambia todo.",
    options: ["La mirada", "La voz", "La forma de reír", "Lo que dice"],
  },
  {
    id: "q11",
    type: "text",
    question:
      "Si pudieras dejarle una nota a tu media naranja hoy, ¿qué le dirías?",
    sub: "Escríbele como si pudiera leerla ahora mismo.",
    placeholder: "Hola, no sé dónde estás, pero…",
  },
  {
    id: "q12",
    type: "signature",
    question: "Para finalizar, firma aquí.",
    sub: "Tu firma es tu sello. Confirma que todo lo que has respondido viene de tu corazón.",
  },
];

let currentQ = 0;
const answers = {};

function showFormPage() {
  const pf = document.getElementById("page-form");
  pf.classList.add("visible");
  pf.style.display = "flex";
  requestAnimationFrame(() => {
    pf.scrollIntoView({ behavior: "smooth" });
  });
  // Add form nav dot
  const nd = document.createElement("button");
  nd.classList.add("nav-dot");
  nd.dataset.page = "3";
  nd.title = "Formulario";
  nd.addEventListener("click", () =>
    document.getElementById("page-form").scrollIntoView({ behavior: "smooth" }),
  );
  document.getElementById("navDots").appendChild(nd);
  renderQuestion(0);
}

function renderQuestion(idx) {
  currentQ = idx;
  const q = QUESTIONS[idx];
  const container = document.getElementById("formQuestionWrap");

  // Update progress
  const pct = (idx / (QUESTIONS.length - 1)) * 100;
  document.getElementById("formProgressFill").style.width = pct + "%";
  document.getElementById("formProgressLabel").textContent =
    `${idx + 1} / ${QUESTIONS.length}`;

  // Fade out then swap
  container.style.opacity = "0";
  container.style.transform = "translateY(16px)";

  setTimeout(() => {
    container.innerHTML = buildQuestion(q);
    attachQuestionEvents(q);
    restoreAnswer(q);
    container.style.transition =
      "opacity 0.5s ease, transform 0.5s cubic-bezier(.16,1,.3,1)";
    container.style.opacity = "1";
    container.style.transform = "translateY(0)";
  }, 220);

  // Prev/Next buttons
  const prevBtn = document.getElementById("formPrev");
  const nextBtn = document.getElementById("formNext");
  prevBtn.style.opacity = idx === 0 ? "0.2" : "1";
  prevBtn.style.pointerEvents = idx === 0 ? "none" : "all";
  nextBtn.innerHTML =
    idx === QUESTIONS.length - 1 ? "Enviar &nbsp;✦" : "Siguiente &nbsp;›";
}

function buildQuestion(q) {
  let html = `
    <p class="fq-label">Pregunta ${QUESTIONS.indexOf(q) + 1}</p>
    <h2 class="fq-title">${q.question}</h2>
    <p class="fq-sub">${q.sub || ""}</p>
  `;

  if (q.type === "single") {
    html += `<div class="fq-options single-options">`;
    q.options.forEach((opt, i) => {
      html += `<button class="fq-option" data-val="${opt}">${opt}</button>`;
    });
    html += `</div>`;
  }

  if (q.type === "multi") {
    html += `<div class="fq-options multi-options">`;
    q.options.forEach((opt) => {
      html += `<button class="fq-option" data-val="${opt}">${opt}</button>`;
    });
    html += `</div><p class="fq-hint">Puedes elegir varias</p>`;
  }

  if (q.type === "slider_range") {
    html += `
      <div class="fq-slider-wrap">
        <div class="fq-slider-labels">
          <span>${q.labels[0]}</span><span>${q.labels[1]}</span>
        </div>
        <div class="fq-slider-track">
          <div class="fq-slider-fill" id="fqFill"></div>
          <div class="fq-slider-thumb" id="fqThumb"></div>
        </div>
        <div class="fq-slider-value" id="fqValue">—</div>
      </div>`;
  }

  if (q.type === "text") {
    html += `
      <div class="fq-text-wrap">
        <textarea class="fq-textarea" id="fqText" placeholder="${q.placeholder || ""}" rows="4"></textarea>
      </div>`;
  }

  if (q.type === "signature") {
    html += `
      <div class="fq-sig-wrap">
        <canvas class="sig-canvas" id="sigCanvas"></canvas>
        <button class="sig-clear" id="sigClear">Borrar</button>
      </div>`;
  }

  return html;
}

function attachQuestionEvents(q) {
  if (q.type === "single") {
    document.querySelectorAll(".fq-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".fq-option")
          .forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        answers[q.id] = btn.dataset.val;
      });
    });
  }

  if (q.type === "multi") {
    document.querySelectorAll(".fq-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.classList.toggle("selected");
        if (!answers[q.id]) answers[q.id] = [];
        const val = btn.dataset.val;
        if (btn.classList.contains("selected")) {
          answers[q.id].push(val);
        } else {
          answers[q.id] = answers[q.id].filter((v) => v !== val);
        }
      });
    });
  }

  if (q.type === "slider_range") {
    initFQSlider(q);
  }

  if (q.type === "text") {
    const ta = document.getElementById("fqText");
    ta.addEventListener("input", () => {
      answers[q.id] = ta.value;
    });
  }

  if (q.type === "signature") {
    initSignature(q);
  }
}

function restoreAnswer(q) {
  const ans = answers[q.id];
  if (!ans) return;

  if (q.type === "single") {
    document.querySelectorAll(".fq-option").forEach((btn) => {
      if (btn.dataset.val === ans) btn.classList.add("selected");
    });
  }

  if (q.type === "multi") {
    document.querySelectorAll(".fq-option").forEach((btn) => {
      if (ans.includes(btn.dataset.val)) btn.classList.add("selected");
    });
  }

  if (q.type === "text") {
    const ta = document.getElementById("fqText");
    if (ta) ta.value = ans;
  }

  if (q.type === "slider_range" && typeof ans === "number") {
    // Slider restores inside initFQSlider via answers check
  }
}

/* ── Form Range Slider ─────── */
function initFQSlider(q) {
  const track = document.querySelector(".fq-slider-track");
  const thumb = document.getElementById("fqThumb");
  const fill = document.getElementById("fqFill");
  const valEl = document.getElementById("fqValue");

  let dragging = false;
  let value = answers[q.id] !== undefined ? answers[q.id] : 5;

  function setVal(v) {
    value = Math.max(0, Math.min(10, Math.round(v)));
    const pct = value / 10;
    const tw = track.getBoundingClientRect().width;
    const thumbW = 32;
    const pos = pct * (tw - thumbW);
    thumb.style.left = pos + "px";
    fill.style.width = pos + thumbW / 2 + "px";
    valEl.textContent = value;
    answers[q.id] = value;
  }

  function posToVal(clientX) {
    const rect = track.getBoundingClientRect();
    const thumbW = 32;
    const pct = Math.max(
      0,
      Math.min(1, (clientX - rect.left - thumbW / 2) / (rect.width - thumbW)),
    );
    return pct * 10;
  }

  thumb.addEventListener("mousedown", () => (dragging = true));
  window.addEventListener("mousemove", (e) => {
    if (dragging) setVal(posToVal(e.clientX));
  });
  window.addEventListener("mouseup", () => (dragging = false));

  thumb.addEventListener(
    "touchstart",
    (e) => {
      dragging = true;
      e.preventDefault();
    },
    { passive: false },
  );
  window.addEventListener("touchmove", (e) => {
    if (dragging) setVal(posToVal(e.touches[0].clientX));
  });
  window.addEventListener("touchend", () => (dragging = false));

  track.addEventListener("click", (e) => setVal(posToVal(e.clientX)));

  // Init position after layout
  requestAnimationFrame(() => setVal(value));
}

/* ── Signature Canvas ─────── */
function initSignature(q) {
  const canvas = document.getElementById("sigCanvas");
  const ctx = canvas.getContext("2d");
  const wrap = canvas.parentElement;

  function resize() {
    const w = wrap.getBoundingClientRect().width - 2;
    canvas.width = w;
    canvas.height = 160;
  }
  resize();
  window.addEventListener("resize", resize);

  ctx.strokeStyle = "#3a4a5c";
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  let drawing = false,
    lastX = 0,
    lastY = 0;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }

  function start(e) {
    e.preventDefault();
    drawing = true;
    const p = getPos(e);
    lastX = p.x;
    lastY = p.y;
  }
  function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastX = p.x;
    lastY = p.y;
    answers[q.id] = canvas.toDataURL();
  }
  function stop() {
    drawing = false;
    ctx.beginPath();
  }

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stop);
  canvas.addEventListener("mouseleave", stop);
  canvas.addEventListener("touchstart", start, { passive: false });
  canvas.addEventListener("touchmove", draw, { passive: false });
  canvas.addEventListener("touchend", stop);

  document.getElementById("sigClear").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    delete answers[q.id];
  });
}

/* ── Form Nav ───── */
document.getElementById("formPrev").addEventListener("click", () => {
  if (currentQ > 0) renderQuestion(currentQ - 1);
});

document.getElementById("formNext").addEventListener("click", () => {
  if (currentQ < QUESTIONS.length - 1) {
    renderQuestion(currentQ + 1);
  } else {
    submitForm();
  }
});

/* ── Submit ───── */
function submitForm() {
  document.getElementById("page-form").style.opacity = "0";
  document.getElementById("page-form").style.transition = "opacity 0.8s ease";
  setTimeout(() => {
    document.getElementById("page-form").style.display = "none";
    document.getElementById("page-thankyou").style.display = "flex";
    requestAnimationFrame(() => {
      document.getElementById("page-thankyou").style.opacity = "1";
      document
        .getElementById("page-thankyou")
        .scrollIntoView({ behavior: "smooth" });
    });
  }, 800);
}
