// ==========================
// Zmienne i ustawienia
// ==========================
let drinks = [];
let pees = [];
let selectedDay = new Date();

const drinkButtonsValues = [100, 250, 500];
const peeButtonsValues = [100, 200, 300];

// ==========================
// Funkcje zapisu i odczytu
// ==========================
function saveData() {
  localStorage.setItem('drinks', JSON.stringify(drinks));
  localStorage.setItem('pees', JSON.stringify(pees));
}

function loadData() {
  drinks = JSON.parse(localStorage.getItem('drinks') || '[]');
  pees = JSON.parse(localStorage.getItem('pees') || '[]');
}

// ==========================
// Formatowanie daty
// ==========================
function formatDate(d) {
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

function filterByDay(list) {
  return list.filter(e => e.date === formatDate(selectedDay));
}

// ==========================
// Aktualizacja UI
// ==========================
function updateUI() {
  document.getElementById('current-day').innerText = formatDate(selectedDay);

  // --- Picie ---
  const drinkListEl = document.getElementById('drink-list');
  const drinkTotalEl = document.getElementById('drink-total');
  const dayDrinks = filterByDay(drinks);
  drinkListEl.innerHTML = '';
  let drinkSum = 0;
  dayDrinks.forEach((e) => {
    drinkSum += e.amount;
    const li = document.createElement('li');
    li.textContent = `${e.amount} ml - ${e.time}`;
    const btn = document.createElement('button');
    btn.textContent = '🗑️';
    btn.onclick = () => {
      drinks.splice(drinks.indexOf(e), 1);
      saveData();
      updateUI();
    };
    li.appendChild(btn);
    drinkListEl.appendChild(li);
  });
  drinkTotalEl.textContent = drinkSum;

  // --- Mocz ---
  const peeListEl = document.getElementById('pee-list');
  const peeTotalEl = document.getElementById('pee-total');
  const dayPees = filterByDay(pees);
  peeListEl.innerHTML = '';
  let peeSum = 0;
  dayPees.forEach((e) => {
    peeSum += e.amount;
    const li = document.createElement('li');
    li.textContent = `${e.amount} ml - ${e.time}`;
    const btn = document.createElement('button');
    btn.textContent = '🗑️';
    btn.onclick = () => {
      pees.splice(pees.indexOf(e), 1);
      saveData();
      updateUI();
    };
    li.appendChild(btn);
    peeListEl.appendChild(li);
  });
  peeTotalEl.textContent = peeSum;
}

// ==========================
// Dodawanie wpisów
// ==========================
function addEntry(list, amount) {
  const now = new Date();
  list.push({
    amount,
    date: formatDate(selectedDay),
    time: now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0')
  });
  saveData();
  updateUI();
}

// ==========================
// Tworzenie przycisków domyślnych
// ==========================
function setupButtons() {
  const drinkBtnContainer = document.getElementById('drink-buttons');
  drinkButtonsValues.forEach(v => {
    const btn = document.createElement('button');
    btn.textContent = v + ' ml';
    btn.onclick = () => addEntry(drinks, v);
    drinkBtnContainer.appendChild(btn);
  });

  const peeBtnContainer = document.getElementById('pee-buttons');
  peeButtonsValues.forEach(v => {
    const btn = document.createElement('button');
    btn.textContent = v + ' ml';
    btn.onclick = () => addEntry(pees, v);
    peeBtnContainer.appendChild(btn);
  });
}

// ==========================
// Dodawanie własnych wartości
// ==========================
document.getElementById('drink-custom-btn').onclick = () => {
  const val = parseInt(document.getElementById('drink-custom').value);
  if (val > 0) addEntry(drinks, val);
  document.getElementById('drink-custom').value = '';
};

document.getElementById('pee-custom-btn').onclick = () => {
  const val = parseInt(document.getElementById('pee-custom').value);
  if (val > 0) addEntry(pees, val);
  document.getElementById('pee-custom').value = '';
};

// ==========================
// Nawigacja między dniami
// ==========================
document.getElementById('prev-day').onclick = () => {
  selectedDay.setDate(selectedDay.getDate() - 1);
  updateUI();
};

document.getElementById('next-day').onclick = () => {
  selectedDay.setDate(selectedDay.getDate() + 1);
  updateUI();
};

// ==========================
// Inicjalizacja
// ==========================
loadData();
setupButtons();
updateUI();