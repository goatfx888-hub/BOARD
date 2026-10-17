import React from 'react';
import { Player, KitConfig } from '../types';

interface PlayerCardProps {
  player: Player;
  kit: KitConfig;
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  showChemistry?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  teamType?: 'home' | 'away';
  tokenDisplayMode?: 'number' | 'position';
}

const PlayerCardComponent: React.FC<PlayerCardProps> = ({
  player,
  kit,
  isSelected = false,
  onClick,
  onDoubleClick,
  size = 'md',
  showName = true,
  teamType,
  tokenDisplayMode = 'number',
}) => {
  const isGK = player.position === 'GK';
  const shirtPrimary = isGK ? kit.gkPrimaryColor : kit.primaryColor;
  const shirtSecondary = isGK ? kit.gkSecondaryColor : kit.secondaryColor;

  // Original standard player token dimensions
  const tokenDimensions =
    size === 'sm'
      ? 'w-[28px] h-[28px] sm:w-[30px] sm:h-[30px] md:w-[32px] md:h-[32px] lg:w-[34px] lg:h-[34px] text-[9px] sm:text-[10px] md:text-[11px]'
      : size === 'lg'
      ? 'w-[36px] h-[36px] sm:w-[38px] sm:h-[38px] md:w-[42px] md:h-[42px] lg:w-[46px] lg:h-[46px] text-[11px] sm:text-[12px] md:text-[13px]'
      : 'w-[32px] h-[32px] sm:w-[34px] sm:h-[34px] md:w-[36px] md:h-[36px] lg:w-[38px] lg:h-[38px] text-[10px] sm:text-[11px] md:text-[12px]';

  const nameBannerWidth =
    size === 'sm'
      ? 'max-w-[68px] sm:max-w-[76px] md:max-w-[86px] lg:max-w-[94px]'
      : size === 'lg'
      ? 'max-w-[84px] sm:max-w-[96px] md:max-w-[108px] lg:max-w-[120px]'
      : 'max-w-[76px] sm:max-w-[86px] md:max-w-[96px] lg:max-w-[106px]';

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`group relative flex flex-col items-center cursor-pointer select-none touch-none transition-[filter] duration-200 ease-out ${
        isSelected
          ? 'z-30 drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)]'
          : 'hover:z-20'
      }`}
    >
      {/* Jersey / Avatar Token Container */}
      <div className="relative flex items-center justify-center [backface-visibility:hidden] [transform:translate3d(0,0,0)]">
        {/* Custom Shirt Graphic Icon or Uploaded Player Avatar */}
        <div
          className={`relative flex items-center justify-center rounded-full border shadow-md transition-[border-color,box-shadow,transform] duration-200 ease-out overflow-hidden ${tokenDimensions} ${
            isSelected
              ? 'border-white shadow-md'
              : 'border-white/80 group-hover:border-white'
          }`}
          style={{
            background: player.avatarUrl
              ? '#0f172a'
              : kit.pattern === 'stripes_vertical'
              ? `repeating-linear-gradient(90deg, ${shirtPrimary}, ${shirtPrimary} 6px, ${shirtSecondary} 6px, ${shirtSecondary} 12px)`
              : kit.pattern === 'hoops_horizontal'
              ? `repeating-linear-gradient(0deg, ${shirtPrimary}, ${shirtPrimary} 6px, ${shirtSecondary} 6px, ${shirtSecondary} 12px)`
              : kit.pattern === 'sash_diagonal'
              ? `linear-gradient(135deg, ${shirtPrimary} 40%, ${shirtSecondary} 40%, ${shirtSecondary} 60%, ${shirtPrimary} 60%)`
              : kit.pattern === 'half_half'
              ? `linear-gradient(90deg, ${shirtPrimary} 50%, ${shirtSecondary} 50%)`
              : shirtPrimary,
          }}
        >
          {player.avatarUrl ? (
            <>
              <img
                src={player.avatarUrl}
                alt={player.shortName || player.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span
                className="absolute bottom-0 right-0 bg-slate-950/85 text-[7.5px] sm:text-[8px] font-black px-1 rounded-tl text-amber-400 border-t border-l border-slate-700"
              >
                {player.number !== undefined && player.number !== null ? player.number : ''}
              </span>
            </>
          ) : (
            /* Shirt Number in Middle - Just Numbers, Never Position */
            <span
              className="font-black text-[9px] sm:text-[10px] md:text-[12px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] tracking-tight"
              style={{ color: kit.numberColor || '#ffffff' }}
            >
              {player.number !== undefined && player.number !== null ? player.number : ''}
            </span>
          )}
        </div>
      </div>

      {/* Player Name Banner (Only actual player names when enabled, NEVER positions under players) */}
      {(() => {
        const rawName = (player.shortName || player.name || '').trim();
        const isPosName = !rawName || rawName.toUpperCase() === (player.position || '').trim().toUpperCase();
        if (!showName || isPosName) return null;

        return (
          <div
            className={`mt-0.5 sm:mt-1 ${nameBannerWidth} px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md shadow-md text-center border backdrop-blur-md transition-all duration-200 ease-out flex items-center justify-center ${
              isSelected
                ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-black ring-1 ring-emerald-400 shadow-md shadow-emerald-950/60 scale-105'
                : 'bg-slate-950/90 text-white border-white/30 font-bold hover:border-emerald-400 hover:scale-105 shadow-black/80'
            }`}
          >
            <div className="flex items-center justify-center gap-1 overflow-hidden w-full">
              {player.isCaptain && (
                <span className="text-[7.5px] sm:text-[8px] font-black px-1 py-0.2 rounded bg-amber-400 text-slate-950 shrink-0 leading-none shadow-sm">
                  C
                </span>
              )}
              {player.flag && <span className="text-[7.5px] sm:text-[9px] leading-none shrink-0">{player.flag}</span>}
              <span className="text-[8.5px] sm:text-[10px] md:text-[11px] font-black truncate tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-tight">
                {rawName}
              </span>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export const PlayerCard = React.memo(PlayerCardComponent);
