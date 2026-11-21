import { WalletBalance } from '@/components/ui/wallet-balance'

export default function WalletDemo() {
  return (
    <div className="flex h-full items-center justify-center overflow-y-auto bg-gradient-to-br from-[#eef2d9] via-[#f3f4ee] to-[#f1f1f1] p-6">
      <WalletBalance className="max-w-[360px]" />
    </div>
  )
}
