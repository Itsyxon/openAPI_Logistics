import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app'
import './index.css'

async function enableMocking() {
  if (!import.meta.env.DEV) return
  const { startMockWorker } = await import('@/shared/api/mock/browser')
  await startMockWorker()
}

async function bootstrap() {
  await enableMocking()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
