"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useSwitchChain,
} from "wagmi";
import { formatEther } from "viem";
import {
  Timer,
  Coins,
  Trophy,
  Users,
  ExternalLink,
  HelpCircle,
  Wallet,
  Clock,
  Zap,
  AlertTriangle,
  TrendingUp,
  Play,
  Star,

  Copy,
  Check,
} from "lucide-react";
import { useGame } from "../hooks/useGame";
import { TutorialModal } from "../components/TutorialModal";
import { PotAnimation } from "../components/PotAnimation";
import { BASE_SEPOLIA_CHAIN, getPreferredConnector } from "../utils/wagmi";
import Image from "next/image"

export default function HomePage() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState("");

  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  // Get user's ETH balance
  const { data: balance } = useBalance({
    address: address,
    chainId: BASE_SEPOLIA_CHAIN.id,
  });

  const {
    currentRound,
    availablePot,
    bonusWinners,
    timeLeft,
    isDepositing,
    isClaimPending,
    isTimeoutPending,
    nextDepositAmount,
    depositCount,
    formattedTimeLeft,
    isCurrentUserLastDepositor,
    canClaimWinnings,
    canTriggerTimeout,
    makeDeposit,
    claimPrize,
    triggerTimeout,
    error,
    isCorrectChain,
    roundLoading,
    clearError,
  } = useGame();

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleConnect = () => {
    const preferredConnector = getPreferredConnector();
    if (preferredConnector) {
      connect({ connector: preferredConnector });
    } else {
      // Fallback to injected
      const injectedConnector = connectors.find(
        (connector) => connector.id === "injected"
      );
      if (injectedConnector) {
        connect({ connector: injectedConnector });
      }
    }
  };

  const handleSwitchChain = () => {
    switchChain({ chainId: BASE_SEPOLIA_CHAIN.id });
  };

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(type);
      setTimeout(() => setCopiedAddress(""), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const recentBonusWinners = bonusWinners
    .filter((winner) => winner.revealed)
    .slice(-5);

  // Check if we have insufficient balance
  const hasInsufficientBalance =
    balance && currentRound && balance.value < currentRound.nextDepositAmount;

  // Show loading state until component is mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-400/20 border-t-purple-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-2 border-pink-400/30 rounded-full animate-ping"></div>
          </div>
          <p className="text-white mt-6 font-medium">Loading Game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Animated particles */}
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-blue-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "2.5s" }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Enhanced Navigation */}
        <nav className="p-4 sm:p-6 bg-slate-900/30 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 ">
                <Image
                  src="/favicon.png"
                  alt="Logo"
                  width={30}
                  height={30}
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Last Man Standing
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">
                  Web3 Survival Game
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setShowTutorial(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg transition-all hover:scale-105 backdrop-blur-sm border border-purple-500/30"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Tutorial</span>
              </button>

              <a
                href="https://www.alchemy.com/faucets/base-sepolia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-all hover:scale-105 backdrop-blur-sm border border-blue-500/30"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Get ETH</span>
              </a>

              {!isConnected ? (
                <button
                  onClick={handleConnect}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm text-gray-300 font-mono">
                      {formatAddress(address || "")}
                    </div>
                    <div className="text-xs text-gray-400">
                      {balance
                        ? `${parseFloat(formatEther(balance.value)).toFixed(
                            4
                          )} ETH`
                        : "0 ETH"}
                    </div>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-all backdrop-blur-sm border border-red-500/30"
                  >
                    <span className="hidden sm:inline">Disconnect</span>
                    <span className="sm:hidden">×</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Error Display */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
            <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 flex items-start space-x-3 backdrop-blur-sm">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-400 font-medium">Transaction Error</p>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-300 text-xl leading-none"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Chain Warning */}
        {isConnected && !isCorrectChain && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
            <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-yellow-400 font-medium">Wrong Network</p>
                  <p className="text-yellow-300 text-sm">
                    Switch to Base Sepolia testnet
                  </p>
                </div>
              </div>
              <button
                onClick={handleSwitchChain}
                className="px-4 py-2 bg-yellow-600/80 hover:bg-yellow-600 text-white rounded-lg transition-all backdrop-blur-sm border border-yellow-500/30"
              >
                Switch Network
              </button>
            </div>
          </div>
        )}

        {/* Game Title */}
        <div className="text-center py-6 px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
            The Ultimate Web3 Survival Game
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-1">
            <span className="text-red-400 font-semibold">
              The only way you lose is if you stop playing.
            </span>
          </p>
          <div className="font-semibold text-orange-400 mb-8">
            Dynamic deposits, bonus rewards, built on Base Sepolia Testnet.
          </div>
        </div>

        {/* Loading State */}
        {roundLoading && (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <div className="w-12 h-12 border-4 border-purple-400/20 border-t-purple-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-2 border-pink-400/30 rounded-full animate-ping"></div>
            </div>
            <p className="text-white mt-6 font-medium">Loading game data...</p>
          </div>
        )}

        {/* Main Game Content - Integrated Layout */}
        {!roundLoading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
            <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                
                {/* Left Panel - Game Stats & Current Leader */}
                <div className="bg-slate-800/40 backdrop-blur-lg p-6 border-r border-white/10">
                  <div className="space-y-6">
                    {/* Game Statistics */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                        Game Stats
                      </h3>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-3 text-center border border-white/5">
                          <div className="flex items-center justify-center mb-2">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                              <Users className="w-4 h-4 text-blue-400" />
                            </div>
                          </div>
                          <div className="text-xl font-bold text-white mb-1">
                            {depositCount}
                          </div>
                          <div className="text-xs text-gray-400">Players</div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-3 text-center border border-white/5">
                          <div className="flex items-center justify-center mb-2">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                              <Coins className="w-4 h-4 text-green-400" />
                            </div>
                          </div>
                          <div className="text-xl font-bold text-white mb-1">
                            {nextDepositAmount}
                          </div>
                          <div className="text-xs text-gray-400">Next (ETH)</div>
                        </div>
                      </div>

                      {/* Round Information */}
                      {currentRound && (
                        <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl p-3 border border-white/5">
                          <div className="flex items-center mb-2">
                            <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
                            <span className="text-white font-medium text-sm">Round Info</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="space-y-1">
                              <div className="flex justify-between text-gray-300">
                                <span>Round:</span>
                                <span className="font-mono text-purple-400">
                                  #{currentRound.roundId.toString()}
                                </span>
                              </div>
                              <div className="flex justify-between text-gray-300">
                                <span>Status:</span>
                                <span
                                  className={`font-medium text-xs ${
                                    currentRound.isActive
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {currentRound.isActive ? "🟢 Active" : "🔴 Ended"}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-gray-300">
                                <span>Prize:</span>
                                <span className="font-semibold text-yellow-400">
                                  {availablePot} ETH
                                </span>
                              </div>
                              <div className="flex justify-between text-gray-300">
                                <span>Players:</span>
                                <span className="font-semibold text-blue-400">
                                  {depositCount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Current Leader */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-blue-400" />
                        Current Leader
                      </h3>
                      {currentRound?.lastDepositor &&
                        currentRound.lastDepositor !==
                          "0x0000000000000000000000000000000000000000" ? (
                        <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-4 border border-blue-500/30">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="text-blue-400 font-mono text-sm flex-1 mr-2">
                                {formatAddress(currentRound.lastDepositor)}
                              </div>
                              <button
                                onClick={() => copyToClipboard(currentRound.lastDepositor, 'leader')}
                                className="p-1 hover:bg-blue-500/20 rounded transition-colors"
                                title="Copy full address"
                              >
                                {copiedAddress === 'leader' ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4 text-blue-400" />
                                )}
                              </button>
                            </div>
                            <div className="text-gray-400 text-xs">
                              Player #{currentRound.depositCount.toString()}
                            </div>
                            <div className="text-center">
                              <div className="text-white font-medium text-sm">
                                Leading
                              </div>
                              <div className="text-blue-400 text-xs">
                                {currentRound.lastDepositor.toLowerCase() ===
                                address?.toLowerCase()
                                  ? "👑 You!"
                                  : "🎯 Them"}
                              </div>
                            </div>
                            {isCurrentUserLastDepositor && (
                              <div className="mt-2 p-2 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg border border-green-500/30">
                                <div className="flex items-center justify-center space-x-2">
                                  <Star className="w-4 h-4 text-green-400 animate-pulse" />
                                  <span className="text-green-400 font-medium text-sm">
                                    {"You're winning!"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-gray-800/30 to-slate-800/30 rounded-xl p-4 border border-gray-500/30">
                          <div className="text-center py-4">
                            <div className="text-gray-400 text-sm mb-1">
                              No leader yet
                            </div>
                            <div className="text-gray-500 text-xs">
                              Waiting for first player...
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Center Panel - Pot & Timer */}
                <div className="flex flex-col justify-center">
                  <PotAnimation potAmount={availablePot} />
                  
                  {/* Timer directly below pot */}
                  <div className="p-6">
                    {currentRound?.isActive && currentRound?.depositCount > 0 ? (
                      <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-xl p-4 border border-red-500/30">
                        <div className="flex items-center justify-center mb-3">
                          <div className="p-1 bg-red-500/20 rounded-lg mr-2">
                            <Timer className="w-5 h-5 text-red-400" />
                          </div>
                          <span className="text-red-400 font-semibold">
                            Time Remaining
                          </span>
                        </div>
                        <div className="text-2xl font-mono font-bold text-center text-white mb-1">
                          {formattedTimeLeft}
                        </div>
                        <div className="text-center text-gray-400 text-xs">
                          {timeLeft === 0
                            ? "⏰ Time's up! Click to end round"
                            : "⏳ Until round ends"}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-gray-800/30 to-slate-800/30 rounded-xl p-4 border border-gray-500/30">
                        <div className="flex items-center justify-center mb-3">
                          <div className="p-1 bg-gray-500/20 rounded-lg mr-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                          </div>
                          <span className="text-gray-400 font-semibold">
                            Waiting for Players
                          </span>
                        </div>
                        <div className="text-2xl font-mono font-bold text-center text-white mb-1">
                          --:--:--
                        </div>
                        <div className="text-center text-gray-400 text-xs">
                          ⏳ Timer starts with first deposit
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel - Actions & Recent Bonuses */}
                <div className="bg-slate-800/40 backdrop-blur-lg p-6 border-l border-white/10">
                  <div className="space-y-6">
                    {/* Action Buttons */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Play className="w-5 h-5 mr-2 text-green-400" />
                        Actions
                      </h3>
                      
                      {/* Insufficient Balance Warning */}
                      {isConnected && hasInsufficientBalance && (
                        <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-xl p-3 mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-orange-400" />
                            <span className="text-orange-400 font-semibold text-sm">
                              Insufficient Balance
                            </span>
                          </div>
                          <p className="text-orange-300 text-xs">
                            Need {nextDepositAmount} ETH but have{" "}
                            {balance ? formatEther(balance.value) : "0"} ETH
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        {/* Deposit Button */}
                        {isConnected &&
                          isCorrectChain &&
                          currentRound?.isActive && (
                            <button
                              onClick={makeDeposit}
                              disabled={
                                isDepositing ||
                                !currentRound?.isActive ||
                                hasInsufficientBalance
                              }
                              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all transform text-sm ${
                                isDepositing || hasInsufficientBalance
                                  ? "bg-gray-600/50 cursor-not-allowed border border-gray-500/30"
                                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105 active:scale-95 shadow-lg border border-green-500/30"
                              } text-white`}
                            >
                              {isDepositing ? (
                                <div className="flex items-center justify-center space-x-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Processing...</span>
                                </div>
                              ) : hasInsufficientBalance ? (
                                <div className="flex items-center justify-center space-x-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  <span>Insufficient Balance</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center space-x-2">
                                  <Play className="w-4 h-4" />
                                  <span>Join - {nextDepositAmount} ETH</span>
                                </div>
                              )}
                            </button>
                          )}

                        {/* Claim/Timeout Buttons */}
                        {canClaimWinnings && (
                          <button
                            onClick={() => claimPrize(currentRound!.roundId)}
                            disabled={isClaimPending}
                            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 text-sm"
                          >
                            {isClaimPending ? (
                              <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Claiming...</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center space-x-2">
                                <Trophy className="w-4 h-4" />
                                <span>Claim Victory!</span>
                              </div>
                            )}
                          </button>
                        )}

                        {canTriggerTimeout && (
                          <button
                            onClick={triggerTimeout}
                            disabled={isTimeoutPending}
                            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 text-sm"
                          >
                            {isTimeoutPending ? (
                              <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Ending...</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>End Round</span>
                              </div>
                            )}
                          </button>
                        )}

                        {/* Connect/Switch Network Prompts */}
                        {!isConnected && (
                          <button
                            onClick={handleConnect}
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 text-sm"
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <Wallet className="w-4 h-4" />
                              <span>Connect to Play</span>
                            </div>
                          </button>
                        )}

                        {isConnected && !isCorrectChain && (
                          <button
                            onClick={handleSwitchChain}
                            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 text-sm"
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <Zap className="w-4 h-4" />
                              <span>Switch Network</span>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Recent Bonuses */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                        Recent Bonuses
                      </h3>
                      {recentBonusWinners.length > 0 ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {recentBonusWinners.slice(0, 3).map((winner, index) => (
                            <div
                              key={`${winner.roundId}-${winner.depositNumber}`}
                              className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl p-3 border border-yellow-500/30"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="text-yellow-400 font-mono text-xs flex-1 mr-2">
                                    {formatAddress(winner.depositor)}
                                  </div>
                                  <button
                                    onClick={() => copyToClipboard(winner.depositor, `bonus-${index}`)}
                                    className="p-1 hover:bg-yellow-500/20 rounded transition-colors"
                                    title="Copy full address"
                                  >
                                    {copiedAddress === `bonus-${index}` ? (
                                      <Check className="w-3 h-3 text-green-400" />
                                    ) : (
                                      <Copy className="w-3 h-3 text-yellow-400" />
                                    )}
                                  </button>
                                </div>
                                <div className="text-gray-400 text-xs">
                                  Player #{winner.depositNumber.toString()} • Round #{winner.roundId.toString()}
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="text-yellow-400 font-semibold text-xs">
                                    {winner.bonusPercentage.toString()}% Bonus
                                  </div>
                                  <div className="text-white text-xs">
                                    {formatEther(winner.bonusAmount)} ETH
                                  </div>
                                </div>
                                {winner.depositor.toLowerCase() ===
                                  address?.toLowerCase() && (
                                  <div className="text-center mt-1">
                                    <span className="inline-flex items-center px-2 py-1 bg-green-900/30 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                                      <Star className="w-2 h-2 mr-1" />
                                      Your Win!
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-gray-800/30 to-slate-800/30 rounded-xl p-4 border border-gray-500/30">
                          <div className="text-center py-4">
                            <div className="text-gray-400 text-sm mb-1">
                              No bonus winners yet
                            </div>
                            <div className="text-gray-500 text-xs">
                              Every 10th player gets a bonus!
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Game Information Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              How the Game Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group text-center p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-3 text-lg">
                  Dynamic Deposits
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Each deposit equals 0.01 ETH plus 0.5% of the current
                  prize pool, making stakes progressively higher
                </p>
              </div>

              <div className="group text-center p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-green-500/25 transition-all">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-3 text-lg">
                  Bonus Rewards
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Every 10th player receives a random bonus of 1–5% of the
                  pot through verifiable randomness, encrypted using Blocklock
                </p>
              </div>

              <div className="group text-center p-6 bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-xl border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-3 text-lg">
                  Winner Takes All
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  If no deposits for 24 hours, the last player wins the
                  entire remaining prize pool
                </p>
              </div>
            </div>

            {/* Additional Features */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-lg border border-white/5">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Timer className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      24-Hour Timer
                    </div>
                    <div className="text-gray-400 text-xs">
                      Resets with each deposit
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-lg border border-white/5">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      VRF Randomness
                    </div>
                    <div className="text-gray-400 text-xs">
                      Verifiable & fair
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-lg border border-white/5">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      No Player Limit
                    </div>
                    <div className="text-gray-400 text-xs">
                      Join anytime
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-lg border border-white/5">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      Instant Payouts
                    </div>
                    <div className="text-gray-400 text-xs">
                      Automated rewards
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="mt-16 text-center px-4 sm:px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-lg rounded-2xl p-8 sm:p-12 border border-purple-500/20 shadow-2xl">
              <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                Ready to Test Your Survival Skills?
              </h3>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join the ultimate Web3 survival game where strategy meets
                luck, and only the persistent prevail.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                {!isConnected ? (
                  <button
                    onClick={handleConnect}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 border border-purple-500/30"
                  >
                    Connect Wallet & Start Playing
                  </button>
                ) : (
                  <div className="text-green-400 font-medium flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Wallet Connected - Ready to Play!</span>
                  </div>
                )}

                <button
                  onClick={() => setShowTutorial(true)}
                  className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl font-medium transition-all border border-slate-600/50 hover:border-slate-500/50 backdrop-blur-sm"
                >
                  Learn How to Play
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Base Sepolia Testnet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Free Test ETH Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Fully Decentralized</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Verifiable Randomness</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>Blocklock Encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Modal */}
        <TutorialModal
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
        />
      </div>
    </div>
  );
}