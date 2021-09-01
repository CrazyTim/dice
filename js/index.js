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

const maxDice = 8;

const wrapper = document.querySelector('.dice-wrapper');
const body = document.querySelector('body');
const dieTemplate = document.querySelector('#die-template');
const btnAdd = document.querySelector('button.add');
const btnRemove = document.querySelector('button.remove');
const dieWrapperSelector = '.die-wrapper:not(.removed)';

body.addEventListener('click', async e => {
  if (e.target !== body) return;

  const dice = document.querySelectorAll('.die');
  for (const die of dice) if (die.dataset.rolling === '1') return;

  dice.forEach(async (die) => {
    die.dataset.rolling = 1;
    const roll = getRandomInt(0, 6);
    const {x, y, z} = calcTransform(roll, ++die.dataset.rollCount);
    const transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;

    await die.animate([{transform}], {
      delay: getRandomInt(0, 200), // Add a tiny varation.
      duration: 1000,
      easing: 'ease-out',
    }).finished;

    die.style.transform = transform; // Preserve the effect after animation has finished.
    die.dataset.value = roll + 1;
    die.dataset.rolling = 0;
  });
});

btnAdd.addEventListener('click', addDie);
btnRemove.addEventListener('click', removeDie);

function addDie() {
  wrapper.appendChild(dieTemplate.content.cloneNode(true));
  refreshUI()
}

async function removeDie() {
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

  wrapper.removeChild(dieWrapper);
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

function calcTransform(roll = 0, counter) {
  const r = transformPositions[roll];
  const v = transformOffsets[counter % transformOffsets.length];

  return {
    x: r.x + v.x,
    y: r.y + v.y,
    z: r.z + v.z,
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

addDie();
