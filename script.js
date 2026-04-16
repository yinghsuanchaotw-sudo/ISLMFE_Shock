let currentStage = 0;
let currentShock = "tfp";

const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const resetBtn = document.getElementById("reset-btn");
const shockSelect = document.getElementById("shock-select");
const explanationText = document.querySelector(".top-explanation-text");

const laborPanel = document.getElementById("labor-panel");
const productionPanel = document.getElementById("production-panel");
const goodsPanel = document.getElementById("goods-panel");
const moneyPanel = document.getElementById("money-panel");

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function buildPathFromFunction(fn, xStart, xEnd, n = 80) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const x = xStart + (xEnd - xStart) * (i / n);
    const y = fn(x);
    pts.push([x, y]);
  }
  return pts
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt[0].toFixed(2)} ${pt[1].toFixed(2)}`)
    .join(" ");
}

function createProductionGraph() {
  const oldGroup = document.getElementById("prod-old-group");
  const newCurveGroup = document.getElementById("prod-new-curve-group");
  const newOutputGroup = document.getElementById("prod-new-output-group");

  const tfpnegCurveGroup = document.getElementById("prod-tfpneg-curve-group");
  const tfpnegOutputGroup = document.getElementById("prod-tfpneg-output-group");

  const permaCurveGroup = document.getElementById("prod-perma-curve-group");
  const permaOutputGroup = document.getElementById("prod-perma-output-group");

  const permnegCurveGroup = document.getElementById("prod-permneg-curve-group");
  const permnegOutputGroup = document.getElementById("prod-permneg-output-group");

  const kdropCurveGroup = document.getElementById("prod-kdrop-curve-group");
  const kdropOutputGroup = document.getElementById("prod-kdrop-output-group");

  const fiscalOutputGroup = document.getElementById("prod-fiscal-output-group");
  const taxcutOutputGroup = document.getElementById("prod-taxcut-output-group");

  oldGroup.innerHTML = "";
  newCurveGroup.innerHTML = "";
  newOutputGroup.innerHTML = "";
  tfpnegCurveGroup.innerHTML = "";
  tfpnegOutputGroup.innerHTML = "";
  permaCurveGroup.innerHTML = "";
  permaOutputGroup.innerHTML = "";
  permnegCurveGroup.innerHTML = "";
  permnegOutputGroup.innerHTML = "";
  kdropCurveGroup.innerHTML = "";
  kdropOutputGroup.innerHTML = "";
  fiscalOutputGroup.innerHTML = "";
  taxcutOutputGroup.innerHTML = "";

  const xMin = 60;
  const xMax = 245;

  const xOld = 159.4;
  const xTFP = 176.7;
  const xTFPNeg = 145.0;
  const xPerma = 180.5;
  const xPermNeg = 143.6;
  const xKdrop = 142.1;
  const xFiscal = 166.7;
  const xTaxcut = 152.1;

  const alpha = 0.6;
  const scale = 133.5;
  const AOld = 1.0;
  const ATemp = 1.08;
  const ATempNeg = 0.92;
  const APerma = 1.12;
  const APermNeg = 0.90;
  const AKdrop = 0.93;

  function yFromProduction(x, A) {
    const L = Math.max(0.03, (x - xMin) / (xMax - xMin));
    return 180 - scale * A * Math.pow(L, alpha);
  }

  const yOld = yFromProduction(xOld, AOld);
  const yTFP = yFromProduction(xTFP, ATemp);
  const yTFPNeg = yFromProduction(xTFPNeg, ATempNeg);
  const yPerma = yFromProduction(xPerma, APerma);
  const yPermNeg = yFromProduction(xPermNeg, APermNeg);
  const yKdrop = yFromProduction(xKdrop, AKdrop);
  const yFiscal = yFromProduction(xFiscal, AOld);
  const yTaxcut = yFromProduction(xTaxcut, AOld);

  const oldPath = svgEl("path", {
    d: buildPathFromFunction((x) => yFromProduction(x, AOld), xMin, xMax, 120),
    class: "curve-old"
  });
  oldGroup.appendChild(oldPath);

  oldGroup.appendChild(svgEl("circle", {
    cx: xOld,
    cy: yOld,
    r: 5,
    class: "eq-old"
  }));
  oldGroup.appendChild(svgEl("line", {
    x1: xOld, y1: yOld, x2: xOld, y2: 200, class: "guide-line"
  }));
  oldGroup.appendChild(svgEl("line", {
    x1: 45, y1: yOld, x2: xOld, y2: yOld, class: "guide-line"
  }));

  const oldLabel = svgEl("text", {
    x: 202, y: 58, class: "label-text old-label"
  });
  oldLabel.textContent = "Y = F(L)";
  oldGroup.appendChild(oldLabel);

  const lStar = svgEl("text", {
    x: 151, y: 218, class: "small-label"
  });
  lStar.textContent = "L*";
  oldGroup.appendChild(lStar);

  const yStar = svgEl("text", {
    x: 18, y: yOld + 4, class: "small-label"
  });
  yStar.textContent = "Y*";
  oldGroup.appendChild(yStar);

  // Temporary increase
  const newPath = svgEl("path", {
    d: buildPathFromFunction((x) => yFromProduction(x, ATemp), xMin, xMax, 120),
    class: "curve-new"
  });
  newCurveGroup.appendChild(newPath);

  const newCurveLabel = svgEl("text", {
    x: 188, y: 34, class: "label-text new-label"
  });
  newCurveLabel.textContent = "Y = A·F(L)";
  newCurveGroup.appendChild(newCurveLabel);

  newOutputGroup.appendChild(svgEl("circle", {
    cx: xTFP, cy: yTFP, r: 6, class: "eq-new"
  }));
  newOutputGroup.appendChild(svgEl("line", {
    x1: xTFP, y1: yTFP, x2: xTFP, y2: 200, class: "guide-line new-guide"
  }));
  newOutputGroup.appendChild(svgEl("line", {
    x1: 45, y1: yTFP, x2: xTFP, y2: yTFP, class: "guide-line new-guide"
  }));

  const lPrimeTFP = svgEl("text", {
    x: 170, y: 218, class: "small-label"
  });
  lPrimeTFP.textContent = "L′";
  newOutputGroup.appendChild(lPrimeTFP);

  const yPrimeTFP = svgEl("text", {
    x: 14, y: yTFP + 4, class: "small-label"
  });
  yPrimeTFP.textContent = "Y′";
  newOutputGroup.appendChild(yPrimeTFP);

  // Temporary decrease
  const tfpnegPath = svgEl("path", {
    d: buildPathFromFunction((x) => yFromProduction(x, ATempNeg), xMin, xMax, 120),
    class: "curve-new"
  });
  tfpnegCurveGroup.appendChild(tfpnegPath);

  const tfpnegCurveLabel = svgEl("text", {
    x: 176, y: 66, class: "label-text new-label"
  });
  tfpnegCurveLabel.textContent = "Y = A·F(L)";
  tfpnegCurveGroup.appendChild(tfpnegCurveLabel);

  tfpnegOutputGroup.appendChild(svgEl("circle", {
    cx: xTFPNeg, cy: yTFPNeg, r: 6, class: "eq-new"
  }));
  tfpnegOutputGroup.appendChild(svgEl("line", {
    x1: xTFPNeg, y1: yTFPNeg, x2: xTFPNeg, y2: 200, class: "guide-line new-guide"
  }));
  tfpnegOutputGroup.appendChild(svgEl("line", {
    x1: 45, y1: yTFPNeg, x2: xTFPNeg, y2: yTFPNeg, class: "guide-line new-guide"
  }));

  const lPrimeTFPNeg = svgEl("text", {
    x: 138, y: 218, class: "small-label"
  });
  lPrimeTFPNeg.textContent = "L′";
  tfpnegOutputGroup.appendChild(lPrimeTFPNeg);

  const yPrimeTFPNeg = svgEl("text", {
    x: 14, y: yTFPNeg + 4, class: "small-label"
  });
  yPrimeTFPNeg.textContent = "Y′";
  tfpnegOutputGroup.appendChild(yPrimeTFPNeg);

  // Permanent increase
  const permaPath = svgEl("path", {
    d: buildPathFromFunction((x) => yFromProduction(x, APerma), xMin, xMax, 120),
    class: "curve-new"
  });
  permaCurveGroup.appendChild(permaPath);

  const permaCurveLabel = svgEl("text", {
    x: 188, y: 26, class: "label-text new-label"
  });
  permaCurveLabel.textContent = "Y = A·F(L)";
  permaCurveGroup.appendChild(permaCurveLabel);

  permaOutputGroup.appendChild(svgEl("circle", {
    cx: xPerma, cy: yPerma, r: 6, class: "eq-new"
  }));
  permaOutputGroup.appendChild(svgEl("line", {
    x1: xPerma, y1: yPerma, x2: xPerma, y2: 200, class: "guide-line new-guide"
  }));
  permaOutputGroup.appendChild(svgEl("line", {
    x1: 45, y1: yPerma, x2: xPerma, y2: yPerma, class: "guide-line new-guide"
  }));

  const lPrimePerma = svgEl("text", {
    x: 184, y: 218, class: "small-label"
  });
  lPrimePerma.textContent = "L′";
  permaOutputGroup.appendChild(lPrimePerma);

  const yPrimePerma = svgEl("text", {
    x: 14, y: yPerma + 4, class: "small-label"
  });
  yPrimePerma.textContent = "Y′";
  permaOutputGroup.appendChild(yPrimePerma);

  // Permanent decrease
  const permnegPath = svgEl("path", {
    d: buildPathFromFunction((x) => yFromProduction(x, APermNeg), xMin, xMax, 120),
    class: "curve-new"
  });
  permnegCurveGroup.appendChild(permnegPath);

  const permnegCurveLabel = svgEl("text", {
    x: 168, y: 74, class: "label-text new-label"
  });
  permnegCurveLabel.textContent = "Y = A·F(L)";
  permnegCurveGroup.appendChild(permnegCurveLabel);

  permnegOutputGroup.appendChild(svgEl("circle", {
    cx: xPermNeg, cy: yPermNeg, r: 6, class: "eq-new"
  }));
  permnegOutputGroup.appendChild(svgEl("line", {
    x1: xPermNeg, y1: yPermNeg, x2: xPermNeg, y2: 200, class: "guide-line new-guide"
  }));
  permnegOutputGroup.appendChild(svgEl("line", {
    x1: 45, y1: yPermNeg, x2: xPermNeg, y2: yPermNeg, class: "guide-line new-guide"
  }));

  const lPrimePermNeg = svgEl("text", {
    x: 127, y: 218, class: "small-label"
  });
  lPrimePermNeg.textContent = "L′";
  permnegOutputGroup.appendChild(lPrimePermNeg);

  const yPrimePermNeg = svgEl("text", {
    x: 14, y: yPermNeg + 4, class: "small-label"
  });
  yPrimePermNeg.textContent = "Y′";
  permnegOutputGroup.appendChild(yPrimePermNeg);

  // Capital destruction
  const kdropPath = svgEl("path", {
    d: buildPathFromFunction((x) => yFromProduction(x, AKdrop), xMin, xMax, 120),
    class: "curve-new"
  });
  kdropCurveGroup.appendChild(kdropPath);

  const kdropCurveLabel = svgEl("text", {
    x: 176, y: 62, class: "label-text new-label"
  });
  kdropCurveLabel.textContent = "Y = F(L, K_t′)";
  kdropCurveGroup.appendChild(kdropCurveLabel);

  kdropOutputGroup.appendChild(svgEl("circle", {
    cx: xKdrop, cy: yKdrop, r: 6, class: "eq-new"
  }));
  kdropOutputGroup.appendChild(svgEl("line", {
    x1: xKdrop, y1: yKdrop, x2: xKdrop, y2: 200, class: "guide-line new-guide"
  }));
  kdropOutputGroup.appendChild(svgEl("line", {
    x1: 45, y1: yKdrop, x2: xKdrop, y2: yKdrop, class: "guide-line new-guide"
  }));

  const lPrimeKdrop = svgEl("text", {
    x: 135, y: 218, class: "small-label"
  });
  lPrimeKdrop.textContent = "L′";
  kdropOutputGroup.appendChild(lPrimeKdrop);

  const yPrimeKdrop = svgEl("text", {
    x: 14, y: yKdrop + 4, class: "small-label"
  });
  yPrimeKdrop.textContent = "Y′";
  kdropOutputGroup.appendChild(yPrimeKdrop);

  // Fiscal
  fiscalOutputGroup.appendChild(svgEl("circle", {
    cx: xFiscal, cy: yFiscal, r: 6, class: "eq-new"
  }));
  fiscalOutputGroup.appendChild(svgEl("line", {
    x1: xFiscal, y1: yFiscal, x2: xFiscal, y2: 200, class: "guide-line new-guide"
  }));
  fiscalOutputGroup.appendChild(svgEl("line", {
    x1: 45, y1: yFiscal, x2: xFiscal, y2: yFiscal, class: "guide-line new-guide"
  }));

  const lPrimeFiscal = svgEl("text", {
    x: 160, y: 218, class: "small-label"
  });
  lPrimeFiscal.textContent = "L′";
  fiscalOutputGroup.appendChild(lPrimeFiscal);

  const yPrimeFiscal = svgEl("text", {
    x: 14, y: yFiscal + 4, class: "small-label"
  });
  yPrimeFiscal.textContent = "Y′";
  fiscalOutputGroup.appendChild(yPrimeFiscal);

  // Tax cut
  taxcutOutputGroup.appendChild(svgEl("circle", {
    cx: xTaxcut, cy: yTaxcut, r: 6, class: "eq-new"
  }));
  taxcutOutputGroup.appendChild(svgEl("line", {
    x1: xTaxcut, y1: yTaxcut, x2: xTaxcut, y2: 200, class: "guide-line new-guide"
  }));
  taxcutOutputGroup.appendChild(svgEl("line", {
    x1: 45, y1: yTaxcut, x2: xTaxcut, y2: yTaxcut, class: "guide-line new-guide"
  }));

  const lPrimeTaxcut = svgEl("text", {
    x: 144, y: 218, class: "small-label"
  });
  lPrimeTaxcut.textContent = "L′";
  taxcutOutputGroup.appendChild(lPrimeTaxcut);

  const yPrimeTaxcut = svgEl("text", {
    x: 14, y: yTaxcut + 4, class: "small-label"
  });
  yPrimeTaxcut.textContent = "Y′";
  taxcutOutputGroup.appendChild(yPrimeTaxcut);
}

function revealGroup(className) {
  document.querySelectorAll(`.${className}`).forEach((el) => {
    el.classList.remove("hidden");
  });
}

function hideGroup(className) {
  document.querySelectorAll(`.${className}`).forEach((el) => {
    el.classList.add("hidden");
  });
}

function setPanelStates(activeKey = null, completedKeys = []) {
  const panelMap = {
    labor: laborPanel,
    production: productionPanel,
    goods: goodsPanel,
    money: moneyPanel
  };

  Object.entries(panelMap).forEach(([key, panel]) => {
    panel.classList.remove("active", "completed", "inactive");
    if (key === activeKey) {
      panel.classList.add("active");
    } else if (completedKeys.includes(key)) {
      panel.classList.add("completed");
    } else {
      panel.classList.add("inactive");
    }
  });
}

function resetVisualsOnly() {
  [
    "labor-new",
    "labor-tfpneg",
    "labor-perma",
    "labor-permneg",
    "labor-kdrop",
    "labor-fiscal",
    "labor-taxcut",

    "prod-link",
    "prod-tfpneg-link",
    "prod-perma-link",
    "prod-permneg-link",
    "prod-kdrop-link",
    "prod-fiscal-link",
    "prod-taxcut-link",

    "prod-curve",
    "prod-output",
    "prod-tfpneg-curve",
    "prod-tfpneg",
    "prod-perma-curve",
    "prod-perma",
    "prod-permneg-curve",
    "prod-permneg",
    "prod-kdrop-curve",
    "prod-kdrop",
    "prod-fiscal",
    "prod-taxcut",

    "goods-new",
    "goods-tfpneg-s",
    "goods-tfpneg",
    "goods-perma",
    "goods-perma-i",
    "goods-permneg",
    "goods-permneg-i",
    "goods-kdrop",
    "goods-kdrop-s",
    "goods-kdrop-i",
    "goods-fiscal",
    "goods-taxcut",

    "money-rate",
    "money-md",
    "money-adjust",

    "money-tfpneg-rate",
    "money-tfpneg-md",
    "money-tfpneg-point",
    "money-tfpneg-adjust",

    "money-perma-rate",
    "money-perma-md",
    "money-perma-point",
    "money-perma-adjust",

    "money-permneg-rate",
    "money-permneg-md",
    "money-permneg-point",
    "money-permneg-adjust",

    "money-kdrop-rate",
    "money-kdrop-md",
    "money-kdrop-point",
    "money-kdrop-adjust",

    "money-fiscal-rate",
    "money-fiscal-md",
    "money-fiscal-point",
    "money-fiscal-adjust",

    "money-taxcut-rate",
    "money-taxcut-md",
    "money-taxcut-point",
    "money-taxcut-adjust",

    "fe-new",
    "fe-tfpneg",
    "fe-perma",
    "fe-permneg",
    "fe-kdrop",
    "fe-fiscal",
    "fe-taxcut",

    "is-new",
    "is-tfpneg",
    "is-perma",
    "is-permneg",
    "is-kdrop",
    "is-fiscal",
    "is-taxcut",

    "lm-new",
    "lm-tfpneg",
    "lm-perma",
    "lm-permneg",
    "lm-kdrop",
    "lm-fiscal",
    "lm-taxcut",

    "is-y-move",
    "lm-y-move",
    "is-new-point",

    "is-tfpneg-y",
    "lm-tfpneg-y",
    "is-tfpneg-point",

    "is-perma-y",
    "lm-perma-y",
    "is-perma-point",

    "is-permneg-y",
    "lm-permneg-y",
    "is-permneg-point",

    "is-kdrop-y",
    "lm-kdrop-y",
    "is-kdrop-point",

    "is-fiscal-y",
    "lm-fiscal-y",
    "is-fiscal-point",

    "is-taxcut-y",
    "lm-taxcut-y",
    "is-taxcut-point"
  ].forEach(hideGroup);

  setPanelStates("labor", []);
}

const SHOCKS = {
  tfp: {
    maxStage: 8,
    stages: {
      0: {
        active: "labor",
        completed: [],
        reveal: [],
        text: `Press <strong>Begin</strong> to start. This shock is a <strong>temporary increase in Aₜ today and today only</strong>.`,
        button: "Begin"
      },
      1: {
        active: "labor",
        completed: [],
        reveal: ["labor-new"],
        text: `<strong>Labor Market:</strong> Higher TFP raises the marginal product of labor, so <strong>labor demand shifts right</strong>. Labor supply stays the same, so full-employment labor rises from L* to L′.`,
        button: "Next"
      },
      2: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-new", "prod-link"],
        text: `<strong>Production Function, Step 1:</strong> Carry the new full-employment labor level <strong>L′</strong> from the labor market into the production function.`,
        button: "Next"
      },
      3: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-new", "prod-link", "prod-curve"],
        text: `<strong>Production Function, Step 2:</strong> Higher TFP shifts the production function up.`,
        button: "Next"
      },
      4: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-new", "prod-link", "prod-curve", "prod-output", "fe-new", "is-y-move", "lm-y-move"],
        text: `<strong>Production Function, Step 3:</strong> Full-employment output rises to <strong>Y′</strong>, so the <strong>FE line shifts right</strong>. This creates a movement along the old IS curve and along the old LM curve to the new Y-value.`,
        button: "Next"
      },
      5: {
        active: "goods",
        completed: ["labor", "production"],
        reveal: ["labor-new", "prod-link", "prod-curve", "prod-output", "fe-new", "goods-new", "lm-y-move", "is-new-point", "is-new"],
        text: `<strong>Goods Market:</strong> Because output is higher, desired saving rises, so the saving curve shifts right. Aₜ the new full-employment output, the goods market determines a lower real interest rate <strong>r′</strong>.`,
        button: "Next"
      },
      6: {
        active: "money",
        completed: ["labor", "production", "goods"],
        reveal: ["labor-new", "prod-link", "prod-curve", "prod-output", "fe-new", "goods-new", "lm-y-move", "is-new-point", "is-new", "money-rate"],
        text: `<strong>Money Market, Step 1:</strong> Bring the new interest rate <strong>r′</strong> from the goods market into the money market.`,
        button: "Next"
      },
      7: {
        active: "money",
        completed: ["labor", "production", "goods"],
        reveal: ["labor-new", "prod-link", "prod-curve", "prod-output", "fe-new", "goods-new", "lm-y-move", "is-new-point", "is-new", "money-rate", "money-md"],
        text: `<strong>Money Market, Step 2:</strong> Because output is higher, money demand shifts right from <strong>L(Y, r + πᵉ)</strong> to <strong>L(Y, r + πᵉ)′</strong>.`,
        button: "Next"
      },
      8: {
        active: null,
        completed: ["labor", "production", "goods", "money"],
        reveal: ["labor-new", "prod-link", "prod-curve", "prod-output", "fe-new", "goods-new", "is-new", "money-rate", "money-md", "money-adjust", "lm-new"],
        text: `<strong>Money Market, Step 3:</strong> The price level falls, so real money supply rises and the vertical <strong>MS/P</strong> line shifts right. In IS-LM-FE space, <strong>LM shifts right/down</strong> and the economy reaches the new long-run equilibrium.`,
        button: "Start Over"
      }
    }
  },

  tfpneg: {
    maxStage: 8,
    stages: {
      0: {
        active: "labor",
        completed: [],
        reveal: [],
        text: `Press <strong>Begin</strong> to start. This shock is a <strong>temporary decrease in Aₜ</strong>.`,
        button: "Begin"
      },
      1: {
        active: "labor",
        completed: [],
        reveal: ["labor-tfpneg"],
        text: `<strong>Labor Market:</strong> Lower current productivity reduces the marginal product of labor, so <strong>labor demand shifts left</strong>. Labor supply does not change. Employment falls and the real wage falls.`,
        button: "Next"
      },
      2: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-tfpneg", "prod-tfpneg-link"],
        text: `<strong>Production Function, Step 1:</strong> Carry the lower full-employment labor level <strong>L′</strong> from the labor market into the production function.`,
        button: "Next"
      },
      3: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-tfpneg", "prod-tfpneg-link", "prod-tfpneg-curve"],
        text: `<strong>Production Function, Step 2:</strong> Because <strong>A_t</strong> is lower today, the production function shifts <strong>down</strong>.`,
        button: "Next"
      },
      4: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-tfpneg", "prod-tfpneg-link", "prod-tfpneg-curve", "prod-tfpneg", "fe-tfpneg", "is-tfpneg-y", "lm-tfpneg-y"],
        text: `<strong>Production Function, Step 3:</strong> Full-employment output falls, so <strong>FE shifts left</strong>. This creates a movement along the old IS curve and along the old LM curve to the lower Y-value.`,
        button: "Next"
      },
      5: {
        active: "goods",
        completed: ["labor", "production"],
        reveal: ["labor-tfpneg", "prod-tfpneg-link", "prod-tfpneg-curve", "prod-tfpneg", "fe-tfpneg", "goods-tfpneg-s", "goods-tfpneg", "lm-tfpneg-y", "is-tfpneg-point", "is-tfpneg"],
        text: `<strong>Goods Market:</strong> Because current output is lower, desired saving falls, so the saving curve shifts left. Investment demand stays the same. The goods market determines a higher real interest rate <strong>r′</strong>.`,
        button: "Next"
      },
      6: {
        active: "money",
        completed: ["labor", "production", "goods"],
        reveal: ["labor-tfpneg", "prod-tfpneg-link", "prod-tfpneg-curve", "prod-tfpneg", "fe-tfpneg", "goods-tfpneg-s", "goods-tfpneg", "lm-tfpneg-y", "is-tfpneg-point", "is-tfpneg", "money-tfpneg-rate"],
        text: `<strong>Money Market, Step 1:</strong> Bring the higher real interest rate <strong>r′</strong> from the goods market into the money market.`,
        button: "Next"
      },
      7: {
        active: "money",
        completed: ["labor", "production", "goods"],
        reveal: ["labor-tfpneg", "prod-tfpneg-link", "prod-tfpneg-curve", "prod-tfpneg", "fe-tfpneg", "goods-tfpneg-s", "goods-tfpneg", "lm-tfpneg-y", "is-tfpneg-point", "is-tfpneg", "money-tfpneg-rate", "money-tfpneg-md", "money-tfpneg-point"],
        text: `<strong>Money Market, Step 2:</strong> Because output is lower, money demand falls. So <strong>L(Y, r + πᵉ)</strong> shifts left. At the interest rate <strong>r′</strong> from the goods market, the economy moves to the new money-demand point.`,
        button: "Next"
      },
      8: {
        active: null,
        completed: ["labor", "production", "goods", "money"],
        reveal: ["labor-tfpneg", "prod-tfpneg-link", "prod-tfpneg-curve", "prod-tfpneg", "fe-tfpneg", "goods-tfpneg-s", "goods-tfpneg", "is-tfpneg", "money-tfpneg-rate", "money-tfpneg-md", "money-tfpneg-adjust", "lm-tfpneg"],
        text: `<strong>Money Market, Step 3:</strong> The price level rises, so real money balances <strong>M/P</strong> fall until the money market clears. The final equilibrium is where <strong>IS′</strong>, <strong>LM′</strong>, and <strong>FE′</strong> intersect.`,
        button: "Start Over"
      }
    }
  },

  perma: {
    maxStage: 8,
    stages: {
      0: {
        active: "labor",
        completed: [],
        reveal: [],
        text: `Press <strong>Begin</strong> to start. This shock is a <strong>permanent increase in A</strong>: both <strong>Aₜ</strong> and <strong>Aₜ₊₁</strong> rise.`,
        button: "Begin"
      },
      1: {
        active: "labor",
        completed: [],
        reveal: ["labor-perma"],
        text: `<strong>Labor Market:</strong> Because productivity rises today and in the future, labor demand shifts <strong>right</strong>. Because the effect is direct and immediate, labor demand shift a lot to the right. In this setup, labor supply also shifts <strong>slightly left</strong> because worker expect a higher income in the future. This is a positive income effect on worker's labor supply decision (worker want to work less feeling richer). As a result, full employment rises, and the real wage also rises.`,
        button: "Next"
      },
      2: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-perma", "prod-perma-link"],
        text: `<strong>Production Function, Step 1:</strong> Carry the new higher full-employment labor level <strong>L′</strong> from the labor market into the production function.`,
        button: "Next"
      },
      3: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-perma", "prod-perma-link", "prod-perma-curve"],
        text: `<strong>Production Function, Step 2:</strong> Because <strong>Aₜ</strong> rises, the production function shifts up.`,
        button: "Next"
      },
      4: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-perma", "prod-perma-link", "prod-perma-curve", "prod-perma", "fe-perma", "is-perma-y", "lm-perma-y"],
        text: `<strong>Production Function, Step 3:</strong> With both higher labor and higher productivity, full-employment output rises a lot. So <strong>FE shifts right</strong>. This creates a movement along the old IS curve and along the old LM curve to the new Y-value.`,
        button: "Next"
      },
      5: {
        active: "goods",
        completed: ["labor", "production"],
        reveal: ["labor-perma", "prod-perma-link", "prod-perma-curve", "prod-perma", "fe-perma", "goods-perma", "goods-perma-i", "lm-perma-y", "is-perma-point", "is-perma"],
        text: `<strong>Goods Market:</strong> Desired saving stays about the same because consumption rises nearly one-for-one with output. <strong>Remember:</strong> if consumer expect a permanent increase in income, maginal propensity to consume is close to one. But investment demand shifts <strong>right a lot</strong> because expected future MPK rises. So the goods market determines a higher real interest rate <strong>r′</strong>.`,
        button: "Next"
      },
      6: {
        active: "money",
        completed: ["labor", "production", "goods"],
        reveal: ["labor-perma", "prod-perma-link", "prod-perma-curve", "prod-perma", "fe-perma", "goods-perma", "goods-perma-i", "lm-perma-y", "is-perma-point", "is-perma", "money-perma-rate"],
        text: `<strong>Money Market, Step 1:</strong> Bring the higher real interest rate <strong>r′</strong> from the goods market into the money market.`,
        button: "Next"
      },
      7: {
        active: "money",
        completed: ["labor", "production", "goods"],
        reveal: ["labor-perma", "prod-perma-link", "prod-perma-curve", "prod-perma", "fe-perma", "goods-perma", "goods-perma-i", "lm-perma-y", "is-perma-point", "is-perma", "money-perma-rate", "money-perma-md", "money-perma-point"],
        text: `<strong>Money Market, Step 2:</strong> Because output is higher, money demand also increases. So <strong>L(Y, r + πᵉ)</strong> shifts right. Aₜ the interest rate <strong>r′</strong> from the goods market, the economy moves to the new money-demand point.`,
        button: "Next"
      },
      8: {
        active: null,
        completed: ["labor", "production", "goods", "money"],
        reveal: ["labor-perma", "prod-perma-link", "prod-perma-curve", "prod-perma", "fe-perma", "goods-perma", "goods-perma-i", "is-perma", "money-perma-rate", "money-perma-md", "money-perma-adjust", "lm-perma"],
        text: `<strong>Money Market, Step 3:</strong> In this version, the price level rises enough that real money balances <strong>M/P</strong> fall, so the vertical <strong>MS/P</strong> line shifts left. In IS-LM-FE space, <strong>LM shifts left/up</strong> until the money market clears at the new full-employment output.`,
        button: "Start Over"
      }
    }
  },

  permneg: {
    maxStage: 8,
    stages: {
      0: {
        active: "labor",
        completed: [],
        reveal: [],
        text: `Press <strong>Begin</strong> to start. This shock is a <strong>permanent decrease in A</strong>: both <strong>Aₜ</strong> and <strong>Aₜ₊₁</strong> fall.`,
        button: "Begin"
      },
      1: {
        active: "labor",
        completed: [],
        reveal: ["labor-permneg"],
        text: `<strong>Labor Market:</strong> Labor demand shifts <strong>left a lot</strong> because productivity is lower today and in the future. In this setup, labor supply also shifts <strong>slightly right</strong>. Because worker expect a lower future income in the furture. This is a negative income effect (worker wants to work more feeling poorer). Overall, employment falls, and the real wage falls.`,
        button: "Next"
      },
      2: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-permneg", "prod-permneg-link"],
        text: `<strong>Production Function, Step 1:</strong> Carry the lower full-employment labor level <strong>L′</strong> from the labor market into the production function.`,
        button: "Next"
      },
      3: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-permneg", "prod-permneg-link", "prod-permneg-curve"],
        text: `<strong>Production Function, Step 2:</strong> Because productivity is lower today and in the future, the production function shifts <strong>down</strong>.`,
        button: "Next"
      },
      4: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-permneg", "prod-permneg-link", "prod-permneg-curve", "prod-permneg", "fe-permneg", "is-permneg-y", "lm-permneg-y"],
        text: `<strong>Production Function, Step 3:</strong> Full-employment output falls a lot, so <strong>FE shifts left</strong>. This creates a movement along the old IS curve and along the old LM curve to the lower Y-value.`,
        button: "Next"
      },
      5: {
        active: "goods",
        completed: ["labor", "production"],
        reveal: ["labor-permneg", "prod-permneg-link", "prod-permneg-curve", "prod-permneg", "fe-permneg", "goods-permneg", "goods-permneg-i", "lm-permneg-y", "is-permneg-point", "is-permneg"],
        text: `<strong>Goods Market:</strong> In this setup, desired saving stays about the same. But investment demand shifts <strong>left a lot</strong> because expected future MPK falls. So the goods market determines a lower real interest rate <strong>r′</strong>.`,
        button: "Next"
      },
      6: {
        active: "money",
        completed: ["labor", "production", "goods"],
        reveal: ["labor-permneg", "prod-permneg-link", "prod-permneg-curve", "prod-permneg", "fe-permneg", "goods-permneg", "goods-permneg-i", "lm-permneg-y", "is-permneg-point", "is-permneg", "money-permneg-rate"],
        text: `<strong>Money Market, Step 1:</strong> Bring the lower real interest rate <strong>r′</strong> from the goods market into the money market.`,
        button: "Next"
      },
      7: {
        active: "money",
        completed: ["labor", "production", "goods"],
        reveal: ["labor-permneg", "prod-permneg-link", "prod-permneg-curve", "prod-permneg", "fe-permneg", "goods-permneg", "goods-permneg-i", "lm-permneg-y", "is-permneg-point", "is-permneg", "money-permneg-rate", "money-permneg-md", "money-permneg-point"],
        text: `<strong>Money Market, Step 2:</strong> In this stylized version, money demand falls overall because output is lower. So <strong>L(Y, r + πᵉ)</strong> shifts left.`,
        button: "Next"
      },
      8: {
        active: null,
        completed: ["labor", "production", "goods", "money"],
        reveal: ["labor-permneg", "prod-permneg-link", "prod-permneg-curve", "prod-permneg", "fe-permneg", "goods-permneg", "goods-permneg-i", "is-permneg", "money-permneg-rate", "money-permneg-md", "money-permneg-adjust", "lm-permneg"],
        text: `<strong>Money Market, Step 3:</strong> In this version, the price level falls enough that real money balances <strong>M/P</strong> rise, so the vertical <strong>MS/P</strong> line shifts right. In IS-LM-FE space, <strong>LM shifts right/down</strong> until the money market clears at the new full-employment output.`,
        button: "Start Over"
      }
    }
  },

  kdrop: {
    maxStage: 10,
    stages: {
      0: {
        active: "labor",
        completed: [],
        reveal: [],
        text: `Press <strong>Begin</strong> to start. This shock is a <strong>temporary destruction of current capital</strong>: <strong>Kₜ</strong> decreases.`,
        button: "Begin"
      },
      1: {
        active: "labor",
        completed: [],
        reveal: [],
        text: `<strong>Labor Market, Step 1:</strong> Labor supply is <strong>not affected</strong>. The household side does not shift the labor supply curve here.`,
        button: "Next"
      },
      2: {
        active: "labor",
        completed: [],
        reveal: ["labor-kdrop"],
        text: `<strong>Labor Market, Step 2:</strong> Because current capital <strong>K_t</strong> is lower, the marginal product of labor falls. So <strong>labor demand shifts left</strong>. Employment falls, and the real wage falls.`,
        button: "Next"
      },
      3: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-kdrop", "prod-kdrop-link"],
        text: `<strong>Production Function, Step 1:</strong> Carry the lower full-employment labor level <strong>L′</strong> from the labor market into the production function.`,
        button: "Next"
      },
      4: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-kdrop", "prod-kdrop-link", "prod-kdrop-curve"],
        text: `<strong>Production Function, Step 2:</strong> Because current capital is lower, the production function shifts <strong>down</strong>.`,
        button: "Next"
      },
      5: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-kdrop", "prod-kdrop-link", "prod-kdrop-curve", "prod-kdrop", "fe-kdrop", "is-kdrop-y", "lm-kdrop-y"],
        text: `<strong>Production Function, Step 3:</strong> With lower labor and a lower production function, output falls even more. So <strong>FE shifts left</strong>. This creates a movement along the old IS curve and along the old LM curve to the lower Y-value.`,
        button: "Next"
      },
      6: {
        active: "goods",
        completed: ["labor", "production"],
        reveal: ["labor-kdrop", "prod-kdrop-link", "prod-kdrop-curve", "prod-kdrop", "fe-kdrop", "goods-kdrop-s", "lm-kdrop-y"],
        text: `<strong>Goods Market, Step 1:</strong> Because current output falls, desired saving falls. So the <strong>saving curve shifts left</strong>.`,
        button: "Next"
      },
      7: {
        active: "goods",
        completed: ["labor", "production"],
        reveal: ["labor-kdrop", "prod-kdrop-link", "prod-kdrop-curve", "prod-kdrop", "fe-kdrop", "goods-kdrop-s", "goods-kdrop-i", "goods-kdrop", "lm-kdrop-y", "is-kdrop-point", "is-kdrop"],
        text: `<strong>Goods Market, Step 2:</strong> Investment demand shifts <strong>right a lot</strong> because firms want to rebuild capital. With saving lower and investment demand higher, the goods market determines a higher real interest rate <strong>r′</strong>.`,
        button: "Next"
      },
      8: {
        active: "money",
        completed: ["labor", "production", "goods"],
        reveal: ["labor-kdrop", "prod-kdrop-link", "prod-kdrop-curve", "prod-kdrop", "fe-kdrop", "goods-kdrop-s", "goods-kdrop-i", "goods-kdrop", "lm-kdrop-y", "is-kdrop-point", "is-kdrop", "money-kdrop-rate"],
        text: `<strong>Money Market, Step 1:</strong> Bring the higher real interest rate <strong>r′</strong> from the goods market into the money market.`,
        button: "Next"
      },
      9: {
        active: "money",
        completed: ["labor", "production", "goods"],
        reveal: ["labor-kdrop", "prod-kdrop-link", "prod-kdrop-curve", "prod-kdrop", "fe-kdrop", "goods-kdrop-s", "goods-kdrop-i", "goods-kdrop", "lm-kdrop-y", "is-kdrop-point", "is-kdrop", "money-kdrop-rate", "money-kdrop-md", "money-kdrop-point"],
        text: `<strong>Money Market, Step 2:</strong> Because output is lower, money demand also falls. So <strong>L(Y, r + πᵉ)</strong> shifts left. Aₜ the interest rate <strong>r′</strong> from the goods market, the economy moves to the new money-demand point.`,
        button: "Next"
      },
      10: {
        active: null,
        completed: ["labor", "production", "goods", "money"],
        reveal: ["labor-kdrop", "prod-kdrop-link", "prod-kdrop-curve", "prod-kdrop", "fe-kdrop", "goods-kdrop-s", "goods-kdrop-i", "goods-kdrop", "is-kdrop", "money-kdrop-rate", "money-kdrop-md", "money-kdrop-adjust", "lm-kdrop"],
        text: `<strong>Money Market, Step 3:</strong> The price level rises, so real money balances <strong>M/P</strong> fall until the money market clears. The final equilibrium is where <strong>IS′</strong>, <strong>LM′</strong>, and <strong>FE′</strong> intersect.`,
        button: "Start Over"
      }
    }
  },

  fiscal: {
    maxStage: 8,
    stages: {
      0: {
        active: "labor",
        completed: [],
        reveal: [],
        text: `Press <strong>Begin</strong> to start. This shock is <strong>expansionary fiscal policy: G1 rises and is financed by T1</strong>.`,
        button: "Begin"
      },
      1: {
        active: "labor",
        completed: [],
        reveal: ["labor-fiscal"],
        text: `<strong>Labor Market:</strong> Higher current lump-sum taxes create a <strong>negative income effect</strong>, so labor supply shifts slightly to the right. Labor demand does not change, so employment rises a little.`,
        button: "Next"
      },
      2: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-fiscal", "prod-fiscal-link"],
        text: `<strong>Production Function, Step 1:</strong> Carry the slightly higher full-employment labor level <strong>L′</strong> from the labor market into the production function.`,
        button: "Next"
      },
      3: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-fiscal", "prod-fiscal-link"],
        text: `<strong>Production Function, Step 2:</strong> Productivity does not change, so the production function itself does <strong>not</strong> shift.`,
        button: "Next"
      },
      4: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-fiscal", "prod-fiscal-link", "prod-fiscal", "fe-fiscal", "is-fiscal-y", "lm-fiscal-y"],
        text: `<strong>Production Function, Step 3:</strong> Because labor rises a little, full-employment output also rises a little. So <strong>FE shifts slightly right</strong>. This creates a movement along the old IS curve and along the old LM curve to the new Y-value.`,
        button: "Next"
      },
      5: {
        active: "goods",
        completed: ["labor", "production"],
        reveal: ["labor-fiscal", "prod-fiscal-link", "prod-fiscal", "fe-fiscal", "goods-fiscal", "lm-fiscal-y", "is-fiscal-point", "is-fiscal"],
        text: `<strong>Goods Market:</strong> Even though output rises a little, government spending rises by more, so desired saving <strong>falls overall</strong>. The saving curve shifts left visibly, and at the new full-employment output the goods market determines a higher real interest rate <strong>r′</strong>.`,
        button: "Next"
      },
      6: {
        active: "money",
        completed: ["labor", "production", "goods"],
        reveal: ["labor-fiscal", "prod-fiscal-link", "prod-fiscal", "fe-fiscal", "goods-fiscal", "lm-fiscal-y", "is-fiscal-point", "is-fiscal", "money-fiscal-rate"],
        text: `<strong>Money Market, Step 1:</strong> Bring the higher real interest rate <strong>r′</strong> from the goods market into the money market.`,
        button: "Next"
      },
      7: {
        active: "money",
        completed: ["labor", "production", "goods"],
        reveal: ["labor-fiscal", "prod-fiscal-link", "prod-fiscal", "fe-fiscal", "goods-fiscal", "lm-fiscal-y", "is-fiscal-point", "is-fiscal", "money-fiscal-rate", "money-fiscal-md", "money-fiscal-point"],
        text: `<strong>Money Market, Step 2:</strong> Because output rises a little, money demand also rises a little. So <strong>L(Y, r + πᵉ)</strong> shifts slightly right. Aₜ that same interest rate <strong>r′</strong> from the goods market, the economy moves to the new money-demand point.`,
        button: "Next"
      },
      8: {
        active: null,
        completed: ["labor", "production", "goods", "money"],
        reveal: ["labor-fiscal", "prod-fiscal-link", "prod-fiscal", "fe-fiscal", "goods-fiscal", "is-fiscal", "money-fiscal-rate", "money-fiscal-md", "money-fiscal-adjust", "lm-fiscal"],
        text: `<strong>Money Market, Step 3:</strong> The price level rises. That lowers <strong>M/P</strong>, so real money supply shifts left until the money market clears at the same interest rate <strong>r′</strong> determined in the goods market.`,
        button: "Start Over"
      }
    }
  },

  taxcut: {
    maxStage: 8,
    stages: {
      0: {
        active: "labor",
        completed: [],
        reveal: [],
        text: `Press <strong>Begin</strong> to start. This shock is <strong>expansionary fiscal policy: current tax T₁ decreases, and Ricardian equivalence does not hold</strong>.`,
        button: "Begin"
      },
      1: {
        active: "labor",
        completed: [],
        reveal: ["labor-taxcut"],
        text: `<strong>Labor Market:</strong> Because households perceive a tax cut as higher current resources, they want more current consumption and more leisure. So <strong>labor supply shifts left</strong>. Labor demand does not change, so employment falls and the real wage rises.`,
        button: "Next"
      },
      2: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-taxcut", "prod-taxcut-link"],
        text: `<strong>Production Function, Step 1:</strong> Carry the lower full-employment labor level <strong>L′</strong> from the labor market into the production function.`,
        button: "Next"
      },
      3: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-taxcut", "prod-taxcut-link"],
        text: `<strong>Production Function, Step 2:</strong> Productivity does not change, so the production function itself does <strong>not</strong> shift.`,
        button: "Next"
      },
      4: {
        active: "production",
        completed: ["labor"],
        reveal: ["labor-taxcut", "prod-taxcut-link", "prod-taxcut", "fe-taxcut", "is-taxcut-y", "lm-taxcut-y"],
        text: `<strong>Production Function, Step 3:</strong> Because labor falls, full-employment output also falls. So <strong>FE shifts left</strong>. This creates a movement along the old IS curve and along the old LM curve to the lower Y-value.`,
        button: "Next"
      },
      5: {
        active: "goods",
        completed: ["labor", "production"],
        reveal: ["labor-taxcut", "prod-taxcut-link", "prod-taxcut", "fe-taxcut", "goods-taxcut", "lm-taxcut-y", "is-taxcut-point", "is-taxcut"],
        text: `<strong>Goods Market:</strong> Because Ricardian equivalence does not hold, the tax cut raises current consumption and lowers desired saving. So the saving curve shifts left, and at the new full-employment output the goods market determines a higher real interest rate <strong>r′</strong>.`,
        button: "Next"
      },
      6: {
        active: "money",
        completed: ["labor", "production", "goods"],
        reveal: ["labor-taxcut", "prod-taxcut-link", "prod-taxcut", "fe-taxcut", "goods-taxcut", "lm-taxcut-y", "is-taxcut-point", "is-taxcut", "money-taxcut-rate"],
        text: `<strong>Money Market, Step 1:</strong> Bring the higher real interest rate <strong>r′</strong> from the goods market into the money market.`,
        button: "Next"
      },
      7: {
        active: "money",
        completed: ["labor", "production", "goods"],
        reveal: ["labor-taxcut", "prod-taxcut-link", "prod-taxcut", "fe-taxcut", "goods-taxcut", "lm-taxcut-y", "is-taxcut-point", "is-taxcut", "money-taxcut-rate", "money-taxcut-md", "money-taxcut-point"],
        text: `<strong>Money Market, Step 2:</strong> Because output is lower, money demand also falls. So <strong>L(Y, r + πᵉ)</strong> shifts slightly left. At that same interest rate <strong>r′</strong> from the goods market, the economy moves to the new money-demand point.`,
        button: "Next"
      },
      8: {
        active: null,
        completed: ["labor", "production", "goods", "money"],
        reveal: ["labor-taxcut", "prod-taxcut-link", "prod-taxcut", "fe-taxcut", "goods-taxcut", "is-taxcut", "money-taxcut-rate", "money-taxcut-md", "money-taxcut-adjust", "lm-taxcut"],
        text: `<strong>Money Market, Step 3:</strong> The price level rises. That lowers <strong>M/P</strong>, so real money supply shifts left until the money market clears at the same higher interest rate <strong>r′</strong> determined in the goods market. The final equilibrium is where <strong>IS′</strong>, <strong>LM′</strong>, and <strong>FE′</strong> intersect.`,
        button: "Start Over"
      }
    }
  }
};

function updatePrevButton() {
  prevBtn.disabled = currentStage === 0;
}

function goToStage(stage) {
  currentStage = stage;
  resetVisualsOnly();

  const spec = SHOCKS[currentShock].stages[stage];
  spec.reveal.forEach(revealGroup);
  setPanelStates(spec.active, spec.completed);
  explanationText.innerHTML = spec.text;
  nextBtn.textContent = spec.button;
  updatePrevButton();
}

nextBtn.addEventListener("click", () => {
  if (currentStage < SHOCKS[currentShock].maxStage) {
    goToStage(currentStage + 1);
  } else {
    goToStage(0);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentStage > 0) {
    goToStage(currentStage - 1);
  }
});

resetBtn.addEventListener("click", () => {
  goToStage(0);
});

shockSelect.addEventListener("change", (e) => {
  currentShock = e.target.value;
  goToStage(0);
});

createProductionGraph();
goToStage(0);
