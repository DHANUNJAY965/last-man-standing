import { http, createConfig } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { injected, walletConnect, metaMask, coinbaseWallet } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

// Create the config with multiple connector options
export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    metaMask({
      dappMetadata: {
        name: "Last Man Standing",
        url: typeof window !== 'undefined' ? window.location.href : '',
      }
    }),
    ...(projectId ? [
      walletConnect({ 
        projectId,
        metadata: {
          name: "Last Man Standing",
          description: "Crypto game where the last player wins all!",
          url: typeof window !== 'undefined' ? window.location.href : '',
          icons: ['https://avatars.githubusercontent.com/u/37784886']
        }
      }),
      coinbaseWallet({
        appName: "Last Man Standing"
      })
    ] : []),
  ],
  transports: {
    [baseSepolia.id]: http(
      // You can optionally add an RPC URL here for better reliability
      // `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  },
})

export const BASE_SEPOLIA_CHAIN = baseSepolia

// Helper function to get the preferred connector
export const getPreferredConnector = () => {
  if (typeof window === 'undefined') return null
  
  // Check if MetaMask is available
  if (window.ethereum?.isMetaMask) {
    return config.connectors.find(c => c.id === 'metaMask')
  }
  
  // Check if Coinbase is available
  if (window.ethereum?.isCoinbaseWallet) {
    return config.connectors.find(c => c.id === 'coinbaseWalletSDK')
  }
  
  // Default to injected
  return config.connectors.find(c => c.id === 'injected')
}