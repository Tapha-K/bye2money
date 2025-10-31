import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const location = useLocation(); // 현재 경로(URL)를 가져옴

    const getViewMode = () => {
        if (location.pathname === "/calendar") return "calendar";
        if (location.pathname === "/stats") return "stats";
        return "list"; // 기본값
    };

    return (
        <>
            <Header
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                viewMode={getViewMode()}
            />
            <main className="relative mx-auto">
                <Outlet />
            </main>
        </>
    );
};

export default Layout;
