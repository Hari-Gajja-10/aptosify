import React, { createContext, useContext, useEffect, useState } from 'react'
import { AptosClient, AptosAccount, TxnBuilderTypes, BCS } from 'aptos'
import toast from 'react-hot-toast'

interface WalletContextType {
  account: AptosAccount | null
  address: string | null
  connected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  signAndSubmitTransaction: (payload: any) => Promise<string>
  client: AptosClient
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<AptosAccount | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  
  const client = new AptosClient(import.meta.env.VITE_APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com')

  const connect = async () => {
    try {
      // Check if Petra wallet is available
      if (typeof window !== 'undefined' && 'aptos' in window) {
        const wallet = (window as any).aptos
        
        // Request connection
        await wallet.connect()
        
        // Get account info
        const accountInfo = await wallet.account()
        const account = new AptosAccount(undefined, accountInfo.address)
        
        setAccount(account)
        setAddress(accountInfo.address)
        setConnected(true)
        
        toast.success('Wallet connected successfully!')
      } else {
        // Fallback to local account for development
        const privateKey = import.meta.env.VITE_PRIVATE_KEY
        if (privateKey) {
          const account = new AptosAccount(Buffer.from(privateKey, 'hex'))
          setAccount(account)
          setAddress(account.address().toString())
          setConnected(true)
          toast.success('Development wallet connected!')
        } else {
          toast.error('No wallet found. Please install Petra wallet.')
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast.error('Failed to connect wallet')
    }
  }

  const disconnect = () => {
    setAccount(null)
    setAddress(null)
    setConnected(false)
    toast.success('Wallet disconnected')
  }

  const signAndSubmitTransaction = async (payload: any): Promise<string> => {
    if (!account) {
      throw new Error('No wallet connected')
    }

    try {
      if (typeof window !== 'undefined' && 'aptos' in window) {
        // Use Petra wallet
        const wallet = (window as any).aptos
        const transaction = await wallet.signAndSubmitTransaction(payload)
        await client.waitForTransaction(transaction.hash)
        return transaction.hash
      } else {
        // Use local account
        const rawTxn = await client.generateTransaction(account.address(), payload)
        const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn)
        const transactionRes = await client.submitTransaction(bcsTxn)
        await client.waitForTransaction(transactionRes.hash)
        return transactionRes.hash
      }
    } catch (error) {
      console.error('Transaction failed:', error)
      throw error
    }
  }

  useEffect(() => {
    // Check if wallet is already connected
    if (typeof window !== 'undefined' && 'aptos' in window) {
      const wallet = (window as any).aptos
      wallet.isConnected().then((connected: boolean) => {
        if (connected) {
          wallet.account().then((accountInfo: any) => {
            const account = new AptosAccount(undefined, accountInfo.address)
            setAccount(account)
            setAddress(accountInfo.address)
            setConnected(true)
          })
        }
      })
    }
  }, [])

  const value: WalletContextType = {
    account,
    address,
    connected,
    connect,
    disconnect,
    signAndSubmitTransaction,
    client
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}