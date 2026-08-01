import { Link, Outlet } from '@tanstack/react-router'
import { Truck } from 'lucide-react'

export function RootLayout() {
  return (
    <div className='paper-grid min-h-svh'>
      <header className='sticky top-0 z-30 border-b bg-background/85 backdrop-blur'>
        <div className='mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4'>
          <Link to='/auctions' className='flex items-center gap-2.5'>
            <span className='flex size-8 items-center justify-center rounded-sm bg-primary text-primary-foreground'>
              <Truck className='size-4' strokeWidth={2.5} />
            </span>
            <span className='font-display text-lg font-bold uppercase tracking-[0.16em]'>
              Аукционы
            </span>
          </Link>

          <span className='ml-auto hidden text-xs text-muted-foreground sm:block'>
            ООО Перевозчик
          </span>
        </div>
      </header>

      <main className='mx-auto w-full max-w-[1400px] px-4 py-6'>
        <Outlet />
      </main>
    </div>
  )
}
