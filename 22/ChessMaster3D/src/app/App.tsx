import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router'
import { Suspense } from 'react'
import { LoadingScreen } from '../components/LoadingScreen'

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <AppRouter />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
