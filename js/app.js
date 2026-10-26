
(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  let state = JSON.parse(
    localStorage.getItem('cv-progress') ||
    '{"signals":false,"digital":false,"voice":false,"network":false}'
  );

  function progress() {
    const n = Object.values(state).filter(Boolean).length;
    const p = Math.round(n / 4 * 100);
    $('#percent').textContent = p + '%';
    $('#bar').style.width = p + '%';
    $('#progressText').textContent = n + ' de 4 módulos completados';
    localStorage.setItem('cv-progress', JSON.stringify(state));
  }

  function toast(t) {
    $('#toast').textContent = t;
    $('#toast').classList.add('show');
    setTimeout(() => $('#toast').classList.remove('show'), 2500);
  }

  function close() {
    $('#backdrop').hidden = true;
    document.body.style.overflow = '';
  }

  function modal(h) {
    $('#modalBody').innerHTML = h;
    $('#backdrop').hidden = false;
    document.body.style.overflow = 'hidden';
  }

  $('#close').onclick = close;
  $('#backdrop').onclick = e => {
    if (e.target.id === 'backdrop') close();
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  $('#menubtn').onclick = () => $('#nav').classList.toggle('open');
  $$('#nav a').forEach(a => {
    a.onclick = () => $('#nav').classList.remove('open');
  });

  function exit() {
    window.open('https://www.google.com/', '_blank', 'noopener');
    toast('Se abrió otra pestaña. Esto no borra el historial del navegador.');
  }

  $('#exit').onclick = $('#exit2').onclick = exit;

  // MÓDULOS EDUCATIVOS

  const mods = {
    signals: [
      'Reconoce las señales',
      'Tu pareja exige tus contraseñas y te pide dejar de hablar con una amiga. ¿Qué puede indicar?',
      [
        ['a', 'Una prueba de amor'],
        ['b', 'Control y presión'],
        ['c', 'Algo que debes aceptar']
      ],
      1,
      'Pedir contraseñas y aislarte de amistades puede ser control. Tienes derecho a la privacidad. Si poner un límite te pone en riesgo, busca apoyo antes de confrontar.'
    ],
    digital: [
      'Escudo Digital',
      'Una cuenta amenaza con publicar una imagen privada si no envías más contenido. ¿Qué opción es más segura?',
      [
        ['a', 'Enviar más imágenes'],
        ['b', 'Guardar evidencia si es seguro y buscar ayuda'],
        ['c', 'Publicarlo todo inmediatamente']
      ],
      1,
      'No es tu culpa. Evita enviar más contenido o pagar. Guarda evidencia solo si es seguro y busca orientación.'
    ],
    voice: [
      'Mi voz pone límites',
      'Alguien insiste en revisar tu teléfono. ¿Qué frase expresa un límite?',
      [
        ['a', 'No quiero compartir mi teléfono; necesito que respetes mi privacidad.'],
        ['b', 'Perdón, puedes revisarlo'],
        ['c', 'No puedo tener límites con alguien que quiero']
      ],
      0,
      'Una frase clara y respetuosa expresa tu decisión. Si temes una reacción, prioriza tu seguridad y busca apoyo.'
    ],
    network: [
      'Activa tu red',
      '¿Qué característica tiene una persona de confianza?',
      [
        ['a', 'Te escucha y respeta tus decisiones'],
        ['b', 'Decide por ti'],
        ['c', 'Te impide pedir ayuda']
      ],
      0,
      'La confianza implica respeto, escucha y cuidado. Identifica más de una persona y servicios profesionales.'
    ]
  };

  $$('[data-module]').forEach(b => {
    b.onclick = () => {
      const m = mods[b.dataset.module];

      modal(`
        <small>CASO INTERACTIVO</small>
        <h2 id="modalTitle">${m[0]}</h2>
        <p>${m[1]}</p>
        <form id="caseForm">
          <p><b>Elige una respuesta:</b></p>
          ${m[2].map((c, i) => `
            <label class="choice">
              <input type="radio" name="a" value="${i}" required>
              ${c[1]}
            </label>
          `).join('')}
          <button class="action">Comprobar respuesta</button>
        </form>
        <div id="feedback"></div>
      `);

      $('#caseForm').onsubmit = e => {
        e.preventDefault();

        const ok = Number(new FormData(e.target).get('a')) === m[3];

        $('#feedback').innerHTML = `
          <div class="feedback ${ok ? 'good' : 'warn'}">
            <b>${ok ? '¡Muy bien!' : 'Vamos a repasarlo.'}</b>
            <p>${m[4]}</p>
          </div>
          <button class="action" id="done">
            Marcar módulo completado
          </button>
        `;

        $('#done').onclick = () => {
          state[b.dataset.module] = true;
          progress();
          close();
          toast('¡Avance guardado en este navegador! 💜');
        };
      };
    };
  });

  $$('[data-tool]').forEach(b => {
    b.onclick = () => tool(b.dataset.tool);
  });

  function tool(t) {

    // PLAN PERSONAL

    if (t === 'plan') {
      modal(`
        <small>SOLO EN ESTE DISPOSITIVO</small>
        <h2 id="modalTitle">💜 Mi Código Violeta</h2>
        <p>Escribe solo información que sea seguro conservar. No se envía a un servidor.</p>
        <form id="plan">
          <div class="field"><label>Persona de confianza 1</label><input name="p1"></div>
          <div class="field"><label>Persona de confianza 2</label><input name="p2"></div>
          <div class="field"><label>Persona de confianza 3</label><input name="p3"></div>
          <div class="field"><label>Palabra clave</label><input name="word"></div>
          <div class="field"><label>Servicio o lugar seguro</label><input name="route"></div>
          <div class="field"><label>Frase o límite que quiero recordar</label><textarea name="limit"></textarea></div>
          <button class="action">Imprimir / guardar como PDF</button>
        </form>
        <p><small>Guarda el documento solo si hacerlo no compromete tu seguridad.</small></p>
      `);

      $('#plan').onsubmit = e => {
        e.preventDefault();

        const d = Object.fromEntries(new FormData(e.target));
        const w = window.open('', '_blank');

        if (!w) {
          toast('Permite ventanas emergentes para imprimir');
          return;
        }

        w.document.write(
          '<meta charset="utf-8"><title>Mi Código Violeta</title>' +
          '<style>body{font:16px Arial;max-width:750px;margin:35px auto;color:#32134d}' +
          'h1{color:#7130b0}section{border:1px solid #ddd;padding:12px;margin:10px 0;border-radius:9px}</style>' +
          '<h1>💜 Mi Código Violeta</h1><p>Plan personal de prevención y apoyo.</p>' +
          [
            ['Persona de confianza 1', d.p1],
            ['Persona de confianza 2', d.p2],
            ['Persona de confianza 3', d.p3],
            ['Palabra clave', d.word],
            ['Servicio o lugar seguro', d.route],
            ['Mi frase o límite', d.limit]
          ].map(x =>
            '<section><b>' + x[0] + '</b><p>' +
            esc(x[1] || 'No completado') + '</p></section>'
          ).join('') +
          '<p>Conserva este documento solo si es seguro.</p>' +
          '<script>onload=()=>print()<\/script>'
        );

        w.document.close();
      };
      return;
    }

    // CUESTIONARIO INICIAL Y FINAL MEJORADO

    if (t === 'quiz') {
      const questions = [
        {
          q: '¿Cuál es una señal de control en una relación?',
          o: ['Respetar las decisiones', 'Exigir contraseñas', 'Escuchar opiniones', 'Respetar amistades'],
          a: 1,
          e: 'Exigir contraseñas vulnera la privacidad y puede ser una señal de control.'
        },
        {
          q: '¿Qué caracteriza una relación respetuosa?',
          o: ['Vigilancia constante', 'Aislamiento', 'Respeto de límites', 'Control de horarios'],
          a: 2,
          e: 'Una relación saludable respeta los límites, la autonomía y las decisiones.'
        },
        {
          q: 'Una oferta laboral exige un pago antes de contratarte. ¿Qué conviene hacer?',
          o: ['Pagar de inmediato', 'Enviar datos bancarios', 'Verificar la empresa por canales independientes', 'Aceptar por la urgencia'],
          a: 2,
          e: 'Pedir dinero por adelantado es una señal de alerta. Verifica la oferta de forma independiente.'
        },
        {
          q: '¿Qué medida ayuda a proteger una cuenta digital?',
          o: ['Compartir la contraseña', 'Usar la misma clave siempre', 'Activar la verificación en dos pasos', 'Publicar códigos de acceso'],
          a: 2,
          e: 'La verificación en dos pasos añade una barrera de seguridad a tus cuentas.'
        },
        {
          q: '¿Cuál es un ejemplo de límite personal?',
          o: ['Permitir que revisen tu teléfono', 'Decir que no quieres compartir tu contraseña', 'Aceptar todo para evitar desacuerdos', 'Dejar de hablar con amistades'],
          a: 1,
          e: 'Expresar que deseas conservar tu privacidad es un límite válido.'
        },
        {
          q: 'Una amiga te cuenta que vive una situación de control. ¿Qué es más útil?',
          o: ['Culparla', 'Compartir su historia sin permiso', 'Escucharla sin juzgar y ofrecer apoyo', 'Decidir por ella'],
          a: 2,
          e: 'Escuchar, respetar sus decisiones y ofrecer ayuda favorece una red de apoyo segura.'
        },
        {
          q: 'Alguien te pide alejarte de tus amistades para demostrar cariño. ¿Qué podría indicar?',
          o: ['Respeto', 'Aislamiento y control', 'Comunicación saludable', 'Confianza mutua'],
          a: 1,
          e: 'Aislar a una persona de sus amistades puede ser una forma de control.'
        },
        {
          q: 'Recibes un enlace sospechoso que pide tu contraseña. ¿Qué haces?',
          o: ['Ingresar tus datos', 'Reenviarlo', 'Evitar abrirlo y verificar por el canal oficial', 'Compartir tu código de acceso'],
          a: 2,
          e: 'Es más seguro verificar directamente en la aplicación o sitio oficial.'
        },
        {
          q: '¿Cómo puede ayudarte una red de apoyo?',
          o: ['Tomando todas las decisiones por ti', 'Escuchándote y orientándote con respeto', 'Exigiendo tus claves', 'Difundiendo tu información'],
          a: 1,
          e: 'Una red de apoyo confiable escucha, respeta tu autonomía y ayuda a buscar orientación.'
        },
        {
          q: '¿Cuál es el propósito educativo de Código Violeta?',
          o: ['Normalizar el control', 'Promover prevención, autonomía y redes de apoyo', 'Solicitar información privada', 'Sustituir a los servicios profesionales'],
          a: 1,
          e: 'Código Violeta busca fortalecer la prevención, el reconocimiento de señales de alerta y el acceso a apoyo.'
        }
      ];

      const key = 'cv-quiz-initial-v1';
      let initial = null;

      try {
        initial = JSON.parse(localStorage.getItem(key) || 'null');
      } catch (e) {
        initial = null;
      }

      const isFinal = initial !== null;
      const phase = isFinal ? 'final' : 'inicial';

      let current = 0;
      const answers = Array(questions.length).fill(null);

      function renderQuestion() {
        const q = questions[current];

        modal(`
          <small>EVALUACIÓN ${phase.toUpperCase()} · PREGUNTA ${current + 1} DE ${questions.length}</small>
          <h2 id="modalTitle">🧠 Quiz de aprendizaje</h2>
          <p><b>${q.q}</b></p>
          <form id="cvQuizForm">
            ${q.o.map((option, i) => `
              <label class="choice">
                <input
                  type="radio"
                  name="answer"
                  value="${i}"
                  ${answers[current] === i ? 'checked' : ''}
                  required
                >
                ${option}
              </label>
            `).join('')}
            <button class="action">
              ${current === questions.length - 1 ? 'Ver mis resultados' : 'Siguiente pregunta →'}
            </button>
          </form>
          <p><small>El resultado se guarda solo en este navegador.</small></p>
        `);

        $('#cvQuizForm').onsubmit = e => {
          e.preventDefault();

          answers[current] = Number(
            new FormData(e.target).get('answer')
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
            sum + (answer === questions[i].a ? 1 : 0),
          0
        );

        const percent = Math.round(
          score / questions.length * 100
        );

        if (!isFinal) {
          try {
            localStorage.setItem(key, JSON.stringify({
              score,
              total: questions.length,
              date: new Date().toISOString()
            }));
          } catch (e) {}
        }

        const comparison = isFinal
          ? `
            <div class="feedback good">
              <b>📊 Comparación de aprendizaje</b>
              <p>Evaluación inicial: ${initial.score}/${questions.length}</p>
              <p>Evaluación final: ${score}/${questions.length}</p>
              <p><b>Diferencia: ${score - initial.score >= 0 ? '+' : ''}${score - initial.score} respuestas correctas</b></p>
            </div>
          `
          : `
            <div class="feedback good">
              <b>Evaluación inicial registrada</b>
              <p>Ahora recorre los módulos educativos. Cuando vuelvas a abrir el quiz, podrás realizar la evaluación final.</p>
            </div>
          `;

        const feedback = questions.map((q, i) => `
          <div class="feedback ${answers[i] === q.a ? 'good' : 'warn'}">
            <b>${i + 1}. ${q.q}</b>
            <p>${answers[i] === q.a ? '✓ Respuesta correcta' : 'Respuesta para revisar'}</p>
            <p><b>Respuesta esperada:</b> ${q.o[q.a]}</p>
            <p>${q.e}</p>
          </div>
        `).join('');

        modal(`
          <small>RESULTADOS · EVALUACIÓN ${phase.toUpperCase()}</small>
          <h2 id="modalTitle">💜 ¡Tu aprendizaje cuenta!</h2>
          <p>Obtuviste <b>${score} de ${questions.length}</b> respuestas correctas.</p>
          <p><b>Porcentaje: ${percent}%</b></p>
          ${comparison}
          <h3>Revisión de respuestas</h3>
          ${feedback}
          <button class="action" id="cvQuizFinish">
            Continuar mi ruta →
          </button>
        `);

        $('#cvQuizFinish').onclick = close;
      }

      renderQuestion();
      return;
    }

    // VERIFICADOR DE OFERTAS

    if (t === 'offer') {
      modal(`
        <small>COMPRUEBA ANTES DE ACEPTAR</small>
        <h2 id="modalTitle">🔎 Verificador de ofertas</h2>
        <p>Marca las señales que detectas; el resultado es orientativo.</p>
        <form id="offer">
          ${[
            ['money', 'Piden dinero por adelantado'],
            ['salary', 'Sueldo extraordinario sin explicar tareas'],
            ['data', 'Piden claves o datos bancarios pronto'],
            ['place', 'Cita en lugar aislado o cambian dirección'],
            ['pressure', 'Presionan para decidir ya'],
            ['verify', 'Empresa con datos verificables']
          ].map(c => `
            <label class="choice">
              <input type="checkbox" name="${c[0]}">
              ${c[1]}
            </label>
          `).join('')}
          <button class="action">Analizar señales</button>
        </form>
        <div id="result"></div>
      `);

      $('#offer').onsubmit = e => {
        e.preventDefault();
        const d = new FormData(e.target);
        const n = ['money', 'salary', 'data', 'place', 'pressure']
          .filter(k => d.has(k)).length;

        $('#result').innerHTML = `
          <div class="feedback ${n > 1 ? 'warn' : 'good'}">
            <b>Nivel orientativo: ${
              n >= 3 ? 'ALTO' :
              n ? 'MEDIO' :
              d.has('verify') ? 'MENOR RIESGO OBSERVADO' : 'INDETERMINADO'
            }</b>
            <p>${
              n
                ? 'Se detectaron ' + n + ' señales. No pagues ni compartas claves; verifica por canales independientes.'
                : 'No marcaste señales típicas, pero verifica siempre la identidad y condiciones del empleador.'
            }</p>
          </div>
        `;
      };
      return;
    }

    // SIMULADOR DE CHAT

    if (t === 'chat') {
      modal(`
        <small>SIMULADOR DE CHAT FICTICIO</small>
        <h2 id="modalTitle">💬 ¿Notas la bandera roja?</h2>
        <p class="feedback">
          Alex: “Si confías en mí, dame tu contraseña y comparte tu ubicación todo el día. Si no, ocultas algo”.
        </p>
        <form id="chat">
          <label class="choice">
            <input type="radio" name="c" value="1" required>
            Control, presión y culpa
          </label>
          <label class="choice">
            <input type="radio" name="c" value="0">
            Una muestra sana de confianza
          </label>
          <button class="action">Revisar respuesta</button>
        </form>
        <div id="result"></div>
      `);

      $('#chat').onsubmit = e => {
        e.preventDefault();
        $('#result').innerHTML = `
          <div class="feedback good">
            Exigir contraseñas o rastrear tu ubicación y culparte por negarte puede ser control. Tienes derecho a la privacidad.
          </div>
        `;
      };
      return;
    }

    // GUÍA DE EVIDENCIAS

    if (t === 'evidence') {
      modal(`
        <h2 id="modalTitle">🔐 Guía para preservar evidencias</h2>
        <ol>
          <li>Guarda capturas con usuario, fecha y contexto, si es seguro.</li>
          <li>Conserva enlaces y fechas relevantes.</li>
          <li>No alteres los archivos originales.</li>
          <li>No publiques ni reenvíes contenido íntimo.</li>
          <li>Pide orientación profesional sobre cómo entregar evidencias.</li>
        </ol>
        <div class="feedback">
          Si alguien vigila tu teléfono, no guardes pruebas allí si aumenta el riesgo.
        </div>
      `);
      return;
    }

    // FRASES DE APOYO

    if (t === 'library') {
      modal(`
        <h2 id="modalTitle">📚 Frases para llevar contigo</h2>
        <div class="quotes">
          ${[
            'Mi privacidad no está en negociación.',
            'No necesito justificar cada límite.',
            'Puedo cambiar de opinión.',
            'Merezco relaciones basadas en respeto.',
            'Pedir apoyo es cuidarme.',
            'Mi historia me pertenece.'
          ].map(x => '<blockquote>' + x + '</blockquote>').join('')}
        </div>
        <button class="action" onclick="window.print()">
          Imprimir / guardar PDF
        </button>
      `);
      return;
    }

    // RINCÓN DE ÁNIMO

    if (t === 'stories') {
      modal(`
        <h2 id="modalTitle">🌷 Rincón de ánimo</h2>
        <p>Estos mensajes son ejemplos preparados, no testimonios reales.</p>
        <div class="feedback">
          <b>“Aprendí que puedo decir no.”</b>
          <p>Respetar mis límites también es cuidarme.</p>
        </div>
        <div class="feedback">
          <b>“No tengo que hacerlo sola.”</b>
          <p>Encontrar una persona segura puede ser el primer paso.</p>
        </div>
        <p>Esta versión no publica mensajes de visitantes ni recopila testimonios personales.</p>
      `);
      return;
    }

    // CONSTANCIA DE RECORRIDO

    if (t === 'certificate') {
      const n = Object.values(state).filter(Boolean).length;

      modal(`
        <h2 id="modalTitle">🏆 Mi avance violeta</h2>
        <p>Has marcado ${n} de 4 módulos como completados.</p>
        <p>${
          n === 4
            ? '¡Puedes imprimir una constancia local de recorrido!'
            : 'Completa los cuatro módulos para habilitar la constancia.'
        }</p>
        <div class="field">
          <label>Nombre o seudónimo (opcional)</label>
          <input id="certName">
        </div>
        <button class="action" id="cert" ${n === 4 ? '' : 'disabled'}>
          Preparar constancia
        </button>
      `);

      $('#cert').onclick = () => {
        const w = window.open('', '_blank');

        if (w) {
          w.document.write(
            '<meta charset="utf-8">' +
            '<style>body{text-align:center;font:18px Arial;padding:70px;color:#351451}' +
            'main{border:8px double #8c48bf;padding:45px}h1{color:#702caf}</style>' +
            '<main><h1>✿ CÓDIGO VIOLETA</h1>' +
            '<h2>Constancia de recorrido educativo</h2>' +
            '<h2>' + esc($('#certName').value || 'Participante') + '</h2>' +
            '<p>Completó los cuatro módulos del prototipo educativo.</p>' +
            '<small>Constancia local, no es certificación oficial.</small></main>' +
            '<script>onload=()=>print()<\/script>'
          );
          w.document.close();
        }
      };
      return;
    }

    // RUTAS DE AYUDA

    if (t === 'help') {
      modal(`
        <h2 id="modalTitle">🆘 Rutas de ayuda · Perú</h2>
        <p>Si hay peligro inmediato, busca un lugar seguro y contacta servicios oficiales. Verifica los canales vigentes.</p>
        <p><a href="tel:100">📞 Línea 100 — orientación frente a violencia familiar y sexual</a></p>
        <p><a href="tel:105">🚨 Policía — 105</a></p>
        <p><a href="https://www.gob.pe/aurora" target="_blank" rel="noopener">Programa Aurora: información oficial</a></p>
        <p><a href="https://www.gob.pe/" target="_blank" rel="noopener">Portal del Estado peruano: busca CEM, DEMUNA y centros de salud mental comunitaria.</a></p>
        <div class="feedback">
          Esta web no envía alertas automáticas ni comparte tu GPS. La salida rápida tampoco elimina el historial.
        </div>
      `);
      return;
    }
  }

  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));
  }

  progress();
})();

