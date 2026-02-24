const checkoutKeywords = [
  "checkout",
  "cart",
  "payment",
  "buy",
  "billing",
  "confirm"
];

function isCheckoutPage() {
  const url = window.location.href.toLowerCase();
  return checkoutKeywords.some(word => url.includes(word));
}
// -------- Categorized Prompts --------

// Psychological (individual behavior & emotion)
const psychologyPrompts = [
  "Are you buying from emotion or intention?",
  "Would you still want this tomorrow?",
  "Is this impulse or planned?",
  "Are you rewarding stress with spending?",
  "Is this boredom or real need?",
  "Would you feel the same about this in 24 hours?"
];

// Sociological (social pressure & cultural influence)
const sociologyPrompts = [
  "Is this influenced by trends or social pressure?",
  "Would you buy this if no one else saw it?",
  "Are you keeping up with someone?",
  "Is this purchase about identity or utility?",
  "Does this reflect your values or outside expectations?",
  "Is marketing influencing this decision?"
];

// Financial / Opportunity cost prompts
const financialPrompts = [
  "What long-term goal could this support instead?",
  "Is this aligned with your financial plan?",
  "Would investing this serve you better?",
  "What are you giving up to afford this?",
  "Does this move you toward financial freedom?"
];
// -------- Financial Literacy Micro-Lessons --------

const microLessons = [
  "Small purchases compound over time.",
  "Every dollar spent is a dollar not invested.",
  "Delayed gratification builds long-term wealth.",
  "Investing consistently matters more than timing the market.",
  "Impulse spending reduces future financial flexibility.",
  "Money decisions today shape financial freedom tomorrow.",
  "Budgeting isn't restriction — it's intentional allocation.",
  "High-return habits beat high-risk bets.",
  "Wealth grows quietly through discipline.",
  "Opportunity cost is the true price of a purchase."
];

function getRandomMicroLesson() {
  return microLessons[Math.floor(Math.random() * microLessons.length)];
}

// -------- Investment Logic --------

function calculateFutureValue(price, rate = 0.07, years = 10) {
  return price * Math.pow((1 + rate), years);
}

function extractPrice() {
  const priceElement = document.querySelector('[class*="price"], [id*="price"]');
  if (!priceElement) return null;

  const priceText = priceElement.innerText;
  const match = priceText.match(/[\d,.]+/);

  if (!match) return null;

  return parseFloat(match[0].replace(/,/g, ""));
}

function generateInvestmentPrompt() {
  const price = extractPrice();
  if (!price) {
    return "Is this purchase aligned with your financial goals?";
  }

  const futureValue = calculateFutureValue(price);

  return `If invested at 7% for 10 years, $${price.toFixed(2)} could become $${futureValue.toFixed(2)}.`;
}

// -------- Overlay --------

function createOverlay() {
  if (document.getElementById("SpendSave-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "SpendSave-overlay";

  overlay.innerHTML = `
  <div class="pause-box">
    <h2>SpendSave</h2>

    <p>${generateInvestmentPrompt()}</p>

    <p style="margin-top:10px;">
      ${getMixedPrompt()}
    </p>

    <p style="font-size:12px; color:gray; margin-top:8px;">
      💡 ${getRandomMicroLesson()}
    </p>

    <label>
      <input type="radio" name="type" value="need"> Need
    </label>

    <label>
      <input type="radio" name="type" value="want"> Want
    </label>

    <br><br>

    <label>
      <input type="checkbox" id="wait"> Wait 24 hours?
    </label>

    <br><br>

    <button id="saveDecision">Save Decision</button>
  </div>
`;

  document.body.appendChild(overlay);

  document.getElementById("saveDecision").onclick = saveDecision;
 
}
function getSmartCategoryPrompt() {
  const hour = new Date().getHours();

  if (hour >= 22 || hour <= 5) {
    return psychologyPrompts[Math.floor(Math.random() * psychologyPrompts.length)];
  }

  if (hour >= 17 && hour <= 21) {
    return sociologyPrompts[Math.floor(Math.random() * sociologyPrompts.length)];
  }

  return financialPrompts[Math.floor(Math.random() * financialPrompts.length)];
}
function getMixedPrompt() {
  const categories = [
    psychologyPrompts,
    sociologyPrompts,
    financialPrompts
  ];

  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];

  return randomCategory[
    Math.floor(Math.random() * randomCategory.length)
  ];
}

// -------- Save Logic --------

function saveDecision() {
  const type = document.querySelector('input[name="type"]:checked')?.value;
  const wait = document.getElementById("wait")?.checked;

  const decision = {
    type,
    wait,
    time: new Date().toISOString(),
    url: window.location.href
  };

  chrome.storage.local.get(["decisions"], (result) => {
    const decisions = result.decisions || [];
    decisions.push(decision);
    chrome.storage.local.set({ decisions });
  });

  document.getElementById("SpendSave-overlay")?.remove();
}
// -------- Trigger --------

if (isCheckoutPage()) {
  setTimeout(createOverlay, 1500);
}