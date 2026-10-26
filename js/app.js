
(() => {
  "use strict";

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const KEY = "cv-progress";
  const INITIAL = "cv-quiz-initial-v1";
  const FINAL = "cv-quiz-final-v1";
  const IDS = ["signals", "digital", "voice", "network"];

  const esc = value => String(value ?? "").replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;"
    }[c])
  );

  function read(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  let state = read(KEY, {});
  if (!state || typeof state !== "object") state = {};
  IDS.forEach(id => state[id] = state[id] === true);

  const completed = () => IDS.filter(id => state[id]).length;
  const allDone = () => completed() === 4;

  function modal(html) {
    $("#modalBody").innerHTML = html;
    $("#backdrop").hidden = false;
    document.body.style.overflow = "hidden";
    $("#modalBody").setAttribute("role", "dialog");
    $("#modalBody").setAttribute("aria-modal", "true");
    $("#modalBody").setAttribute("aria-labelledby", "modalTitle");
    $("#close").focus();
  }

  function close() {
    $("#backdrop").hidden = true;
    document.body.style.overflow = "";
  }

  function toast(message) {
    const element = $("#toast");
    element.textContent = message;
    element.setAttribute("role", "status");
    element.classList.add("show");
    setTimeout(() => element.classList.remove("show"), 3000);
  }

  $("#close").onclick = close;
  $("#backdrop").onclick = e => {
    if (e.target === $("#backdrop")) close();
  };

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
    if (e.key === "Tab" && !$("#backdrop").hidden) {
      const controls = [
        $("#close"),
        ...$$('#modalBody a[href], #modalBody button:not([disabled]), #modalBody input:not([disabled]), #modalBody textarea')
      ].filter(el => el && el.getClientRects().length);
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  $("#menubtn").onclick = () => $("#nav").classList.toggle("open");
  $$("#nav a").forEach(a => {
    a.onclick = () => $("#nav").classList.remove("open");
  });

  function exit() {
    window.open("https://www.google.com/", "_blank", "noopener");
    toast("Se abrió otra pestaña. Esto no borra el historial.");
  }

  $("#exit").onclick = $("#exit2").onclick = exit;

  // =====================================
  // MÓDULOS: 12 CASOS EDUCATIVOS
  // =====================================

  const mods = {
    signals: {
      title: "🚩 Reconoce las señales",
      intro: "Aprende a identificar control, presión y respeto.",
      cases: [
        {
          q: "Tu pareja exige tus contraseñas. ¿Qué puede indicar?",
          o: ["Confianza", "Control", "Una obligación", "Respeto"],
          a: 1,
          e: "Exigir contraseñas puede vulnerar tu privacidad y ser una señal de control."
        },
        {
          q: "Alguien insiste en que abandones tus amistades. ¿Qué reconoces?",
          o: ["Aislamiento", "Respeto", "Apoyo", "Autonomía"],
          a: 0,
          e: "Alejar a una persona de su red de apoyo puede ser una forma de aislamiento."
        },
        {
          q: "¿Qué caracteriza una relación saludable?",
          o: ["Vigilancia", "Amenazas", "Respeto de límites", "Control de horarios"],
          a: 2,
          e: "Una relación saludable respeta las decisiones, los límites y la autonomía."
        }
      ]
    },
    digital: {
      title: "🔐 Escudo Digital",
      intro: "Protege tu información y reconoce riesgos digitales.",
      cases: [
        {
          q: "Recibes un enlace desconocido que pide tu contraseña. ¿Qué haces?",
          o: ["Ingresar tus datos", "Reenviarlo", "Verificar desde la web oficial", "Compartir tu código"],
          a: 2,
          e: "Verifica directamente en el sitio oficial sin utilizar enlaces sospechosos."
        },
        {
          q: "¿Qué mejora la seguridad de una cuenta?",
          o: ["Verificación en dos pasos", "Compartir claves", "Repetir contraseñas", "Publicar códigos"],
          a: 0,
          e: "La verificación en dos pasos añade una capa de protección."
        },
        {
          q: "Alguien te presiona para enviar información privada. ¿Qué puedes hacer?",
          o: ["Aceptar", "Enviar más datos", "Ignorar tu incomodidad", "Negarte y buscar orientación"],
          a: 3,
          e: "Tienes derecho a la privacidad. Busca apoyo si la situación te preocupa."
        }
      ]
    },
    voice: {
      title: "🗣️ Mi voz pone límites",
      intro: "Practica límites personales y comunicación respetuosa.",
      cases: [
        {
          q: "Alguien insiste en revisar tu teléfono. ¿Qué frase expresa un límite?",
          o: ["Puedes revisarlo", "Prefiero mantener mi teléfono privado", "No puedo negarme", "Debo compartirlo"],
          a: 1,
          e: "Expresar tus necesidades con claridad es válido. Si hacerlo puede ponerte en riesgo, prioriza tu seguridad."
        },
        {
          q: "¿Qué significa establecer límites?",
          o: ["Controlar a otros", "Evitar toda conversación", "Expresar lo que aceptas", "Imponer decisiones"],
          a: 2,
          e: "Los límites ayudan a comunicar necesidades y cuidar el bienestar."
        },
        {
          q: "Si expresar un límite puede generar peligro, ¿qué priorizas?",
          o: ["Tu seguridad y apoyo confiable", "Confrontar inmediatamente", "Responder con amenazas", "Quedarte sin orientación"],
          a: 0,
          e: "No siempre es seguro confrontar. Puedes buscar orientación y apoyo."
        }
      ]
    },
    network: {
      title: "🤝 Activa tu red",
      intro: "Reconoce personas confiables y recursos de orientación.",
      cases: [
        {
          q: "¿Qué caracteriza a una persona de confianza?",
          o: ["Difunde información", "Te obliga a actuar", "Te escucha y respeta", "Te aísla"],
          a: 2,
          e: "Una persona confiable escucha sin juzgar y respeta tus decisiones."
        },
        {
          q: "Una amiga comparte una situación difícil. ¿Cómo la apoyas?",
          o: ["La culpas", "La escuchas sin juzgar", "Publicas su historia", "Decides por ella"],
          a: 1,
          e: "Escuchar y respetar su privacidad puede ayudar a construir apoyo."
        },
        {
          q: "¿Qué servicio peruano brinda orientación frente a violencia familiar y sexual?",
          o: ["Un perfil desconocido", "Un enlace no verificado", "Un chat que pide contraseñas", "Línea 100"],
          a: 3,
          e: "La Línea 100 ofrece orientación frente a violencia familiar y sexual en Perú."
        }
      ]
    }
  };

  function progress() {
    const n = completed();
    const percent = n * 25;
    $("#percent").textContent = percent + "%";
    $("#bar").style.width = percent + "%";
    $("#progressText").textContent = `${n} de 4 módulos completados`;
    save(KEY, state);
    renderDashboard();
  }

  // ==========================================
  // VIO - TUTORA EDUCATIVA INTERACTIVA
  // ==========================================

  function vioTutora({
    mensaje = "¡Hola! Soy Vio. Aprendamos juntas.",
    pista = "",
    explicacion = ""
  } = {}) {

    const contenedor = document.createElement("div");
    contenedor.className = "vio-tutora";

    contenedor.innerHTML = `
      <img src="assets/flor-mascota.png" alt="Vio">
      <div class="vio-tutora-contenido">
        <strong>🌷 Vio, tu tutora</strong>
        <p class="vio-tutora-mensaje"></p>
        <div class="vio-tutora-botones">
          <button type="button" data-vio-tutora="pista">
            💡 Dame una pista
          </button>
          <button type="button" data-vio-tutora="explicar">
            📖 Explícame
          </button>
          <button type="button" data-vio-tutora="escuchar">
            🔊 Escuchar
          </button>
        </div>
      </div>
    `;

    const texto = contenedor.querySelector(".vio-tutora-mensaje");
    texto.textContent = mensaje;

    let actual = mensaje;

    function hablar() {
      // Respetar la configuración de voz de la visitante.
      const botonVoz = document.getElementById("vioVoice");
      const vozActiva =
        botonVoz?.getAttribute("aria-pressed") === "true";

      if (!vozActiva) return;

      if (!("speechSynthesis" in window)) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(actual);
      const selector = document.getElementById("vioVoiceSelect");
      const voces = speechSynthesis.getVoices()
        .filter(v => v.lang.toLowerCase().startsWith("es"));

      const elegida = voces[Number(selector?.value)];

      if (elegida) utterance.voice = elegida;

      utterance.lang = elegida?.lang || "es-PE";
      utterance.rate = 0.94;
      utterance.pitch = 1.08;

      speechSynthesis.speak(utterance);
    }

    function mostrar(textoNuevo) {
      actual = textoNuevo;
      texto.textContent = actual;
      hablar();
    }

    contenedor.querySelector('[data-vio-tutora="pista"]')
      .addEventListener("click", () => {
        mostrar(pista ||
          "Lee cuidadosamente las alternativas y piensa en el respeto, la privacidad y la seguridad.");
      });

    contenedor.querySelector('[data-vio-tutora="explicar"]')
      .addEventListener("click", () => {
        mostrar(explicacion ||
          "Identifica qué alternativa protege mejor los derechos y la autonomía.");
      });

    contenedor.querySelector('[data-vio-tutora="escuchar"]')
      .addEventListener("click", () => {
        if (!("speechSynthesis" in window)) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(actual);
        utterance.lang = "es-PE";
        utterance.rate = 0.94;

        const selector = document.getElementById("vioVoiceSelect");
        const voces = speechSynthesis.getVoices()
          .filter(v => v.lang.toLowerCase().startsWith("es"));

        const elegida = voces[Number(selector?.value)];
        if (elegida) utterance.voice = elegida;

        speechSynthesis.speak(utterance);
      });

    return {
      elemento: contenedor,
      mostrar,
      bloquearPistas() {
        contenedor.querySelector(
          '[data-vio-tutora="pista"]'
        ).disabled = true;
      }
    };
  }

  function agregarVioTutora(configuracion) {
    const cuerpo = document.getElementById("modalBody");
    if (!cuerpo) return null;

    const tutora = vioTutora(configuracion);

    const titulo = cuerpo.querySelector("#modalTitle");

    if (titulo) {
      titulo.insertAdjacentElement(
        "afterend",
        tutora.elemento
      );
    } else {
      cuerpo.prepend(tutora.elemento);
    }

    return tutora;
  }

  function runModule(id) {
    const mod = mods[id];
    if (!mod) return;

    let current = 0;
    let correct = 0;

    function showCase() {
      const item = mod.cases[current];
      modal(`
        <small>CASO ${current + 1} DE ${mod.cases.length}</small>
        <h2 id="modalTitle">${mod.title}</h2>
        <p>${mod.intro}</p>
        <p><b>${esc(item.q)}</b></p>
        <form id="caseForm">
          ${item.o.map((option, i) => `
            <label class="choice">
              <input type="radio" name="answer" value="${i}" required>
              ${esc(option)}
            </label>
          `).join("")}
          <button class="action">Comprobar respuesta</button>
        </form>
        <div id="caseFeedback" aria-live="polite"></div>
      `);

      // Vio acompaña cada caso educativo.
      const tutora = agregarVioTutora({
        mensaje:
          "Vamos con el caso " + (current + 1) +
          ". Lee la situación y elige la alternativa que consideres más adecuada.",
        pista:
          "Piensa qué respuesta protege mejor la autonomía, el respeto y la seguridad. No necesitas apresurarte.",
        explicacion:
          "Observa si alguna opción implica control, presión o pérdida de privacidad. Elige la que respete los derechos de la persona."
      });

      $("#caseForm").onsubmit = e => {
        e.preventDefault();
        const answer = Number(new FormData(e.target).get("answer"));
        const ok = answer === item.a;
        if (ok) correct++;
        $("#caseForm").remove();
        $("#caseFeedback").innerHTML = `
          <div class="feedback ${ok ? "good" : "warn"}">
            <b>${ok ? "✓ ¡Correcto!" : "Revisemos este caso"}</b>
            <p><b>Respuesta esperada:</b> ${esc(item.o[item.a])}</p>
            <p>${esc(item.e)}</p>
          </div>
          <button class="action" id="nextCase">
            ${current === mod.cases.length - 1 ? "Ver resultados" : "Siguiente caso →"}
          </button>
        `;
        $("#nextCase").onclick = () => {
          current++;
          if (current < mod.cases.length) showCase();
          else finish();
        };
      };
    }

    function finish() {
      modal(`
        <small>MÓDULO FINALIZADO</small>
        <h2 id="modalTitle">💜 ¡Buen trabajo!</h2>
        <h3>${mod.title}</h3>
        <div class="feedback good">
          <b>${correct} de 3 respuestas correctas</b>
          <p>Revisaste los tres casos y sus explicaciones.</p>
          <p>Puedes repetirlos cuando quieras.</p>
        </div>
        <button class="action" id="saveModule">Guardar módulo completado ✓</button>
      `);
      $("#saveModule").onclick = () => {
        state[id] = true;
        progress();
        close();
        toast(allDone()
          ? "¡Completaste los cuatro módulos! Evaluación final desbloqueada. 💜"
          : "¡Progreso guardado! 💜");
      };
    }

    showCase();
  }

  $$("[data-module]").forEach(button => {
    button.onclick = () => runModule(button.dataset.module);
  });

  // =====================================
  // PANEL DE PROGRESO PERSONALIZADO
  // =====================================

  const dashboard = document.createElement("section");
  dashboard.className = "section";
  dashboard.id = "mi-panel";
  dashboard.setAttribute("aria-label", "Mi panel de progreso");

  const route = $("#ruta");
  route.parentNode.insertBefore(dashboard, route);

  function renderDashboard() {
    const initial = read(INITIAL);
    const final = read(FINAL);
    const n = completed();

    dashboard.innerHTML = `
      <small>✦ TU ESPACIO DE APRENDIZAJE</small>
      <h2>💜 Mi ruta violeta</h2>
      <p>Tu progreso se guarda solo en este navegador.</p>
      <div style="background:#f8f1ff;border:1px solid #e5d3f5;border-radius:20px;padding:22px;color:#351451;max-width:850px">
        <p style="font-size:28px;font-weight:800;margin:0">${n * 25}% completado</p>
        <div role="progressbar" aria-label="Progreso de módulos"
          aria-valuenow="${n * 25}" aria-valuemin="0" aria-valuemax="100"
          style="height:13px;background:#e8d9f2;border-radius:20px;overflow:hidden;margin:12px 0">
          <div style="width:${n * 25}%;height:100%;background:#8135b5"></div>
        </div>
        ${IDS.map(id => `
          <p style="margin:10px 0">
            ${state[id] ? "✅" : "◯"} ${mods[id].title}
            — ${state[id] ? "Completado" : "Pendiente"}
          </p>
        `).join("")}
        <hr style="border:0;border-top:1px solid #dbc5ed;margin:18px 0">
        <p><b>Evaluación inicial:</b> ${initial && Number.isInteger(initial.score) ? initial.score + "/10" : "Pendiente"}</p>
        <p><b>Evaluación final:</b> ${final && Number.isInteger(final.score) ? final.score + "/10" : allDone() ? "Disponible" : "Bloqueada hasta completar los módulos"}</p>
        <button id="dashboardNext" class="action">
          ${!initial ? "Hacer evaluación inicial" : !allDone() ? "Continuar mi ruta →" : "Ver evaluación final →"}
        </button>
      </div>
    `;

    $("#dashboardNext").onclick = () => {
      if (!initial || allDone()) {
        tool("quiz");
      } else {
        const next = IDS.find(id => !state[id]);
        runModule(next);
      }
    };
  }

  // =====================================
  // EVALUACIÓN INICIAL Y FINAL
  // =====================================

  const questions = [
    ["¿Cuál es una señal de control en una relación?",
      ["Respetar decisiones", "Exigir contraseñas", "Escuchar opiniones", "Respetar amistades"], 1,
      "Exigir contraseñas puede vulnerar la privacidad."],
    ["¿Qué caracteriza una relación respetuosa?",
      ["Vigilancia", "Aislamiento", "Respeto de límites", "Control"], 2,
      "El respeto incluye autonomía y límites."],
    ["Una oferta laboral exige dinero antes de contratarte. ¿Qué haces?",
      ["Pagar", "Enviar datos bancarios", "Verificar la empresa", "Aceptar"], 2,
      "Verifica las ofertas por canales independientes."],
    ["¿Qué protege una cuenta digital?",
      ["Compartir claves", "Repetir contraseñas", "Verificación en dos pasos", "Publicar códigos"], 2,
      "La verificación en dos pasos mejora la protección."],
    ["¿Cuál es un límite personal?",
      ["Compartir el teléfono", "No compartir tu contraseña", "Aceptar todo", "Alejarte de amistades"], 1,
      "Tienes derecho a conservar tu privacidad."],
    ["Una amiga vive una situación de control. ¿Cómo la apoyas?",
      ["Culparla", "Difundir su historia", "Escuchar sin juzgar", "Decidir por ella"], 2,
      "Escuchar y respetar sus decisiones puede ayudar."],
    ["Alguien te pide alejarte de tus amistades. ¿Qué puede indicar?",
      ["Respeto", "Aislamiento", "Comunicación sana", "Confianza"], 1,
      "El aislamiento puede ser una forma de control."],
    ["Un enlace sospechoso solicita tu contraseña. ¿Qué haces?",
      ["Ingresarla", "Reenviarlo", "Verificar en el sitio oficial", "Compartir códigos"], 2,
      "Usa canales oficiales para comprobar solicitudes."],
    ["¿Cómo ayuda una red de apoyo?",
      ["Decide por ti", "Escucha y orienta", "Exige claves", "Difunde información"], 1,
      "Una red confiable respeta tu autonomía."],
    ["¿Qué busca Código Violeta?",
      ["Normalizar el control", "Promover prevención y apoyo", "Solicitar datos privados", "Sustituir profesionales"], 1,
      "Es una herramienta educativa de prevención y orientación."]
  ];

  function quiz() {
    const initial = read(INITIAL);
    const validInitial = initial && Number.isInteger(initial.score) && initial.total === 10;

    if (validInitial && !allDone()) {
      modal(`
        <h2 id="modalTitle">🔒 Evaluación final pendiente</h2>
        <p>Tu evaluación inicial: <b>${initial.score}/10</b>.</p>
        <p>Has completado <b>${completed()} de 4 módulos</b>.</p>
        <p>Completa los módulos para desbloquear la evaluación final.</p>
        <button class="action" id="returnToRoute">Continuar mi ruta →</button>
      `);
      $("#returnToRoute").onclick = () => {
        close();
        $("#mi-panel").scrollIntoView({behavior:"smooth"});
      };
      return;
    }

    const phase = validInitial ? "final" : "inicial";
    let current = 0;
    const answers = [];

    function showQuestion() {
      const q = questions[current];
      modal(`
        <small>EVALUACIÓN ${phase.toUpperCase()} · ${current + 1} DE 10</small>
        <h2 id="modalTitle">🧠 Quiz de aprendizaje</h2>
        <p><b>${esc(q[0])}</b></p>
        <form id="quizForm">
          ${q[1].map((option,i) => `
            <label class="choice">
              <input type="radio" name="answer" value="${i}" required>
              ${esc(option)}
            </label>
          `).join("")}
          <button class="action">${current === 9 ? "Ver resultados" : "Siguiente pregunta →"}</button>
        </form>
        <p><small>Pregunta ${current + 1} de 10. No se envían respuestas a un servidor.</small></p>
      `);
      $("#quizForm").onsubmit = e => {
        e.preventDefault();
        answers.push(Number(new FormData(e.target).get("answer")));
        current++;
        if (current < 10) showQuestion();
        else results();
      };
    }

    function results() {
      const score = answers.reduce(
        (sum, answer, i) => sum + Number(answer === questions[i][2]), 0
      );
      const result = {score, total:10, date:new Date().toISOString()};
      save(validInitial ? FINAL : INITIAL, result);
      renderDashboard();

      const comparison = validInitial
        ? `<div class="feedback good">
            <b>📊 Comparación del aprendizaje</b>
            <p>Inicial: ${initial.score}/10</p>
            <p>Final: ${score}/10</p>
            <p><b>Diferencia: ${score - initial.score > 0 ? "+" : ""}${score - initial.score} respuestas correctas</b></p>
          </div>`
        : `<div class="feedback good">
            <b>Evaluación inicial registrada</b>
            <p>Completa los cuatro módulos para desbloquear la evaluación final.</p>
          </div>`;

      modal(`
        <small>RESULTADOS · EVALUACIÓN ${phase.toUpperCase()}</small>
        <h2 id="modalTitle">💜 ¡Tu aprendizaje cuenta!</h2>
        <p>Obtuviste <b>${score} de 10</b> respuestas correctas.</p>
        <p><b>Porcentaje: ${score * 10}%</b></p>
        ${comparison}
        <h3>Revisión de respuestas</h3>
        ${questions.map((q,i) => `
          <div class="feedback ${answers[i] === q[2] ? "good" : "warn"}">
            <b>${i + 1}. ${esc(q[0])}</b>
            <p>${answers[i] === q[2] ? "✓ Respuesta correcta" : "Respuesta para revisar"}</p>
            <p><b>Respuesta esperada:</b> ${esc(q[1][q[2]])}</p>
            <p>${esc(q[3])}</p>
          </div>
        `).join("")}
        <button class="action" id="finishQuiz">Continuar mi ruta →</button>
      `);
      $("#finishQuiz").onclick = close;
    }

    showQuestion();
  }

  // =====================================
  // SIMULADOR DE DECISIONES
  // =====================================

  const scenarios = [
    {
      title:"Una oferta inesperada",
      story:"Recibes una oferta de trabajo con un sueldo muy alto. Te piden un depósito para reservar el puesto.",
      options:[
        ["Pagar inmediatamente","Pedir dinero antes de contratar puede ser una señal de fraude.",false],
        ["Verificar la empresa por canales oficiales","Comprobar la identidad y condiciones de la empresa es una decisión prudente.",true],
        ["Enviar tus datos bancarios","Compartir datos sensibles sin verificar aumenta los riesgos.",false]
      ]
    },
    {
      title:"Una conversación incómoda",
      story:"Una persona insiste en que le compartas tu ubicación en todo momento para demostrar confianza.",
      options:[
        ["Aceptar por obligación","La confianza no exige vigilancia permanente.",false],
        ["Reconocer la presión y buscar apoyo si lo necesitas","Tienes derecho a la privacidad y a recibir orientación.",true],
        ["Entregar todas tus contraseñas","Compartir contraseñas puede comprometer tu seguridad.",false]
      ]
    },
    {
      title:"Una amiga pide orientación",
      story:"Una amiga cuenta que alguien intenta controlar sus amistades. Te pide que la escuches.",
      options:[
        ["Compartir su historia con otras personas","Difundir información sin permiso puede afectar su privacidad.",false],
        ["Escuchar sin juzgar y ofrecer acompañamiento","La escucha respetuosa puede ayudar a fortalecer su red de apoyo.",true],
        ["Decidir todo por ella","Es importante respetar su autonomía.",false]
      ]
    }
  ];

  function simulator() {
    let current = 0;

    function show() {
      const s = scenarios[current];
      modal(`
        <small>SIMULADOR · HISTORIA ${current + 1} DE ${scenarios.length}</small>
        <h2 id="modalTitle">🎭 ${esc(s.title)}</h2>
        <div class="feedback"><p>${esc(s.story)}</p></div>
        <p><b>¿Qué decisión tomarías?</b></p>
        <div id="decisions">
          ${s.options.map((option,i) => `
            <button class="action" data-choice="${i}"
              style="display:block;width:100%;margin:10px 0;text-align:left">
              ${esc(option[0])}
            </button>
          `).join("")}
        </div>
        <div id="decisionFeedback" aria-live="polite"></div>
      `);

      $$("#decisions [data-choice]").forEach(button => {
        button.onclick = () => {
          const option = s.options[Number(button.dataset.choice)];
          $("#decisions").remove();
          $("#decisionFeedback").innerHTML = `
            <div class="feedback ${option[2] ? "good" : "warn"}">
              <b>${option[2] ? "Decisión recomendada" : "Reflexionemos sobre esta decisión"}</b>
              <p>${esc(option[1])}</p>
            </div>
            <button class="action" id="nextDecision">
              ${current === scenarios.length - 1 ? "Finalizar simulador" : "Siguiente historia →"}
            </button>
          `;
          $("#nextDecision").onclick = () => {
            current++;
            if (current < scenarios.length) show();
            else {
              modal(`
                <h2 id="modalTitle">💜 Simulador completado</h2>
                <p>Has explorado tres situaciones y sus consecuencias educativas.</p>
                <p>Este simulador no sustituye la orientación profesional.</p>
                <button class="action" id="closeSimulator">Volver a mi ruta</button>
              `);
              $("#closeSimulator").onclick = close;
            }
          };
        };
      });
    }

    show();
  }

  // =====================================
  // DIRECTORIO DE AYUDA · PERÚ
  // =====================================

  function help() {
    modal(`
      <h2 id="modalTitle">🆘 Directorio de ayuda · Perú</h2>
      <p>Estos recursos ofrecen orientación o atención. Verifica la información vigente en sus páginas oficiales.</p>

      <div class="feedback">
        <b>📞 Línea 100</b>
        <p>Orientación frente a violencia familiar y sexual.</p>
        <p><a href="tel:100">Llamar al 100</a></p>
      </div>

      <div class="feedback">
        <b>🚨 Policía Nacional del Perú</b>
        <p>Para situaciones de emergencia.</p>
        <p><a href="tel:105">Llamar al 105</a></p>
      </div>

      <div class="feedback">
        <b>🏛️ Programa Nacional Warmi Ñan</b>
        <p>Consulta información oficial sobre servicios de prevención y atención de la violencia.</p>
        <p><a href="https://www.gob.pe/aurora" target="_blank" rel="noopener noreferrer">Consultar información oficial</a></p>
      </div>

      <div class="feedback">
        <b>🏥 Servicios públicos</b>
        <p>Consulta el portal del Estado para localizar CEM, DEMUNA y servicios de salud mental.</p>
        <p><a href="https://www.gob.pe/" target="_blank" rel="noopener noreferrer">Portal del Estado peruano</a></p>
      </div>

      <p><small>Esta página no detecta tu ubicación, no envía alertas automáticas y no sustituye los servicios de emergencia.</small></p>
      <p><small>La salida rápida abre otra pestaña, pero no borra el historial.</small></p>
    `);
  }

  // =====================================
  // CONSTANCIA MEJORADA
  // =====================================

  function certificate() {
    const n = completed();
    const initial = read(INITIAL);
    const final = read(FINAL);

    modal(`
      <h2 id="modalTitle">🏆 Mi constancia violeta</h2>
      <p>Has completado <b>${n} de 4 módulos</b>.</p>
      <p>${allDone()
        ? "Puedes generar una constancia local de tu recorrido."
        : "Completa los cuatro módulos para habilitarla."}</p>
      <div class="field">
        <label for="certName">Nombre o seudónimo (opcional)</label>
        <input id="certName" maxlength="80" autocomplete="off">
      </div>
      <button class="action" id="makeCert" ${allDone() ? "" : "disabled"}>
        Preparar constancia
      </button>
      <p><small>No es una certificación oficial. No se envía tu nombre a un servidor.</small></p>
    `);

    $("#makeCert").onclick = () => {
      const name = esc($("#certName").value.trim() || "Participante");
      const date = new Date().toLocaleDateString("es-PE");
      const w = window.open("", "_blank");

      if (!w) {
        toast("Permite ventanas emergentes para imprimir.");
        return;
      }

      w.document.write(`
        <!doctype html>
        <html lang="es">
        <head>
          <meta charset="utf-8">
          <title>Constancia Código Violeta</title>
          <style>
            body{font-family:Arial,sans-serif;background:#fff;color:#36134f;padding:35px}
            main{max-width:850px;margin:auto;border:9px double #8738bb;border-radius:18px;padding:45px;text-align:center}
            h1{color:#7430a5;font-size:40px}
            h2{font-size:29px}
            .tag{color:#744a91}
            .data{background:#f6edfc;padding:20px;border-radius:12px;margin:24px 0}
            small{color:#555}
            @media print{body{padding:0}main{border-width:7px}}
          </style>
        </head>
        <body>
          <main>
            <h1>✿ CÓDIGO VIOLETA</h1>
            <p class="tag">CONSTANCIA DE RECORRIDO EDUCATIVO</p>
            <h2>${name}</h2>
            <p>Completó los cuatro módulos de aprendizaje:</p>
            <p>Reconoce las señales · Escudo Digital</p>
            <p>Mi voz pone límites · Activa tu red</p>
            <div class="data">
              <p><b>Módulos completados:</b> 4 de 4</p>
              <p><b>Evaluación inicial:</b> ${initial && Number.isInteger(initial.score) ? initial.score + "/10" : "No registrada"}</p>
              <p><b>Evaluación final:</b> ${final && Number.isInteger(final.score) ? final.score + "/10" : "Pendiente"}</p>
              <p><b>Fecha:</b> ${date}</p>
            </div>
            <p>💜 Aprender también es una forma de cuidarnos.</p>
            <small>Constancia educativa generada localmente. No constituye certificación oficial.</small>
          </main>
        </body>
        </html>
      `);

      w.document.close();
      w.focus();
      w.print();
    };
  }

  // =====================================
  // OTRAS HERRAMIENTAS EXISTENTES
  // =====================================

  function plan() {
    modal(`
      <small>PLAN PERSONAL · NO SE ENVÍA A SERVIDORES</small>
      <h2 id="modalTitle">💜 Mi Código Violeta</h2>
      <p>Escribe solo información que sea seguro conservar.</p>
      <form id="planForm">
        ${[
          ["p1","Persona de confianza 1"],
          ["p2","Persona de confianza 2"],
          ["p3","Persona de confianza 3"],
          ["word","Palabra clave"],
          ["route","Servicio o lugar seguro"]
        ].map(([key,label]) => `
          <div class="field"><label>${label}</label><input name="${key}"></div>
        `).join("")}
        <div class="field">
          <label>Frase o límite que quiero recordar</label>
          <textarea name="limit"></textarea>
        </div>
        <button class="action">Preparar documento imprimible</button>
      </form>
      <p><small>Guarda o imprime el documento solo si es seguro hacerlo.</small></p>
    `);

    $("#planForm").onsubmit = e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      const fields = [
        ["Persona de confianza 1",data.p1],
        ["Persona de confianza 2",data.p2],
        ["Persona de confianza 3",data.p3],
        ["Palabra clave",data.word],
        ["Servicio o lugar seguro",data.route],
        ["Mi frase o límite",data.limit]
      ];
      const w = window.open("", "_blank");
      if (!w) return toast("Permite ventanas emergentes.");
      w.document.write(`
        <meta charset="utf-8"><title>Mi Código Violeta</title>
        <style>body{font:17px Arial;max-width:750px;margin:40px auto;color:#36134f}section{border:1px solid #ddd;padding:12px;margin:12px 0}</style>
        <h1>💜 Mi Código Violeta</h1>
        ${fields.map(([label,value]) => `
          <section><b>${label}</b><p>${esc(value || "No completado")}</p></section>
        `).join("")}
        <p>Conserva este documento solo si es seguro.</p>
      `);
      w.document.close();
      w.focus();
      w.print();
    };
  }

  function offer() {
    const checks = [
      ["money","Piden dinero por adelantado"],
      ["salary","Prometen un sueldo extraordinario sin explicar tareas"],
      ["data","Solicitan claves o datos bancarios"],
      ["place","Cambian la cita a un lugar aislado"],
      ["pressure","Presionan para decidir inmediatamente"],
      ["verify","La empresa tiene datos verificables"]
    ];

    modal(`
      <h2 id="modalTitle">🔎 Verificador de ofertas</h2>
      <p>Marca las señales presentes. El resultado es orientativo.</p>
      <form id="offerForm">
        ${checks.map(([key,label]) => `
          <label class="choice"><input type="checkbox" name="${key}">${label}</label>
        `).join("")}
        <button class="action">Analizar señales</button>
      </form>
      <div id="offerResult" aria-live="polite"></div>
    `);

    $("#offerForm").onsubmit = e => {
      e.preventDefault();
      const data = new FormData(e.target);
      const n = ["money","salary","data","place","pressure"].filter(k => data.has(k)).length;
      const level = n >= 3 ? "ALTO" : n > 0 ? "MEDIO" : data.has("verify") ? "MENOR RIESGO OBSERVADO" : "INDETERMINADO";
      $("#offerResult").innerHTML = `
        <div class="feedback ${n ? "warn" : "good"}">
          <b>Nivel orientativo: ${level}</b>
          <p>${n
            ? `Detectaste ${n} señales. No pagues ni compartas claves; verifica por canales independientes.`
            : "No marcaste señales típicas, pero verifica siempre la identidad y las condiciones del empleador."}</p>
        </div>
      `;
    };
  }

  function chat() {
    modal(`
      <small>SIMULACIÓN FICTICIA</small>
      <h2 id="modalTitle">💬 ¿Notas la bandera roja?</h2>
      <div class="feedback">
        Alex: “Si confías en mí, dame tu contraseña y comparte tu ubicación todo el día”.
      </div>
      <form id="chatForm">
        <label class="choice"><input type="radio" name="answer" value="1" required>Control y presión</label>
        <label class="choice"><input type="radio" name="answer" value="0">Una muestra saludable de confianza</label>
        <button class="action">Revisar respuesta</button>
      </form>
      <div id="chatResult" aria-live="polite"></div>
    `);
    $("#chatForm").onsubmit = e => {
      e.preventDefault();
      const ok = new FormData(e.target).get("answer") === "1";
      $("#chatResult").innerHTML = `
        <div class="feedback ${ok ? "good" : "warn"}">
          <b>${ok ? "¡Correcto!" : "Revisemos la situación"}</b>
          <p>Exigir contraseñas y ubicación constante puede ser una forma de control. Tienes derecho a la privacidad.</p>
        </div>
      `;
    };
  }

  function evidence() {
    modal(`
      <h2 id="modalTitle">🔐 Guía para preservar evidencias</h2>
      <ol>
        <li>Conserva mensajes, fechas y contexto únicamente si es seguro.</li>
        <li>No alteres archivos originales.</li>
        <li>No publiques ni reenvíes contenido íntimo.</li>
        <li>Busca orientación profesional sobre cómo entregar información relevante.</li>
      </ol>
      <div class="feedback">
        Si guardar información en un dispositivo aumenta el riesgo, prioriza tu seguridad y solicita orientación.
      </div>
    `);
  }

  function library() {
    const phrases = [
      "Mi privacidad merece respeto.",
      "Puedo expresar mis límites.",
      "Puedo cambiar de opinión.",
      "Merezco relaciones basadas en respeto.",
      "Pedir apoyo es una decisión válida.",
      "Mi historia me pertenece."
    ];
    modal(`
      <h2 id="modalTitle">📚 Biblioteca violeta</h2>
      <div class="quotes">
        ${phrases.map(p => `<blockquote>${esc(p)}</blockquote>`).join("")}
      </div>
      <button class="action" id="printLibrary">Imprimir frases</button>
    `);
    $("#printLibrary").onclick = () => window.print();
  }

  function stories() {
    modal(`
      <h2 id="modalTitle">🌷 Rincón de ánimo</h2>
      <p>Estos mensajes son ejemplos educativos, no testimonios reales.</p>
      <div class="feedback">
        <b>“Aprendí que puedo decir no”.</b>
        <p>Respetar mis límites también es cuidarme.</p>
      </div>
      <div class="feedback">
        <b>“No tengo que hacerlo sola”.</b>
        <p>Buscar orientación puede ser un primer paso.</p>
      </div>
      <p>Esta página no publica historias de visitantes ni recopila testimonios.</p>
    `);
  }

  function tool(name) {
    const actions = {
      quiz, simulator, help, certificate,
      plan, offer, chat, evidence, library, stories
    };
    if (actions[name]) actions[name]();
  }

  // =====================================
  // NUEVOS BOTONES EN HERRAMIENTAS
  // =====================================

  const grid = $("#herramientas .toolgrid");

  if (grid) {
    const newTools = [
      ["simulator","🎭","Simulador de decisiones","Explora historias y sus consecuencias educativas."],
      ["dashboard","📊","Mi panel de progreso","Revisa módulos y evaluaciones."]
    ];

    newTools.forEach(([id,icon,title,description]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = `
        <span>${icon}</span>
        <b>${title}</b>
        <small>${description}</small>
      `;
      button.onclick = () => {
        if (id === "dashboard") {
          $("#mi-panel").scrollIntoView({behavior:"smooth"});
        } else {
          tool(id);
        }
      };
      grid.appendChild(button);
    });
  }

  $$("[data-tool]").forEach(button => {
    button.onclick = () => tool(button.dataset.tool);
  });

  // =====================================
  // ACCESIBILIDAD Y DISEÑO ADAPTATIVO
  // =====================================

  const style = document.createElement("style");
  style.textContent = `
    button, a, input, textarea {
      touch-action: manipulation;
    }
    button:focus-visible, a:focus-visible,
    input:focus-visible, textarea:focus-visible {
      outline: 3px solid #a45ce0;
      outline-offset: 3px;
    }
    #modalBody {
      overflow-wrap: anywhere;
    }
    #modalBody .choice {
      cursor: pointer;
      line-height: 1.5;
    }
    #modalBody .action {
      min-height: 44px;
    }
    #mi-panel button {
      min-height: 44px;
    }
    @media(max-width:600px) {
      #mi-panel {
        padding-left: 16px;
        padding-right: 16px;
      }
      #modalBody {
        max-width: 100%;
      }
    }
    @media(prefers-reduced-motion:reduce) {
      *, *::before, *::after {
        scroll-behavior: auto !important;
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
  document.head.appendChild(style);

 
  // =====================================
  // INICIALIZACIÓN DE CÓDIGO VIOLETA
  // =====================================

  // Actualizar progreso y panel personal
  progress();

  // Fin del programa principal
})();

