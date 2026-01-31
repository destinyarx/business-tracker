'use client'

import { ChevronDownIcon, Trash2, SquarePen, TextSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu'

type Props = {
    onView?: () => void,
    onUpdate?: () => void,
    onDelete?: () => void
}

export default function ActionButton({ onView, onUpdate, onDelete }: Props) {
  return (
    <div className='divide-primary-foreground/30 inline-flex w-fit divide-x rounded-md shadow-xs'>
      <Button size="sm" className='rounded-none rounded-l-md text-xs bg-sky-500 hover:bg-sky-300 focus-visible:z-10'>Actions</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='icon-sm' className='rounded-none rounded-r-md bg-sky-500 hover:bg-sky-300 focus-visible:z-10'>
            <ChevronDownIcon />
            <span className='sr-only'>Select option</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' sideOffset={4} align='end' className='max-w-64 md:max-w-xs!'>
            {onView && (
              <>
                <DropdownMenuItem 
                    onClick={onView} 
                    className="w-full justify-center rounded-lg text-white font-semibold text-[0.65rem] hover:!text-white bg-green-400 hover:!bg-green-200 px-2 py-1"
                >
                    <TextSearch className="w-1 h-1 text-white mr-1"/>
                    VIEW
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            {onUpdate && (
              <>
                <DropdownMenuItem 
                    onClick={onUpdate} 
                    className="w-full justify-center rounded-lg text-white font-semibold text-[0.65rem] hover:!text-white bg-amber-400 hover:!bg-amber-200 px-2 py-1"
                >
                    <SquarePen className="w-1 h-1 text-white"/>
                    UPDATE
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            {onDelete && (
              <>
                <DropdownMenuItem 
                    onClick={onDelete ?? undefined} 
                    className="w-full justify-center rounded-lg text-white font-semibold text-[0.7rem] hover:!text-white bg-rose-500 hover:!bg-rose-300 px-3 py-1"
                >
                    <Trash2 className="w-1 h-1 text-white"/>
                    DELETE
                </DropdownMenuItem>
              </>
            )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
