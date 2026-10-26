
(() => {
  "use strict";

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  const esc = s => String(s ?? "").replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c])
  );

  const moduleIds = ["signals", "digital", "voice", "network"];
  const quizKey = "cv-quiz-initial-v1";

  let state = {};

  try {
    state = JSON.parse(
      localStorage.getItem("cv-progress") || "{}"
    );
  } catch (e) {
    state = {};
  }

  if (!state || typeof state !== "object") {
    state = {};
  }

  moduleIds.forEach(id => {
    state[id] = state[id] === true;
  });

  const completeCount = () =>
    moduleIds.filter(id => state[id]).length;

  function progress() {
    const n = completeCount();
    const p = Math.round(n / 4 * 100);

    $("#percent").textContent = p + "%";
    $("#bar").style.width = p + "%";
    $("#progressText").textContent =
      n + " de 4 módulos completados";

    try {
      localStorage.setItem(
        "cv-progress",
        JSON.stringify(state)
      );
    } catch (e) {}
  }

  function toast(message) {
    $("#toast").textContent = message;
    $("#toast").classList.add("show");

    setTimeout(() => {
      $("#toast").classList.remove("show");
    }, 2500);
  }

  function close() {
    $("#backdrop").hidden = true;
    document.body.style.overflow = "";
  }

  function modal(html) {
    $("#modalBody").innerHTML = html;
    $("#backdrop").hidden = false;
    document.body.style.overflow = "hidden";
  }

  $("#close").onclick = close;

  $("#backdrop").onclick = e => {
    if (e.target.id === "backdrop") close();
  };

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
  });

  $("#menubtn").onclick = () => {
    $("#nav").classList.toggle("open");
  };

  $$("#nav a").forEach(a => {
    a.onclick = () => $("#nav").classList.remove("open");
  });

  function exit() {
    window.open(
      "https://www.google.com/",
      "_blank",
      "noopener"
    );

    toast(
      "Se abrió otra pestaña. Esto no borra el historial."
    );
  }

  $("#exit").onclick = $("#exit2").onclick = exit;

  // ==========================================
  // CUATRO MÓDULOS EDUCATIVOS
  // 12 CASOS INTERACTIVOS
  // ==========================================

  const mods = {
    signals: {
      title: "🔎 Reconoce las señales",
      intro:
        "Identifica conductas de control y relaciones basadas en el respeto.",
      cases: [
        {
          q: "Tu pareja exige tus contraseñas. ¿Qué puede indicar?",
          o: [
            "Una obligación en toda relación",
            "Una señal de control",
            "Una prueba necesaria de cariño",
            "Una forma de respeto"
          ],
          a: 1,
          e:
            "El respeto incluye la privacidad. Exigir contraseñas puede ser una conducta de control."
        },
        {
          q: "Alguien insiste en que dejes de hablar con tus amistades. ¿Qué señal reconoces?",
          o: [
            "Confianza mutua",
            "Una decisión saludable",
            "Aislamiento",
            "Comunicación respetuosa"
          ],
          a: 2,
          e:
            "Alejar a alguien de sus amistades o familiares puede limitar su red de apoyo."
        },
        {
          q: "¿Qué caracteriza una relación saludable?",
          o: [
            "Respetar límites y decisiones",
            "Vigilar el teléfono",
            "Controlar los horarios",
            "Amenazar para obtener obediencia"
          ],
          a: 0,
          e:
            "Una relación saludable respeta la autonomía, los límites y las decisiones."
        }
      ]
    },

    digital: {
      title: "🔐 Escudo Digital",
      intro:
        "Practica decisiones seguras para proteger tus cuentas e información.",
      cases: [
        {
          q: "Un mensaje desconocido pide tu contraseña mediante un enlace. ¿Qué haces?",
          o: [
            "Escribir la contraseña",
            "Compartir el enlace",
            "Verificar desde el sitio o aplicación oficial",
            "Enviar un código de acceso"
          ],
          a: 2,
          e:
            "No ingreses credenciales desde enlaces sospechosos. Abre por tu cuenta el canal oficial."
        },
        {
          q: "¿Qué medida protege mejor una cuenta?",
          o: [
            "Activar la verificación en dos pasos",
            "Reutilizar la misma contraseña",
            "Compartir claves",
            "Publicar códigos de recuperación"
          ],
          a: 0,
          e:
            "La verificación en dos pasos añade una barrera de seguridad."
        },
        {
          q: "Una persona te presiona para compartir información privada. ¿Qué puedes hacer?",
          o: [
            "Aceptar para evitar un desacuerdo",
            "Compartir más datos",
            "Renunciar a tu privacidad",
            "Negarte y buscar orientación si la necesitas"
          ],
          a: 3,
          e:
            "Tienes derecho a la privacidad. Si la situación te preocupa, busca apoyo confiable."
        }
      ]
    },

    voice: {
      title: "🗣️ Mi voz pone límites",
      intro:
        "Reconoce límites personales y formas respetuosas de comunicarlos.",
      cases: [
        {
          q: "Alguien insiste en revisar tu teléfono. ¿Qué respuesta expresa un límite?",
          o: [
            "Puedes revisarlo siempre",
            "Prefiero mantener mi teléfono privado",
            "No tengo derecho a decidir",
            "Debo compartirlo para demostrar confianza"
          ],
          a: 1,
          e:
            "Un límite claro comunica lo que necesitas. Si expresarlo puede ponerte en riesgo, prioriza tu seguridad."
        },
        {
          q: "¿Qué significa establecer un límite personal?",
          o: [
            "Decidir por otras personas",
            "Evitar todas las conversaciones",
            "Expresar lo que aceptas y lo que no",
            "Controlar a tus amistades"
          ],
          a: 2,
          e:
            "Los límites ayudan a comunicar necesidades y proteger el bienestar personal."
        },
        {
          q: "Si decir no puede provocar una reacción peligrosa, ¿qué conviene priorizar?",
          o: [
            "Tu seguridad y el apoyo de personas confiables",
            "Una confrontación inmediata",
            "Responder con amenazas",
            "Quedarte sin pedir orientación"
          ],
          a: 0,
          e:
            "No siempre es seguro confrontar. Buscar apoyo y elegir un momento seguro puede ser más adecuado."
        }
      ]
    },

    network: {
      title: "🤝 Activa tu red",
      intro:
        "Identifica personas confiables y recursos de orientación.",
      cases: [
        {
          q: "¿Qué caracteriza a una persona de confianza?",
          o: [
            "Difunde tus asuntos personales",
            "Te obliga a actuar",
            "Te escucha y respeta tus decisiones",
            "Te impide buscar apoyo"
          ],
          a: 2,
          e:
            "Una persona confiable escucha sin juzgar y respeta tus decisiones."
        },
        {
          q: "Una amiga comparte contigo una situación difícil. ¿Qué ayuda más?",
          o: [
            "Culparla",
            "Escucharla sin juzgar y ofrecer apoyo",
            "Publicar su historia",
            "Decidir por ella"
          ],
          a: 1,
          e:
            "Escuchar, respetar su privacidad y ofrecer acompañamiento puede ayudar."
        },
        {
          q: "¿Qué recurso peruano ofrece orientación frente a violencia familiar y sexual?",
          o: [
            "Un perfil anónimo cualquiera",
            "Un enlace sin verificar",
            "Un grupo que exige contraseñas",
            "La Línea 100"
          ],
          a: 3,
          e:
            "La Línea 100 brinda orientación sobre violencia familiar y sexual en Perú."
        }
      ]
    }
  };

  // ==========================================
  // FUNCIONAMIENTO DE LOS MÓDULOS
  // ==========================================

  $$("[data-module]").forEach(button => {
    button.onclick = () => {
      const id = button.dataset.module;
      const module = mods[id];

      if (!module) return;

      let current = 0;
      let correct = 0;

      function renderCase() {
        const item = module.cases[current];

        modal(`
          <small>
            MÓDULO EDUCATIVO · CASO
            ${current + 1} DE ${module.cases.length}
          </small>

          <h2 id="modalTitle">${module.title}</h2>
          <p>${module.intro}</p>
          <p><b>${item.q}</b></p>

          <form id="moduleCaseForm">
            ${item.o.map((option, i) => `
              <label class="choice">
                <input
                  type="radio"
                  name="answer"
                  value="${i}"
                  required
                >
                ${esc(option)}
              </label>
            `).join("")}

            <button class="action">
              Comprobar respuesta
            </button>
          </form>

          <div id="moduleFeedback"></div>
        `);

        $("#moduleCaseForm").onsubmit = e => {
          e.preventDefault();

          const answer = Number(
            new FormData(e.target).get("answer")
          );

          const ok = answer === item.a;

          if (ok) correct++;

          $("#moduleCaseForm").remove();

          $("#moduleFeedback").innerHTML = `
            <div class="feedback ${ok ? "good" : "warn"}">
              <b>
                ${ok
                  ? "✓ ¡Respuesta correcta!"
                  : "Aprendamos de este caso"}
              </b>

              <p>
                <b>Respuesta esperada:</b>
                ${esc(item.o[item.a])}
              </p>

              <p>${esc(item.e)}</p>
            </div>

            <button class="action" id="nextModuleCase">
              ${current === module.cases.length - 1
                ? "Ver resultados del módulo"
                : "Siguiente caso →"}
            </button>
          `;

          $("#nextModuleCase").onclick = () => {
            current++;

            if (current < module.cases.length) {
              renderCase();
            } else {
              finishModule();
            }
          };
        };
      }

      function finishModule() {
        modal(`
          <small>MÓDULO FINALIZADO</small>

          <h2 id="modalTitle">
            💜 ¡Terminaste el módulo!
          </h2>

          <h3>${module.title}</h3>

          <div class="feedback good">
            <b>
              ${correct} de
              ${module.cases.length}
              respuestas correctas
            </b>

            <p>
              Revisaste las tres situaciones
              y sus explicaciones.
            </p>

            <p>
              Puedes repetir el módulo para
              reforzar lo aprendido.
            </p>
          </div>

          <button class="action" id="completeModule">
            Guardar módulo completado ✓
          </button>
        `);

        $("#completeModule").onclick = () => {
          state[id] = true;
          progress();
          close();

          if (completeCount() === 4) {
            toast(
              "¡Completaste los cuatro módulos! Ya puedes realizar la evaluación final. 💜"
            );
          } else {
            toast(
              "¡Módulo completado! Progreso guardado. 💜"
            );
          }
        };
      }

      renderCase();
    };
  });

  // ==========================================
  // HERRAMIENTAS
  // ==========================================

  $$("[data-tool]").forEach(button => {
    button.onclick = () => tool(button.dataset.tool);
  });

  function tool(t) {

    // PLAN PERSONAL

    if (t === "plan") {
      modal(`
        <small>SOLO EN ESTE DISPOSITIVO</small>

        <h2 id="modalTitle">💜 Mi Código Violeta</h2>

        <p>
          Escribe solo información que sea
          seguro conservar. No se envía
          a un servidor.
        </p>

        <form id="plan">
          ${[
            ["p1", "Persona de confianza 1"],
            ["p2", "Persona de confianza 2"],
            ["p3", "Persona de confianza 3"],
            ["word", "Palabra clave"],
            ["route", "Servicio o lugar seguro"]
          ].map(([name, label]) => `
            <div class="field">
              <label>${label}</label>
              <input name="${name}">
            </div>
          `).join("")}

          <div class="field">
            <label>
              Frase o límite que quiero recordar
            </label>
            <textarea name="limit"></textarea>
          </div>

          <button class="action">
            Imprimir / guardar como PDF
          </button>
        </form>

        <p>
          <small>
            Guarda el documento solo si
            hacerlo no compromete tu seguridad.
          </small>
        </p>
      `);

      $("#plan").onsubmit = e => {
        e.preventDefault();

        const d = Object.fromEntries(
          new FormData(e.target)
        );

        const w = window.open("", "_blank");

        if (!w) {
          toast("Permite ventanas emergentes para imprimir");
          return;
        }

        const fields = [
          ["Persona de confianza 1", d.p1],
          ["Persona de confianza 2", d.p2],
          ["Persona de confianza 3", d.p3],
          ["Palabra clave", d.word],
          ["Servicio o lugar seguro", d.route],
          ["Mi frase o límite", d.limit]
        ];

        w.document.write(`
          <meta charset="utf-8">
          <title>Mi Código Violeta</title>

          <style>
            body {
              font: 16px Arial;
              max-width: 750px;
              margin: 35px auto;
              color: #32134d;
            }

            h1 { color: #7130b0; }

            section {
              border: 1px solid #ddd;
              padding: 12px;
              margin: 10px 0;
              border-radius: 9px;
            }
          </style>

          <h1>💜 Mi Código Violeta</h1>
          <p>Plan personal de prevención y apoyo.</p>

          ${fields.map(([label, value]) => `
            <section>
              <b>${label}</b>
              <p>${esc(value || "No completado")}</p>
            </section>
          `).join("")}

          <p>
            Conserva este documento solo
            si es seguro.
          </p>
        `);

        w.document.close();
        w.focus();
        w.print();
      };

      return;
    }

    // ==========================================
    // EVALUACIÓN INICIAL Y FINAL
    // ==========================================

    if (t === "quiz") {
      const questions = [
        {
          q: "¿Cuál es una señal de control en una relación?",
          o: [
            "Respetar las decisiones",
            "Exigir contraseñas",
            "Escuchar opiniones",
            "Respetar amistades"
          ],
          a: 1,
          e:
            "Exigir contraseñas vulnera la privacidad y puede ser una señal de control."
        },
        {
          q: "¿Qué caracteriza una relación respetuosa?",
          o: [
            "Vigilancia constante",
            "Aislamiento",
            "Respeto de límites",
            "Control de horarios"
          ],
          a: 2,
          e:
            "Una relación saludable respeta los límites, la autonomía y las decisiones."
        },
        {
          q: "Una oferta laboral exige un pago antes de contratarte. ¿Qué conviene hacer?",
          o: [
            "Pagar de inmediato",
            "Enviar datos bancarios",
            "Verificar la empresa por canales independientes",
            "Aceptar por la urgencia"
          ],
          a: 2,
          e:
            "Pedir dinero por adelantado es una señal de alerta. Verifica la oferta."
        },
        {
          q: "¿Qué medida ayuda a proteger una cuenta digital?",
          o: [
            "Compartir la contraseña",
            "Usar la misma clave siempre",
            "Activar la verificación en dos pasos",
            "Publicar códigos de acceso"
          ],
          a: 2,
          e:
            "La verificación en dos pasos añade una barrera de seguridad."
        },
        {
          q: "¿Cuál es un ejemplo de límite personal?",
          o: [
            "Permitir que revisen tu teléfono",
            "Decir que no quieres compartir tu contraseña",
            "Aceptar todo para evitar desacuerdos",
            "Dejar de hablar con amistades"
          ],
          a: 1,
          e:
            "Expresar que deseas conservar tu privacidad es un límite válido."
        },
        {
          q: "Una amiga te cuenta que vive una situación de control. ¿Qué es más útil?",
          o: [
            "Culparla",
            "Compartir su historia sin permiso",
            "Escucharla sin juzgar y ofrecer apoyo",
            "Decidir por ella"
          ],
          a: 2,
          e:
            "Escuchar, respetar sus decisiones y ofrecer ayuda favorece una red de apoyo."
        },
        {
          q: "Alguien te pide alejarte de tus amistades para demostrar cariño. ¿Qué podría indicar?",
          o: [
            "Respeto",
            "Aislamiento y control",
            "Comunicación saludable",
            "Confianza mutua"
          ],
          a: 1,
          e:
            "Aislar a una persona de sus amistades puede ser una forma de control."
        },
        {
          q: "Recibes un enlace sospechoso que pide tu contraseña. ¿Qué haces?",
          o: [
            "Ingresar tus datos",
            "Reenviarlo",
            "Evitar abrirlo y verificar por el canal oficial",
            "Compartir tu código de acceso"
          ],
          a: 2,
          e:
            "Es más seguro verificar directamente en la aplicación o sitio oficial."
        },
        {
          q: "¿Cómo puede ayudarte una red de apoyo?",
          o: [
            "Tomando todas las decisiones por ti",
            "Escuchándote y orientándote con respeto",
            "Exigiendo tus claves",
            "Difundiendo tu información"
          ],
          a: 1,
          e:
            "Una red confiable escucha y respeta tu autonomía."
        },
        {
          q: "¿Cuál es el propósito educativo de Código Violeta?",
          o: [
            "Normalizar el control",
            "Promover prevención, autonomía y redes de apoyo",
            "Solicitar información privada",
            "Sustituir a los servicios profesionales"
          ],
          a: 1,
          e:
            "Código Violeta fortalece la prevención y el acceso a apoyo."
        }
      ];

      let initial = null;

      try {
        initial = JSON.parse(
          localStorage.getItem(quizKey) || "null"
        );
      } catch (e) {}

      const validInitial =
        initial &&
        Number.isInteger(initial.score) &&
        initial.total === questions.length;

      // BLOQUEO DE EVALUACIÓN FINAL

      if (validInitial && completeCount() < 4) {
        modal(`
          <small>RUTA DE APRENDIZAJE</small>

          <h2 id="modalTitle">
            🔒 Evaluación final pendiente
          </h2>

          <p>
            Tu evaluación inicial ya está registrada:
            <b>
              ${initial.score} de ${questions.length}
            </b>
          </p>

          <p>
            Has completado
            <b>${completeCount()} de 4 módulos</b>.
          </p>

          <p>
            Termina los cuatro módulos para
            desbloquear la evaluación final.
          </p>

          <button class="action" id="backToModules">
            Continuar mi ruta →
          </button>
        `);

        $("#backToModules").onclick = close;
        return;
      }

      const isFinal = Boolean(validInitial);
      const phase = isFinal ? "final" : "inicial";

      let current = 0;

      const answers = Array(
        questions.length
      ).fill(null);

      function renderQuestion() {
        const q = questions[current];

        modal(`
          <small>
            EVALUACIÓN ${phase.toUpperCase()}
            · PREGUNTA ${current + 1}
            DE ${questions.length}
          </small>

          <h2 id="modalTitle">
            🧠 Quiz de aprendizaje
          </h2>

          <p><b>${q.q}</b></p>

          <form id="cvQuizForm">
            ${q.o.map((option, i) => `
              <label class="choice">
                <input
                  type="radio"
                  name="answer"
                  value="${i}"
                  required
                >
                ${esc(option)}
              </label>
            `).join("")}

            <button class="action">
              ${current === questions.length - 1
                ? "Ver mis resultados"
                : "Siguiente pregunta →"}
            </button>
          </form>

          <p>
            <small>
              El resultado se guarda solo
              en este navegador.
            </small>
          </p>
        `);

        $("#cvQuizForm").onsubmit = e => {
          e.preventDefault();

          answers[current] = Number(
            new FormData(e.target).get("answer")
          );

          if (current < questions.length - 1) {
            current++;
            renderQuestion();
          } else {
            showResults();
          }
        };
      }

      function showResults() {
        const score = answers.reduce(
          (sum, answer, i) =>
            sum + (
              answer === questions[i].a ? 1 : 0
            ),
          0
        );

        const percent = Math.round(
          score / questions.length * 100
        );

        const result = {
          score,
          total: questions.length,
          date: new Date().toISOString()
        };

        try {
          localStorage.setItem(
            isFinal
              ? "cv-quiz-final-v1"
              : quizKey,
            JSON.stringify(result)
          );
        } catch (e) {}

        const comparison = isFinal
          ? `
            <div class="feedback good">
              <b>📊 Comparación de aprendizaje</b>

              <p>
                Evaluación inicial:
                ${initial.score}/${questions.length}
              </p>

              <p>
                Evaluación final:
                ${score}/${questions.length}
              </p>

              <p>
                <b>
                  Diferencia:
                  ${score - initial.score >= 0 ? "+" : ""}
                  ${score - initial.score}
                  respuestas correctas
                </b>
              </p>
            </div>
          `
          : `
            <div class="feedback good">
              <b>Evaluación inicial registrada</b>

              <p>
                Ahora completa los cuatro
                módulos educativos.
                Después podrás realizar
                la evaluación final.
              </p>
            </div>
          `;

        const feedback = questions.map(
          (q, i) => `
            <div class="feedback ${
              answers[i] === q.a
                ? "good"
                : "warn"
            }">
              <b>${i + 1}. ${q.q}</b>

              <p>
                ${answers[i] === q.a
                  ? "✓ Respuesta correcta"
                  : "Respuesta para revisar"}
              </p>

              <p>
                <b>Respuesta esperada:</b>
                ${esc(q.o[q.a])}
              </p>

              <p>${esc(q.e)}</p>
            </div>
          `
        ).join("");

        modal(`
          <small>
            RESULTADOS · EVALUACIÓN
            ${phase.toUpperCase()}
          </small>

          <h2 id="modalTitle">
            💜 ¡Tu aprendizaje cuenta!
          </h2>

          <p>
            Obtuviste
            <b>
              ${score} de ${questions.length}
            </b>
            respuestas correctas.
          </p>

          <p><b>Porcentaje: ${percent}%</b></p>

          ${comparison}

          <h3>Revisión de respuestas</h3>

          ${feedback}

          <button class="action" id="cvQuizFinish">
            Continuar mi ruta →
          </button>
        `);

        $("#cvQuizFinish").onclick = close;
      }

      renderQuestion();
      return;
    }

    // ==========================================
    // VERIFICADOR DE OFERTAS
    // ==========================================

    if (t === "offer") {
      modal(`
        <small>COMPRUEBA ANTES DE ACEPTAR</small>

        <h2 id="modalTitle">
          🔎 Verificador de ofertas
        </h2>

        <p>
          Marca las señales que detectas.
          El resultado es orientativo.
        </p>

        <form id="offer">
          ${[
            ["money", "Piden dinero por adelantado"],
            ["salary", "Sueldo extraordinario sin explicar tareas"],
            ["data", "Piden claves o datos bancarios pronto"],
            ["place", "Cita en lugar aislado o cambian dirección"],
            ["pressure", "Presionan para decidir ya"],
            ["verify", "Empresa con datos verificables"]
          ].map(([key, label]) => `
            <label class="choice">
              <input type="checkbox" name="${key}">
              ${label}
            </label>
          `).join("")}

          <button class="action">
            Analizar señales
          </button>
        </form>

        <div id="result"></div>
      `);

      $("#offer").onsubmit = e => {
        e.preventDefault();

        const d = new FormData(e.target);

        const n = [
          "money",
          "salary",
          "data",
          "place",
          "pressure"
        ].filter(key => d.has(key)).length;

        const level =
          n >= 3 ? "ALTO" :
          n > 0 ? "MEDIO" :
          d.has("verify")
            ? "MENOR RIESGO OBSERVADO"
            : "INDETERMINADO";

        $("#result").innerHTML = `
          <div class="feedback ${
            n > 1 ? "warn" : "good"
          }">
            <b>Nivel orientativo: ${level}</b>

            <p>
              ${n
                ? "Se detectaron " + n +
                  " señales. No pagues ni compartas claves; verifica por canales independientes."
                : "No marcaste señales típicas, pero verifica siempre la identidad y condiciones del empleador."}
            </p>
          </div>
        `;
      };

      return;
    }

    // ==========================================
    // SIMULADOR DE CHAT
    // ==========================================

    if (t === "chat") {
      modal(`
        <small>SIMULADOR DE CHAT FICTICIO</small>

        <h2 id="modalTitle">
          💬 ¿Notas la bandera roja?
        </h2>

        <p class="feedback">
          Alex: “Si confías en mí,
          dame tu contraseña y comparte
          tu ubicación todo el día.
          Si no, ocultas algo”.
        </p>

        <form id="chat">
          <label class="choice">
            <input
              type="radio"
              name="c"
              value="1"
              required
            >
            Control, presión y culpa
          </label>

          <label class="choice">
            <input
              type="radio"
              name="c"
              value="0"
            >
            Una muestra sana de confianza
          </label>

          <button class="action">
            Revisar respuesta
          </button>
        </form>

        <div id="result"></div>
      `);

      $("#chat").onsubmit = e => {
        e.preventDefault();

        const ok =
          new FormData(e.target).get("c") === "1";

        $("#result").innerHTML = `
          <div class="feedback ${
            ok ? "good" : "warn"
          }">
            <b>
              ${ok
                ? "¡Correcto!"
                : "Revisa esta situación."}
            </b>

            <p>
              Exigir contraseñas,
              rastrear tu ubicación
              y culparte por negarte
              puede ser control.
              Tienes derecho a la privacidad.
            </p>
          </div>
        `;
      };

      return;
    }

    // ==========================================
    // GUÍA DE EVIDENCIAS
    // ==========================================

    if (t === "evidence") {
      modal(`
        <h2 id="modalTitle">
          🔐 Guía para preservar evidencias
        </h2>

        <ol>
          <li>
            Guarda capturas con usuario,
            fecha y contexto, si es seguro.
          </li>

          <li>
            Conserva enlaces y fechas relevantes.
          </li>

          <li>
            No alteres los archivos originales.
          </li>

          <li>
            No publiques ni reenvíes
            contenido íntimo.
          </li>

          <li>
            Pide orientación profesional
            sobre cómo entregar evidencias.
          </li>
        </ol>

        <div class="feedback">
          Si alguien vigila tu teléfono,
          no guardes pruebas allí
          si aumenta el riesgo.
        </div>
      `);

      return;
    }

    // ==========================================
    // BIBLIOTECA DE FRASES
    // ==========================================

    if (t === "library") {
      const phrases = [
        "Mi privacidad no está en negociación.",
        "No necesito justificar cada límite.",
        "Puedo cambiar de opinión.",
        "Merezco relaciones basadas en respeto.",
        "Pedir apoyo es cuidarme.",
        "Mi historia me pertenece."
      ];

      modal(`
        <h2 id="modalTitle">
          📚 Frases para llevar contigo
        </h2>

        <div class="quotes">
          ${phrases.map(
            phrase => `
              <blockquote>
                ${esc(phrase)}
              </blockquote>
            `
          ).join("")}
        </div>

        <button class="action" id="printQuotes">
          Imprimir / guardar PDF
        </button>
      `);

      $("#printQuotes").onclick = () => {
        window.print();
      };

      return;
    }

    // ==========================================
    // RINCÓN DE ÁNIMO
    // ==========================================

    if (t === "stories") {
      modal(`
        <h2 id="modalTitle">
          🌷 Rincón de ánimo
        </h2>

        <p>
          Estos mensajes son ejemplos preparados,
          no testimonios reales.
        </p>

        <div class="feedback">
          <b>“Aprendí que puedo decir no.”</b>
          <p>
            Respetar mis límites
            también es cuidarme.
          </p>
        </div>

        <div class="feedback">
          <b>“No tengo que hacerlo sola.”</b>
          <p>
            Encontrar una persona segura
            puede ser el primer paso.
          </p>
        </div>

        <p>
          Esta versión no publica mensajes
          de visitantes ni recopila
          testimonios personales.
        </p>
      `);

      return;
    }

    // ==========================================
    // CONSTANCIA
    // ==========================================

    if (t === "certificate") {
      const n = completeCount();

      modal(`
        <h2 id="modalTitle">
          🏆 Mi avance violeta
        </h2>

        <p>
          Has marcado ${n} de 4 módulos
          como completados.
        </p>

        <p>
          ${n === 4
            ? "¡Puedes imprimir una constancia local de recorrido!"
            : "Completa los cuatro módulos para habilitar la constancia."}
        </p>

        <div class="field">
          <label>
            Nombre o seudónimo (opcional)
          </label>

          <input id="certName">
        </div>

        <button
          class="action"
          id="cert"
          ${n === 4 ? "" : "disabled"}
        >
          Preparar constancia
        </button>
      `);

      $("#cert").onclick = () => {
        const name = esc(
          $("#certName").value || "Participante"
        );

        const w = window.open("", "_blank");

        if (!w) {
          toast("Permite ventanas emergentes para imprimir");
          return;
        }

        w.document.write(`
          <meta charset="utf-8">

          <style>
            body {
              text-align: center;
              font: 18px Arial;
              padding: 70px;
              color: #351451;
            }

            main {
              border: 8px double #8c48bf;
              padding: 45px;
            }

            h1 { color: #702caf; }
          </style>

          <main>
            <h1>✿ CÓDIGO VIOLETA</h1>

            <h2>
              Constancia de recorrido educativo
            </h2>

            <h2>${name}</h2>

            <p>
              Completó los cuatro módulos
              del prototipo educativo.
            </p>

            <small>
              Constancia local.
              No es certificación oficial.
            </small>
          </main>
        `);

        w.document.close();
        w.focus();
        w.print();
      };

      return;
    }

    // ==========================================
    // RUTAS DE AYUDA
    // ==========================================

    if (t === "help") {
      modal(`
        <h2 id="modalTitle">
          🆘 Rutas de ayuda · Perú
        </h2>

        <p>
          Si hay peligro inmediato,
          busca un lugar seguro y
          contacta servicios oficiales.
          Verifica los canales vigentes.
        </p>

        <p>
          <a href="tel:100">
            📞 Línea 100 — orientación
            frente a violencia familiar y sexual
          </a>
        </p>

        <p>
          <a href="tel:105">
            🚨 Policía — 105
          </a>
        </p>

        <p>
          <a
            href="https://www.gob.pe/aurora"
            target="_blank"
            rel="noopener"
          >
            Programa Aurora:
            información oficial
          </a>
        </p>

        <p>
          <a
            href="https://www.gob.pe/"
            target="_blank"
            rel="noopener"
          >
            Portal del Estado peruano:
            busca CEM, DEMUNA y centros
            de salud mental comunitaria.
          </a>
        </p>

        <div class="feedback">
          Esta web no envía alertas
          automáticas ni comparte tu GPS.
          La salida rápida tampoco
          elimina el historial.
        </div>
      `);

      return;
    }
  }

  // INICIAR LA PÁGINA
  progress();

})();
