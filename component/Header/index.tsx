import React from 'react'
import logo from "../../public/assets/logo/transparent-text-black.png"
import Image from 'next/image'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Header() {
    return (
        <div className='bg-prime h-14 py-3 px-4 border-b border-sky-800 horizontal-padding dark:bg-gray-900 dark:border-gray-700'>
            <div className='flex items-center justify-between container mx-auto max-w-screen-2xl'> 
                <Image width={100} height={100} src={logo} alt='logo' />
                <div className='flex items-center gap-4'>
                    <ThemeToggle />
                    <div className='w-8 h-8 rounded-full p-2 bg-sky-500 flex items-center justify-center dark:bg-sky-600'>
                        <p className='text-white font-semibold'>T</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
