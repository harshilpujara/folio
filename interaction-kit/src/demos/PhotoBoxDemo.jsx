import { PhotoBox } from '@/components/ui/photo-box'

export default function PhotoBoxDemo() {
  return (
    <div className="flex h-full items-center justify-center overflow-y-auto bg-gradient-to-b from-[#f1f1f1] via-[#ececec] to-[#d9d9d9] p-4 sm:p-8">
      <PhotoBox />
    </div>
  )
}
