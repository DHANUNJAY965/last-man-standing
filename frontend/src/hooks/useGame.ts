import { useState, useEffect } from 'react'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useWatchContractEvent } from 'wagmi'
import { formatEther } from 'viem'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contractABI'

export interface Round {
  roundId: bigint
  potAmount: bigint
  reservedBonus: bigint
  depositCount: bigint
  lastDepositor: string
  lastDepositTime: bigint
  nextDepositAmount: bigint
  isActive: boolean
  hasWinner: boolean
  winner: string
  startTime: bigint
}

export interface BonusWinner {
  depositor: string
  bonusAmount: bigint
  depositNumber: bigint
  roundId: bigint
  bonusPercentage: bigint
  paid: boolean
  revealed: boolean
}

export const useGame = () => {
  const { address, isConnected, chain } = useAccount()
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isDepositing, setIsDepositing] = useState(false)
  const [error, setError] = useState<string>('')

  // Log contract address for debugging
  console.log('Contract Address:', CONTRACT_ADDRESS)
  console.log('Chain:', chain)
  console.log('Is Connected:', isConnected)

  // Check if we're on the right chain - but allow data fetching regardless
  const isCorrectChain = chain?.id === 84532 // Base Sepolia

  // Read current round data - ALWAYS enabled if contract exists
  const { 
    data: currentRound, 
    refetch: refetchRound,
    error: roundError,
    isLoading: roundLoading
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getCurrentRound',
    query: {
      enabled: !!CONTRACT_ADDRESS, // Only requires contract address, not wallet connection
      refetchInterval: 5000, // Refetch every 5 seconds
    }
  }) as { data: Round | undefined, refetch: () => void, error: unknown, isLoading: boolean }

  // Read available pot (excluding reserved bonuses) - ALWAYS enabled
  const { 
    data: availablePot, 
    refetch: refetchPot,
    error: potError
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getAvailablePot',
    query: {
      enabled: !!CONTRACT_ADDRESS, // Only requires contract address
      refetchInterval: 5000,
    }
  })

  // Read time until timeout - ALWAYS enabled
  const { 
    data: timeUntilTimeout, 
    refetch: refetchTime,
    error: timeError
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTimeUntilTimeout',
    query: {
      enabled: !!CONTRACT_ADDRESS, // Only requires contract address
      refetchInterval: 1000, // Update every second
    }
  })

  // Read bonus winners for current round - ALWAYS enabled
  const { 
    data: bonusWinners, 
    refetch: refetchBonusWinners,
    error: bonusError
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getRoundBonusWinners',
    args: currentRound ? [currentRound.roundId] : undefined,
    query: {
      enabled: !!currentRound && !!CONTRACT_ADDRESS, // Only requires contract and round data
      refetchInterval: 5000,
    }
  }) as { data: BonusWinner[] | undefined, refetch: () => void, error: unknown }

  // Write contracts - these still require wallet connection
  const { 
    writeContract: deposit, 
    data: depositHash,
    error: depositError,
    isPending: isDepositWritePending
  } = useWriteContract()

  const { 
    writeContract: claimWinnings, 
    data: claimHash,
    error: claimError
  } = useWriteContract()

  const { 
    writeContract: checkTimeout, 
    data: timeoutHash,
    error: timeoutError
  } = useWriteContract()

  // Wait for transaction receipts
  const { 
    isLoading: isDepositPending,
    error: depositReceiptError
  } = useWaitForTransactionReceipt({
    hash: depositHash,
  })

  const { 
    isLoading: isClaimPending,
    error: claimReceiptError
  } = useWaitForTransactionReceipt({
    hash: claimHash,
  })

  const { 
    isLoading: isTimeoutPending,
    error: timeoutReceiptError
  } = useWaitForTransactionReceipt({
    hash: timeoutHash,
  })

  // Watch for events - enabled regardless of connection but only works if connected
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'DepositMade',
    enabled: !!CONTRACT_ADDRESS,
    onLogs: (logs) => {
      console.log('DepositMade event:', logs)
      refetchRound()
      refetchPot()
      refetchTime()
      setIsDepositing(false) // Reset depositing state
    },
  })

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'RoundEnded',
    enabled: !!CONTRACT_ADDRESS,
    onLogs: (logs) => {
      console.log('RoundEnded event:', logs)
      refetchRound()
      refetchPot()
      refetchTime()
    },
  })

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'BonusWinnerDetermined',
    enabled: !!CONTRACT_ADDRESS,
    onLogs: (logs) => {
      console.log('BonusWinnerDetermined event:', logs)
      refetchBonusWinners()
    },
  })

  // Update countdown timer
  useEffect(() => {
    if (timeUntilTimeout) {
      setTimeLeft(Number(timeUntilTimeout))
    }
  }, [timeUntilTimeout])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Handle errors
  useEffect(() => {
    if (roundError || potError || timeError || bonusError) {
      console.error('Contract read errors:', {
        roundError,
        potError,
        timeError,
        bonusError
      })
    }
    
    if (depositError || claimError || timeoutError) {
      console.error('Contract write errors:', {
        depositError,
        claimError,
        timeoutError
      })
      
      // Set user-friendly error messages
      if (depositError) {
        setError((depositError as Error)?.message || 'Failed to make deposit')
      }
      if (claimError) {
        setError((claimError as Error)?.message || 'Failed to claim winnings')
      }
      if (timeoutError) {
        setError((timeoutError as Error)?.message || 'Failed to trigger timeout')
      }
    }

    if (depositReceiptError || claimReceiptError || timeoutReceiptError) {
      console.error('Transaction receipt errors:', {
        depositReceiptError,
        claimReceiptError,
        timeoutReceiptError
      })
    }
  }, [roundError, potError, timeError, bonusError, depositError, claimError, timeoutError, depositReceiptError, claimReceiptError, timeoutReceiptError])

  const makeDeposit = async () => {
    // Check wallet connection and chain for deposits
    if (!currentRound || !isConnected || isDepositing || !isCorrectChain) {
      if (!isConnected) {
        setError('Please connect your wallet to make a deposit')
        return
      }
      if (!isCorrectChain) {
        setError('Please switch to Base Sepolia network')
        return
      }
      console.log('Deposit conditions not met:', {
        hasCurrentRound: !!currentRound,
        isConnected,
        isDepositing,
        isCorrectChain,
        contractAddress: CONTRACT_ADDRESS
      })
      return
    }

    if (!CONTRACT_ADDRESS) {
      setError('Contract address not configured')
      return
    }

    try {
      setIsDepositing(true)
      setError('')
      
      console.log('Making deposit with amount:', formatEther(currentRound.nextDepositAmount))
      
      const result = await deposit({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'deposit',
        value: currentRound.nextDepositAmount,
      })
      
      console.log('Deposit transaction submitted:', result)
    } catch (error) {
      console.error('Deposit error:', error)
      setError((error as Error)?.message || 'Failed to make deposit')
      setIsDepositing(false)
    }
  }

  const claimPrize = async (roundId: bigint) => {
    if (!isConnected || !isCorrectChain) {
      if (!isConnected) {
        setError('Please connect your wallet to claim winnings')
        return
      }
      if (!isCorrectChain) {
        setError('Please switch to Base Sepolia network')
        return
      }
      return
    }

    try {
      setError('')
      await claimWinnings({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'claimWinnings',
        args: [roundId],
      })
    } catch (error) {
      console.error('Claim error:', error)
      setError((error as Error)?.message || 'Failed to claim winnings')
    }
  }

  const triggerTimeout = async () => {
    if (!isConnected || !isCorrectChain) {
      if (!isConnected) {
        setError('Please connect your wallet to trigger timeout')
        return
      }
      if (!isCorrectChain) {
        setError('Please switch to Base Sepolia network')
        return
      }
      return
    }

    try {
      setError('')
      await checkTimeout({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'checkTimeoutAndEndRound',
      })
    } catch (error) {
      console.error('Timeout error:', error)
      setError((error as Error)?.message || 'Failed to trigger timeout')
    }
  }

  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const isCurrentUserLastDepositor = isConnected && currentRound?.lastDepositor?.toLowerCase() === address?.toLowerCase()

  const canClaimWinnings = isConnected &&
    isCorrectChain &&
    currentRound && 
    !currentRound.isActive && 
    currentRound.hasWinner && 
    currentRound.winner?.toLowerCase() === address?.toLowerCase()

  const canTriggerTimeout = timeLeft === 0 && 
    currentRound?.isActive && 
    currentRound?.depositCount > 0n &&
    isConnected &&
    isCorrectChain

  return {
    // State - now available regardless of wallet connection
    currentRound,
    availablePot: availablePot ? formatEther(availablePot) : '0',
    bonusWinners: bonusWinners || [],
    timeLeft,
    isDepositing: isDepositing || isDepositWritePending || isDepositPending,
    isClaimPending,
    isTimeoutPending,
    error,
    isCorrectChain,
    roundLoading,
    
    // Computed values - now available regardless of wallet connection
    nextDepositAmount: currentRound ? formatEther(currentRound.nextDepositAmount) : '0',
    potAmount: currentRound ? formatEther(currentRound.potAmount) : '0',
    depositCount: currentRound ? Number(currentRound.depositCount) : 0,
    formattedTimeLeft: formatTimeLeft(timeLeft),
    isCurrentUserLastDepositor,
    canClaimWinnings,
    canTriggerTimeout,
    
    // Actions - these now handle wallet connection checks internally
    makeDeposit,
    claimPrize,
    triggerTimeout,
    clearError: () => setError(''),
    
    // Utils
    refetchData: () => {
      refetchRound()
      refetchPot()
      refetchTime()
      refetchBonusWinners()
    }
  }
}