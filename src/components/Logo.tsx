interface LogoProps {
  className?: string;
}

export function AuthenticIntelLogo({ className = "h-8 w-auto" }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Authentic Intelligence"
    >
      {/* Speech bubble icon */}
      <g fill="#8DC63F">
        {/* Outer bubble (top-right) */}
        <rect x="18" y="2" width="38" height="30" rx="2" />
        <polygon points="44,32 50,42 56,32" />
        {/* Inner bubble (bottom-left) */}
        <rect x="2" y="18" width="32" height="24" rx="2" />
        <polygon points="8,42 14,52 20,42" />
        {/* White cutout between bubbles */}
        <rect x="18" y="18" width="14" height="12" fill="white" />
      </g>

      {/* "Authentic" text */}
      <text
        x="70"
        y="34"
        fontFamily="Nunito, Arial, sans-serif"
        fontWeight="700"
        fontSize="22"
        fill="#8DC63F"
      >
        Authentic
      </text>
      {/* "Intelligence" text */}
      <text
        x="70"
        y="60"
        fontFamily="Nunito, Arial, sans-serif"
        fontWeight="700"
        fontSize="22"
        fill="#8DC63F"
      >
        Intelligence
      </text>
    </svg>
  );
}
