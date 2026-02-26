import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ChatWidget from "@/components/ChatWidget";

const MainLayout = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pt-[70px] lg:pl-[280px] p-6 min-h-screen transition-all duration-300">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <ChatWidget />
    </div>
  );
};

export default MainLayout;