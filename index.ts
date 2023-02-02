type Complex = {
  r: number;
  i: number;
};

const complexZero = { r: 0, i: 0 };

function complexAdd(c1: Complex, c2: Complex): Complex {
  return {
    r: c1.r + c2.r,
    i: c1.i + c2.i
  };
}

function complexMul(c1: Complex, c2: Complex): Complex {
  return {
    r: c1.r * c2.r - c1.i * c2.i,
    i: c1.r * c2.i + c1.i * c2.r,
  };
}

function complexMag(z: Complex): number {
  return Math.sqrt(z.i ** 2 + z.r ** 2);
}

type DrawOptions = {
  zoom: number;
}

function draw(ctx: CanvasRenderingContext2D, options: DrawOptions) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const buf = new Uint8ClampedArray(width * height * 4);

  function coords(x: number, y: number): Complex {
    return {
      r: (x / width * 3 - 2) / options.zoom,
      i: (y / height * 2 - 1 - options.zoom * 1) / options.zoom,
    };
  }

  function check(z: Complex): number | null {
    let num = complexZero;

    for (let i = 0; i < 30; i++) {
      num = complexAdd(z, complexMul(num, num));
      if (complexMag(num) >= 2.0) {
        return i;
      }
    }

    return null;
  }

  for (let y = 0; y < ctx.canvas.height; y++) {
    for (let x = 0; x < ctx.canvas.width; x++) {
      const yes = check(coords(x+0.01, y+0.01));
      if (yes === null) {
        buf[4 * (y * width + x) + 0] = 0;
        buf[4 * (y * width + x) + 1] = 0;
        buf[4 * (y * width + x) + 2] = 0;
        buf[4 * (y * width + x) + 3] = 255;
      } else {
        buf[4 * (y * width + x) + 0] = yes / 30 * 255;
        buf[4 * (y * width + x) + 1] = yes / 50 * 255;
        buf[4 * (y * width + x) + 2] = yes / 15 * 255;
        buf[4 * (y * width + x) + 3] = 255;
      }
    }
  }

  const imageData = new ImageData(buf, width, height);

  ctx.putImageData(imageData, 0, 0);

  requestAnimationFrame(() => draw(ctx, {
    zoom: options.zoom > 357686241040.31244 ? 0.001 : options.zoom * 1.03,
  }));
}

function main(canvasSize: number) {
  const canvas = document.createElement('canvas');
  canvas.width = canvasSize * 3;
  canvas.height = canvasSize * 2;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  draw(ctx, {
    zoom: 0.001,
  });
  document.body.appendChild(canvas);
}

document.addEventListener('DOMContentLoaded', () => main(100));