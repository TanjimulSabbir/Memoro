import React from 'react'
import TopBox from './TopBox'
import ShowFolder from '../folder/ShowFolder'
import FolderPage from '../folder/Folder'

export default function SideBar() {
    return (
        <div className='w-full max-w-[280px] border-r border-gray-300 px-3 h-screen'>
            <TopBox />
            <FolderPage/>
        </div>
    )
}
