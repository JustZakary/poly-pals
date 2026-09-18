'use strict';

const { generateShape } = require('./shape_generator');

const DEFAULT_SIZE = 200;

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

module.exports = {
  generate,
  generateSvg,
  generateShape,
  sanitizeFilename,
  DEFAULT_SIZE,
};
