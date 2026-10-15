// SONAR Acessibilidade Audiovisual - Lógica Interativa do Site Oficial
// Arquitetura: Acessibilidade Digital (WCAG 2.1 / ABNT NBR 15290), Calculadora de Valores, 
// Sintetizador Acústico de Foley (Web Audio API) e Motor de Audiodescrição Cênica (Web Speech API).

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. RECURSOS DE ACESSIBILIDADE DIGITAL
  // ==========================================
  let currentFontScale = parseFloat(localStorage.getItem("sonar_font_scale")) || 1.0;
  const isHighContrast = localStorage.getItem("sonar_high_contrast") === "true";

  function applyFontScale(scale) {
    currentFontScale = Math.max(0.85, Math.min(1.30, scale));
    document.documentElement.style.fontSize = `${currentFontScale * 100}%`;
    localStorage.setItem("sonar_font_scale", currentFontScale.toFixed(2));
  }

  // Restaura estado inicial de acessibilidade
  if (currentFontScale !== 1.0) {
    applyFontScale(currentFontScale);
  }
  if (isHighContrast) {
    document.body.classList.add("high-contrast");
  }

  const btnIncreaseFont = document.getElementById("btnIncreaseFont");
  const btnDecreaseFont = document.getElementById("btnDecreaseFont");
  const btnResetFont = document.getElementById("btnResetFont");
  const btnToggleContrast = document.getElementById("btnToggleContrast");

  if (btnIncreaseFont) {
    btnIncreaseFont.addEventListener("click", () => applyFontScale(currentFontScale + 0.10));
  }
  if (btnDecreaseFont) {
    btnDecreaseFont.addEventListener("click", () => applyFontScale(currentFontScale - 0.10));
  }
  if (btnResetFont) {
    btnResetFont.addEventListener("click", () => applyFontScale(1.0));
  }
  if (btnToggleContrast) {
    btnToggleContrast.addEventListener("click", () => {
      document.body.classList.toggle("high-contrast");
      const active = document.body.classList.contains("high-contrast");
      localStorage.setItem("sonar_high_contrast", active ? "true" : "false");
    });
  }

  // ==========================================
  // 2. MENU MOBILE RESPONSIVO (DRAWER)
  // ==========================================
  const btnMobileMenu = document.getElementById("btnMobileMenu");
  const navLinks = document.getElementById("navLinks");

  if (btnMobileMenu && navLinks) {
    btnMobileMenu.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("mobile-open");
      btnMobileMenu.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Fecha o menu automaticamente ao clicar em qualquer item
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("mobile-open");
        btnMobileMenu.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ==========================================
  // 3. CALCULADORA DE INVESTIMENTO EM ACESSIBILIDADE
  // ==========================================
  const RATES = {
    lse: 35.0,     // LSE com Foley & Sonoplastia (ABNT NBR 15290)
    ad: 55.0,      // Audiodescrição Roteirizada & Gravada (ABNT NBR 16452)
    libras: 60.0   // Janela de Libras com Intérprete Certificado
  };

  const MIN_ORDER_PRICE = 300.0;
  let currentUrgencyMultiplier = 1.0;

  const slider = document.getElementById("sliderDuration") || document.getElementById("rangeMinutes");
  const displayMinutes = document.getElementById("displayMinutes");
  const checkLse = document.getElementById("checkLse");
  const checkAd = document.getElementById("checkAd");
  const checkLibras = document.getElementById("checkLibras");
  const displayTotal = document.getElementById("displayTotal");
  const btnWhatsappBudget = document.getElementById("btnWhatsappBudget");

  function syncChip(checkbox, chipId) {
    if (!checkbox) return;
    const chip = document.getElementById(chipId) || checkbox.closest(".chip-option");
    if (!chip) return;
    if (checkbox.checked) {
      chip.classList.add("selected");
      chip.setAttribute("aria-checked", "true");
    } else {
      chip.classList.remove("selected");
      chip.setAttribute("aria-checked", "false");
    }
  }

  function updateCalculator() {
    if (!slider) return;
    const minutes = parseInt(slider.value, 10);
    slider.setAttribute("aria-valuenow", minutes);

    if (displayMinutes) {
      displayMinutes.innerText = `${minutes} min`;
    }

    let ratePerMinute = 0;
    const selectedServices = [];

    if (checkLse && checkLse.checked) {
      ratePerMinute += RATES.lse;
      selectedServices.push("LSE com Foley");
    }
    syncChip(checkLse, "chipLse");

    if (checkAd && checkAd.checked) {
      ratePerMinute += RATES.ad;
      selectedServices.push("Audiodescrição (AD)");
    }
    syncChip(checkAd, "chipAd");

    if (checkLibras && checkLibras.checked) {
      ratePerMinute += RATES.libras;
      selectedServices.push("Janela de Libras");
    }
    syncChip(checkLibras, "chipLibras");

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

  // Torna os cards chip-option clicáveis e navegáveis via teclado
  document.querySelectorAll(".chip-option").forEach((chip) => {
    chip.addEventListener("click", (e) => {
      const checkbox = chip.querySelector("input[type=checkbox]");
      if (checkbox && e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        updateCalculator();
      }
    });

    chip.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const checkbox = chip.querySelector("input[type=checkbox]");
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          updateCalculator();
        }
      }
    });
  });

  // Seletores Rápidos de Minutos
  document.querySelectorAll(".calc-pill[data-min]").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".calc-pill[data-min]").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      if (slider) {
        slider.value = pill.dataset.min;
        updateCalculator();
      }
    });
  });

  // Seletores Rápidos de Urgência
  document.querySelectorAll(".calc-pill[data-urgency]").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".calc-pill[data-urgency]").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentUrgencyMultiplier = parseFloat(pill.dataset.urgency) || 1.0;
      updateCalculator();
    });
  });

  // ==========================================
  // 4. CENAS E DEMONSTRADOR INTERATIVO
  // ==========================================
  const SCENES = [
    {
      title: "Cena 1: Suspense e Infiltração — Curta Sem Diálogos",
      standardSubtitle: "— (Sem falas detectadas pela ferramenta comum) —",
      sonarSubtitle: "[Porta de madeira rangendo vagarosamente] [Passos pesados no assoalho]",
      adText: "Câmera baixa em plano subjetivo. Uma mão enluvada empurra a porta de madeira carcomida, que chia estridente. Passos lentos e ritmados ecoam sobre o assoalho envelhecido em direção à penumbra.",
      foleyType: 0
    },
    {
      title: "Cena 2: Clímax Dramático — Tensão & Respiração",
      standardSubtitle: "— ... —",
      sonarSubtitle: "[Trilha de cordas tensas em crescendo] [Respiração ofegante ao fundo]",
      adText: "Close fechado no rosto suado da personagem. Seus olhos se arregalam no escuro enquanto sua respiração acelera, antecipando o confronto iminente.",
      foleyType: 1
    },
    {
      title: "Cena 3: Madrugada Chuvosa — Sino & Vento Distante",
      standardSubtitle: "— (Legenda vazia) —",
      sonarSubtitle: "[Vento forte soprando pelas frestas] [Sino de capela badalando 3 vezes]",
      adText: "Plano aberto da cidade sob névoa densa. As folhas secas giram no ar enquanto a torre da capela desponta na penumbra, anunciando a terceira badalada da meia-noite.",
      foleyType: 2
    }
  ];

  let currentSceneIdx = 0;
  const demoSceneTitle = document.getElementById("demoSceneTitle");
  const demoStandardSub = document.getElementById("demoStandardSub");
  const demoSonarSub = document.getElementById("demoSonarSub");
  const demoAdText = document.getElementById("demoAdText");
  const demoAdBox = document.getElementById("demoAdBox");
  const adStatusBadge = document.getElementById("adStatusBadge");

  const btnNextScene = document.getElementById("btnNextScene");
  const btnPlayFoleyCue = document.getElementById("btnPlayFoleyCue");
  const btnPlayAdVoice = document.getElementById("btnPlayAdVoice");
  const btnPlayFullExp = document.getElementById("btnPlayFullExp");

  function renderCurrentScene() {
    const scene = SCENES[currentSceneIdx];
    if (demoSceneTitle) demoSceneTitle.innerText = scene.title;
    if (demoStandardSub) demoStandardSub.innerText = scene.standardSubtitle;
    if (demoSonarSub) demoSonarSub.innerText = scene.sonarSubtitle;
    if (demoAdText) demoAdText.innerText = `"${scene.adText}"`;
  }

  if (btnNextScene) {
    btnNextScene.addEventListener("click", () => {
      currentSceneIdx = (currentSceneIdx + 1) % SCENES.length;
      renderCurrentScene();
    });
  }

  // ==========================================
  // 5. MOTOR ACÚSTICO DE FOLEY (WEB AUDIO API)
  // ==========================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playRealisticFoley(sceneIndex) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (sceneIndex === 0) {
      // CENÁRIO 1: Porta de madeira rangendo + 2 passos pesados
      // A) Rangido de porta de madeira (sawtooth modulado por bandpass e vibrato)
      const oscCreak = ctx.createOscillator();
      const lfoCreak = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const filterCreak = ctx.createBiquadFilter();
      const gainCreak = ctx.createGain();

      oscCreak.type = "sawtooth";
      oscCreak.frequency.setValueAtTime(95, now);
      oscCreak.frequency.exponentialRampToValueAtTime(260, now + 0.35);
      oscCreak.frequency.exponentialRampToValueAtTime(80, now + 0.75);

      lfoCreak.type = "sine";
      lfoCreak.frequency.setValueAtTime(28, now);
      lfoGain.gain.setValueAtTime(45, now);

      lfoCreak.connect(lfoGain);
      lfoGain.connect(oscCreak.frequency);

      filterCreak.type = "bandpass";
      filterCreak.frequency.setValueAtTime(550, now);
      filterCreak.Q.setValueAtTime(4.5, now);

      gainCreak.gain.setValueAtTime(0.001, now);
      gainCreak.gain.linearRampToValueAtTime(0.28, now + 0.12);
      gainCreak.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      oscCreak.connect(filterCreak);
      filterCreak.connect(gainCreak);
      gainCreak.connect(ctx.destination);

      oscCreak.start(now);
      lfoCreak.start(now);
      oscCreak.stop(now + 0.8);
      lfoCreak.stop(now + 0.8);

      // B) Passos no assoalho (dois impactos ressonantes de madeira em +0.85s e +1.45s)
      [0.85, 1.45].forEach((delay, idx) => {
        const stepTime = now + delay;
        const oscStep = ctx.createOscillator();
        const gainStep = ctx.createGain();
        const filterStep = ctx.createBiquadFilter();

        oscStep.type = "triangle";
        oscStep.frequency.setValueAtTime(140 - idx * 15, stepTime);
        oscStep.frequency.exponentialRampToValueAtTime(42, stepTime + 0.22);

        filterStep.type = "lowpass";
        filterStep.frequency.setValueAtTime(320, stepTime);

        gainStep.gain.setValueAtTime(0.35, stepTime);
        gainStep.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.22);

        oscStep.connect(filterStep);
        filterStep.connect(gainStep);
        gainStep.connect(ctx.destination);

        oscStep.start(stepTime);
        oscStep.stop(stepTime + 0.25);
      });

    } else if (sceneIndex === 1) {
      // CENÁRIO 2: Cordas tensas em crescendo dissonante + respiração
      const chordFreqs = [110, 116.5, 220, 329.6]; // Lá, Lá#, Lá (8va), Mi (acorde de suspense)
      chordFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(280, now);
        filter.frequency.exponentialRampToValueAtTime(1900, now + 2.2);

        gain.gain.setValueAtTime(0.005, now);
        gain.gain.exponentialRampToValueAtTime(0.09, now + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.45);
      });

      // Respiração ofegante simulada via ruído filtrado
      try {
        const bufferSize = ctx.sampleRate * 2.2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "bandpass";
        noiseFilter.frequency.setValueAtTime(950, now);
        noiseFilter.Q.setValueAtTime(2.5, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.linearRampToValueAtTime(0.08, now + 0.6);
        noiseGain.gain.linearRampToValueAtTime(0.005, now + 1.1);
        noiseGain.gain.linearRampToValueAtTime(0.12, now + 1.6);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        whiteNoise.start(now);
        whiteNoise.stop(now + 2.2);
      } catch (e) {
        // Fallback silencioso para browsers legados
      }

    } else if (sceneIndex === 2) {
      // CENÁRIO 3: Vento pelas frestas + 3 badaladas de sino
      // A) Vento
      try {
        const bufferSize = ctx.sampleRate * 3.0;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const wind = ctx.createBufferSource();
        wind.buffer = noiseBuffer;

        const windFilter = ctx.createBiquadFilter();
        windFilter.type = "bandpass";
        windFilter.frequency.setValueAtTime(350, now);
        windFilter.frequency.exponentialRampToValueAtTime(750, now + 1.2);
        windFilter.frequency.exponentialRampToValueAtTime(280, now + 2.8);
        windFilter.Q.setValueAtTime(3.2, now);

        const windGain = ctx.createGain();
        windGain.gain.setValueAtTime(0.01, now);
        windGain.gain.linearRampToValueAtTime(0.14, now + 1.0);
        windGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

        wind.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(ctx.destination);

        wind.start(now);
        wind.stop(now + 3.0);
      } catch (e) {}

      // B) 3 badaladas de sino metálico de capela
      [0.2, 1.2, 2.2].forEach((delay) => {
        const chimeTime = now + delay;
        const partials = [523.25, 622.25, 783.99, 1046.5]; // C5, D#5, G5, C6 (harmônicos metálicos)

        partials.forEach((freq, pIdx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, chimeTime);

          const decayTime = 1.6 / (pIdx + 1);
          gain.gain.setValueAtTime(0.18 / (pIdx + 1), chimeTime);
          gain.gain.exponentialRampToValueAtTime(0.0005, chimeTime + decayTime);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(chimeTime);
          osc.stop(chimeTime + decayTime);
        });
      });
    }
  }

  // ==========================================
  // 6. MOTOR DE AUDIODESCRIÇÃO (WEB SPEECH API)
  // ==========================================
  function speakAdVoice(text) {
    if (!("speechSynthesis" in window)) {
      alert("A síntese de voz (Audiodescrição) não é suportada diretamente neste navegador.");
      return;
    }

    // Cancela fala anterior se houver
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.94;  // Cadência confortável de audiodescritor profissional
    utterance.pitch = 0.96; // Tom solene e natural

    // Tenta selecionar voz brasileira autêntica
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find((v) => v.lang === "pt-BR" || v.lang.startsWith("pt"));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onstart = () => {
      if (demoAdBox) demoAdBox.classList.add("speaking");
      if (adStatusBadge) {
        adStatusBadge.innerHTML = `<i data-lucide="mic"></i> <span style="color: var(--sonar-coral); font-weight: 700;">Narrando ao vivo em PT-BR...</span>`;
        if (window.lucide) window.lucide.createIcons();
      }
    };

    utterance.onend = () => {
      if (demoAdBox) demoAdBox.classList.remove("speaking");
      if (adStatusBadge) {
        adStatusBadge.innerHTML = `<i data-lucide="volume-2" style="width: 14px; height: 14px; color: var(--sonar-amber);"></i> <span>Síntese de voz cênica (ABNT NBR 16452)</span>`;
        if (window.lucide) window.lucide.createIcons();
      }
    };

    utterance.onerror = () => {
      if (demoAdBox) demoAdBox.classList.remove("speaking");
      if (adStatusBadge) {
        adStatusBadge.innerHTML = `<i data-lucide="volume-2" style="width: 14px; height: 14px; color: var(--sonar-amber);"></i> <span>Síntese de voz cênica (ABNT NBR 16452)</span>`;
        if (window.lucide) window.lucide.createIcons();
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  // Event Listeners dos Botões do Comparador
  if (btnPlayFoleyCue) {
    btnPlayFoleyCue.addEventListener("click", () => {
      playRealisticFoley(SCENES[currentSceneIdx].foleyType);
    });
  }

  if (btnPlayAdVoice) {
    btnPlayAdVoice.addEventListener("click", () => {
      speakAdVoice(SCENES[currentSceneIdx].adText);
    });
  }

  if (btnPlayFullExp) {
    btnPlayFullExp.addEventListener("click", () => {
      // Inicia o Foley e a Audiodescrição ao mesmo tempo
      playRealisticFoley(SCENES[currentSceneIdx].foleyType);
      speakAdVoice(SCENES[currentSceneIdx].adText);
    });
  }

  // Pré-carrega vozes do browser para garantir que pt-BR esteja pronto
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }

  // ==========================================
  // 7. INICIALIZAÇÃO GERAL
  // ==========================================
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  // Renderiza primeira cena e executa cálculo inicial
  renderCurrentScene();
  updateCalculator();
});
