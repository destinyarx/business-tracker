'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Check, ChevronDown } from 'lucide-react'
import { Label } from '@/components/ui/label'

export interface ComboboxItem {
  value: string
  label: string
}

interface ComboboxFieldProps {
  label?: string
  items: ComboboxItem[]
  value: string | undefined
  onChange: (value: string) => void
  placeholder?: string
  readOnly?: boolean
}

export function SearchableSelect({
  label,
  items,
  value,
  onChange,
  placeholder = 'Select option',
  readOnly = false
}: ComboboxFieldProps) {
  const [open, setOpen] = useState(false)

  const selectedLabel = items.find(i => i.value === value)?.label

  return (
    <div className='w-full'>
      {readOnly ? (
        <div className='w-full rounded-md border px-3 py-2 bg-muted text-sm text-muted-foreground'>
          {selectedLabel || placeholder}
        </div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type='button'
              className={cn(
                'w-full flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm',
                !selectedLabel && 'text-muted-foreground'
              )}
            >
              <span>{selectedLabel || placeholder}</span>
              <ChevronDown className='h-4 w-4 opacity-50' />
            </button>
          </PopoverTrigger>

          <PopoverContent 
            side='bottom'
            align='start'
            sideOffset={4}
            avoidCollisions={false}
            className='w-[--radix-popover-trigger-width] p-0'
          >
            <Command>
              <CommandInput placeholder='Search...' className='h-9' />
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup className="max-h-40 overflow-y-auto">
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={() => {
                      onChange(item.value)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        item.value === value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
