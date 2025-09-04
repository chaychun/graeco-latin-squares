import Controls from "@/components/controls"
import Display from "@/components/display"

function App() {
  return (
    <div className="h-[100dvh] overflow-hidden bg-background">
      <div className="mx-auto h-full max-w-[528px] p-6 lg:max-w-7xl">
        <div className="flex h-full flex-col gap-6 lg:flex-row-reverse lg:gap-8">
          <Display />
          <div className="flex-1 overflow-hidden lg:max-w-[420px]">
            <Controls />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
