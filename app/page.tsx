import TextBody from "@/component/Body";
import Header from "@/component/Header";
import SideBar from "@/component/Sidebar/SideBar";

export default function Home() {
  return (
    <div className="">
      <Header />
      <div className="container max-w-screen-2xl mx-auto flex gap-x-10">
        <SideBar />
        <TextBody/>
      </div>
    </div>
  );
}
