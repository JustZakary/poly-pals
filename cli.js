#!/usr/bin/env node
const {
  writeSvg,
  sanitizeFilename,
  DEFAULT_OUTPUT_DIR,
  DEFAULT_SIZE,
} = require('./index');

function printUsage() {
  console.error('Usage: node cli.js --displayname <name> [options]');
  console.error('  --displayname, -n  Required. Used as the random seed and filename.');
  console.error('  --output, -o       Optional. Directory to save the SVG (default: output).');
  console.error('  --size, -s         Optional. Output size in pixels (default: 200).');
  console.error('  --shadow           Optional. Shape drop shadow (default: true).');
}

function parseBoolean(value) {
  const normalized = String(value).toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  throw new Error(`Expected a boolean, got: ${value}`);
}

function readValue(argv, i, name) {
  const value = argv[i + 1];
  if (value === undefined || (value.startsWith('-') && !/^-?\d+(\.\d+)?$/.test(value))) {
    throw new Error(`${name} requires a value.`);
  }
  return value;
}

function readOptionalBoolean(argv, i) {
  const next = argv[i + 1];
  if (next !== undefined && !next.startsWith('-') && /^(true|false|1|0|yes|no|on|off)$/i.test(next)) {
    return { value: parseBoolean(next), consumed: 1 };
  }
  return { value: true, consumed: 0 };
}

function parseArgs(argv) {
  const args = {
    displayname: null,
    output: DEFAULT_OUTPUT_DIR,
    size: DEFAULT_SIZE,
    shadow: true,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      args.help = true;
      continue;
    }

    if (arg === '--displayname' || arg === '-n') {
      args.displayname = readValue(argv, i, 'displayname');
      i += 1;
      continue;
    }

    if (arg === '--output' || arg === '-o') {
      args.output = readValue(argv, i, 'output');
      i += 1;
      continue;
    }

    if (arg === '--size' || arg === '-s') {
      const raw = readValue(argv, i, 'size');
      const size = Number(raw);
      if (!Number.isFinite(size) || size <= 0) {
        throw new Error('size must be a positive number.');
      }
      args.size = size;
      i += 1;
      continue;
    }

    if (arg === '--shadow') {
      const parsed = readOptionalBoolean(argv, i);
      args.shadow = parsed.value;
      i += parsed.consumed;
      continue;
    }

    if (arg === '--no-shadow') {
      args.shadow = false;
      continue;
    }

    if (arg.startsWith('-')) {
      throw new Error(`Unknown argument: ${arg}`);
    }

    if (!args.displayname) {
      args.displayname = arg;
      continue;
    }

    throw new Error(`Unexpected argument: ${arg}`);
  }

  return args;
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err.message);
    printUsage();
    process.exit(1);
  }

  if (args.help) {
    printUsage();
    process.exit(0);
  }

  if (!args.displayname) {
    console.error('Error: displayname is required.');
    printUsage();
    process.exit(1);
  }

  const outPath = writeSvg(args.displayname, {
    output: args.output,
    size: args.size,
    shadow: args.shadow,
    filename: `${sanitizeFilename(args.displayname)}.svg`,
  });
  console.log(`Saved shape to ${outPath}`);
}

main();
