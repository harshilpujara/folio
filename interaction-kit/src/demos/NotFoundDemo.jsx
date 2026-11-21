import { NotFound } from '@/components/ui/not-found'

export default function NotFoundDemo() {
  return (
    <div className="dark h-full overflow-y-auto bg-[#111113]">
      <NotFound
        title="This page took a wrong turn."
        description="The requested page doesn't exist or may have moved."
        actionLabel="Go back home"
        // Inside the kit, "home" is the demo index.
        onAction={() => { window.location.hash = '' }}
        // The real path here is /kit/, which would read oddly in a 404 chip.
        path={null}
      />
    </div>
  )
}
