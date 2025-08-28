import { Folder, FolderPlus, Mic, Search } from 'lucide-react'
import "../../styles/searchbox.css"
import { EntityCreationStateProps, EntityCreationType } from '@/types/types';

interface TopBoxProps {
    entityCreationsState: EntityCreationStateProps | null;
    setEntityCreationsState: (value: EntityCreationStateProps) => void;
    handleSearchTextChange: (value: string) => void;
};

export default function TopBox({ props }: { props: TopBoxProps }) {
    const { entityCreationsState, setEntityCreationsState, handleSearchTextChange } = props;
    return (
        <div className='mb-7 pt-4 flex items-center gap-3'>
            <div className='flex items-center gap-3'>
                <FolderPlus className={`cursor-pointer text-prime ${entityCreationsState?.entityCreationMethod === "BUTTON" && entityCreationsState?.entityCreationType === "FOLDER" ? "text-sky-500" : ""}`}
                    onClick={() => setEntityCreationsState({ entityCreationMethod: "BUTTON", entityCreationType: "FOLDER" })} />
                <Folder className={`cursor-pointer text-prime ${entityCreationsState?.entityCreationMethod === "BUTTON" && entityCreationsState?.entityCreationType === "FILE" ? "text-sky-500" : ""}`}
                    onClick={() => setEntityCreationsState({ entityCreationMethod: "BUTTON", entityCreationType: "FILE" })} />
            </div>
            <div className='flex items-center'>
                <input onChange={(e) => handleSearchTextChange(e.target.value)} type="text" className='max-w-[160px] rounded-md outline-0 border text-sm border-prime pl-2 py-0.5 pr-7 placeholder:text-xs' placeholder='Search...' />
                <div className='relative bg-prime h-[26px] -ml-2 border border-prime flex items-center justify-center px-2 rounded-e-md'>
                    <Search className='w-3 h-3 text-white cursor-pointer' />
                    <Mic className='absolute top-1.5 -left-5 w-3 h-3 cursor-pointer' />
                </div>
            </div>
        </div>
    )
}
