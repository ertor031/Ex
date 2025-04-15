const cryptoData = [
  { name: "Bitcoin", symbol: "BTC", icon: "cryptoImg/bitcoin-btc-logo.png", alt:"BTC", dataCode: "BTC",dataTitle: "Bitcoin", dataName: "Bitcoin (BTC)" },
  { name: "Ethereum", symbol: "ETH", icon: "cryptoImg/ethereum-eth-logo.png" },
  { name: "Cardano", symbol: "ADA", icon: "cryptoImg/cardano-ada-logo.png", alt:"ADA", dataCode: "ADA",dataTitle: "Cardano", dataName: "Cardano (ADA)" },
  { name: "Tether", symbol: "USDT", icon: "cryptoImg/tether-usdt-logo.png" }
];

const allowedPairs = {
  BTC: ["ETH", "USDT"],
  ETH: ["BTC", "ADA"],
  ADA: ["ETH"],
  USDT: ["BTC"]
};

const selected1 = document.getElementById("selected1");
const dropdown1 = document.getElementById("dropdown1");
const list1 = document.getElementById("list1");
const search1 = document.getElementById("search1");

const selected2 = document.getElementById("selected2");
const dropdown2 = document.getElementById("dropdown2");
const list2 = document.getElementById("list2");
const search2 = document.getElementById("search2");

let selectedSymbol1 = "BTC";
let selectedSymbol2 = allowedPairs[selectedSymbol1][0] || "ETH";
let currentRate = 0;

const u_send = document.getElementById("u_send");
const u_receive = document.getElementById("u_receive");
const rate1 = document.getElementById("rate1");
const rate2 = document.getElementById("rate2");

function fetchRate(from, to) {
  const url = `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`;
  return fetch(url).then(res => res.json()).then(data => data[to]);
}


async function updateConversion(fromInputChanged = true, updateOnlyRates = false) {
  if (!selectedSymbol2) return;

  currentRate = await fetchRate(selectedSymbol1, selectedSymbol2);

  // Обновляем курсы в USD
  rate1.textContent = `${selectedSymbol1} ($${(await fetchRate(selectedSymbol1, "USD")).toFixed(2)})`;
  rate2.textContent = `${selectedSymbol2} ($${(await fetchRate(selectedSymbol2, "USD")).toFixed(2)})`;

  const amount1 = parseFloat(u_send.value);
  const amount2 = parseFloat(u_receive.value);

  if (fromInputChanged) {
    if (!isNaN(amount1)) {
      u_receive.value = (amount1 * currentRate).toFixed(2);
    }
  } else {
    if (!isNaN(amount2)) {
      u_send.value = (amount2 / currentRate).toFixed(2);
    }
  }

  // При автообновлении тоже пересчитываем input2
  if (updateOnlyRates && !isNaN(amount1)) {
    u_receive.value = (amount1 * currentRate).toFixed(2);
  }
}




u_send.addEventListener("input", () => updateConversion(true));
u_receive.addEventListener("input", () => updateConversion(false));
function renderList(listElement, searchInput, data, onClick) {
  listElement.innerHTML = '';
  const filtered = data.filter(item =>
    item.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.symbol.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  filtered.forEach(item => {
    const div = document.createElement("div");
    div.className = "crypto-item";
    div.innerHTML = `<img src="${item.icon}">${item.name} (${item.symbol})`;
    div.onclick = () => onClick(item);
    listElement.appendChild(div);
  });
}

// Initial rendering
renderList(list1, search1, cryptoData, handleSelect1);
renderList(list2, search2, cryptoData.filter(c => allowedPairs[selectedSymbol1].includes(c.symbol)), handleSelect2);

// Toggle dropdowns
selected1.onclick = () => dropdown1.classList.toggle("show");
selected2.onclick = () => dropdown2.classList.toggle("show");

// Close dropdowns on outside click
document.addEventListener("click", e => {
  if (!document.getElementById("wrapper1").contains(e.target)) dropdown1.classList.remove("show");
  if (!document.getElementById("wrapper2").contains(e.target)) dropdown2.classList.remove("show");
});

// Live search
search1.addEventListener("input", () => renderList(list1, search1, cryptoData, handleSelect1));
search2.addEventListener("input", () => {
  const filtered = cryptoData.filter(c => allowedPairs[selectedSymbol1].includes(c.symbol));
  renderList(list2, search2, filtered, handleSelect2);
});

// Select 1 handler
function handleSelect1(item) {
  selectedSymbol1 = item.symbol;
  selected1.innerHTML = `<span id = "cr_send"><img   alt="${item.alt}" data-code="${item.dataCode}" data-title="${item.dataTitle}" data-name="${item.dataName}" src="${item.icon}">${item.symbol}</span><span>&#9660;</span>`;
  dropdown1.classList.remove("show");
  search1.value = '';
  renderList(list1, search1, cryptoData, handleSelect1);

  // Update select 2
  const allowed = allowedPairs[selectedSymbol1] || [];
    const filtered = cryptoData.filter(c => allowed.includes(c.symbol));
    selectedSymbol2 = allowed[0]; // устанавливаем первую разрешённую
    selected2.innerHTML = `<span>Select</span><span>&#9660;</span>`;
    renderList(list2, search2, filtered, handleSelect2);
    updateConversion(true);
}

// Select 2 handler
function handleSelect2(item) {
  selectedSymbol2 = item.symbol; // <== ЭТО ДОБАВИЛ
  selected2.innerHTML = `<span id = "cr_receive"><img alt="${item.alt}" data-code="${item.dataCode}" data-title="${item.dataTitle}" data-name="${item.dataName}" src="${item.icon}">${item.symbol}</span><span>&#9660;</span>`;
  dropdown2.classList.remove("show");
  search2.value = '';
  console.log(`Пара выбрана: ${selectedSymbol1}/${selectedSymbol2}`);
  updateConversion(true);
}

updateConversion(true);
// Запускаем автообновление курса каждые 15 секунд
setInterval(() => updateConversion(true, true), 3000);
