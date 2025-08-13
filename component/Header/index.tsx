import React from 'react'
import logo from "../../public/assets/logo/transparent-text-black.png"
import Image from 'next/image'

export default function Header() {
    return (
        <div className='bg-white h-14 py-3 px-4 border-b border-gray-100 horizontal-padding'>
            <div className='flex items-center justify-between container mx-auto max-w-screen-2xl'> <Image width={80} height={80} src={logo} alt='logo' />
                <div className='w-8 h-8 rounded-full p-2 bg-sky-500 flex items-center justify-center'>
                    <p>T</p>
                </div>
            </div>

        </div>
    )
}
