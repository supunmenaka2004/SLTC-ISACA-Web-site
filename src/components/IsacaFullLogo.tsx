"use client";

export default function IsacaFullLogo({ height = 48 }: { height?: number }) {
  return (
    <div className="flex items-center select-none shrink-0">
      <img
        src="/isaca_transparent.png"
        alt="ISACA Student Group - Sri Lanka Technology Campus"
        style={{ height }}
        className="w-auto object-contain block brightness-[1.65] contrast-[1.15] hover:brightness-[1.85] transition-all duration-300"
      />
    </div>
  );
}
