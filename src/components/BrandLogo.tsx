import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  variant?: 'full' | 'icon-only';
  imageUrl?: string | null; // Custom logo from DB — overrides SVG when set
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  variant = 'full',
  imageUrl,
}) => {
  const sizeMap = {
    sm: { svgW: 46, svgH: 36, imgH: 36, text: 'text-sm',  tag: 'text-[9px]'  },
    md: { svgW: 64, svgH: 48, imgH: 48, text: 'text-base', tag: 'text-[10px]' },
    lg: { svgW: 92, svgH: 70, imgH: 70, text: 'text-xl',   tag: 'text-xs'     },
    xl: { svgW: 140, svgH: 106, imgH: 106, text: 'text-3xl', tag: 'text-sm'   },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Logo icon — custom image if set, otherwise the SVG car */}
      <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Dani & Miki Auto Solution Logo"
            style={{ height: current.imgH, width: 'auto', maxWidth: current.svgW * 1.4 }}
            className="object-contain drop-shadow-[0_0_8px_rgba(255,0,0,0.35)]"
          />
        ) : (
          <svg
          width={current.svgW}
          height={current.svgH}
          viewBox="0 0 500 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible filter drop-shadow-[0_0_8px_rgba(255,0,0,0.35)]"
        >
          {/* --- EXACT TEMPLATE CAR SILHOUETTE (RED #FF0000) --- */}
          
          {/* 1. Upper Windshield & Roof Outline */}
          <path
            d="M135 178 C145 140, 160 120, 205 110 C240 102, 290 102, 335 115 C370 126, 385 145, 395 178 C355 174, 280 170, 205 172 C165 173, 145 176, 135 178 Z"
            fill="#FF0000"
          />
          {/* Upper Roof Top Highlight Edge */}
          <path
            d="M190 103 C235 96, 295 96, 345 106 C365 110, 345 104, 310 101 C265 97, 215 98, 190 103 Z"
            fill="#FF0000"
          />

          {/* 2. Left Side Mirror */}
          <path
            d="M100 178 C90 178, 80 185, 80 195 C80 206, 92 212, 108 212 C118 212, 128 206, 130 198 C122 196, 110 192, 100 186 C94 182, 95 178, 100 178 Z"
            fill="#FF0000"
          />
          <path
            d="M92 194 C92 188, 100 186, 108 190 C114 193, 114 198, 106 200 C98 202, 92 200, 92 194 Z"
            fill="#000000"
          />

          {/* 3. Right Side Mirror */}
          <path
            d="M400 178 C410 178, 420 185, 420 195 C420 206, 408 212, 392 212 C382 212, 372 206, 370 198 C378 196, 390 192, 400 186 C406 182, 405 178, 400 178 Z"
            fill="#FF0000"
          />
          <path
            d="M408 194 C408 188, 400 186, 392 190 C386 193, 386 198, 394 200 C402 202, 408 200, 408 194 Z"
            fill="#000000"
          />

          {/* 4. Upper Hood Line / Cowl */}
          <path
            d="M110 216 C160 192, 230 184, 300 184 C360 184, 405 194, 425 210 C395 200, 340 192, 280 192 C210 192, 150 202, 110 216 Z"
            fill="#FF0000"
          />

          {/* 5. Lower Sweeping Hood Arch (Left to Center) */}
          <path
            d="M70 248 C120 218, 200 204, 280 204 C340 204, 390 212, 430 228 C375 216, 310 212, 250 212 C170 212, 110 226, 70 248 Z"
            fill="#FF0000"
          />

          {/* 6. Dynamic Bottom-Right Aerodynamic Blade Swoosh */}
          <path
            d="M270 236 C320 218, 370 222, 415 240 C432 248, 442 262, 445 272 C440 260, 420 250, 390 248 C340 244, 300 258, 280 266 C270 270, 265 270, 260 268 C255 264, 258 244, 270 236 Z"
            fill="#FF0000"
          />

          {/* --- 7. D&M AT THE BOTTOM OF THE CAR TEMPLATE --- */}
          <g id="dm-bottom-text">
            {/* Letter 'D' */}
            <path
              d="M 180 300 L 180 355 L 202 355 C 220 355, 230 345, 230 327.5 C 230 310, 220 300, 202 300 Z M 193 312 L 200 312 C 212 312, 217 318, 217 327.5 C 217 337, 212 343, 200 343 L 193 343 Z"
              fill="#FF0000"
            />

            {/* Ampersand '&' with sleek dynamic cut */}
            <path
              d="M 252 322 C 255 317, 258 310, 255 305 C 252 300, 244 300, 241 304 C 237 308, 238 315, 243 322 L 235 330 C 228 322, 226 312, 230 302 C 235 293, 249 292, 259 299 C 267 306, 267 316, 262 324 C 267 330, 274 336, 279 340 L 273 349 C 267 343, 261 337, 256 331 L 249 338 C 254 344, 262 346, 268 346 L 271 354 C 260 355, 248 352, 240 342 C 234 334, 234 324, 240 316 Z"
              fill="#FF0000"
            />

            {/* Letter 'M' */}
            <path
              d="M 288 355 L 288 300 L 302 300 L 315 334 L 328 300 L 342 300 L 342 355 L 330 355 L 330 316 L 319 344 L 311 344 L 300 316 L 300 355 Z"
              fill="#FF0000"
            />
          </g>
        </svg>
        )}
      </div>

      {variant !== 'icon-only' && (
        /* Brand Name & Automotive Tagline */
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 tracking-tight font-black font-display uppercase leading-none">
            <span className="text-white group-hover:text-red-500 transition-colors">DANI</span>
            <span className="text-red-600 font-bold">&amp;</span>
            <span className="text-white group-hover:text-red-500 transition-colors">MIKI</span>
          </div>
          {showTagline && (
            <div className="flex items-center gap-2 mt-1">
              <span className={`tracking-[0.24em] uppercase font-bold text-red-500/90 font-mono ${current.tag}`}>
                AUTO SOLUTION
              </span>
              <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
