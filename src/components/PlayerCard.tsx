import React from 'react';
import { Player, KitConfig } from '../types';
import { Shield, Sparkles, Award, Footprints, Target, Flag } from 'lucide-react';

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

  // Proportional token sizes: slightly larger on phone devices for improved touch & legibility, keeping tablet & desktop optimal
  const tokenDimensions =
    size === 'sm'
      ? 'w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] md:w-[31px] md:h-[31px] lg:w-[34px] lg:h-[34px] text-[8.5px] sm:text-[9.5px] md:text-[10px]'
      : size === 'lg'
      ? 'w-[34px] h-[34px] sm:w-[35px] sm:h-[35px] md:w-[38px] md:h-[38px] lg:w-[41px] lg:h-[41px] text-[10.5px] sm:text-xs md:text-[13px]'
      : 'w-[30.5px] h-[30.5px] sm:w-[31px] sm:h-[31px] md:w-[34px] md:h-[34px] lg:w-[37px] lg:h-[37px] text-[9.5px] sm:text-[10px] md:text-[10.5px]';

  const nameBannerWidth =
    size === 'sm'
      ? 'max-w-[54px] sm:max-w-[62px] md:max-w-[70px] lg:max-w-[76px]'
      : size === 'lg'
      ? 'max-w-[66px] sm:max-w-[76px] md:max-w-[86px] lg:max-w-[94px]'
      : 'max-w-[60px] sm:max-w-[68px] md:max-w-[76px] lg:max-w-[82px]';

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`group relative flex flex-col items-center cursor-pointer select-none touch-none transition-[transform,filter] duration-200 ease-out transform ${
        isSelected
          ? 'scale-110 z-30 drop-shadow-[0_0_12px_rgba(16,185,129,0.85)]'
          : 'hover:scale-105 hover:z-20'
      }`}
    >
      {/* Jersey / Avatar Token Container */}
      <div className="relative flex items-center justify-center">
        {/* Special Roles Badges (Captain C, PK) */}
        <div className="absolute -top-1 -right-1 z-20 flex gap-0.5">
          {player.isCaptain && (
            <span
              title="Captain"
              className="bg-amber-400 text-slate-950 font-black text-[6.5px] sm:text-[7.5px] w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex items-center justify-center border border-slate-950 shadow"
            >
              C
            </span>
          )}
          {player.isPenaltyTaker && (
            <span
              title="Penalty Taker"
              className="bg-rose-500 text-white font-black text-[6px] sm:text-[7px] w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex items-center justify-center border border-slate-950 shadow"
            >
              PK
            </span>
          )}
        </div>

        {/* Custom Shirt Graphic Icon or Uploaded Player Avatar */}
        <div
          className={`relative flex items-center justify-center rounded-full border-2 shadow-md transition-[border-color,box-shadow,transform] duration-200 ease-out overflow-hidden ${tokenDimensions} ${
            isSelected
              ? 'border-emerald-400 ring-2 ring-emerald-400/80 scale-105'
              : 'border-white/90 group-hover:border-white'
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
                {player.number || player.position}
              </span>
            </>
          ) : (
            /* Shirt Position or Number Icon */
            <span
              className="font-black text-[8.5px] sm:text-[9.5px] md:text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] tracking-tighter uppercase"
              style={{ color: kit.numberColor || '#ffffff' }}
            >
              {tokenDisplayMode === 'position'
                ? player.position
                : (player.number !== undefined && player.number !== null && player.number > 0
                  ? player.number
                  : player.position)}
            </span>
          )}
        </div>
      </div>

      {/* Name Tag Banner */}
      {showName && (
        <div
          className={`mt-0.5 ${nameBannerWidth} px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded sm:rounded-md shadow-md text-center border backdrop-blur-md transition-[background-color,border-color,color] duration-200 ease-out ${
            isSelected
              ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-extrabold shadow-emerald-500/30'
              : 'bg-slate-950/90 text-slate-100 border-white/20 font-semibold group-hover:border-white/40'
          }`}
        >
          <div className="flex items-center justify-center gap-0.5 sm:gap-1 overflow-hidden">
            {player.flag && <span className="text-[7.5px] sm:text-[10px] leading-none shrink-0">{player.flag}</span>}
            <span className="text-[8px] sm:text-[9.5px] md:text-[10.5px] truncate tracking-tight font-sans">
              {player.shortName || player.name || player.position}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export const PlayerCard = React.memo(PlayerCardComponent);
