import Controls from "@/components/controls"
import Display from "@/components/display"

function App() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row-reverse gap-6 lg:gap-8 h-full">
          <Display />
          <div className="flex-1 overflow-hidden">
            <Controls />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
