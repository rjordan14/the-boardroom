/**
 * Overlays the 6 real stonkbroker portraits on top of the audience row
 * baked into marks/room.png (the conference-room background art). The
 * baked-in row can't be edited directly (it's a flattened raster), so
 * this positions matching-size images over each seat instead — the
 * coordinates below were measured directly from room.png's pixels
 * (percentages of the full 1920x1080 image), not eyeballed.
 */
const SEATS = [
  { left: "23.85%", top: "63.89%" },
  { left: "32.81%", top: "62.78%" },
  { left: "42.29%", top: "62.04%" },
  { left: "51.51%", top: "62.78%" },
  { left: "60.68%", top: "63.89%" },
  { left: "69.64%", top: "65.19%" },
];

const PORTRAITS = [
  "/marks/stonkbroker-crowd-1.jpg",
  "/marks/stonkbroker-crowd-2.jpg",
  "/marks/stonkbroker-crowd-3.jpg",
  "/marks/stonkbroker-crowd-4.jpg",
  "/marks/stonkbroker-crowd-5.jpg",
  "/marks/stonkbroker-crowd-6.png",
];

export function AudienceRow() {
  return (
    <>
      {SEATS.map((seat, i) => (
        <img
          key={i}
          src={PORTRAITS[i]}
          alt=""
          className="absolute h-[8.7%] w-[4.9%] [image-rendering:pixelated]"
          style={{ left: seat.left, top: seat.top }}
        />
      ))}
    </>
  );
}
