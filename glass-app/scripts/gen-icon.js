// Generates a valid 1024x1024 RGBA PNG icon (vertical gradient) with no deps.
const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

const W = 1024;
const H = 1024;

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

// colour stops (r,g,b)
const top = [124, 93, 170]; // purple
const bot = [46, 196, 182]; // teal

function pixel(x, y) {
  const t = y / (H - 1);
  const r = Math.round(top[0] + (bot[0] - top[0]) * t);
  const g = Math.round(top[1] + (bot[1] - top[1]) * t);
  const b = Math.round(top[2] + (bot[2] - top[2]) * t);
  // rounded-corner alpha: fade within 96px of edges
  const margin = 96;
  const dx = Math.min(x, W - 1 - x);
  const dy = Math.min(y, H - 1 - y);
  const dist = Math.min(dx, dy);
  let alpha = 255;
  if (dist < margin) alpha = Math.round(255 * ((dist / margin) ** 1.5));
  return [r, g, b, alpha];
}

const raw = Buffer.alloc(H * (1 + W * 4));
let o = 0;
for (let y = 0; y < H; y++) {
  raw[o++] = 0; // filter: none
  for (let x = 0; x < W; x++) {
    const [r, g, b, a] = pixel(x, y);
    raw[o++] = r;
    raw[o++] = g;
    raw[o++] = b;
    raw[o++] = a;
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // color type RGBA
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", zlib.deflateSync(raw)),
  chunk("IEND", Buffer.alloc(0)),
]);

const outDir = path.join(__dirname, "..", "src", "assets");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "icon.png"), png);
console.log("icon.png written:", png.length, "bytes");