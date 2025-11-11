'use client'

import { useParams } from 'next/navigation';

export default function index() {
    const params = useParams();
    const id = params.id;

    return(
        <div className="w-full max-w-full">
            Customer's Order History {id}
        </div>
    )
}