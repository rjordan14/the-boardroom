/** Renders a shareable "I Voted" sticker as a PNG blob — a circular
 *  badge (curved "I VOTED ★" text around the rim, like a real election
 *  sticker) with the catbroker mascot in the middle and the voted-for
 *  project named below. Canvas, not an HTML/CSS mockup, so what gets
 *  previewed is byte-for-byte what gets downloaded or shared — no
 *  separate implementation to keep in sync. */

const WIDTH = 1000;
const HEIGHT = 1050;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;
  if (imgRatio > boxRatio) {
    sw = img.height * boxRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / boxRatio;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/** Places `text` along an arc of `radius`, centered on `centerAngleDeg`
 *  and spanning `arcDeg` total — restricted to the top of the circle
 *  (like a real "I Voted" sticker's rim text) rather than wrapping the
 *  full 360°, because a character rotated tangent to the *bottom* half
 *  of a circle renders upside down to the viewer. */
function drawArcText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  centerAngleDeg: number,
  arcDeg: number,
  font: string,
  color: string
) {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const chars = Array.from(text);
  const anglePerChar = arcDeg / Math.max(1, chars.length - 1);
  let angle = centerAngleDeg - arcDeg / 2;
  for (const ch of chars) {
    const rad = (angle * Math.PI) / 180;
    ctx.save();
    ctx.translate(cx + radius * Math.cos(rad), cy + radius * Math.sin(rad));
    ctx.rotate(rad + Math.PI / 2);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
    angle += anglePerChar;
  }
  ctx.restore();
}

/** Shrinks font size until `text` fits `maxWidth`, so long project
 *  names (e.g. "PAPERHANDS ANONYMOUS") don't run off the card. */
function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, baseSize: number): number {
  let size = baseSize;
  while (size > 22) {
    ctx.font = `bold ${size}px monospace`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

/** Centered word-wrap — assumes ctx.font/fillStyle/textAlign are
 *  already set. `y` is the vertical center of the first line. */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const attempt = current ? `${current} ${word}` : word;
    if (ctx.measureText(attempt).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = attempt;
    }
  }
  if (current) lines.push(current);
  lines.forEach((line, i) => ctx.fillText(line, cx, y + i * lineHeight));
}

export async function renderVotedCard({ projectName }: { projectName: string }): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  ctx.fillStyle = "#0A0D07";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.strokeStyle = "#2C3327";
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, WIDTH - 56, HEIGHT - 56);

  ctx.textAlign = "center";
  ctx.fillStyle = "#CCFF00";
  ctx.font = "bold 32px monospace";
  ctx.fillText("THE BOARDROOM", WIDTH / 2, 112);
  ctx.fillStyle = "#6C7563";
  ctx.font = "20px monospace";
  ctx.fillText("SEASON 01", WIDTH / 2, 146);

  const cx = WIDTH / 2;
  const cy = 490;
  const avatarR = 210;
  const bandWidth = 74;
  const bandR = avatarR + bandWidth / 2;

  ctx.save();
  ctx.lineWidth = bandWidth;
  ctx.strokeStyle = "#CCFF00";
  ctx.beginPath();
  ctx.arc(cx, cy, bandR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  const avatar = await loadImage("/marks/catbroker-swing.gif");
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, avatarR - 6, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = "#000000";
  ctx.fillRect(cx - avatarR, cy - avatarR, avatarR * 2, avatarR * 2);
  drawImageCover(ctx, avatar, cx - avatarR, cy - avatarR, avatarR * 2, avatarR * 2);
  ctx.restore();

  drawArcText(ctx, "★ I VOTED ★ I VOTED ★", cx, cy, bandR, -90, 150, "bold 26px monospace", "#0A0D07");

  // A plain, unrotated star at the bottom of the ring instead of
  // wrapping the rim text the rest of the way around — the bottom half
  // of a circle is upside down from the viewer's angle if text follows
  // the tangent there, same reason the sticker text above only spans
  // the top arc.
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#0A0D07";
  ctx.font = "bold 30px monospace";
  ctx.fillText("★", cx, cy + bandR);
  ctx.restore();

  const nameText = projectName.toUpperCase();
  const nameY = cy + avatarR + bandWidth / 2 + 96;
  const nameSize = fitText(ctx, nameText, WIDTH - 140, 58);
  ctx.font = `bold ${nameSize}px monospace`;
  ctx.fillStyle = "#F5F7F0";
  ctx.fillText(nameText, cx, nameY);

  // The hook for anyone seeing this card who has no idea what The
  // Boardroom is — promoted from a bottom footnote to the card's
  // second-biggest piece of text, since that's the line doing the work
  // of explaining why this is worth looking at.
  ctx.fillStyle = "#CCFF00";
  ctx.font = "bold 34px monospace";
  wrapText(ctx, "THE COMMUNITY DECIDES WHO LAUNCHES.", cx, nameY + 76, WIDTH - 200, 42);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to render card"));
    }, "image/png");
  });
}
