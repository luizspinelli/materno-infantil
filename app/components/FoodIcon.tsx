import type { Alimento } from "../lib/foods";

type Props = {
  alimento: Alimento;
  size?: number;
};

const SVGS: Record<string, React.ReactNode> = {
  arroz: (
    <>
      <path d="M 70 30 Q 65 50 75 60" stroke="#bdc3c7" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 100 25 Q 95 45 105 60" stroke="#bdc3c7" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 130 30 Q 125 50 135 60" stroke="#bdc3c7" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="100" cy="80" rx="75" ry="15" fill="#ecf0f1" stroke="#34495e" strokeWidth="2.5" />
      <path d="M 25 80 Q 30 160 100 165 Q 170 160 175 80" fill="#ecf0f1" stroke="#34495e" strokeWidth="2.5" />
      <ellipse cx="100" cy="80" rx="70" ry="12" fill="#fefefe" stroke="#bdc3c7" strokeWidth="1" />
      <ellipse cx="65" cy="76" rx="5" ry="2" fill="#fff" stroke="#bdc3c7" strokeWidth="0.7" />
      <ellipse cx="80" cy="80" rx="5" ry="2" fill="#fff" stroke="#bdc3c7" strokeWidth="0.7" transform="rotate(20 80 80)" />
      <ellipse cx="100" cy="74" rx="5" ry="2" fill="#fff" stroke="#bdc3c7" strokeWidth="0.7" transform="rotate(-15 100 74)" />
      <ellipse cx="120" cy="78" rx="5" ry="2" fill="#fff" stroke="#bdc3c7" strokeWidth="0.7" transform="rotate(30 120 78)" />
      <ellipse cx="135" cy="82" rx="5" ry="2" fill="#fff" stroke="#bdc3c7" strokeWidth="0.7" />
      <ellipse cx="55" cy="84" rx="5" ry="2" fill="#fff" stroke="#bdc3c7" strokeWidth="0.7" transform="rotate(-25 55 84)" />
      <ellipse cx="90" cy="86" rx="5" ry="2" fill="#fff" stroke="#bdc3c7" strokeWidth="0.7" />
      <ellipse cx="115" cy="84" rx="5" ry="2" fill="#fff" stroke="#bdc3c7" strokeWidth="0.7" transform="rotate(15 115 84)" />
      <ellipse cx="145" cy="78" rx="5" ry="2" fill="#fff" stroke="#bdc3c7" strokeWidth="0.7" transform="rotate(-20 145 78)" />
      <ellipse cx="72" cy="83" rx="5" ry="2" fill="#fff" stroke="#bdc3c7" strokeWidth="0.7" transform="rotate(45 72 83)" />
    </>
  ),
  feijao: (
    <>
      <path d="M 80 30 Q 75 50 85 60" stroke="#bdc3c7" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 120 30 Q 115 50 125 60" stroke="#bdc3c7" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="100" cy="80" rx="75" ry="15" fill="#ecf0f1" stroke="#34495e" strokeWidth="2.5" />
      <path d="M 25 80 Q 30 160 100 165 Q 170 160 175 80" fill="#ecf0f1" stroke="#34495e" strokeWidth="2.5" />
      <ellipse cx="100" cy="80" rx="70" ry="12" fill="#6e3a1f" />
      <ellipse cx="60" cy="76" rx="9" ry="6" fill="#3d2417" stroke="#1a0e09" strokeWidth="0.8" transform="rotate(20 60 76)" />
      <ellipse cx="85" cy="80" rx="9" ry="6" fill="#4a2818" stroke="#1a0e09" strokeWidth="0.8" transform="rotate(-15 85 80)" />
      <ellipse cx="110" cy="74" rx="9" ry="6" fill="#3d2417" stroke="#1a0e09" strokeWidth="0.8" transform="rotate(30 110 74)" />
      <ellipse cx="135" cy="78" rx="9" ry="6" fill="#4a2818" stroke="#1a0e09" strokeWidth="0.8" transform="rotate(-10 135 78)" />
      <ellipse cx="75" cy="82" rx="9" ry="6" fill="#3d2417" stroke="#1a0e09" strokeWidth="0.8" transform="rotate(-30 75 82)" />
      <ellipse cx="100" cy="84" rx="9" ry="6" fill="#4a2818" stroke="#1a0e09" strokeWidth="0.8" transform="rotate(15 100 84)" />
      <ellipse cx="125" cy="84" rx="9" ry="6" fill="#3d2417" stroke="#1a0e09" strokeWidth="0.8" transform="rotate(45 125 84)" />
      <ellipse cx="58" cy="74" rx="2" ry="1" fill="#8b6f47" />
      <ellipse cx="83" cy="78" rx="2" ry="1" fill="#8b6f47" />
      <ellipse cx="108" cy="72" rx="2" ry="1" fill="#8b6f47" />
    </>
  ),
  frango: (
    <>
      <ellipse cx="100" cy="120" rx="78" ry="20" fill="#ecf0f1" stroke="#34495e" strokeWidth="2.5" />
      <ellipse cx="100" cy="118" rx="68" ry="15" fill="#fdfdfd" stroke="#bdc3c7" strokeWidth="1" />
      <path d="M 50 115 Q 55 80 90 75 Q 130 70 150 90 Q 160 110 145 120 Q 100 130 50 115 Z" fill="#d4a574" stroke="#8b6f47" strokeWidth="1.5" />
      <path d="M 60 100 Q 75 92 95 95" stroke="#a67c52" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 55 110 Q 80 100 110 105" stroke="#a67c52" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 70 88 Q 90 80 115 85" stroke="#a67c52" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 90 100 Q 110 90 135 95" stroke="#a67c52" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 100 115 Q 125 105 145 108" stroke="#a67c52" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 75 105 Q 100 95 125 100" stroke="#a67c52" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 65 95 Q 95 85 130 88" stroke="#bd9265" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 50 108 Q 80 95 130 100" stroke="#bd9265" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 90 50 Q 85 60 92 70" stroke="#bdc3c7" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 110 45 Q 105 58 112 70" stroke="#bdc3c7" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),
  ovo: (
    <>
      <ellipse cx="65" cy="110" rx="32" ry="42" fill="#fffef0" stroke="#34495e" strokeWidth="2.5" />
      <ellipse cx="55" cy="95" rx="8" ry="12" fill="#ffffff" opacity="0.6" />
      <ellipse cx="140" cy="110" rx="38" ry="42" fill="#fffef0" stroke="#34495e" strokeWidth="2.5" />
      <circle cx="140" cy="110" r="18" fill="#f5c518" stroke="#d4a017" strokeWidth="2" />
      <circle cx="135" cy="105" r="5" fill="#fce570" opacity="0.7" />
    </>
  ),
  brocolis: (
    <>
      <path d="M 85 130 L 80 175 L 120 175 L 115 130 Z" fill="#e8f5d8" stroke="#7a9a3e" strokeWidth="2" />
      <line x1="92" y1="140" x2="90" y2="170" stroke="#a8c66c" strokeWidth="1.5" />
      <line x1="100" y1="140" x2="100" y2="170" stroke="#a8c66c" strokeWidth="1.5" />
      <line x1="108" y1="140" x2="110" y2="170" stroke="#a8c66c" strokeWidth="1.5" />
      <circle cx="60" cy="90" r="20" fill="#5a7a2f" />
      <circle cx="80" cy="70" r="22" fill="#6a8c3a" />
      <circle cx="100" cy="55" r="20" fill="#5a7a2f" />
      <circle cx="120" cy="70" r="22" fill="#6a8c3a" />
      <circle cx="140" cy="90" r="20" fill="#5a7a2f" />
      <circle cx="100" cy="85" r="25" fill="#6a8c3a" />
      <circle cx="75" cy="100" r="18" fill="#5a7a2f" />
      <circle cx="125" cy="100" r="18" fill="#5a7a2f" />
      <circle cx="55" cy="85" r="4" fill="#3d5a1f" />
      <circle cx="68" cy="78" r="4" fill="#3d5a1f" />
      <circle cx="85" cy="60" r="4" fill="#3d5a1f" />
      <circle cx="102" cy="48" r="4" fill="#3d5a1f" />
      <circle cx="118" cy="60" r="4" fill="#3d5a1f" />
      <circle cx="132" cy="78" r="4" fill="#3d5a1f" />
      <circle cx="145" cy="85" r="4" fill="#3d5a1f" />
      <circle cx="95" cy="80" r="4" fill="#3d5a1f" />
      <circle cx="110" cy="80" r="4" fill="#3d5a1f" />
      <circle cx="80" cy="105" r="4" fill="#3d5a1f" />
      <circle cx="120" cy="105" r="4" fill="#3d5a1f" />
    </>
  ),
  cenoura: (
    <>
      <path d="M 100 40 Q 80 20 70 35 Q 75 45 90 50 Z" fill="#5a8c3a" stroke="#3d5a1f" strokeWidth="1.5" />
      <path d="M 100 40 Q 120 20 130 35 Q 125 45 110 50 Z" fill="#6a9c4a" stroke="#3d5a1f" strokeWidth="1.5" />
      <path d="M 100 35 Q 100 15 95 25 Q 95 40 100 45 Z" fill="#4a7c2a" stroke="#3d5a1f" strokeWidth="1.5" />
      <path d="M 90 45 Q 75 30 65 45" fill="none" stroke="#5a8c3a" strokeWidth="3" strokeLinecap="round" />
      <path d="M 110 45 Q 125 30 135 45" fill="none" stroke="#5a8c3a" strokeWidth="3" strokeLinecap="round" />
      <path d="M 80 55 L 120 55 L 105 175 L 95 175 Z" fill="#e67e22" stroke="#a04000" strokeWidth="2.5" />
      <line x1="84" y1="80" x2="116" y2="80" stroke="#a04000" strokeWidth="1.5" opacity="0.6" />
      <line x1="86" y1="100" x2="114" y2="100" stroke="#a04000" strokeWidth="1.5" opacity="0.6" />
      <line x1="89" y1="120" x2="111" y2="120" stroke="#a04000" strokeWidth="1.5" opacity="0.6" />
      <line x1="92" y1="140" x2="108" y2="140" stroke="#a04000" strokeWidth="1.5" opacity="0.6" />
      <line x1="95" y1="160" x2="105" y2="160" stroke="#a04000" strokeWidth="1.5" opacity="0.6" />
      <path d="M 85 60 L 95 165" stroke="#f39c12" strokeWidth="3" opacity="0.5" />
    </>
  ),
  abobora: (
    <>
      <rect x="92" y="40" width="14" height="22" fill="#5a4a2a" stroke="#2a1f10" strokeWidth="2" />
      <path d="M 105 50 Q 130 35 140 50 Q 130 65 110 60 Z" fill="#6a8c3a" stroke="#3d5a1f" strokeWidth="1.5" />
      <ellipse cx="100" cy="115" rx="75" ry="55" fill="#e67e22" stroke="#a04000" strokeWidth="2.5" />
      <ellipse cx="100" cy="115" rx="22" ry="55" fill="#f39c12" opacity="0.4" />
      <path d="M 50 95 Q 55 115 50 140" fill="none" stroke="#a04000" strokeWidth="2" />
      <path d="M 75 75 Q 70 115 75 158" fill="none" stroke="#a04000" strokeWidth="2" />
      <path d="M 100 70 Q 100 115 100 165" fill="none" stroke="#a04000" strokeWidth="2" />
      <path d="M 125 75 Q 130 115 125 158" fill="none" stroke="#a04000" strokeWidth="2" />
      <path d="M 150 95 Q 145 115 150 140" fill="none" stroke="#a04000" strokeWidth="2" />
    </>
  ),
  banana: (
    <>
      <path
        d="M 35 75 Q 30 50 50 50 Q 60 55 70 80 Q 100 130 150 145 Q 175 148 175 130 Q 170 120 155 125 Q 110 115 85 75 Q 75 60 60 60 Q 45 60 50 75 Z"
        fill="#f9d423"
        stroke="#a07c1a"
        strokeWidth="2.5"
      />
      <path d="M 60 70 Q 95 100 145 130" stroke="#fce570" strokeWidth="4" fill="none" opacity="0.7" />
      <ellipse cx="42" cy="55" rx="8" ry="6" fill="#5a4a2a" transform="rotate(-30 42 55)" />
      <ellipse cx="170" cy="135" rx="8" ry="6" fill="#5a4a2a" transform="rotate(15 170 135)" />
      <path d="M 80 85 Q 110 110 145 122" stroke="#d4a017" strokeWidth="1" fill="none" opacity="0.5" />
    </>
  ),
  maca: (
    <>
      <path d="M 100 55 Q 105 40 110 35" stroke="#5a4a2a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 110 38 Q 130 25 140 40 Q 130 50 115 48 Z" fill="#6a8c3a" stroke="#3d5a1f" strokeWidth="1.5" />
      <line x1="115" y1="42" x2="135" y2="38" stroke="#3d5a1f" strokeWidth="1" />
      <path
        d="M 100 60 Q 50 55 45 110 Q 45 165 95 170 Q 100 168 105 170 Q 155 165 155 110 Q 150 55 100 60 Z"
        fill="#e74c3c"
        stroke="#922b21"
        strokeWidth="2.5"
      />
      <path d="M 100 60 Q 98 110 100 168" stroke="#922b21" strokeWidth="1" fill="none" opacity="0.4" />
      <ellipse cx="70" cy="90" rx="12" ry="20" fill="#ffffff" opacity="0.4" />
    </>
  ),
  batata: (
    <>
      <path
        d="M 50 100 Q 40 60 80 55 Q 130 50 160 80 Q 170 130 130 150 Q 80 160 55 130 Q 40 115 50 100 Z"
        fill="#d4a574"
        stroke="#7a5a3a"
        strokeWidth="2.5"
      />
      <ellipse cx="80" cy="85" rx="4" ry="3" fill="#7a5a3a" />
      <ellipse cx="120" cy="80" rx="4" ry="3" fill="#7a5a3a" />
      <ellipse cx="100" cy="110" rx="4" ry="3" fill="#7a5a3a" />
      <ellipse cx="140" cy="110" rx="4" ry="3" fill="#7a5a3a" />
      <ellipse cx="70" cy="120" rx="4" ry="3" fill="#7a5a3a" />
      <ellipse cx="115" cy="135" rx="4" ry="3" fill="#7a5a3a" />
      <path d="M 75 80 Q 78 82 82 85" stroke="#7a5a3a" strokeWidth="0.8" fill="none" />
      <path d="M 115 75 Q 118 78 122 80" stroke="#7a5a3a" strokeWidth="0.8" fill="none" />
      <ellipse cx="75" cy="75" rx="15" ry="8" fill="#ffffff" opacity="0.3" />
    </>
  ),
  salsicha: (
    <>
      <ellipse cx="100" cy="120" rx="78" ry="18" fill="#ecf0f1" stroke="#34495e" strokeWidth="2.5" />
      <ellipse cx="100" cy="118" rx="68" ry="13" fill="#fdfdfd" stroke="#bdc3c7" strokeWidth="1" />
      <rect x="35" y="95" width="130" height="28" rx="14" ry="14" fill="#e88a8a" stroke="#922b21" strokeWidth="2.5" />
      <line x1="60" y1="95" x2="60" y2="123" stroke="#922b21" strokeWidth="1.5" opacity="0.6" />
      <line x1="100" y1="95" x2="100" y2="123" stroke="#922b21" strokeWidth="1.5" opacity="0.6" />
      <line x1="140" y1="95" x2="140" y2="123" stroke="#922b21" strokeWidth="1.5" opacity="0.6" />
      <rect x="40" y="100" width="120" height="6" rx="3" ry="3" fill="#ffffff" opacity="0.4" />
      <rect x="55" y="75" width="90" height="20" rx="10" ry="10" fill="#d97a7a" stroke="#922b21" strokeWidth="2" />
      <line x1="85" y1="75" x2="85" y2="95" stroke="#922b21" strokeWidth="1" opacity="0.6" />
      <line x1="115" y1="75" x2="115" y2="95" stroke="#922b21" strokeWidth="1" opacity="0.6" />
    </>
  ),
  refrigerante: (
    <>
      <rect x="85" y="30" width="30" height="15" rx="2" fill="#34495e" stroke="#1a252f" strokeWidth="2" />
      <line x1="88" y1="35" x2="112" y2="35" stroke="#1a252f" strokeWidth="0.8" />
      <line x1="88" y1="40" x2="112" y2="40" stroke="#1a252f" strokeWidth="0.8" />
      <path
        d="M 88 45 L 88 60 L 75 75 L 75 175 Q 75 180 80 180 L 120 180 Q 125 180 125 175 L 125 75 L 112 60 L 112 45 Z"
        fill="#7a3a1a"
        stroke="#3d1a0a"
        strokeWidth="2.5"
      />
      <path
        d="M 78 78 L 78 175 Q 78 178 81 178 L 119 178 Q 122 178 122 175 L 122 78 Z"
        fill="#5a2a10"
      />
      <circle cx="88" cy="100" r="2.5" fill="#ffffff" opacity="0.6" />
      <circle cx="105" cy="115" r="2" fill="#ffffff" opacity="0.6" />
      <circle cx="95" cy="130" r="3" fill="#ffffff" opacity="0.6" />
      <circle cx="110" cy="145" r="2" fill="#ffffff" opacity="0.6" />
      <circle cx="90" cy="155" r="2.5" fill="#ffffff" opacity="0.6" />
      <circle cx="108" cy="165" r="2" fill="#ffffff" opacity="0.6" />
      <rect x="83" y="80" width="6" height="90" rx="3" fill="#ffffff" opacity="0.25" />
      <rect x="75" y="105" width="50" height="35" fill="#e74c3c" stroke="#922b21" strokeWidth="1.5" />
      <text x="100" y="128" fontFamily="Arial Black, sans-serif" fontSize="11" fontWeight="900" textAnchor="middle" fill="#ffffff">
        COLA
      </text>
    </>
  ),
  biscoito: (
    <>
      <ellipse cx="100" cy="125" rx="60" ry="58" fill="#3d2417" stroke="#1a0e09" strokeWidth="2.5" />
      <ellipse cx="100" cy="100" rx="58" ry="14" fill="#fffef0" stroke="#d4c890" strokeWidth="2" />
      <ellipse cx="100" cy="80" rx="60" ry="35" fill="#3d2417" stroke="#1a0e09" strokeWidth="2.5" />
      <circle cx="70" cy="65" r="2" fill="#1a0e09" />
      <circle cx="90" cy="55" r="2" fill="#1a0e09" />
      <circle cx="110" cy="60" r="2" fill="#1a0e09" />
      <circle cx="130" cy="70" r="2" fill="#1a0e09" />
      <circle cx="80" cy="75" r="2" fill="#1a0e09" />
      <circle cx="115" cy="80" r="2" fill="#1a0e09" />
      <circle cx="60" cy="140" r="2" fill="#1a0e09" />
      <circle cx="80" cy="155" r="2" fill="#1a0e09" />
      <circle cx="110" cy="160" r="2" fill="#1a0e09" />
      <circle cx="130" cy="150" r="2" fill="#1a0e09" />
      <circle cx="140" cy="130" r="2" fill="#1a0e09" />
      <circle cx="65" cy="125" r="2" fill="#1a0e09" />
      <text x="100" y="80" fontFamily="Arial Black, sans-serif" fontSize="14" fontWeight="900" textAnchor="middle" fill="#1a0e09" opacity="0.5">
        B
      </text>
      <ellipse cx="80" cy="60" rx="15" ry="8" fill="#ffffff" opacity="0.15" />
    </>
  ),
};

export function FoodIcon({ alimento, size = 64 }: Props) {
  if (alimento.img) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={alimento.img}
        alt={alimento.nome}
        width={size}
        height={size}
        loading="lazy"
        style={{ objectFit: "contain", width: size, height: size }}
        draggable={false}
      />
    );
  }
  if (alimento.svgId && SVGS[alimento.svgId]) {
    return (
      <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden>
        {SVGS[alimento.svgId]}
      </svg>
    );
  }
  return (
    <span
      role="img"
      aria-label={alimento.nome}
      style={{ fontSize: size * 0.75, lineHeight: 1, display: "inline-block" }}
    >
      {alimento.emoji ?? "🍽️"}
    </span>
  );
}
