'use strict';

const fs = require('fs');
const path = require('path');
const { generateShape } = require('./shape_generator');

const DEFAULT_SIZE = 200;
const DEFAULT_OUTPUT_DIR = path.join(__dirname, 'output');

/**
 * @typedef {Object} GenerateOptions
 * @property {boolean} [shadow=true] Whether to include a drop shadow.
 * @property {number} [size=200] Output SVG width and height in pixels.
 */

/**
 * @typedef {Object} AvatarResult
 * @property {string} svg Complete SVG document.
 * @property {string} shapeSVG Shape markup only.
 * @property {string} mouthSVG Mouth markup only.
 * @property {string} eyesSVG Eyes markup only.
 */

function requireDisplayname(displayname) {
  if (displayname == null || String(displayname).trim() === '') {
    throw new Error('displayname is required.');
  }
  return String(displayname);
}

function sanitizeFilename(name) {
  const sanitized = String(name).replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').trim();
  return sanitized || 'shape';
}

/**
 * Generate a seeded polygon avatar.
 * @param {string} displayname Used as the random seed.
 * @param {GenerateOptions} [options]
 * @returns {AvatarResult}
 */
function generate(displayname, options = {}) {
  const seed = requireDisplayname(displayname);
  const { shapeSVG, mouthSVG, eyesSVG, finalSVG } = generateShape(seed, {
    shadow: options.shadow,
    size: options.size,
  });

  return {
    svg: `${finalSVG.trim()}\n`,
    shapeSVG,
    mouthSVG,
    eyesSVG,
  };
}

/**
 * Generate a seeded polygon avatar as an SVG string.
 * @param {string} displayname Used as the random seed.
 * @param {GenerateOptions} [options]
 * @returns {string}
 */
function generateSvg(displayname, options = {}) {
  return generate(displayname, options).svg;
}

/**
 * Generate a seeded polygon avatar and write it to an SVG file.
 * @param {string} displayname Used as the random seed and default filename.
 * @param {GenerateOptions & { output?: string, filename?: string }} [options]
 * @returns {string} Absolute path of the written file.
 */
function writeSvg(displayname, options = {}) {
  const seed = requireDisplayname(displayname);
  const { svg } = generate(seed, options);
  const outputDir = path.resolve(options.output || DEFAULT_OUTPUT_DIR);
  fs.mkdirSync(outputDir, { recursive: true });

  const filename = options.filename || `${sanitizeFilename(seed)}.svg`;
  const outPath = path.join(outputDir, filename);
  fs.writeFileSync(outPath, svg, 'utf8');
  return outPath;
}

module.exports = {
  generate,
  generateSvg,
  writeSvg,
  generateShape,
  sanitizeFilename,
  DEFAULT_SIZE,
  DEFAULT_OUTPUT_DIR,
};
