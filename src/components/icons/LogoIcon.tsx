import type React from 'react';

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {}

const LogoIcon: React.FC<LogoIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 50"
    width="120"
    height="30"
    aria-labelledby="logoTitle"
    {...props}
  >
    <title id="logoTitle">OmniMeet AI Logo</title>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <text
      x="5"
      y="35"
      fontFamily="Inter, sans-serif"
      fontSize="30"
      fontWeight="bold"
      fill="url(#logoGradient)"
    >
      OmniMeet
    </text>
    <text
      x="158"
      y="35"
      fontFamily="Inter, sans-serif"
      fontSize="30"
      fontWeight="bold"
      fill="hsl(var(--accent))"
    >
      AI
    </text>
  </svg>
);

export default LogoIcon;
