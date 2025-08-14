import { AptosClient, AptosAccount, TxnBuilderTypes, BCS } from 'aptos'

export const APTOS_NODE_URL = import.meta.env.VITE_APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com'
export const MODULE_ADDRESS = import.meta.env.VITE_MODULE_ADDRESS

export const client = new AptosClient(APTOS_NODE_URL)

export interface TransactionPayload {
  function: string
  type_arguments: string[]
  arguments: any[]
}

export const createTransactionPayload = (
  functionName: string,
  typeArguments: string[] = [],
  arguments_: any[] = []
): TransactionPayload => ({
  function: `${MODULE_ADDRESS}::players::${functionName}`,
  type_arguments: typeArguments,
  arguments: arguments_
})

export const formatAptAmount = (octas: number): string => {
  return (octas / 100000000).toFixed(8)
}

export const parseAptAmount = (apt: string): number => {
  return Math.floor(parseFloat(apt) * 100000000)
}

export const shortenAddress = (address: string): string => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const validateAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(address)
}

export const getTransactionUrl = (hash: string): string => {
  const network = APTOS_NODE_URL.includes('devnet') ? 'devnet' : 'mainnet'
  return `https://explorer.aptoslabs.com/txn/${hash}?network=${network}`
}

export const getAccountUrl = (address: string): string => {
  const network = APTOS_NODE_URL.includes('devnet') ? 'devnet' : 'mainnet'
  return `https://explorer.aptoslabs.com/account/${address}?network=${network}`
}