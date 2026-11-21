import { WalletBalance } from '@/components/ui/wallet-balance'

export default function WalletDemo() {
  return (
    <div className="flex h-full items-center justify-center overflow-y-auto bg-gradient-to-br from-[#fbefe2] via-[#f6f1ea] to-[#efebe6] p-6">
      <WalletBalance className="max-w-[360px]" />
    </div>
  )
}
