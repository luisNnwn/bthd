const textElement = document.getElementById("text");
const choicesElement = document.getElementById("choices");
const imageElement = document.getElementById("scene-image");
const fade = document.getElementById("fade");
const fadeText = document.getElementById("fade-text");
const continueBtn = document.getElementById("continue-btn");

let typingInterval;

/* ================= AUDIO ================= */

const audio = {
  ambient: new Audio("audio/vacio_ambient.wav"),
  heartbeat: new Audio("audio/latido_sutil.flac"),
  entry: new Audio("audio/entrada_atmosfera.wav"),
  final: new Audio("audio/luz_final.wav"),
  decision: new Audio("audio/decision.wav"),
  //esto no, distrae mucho y ya no tengo ganas de sincronizarlo type: new Audio("audio/type.wav")
};

audio.ambient.loop = true;
audio.heartbeat.loop = true;
audio.entry.loop = true;
audio.final.loop = true;

audio.ambient.volume = 0.4;
audio.heartbeat.volume = 0.9;
audio.entry.volume = 0.6;
audio.final.volume = 0.5;
audio.decision.volume = 0.7;
//NO audio.type.volume = 0.15;


function stopAllAudio() {
  Object.values(audio).forEach(a => {
    a.pause();
    a.currentTime = 0;
  });
}

/* ================= HISTORIA ================= */

const story = {
  inicio: {
    image: "imagenes/vacio.png",
    text: `En el recóndito lugar oscuro repleto de ilusiones,
aparece la chispa adecuada para florecer.

Flotás.
No recordás haber nacido.`,
    choices: [
      { text: "Pensar en el tiempo", next: "tiempo" },
      { text: "Observar la distancia", next: "distancia" }
    ]
  },

  tiempo: {
    image: "imagenes/reloj.png",
    text: `El tiempo no avanza.
Se multiplica.

Lo que era uno ahora es dos.
Y dos se cargan de información.`,
    choices: [
      { text: "Aferrarte a la soga", next: "soga" },
      { text: "Soltar todo", next: "soltar" }
    ]
  },

  distancia: {
    image: "imagenes/tierra_lejos.png",
    text: `La Tierra está lejos.
No la conocés.
Pero ella gira como si te esperara.`,
    choices: [
      { text: "Acercarte", next: "acercarse" },
      { text: "Seguir flotando", next: "tiempo" }
    ]
  },

  soga: {
    image: "imagenes/soga.png",
    text: `Una soga invisible te sostiene.
No sabés quién la ata.
Pero te alimenta.`,
    choices: [
      { text: "Aceptar la identidad", next: "identidad" }
    ]
  },

  soltar: {
    image: "imagenes/vacio.png",
    text: `Soltás.
El vacío no responde.
Pero el movimiento continúa.`,
    choices: [
      { text: "Dejarte llevar", next: "acercarse" }
    ]
  },

  identidad: {
    image: "imagenes/astronauta.png",
    text: `Te nombran sin verte.
Te aman sin que hayas amado.
Bailás al reconocer tu nombre.`,
    choices: [
      { text: "Mirar la Tierra", next: "acercarse" }
    ]
  },

  acercarse: {
    image: "imagenes/tierra_cerca.png",
    text: `La esfera se aproxima.
Un círculo te espera.
La atmósfera vibra.`,
    choices: [
      { text: "Entrar", next: "entrada" }
    ]
  },

  entrada: {
    image: "imagenes/atmosfera.png",
    text: `El calor te atraviesa.
El tiempo se quema.
Ya no flotás.`,
    choices: [
      { text: "Existir", next: "final" }
    ]
  },

  final: {
    image: "imagenes/blanco.png",
    text: "",
    choices: []
  }
};

/* ================= TEXTO ================= */

function typeText(text, callback) {
  clearInterval(typingInterval);
  textElement.textContent = "";
  let i = 0;

  typingInterval = setInterval(() => {
    if (i >= text.length) {
      clearInterval(typingInterval);
      if (callback) callback();
      return;
    }

    textElement.textContent += text[i];
    i++;
  }, 30);
}



/* ================= ESCENAS ================= */

function showScene(id) {
  audio.decision.currentTime = 0;
  audio.decision.play();

  const scene = story[id];
  choicesElement.innerHTML = "";
  imageElement.src = scene.image || "";

  if (audio.ambient.paused) audio.ambient.play();
  if (id === "identidad" && audio.heartbeat.paused) audio.heartbeat.play();
  if (id === "entrada") audio.entry.play();

  if (id === "final") {
    startFinalSequence();
    return;
  }

  typeText(scene.text, () => {
    scene.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.innerText = choice.text;
      btn.onclick = () => showScene(choice.next);
      choicesElement.appendChild(btn);
    });
  });
}

/* ================= FINAL ================= */

function startFinalSequence() {
  stopAllAudio();
  audio.final.play();

  fade.style.display = "flex";
  fade.style.opacity = 1;

  fadeText.innerText = "Feliz Cumple :)";
  fadeText.style.opacity = 1;

  imageElement.src = "imagenes/aproximacion.png";
  textElement.textContent = "";
  choicesElement.innerHTML = "";
  continueBtn.style.display = "none";

  setTimeout(() => {
    fadeText.style.opacity = 0;
  }, 12000);

  setTimeout(() => {
    fade.style.opacity = 0;
    setTimeout(() => {
      fade.style.display = "none";
    }, 3000);
  }, 3000);

  setTimeout(() => {
    document.body.classList.add("final");
    imageElement.style.display = "none";

    typeText(`V.
“Imagínese multiplicar lo que posee para llegar a su estado actual”.

En el recóndito lugar oscuro repleto de ilusiones, aparece la chispa adecuada para florecer, lo que eran dos son uno, y quien era uno ahora es dos.

Y va haciendo a su unidad una multiplicación creciente y se carga la información de su ser.

Crece flotando en el vacío como la Tierra, aunque ni la conozca, pero con una soga aferrada, se ase a ella, se alimenta.

Y le crean identidad, y lo imaginan sin verlo, lo aman sin que haya amado, lo cuidan de lo externo.

Baila a veces si reconoce su nombre, procurando no enredarse. Y de pronto llueve, le dan hogar, le soplan viento a la nariz, le es especial a un círculo, pero la esfera completa ni se mueve.

Y crecen sus células y nace para encontrar lo que usted significa. Y vive hoy en su presente.`, () => {
      continueBtn.style.display = "block";
    });
  }, 4000);
}

continueBtn.onclick = () => {
  window.location.href = "paginaRandom.html";
};

window.addEventListener("load", () => {
  const introOverlay = document.getElementById("intro-overlay");

  // seguridad: si no existe, no bloquea el juego
  if (!introOverlay) {
    showScene("inicio");
    return;
  }

  setTimeout(() => {
    introOverlay.style.transition = "opacity 1s";
    introOverlay.style.opacity = "0";

    setTimeout(() => {
      introOverlay.style.display = "none";
      showScene("inicio");
    }, 1000);

  }, 6000); // 6 segundos
});
