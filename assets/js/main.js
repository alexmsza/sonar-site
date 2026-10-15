// SONAR Acessibilidade Audiovisual - Lógica Interativa do Site Oficial
document.addEventListener("DOMContentLoaded", () => {
  // Preços unitários por minuto (R$/minuto)
  const RATES = {
    lse: 35.0,     // LSE com Foley & Sonoplastia
    ad: 55.0,      // Audiodescrição Roteirizada & Gravada
    libras: 45.0   // Janela de Libras com Intérprete Certificado
  };

  const MIN_ORDER_PRICE = 300.0;

  // Elementos da Calculadora
  const rangeMinutes = document.getElementById("rangeMinutes");
  const displayMinutes = document.getElementById("displayMinutes");
  const checkLse = document.getElementById("checkLse");
  const checkAd = document.getElementById("checkAd");
  const checkLibras = document.getElementById("checkLibras");
  const checkVisit = document.getElementById("checkVisit");
  const displayTotal = document.getElementById("displayTotal");
  const btnWhatsappBudget = document.getElementById("btnWhatsappBudget");

  // Chips visuais da calculadora
  const chipLse = document.getElementById("chipLse");
  const chipAd = document.getElementById("chipAd");
  const chipLibras = document.getElementById("chipLibras");
  const chipVisit = document.getElementById("chipVisit");

  function updateCalculator() {
    const minutes = parseInt(rangeMinutes.value, 10);
    displayMinutes.innerText = `${minutes} min`;

    let ratePerMinute = 0;
    let flatAdditions = 0;
    const selectedServices = [];

    if (checkLse.checked) {
      ratePerMinute += RATES.lse;
      selectedServices.push("LSE com Foley & Sonoplastia");
      chipLse.classList.add("selected");
    } else {
      chipLse.classList.remove("selected");
    }

    if (checkAd.checked) {
      ratePerMinute += RATES.ad;
      selectedServices.push("Audiodescrição (AD)");
      chipAd.classList.add("selected");
    } else {
      chipAd.classList.remove("selected");
    }

    if (checkLibras.checked) {
      ratePerMinute += RATES.libras;
      selectedServices.push("Janela de Libras");
      chipLibras.classList.add("selected");
    } else {
      chipLibras.classList.remove("selected");
    }

    if (checkVisit && checkVisit.checked) {
      flatAdditions += 800.0;
      selectedServices.push("Visita Guiada & Mediação Cultural");
      chipVisit.classList.add("selected");
    } else if (chipVisit) {
      chipVisit.classList.remove("selected");
    }

    let total = (minutes * ratePerMinute) + flatAdditions;
    if (total > 0 && total < MIN_ORDER_PRICE) {
      total = MIN_ORDER_PRICE;
    }

    // Formata valor em Real
    const formattedTotal = total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

    displayTotal.innerText = formattedTotal;

    // Atualiza link direto de contratação no WhatsApp
    const servicesText = selectedServices.length > 0 ? selectedServices.join(" + ") : "Acessibilidade Audiovisual";
    const waText = encodeURIComponent(
      `Olá, equipe da Sonar! Estive no site e simulei o serviço de ${servicesText} para uma obra de ${minutes} minutos (estimativa: ${formattedTotal}). Gostaria de receber a proposta formal para o meu projeto.`
    );

    // Número oficial da Sonar (+55 81 9592-5442)
    const whatsappUrl = `https://wa.me/558195925442?text=${waText}`;
    btnWhatsappBudget.href = whatsappUrl;

    // Atualiza botão flutuante também
    const floatBtn = document.getElementById("whatsappFloatBtn");
    if (floatBtn) {
      floatBtn.href = whatsappUrl;
    }
  }

  // Event Listeners da Calculadora
  rangeMinutes.addEventListener("input", updateCalculator);
  checkLse.addEventListener("change", updateCalculator);
  checkAd.addEventListener("change", updateCalculator);
  checkLibras.addEventListener("change", updateCalculator);
  if (checkVisit) checkVisit.addEventListener("change", updateCalculator);

  chipLse.addEventListener("click", (e) => {
    if (e.target.tagName !== "INPUT") {
      checkLse.checked = !checkLse.checked;
      updateCalculator();
    }
  });

  chipAd.addEventListener("click", (e) => {
    if (e.target.tagName !== "INPUT") {
      checkAd.checked = !checkAd.checked;
      updateCalculator();
    }
  });

  chipLibras.addEventListener("click", (e) => {
    if (e.target.tagName !== "INPUT") {
      checkLibras.checked = !checkLibras.checked;
      updateCalculator();
    }
  });

  if (chipVisit) {
    chipVisit.addEventListener("click", (e) => {
      if (e.target.tagName !== "INPUT") {
        checkVisit.checked = !checkVisit.checked;
        updateCalculator();
      }
    });
  }

  // 2. Demonstrador Interativo (Cenas de Exemplo LSE com Foley)
  const SCENES = [
    {
      title: "Animação Autoral (Curta-Metragem sem Diálogos)",
      standardSubtitle: "— (Sem falas detectadas pela ferramenta comum) —",
      sonarSubtitle: "[Porta de madeira rangendo vagarosamente] [Passos pesados no assoalho]"
    },
    {
      title: "Cena de Suspense / Clímax",
      standardSubtitle: "— ... —",
      sonarSubtitle: "[Trilha de cordas tensas em crescendo] [Respiração ofegante ao fundo]"
    },
    {
      title: "Ambiente Natural & Transição Poética",
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

  // 3. Sintetizador Web Audio API para Demonstração de Foley (Zero dependências externas)
  function playSynthesizedFoley(type = "creak") {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === "creak") {
        // Simulação de porta de madeira rangendo / assoalho
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
        // Simulação de batida / impacto acústico
        osc.type = "triangle";
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      console.warn("Web Audio API não habilitada no navegador", e);
    }
  }

  const btnPlayFoleyCue = document.getElementById("btnPlayFoleyCue");
  if (btnPlayFoleyCue) {
    btnPlayFoleyCue.addEventListener("click", () => {
      playSynthesizedFoley(currentSceneIdx % 2 === 0 ? "creak" : "thud");
    });
  }

  // Inicializa ícones Lucide (Context7)
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  // Executa cálculo inicial
  updateCalculator();
});
