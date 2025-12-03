'use client'

import { useState } from "react";
import { Customer, CustomerType } from "@/features/customers/customers.types";
import { mockCustomers } from "@/features/customers/customers.data";
import { CustomerTable } from "@/features/customers/components/CustomerTable";
import { CustomerForm } from "@/features/customers/components/CustomerForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search } from "lucide-react";

export default function Customers() {
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const handleAddCustomer = (data: {
        fullName: string;
        phone: string;
        customerType: CustomerType;
        notes?: string;
    }) => {
        const newCustomer: Customer = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
        };
        setCustomers([newCustomer, ...customers]);
        setIsFormOpen(false);
        toast.success("Customer added successfully!");
    };

    const handleUpdateCustomer = (data: {
        fullName: string;
        phone: string;
        customerType: CustomerType;
        notes?: string;
    }) => {
        if (!selectedCustomer) return;

        setCustomers(
        customers.map((customer) =>
            customer.id === selectedCustomer.id
            ? { ...customer, ...data }
            : customer
        )
        );
        setIsFormOpen(false);
        setSelectedCustomer(null);
        // toast.success("Customer updated successfully!");

        console.log('HAHAHA')
        toast("⏳ Server Waking Up…", {
          description: "Our backend is cold starting on free-tier hosting. Please wait 10–30 seconds.",
          duration: 4000
        })
    };

    const handleDeleteCustomer = () => {
        if (!selectedCustomer) return;

        setCustomers(customers.filter((customer) => customer.id !== selectedCustomer.id));
        setIsDeleteDialogOpen(false);
        setSelectedCustomer(null);
        // toast.success("Customer deleted successfully!");
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

    return (
        <div className="w-full max-w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100 text-gray-800">
            <div className="container mx-auto px-6 pb-8">
                <div className="flex flex-col md:flex-row md:justify-between sm:gap-5 mb-5">
                    <div className="relative w-full lg:w-1/2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        placeholder="Search customers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        />
                    </div>

                    <Button onClick={() => setIsFormOpen(true)} className="bg-teal-600 text-white hover:bg-teal-700 shrink-0">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Customer
                    </Button>
                </div>

                <CustomerTable
                    data={customers}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                    globalFilter={searchQuery}
                />
            </div>

            <Dialog open={isFormOpen} onOpenChange={closeFormDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                        {selectedCustomer ? "Update Customer" : "Add New Customer"}
                        </DialogTitle>
                        <DialogDescription>
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
                        <span className="font-semibold">{selectedCustomer?.fullName}</span>.
                        This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                        onClick={handleDeleteCustomer}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                        Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};