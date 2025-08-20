import { Folder, FolderPlus, Mic, Search } from 'lucide-react'
import "../../styles/searchbox.css"

export default function TopBox({ onCreateEntityTypeChange }: { onCreateEntityTypeChange: (createdBy: "button" | null, type: "file" | "folder") => void }) {
    return (
        <div className='mb-10 pt-5 flex items-center gap-3'>
            <div className='flex items-center gap-3'>
                <FolderPlus className='cursor-pointer' onClick={() => onCreateEntityTypeChange("button", "folder")} />
                <Folder className='cursor-pointer' onClick={() => onCreateEntityTypeChange("button", "file")} />
            </div>
            <div className='flex items-center'>
                <input type="text" className='max-w-[160px] rounded-md outline-0 border text-sm border-prime pl-2 py-0.5 pr-7 placeholder:text-xs' placeholder='Search...' />
                <div className='relative bg-prime h-[26px] -ml-2 border border-prime flex items-center justify-center px-2 rounded-e-md'>
                    <Search className='w-3 h-3 text-white cursor-pointer' />
                    <Mic className='absolute top-1.5 -left-5 w-3 h-3 cursor-pointer' />
                </div>
            </div>
        </div>
    )
}
