// A simple seed-based random generator
function seededRandom(str) {
  let s = 0;
  for (let i = 0; i < str.length; i++) {
    s = (s << 5) - s + str.charCodeAt(i);
    s |= 0;
  }
  return function () {
    s = Math.imul(16807, s);
    return (s ^ (s >>> 15)) & 0x7fffffff;
  };
}

let randFn;
let useShadow = true;

const size = 200;
const margin = 15;
const padding = size * 0.2;

function shapeFilterAttr() {
  return useShadow ? ' filter="url(#shapeShadow)"' : '';
}

function round(n) {
  return Number(Number(n).toFixed(3));
}

// Helper to get a random number in [min, max]
function randRange(min, max) {
  return min + (randFn() / 0x7fffffff) * (max - min);
}

// Helper to create a random color
function randColor() {
  const r = Math.floor(randRange(0, 255));
  const g = Math.floor(randRange(0, 255));
  const b = Math.floor(randRange(0, 255));
  return `rgb(${r},${g},${b})`;
}

// Circle shape
function circleShape(fillColor) {
  const radiusMin = size / 2 - padding;
  const radiusMax = size / 2 - margin;
  const radius = randRange(radiusMin, radiusMax);

  return `
      <circle
        cx="${size / 2}"
        cy="${size / 2}"
        r="${radius}"
        fill="${fillColor}"${shapeFilterAttr()}
      />
    `;
}

// Polygon shape
function polygonShape(fillColor) {
  const pointsCount = Math.floor(randRange(3, 7));
  const radiusMin = size / 2 - padding;
  const radiusMax = size / 2 - margin;
  let points = [];

  for (let i = 0; i < pointsCount; i++) {
    const angle = (2 * Math.PI * i) / pointsCount;
    const radius = randRange(radiusMin, radiusMax);
    const x = size / 2 + radius * Math.cos(angle);
    const y = size / 2 + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return `
      <polygon
        points="${points.join(' ')}"
        fill="${fillColor}"${shapeFilterAttr()}
      />
    `;
}

// Blob shape
function blobShape(fillColor) {
  const pointsCount = 5;
  const angleStep = (2 * Math.PI) / pointsCount;
  const baseRadiusMin = size / 2 - padding;
  const baseRadiusMax = size / 2 - margin;
  const baseRadius = randRange(baseRadiusMin, baseRadiusMax);

  let path = '';
  for (let i = 0; i < pointsCount; i++) {
    const angle = i * angleStep;
    const r = baseRadius + randRange(-20, 20);
    const x = size / 2 + r * Math.cos(angle);
    const y = size / 2 + r * Math.sin(angle);
    path += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
  }
  path += ' Z';

  return `
      <path
        d="${path}"
        fill="${fillColor}"${shapeFilterAttr()}
      />
    `;
}

// Eyes
function drawEyes() {
  const oneEye = randRange(0, 1) < 0.1;
  const eyeSize = randRange(10, 20);
  const pupilSize = eyeSize / 2;
  const offsetX = randRange(15, 25);
  const offsetY = randRange(-10, 10);
  const angleLeft = randRange(-30, 30);
  const angleRight = randRange(-30, 30);
  const leftX = size / 2 - offsetX;
  const leftY = size / 2 - 10 + offsetY;
  const rightX = size / 2 + offsetX;
  const rightY = size / 2 - 10 + offsetY;

  if (oneEye) {
    const angle = randRange(-30, 30);
    return `
        <g transform="translate(${size / 2}, ${leftY}) rotate(${angle}) translate(-${size / 2}, -${leftY})">
          <circle cx="${size / 2}" cy="${leftY}" r="${eyeSize}" fill="white" />
          <circle cx="${size / 2}" cy="${leftY}" r="${pupilSize}" fill="black" />
        </g>
      `;
  } else {
    return `
        <g transform="translate(${leftX}, ${leftY}) rotate(${angleLeft}) translate(-${leftX}, -${leftY})">
          <circle cx="${leftX}" cy="${leftY}" r="${eyeSize}" fill="white" />
          <circle cx="${leftX}" cy="${leftY}" r="${pupilSize}" fill="black" />
        </g>
        <g transform="translate(${rightX}, ${rightY}) rotate(${angleRight}) translate(-${rightX}, -${rightY})">
          <circle cx="${rightX}" cy="${rightY}" r="${eyeSize}" fill="white" />
          <circle cx="${rightX}" cy="${rightY}" r="${pupilSize}" fill="black" />
        </g>
      `;
  }
}

// Mouth
function drawMouth() {
  const mouthType = Math.floor(randRange(0, 5));
  const mouthY = size / 2 + randRange(20, 35);
  const mouthWidth = randRange(30, 50);
  const tilt = randRange(-20, 20);

  if (mouthType === 0) {
    // Straight line
    return `
        <line
          x1="${size / 2 - mouthWidth / 2}"
          y1="${mouthY}"
          x2="${size / 2 + mouthWidth / 2}"
          y2="${mouthY}"
          stroke="black"
          stroke-width="2"
          transform="rotate(${tilt}, ${size / 2}, ${mouthY})"
        />
      `;
  } else if (mouthType === 1) {
    // Circle
    const radius = mouthWidth / 2;
    return `
        <circle
          cx="${size / 2}"
          cy="${mouthY}"
          r="${radius}"
          fill="black"
          transform="rotate(${tilt}, ${size / 2}, ${mouthY})"
        />
      `;
  } else if (mouthType === 2) {
    // Arc
    const rx = mouthWidth / 2;
    const ry = randRange(8, 15);
    return `
        <path
          d="M ${size / 2 - rx} ${mouthY}
             A ${rx} ${ry} 0 0 1 ${size / 2 + rx} ${mouthY}"
          fill="none"
          stroke="black"
          stroke-width="2"
          transform="rotate(${tilt}, ${size / 2}, ${mouthY})"
        />
      `;
  } else if (mouthType === 3) {
    // Upside-down arc (smile)
    const rx = mouthWidth / 2;
    const ry = randRange(8, 15);
    return `
        <path
          d="M ${size / 2 - rx} ${mouthY}
             A ${rx} ${ry} 0 1 0 ${size / 2 + rx} ${mouthY}"
          fill="none"
          stroke="black"
          stroke-width="2"
          transform="rotate(${tilt}, ${size / 2}, ${mouthY})"
        />
      `;
  } else {
    return '';
  }
}

function generateShape(seed, options = {}) {
  const shadow = options.shadow !== false;
  const outputSize = options.size == null ? size : Number(options.size);

  if (!Number.isFinite(outputSize) || outputSize <= 0) {
    throw new Error('size must be a positive number.');
  }

  useShadow = shadow;
  randFn = seededRandom(String(seed));
  const shapeColor = randColor();
  const isSmooth = randRange(0, 1) < 0.5;
  let shapeSVG;

  if (!isSmooth) {
    shapeSVG = polygonShape(shapeColor);
  } else {
    if (randRange(0, 1) < 0.5) {
      shapeSVG = circleShape(shapeColor);
    } else {
      shapeSVG = blobShape(shapeColor);
    }
  }

  const mouthSVG = drawMouth();
  const eyesSVG = drawEyes();
  const svgSize = round(outputSize);

  const defsBlock = shadow
    ? `
        <defs>
          <filter id="shapeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="7"
              dy="7"
              stdDeviation="6"
              flood-color="#000"
              flood-opacity="0.4"
            />
          </filter>
        </defs>`
    : '';

  const finalSVG = `
        <svg
          width="${svgSize}"
          height="${svgSize}"
          viewBox="0 0 ${size} ${size}"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
      >${defsBlock}
        ${shapeSVG}
        ${mouthSVG}
        ${eyesSVG}
      </svg>
    `;

  return { shapeSVG, mouthSVG, eyesSVG, finalSVG };
}

module.exports = { generateShape };