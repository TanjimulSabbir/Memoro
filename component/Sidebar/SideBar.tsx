"use client"
import TopBox from './TopBox'
import ShowFolder from '../folder/ShowFolder'
import { useState } from 'react';


export default function SideBar() {
    const [createEntityType, setCreateEntityType] = useState<{createBy:"button"|null, type:"file" | "folder"}>({createBy:"button", type:"folder"});


    const handleCreateEntityTypeChange = (createBy: "button" | null, type: "file" | "folder") => {
        return setCreateEntityType({...createEntityType, createBy, type});
    };

    return (
        <div className='w-full max-w-[280px] border-r border-gray-300 px-3 h-screen'>
            <TopBox onCreateEntityTypeChange={handleCreateEntityTypeChange} />
            <ShowFolder createEntityType={createEntityType} handleCreateEntityTypeChange={handleCreateEntityTypeChange} />
        </div>
    )
}
