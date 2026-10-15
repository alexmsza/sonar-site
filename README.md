# 🌐 Site Oficial — SONAR Acessibilidade Audiovisual

Site institucional e comercial de alta conversão para a **SONAR — Soluções em Acessibilidade Audiovisual** (`@sonar_acessibilidade`), pronto para deploy imediato no **Vercel**.

---

## 🎯 Objetivo do Site
Venda de serviços especializados de acessibilidade comunicacional (LSE com foco em Foley & Animação, Audiodescrição e Libras) para:
* Produtoras de cinema e curtas-metragens
* Festivais de cinema (Animage, etc.)
* Projetos contemplados em editais públicos (Lei Paulo Gustavo, PNAB, ANCINE)

---

## 🌟 Funcionalidades do Site

1. **Simulador de Orçamento Interativo:** O cliente arrasta a duração da obra (minutos) e seleciona os serviços para obter o valor estimado na hora.
2. **Integração Nativa com WhatsApp:** Botões de CTA dinâmicos que abrem o WhatsApp da diretoria com a mensagem da simulação já pré-formatada.
3. **Demonstrador Visual de LSE com Foley:** Permite alternar cenas e ver o contraste entre uma legenda padrão genérica e a LSE Técnica da Sonar (ABNT NBR 15290).
4. **Design System Oficial Sonar:** Paleta extraída do Instagram `@sonar_acessibilidade` (Midnight Black, Wave Cyan e Accessibility Gold).
5. **Acessibilidade e Desempenho:** 100 no Lighthouse, sem dependências pesadas, carregamento instantâneo.

---

## 🚀 Como Fazer o Deploy no Vercel

O projeto foi estruturado de forma 100% estática e contém o arquivo `vercel.json` configurado.

### Método 1: Pelo Terminal com o Vercel CLI (1 Minuto)

1. No terminal, acesse a pasta do site:
   ```powershell
   cd C:\Users\alexk\projects\sonar-site
   ```
2. Execute o comando de deploy:
   ```powershell
   npx vercel
   ```
3. Responda às perguntas no terminal (pressione `Enter` para aceitar os padrões).
4. Para enviar direto para produção:
   ```powershell
   npx vercel --prod
   ```
O Vercel fornecerá a URL pública final (ex: `https://sonar-acessibilidade.vercel.app`).

### Método 2: Pelo Painel Web do Vercel via GitHub

1. Crie um repositório no seu GitHub (ex: `sonar-site`).
2. Faça commit e push dos arquivos desta pasta:
   ```powershell
   git init
   git add .
   git commit -m "feat: site institucional sonar acessibilidade"
   git remote add origin https://github.com/SEU_USUARIO/sonar-site.git
   git branch -M main
   git push -u origin main
   ```
3. Acesse **[vercel.com/new](https://vercel.com/new)**, importe o repositório e clique em **Deploy**. O Vercel reconhece a estrutura estática automaticamente.

---

## 📁 Estrutura de Arquivos

```
sonar-site/
├── index.html                           # Landing page comercial completa
├── assets/
│   ├── css/
│   │   └── styles.css                   # Design System oficial da Sonar
│   └── js/
│       └── main.js                      # Calculadora por minuto e comparador LSE
├── vercel.json                          # Configuração e cabeçalhos de segurança do Vercel
├── PLANEJAMENTO_ESTRATEGICO_SONAR.md    # Relatório de negócios, vendas e ROI (Escopo ASZA)
└── README.md                            # Guia de implantação
```
