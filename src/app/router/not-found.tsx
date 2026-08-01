import { Link } from '@tanstack/react-router'
import { MapPinOff } from 'lucide-react'
import { Button } from '@/shared/ui/button'

export function NotFound() {
  return (
    <div className='flex flex-col items-center rounded-md border border-dashed bg-card/50 px-6 py-20 text-center'>
      <MapPinOff className='size-8 text-rail' strokeWidth={1.5} />
      <p className='mt-4 font-display text-2xl font-semibold'>
        Страница не найдена
      </p>
      <p className='mt-1 text-sm text-muted-foreground'>
        Возможно, заявку сняли с торгов или ссылка устарела.
      </p>
      <Button asChild variant='outline' className='mt-5'>
        <Link to='/auctions'>К списку аукционов</Link>
      </Button>
    </div>
  )
}
