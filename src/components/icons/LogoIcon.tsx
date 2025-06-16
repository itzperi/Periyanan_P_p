import type React from 'react';

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
}

const LogoIcon: React.FC<LogoIconProps> = ({ width = 130, height = 32, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 220 50" // Adjusted viewBox for better spacing if AI part gets longer
    width={width}
    height={height}
    aria-labelledby="logoTitle"
    {...props}
  >
    <title id="logoTitle">OmniMeet AI Logo</title>
    <defs>
      <linearGradient id="logoGradientOm" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))", stopOpacity: 1 }} /> 
      </linearGradient>
       <linearGradient id="logoGradientAi" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))", stopOpacity: 0.7 }} />
      </linearGradient>
    </defs>
    {/* Using var(--font-headline) if defined in CSS, otherwise Inter */}
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .logo-text { font-family: 'Inter', sans-serif; }
      `}
    </style>
    <text
      className="logo-text"
      x="5"
      y="38" // Adjusted y for better vertical alignment in new viewBox
      fontSize="36" // Slightly larger font
      fontWeight="800" // Bolder
      fill="url(#logoGradientOm)"
      letterSpacing="-0.5"
    >
      OmniMeet
    </text>
    <text
      className="logo-text"
      x="178" // Adjusted x for spacing
      y="38" // Adjusted y
      fontSize="36" // Match size
      fontWeight="800" // Match weight
      fill="url(#logoGradientAi)"
       letterSpacing="-0.5"
    >
      AI
    </text>
  </svg>
);

export default LogoIcon;
