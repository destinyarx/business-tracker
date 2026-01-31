'use client'

import { useState } from 'react';
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import { Customer, CustomerType } from '@/features/customers/customers.types';
import { CustomerTable } from '@/features/customers/components/CustomerTable';
import { CustomerForm } from '@/features/customers/components/CustomerForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel,AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { useInvalidateQuery } from '@/hooks/useInvalidateQuery';

import Loading from '@/components/organisms/Loading'

export default function Customers() {
    const { customerQuery, createCustomer, updateCustomer, deleteCustomer } = useCustomers()
    const { invalidateKey } = useInvalidateQuery()

    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const handleAddCustomer = async (data: Customer) => {
        setIsFormOpen(false);
        await createCustomer.mutateAsync(data)
    };

    const handleUpdateCustomer = async (data: Customer) => {
        if (!selectedCustomer?.id) return;

        setIsFormOpen(false);
        await updateCustomer.mutateAsync({ id: selectedCustomer.id, values: data })
        setSelectedCustomer(null);
    };

    const handleDeleteCustomer = async () => {
        if (!selectedCustomer?.id) return;

        await deleteCustomer.mutateAsync(selectedCustomer.id)
        setIsDeleteDialogOpen(false);
        setSelectedCustomer(null);
    };

    const openEditDialog = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsFormOpen(true);
    };

    const openDeleteDialog = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsDeleteDialogOpen(true);
    };

    const closeFormDialog = () => {
        setIsFormOpen(false);
        setSelectedCustomer(null);
    };

    if (customerQuery.isLoading) {
        return <Loading />
    }

    return (
        <div className="w-full max-w-full min-h-screen flex justify-center bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100 text-gray-800">
            <div className="container mx-auto px-6 pb-8 mt-5">
                <div className="flex flex-col md:flex-row md:justify-between sm:gap-5 mb-3">
                    <div className="flex flex-row gap-2 relative w-full lg:w-1/2">
                        <div className="w-[80%]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search customers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* table reload */}
                        <Button 
                            onClick={() => invalidateKey('customers')}
                            variant="outline" 
                            size="icon-sm" 
                            className="bg-sky-800 hover:bg-sky-400"
                        >
                            <RefreshCw className="h-4 w-4 text-white" />
                        </Button>
                    </div>

                    <Button onClick={() => setIsFormOpen(true)} className="bg-teal-600 text-white hover:bg-teal-700 shrink-0">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Customer
                    </Button>
                </div>

                {/* {customerQuery.isLoading ? (
                    <Loading />
                ) : ( */}
                    <CustomerTable
                        data={customerQuery.data ?? []}
                        onEdit={openEditDialog}
                        onDelete={openDeleteDialog}
                        globalFilter={searchQuery}
                    />
                {/* )} */}
            </div>

            <Dialog open={isFormOpen} onOpenChange={closeFormDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedCustomer ? "Update Customer" : "Add New Customer"}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-light mb-2">
                            {selectedCustomer
                                ? "Update the customer information below."
                                : "Fill in the details to add a new customer."}
                        </DialogDescription>
                    </DialogHeader>
                    <CustomerForm
                        customer={selectedCustomer || undefined}
                        onSubmit={selectedCustomer ? handleUpdateCustomer : handleAddCustomer}
                        onCancel={closeFormDialog}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete{" "}
                            <span className="font-semibold">{selectedCustomer?.name}</span>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteCustomer}
                            className="bg-destructive text-destructive-foreground text-white hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};