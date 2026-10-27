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
  // MÓDULOS: 20 CASOS EDUCATIVOS
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
        },
        {
          q: "Una persona se burla de tus decisiones y luego dice que solo era una broma. ¿Qué conviene reconocer?",
          o: ["Que las burlas siempre son inofensivas", "Que el respeto importa incluso en las bromas", "Que debes aceptar todo", "Que el malestar no importa"],
          a: 1,
          e: "Las burlas repetidas que desvalorizan tus decisiones pueden ser una señal de falta de respeto."
        },
        {
          q: "Alguien revisa constantemente dónde estás y con quién hablas. ¿Qué puede indicar?",
          o: ["Apoyo sin condiciones", "Una muestra obligatoria de cariño", "Vigilancia y control", "Una regla universal"],
          a: 2,
          e: "La vigilancia constante puede limitar la autonomía y la privacidad."
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
        },
        {
          q: "Un desconocido te pide un código de verificación recibido por mensaje. ¿Qué haces?",
          o: ["No compartir el código y verificar por canales oficiales", "Enviarlo para resolver rápido", "Publicarlo", "Usarlo en el enlace recibido"],
          a: 0,
          e: "Los códigos de verificación son privados y no deben compartirse con terceros."
        },
        {
          q: "Descubres que alguien creó una cuenta falsa con tus fotos. ¿Qué opción es más segura?",
          o: ["Responder con amenazas", "Enviar más fotos", "Ignorar siempre sin pedir apoyo", "Reportar la suplantación y pedir ayuda a una persona de confianza"],
          a: 3,
          e: "Reportar la suplantación a la plataforma y buscar apoyo permite actuar sin exponerte más."
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
        },
        {
          q: "Una persona insiste en que aceptes una invitación pese a que ya dijiste que no. ¿Qué es válido?",
          o: ["Cambiar tu respuesta por presión", "Reafirmar tu decisión y buscar apoyo si te incomoda", "Pedir permiso para tener límites", "Aceptar por obligación"],
          a: 1,
          e: "Tu negativa debe ser respetada. Si insistir o confrontar puede ser riesgoso, prioriza tu seguridad."
        },
        {
          q: "¿Cuál es una forma respetuosa de expresar una preferencia?",
          o: ["Si no haces esto, te castigo", "No tienes derecho a opinar", "Prefiero no compartir esa información", "Tienes que adivinar lo que quiero"],
          a: 2,
          e: "Una frase clara en primera persona ayuda a expresar límites sin imponer decisiones a otras personas."
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
        },
        {
          q: "Una compañera dice que necesita ayuda, pero teme que la juzguen. ¿Qué haces?",
          o: ["Escucharla y ofrecer acompañarla a un servicio de orientación", "Compartir su historia en redes", "Exigirle detalles", "Prometer resolver todo tú sola"],
          a: 0,
          e: "Escuchar sin juzgar y ofrecer opciones de apoyo puede fortalecer su seguridad y autonomía."
        },
        {
          q: "Si un recurso que encuentras en redes pide datos personales antes de orientarte, ¿qué conviene?",
          o: ["Entregar los datos inmediatamente", "Compartir tus contraseñas", "Difundirlo sin revisar", "Verificar si pertenece a un servicio oficial"],
          a: 3,
          e: "Verificar la fuente oficial reduce el riesgo de fraudes y exposición de información personal."
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

  const chatScenarios = [
    {
      title: "¿Dónde estás?",
      context: "Una persona con la que sales insiste en saber tu ubicación todo el día.",
      other: "Si confías en mí, mándame tu ubicación en tiempo real. No debería molestarte.",
      options: [
        {text:"Puedo compartirla si eso evita una discusión.", safe:false, reply:"¿Ves? Era fácil. Ahora mantenla activada.", lesson:"Compartir la ubicación bajo presión puede facilitar la vigilancia. La confianza no exige acceso permanente."},
        {text:"Mi ubicación es privada. No quiero compartirla.", safe:true, reply:"No me gusta que me digas que no.", lesson:"Puedes poner límites sobre tu privacidad. Si temes una reacción peligrosa, no necesitas confrontar: busca apoyo."},
        {text:"Voy a consultar con alguien de confianza.", safe:true, reply:"No hace falta que se lo cuentes a nadie.", lesson:"Hablar con alguien de confianza puede ayudarte a evaluar la situación sin quedarte aislada."}
      ]
    },
    {
      title: "El código de acceso",
      context: "Una cuenta desconocida te escribe diciendo que puede recuperar tu perfil.",
      other: "Te acaba de llegar un código. Envíamelo para confirmar que eres tú.",
      options: [
        {text:"Te paso el código ahora.", safe:false, reply:"Gracias, ya puedo continuar.", lesson:"Un código de verificación es privado. Compartirlo puede permitir el acceso no autorizado a una cuenta."},
        {text:"No comparto códigos. Consultaré la aplicación oficial.", safe:true, reply:"¡Pero tienes que hacerlo rápido!", lesson:"La urgencia es una señal frecuente de engaño. Verifica desde la aplicación o el sitio oficial."},
        {text:"Voy a ignorar el mensaje y reportar la cuenta.", safe:true, reply:"...", lesson:"Bloquear o reportar una cuenta sospechosa puede reducir el contacto no deseado."}
      ]
    },
    {
      title: "Una amiga necesita hablar",
      context: "Una amiga te cuenta que alguien intenta apartarla de su grupo.",
      other: "Me siento sola. No sé si estoy exagerando, pero me preocupa.",
      options: [
        {text:"Seguro estás exagerando.", safe:false, reply:"Quizá no debería habértelo contado.", lesson:"Minimizar lo que siente una persona puede hacer que le resulte más difícil buscar ayuda."},
        {text:"Te escucho. ¿Quieres que busquemos opciones juntas?", safe:true, reply:"Gracias, me ayudaría conocer opciones.", lesson:"Escuchar sin juzgar y ofrecer acompañamiento respeta la autonomía de tu amiga."},
        {text:"Publicaré lo que me cuentas para que te ayuden.", safe:false, reply:"Por favor, no compartas eso.", lesson:"No difundas una historia privada sin consentimiento. Puede generar riesgos adicionales."}
      ]
    },
    {
      title: "La oferta demasiado buena",
      context: "Recibes una supuesta oferta de empleo por mensaje directo.",
      other: "Te contratamos hoy. Primero deposita una garantía y envía foto de tu DNI.",
      options: [
        {text:"Enviaré el dinero para asegurar el puesto.", safe:false, reply:"Perfecto, te paso una cuenta.", lesson:"Solicitar pagos o documentos sensibles sin verificar puede ser señal de fraude."},
        {text:"Verificaré la empresa y no enviaré documentos todavía.", safe:true, reply:"Si no pagas hoy, pierdes la oportunidad.", lesson:"Verificar la empresa por canales independientes y no actuar bajo presión protege tu información."},
        {text:"Reenviaré la oferta a todas mis amistades.", safe:false, reply:"¡Gracias por compartir!", lesson:"Antes de difundir una oferta, conviene verificar que sea auténtica."}
      ]
    },
    {
      title: "Una foto sin permiso",
      context: "Una persona amenaza con publicar una foto privada de otra.",
      other: "Si no haces lo que te pido, voy a publicar esa foto.",
      options: [
        {text:"Voy a responder con otra amenaza.", safe:false, reply:"Entonces esto empeorará.", lesson:"Responder con amenazas puede aumentar el riesgo. Busca apoyo seguro y orientación especializada."},
        {text:"Buscaré apoyo de una persona adulta de confianza o un servicio oficial.", safe:true, reply:"No quiero que nadie se entere.", lesson:"Nadie tiene derecho a presionarte con amenazas. Pedir apoyo a alguien de confianza o a servicios oficiales es una opción válida."},
        {text:"Compartiré la foto para explicar lo ocurrido.", safe:false, reply:"Ahora más personas la tienen.", lesson:"No difundas imágenes privadas. Puedes reportar la situación sin compartir el contenido."}
      ]
    }
  ];

  function simulator() {
    let current = 0;
    let recommended = 0;
    const history = [];

    function render() {
      const scenario = chatScenarios[current];
      const progressPct = Math.round(current / chatScenarios.length * 100);
      modal(`
        <div class="cv-chat-simulator">
          <small>💬 SIMULADOR DE CONVERSACIONES · ${current + 1} DE ${chatScenarios.length}</small>
          <h2 id="modalTitle">${esc(scenario.title)}</h2>
          <div class="cv-quiz-progress" role="progressbar" aria-label="Progreso del simulador"
            aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progressPct}">
            <div style="width:${progressPct}%"></div>
          </div>
          <p class="cv-chat-context">${esc(scenario.context)}</p>
          <div class="cv-chat-screen" id="chatScreen" aria-live="polite">
            <div class="cv-chat-bubble cv-chat-other"><small>Mensaje recibido</small><p>${esc(scenario.other)}</p></div>
          </div>
          <div id="chatChoices">
            <p><b>¿Cómo responderías?</b></p>
            ${scenario.options.map((option,i)=>`
              <button type="button" class="cv-chat-choice" data-chat-choice="${i}">${esc(option.text)}</button>
            `).join("")}
          </div>
          <div id="chatResult" aria-live="polite"></div>
          <p class="cv-chat-note">Conversaciones ficticias para aprender. No envían mensajes a personas reales ni guardan tus respuestas.</p>
        </div>
      `);
      $$("[data-chat-choice]").forEach(button => {
        button.onclick = () => {
          const option = scenario.options[Number(button.dataset.chatChoice)];
          if (option.safe) recommended++;
          history.push({title:scenario.title, recommended:option.safe});
          $("#chatChoices").remove();
          $("#chatScreen").insertAdjacentHTML("beforeend", `
            <div class="cv-chat-bubble cv-chat-mine"><small>Tu respuesta</small><p>${esc(option.text)}</p></div>
            <div class="cv-chat-bubble cv-chat-other"><small>Respuesta simulada</small><p>${esc(option.reply)}</p></div>
          `);
          $("#chatResult").innerHTML = `
            <div class="feedback ${option.safe?"good":"warn"}" role="status">
              <b>${option.safe?"🌟 Una opción que ayuda a cuidarte":"💜 Analicemos esta elección"}</b>
              <p>${esc(option.lesson)}</p>
            </div>
            <button class="action" id="nextChat">${current+1===chatScenarios.length?"Ver mi resumen 🌷":"Continuar conversación →"}</button>
          `;
          $("#nextChat").onclick = () => {
            current++;
            if (current < chatScenarios.length) render();
            else summary();
          };
        };
      });
    }

    function summary() {
      modal(`
        <small>🌷 RECORRIDO COMPLETADO</small>
        <h2 id="modalTitle">💜 ¡Aprendiste a reconocer señales!</h2>
        <p>Exploraste <b>${chatScenarios.length} conversaciones ficticias</b> y elegiste
        <b>${recommended} de ${chatScenarios.length}</b> respuestas recomendadas.</p>
        <div class="cv-quiz-progress" role="progressbar" aria-label="Opciones recomendadas"
          aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(recommended/chatScenarios.length*100)}">
          <div style="width:${Math.round(recommended/chatScenarios.length*100)}%"></div>
        </div>
        <div class="feedback good">
          <b>Lo importante es aprender</b>
          <p>No existe una única respuesta segura en todas las situaciones. Si algo te pone en peligro,
          busca apoyo confiable o utiliza el directorio oficial de ayuda.</p>
        </div>
        <h3>Tu recorrido</h3>
        ${history.map((h,i)=>`<p>${h.recommended?"🌟":"💜"} ${i+1}. ${esc(h.title)}</p>`).join("")}
        <button class="action" id="repeatChat">↻ Volver a practicar</button>
        <button class="action cv-secondary-action" id="helpAfterChat">💜 Ver rutas de ayuda</button>
        <button class="action cv-secondary-action" id="closeChat">Terminar</button>
      `);
      $("#repeatChat").onclick = () => simulator();
      $("#helpAfterChat").onclick = () => help();
      $("#closeChat").onclick = close;
    }
    render();
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
    const eligible = allDone();

    modal(`
      <small>🏅 CÓDIGO VIOLETA · RECONOCIMIENTO EDUCATIVO</small>
      <h2 id="modalTitle">Mi constancia de participación</h2>
      <p>Has completado <b>${n} de 4 módulos</b> (${n*5} de 20 casos disponibles).</p>
      <div class="cv-quiz-progress" role="progressbar" aria-label="Progreso para obtener constancia"
        aria-valuemin="0" aria-valuemax="100" aria-valuenow="${n*25}">
        <div style="width:${n*25}%"></div>
      </div>
      ${eligible
        ? '<div class="feedback good"><b>🌷 ¡Constancia desbloqueada!</b><p>Puedes crearla, imprimirla o guardarla como PDF desde el navegador.</p></div>'
        : '<div class="feedback warn"><b>🔒 Aún no está desbloqueada</b><p>Completa los cuatro módulos. No necesitas obtener una nota mínima.</p></div>'}
      <div class="field">
        <label for="certName">Nombre o seudónimo para la constancia (opcional)</label>
        <input id="certName" maxlength="80" autocomplete="off" placeholder="Ej.: Participante Violeta">
      </div>
      <button class="action" id="makeCert" ${eligible?"":"disabled"}>🌸 Crear constancia imprimible</button>
      <p><small>Tu nombre solo se usa en el documento que generas. No se envía a servidores. La constancia acredita la participación en esta web, no una certificación académica u oficial.</small></p>
    `);

    $("#makeCert").onclick = () => {
      const name = esc($("#certName").value.trim() || "Participante Violeta");
      const date = new Date().toLocaleDateString("es-PE", {day:"2-digit",month:"long",year:"numeric"});
      const initScore = initial && Number.isInteger(initial.score) && initial.total===10 ? initial.score+"/10" : "No registrada";
      const finalScore = final && Number.isInteger(final.score) && final.total===10 ? final.score+"/10" : "No registrada";
      const win = window.open("", "_blank");
      if (!win) {
        toast("El navegador bloqueó la ventana. Permite ventanas emergentes para crear tu constancia.");
        return;
      }
      win.document.open();
      win.document.write(`
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Constancia educativa · Código Violeta</title>
<style>
*{box-sizing:border-box}
body{margin:0;padding:28px;background:#f5eef9;font-family:Arial,Helvetica,sans-serif;color:#35124e}
.actions{max-width:950px;margin:0 auto 18px;display:flex;gap:10px;flex-wrap:wrap}
.actions button{border:0;border-radius:10px;background:#6f2d99;color:white;padding:12px 20px;font-size:15px;cursor:pointer}
.actions .back{background:#e9d8f2;color:#411a61}
.paper{position:relative;max-width:950px;min-height:600px;margin:auto;background:#fff;border:2px solid #d7b6e9;box-shadow:0 10px 35px #44205b20;padding:52px 58px;text-align:center;overflow:hidden}
.paper:before,.paper:after{content:"✿";position:absolute;color:#ead7f4;font-size:130px}
.paper:before{top:-60px;left:-25px}.paper:after{bottom:-70px;right:-25px}
.brand{color:#6f2d99;font-size:24px;font-weight:900;letter-spacing:2px}
.eyebrow{font-size:12px;letter-spacing:3px;color:#8951aa;font-weight:700;margin:18px 0}
h1{font-family:Georgia,serif;font-size:38px;line-height:1.2;color:#44145e;margin:15px 0 24px}
.name{font-family:Georgia,serif;font-size:31px;color:#6b2a94;border-bottom:2px solid #d5b0e9;display:inline-block;padding:0 30px 9px;max-width:100%;overflow-wrap:anywhere}
.lead{font-size:17px;line-height:1.6;max-width:750px;margin:20px auto}
.modules{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:700px;margin:24px auto}
.modules div{background:#f5ecfa;border-radius:9px;padding:13px 8px;font-size:14px;font-weight:bold}
.details{display:flex;justify-content:center;gap:22px;flex-wrap:wrap;border-top:1px solid #e3d1ee;padding-top:20px;margin-top:22px;font-size:14px}
.footer{font-size:12px;color:#6e5978;margin-top:25px;line-height:1.6}
.creator{font-weight:bold;color:#572179}
@page{size:A4 landscape;margin:10mm}
@media print{body{padding:0;background:white}.actions{display:none}.paper{max-width:none;min-height:175mm;box-shadow:none;border:2px solid #b989d6;padding:30px 45px}h1{font-size:34px}}
@media(max-width:620px){.paper{padding:28px 16px}.modules{grid-template-columns:1fr}h1{font-size:30px}.name{font-size:24px}}
</style>
</head>
<body>
<div class="actions"><button onclick="window.print()">🖨️ Imprimir o guardar como PDF</button><button class="back" onclick="window.close()">Cerrar</button></div>
<main class="paper">
  <div class="brand">✿ CÓDIGO VIOLETA</div>
  <p class="eyebrow">CONSTANCIA DE PARTICIPACIÓN EDUCATIVA</p>
  <h1>Reconocimiento por completar la ruta</h1>
  <div class="name">${name}</div>
  <p class="lead">Ha completado el recorrido educativo de Código Violeta, dedicado a reconocer señales de alerta, proteger la privacidad digital, expresar límites y fortalecer redes de apoyo.</p>
  <section class="modules" aria-label="Módulos completados">
    <div>🚩 Reconoce las señales</div>
    <div>🔐 Escudo Digital</div>
    <div>🗣️ Mi voz pone límites</div>
    <div>🤝 Activa tu red</div>
  </section>
  <div class="details">
    <span><b>Participación:</b> 4 módulos · 20 casos educativos</span>
    <span><b>Evaluación inicial:</b> ${initScore}</span>
    <span><b>Evaluación final:</b> ${finalScore}</span>
    <span><b>Fecha:</b> ${esc(date)}</span>
  </div>
  <div class="footer">
    <p>💜 Aprender, reconocer y acompañar también son formas de cuidarnos.</p>
    <p class="creator">Proyecto Código Violeta · Creado por Guiselle Pilar Trejo Obregón</p>
    <p>Documento generado localmente a partir del progreso guardado en este navegador. No es una certificación oficial, no acredita horas académicas y no dispone de verificación externa.</p>
  </div>
</main>
</body>
</html>`);
      win.document.close();
      win.focus();
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


  // Conversaciones simuladas: burbujas legibles y opciones grandes.
  const cvConversationStyles = document.createElement("style");
  cvConversationStyles.textContent = `
    .cv-chat-context{background:#f3e7fc;padding:13px 16px;border-radius:12px;line-height:1.5}
    .cv-chat-screen{background:linear-gradient(145deg,#f8f1ff,#eee0f8);padding:18px 12px;border-radius:16px;min-height:170px;display:flex;flex-direction:column;gap:14px;margin:16px 0}
    .cv-chat-bubble{padding:12px 16px;border-radius:17px;max-width:87%;box-shadow:0 2px 8px #421b5c12}
    .cv-chat-bubble small{font-weight:700;display:block;margin-bottom:4px;opacity:.7}
    .cv-chat-bubble p{margin:0;line-height:1.5;overflow-wrap:anywhere}
    .cv-chat-other{align-self:flex-start;background:white;color:#39204a;border-bottom-left-radius:4px}
    .cv-chat-mine{align-self:flex-end;background:#7c3baa;color:white;border-bottom-right-radius:4px}
    .cv-chat-choice{display:block;width:100%;text-align:left;background:#fff;color:#4e246a;border:2px solid #d9bce9;padding:14px 16px;border-radius:12px;margin:10px 0;font:inherit;cursor:pointer;line-height:1.5}
    .cv-chat-choice:hover,.cv-chat-choice:focus-visible{border-color:#8137af;background:#f6eafb;outline-offset:2px}
    .cv-chat-note{font-size:.85rem;color:#695777;line-height:1.5}
    @media(max-width:600px){.cv-chat-bubble{max-width:95%}}
  `;
  document.head.appendChild(cvConversationStyles);

  // =====================================
  // NUEVOS BOTONES EN HERRAMIENTAS
  // =====================================

  const grid = $("#herramientas .toolgrid");

  if (grid) {
    const newTools = [
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
