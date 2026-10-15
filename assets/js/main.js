// SONAR Acessibilidade Audiovisual - Lógica Interativa do Site Oficial
document.addEventListener("DOMContentLoaded", () => {
  // Preços unitários por minuto (R$/minuto)
  const RATES = {
    lse: 35.0,     // LSE com Foley & Sonoplastia (ABNT NBR 15290)
    ad: 55.0,      // Audiodescrição Roteirizada & Gravada (ABNT NBR 16452)
    libras: 60.0   // Janela de Libras com Intérprete Certificado
  };

  const MIN_ORDER_PRICE = 300.0;
  let currentUrgencyMultiplier = 1.0;

  // Elementos da Calculadora
  const slider = document.getElementById("sliderDuration") || document.getElementById("rangeMinutes");
  const displayMinutes = document.getElementById("displayMinutes");
  const checkLse = document.getElementById("checkLse");
  const checkAd = document.getElementById("checkAd");
  const checkLibras = document.getElementById("checkLibras");
  const displayTotal = document.getElementById("displayTotal");
  const btnWhatsappBudget = document.getElementById("btnWhatsappBudget");

  function updateCalculator() {
    if (!slider) return;
    const minutes = parseInt(slider.value, 10);
    displayMinutes.innerText = `${minutes} minuto${minutes > 1 ? "s" : ""}`;

    let ratePerMinute = 0;
    const selectedServices = [];

    if (checkLse && checkLse.checked) {
      ratePerMinute += RATES.lse;
      selectedServices.push("LSE com Foley");
      if (checkLse.closest(".calc-check-card")) {
        checkLse.closest(".calc-check-card").classList.add("active");
      }
    } else if (checkLse && checkLse.closest(".calc-check-card")) {
      checkLse.closest(".calc-check-card").classList.remove("active");
    }

    if (checkAd && checkAd.checked) {
      ratePerMinute += RATES.ad;
      selectedServices.push("Audiodescrição (AD)");
      if (checkAd.closest(".calc-check-card")) {
        checkAd.closest(".calc-check-card").classList.add("active");
      }
    } else if (checkAd && checkAd.closest(".calc-check-card")) {
      checkAd.closest(".calc-check-card").classList.remove("active");
    }

    if (checkLibras && checkLibras.checked) {
      ratePerMinute += RATES.libras;
      selectedServices.push("Janela de Libras");
      if (checkLibras.closest(".calc-check-card")) {
        checkLibras.closest(".calc-check-card").classList.add("active");
      }
    } else if (checkLibras && checkLibras.closest(".calc-check-card")) {
      checkLibras.closest(".calc-check-card").classList.remove("active");
    }

    let subtotal = minutes * ratePerMinute;
    let total = subtotal * currentUrgencyMultiplier;

    if (total > 0 && total < MIN_ORDER_PRICE) {
      total = MIN_ORDER_PRICE;
    }

    const formattedTotal = total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

    if (displayTotal) {
      displayTotal.innerText = formattedTotal;
    }

    const servicesText = selectedServices.length > 0 ? selectedServices.join(" + ") : "Acessibilidade Audiovisual";
    const waText = encodeURIComponent(
      `Olá, Ruan! Vim pelo site da Sonar e simulei o serviço de ${servicesText} para uma obra de ${minutes} minutos (estimativa: ${formattedTotal}). Gostaria de formalizar uma proposta para o meu projeto.`
    );

    const whatsappUrl = `https://wa.me/558195925442?text=${waText}`;
    if (btnWhatsappBudget) {
      btnWhatsappBudget.href = whatsappUrl;
    }

    const floatBtn = document.getElementById("whatsappFloatBtn");
    if (floatBtn) {
      floatBtn.href = whatsappUrl;
    }
  }

  if (slider) {
    slider.addEventListener("input", updateCalculator);
  }
  if (checkLse) checkLse.addEventListener("change", updateCalculator);
  if (checkAd) checkAd.addEventListener("change", updateCalculator);
  if (checkLibras) checkLibras.addEventListener("change", updateCalculator);

  // Pills de Minutagem Rápida
  document.querySelectorAll(".calc-pill[data-min]").forEach((pill) => {
    pill.addEventListener("click", (e) => {
      document.querySelectorAll(".calc-pill[data-min]").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      if (slider) {
        slider.value = pill.dataset.min;
        updateCalculator();
      }
    });
  });

  // Pills de Urgência
  document.querySelectorAll(".calc-pill[data-urgency]").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".calc-pill[data-urgency]").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentUrgencyMultiplier = parseFloat(pill.dataset.urgency) || 1.0;
      updateCalculator();
    });
  });

  // 2. Demonstrador Interativo (Cenas de Exemplo LSE com Foley)
  const SCENES = [
    {
      title: "Cena 1: Curta-Metragem de Animação sem Diálogos (Padrão Animage)",
      standardSubtitle: "— (Sem falas detectadas pela ferramenta comum) —",
      sonarSubtitle: "[Porta de madeira rangendo vagarosamente] [Passos pesados no assoalho]"
    },
    {
      title: "Cena 2: Suspense e Tensão Sonora",
      standardSubtitle: "— ... —",
      sonarSubtitle: "[Trilha de cordas tensas em crescendo] [Respiração ofegante ao fundo]"
    },
    {
      title: "Cena 3: Transição Poética & Ambiência Natural",
      standardSubtitle: "— (Legenda vazia) —",
      sonarSubtitle: "[Vento forte soprando pelas frestas] [Sino distante badalando 3 vezes]"
    }
  ];

  let currentSceneIdx = 0;
  const demoSceneTitle = document.getElementById("demoSceneTitle");
  const demoStandardSub = document.getElementById("demoStandardSub");
  const demoSonarSub = document.getElementById("demoSonarSub");
  const btnNextScene = document.getElementById("btnNextScene");

  if (btnNextScene) {
    btnNextScene.addEventListener("click", () => {
      currentSceneIdx = (currentSceneIdx + 1) % SCENES.length;
      const scene = SCENES[currentSceneIdx];
      demoSceneTitle.innerText = scene.title;
      demoStandardSub.innerText = scene.standardSubtitle;
      demoSonarSub.innerText = scene.sonarSubtitle;
    });
  }

  // 3. Sintetizador Web Audio API para Demonstração de Foley
  function playSynthesizedFoley(type = "creak") {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === "creak") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.45);

        gainNode.gain.setValueAtTime(0.01, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.start(now);
        osc.stop(now + 0.45);
      } else {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      console.warn("Web Audio API não habilitada", e);
    }
  }

  const btnPlayFoleyCue = document.getElementById("btnPlayFoleyCue");
  if (btnPlayFoleyCue) {
    btnPlayFoleyCue.addEventListener("click", () => {
      playSynthesizedFoley(currentSceneIdx % 2 === 0 ? "creak" : "thud");
    });
  }

  // Inicializa ícones Lucide
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  // Executa cálculo inicial
  updateCalculator();
});
