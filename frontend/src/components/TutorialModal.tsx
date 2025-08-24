'use client'

import { X, Coins, Timer, Trophy, Zap, Shield, Eye, Play, Users, Star, Clock } from 'lucide-react'

interface TutorialModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Enhanced modal */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 max-w-5xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl mx-4 backdrop-blur-lg">
        {/* Enhanced header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                How to Master Last Man Standing
              </h2>
              <p className="text-gray-400 text-sm mt-1">Your complete guide to Web3 survival</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-xl transition-colors border border-slate-600/30"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Enhanced content with better spacing and visuals */}
        <div className="space-y-8">
          {/* Game Basics */}
          <section className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl p-6 border border-white/5">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Play className="w-5 h-5 text-purple-400" />
              </div>
              <span>Game Basics</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <Coins className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="text-white font-medium mb-2">Make Your Deposit</h4>
                <p className="text-gray-300 text-sm">
                  Each deposit = <span className="text-purple-400 font-semibold">0.01 ETH + 0.5% of current pot</span>
                </p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <Timer className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="text-white font-medium mb-2">24-Hour Countdown</h4>
                <p className="text-gray-300 text-sm">
                  Every deposit <span className="text-blue-400 font-semibold">resets the timer</span> to 24 hours
                </p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 border border-green-500/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <Trophy className="w-5 h-5 text-green-400" />
                </div>
                <h4 className="text-white font-medium mb-2">Last Player Wins</h4>
                <p className="text-gray-300 text-sm">
                  No deposits for 24h? <span className="text-green-400 font-semibold">You win everything!</span>
                </p>
              </div>
            </div>
          </section>

          {/* Bonus System */}
          <section className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl p-6 border border-white/5">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <span>Bonus Reward System</span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-4 border border-yellow-500/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <Users className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h4 className="text-white font-medium">Every 10th Player Wins!</h4>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Players #10, #20, #30, etc. automatically receive a <span className="text-yellow-400 font-semibold">random bonus of 1-5%</span> of the current pot.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-4 border border-purple-500/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Star className="w-5 h-5 text-purple-400" />
                    </div>
                    <h4 className="text-white font-medium">Verifiable Randomness</h4>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Bonus percentages are generated using <span className="text-purple-400 font-semibold">VRF technology</span> for complete fairness and transparency.
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-6 border border-white/5">
                <h4 className="text-white font-medium mb-4 text-center">Bonus Calculation Example</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-slate-700/50 rounded">
                    <span className="text-gray-300">Current Pot:</span>
                    <span className="text-white font-mono">10 ETH</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-700/50 rounded">
                    <span className="text-gray-300">Random Bonus:</span>
                    <span className="text-yellow-400 font-mono">3%</span>
                  </div>
                  <div className="border-t border-gray-600 my-2"></div>
                  <div className="flex justify-between items-center p-2 bg-green-900/30 rounded border border-green-500/30">
                    <span className="text-green-400 font-medium">Your Bonus:</span>
                    <span className="text-green-400 font-mono font-bold">0.3 ETH</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Features */}
          <section className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl p-6 border border-white/5">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <span>Advanced Technology</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg p-4 border border-blue-500/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <h4 className="text-white font-medium">Blocklock Encryption</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Bonus percentages are <span className="text-blue-400">encrypted and revealed</span> only after round completion for maximum fairness.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-4 border border-green-500/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <Eye className="w-5 h-5 text-green-400" />
                    <h4 className="text-white font-medium">Full Transparency</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    All randomness and payouts are <span className="text-green-400">verifiable on-chain</span> with complete transaction history.
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-6 border border-white/5">
                <h4 className="text-white font-medium mb-4">Technology Stack</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">Base Sepolia Testnet</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">dcipher VRF for Randomness</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Blocklock for Encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-300">Smart Contract Automation</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Strategy Guide */}
          <section className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl p-6 border border-white/5">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <span>Winning Strategies</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-4 rounded-lg border border-green-500/30">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Play className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-green-400 font-medium mb-2">Early Entry</h4>
                  <p className="text-gray-300 text-xs">Join early for lower deposit costs and better positioning</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 p-4 rounded-lg border border-yellow-500/30">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h4 className="text-yellow-400 font-medium mb-2">Bonus Hunting</h4>
                  <p className="text-gray-300 text-xs">Time your deposits to hit bonus milestones (10th, 20th, etc.)</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-4 rounded-lg border border-blue-500/30">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Timer className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-blue-400 font-medium mb-2">Time Watching</h4>
                  <p className="text-gray-300 text-xs">Monitor the countdown closely for strategic late entries</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-4 rounded-lg border border-purple-500/30">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="text-purple-400 font-medium mb-2">Persistence</h4>
                  <p className="text-gray-300 text-xs">Remember: you only lose if you stop playing!</p>
                </div>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-xl p-6 border border-yellow-500/30">
            <h4 className="text-yellow-400 font-semibold mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Important Information</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">This is deployed on <span className="text-yellow-400">Base Sepolia testnet</span> - use test ETH only</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">Get free test ETH from the <span className="text-blue-400">faucet link</span> in navigation</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">Each round is <span className="text-purple-400">independent</span> - new rounds start automatically</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">Reserved bonus amounts are <span className="text-green-400">excluded</span> from main pot display</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">All transactions are <span className="text-red-400">final</span> - understand risks before playing</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">Smart contracts handle all <span className="text-orange-400">payouts automatically</span></span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Enhanced Footer */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/20">
              <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                Ready to Become the Last Man Standing?
              </h4>
              <p className="text-gray-300 mb-4">
                The ultimate test of strategy, timing, and persistence in the Web3 arena.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Start Playing Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}