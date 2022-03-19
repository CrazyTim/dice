import * as util from './util.js';

const transformPositions = [
  {x: 0, y: 0, z: 0},
  {x: 90, y: 0, z: 0},
  {x: 0, y: -90, z: 0},
  {x: 0, y: 90, z: 0},
  {x: -90, y: 0, z: 0},
  {x: -180, y: 0, z: 0},
];

const transformOffsets = [ // Offsets that make the dice appear to spin randomly
    {x: 360, y: 360, z: 0},
    {x: 0, y: 360, z: 360},
    {x: 360, y: 0, z: 360},
];

const initialAppState = {
  dice: [{
    value: 6,
    rollCount: 24,
  }],
};

const newDieState = {
  value: 4,
  rollCount: 0,
};

const maxDice = 8;

const wrapper = document.querySelector('.dice-wrapper');
const body = document.querySelector('body');
const dieWrapperTemplate = document.querySelector('#die-wrapper-template');
const btnAdd = document.querySelector('button.add');
const btnRemove = document.querySelector('button.remove');
const dieWrapperSelector = '.die-wrapper:not(.removed)';

initalise();

function initalise() {
  btnAdd.addEventListener('click', addDie);
  btnRemove.addEventListener('click', removeLastDie);
  util.preventScreenLock();
  loadAppState();

  util.handleLongTouch(
    body,
    async e => {
      console.log('short touch')
      if (!e.target.classList.contains('die-wrapper') && e.target !== body) return;
      rollAllDice();
    },
    async e => {
      console.log('long touch')
      for (const el of e.path) {
        if(el.classList && el.classList.contains('die-wrapper')) {
          await rollDie(el.querySelector('.die'));
          saveAppState();
          break;
        }
      }
    },
    250
  );
}

function loadAppState() {
  console.log('load app state');
  const appState = JSON.parse(localStorage.getItem('state')) || initialAppState;
  appState.dice.forEach(diceState => addDie({
    ...diceState, 
    shouldSaveAppState: false, // Don't save twice.
  }));
}

function saveAppState() {
  console.log('save app state');
  const appState = {
    dice: [],
  }
  for (const el of wrapper.children) {
    const die = el.querySelector('.die');
    appState.dice.push({
      value: die.dataset.value,
      rollCount: die.dataset.rollCount,
    });
  }
  localStorage.setItem('state', JSON.stringify(appState));
}

async function rollAllDice() {
  const dice = document.querySelectorAll('.die');
  for (const die of dice) if (die.dataset.rolling === '1') return;

  const promises = [];
  for (const i of dice) {
    promises.push(rollDie(i));
  }
  await Promise.all(promises); // Wait until dice have finished rolling.
  
  saveAppState(); 
}

async function rollDie(die) {
  if (die.dataset.rolling === '1') return;
  die.dataset.rolling = 1;

  const rollValue = util.getRandomInt(0, 6) + 1;
  const cssTransform = calcTransformCss(rollValue, ++die.dataset.rollCount);

  await die.animate([{transform: cssTransform}], {
    delay: util.getRandomInt(0, 200), // Add a tiny varation.
    duration: 1000,
    easing: 'ease-out',
  }).finished;

  die.style.transform = cssTransform; // Preserve the effect after animation has finished.
  die.dataset.value = rollValue;
  die.dataset.rolling = 0;
}

function addDie({
  value = newDieState.value,
  rollCount = newDieState.rollCount,
  shouldSaveAppState = true,
} = {}) {
  const newDieWrapper = dieWrapperTemplate.content.cloneNode(true);
  const die = newDieWrapper.querySelector('.die');

  // Set die state:
  die.dataset.value = value;
  die.dataset.rollCount = rollCount;
  die.dataset.rolling = 0;
  die.style.transform = calcTransformCss(value, rollCount);

  wrapper.append(newDieWrapper);
  refreshUI()
  if (shouldSaveAppState) saveAppState();
}

async function removeLastDie() {
  const dieWrappers = wrapper.querySelectorAll(dieWrapperSelector);
  const dieWrapper = dieWrappers.item(dieWrappers.length - 1);
  dieWrapper.classList.add('removed');
  refreshUI();

  // HACK: CSS perspective is lost when applying opacity on the die, but works if we apply to each face
  dieWrapper.querySelectorAll('.die-face').forEach(i => {
    i.classList.add('die-face-hide');
  });

  const die = dieWrapper.querySelector('.transform-wrapper');
  await die.animate([
      {
        offset: .2,
        transform: 'translateZ(8rem) rotate3d(1, -1, 0, var(--base-rotate))',
      },
      {
        transform: 'translateZ(-20rem) rotate3d(1, -1, 0, var(--base-rotate))',
      }
    ], {
    duration: 200,
    easing: 'linear',
  }).finished;

  die.style.opacity = 0; // Preserve the effect after animation has finished.

  dieWrapper.remove();
  saveAppState();
}

function refreshUI() {
  const dieCount = wrapper.querySelectorAll(dieWrapperSelector).length;
  if (dieCount <= 1) {
    btnRemove.disabled = true;
    btnRemove.classList.add('disabled');
  } else {
    btnRemove.disabled = false;
    btnRemove.classList.remove('disabled');
  }
  if (dieCount >= maxDice) {
    btnAdd.disabled = true;
    btnAdd.classList.add('disabled');
  } else {
    btnAdd.disabled = false;
    btnAdd.classList.remove('disabled');
  }
}

function calcTransformCss(rollValue, rollCount) {
  const pos = transformPositions[rollValue - 1];
  const off = transformOffsets[rollCount % transformOffsets.length];
  const x = pos.x + off.x;
  const y = pos.y + off.y;
  const z = pos.z + off.z;
  return `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
}
