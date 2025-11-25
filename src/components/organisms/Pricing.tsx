import { Button } from '@/components/ui/button'
import { Badge, BadgeCheck } from 'lucide-react'
import Link from 'next/link'


export default function Pricing() {
    return(
        <div className="flex flex-col">
            <div>
                <div className="max-w-6xl mx-auto px-6 text-center mb-7">
                    <h2 className="text-4xl font-semibold text-teal-600 -mt-10">Pricing</h2>
                    <p className="text-gray-500 text-[0.85rem] font-light italic mt-2">
                        Get started with our Free Tier, packed with essential features to help your business grow — no credit card required, no hidden fees.
                    </p>
                </div>
            </div>

            <div className="flex flex-row gap-8 justify-center items-stretch w-full max-w-full px-15">
                <div className="flex flex-row gap-7 w-1/2 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 ">
                    <div className="flex flex-col justify-between w-[30%] rounded-xl">
                        <div>
                            <p className="text-2xl font-semibold mb-2">Free Tier</p>

                            <p className="text-[0.7rem] text-gray-400 mb-15">
                                Ideal for small to <br/> medium-sized business <br/>
                                looking for a powerful <br/> cost-effective.
                            </p>
                        </div>

                        <div className="mb-5">
                            <div className="flex flex-row justify-start mb-2">
                                <p className="text-lg font-semibold -mt-[5px]">₱ FREE </p>
                                <p className="font-light text-gray-400 text-xs ml-1">/month</p>
                            </div>

                            <Link href="/register">
                                <Button variant="outline" size="sm" className="rounded-full  text-white bg-slate-800">
                                    Register Now
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-[70%] bg-gray-200 text-slate-700 rounded-xl p-5">
                        <div className="font-semibold text-md">
                            Features
                        </div>

                        <div className="flex flex-row gap-2 items-center">
                            <BadgeCheck className="!h-7 !w-7"/>
                            <p className="text-[0.7rem] text-gray-500">
                                Manage sales with daily, weekly, and monthly sales performance.
                            </p>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <BadgeCheck className="!h-7 !w-7"/>
                            <p className="text-[0.7rem] text-gray-500">
                                Store customer contact details and purchase history in one place.
                            </p>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <BadgeCheck className="!h-7 !w-7"/>
                            <p className="text-[0.7rem] text-gray-500">
                                Keep track of product availability and prevent stock shortages.
                            </p>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <BadgeCheck className="!h-7 !w-7"/>
                            <p className="text-[0.7rem] text-gray-500">
                                Record and track expenses with detailed cash flow reports.
                            </p>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <BadgeCheck className="!h-7 !w-7"/>
                            <p className="text-[0.7rem] text-gray-500">
                                Track orders to maintain a smooth queue flow of pending orders.
                            </p>
                        </div>
                        
                    </div>
                </div>

                {/* Premium */}
                <div className="flex flex-row gap-7 w-1/2 bg-teal-500 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 ">
                    <div className="flex flex-col justify-between w-[30%] rounded-xl text-white">
                        <div>
                            <p className="text-2xl font-semibold mb-2">Premium</p>

                            <p className="text-[0.7rem] mb-15">
                            Great for businesses that want to use AI 
                            for smarter insights and easy custom PDF receipt generation.
                            </p>
                        </div>

                        <div className="mb-5">
                            <div className="flex flex-row justify-start mb-2">
                                <p className="text-lg font-semibold -mt-[5px]">₱ ??? </p>
                                <p className="font-light  text-xs ml-1">/month</p>
                            </div>

                            <Link href="/register">
                                <Button variant="outline" size="sm" className="rounded-full bg-zinc-50 text-black hover:opacity-60">
                                    Register Now
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-[70%] bg-gray-200 text-slate-700 rounded-xl p-5">
                        <div className="font-semibold text-md">
                            Features
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <BadgeCheck className="!h-7 !w-7"/>
                            <p className="text-[0.7rem] text-gray-500">
                                All in Free Tier plan.
                            </p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <BadgeCheck className="!h-7 !w-7"/>
                            <p className="text-[0.7rem] text-gray-500">
                                Use AI-powered analytics to forecast performance and reveal trends.
                            </p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <BadgeCheck className="!h-7 !w-7"/>
                            <p className="text-[0.7rem] text-gray-500">
                                Automate reminders, PDF receipts, and customer emails for efficiency.
                            </p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <BadgeCheck className="!h-7 !w-7"/>
                            <p className="text-[0.7rem] text-gray-500">
                                Access to Queue Management Feature.
                            </p>
                        </div>
                    </div>
                </div>
            </div>   
        </div>
    )
}