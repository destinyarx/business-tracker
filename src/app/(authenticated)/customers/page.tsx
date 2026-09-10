'use client'

import { useState } from 'react'
import { isThisMonth } from 'date-fns'
import {
  Crown,
  RefreshCw,
  Search,
  Sparkles,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import type { Customer, CustomerType } from '@/features/customers/customers.types'
import type { CustomerFormValues } from '@/features/customers/customers.schema'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import { CustomerTable } from '@/features/customers/components/CustomerTable'
import { CustomerForm } from '@/features/customers/components/CustomerForm'
import { ModuleMetricCard } from '@/components/molecules/ModuleMetricCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Loading from '@/components/organisms/Loading'
import { useInvalidateQuery } from '@/hooks/useInvalidateQuery'
import { useToast } from '@/hooks/useToast'

const tierStyles: Record<CustomerType, { color: string; label: string }> = {
  normal: { color: '#93a5a5', label: 'Normal' },
  loyal: { color: '#12cdbe', label: 'Loyal' },
  deluxe: { color: '#ffb018', label: 'Deluxe' },
  premium: { color: '#ed6b87', label: 'Premium' },
  VIP: { color: '#5b34c7', label: 'VIP' },
}

const customerTypes: CustomerType[] = ['normal', 'loyal', 'deluxe', 'premium', 'VIP']

export default function Customers() {
  const { customerQuery, createCustomer, updateCustomer, deleteCustomer } = useCustomers()
  const { invalidateKey } = useInvalidateQuery()
  const appToast = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const customers = customerQuery.data ?? []
  const tierCounts = customerTypes.map((customerType) => {
    const count = customers.filter((customer) => customer.customerType === customerType).length
    return {
      type: customerType,
      count,
      percentage: customers.length ? (count / customers.length) * 100 : 0,
      ...tierStyles[customerType],
    }
  })

  const handleAddCustomer = async (customerValues: CustomerFormValues) => {
    try {
      await appToast.loadingPromise(createCustomer.mutateAsync(customerValues), {
        loadingTitle: 'Saving customer...',
        successTitle: 'Customer added',
        successDescription: 'The new record has been saved.',
        errorTitle: 'Failed to save customer',
        errorDescription: 'Please check your connection and try again.',
      })
      closeFormPanel()
    } catch {
      return
    }
  }

  const handleUpdateCustomer = async (customerValues: CustomerFormValues) => {
    if (!selectedCustomer?.id) return

    try {
      await appToast.loadingPromise(
        updateCustomer.mutateAsync({ id: selectedCustomer.id, values: customerValues }),
        {
          loadingTitle: 'Updating customer...',
          successTitle: 'Customer updated',
          successDescription: 'The customer record has been updated.',
          errorTitle: 'Failed to update customer',
          errorDescription: 'Please check your changes and try again.',
        },
      )
      closeFormPanel()
    } catch {
      return
    }
  }

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer?.id) return

    try {
      await appToast.loadingPromise(deleteCustomer.mutateAsync(selectedCustomer.id), {
        loadingTitle: 'Deleting customer...',
        successTitle: 'Customer deleted',
        errorTitle: 'Failed to delete customer',
        errorDescription: 'Please try again.',
      })
      setIsDeleteDialogOpen(false)
      setSelectedCustomer(null)
    } catch {
      return
    }
  }

  const openAddPanel = () => {
    setSelectedCustomer(null)
    setIsFormOpen(true)
  }

  const openEditPanel = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsFormOpen(true)
  }

  const openDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  const closeFormPanel = () => {
    setIsFormOpen(false)
    setSelectedCustomer(null)
  }

  if (customerQuery.isLoading) {
    return <Loading />
  }

  if (customerQuery.isError) {
    return (
      <div className="rounded-[18px] border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/40 dark:bg-red-950/20">
        <p className="text-sm font-medium text-red-800 dark:text-red-300">Something went wrong loading customers.</p>
        <Button variant="outline" className="mt-4" onClick={() => invalidateKey('customers')}>
          <RefreshCw className="size-4" />
          Try again
        </Button>
      </div>
    )
  }

  const addedThisMonth = customers.filter(
    (customer) => customer.createdAt && isThisMonth(customer.createdAt),
  ).length
  const priorityCustomers = customers.filter(
    (customer) => customer.customerType === 'VIP' || customer.customerType === 'premium',
  ).length
  const populatedTiers = tierCounts.filter((tier) => tier.count > 0).length

  return (
    <div className="mx-auto w-full max-w-[1480px] text-[#16292b] dark:text-[#eaf3f1]">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex min-w-60 max-w-[460px] flex-1 items-center overflow-hidden rounded-full border border-[#e3e9e8] bg-[#f6f8f8] dark:border-[#243936] dark:bg-[#16292b]">
          <Input
            aria-label="Search customers"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-10 flex-1 border-0 bg-transparent px-4 text-[13px] shadow-none focus-visible:ring-0"
          />
          <Search className="mr-4 size-4 text-[#7c8e8e]" />
        </div>
        <Button
          onClick={openAddPanel}
          className="ml-auto h-10 rounded-[11px] bg-[#0c4b47] px-[18px] text-[13px] font-semibold text-white hover:bg-[#007f78]"
        >
          <UserPlus className="size-4" />
          Add customer
        </Button>
      </div>

      <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <ModuleMetricCard label="Total customers" value={String(customers.length)} hint="All customer records" icon={Users} accent="#12cdbe" iconClassName="bg-[#e4f7f4] text-[#007f78]" chartValues={[4, 6, 5, 8, 7, 10, 12]} />
        <ModuleMetricCard label="Added this month" value={String(addedThisMonth)} hint="New relationships" icon={UserPlus} accent="#5b8def" iconClassName="bg-[#e6f0fe] text-[#1d4ed8]" chartValues={[2, 3, 2, 5, 4, 7, 8]} />
        <ModuleMetricCard label="Premium and VIP" value={String(priorityCustomers)} hint="Priority customers" icon={Crown} accent="#ffb018" iconClassName="bg-[#fff7e0] text-[#8a6100]" chartValues={[3, 4, 5, 4, 6, 8, 9]} />
        <ModuleMetricCard label="Active tiers" value={String(populatedTiers)} hint="Across five customer types" icon={Sparkles} accent="#9b74e8" iconClassName="bg-[#f3eeff] text-[#5b34c7]" chartValues={[5, 4, 6, 5, 8, 7, 10]} />
      </div>

      <section className="mb-3.5 flex flex-wrap items-center gap-x-[22px] gap-y-3 rounded-[18px] border border-[#e3e9e8] bg-white px-[18px] py-3.5 dark:border-[#243936] dark:bg-[#12201f]" aria-label="Customer tier mix">
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.04em] text-[#5f7273] dark:text-[#9fb3b0]">Tier mix</span>
        <div className="flex h-2 min-w-60 flex-1 overflow-hidden rounded-full bg-[#f2f5f4] dark:bg-[#1b2e2c]">
          {tierCounts.map((tier) => (
            <span key={tier.type} style={{ width: `${tier.percentage}%`, backgroundColor: tier.color }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {tierCounts.map((tier) => (
            <span key={tier.type} className="inline-flex items-center gap-1.5 text-xs text-[#3f5254] dark:text-[#c3d4d1]">
              <span className="size-2 rounded-[3px]" style={{ backgroundColor: tier.color }} />
              {tier.label}
              <span className="text-[#93a5a5]">{tier.count}</span>
            </span>
          ))}
        </div>
      </section>

      <CustomerTable
        data={customers}
        onEdit={openEditPanel}
        onDelete={openDeleteDialog}
        globalFilter={searchQuery}
        onGlobalFilterChange={setSearchQuery}
      />

      <Sheet open={isFormOpen} onOpenChange={(open) => !open && closeFormPanel()}>
        <SheetContent className="w-[456px] max-w-[94vw] gap-0 border-l-0 bg-white p-0 shadow-[-30px_0_60px_-30px_rgba(11,32,33,0.5)] dark:bg-[#12201f] sm:max-w-[456px] [&>button]:hidden">
          <SheetHeader className="flex-row items-start gap-3 border-b border-[#edf1f0] px-[22px] py-4 text-left dark:border-[#1e322f]">
            <span className="self-stretch w-1 shrink-0 rounded-full bg-gradient-to-b from-[#a8d97c] via-[#12cdbe] to-[#7fe0da]" />
            <div className="flex-1">
              <SheetDescription className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#93a5a5]">
                Customers / {selectedCustomer ? 'Edit record' : 'New record'}
              </SheetDescription>
              <SheetTitle className="text-[19px] font-semibold tracking-[-0.02em]">
                {selectedCustomer ? 'Edit customer' : 'Add customer'}
              </SheetTitle>
            </div>
            <button type="button" onClick={closeFormPanel} aria-label="Close customer form" className="grid size-8 place-items-center rounded-[10px] border border-[#e3e9e8] bg-white hover:border-[#16292b] dark:border-[#2b4340] dark:bg-[#12201f]">
              <X className="size-4" />
            </button>
          </SheetHeader>
          <CustomerForm
            key={selectedCustomer?.id ?? 'new'}
            customer={selectedCustomer ?? undefined}
            onSubmit={selectedCustomer ? handleUpdateCustomer : handleAddCustomer}
            onCancel={closeFormPanel}
          />
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this customer?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCustomer?.name} will be permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer} className="bg-red-600 text-white hover:bg-red-700">
              Delete customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
