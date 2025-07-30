import Content from "@/component/Content/content";
import FolderSidebar from "@/component/folder/Folder";

export default function Home() {
  return (
    <div className="text-lg uppercase text-green-500 grid grid-cols-[20%_80%] h-screen">
      <FolderSidebar />
      <div>
        <Content />
      </div>
    </div>
  );
}
