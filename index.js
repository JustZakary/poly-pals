'use strict';

const fs = require('fs');
const path = require('path');
const {
  generate,
  generateSvg,
  generateShape,
  sanitizeFilename,
  DEFAULT_SIZE,
} = require('./lib');

const DEFAULT_OUTPUT_DIR = path.join(__dirname, 'output');

/**
 * Generate a seeded polygon avatar and write it to an SVG file.
 * @param {string} displayname Used as the random seed and default filename.
 * @param {import('./lib').GenerateOptions & { output?: string, filename?: string }} [options]
 * @returns {string} Absolute path of the written file.
 */
function writeSvg(displayname, options = {}) {
  const seed = String(displayname);
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
