let drinks = [];
let pees = [];
let ranges = [];
let notes = {};
let selectedDay = new Date();

const drinkButtonsValues = [100, 250, 500];
const peeButtonsValues = [100, 200, 300];

// ===== DATA =====
function saveData() {
  localStorage.setItem('drinks', JSON.stringify(drinks));
  localStorage.setItem('pees', JSON.stringify(pees));
  localStorage.setItem('ranges', JSON.stringify(ranges));
  localStorage.setItem('notes', JSON.stringify(notes));
}

function loadData() {
  drinks = JSON.parse(localStorage.getItem('drinks') || '[]');
  pees = JSON.parse(localStorage.getItem('pees') || '[]');
  ranges = JSON.parse(localStorage.getItem('ranges') || '[]');
  notes = JSON.parse(localStorage.getItem('notes') || '{}');
}

// ===== DATE =====
function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function filterByDay(list) {
  return list.filter(e => e.date === formatDate(selectedDay));
}

// ===== ADD ENTRY =====
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

// ===== BUTTONS =====
function setupButtons() {
  const drinkDiv = document.getElementById('drink-buttons');
  drinkButtonsValues.forEach(v => {
    const btn = document.createElement('button');
    btn.textContent = v + ' ml';
    btn.onclick = () => addEntry(drinks, v);
    drinkDiv.appendChild(btn);
  });

  const peeDiv = document.getElementById('pee-buttons');
  peeButtonsValues.forEach(v => {
    const btn = document.createElement('button');
    btn.textContent = v + ' ml';
    btn.onclick = () => addEntry(pees, v);
    peeDiv.appendChild(btn);
  });
}

// ===== CUSTOM INPUT =====
document.getElementById('drink-custom-btn').onclick = () => {
  const val = parseInt(document.getElementById('drink-custom').value);
  if (val > 0) addEntry(drinks, val);
};

document.getElementById('pee-custom-btn').onclick = () => {
  const val = parseInt(document.getElementById('pee-custom').value);
  if (val > 0) addEntry(pees, val);
};

// ===== DAY NAV =====
document.getElementById('prev-day').onclick = () => {
  selectedDay.setDate(selectedDay.getDate() - 1);
  updateUI();
};

document.getElementById('next-day').onclick = () => {
  selectedDay.setDate(selectedDay.getDate() + 1);
  updateUI();
};

// ===== NOTES =====
const notesEl = document.getElementById('notes');

notesEl.oninput = () => {
  notes[formatDate(selectedDay)] = notesEl.value;
  saveData();
};

// ===== RANGES =====
document.getElementById('add-range').onclick = () => {
  const start = document.getElementById('new-range-start').value;
  const end = document.getElementById('new-range-end').value;
  if (!start || !end) return;

  ranges.push({ start, end });
  saveData();
  updateUI();
};

// ===== UI =====
function updateUI() {
  document.getElementById('current-day').innerText = formatDate(selectedDay);

  // PICIE
  let drinkSum = 0;
  const drinkList = document.getElementById('drink-list');
  drinkList.innerHTML = '';

  filterByDay(drinks).forEach(e => {
    drinkSum += e.amount;

    const li = document.createElement('li');
    li.textContent = `${e.amount} ml (${e.time})`;

    const btn = document.createElement('button');
    btn.textContent = '❌';
    btn.onclick = () => {
      drinks.splice(drinks.indexOf(e), 1);
      saveData();
      updateUI();
    };

    li.appendChild(btn);
    drinkList.appendChild(li);
  });

  document.getElementById('drink-total').textContent = drinkSum;

  // MOCZ
  let peeSum = 0;
  const peeList = document.getElementById('pee-list');
  peeList.innerHTML = '';

  filterByDay(pees).forEach(e => {
    peeSum += e.amount;

    const li = document.createElement('li');
    li.textContent = `${e.amount} ml (${e.time})`;

    const btn = document.createElement('button');
    btn.textContent = '❌';
    btn.onclick = () => {
      pees.splice(pees.indexOf(e), 1);
      saveData();
      updateUI();
    };

    li.appendChild(btn);
    peeList.appendChild(li);
  });

  document.getElementById('pee-total').textContent = peeSum;

  // NOTATKI
  notesEl.value = notes[formatDate(selectedDay)] || '';

  // ZAKRESY
  const rangesList = document.getElementById('ranges-list');
  rangesList.innerHTML = '';

  const sum = arr => arr.reduce((a, b) => a + b.amount, 0);

  ranges.forEach((range, i) => {
    const [sh, sm] = range.start.split(':').map(Number);
    const [eh, em] = range.end.split(':').map(Number);

    const inRange = (e) => {
      const [h, m] = e.time.split(':').map(Number);
      return (h > sh || (h === sh && m >= sm)) &&
             (h < eh || (h === eh && m <= em));
    };

    const d = filterByDay(drinks).filter(inRange);
    const p = filterByDay(pees).filter(inRange);

    const li = document.createElement('li');
    li.innerHTML = `
      ${range.start}-${range.end} |
      💧 ${sum(d)} ml |
      🚽 ${sum(p)} ml
    `;

    const btn = document.createElement('button');
    btn.textContent = '❌';
    btn.onclick = () => {
      ranges.splice(i, 1);
      saveData();
      updateUI();
    };

    li.appendChild(btn);
    rangesList.appendChild(li);
  });
}

// ===== INIT =====
loadData();
setupButtons();
updateUI();
