import Header from "@/component/Header";
import SideBar from "@/component/Sidebar/SideBar";

export default function Home() {
  return (
    <div className="">
      <Header/>
      <div className="container max-w-screen-2xl mx-auto">
        <SideBar />
  </div>
    </div>
  );
}
