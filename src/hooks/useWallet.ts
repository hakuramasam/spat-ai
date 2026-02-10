import { useAccount, useConnect, useDisconnect, useBalance, useReadContract, useWriteContract } from 'wagmi';
import { formatUnits } from 'viem';
import { base } from 'wagmi/chains';
import { SPAT_TOKEN_ADDRESS, AGENT_VAULT_ADDRESS, ERC20_ABI } from '@/lib/wagmi';

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  // ETH balance
  const { data: ethBalance } = useBalance({
    address,
    query: { enabled: !!address },
  });

  // SPAT token balance
  const { data: spatBalance } = useReadContract({
    address: SPAT_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // SPAT allowance for agent vault
  const { data: spatAllowance } = useReadContract({
    address: SPAT_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, AGENT_VAULT_ADDRESS] : undefined,
    query: { enabled: !!address },
  });

  const { writeContract, isPending: isWriting } = useWriteContract();

  const approveSPAT = (amount: bigint) => {
    writeContract({
      address: SPAT_TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [AGENT_VAULT_ADDRESS, amount],
      chain: base,
      account: address!,
    });
  };

  const transferSPAT = (to: `0x${string}`, amount: bigint) => {
    writeContract({
      address: SPAT_TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [to, amount],
      chain: base,
      account: address!,
    });
  };

  const formatSPAT = (value: bigint | undefined) => {
    if (!value) return '0';
    return formatUnits(value, 18);
  };

  return {
    address,
    isConnected,
    chain,
    connectors,
    connect,
    disconnect,
    isConnecting,
    ethBalance,
    spatBalance,
    spatAllowance,
    approveSPAT,
    transferSPAT,
    formatSPAT,
    isWriting,
  };
}
