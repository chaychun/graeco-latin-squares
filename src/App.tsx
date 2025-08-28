import { useState } from "react"
import viteLogo from "/vite.svg"
import reactLogo from "./assets/react.svg"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="flex space-x-8 mb-8">
        <a
          href="https://vite.dev"
          target="_blank"
          className="hover:opacity-75 transition-opacity"
          rel="noopener"
        >
          <img src={viteLogo} className="h-16 w-16 animate-spin" alt="Vite logo" />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          className="hover:opacity-75 transition-opacity"
          rel="noopener"
        >
          <img src={reactLogo} className="h-16 w-16 animate-pulse" alt="React logo" />
        </a>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-8">Vite + React + Tailwind</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 mb-4"
        >
          count is {count}
        </button>
        <p className="text-gray-600">
          Edit <code className="bg-gray-100 px-2 py-1 rounded text-sm">src/App.tsx</code> and save
          to test HMR
        </p>
      </div>

      <p className="text-gray-500 mt-8 text-center max-w-md">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
