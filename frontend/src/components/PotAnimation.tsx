// 'use client'

// import { Trophy, Coins, Star, Zap } from 'lucide-react'
// import Image from 'next/image'

// interface PotAnimationProps {
//   potAmount: string
// }

// export function PotAnimation({ potAmount }: PotAnimationProps) {
//   const potValue = parseFloat(potAmount)
//   const isLarge = potValue > 1
//   const isHuge = potValue > 10
//   const isMassive = potValue > 100

//   return (
//     <div className="text-center relative">
//       {/* Main Pot Container with enhanced animations */}
//       <div className="relative mb-6">
//         {/* Outer glow ring */}
        
//         {/* Main pot image container */}
//         <div className="">
//           <Image
//             src="/favicon.png"
//             alt="Prize Pot"
//             width={48}
//             height={48}
//             className="drop-shadow-lg"
//             priority
//           />
//         </div>
        
       
        
        

        
//       </div>

//       {/* Enhanced Pot Amount Display */}
//       <div className="space-y-3">
//         <h2 className="text-2xl font-bold text-white flex items-center justify-center space-x-2">
//           <Trophy className="w-6 h-6 text-yellow-400" />
//           <span>Prize Pool</span>
//         </h2>
        
//         <div className={`transition-all duration-500 ${
//           isMassive 
//             ? 'text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 animate-pulse drop-shadow-lg' 
//             : isHuge 
//               ? 'text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 animate-pulse drop-shadow-md' 
//               : isLarge 
//                 ? 'text-3xl md:text-4xl font-bold text-yellow-400 drop-shadow-md' 
//                 : 'text-2xl md:text-3xl font-semibold text-yellow-300'
//         }`}>
//           {potAmount} ETH
//         </div>
        
//         {/* Dynamic status indicators */}
//         <div className="space-y-2">
//           <div className={`text-sm font-medium transition-all duration-300 ${
//             isMassive 
//               ? 'text-red-400 animate-pulse' 
//               : isHuge 
//                 ? 'text-orange-400' 
//                 : isLarge 
//                   ? 'text-yellow-400' 
//                   : 'text-gray-400'
//           }`}>
//             {isMassive && "🔥 LEGENDARY JACKPOT! 🔥"}
//             {isHuge && !isMassive && "💎 MASSIVE PRIZE POOL! 💎"}
//             {isLarge && !isHuge && "⚡ GROWING STRONG! ⚡"}
//             {!isLarge && "🌱 Building Momentum... 🌱"}
//           </div>
          
//           {/* Prize tier indicator */}
//           <div className="flex justify-center">
//             <div className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
//               isMassive
//                 ? 'bg-red-900/30 text-red-400 border-red-500/30'
//                 : isHuge
//                   ? 'bg-orange-900/30 text-orange-400 border-orange-500/30'
//                   : isLarge
//                     ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
//                     : 'bg-gray-800/30 text-gray-400 border-gray-600/30'
//             }`}>
//               {isMassive && "LEGENDARY TIER"}
//               {isHuge && !isMassive && "EPIC TIER"}
//               {isLarge && !isHuge && "RARE TIER"}
//               {!isLarge && "COMMON TIER"}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Ambient floating particles for visual appeal */}
//       {(isLarge || isHuge || isMassive) && (
//         <div className="absolute inset-0 pointer-events-none">
//           {Array.from({ length: isMassive ? 8 : isHuge ? 6 : 4 }, (_, i) => (
//             <div
//               key={i}
//               className={`absolute w-1 h-1 bg-yellow-400/60 rounded-full animate-bounce`}
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 2}s`,
//                 animationDuration: `${2 + Math.random() * 2}s`,
//               }}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

'use client'

import { Trophy, Coins, Star, Zap, Crown, Flame } from 'lucide-react'
import Image from 'next/image'

interface PotAnimationProps {
  potAmount: string
}

export function PotAnimation({ potAmount }: PotAnimationProps) {
  const potValue = parseFloat(potAmount)
  const isLarge = potValue > 1
  const isHuge = potValue > 10
  const isMassive = potValue > 100

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Main Pot Container with enhanced animations */}
      <div className="relative mb-8">
        {/* Outer magical rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outermost ring */}
          <div className={`absolute rounded-full border-2 transition-all duration-700 ${
            isMassive 
              ? 'w-72 h-72 border-red-400/30 animate-spin-slow shadow-[0_0_100px_rgba(239,68,68,0.3)]' 
              : isHuge 
                ? 'w-64 h-64 border-orange-400/30 animate-spin-slow shadow-[0_0_80px_rgba(251,146,60,0.3)]'
                : isLarge 
                  ? 'w-56 h-56 border-yellow-400/30 animate-spin-slow shadow-[0_0_60px_rgba(250,204,21,0.3)]'
                  : 'w-48 h-48 border-gray-400/20 animate-spin-slow'
          }`} style={{ animationDuration: '8s' }}></div>
          
          {/* Middle ring */}
          <div className={`absolute rounded-full border transition-all duration-700 ${
            isMassive 
              ? 'w-60 h-60 border-red-300/40 animate-spin-reverse shadow-[0_0_80px_rgba(252,165,165,0.4)]' 
              : isHuge 
                ? 'w-52 h-52 border-orange-300/40 animate-spin-reverse shadow-[0_0_60px_rgba(253,186,116,0.4)]'
                : isLarge 
                  ? 'w-44 h-44 border-yellow-300/40 animate-spin-reverse shadow-[0_0_40px_rgba(253,224,71,0.4)]'
                  : 'w-36 h-36 border-gray-300/30 animate-spin-reverse'
          }`} style={{ animationDuration: '6s' }}></div>
          
          {/* Inner ring */}
          <div className={`absolute rounded-full border-2 transition-all duration-700 ${
            isMassive 
              ? 'w-48 h-48 border-red-200/50 animate-pulse shadow-[0_0_60px_rgba(254,202,202,0.5)]' 
              : isHuge 
                ? 'w-40 h-40 border-orange-200/50 animate-pulse shadow-[0_0_50px_rgba(254,215,170,0.5)]'
                : isLarge 
                  ? 'w-32 h-32 border-yellow-200/50 animate-pulse shadow-[0_0_40px_rgba(254,240,138,0.5)]'
                  : 'w-24 h-24 border-gray-200/40 animate-pulse'
          }`}></div>
        </div>
        
        {/* Main pot image container with enhanced glow */}
        <div className={`relative z-10 transition-all duration-700 transform ${
          isMassive ? 'scale-150 animate-float' : isHuge ? 'scale-125 animate-float' : isLarge ? 'scale-110 animate-bounce-slow' : ''
        }`}>
          {/* Pot glow background */}
          <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-700 ${
            isMassive 
              ? 'bg-gradient-to-r from-red-400/60 via-orange-400/60 to-yellow-400/60 scale-150' 
              : isHuge 
                ? 'bg-gradient-to-r from-orange-400/50 via-yellow-400/50 to-amber-400/50 scale-125'
                : isLarge 
                  ? 'bg-yellow-400/40 scale-110'
                  : 'bg-gray-400/20'
          }`}></div>
          
          {/* Main pot image */}
          <div className="relative">
            <Image
              src="/favicon.png"
              alt="Prize Pot"
              width={120}
              height={120}
              className={`drop-shadow-2xl transition-all duration-500 ${
                isMassive ? 'filter saturate-150 brightness-110' : isHuge ? 'filter saturate-125' : ''
              }`}
              priority
            />
            
            {/* Crown for massive pots */}
            {isMassive && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <Crown className="w-8 h-8 text-yellow-300 drop-shadow-lg" />
              </div>
            )}
            
            {/* Fire effects for huge pots */}
            {isHuge && !isMassive && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 animate-pulse">
                <Flame className="w-6 h-6 text-orange-400 drop-shadow-lg" />
              </div>
            )}
            
            {/* Sparkle effects for large pots */}
            {isLarge && !isHuge && (
              <div className="absolute -top-4 -right-4 animate-spin">
                <Star className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
              </div>
            )}
          </div>
        </div>
        
        {/* Floating particles */}
        {(isLarge || isHuge || isMassive) && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: isMassive ? 12 : isHuge ? 8 : 6 }, (_, i) => (
              <div
                key={i}
                className={`absolute transition-all duration-700 ${
                  isMassive 
                    ? 'w-3 h-3 bg-gradient-to-r from-red-400 to-orange-400' 
                    : isHuge 
                      ? 'w-2.5 h-2.5 bg-gradient-to-r from-orange-400 to-yellow-400'
                      : 'w-2 h-2 bg-yellow-400'
                } rounded-full animate-float-particle opacity-80`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Pot Amount Display */}
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center space-x-3">
            <div className={`p-2 rounded-full transition-all duration-500 ${
              isMassive 
                ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-pulse shadow-lg' 
                : isHuge 
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 animate-pulse shadow-lg'
                  : isLarge 
                    ? 'bg-yellow-500/20 shadow-md'
                    : 'bg-gray-600/20'
            }`}>
              <Trophy className={`transition-all duration-500 ${
                isMassive ? 'w-8 h-8 text-white' : isHuge ? 'w-7 h-7 text-white' : isLarge ? 'w-6 h-6 text-yellow-400' : 'w-6 h-6 text-gray-400'
              }`} />
            </div>
            <span className={`transition-all duration-500 ${
              isMassive 
                ? 'bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent'
                : isHuge 
                  ? 'bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'
                  : isLarge 
                    ? 'text-yellow-400'
                    : 'text-gray-300'
            }`}>Prize Pool</span>
          </h2>
          
          <div className={`transition-all duration-700 ${
            isMassive 
              ? 'text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-orange-300 via-yellow-300 to-red-300 animate-pulse drop-shadow-2xl' 
              : isHuge 
                ? 'text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-300 animate-pulse drop-shadow-xl' 
                : isLarge 
                  ? 'text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-lg' 
                  : 'text-3xl md:text-5xl font-bold text-white drop-shadow-md'
          }`}>
            {potAmount}
            <span className={`ml-2 ${
              isMassive ? 'text-4xl md:text-6xl' : isHuge ? 'text-3xl md:text-5xl' : isLarge ? 'text-2xl md:text-4xl' : 'text-xl md:text-3xl'
            }`}>ETH</span>
          </div>
        </div>
        
        {/* Dynamic status indicators with enhanced styling */}
        <div className="space-y-4">
          <div className={`text-lg md:text-xl font-bold transition-all duration-500 ${
            isMassive 
              ? 'text-red-300 animate-pulse text-shadow-glow' 
              : isHuge 
                ? 'text-orange-300 animate-pulse'
                : isLarge 
                  ? 'text-yellow-300'
                  : 'text-gray-400'
          }`}>
            {isMassive && (
              <div className="flex items-center justify-center space-x-2">
                <Flame className="w-6 h-6 animate-bounce" />
                <span>🔥 LEGENDARY JACKPOT! 🔥</span>
                <Flame className="w-6 h-6 animate-bounce" />
              </div>
            )}
            {isHuge && !isMassive && (
              <div className="flex items-center justify-center space-x-2">
                <Crown className="w-6 h-6 animate-bounce" />
                <span>💎 MASSIVE PRIZE POOL! 💎</span>
                <Crown className="w-6 h-6 animate-bounce" />
              </div>
            )}
            {isLarge && !isHuge && (
              <div className="flex items-center justify-center space-x-2">
                <Zap className="w-5 h-5 animate-pulse" />
                <span>⚡ GROWING STRONG! ⚡</span>
                <Zap className="w-5 h-5 animate-pulse" />
              </div>
            )}
            {!isLarge && (
              <div className="flex items-center justify-center space-x-2">
                <Star className="w-5 h-5" />
                <span>🌱 Building Momentum... 🌱</span>
                <Star className="w-5 h-5" />
              </div>
            )}
          </div>
          
         
        </div>
      </div>

      {/* Enhanced floating energy orbs */}
      {(isLarge || isHuge || isMassive) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: isMassive ? 15 : isHuge ? 10 : 8 }, (_, i) => (
            <div
              key={`orb-${i}`}
              className={`absolute rounded-full transition-all duration-700 ${
                isMassive 
                  ? 'w-4 h-4 bg-gradient-to-r from-red-400/70 via-orange-400/70 to-yellow-400/70 shadow-[0_0_20px_rgba(251,146,60,0.5)]' 
                  : isHuge 
                    ? 'w-3 h-3 bg-gradient-to-r from-orange-400/60 via-yellow-400/60 to-amber-400/60 shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                    : 'w-2 h-2 bg-yellow-400/50 shadow-[0_0_10px_rgba(250,204,21,0.3)]'
              } animate-float-orb`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 1;
          }
        }
        
        @keyframes float-orb {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
            opacity: 0.4;
          }
          25% { 
            transform: translateY(-30px) translateX(10px) scale(1.1); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-60px) translateX(-5px) scale(0.9); 
            opacity: 1;
          }
          75% { 
            transform: translateY(-30px) translateX(-15px) scale(1.05); 
            opacity: 0.6;
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-float-particle {
          animation: float-particle 4s ease-in-out infinite;
        }
        
        .animate-float-orb {
          animation: float-orb 6s ease-in-out infinite;
        }
        
        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
        }
      `}</style>
    </div>
  )
}