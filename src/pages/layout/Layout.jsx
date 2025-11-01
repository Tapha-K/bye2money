import { useState, createContext, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

export const DateContext = createContext(null);

export const useDate = () => {
    const context = useContext(DateContext);
    if (!context) {
        throw new Error("Cannot use date context outside of a DateProvider");
    }
    return context;
};

const Layout = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const location = useLocation(); // 현재 경로(URL)를 가져옴

    const getViewMode = () => {
        if (location.pathname === "/calendar") return "calendar";
        if (location.pathname === "/stats") return "stats";
        return "list"; // 기본값
    };

    return (
        <DateContext.Provider value={{ currentDate, setCurrentDate }}>
            <Header
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                viewMode={getViewMode()}
            />
            <main className="relative mx-auto">
                <Outlet />
            </main>
        </DateContext.Provider>
    );
};

export default Layout;
