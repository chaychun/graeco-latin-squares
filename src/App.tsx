import Controls from "@/components/controls"
import Display from "@/components/display"

function App() {
  return (
    <div className="h-[100dvh] overflow-hidden bg-secondary">
      <div className="mx-auto h-full max-w-[528px] p-4 lg:max-w-7xl">
        <div className="flex h-full flex-col gap-4 lg:flex-row lg:justify-center lg:gap-4">
          <Display />
          <div className="overflow-hidden lg:min-w-[420px]">
            <Controls />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
