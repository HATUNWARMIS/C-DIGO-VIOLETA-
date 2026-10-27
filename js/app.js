
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

  // =====================================
  // JARDÍN DE LOGROS VIOLETA
  // =====================================

  function actualizarJardinVioleta() {
    const jardin = document.getElementById("jardin-violeta");
    if (!jardin) return;

    const flores = [
      {
        id: "signals",
        nombre: "Reconoce las señales",
        emoji: "🌹"
      },
      {
        id: "digital",
        nombre: "Escudo Digital",
        emoji: "🌷"
      },
      {
        id: "voice",
        nombre: "Mi voz pone límites",
        emoji: "🌸"
      },
      {
        id: "network",
        nombre: "Activa tu red",
        emoji: "🌻"
      }
    ];

    const completados = flores.filter(
      flor => state[flor.id] === true
    ).length;

    const porcentaje = completados * 25;

    document.getElementById("jardinPorcentaje")
      .textContent = porcentaje + "%";

    document.getElementById("jardinBarra")
      .style.width = porcentaje + "%";

    jardin.querySelector(".jardin-barra")
      .setAttribute("aria-valuenow", String(porcentaje));

    const mensajes = [
      "Tu jardín está comenzando. 🌱",
      "¡Tu primera flor ha crecido! 🌷",
      "¡Ya tienes dos flores! 💜",
      "¡Tres flores! Tu jardín está creciendo. 🌸",
      "¡Tu jardín está completamente florecido! 🌺"
    ];

    document.getElementById("jardinEstado")
      .textContent = mensajes[completados];

    document.getElementById("jardinMensaje")
      .textContent = completados === 4
        ? "¡Lo lograste! Soy Vio y quiero felicitarte. Completaste los cuatro módulos. Tu jardín representa todo lo que aprendiste. 💜"
        : "¡Hola! Soy Vio. Has completado " +
          completados +
          " de 4 módulos. Cada aprendizaje hace crecer tu jardín. 🌷";

    const contenedor = document.getElementById("jardinFlores");

    contenedor.replaceChildren();

    flores.forEach(flor => {
      const completada = state[flor.id] === true;

      const tarjeta = document.createElement("div");
      tarjeta.className = "jardin-flor" +
        (completada ? " desbloqueada" : "");

      const imagen = document.createElement("span");
      imagen.textContent = completada ? flor.emoji : "🌱";
      imagen.setAttribute("aria-hidden", "true");

      const nombre = document.createElement("b");
      nombre.textContent = flor.nombre;

      const estado = document.createElement("small");
      estado.textContent = completada
        ? "✓ Flor desbloqueada"
        : "Pendiente";

      tarjeta.append(imagen, nombre, estado);
      contenedor.appendChild(tarjeta);
    });

    const reconocimiento =
      document.getElementById("jardinReconocimiento");

    reconocimiento.disabled = completados !== 4;
  }

  
  function progress() {
    const n = completed();
    const percent = n * 25;

    $("#percent").textContent = percent + "%";
    $("#bar").style.width = percent + "%";
    $("#progressText").textContent =
      `${n} de 4 módulos completados`;

    save(KEY, state);

    renderDashboard();

    // Actualizar automáticamente el jardín.
    actualizarJardinVioleta();
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
      const pct = Math.round((current / mod.cases.length) * 100);
      modal(`
        <small>🌷 CASO ${current + 1} DE ${mod.cases.length}</small>
        <h2 id="modalTitle">${mod.title}</h2>
        <div class="cv-quiz-progress" role="progressbar" aria-label="Progreso del módulo"
          aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <div style="width:${pct}%"></div>
        </div>
        <p class="cv-quiz-count">Has explorado ${current} de ${mod.cases.length} casos</p>
        <p>${mod.intro}</p>
        <p class="cv-quiz-question"><b>${esc(item.q)}</b></p>
        <form id="caseForm">
          ${item.o.map((option, i) => `
            <label class="choice cv-quiz-option">
              <input type="radio" name="answer" value="${i}" required>
              <span class="cv-quiz-letter">${String.fromCharCode(65+i)}</span>
              <span>${esc(option)}</span>
            </label>
          `).join("")}
          <button class="action cv-quiz-submit" type="submit" disabled>Comprobar respuesta ✓</button>
        </form>
        <div id="caseFeedback" aria-live="polite"></div>
      `);

      const tutora = agregarVioTutora({
        mensaje: "Caso " + (current + 1) + ". Lee con calma y selecciona una alternativa.",
        pista: "Busca la alternativa que respete la autonomía, la privacidad y la seguridad.",
        explicacion: "Piensa qué opción protege mejor los derechos de la persona."
      });

      const form = $("#caseForm");
      form.addEventListener("change", () => {
        form.querySelector('button[type="submit"]').disabled = false;
        form.querySelectorAll(".cv-quiz-option").forEach(label => {
          label.classList.toggle("cv-selected", label.querySelector("input").checked);
        });
      });

      form.onsubmit = e => {
        e.preventDefault();
        const selected = new FormData(form).get("answer");
        if (selected === null) return;
        const answer = Number(selected);
        const ok = answer === item.a;
        if (ok) correct++;
        if (tutora) {
          tutora.bloquearPistas();
          tutora.mostrar(ok
            ? "¡Excelente! " + item.e
            : "Gracias por intentarlo. La respuesta esperada es: " + item.o[item.a] + ". " + item.e);
        }
        form.remove();
        $("#caseFeedback").innerHTML = `
          <div class="feedback ${ok ? "good" : "warn"}" role="status">
            <b>${ok ? "🌟 ¡Respuesta correcta!" : "💜 Aprendamos de este caso"}</b>
            <p><b>Respuesta esperada:</b> ${esc(item.o[item.a])}</p>
            <p>${esc(item.e)}</p>
          </div>
          <button class="action" id="nextCase">
            ${current === mod.cases.length - 1 ? "Ver mi resultado 🌸" : "Continuar al siguiente caso →"}
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
        <small>🌷 MÓDULO FINALIZADO</small>
        <h2 id="modalTitle">💜 ¡Has completado este recorrido!</h2>
        <h3>${mod.title}</h3>
        <div class="cv-quiz-progress" role="progressbar" aria-label="Módulo completado"
          aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
          <div style="width:100%"></div>
        </div>
        <div class="feedback good">
          <b>🌟 ${correct} de ${mod.cases.length} respuestas correctas</b>
          <p>Has revisado las explicaciones de los tres casos.</p>
          <p>Aprender también implica equivocarse y volver a intentarlo.</p>
        </div>
        <button class="action" id="saveModule">🌸 Guardar logro en mi Jardín Violeta</button>
        <button class="action cv-secondary-action" id="repeatModule" type="button">↻ Practicar nuevamente</button>
      `);
      agregarVioTutora({
        mensaje: "¡Terminaste! Tu resultado es " + correct + " de " + mod.cases.length + ". Puedes guardar tu flor o practicar otra vez.",
        pista: "Repetir los casos te ayudará a recordar lo aprendido.",
        explicacion: "Cada caso presenta una situación cotidiana para practicar decisiones informadas."
      });
      $("#saveModule").onclick = () => {
        state[id] = true;
        progress();
        close();
        toast(allDone()
          ? "¡Los cuatro módulos están completos! Evaluación final desbloqueada. 💜"
          : "¡Tu flor ha crecido en el Jardín Violeta! 🌷");
      };
      $("#repeatModule").onclick = () => {
        current = 0;
        correct = 0;
        showCase();
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
        <p>Completa los cuatro módulos para desbloquear la evaluación final.</p>
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
    const answers = Array(questions.length).fill(null);

    function showQuestion() {
      const q = questions[current];
      const pct = Math.round((current / questions.length) * 100);
      modal(`
        <small>🧠 EVALUACIÓN ${phase.toUpperCase()} · ${current + 1} DE ${questions.length}</small>
        <h2 id="modalTitle">Mi desafío violeta 💜</h2>
        <div class="cv-quiz-progress" role="progressbar" aria-label="Progreso de evaluación"
          aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <div style="width:${pct}%"></div>
        </div>
        <p class="cv-quiz-count">${current} preguntas respondidas · ${questions.length-current} pendientes</p>
        <p class="cv-quiz-question"><b>${esc(q[0])}</b></p>
        <form id="quizForm">
          ${q[1].map((option,i) => `
            <label class="choice cv-quiz-option">
              <input type="radio" name="answer" value="${i}" ${answers[current] === i ? "checked" : ""} required>
              <span class="cv-quiz-letter">${String.fromCharCode(65+i)}</span>
              <span>${esc(option)}</span>
            </label>
          `).join("")}
          <div class="cv-quiz-navigation">
            ${current > 0 ? '<button class="action cv-secondary-action" id="prevQuestion" type="button">← Anterior</button>' : ""}
            <button class="action cv-quiz-submit" type="submit" ${answers[current] === null ? "disabled" : ""}>
              ${current === questions.length-1 ? "Terminar evaluación 🌟" : "Siguiente pregunta →"}
            </button>
          </div>
        </form>
        <p><small>Tu respuesta se puede cambiar antes de finalizar. No se envía a un servidor.</small></p>
      `);

      agregarVioTutora({
        mensaje: "¡Vas por la pregunta " + (current+1) + " de " + questions.length + "! Puedes cambiar tu respuesta antes de finalizar.",
        pista: "Lee todas las opciones y piensa en la privacidad, el respeto y la seguridad.",
        explicacion: "Las soluciones se mostrarán al finalizar, para que la evaluación sea justa."
      });

      const form = $("#quizForm");
      function paintSelection() {
        form.querySelectorAll(".cv-quiz-option").forEach(label => {
          label.classList.toggle("cv-selected", label.querySelector("input").checked);
        });
      }
      paintSelection();
      form.addEventListener("change", () => {
        const value = new FormData(form).get("answer");
        answers[current] = value === null ? null : Number(value);
        form.querySelector('button[type="submit"]').disabled = answers[current] === null;
        paintSelection();
      });
      if (current > 0) {
        $("#prevQuestion").onclick = () => {
          const value = new FormData(form).get("answer");
          if (value !== null) answers[current] = Number(value);
          current--;
          showQuestion();
        };
      }
      form.onsubmit = e => {
        e.preventDefault();
        const value = new FormData(form).get("answer");
        if (value === null) return;
        answers[current] = Number(value);
        current++;
        if (current < questions.length) showQuestion();
        else results();
      };
    }

    function results() {
      const score = answers.reduce(
        (sum, answer, i) => sum + Number(answer === questions[i][2]), 0
      );
      const result = {score, total:questions.length, date:new Date().toISOString()};
      save(validInitial ? FINAL : INITIAL, result);
      renderDashboard();

      const comparison = validInitial
        ? `<div class="feedback good">
            <b>📊 Comparación de aprendizaje</b>
            <p>Evaluación inicial: ${initial.score}/10 · Evaluación final: ${score}/10</p>
            <p>Diferencia: <b>${score-initial.score > 0 ? "+" : ""}${score-initial.score}</b> respuestas correctas</p>
          </div>`
        : `<div class="feedback good">
            <b>🌷 Evaluación inicial registrada</b>
            <p>Ahora puedes recorrer los cuatro módulos para desbloquear la evaluación final.</p>
          </div>`;

      modal(`
        <small>🌟 RESULTADOS · EVALUACIÓN ${phase.toUpperCase()}</small>
        <h2 id="modalTitle">💜 ¡Tu aprendizaje cuenta!</h2>
        <p class="cv-result-number">${score} <span>/ ${questions.length}</span></p>
        <p><b>${score*10}% de respuestas correctas</b></p>
        <div class="cv-quiz-progress" role="progressbar" aria-label="Porcentaje de aciertos"
          aria-valuenow="${score*10}" aria-valuemin="0" aria-valuemax="100">
          <div style="width:${score*10}%"></div>
        </div>
        ${comparison}
        <h3>📖 Revisa tus respuestas y aprende</h3>
        ${questions.map((q,i) => `
          <div class="feedback ${answers[i] === q[2] ? "good" : "warn"}">
            <b>${i+1}. ${esc(q[0])}</b>
            <p>${answers[i] === q[2] ? "✓ ¡Correcta!" : "💡 Para reforzar"}</p>
            <p><b>Tu respuesta:</b> ${esc(q[1][answers[i]] ?? "Sin respuesta")}</p>
            <p><b>Respuesta esperada:</b> ${esc(q[1][q[2]])}</p>
            <p>${esc(q[3])}</p>
          </div>
        `).join("")}
        <button class="action" id="finishQuiz">Continuar mi ruta →</button>
      `);
      agregarVioTutora({
        mensaje: "¡Terminaste! Lograste " + score + " de " + questions.length + ". Revisa las explicaciones y sigue aprendiendo.",
        pista: "Observa las preguntas que quieres reforzar.",
        explicacion: "Cada explicación muestra el motivo de la respuesta esperada."
      });
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
    const resources = [
      {id:"100",group:["violencia","menores"],icon:"📞",name:"Línea 100",tag:"Orientación especializada · 24 horas",detail:"Atención gratuita y confidencial para personas afectadas por violencia familiar o sexual, y para quienes conocen una situación de violencia.",number:"100",url:"https://www.gob.pe/479-reportar-casos-de-violencia-contra-las-mujeres-e-integrantes-del-grupo-familiar",label:"Información oficial"},
      {id:"chat",group:["violencia","digital","menores"],icon:"💬",name:"Chat 100",tag:"Orientación por internet · 24 horas",detail:"Puedes conversar con profesionales sobre violencia en relaciones, señales de alerta y rutas de atención. Requiere conexión a internet.",url:"https://chat100.warminan.gob.pe/",label:"Abrir Chat 100"},
      {id:"105",group:["emergencia"],icon:"🚨",name:"Policía Nacional",tag:"Emergencia policial",detail:"Si hay peligro inmediato, busca un lugar seguro y solicita ayuda de emergencia.",number:"105",url:"https://www.gob.pe/547",label:"Ver teléfonos oficiales"},
      {id:"106",group:["emergencia"],icon:"🚑",name:"SAMU",tag:"Urgencia médica · según cobertura",detail:"Para emergencias médicas en zonas donde opera el SAMU. Si no está disponible, solicita ayuda a un servicio local de emergencia.",number:"106",url:"https://www.gob.pe/547",label:"Consultar cobertura"},
      {id:"113",group:["emocional","menores"],icon:"🫶",name:"Línea 113 · opción 5",tag:"Orientación en salud mental · 24 horas",detail:"Apoyo y orientación sobre ansiedad, estrés, problemas familiares y otras situaciones de salud mental.",number:"113",url:"https://www.gob.pe/555-recibir-informacion-y-orientacion-en-salud-linea-113-salud",label:"Información del MINSA"},
      {id:"1810",group:["menores"],icon:"🧒",name:"Línea ANNA 1810",tag:"Protección de niñas, niños y adolescentes",detail:"Servicio de orientación y protección para niñas, niños y adolescentes que necesitan ser escuchados y acompañados.",number:"1810",url:"https://www.gob.pe/institucion/mimp/noticias/1256300-el-peru-no-se-detiene-mimp-garantiza-atencion-ininterrumpida-de-servicios-para-victimas-de-violencia",label:"Información oficial"},
      {id:"cem",group:["violencia","menores"],icon:"🏛️",name:"Centros Emergencia Mujer y Familia",tag:"Atención presencial especializada",detail:"Ofrecen orientación legal, psicológica y social. Consulta el directorio oficial para localizar un centro y verificar sus horarios.",url:"https://www.gob.pe/institucion/warmi%C3%B1an/informes-publicaciones/3487068-directorio-de-servicios-del-programa-nacional-warmi-nan",label:"Buscar un centro oficial"},
      {id:"mental",group:["emocional"],icon:"🏥",name:"Centros de Salud Mental Comunitaria",tag:"Atención profesional presencial",detail:"Puedes acudir a un establecimiento de salud para recibir evaluación y orientación sobre atención especializada.",url:"https://www.gob.pe/saludmental",label:"Conocer cómo acceder"}
    ];
    const categories = [
      ["todos","🌷 Todos"],["emergencia","🚨 Peligro inmediato"],
      ["violencia","💜 Violencia o control"],["digital","📱 Violencia digital"],
      ["emocional","🫶 Apoyo emocional"],["menores","🧒 Soy menor de edad"]
    ];
    modal(`
      <div class="cv-help-directory">
        <small>💜 CÓDIGO VIOLETA · PERÚ</small>
        <h2 id="modalTitle">Encuentra una ruta de ayuda</h2>
        <p>Elige lo que necesitas. No tienes que contar aquí tu historia ni escribir datos personales.</p>
        <div class="cv-help-urgent" role="note">
          <strong>🚨 ¿Hay peligro inmediato?</strong>
          <p>Busca un lugar seguro si puedes y contacta a emergencias. Si eres menor de edad, también puedes acudir a una persona adulta de confianza.</p>
          <a class="cv-help-call" href="tel:105">📞 Llamar al 105 · Policía</a>
        </div>
        <h3>¿Qué tipo de apoyo buscas?</h3>
        <div class="cv-help-filters" role="group" aria-label="Filtrar servicios de ayuda">
          ${categories.map(([id,label]) => `<button type="button" class="cv-help-filter" data-help-filter="${id}" aria-pressed="${id === "todos"}">${label}</button>`).join("")}
        </div>
        <p class="cv-help-summary" id="helpSummary" aria-live="polite"></p>
        <div class="cv-help-results" id="helpResults"></div>
        <details class="cv-help-guide">
          <summary>💬 ¿Qué puedo decir al pedir ayuda?</summary>
          <p>Si no sabes cómo comenzar, puedes decir: «Necesito orientación sobre una situación que me preocupa. ¿Pueden explicarme qué opciones tengo?»</p>
          <p>Comparte únicamente la información que el servicio oficial necesite para orientarte.</p>
        </details>
        <details class="cv-help-guide">
          <summary>🔐 Privacidad y salida rápida</summary>
          <p>Este directorio no pide tu nombre, no registra tu elección y no envía mensajes ni alertas automáticamente.</p>
          <p>Los enlaces externos abren servicios independientes, que pueden aplicar sus propias políticas de privacidad. La salida rápida no borra el historial ni elimina rastros del navegador.</p>
        </details>
        <p class="cv-help-footnote">Información para Perú. Los servicios y su disponibilidad pueden cambiar: confirma los detalles en los enlaces oficiales. Código Violeta es educativo y no sustituye atención profesional ni servicios de emergencia.</p>
      </div>
    `);
    const resultBox = $("#helpResults");
    const summary = $("#helpSummary");
    function showResources(category) {
      const list = category === "todos" ? resources : resources.filter(r => r.group.includes(category));
      summary.textContent = list.length + (list.length === 1 ? " recurso disponible" : " recursos disponibles") + " para esta opción";
      resultBox.innerHTML = list.map(r => `
        <article class="cv-help-card">
          <div class="cv-help-card-top"><span aria-hidden="true">${r.icon}</span><div><h4>${esc(r.name)}</h4><small>${esc(r.tag)}</small></div></div>
          <p>${esc(r.detail)}</p>
          <div class="cv-help-actions">
            ${r.number ? `<a class="cv-help-call" href="tel:${r.number}" aria-label="Llamar al ${r.number}">📞 Llamar al ${r.number}</a>` : ""}
            <a class="cv-help-link" href="${r.url}" target="_blank" rel="noopener noreferrer">${esc(r.label)} ↗</a>
          </div>
        </article>`).join("");
      $$("[data-help-filter]").forEach(button => {
        const selected = button.dataset.helpFilter === category;
        button.setAttribute("aria-pressed", String(selected));
        button.classList.toggle("cv-help-filter-active", selected);
      });
    }
    $$("[data-help-filter]").forEach(button => button.onclick = () => showResources(button.dataset.helpFilter));
    showResources("todos");
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

  // Estilos del directorio de ayuda, accesibles en celular y escritorio.
  const helpStyle = document.createElement("style");
  helpStyle.textContent = `
    .cv-help-directory{color:#351451;line-height:1.55}
    .cv-help-directory h2{margin:6px 0 10px}
    .cv-help-directory h3{margin:20px 0 10px;font-size:1.05rem}
    .cv-help-urgent{padding:16px;border:2px solid #e8b6c5;border-radius:17px;background:#fff1f4;margin:18px 0}
    .cv-help-urgent p{margin:7px 0 12px}
    .cv-help-filters{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
    #modalBody .cv-help-filter{border:1px solid #d6b9e8;background:#f8f0ff;color:#522575;border-radius:100px;padding:9px 13px;font-weight:700;cursor:pointer;min-height:44px}
    #modalBody .cv-help-filter[aria-pressed="true"]{background:#6e2ca0;color:#fff;border-color:#6e2ca0}
    .cv-help-summary{font-size:.9rem;color:#685075;margin:14px 0 8px}
    .cv-help-results{display:grid;gap:12px}
    .cv-help-card{border:1px solid #e6d4f1;border-radius:18px;background:#fff;padding:15px;box-shadow:0 2px 9px #5a26720b}
    .cv-help-card-top{display:flex;align-items:center;gap:10px}
    .cv-help-card-top>span{font-size:1.6rem}
    .cv-help-card h4{margin:0;font-size:1.08rem;color:#512477}
    .cv-help-card small{color:#745b84}
    .cv-help-card p{margin:10px 0 12px}
    .cv-help-actions{display:flex;flex-wrap:wrap;gap:8px}
    #modalBody .cv-help-call,#modalBody .cv-help-link{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;font-weight:700;min-height:44px;padding:9px 13px;border-radius:12px;box-sizing:border-box}
    #modalBody .cv-help-call{background:#7431a6;color:#fff}
    #modalBody .cv-help-link{background:#f2e6fa;color:#522575;border:1px solid #dfc8ed}
    .cv-help-guide{margin-top:12px;border:1px solid #e6d4f1;border-radius:13px;padding:12px 15px;background:#fbf7ff}
    .cv-help-guide summary{font-weight:700;cursor:pointer}
    .cv-help-footnote{font-size:.82rem;color:#685075;margin:20px 0 0}
    @media(max-width:540px){.cv-help-actions>a{width:100%}.cv-help-filters{gap:6px}.cv-help-card{padding:12px}}
    @media(prefers-reduced-motion:reduce){.cv-help-directory *{scroll-behavior:auto!important}}
  `;
  document.head.appendChild(helpStyle);

  // Estilos exclusivos para los cuestionarios dinámicos.
  const quizStyle = document.createElement("style");
  quizStyle.textContent = `
    .cv-quiz-progress{height:13px;background:#eee1f7;border-radius:20px;overflow:hidden;margin:16px 0 5px}
    .cv-quiz-progress>div{height:100%;background:linear-gradient(90deg,#ae6bd9,#7330a5);border-radius:20px;transition:width .3s ease}
    .cv-quiz-count{font-size:.9rem;color:#725887;margin:4px 0 20px}
    .cv-quiz-question{font-size:1.16rem;line-height:1.5;margin:16px 0}
    #modalBody .cv-quiz-option{display:flex;align-items:center;gap:12px;padding:14px 16px;margin:10px 0;border:2px solid #e8d8f4;border-radius:15px;background:#fff;transition:border-color .15s,background .15s;cursor:pointer}
    #modalBody .cv-quiz-option:hover{border-color:#a56cd0;background:#faf5ff}
    #modalBody .cv-quiz-option.cv-selected{border-color:#8a42b8;background:#f4e8ff}
    .cv-quiz-letter{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;min-width:32px;border-radius:50%;background:#efe1f8;color:#542578;font-weight:800}
    #modalBody .cv-quiz-option input{accent-color:#8135b5;flex-shrink:0}
    #modalBody .cv-quiz-submit:disabled{opacity:.55;cursor:not-allowed}
    .cv-quiz-navigation{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:18px}
    #modalBody .cv-secondary-action{background:#f0e4fa;color:#512476;border:1px solid #cfb1e5}
    .cv-result-number{font-size:clamp(2.5rem,7vw,4rem);font-weight:900;color:#7633ab;margin:8px 0}
    .cv-result-number span{font-size:1.35rem;color:#766085}
    @media(max-width:600px){#modalBody .cv-quiz-option{padding:12px 10px}.cv-quiz-navigation .action{flex:1}}
    @media(prefers-reduced-motion:reduce){.cv-quiz-progress>div{transition:none}}
  `;
  document.head.appendChild(quizStyle);

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

 
  // RECONOCIMIENTO DEL JARDÍN COMPLETO
  const botonJardin =
    document.getElementById("jardinReconocimiento");

  if (botonJardin) {
    botonJardin.addEventListener("click", () => {
      if (!allDone()) return;

      // Reutiliza la constancia educativa existente.
      certificate();
    });
  }

  // =====================================
  // INICIALIZACIÓN DE CÓDIGO VIOLETA
  // =====================================

  // Actualizar progreso y panel personal
  progress();

  // Fin del programa principal
})();
