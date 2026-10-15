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

  // Executa cálculo inicial
  updateCalculator();
});
