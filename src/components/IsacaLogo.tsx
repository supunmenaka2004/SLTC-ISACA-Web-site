"use client";

export default function IsacaLogo({ size = 36 }: { size?: number }) {
  // Official ISACA 3x3 grid of 9 C-shaped ring arcs
  // Colors per row/col from official ISACA brand identity:
  // Row 1: Light Cyan, Teal-Green, Lime Green
  // Row 2: Medium Blue, Light Cyan, Teal-Green
  // Row 3: Dark Navy, Medium Blue, Light Cyan
  const colors = [
    ["#00a3e0", "#00b2a9", "#78be20"],
    ["#005596", "#00a3e0", "#00b2a9"],
    ["#1d2570", "#005596", "#00a3e0"],
  ];

  // Rotation angles for the C-notch in each ring
  const rotations = [
    [45, 135, 225],
    [315, 45, 135],
    [225, 315, 45],
  ];

  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center shrink-0"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {colors.map((row, rIdx) =>
          row.map((color, cIdx) => {
            const cx = 18 + cIdx * 32;
            const cy = 18 + rIdx * 32;
            const angle = rotations[rIdx][cIdx];

            return (
              <g key={`${rIdx}-${cIdx}`} transform={`rotate(${angle} ${cx} ${cy})`}>
                <path
                  d={`M ${cx + 10} ${cy} A 10 10 0 1 1 ${cx} ${cy - 10}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}
