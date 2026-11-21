import { PhotoBox } from '@/components/ui/photo-box'

export default function PhotoBoxDemo() {
  return (
    <div className="flex h-full items-center justify-center overflow-y-auto bg-gradient-to-b from-[#f6f1ea] via-[#f1ece4] to-[#e4ddd2] p-4 sm:p-8">
      <PhotoBox />
    </div>
  )
}
