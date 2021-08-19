const transformPositions = [
  {x: 0, y: 0, z: 0},
  {x: 90, y: 0, z: 0},
  {x: 0, y: -90, z: 0},
  {x: 0, y: 90, z: 0},
  {x: -90, y: 0, z: 0},
  {x: -180, y: 0, z: 0},
];

const transformOffsets = [ // Offsets to make the dice appear to spin randomly
    {x: 360, y: 360, z: 0},
    {x: 0, y: 360, z: 360},
    {x: 360, y: 0, z: 360},
];

document.querySelector("body").addEventListener("click", async e => {
  const dice = document.querySelectorAll(".die");
  for (const die of dice) if (die.dataset.rolling === '1') return;

  dice.forEach(async (die) => {
    die.dataset.rolling = 1;
    const roll = getRandomInt(0, 6);
    const {x, y, z} = calcTransform(roll, ++die.dataset.rollCount);
    const transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;

    await die.animate([{transform}], {
      delay: getRandomInt(0, 250), // Add a tiny varation.
      duration: 1000,
      easing: 'ease-out',
    }).finished;

    die.style.transform = transform; // Preserve the effect after animation has finished.
    die.dataset.value = roll + 1;
    die.dataset.rolling = 0;
  });
});

function calcTransform(roll = 0, counter) {
  const r = transformPositions[roll];
  const v = transformOffsets[counter % transformOffsets.length];

  return {
    x: r.x + v.x,
    y: r.y + v.y,
    z: r.x + v.z,
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
