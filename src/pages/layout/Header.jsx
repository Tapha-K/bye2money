import CircleButton from "@/components/CircleButton";
import { Link } from "react-router-dom";

const Header = ({ currentDate, setCurrentDate, viewMode }) => {
    // --- 날짜 변경 ---
    const handlePrevMonth = () => {
        setCurrentDate(
            new Date(currentDate.setMonth(currentDate.getMonth() - 1))
        );
    };
    const handleNextMonth = () => {
        setCurrentDate(
            new Date(currentDate.setMonth(currentDate.getMonth() + 1))
        );
    };

    return (
        <header className="flex items-center h-[200px] bg-[#9f9f9f]">
            <div className="flex justify-between items-center w-[960px] mx-auto mb-[50px]">
                {/* 1. 로고 */}
                <h1 className="w-[160px] text-2xl ml-[20px]">Wise Wallet</h1>

                {/* 2. 날짜 네비게이터 */}
                <div className="flex items-center gap-[60px]">
                    <button
                        className="text-2xl font-semibold hover:text-white transition-colors"
                        onClick={handlePrevMonth}
                    >
                        &lt;
                    </button>
                    <div className="text-center">
                        <p className="text-m">{currentDate.getFullYear()}</p>
                        <p className="text-3xl">
                            {currentDate.toLocaleString("default", {
                                month: "long",
                            })}
                        </p>
                    </div>
                    <button
                        className="text-2xl font-semibold hover:text-white transition-colors"
                        onClick={handleNextMonth}
                    >
                        &gt;
                    </button>
                </div>

                {/* 3. 보기 모드 토글 버튼 */}
                <div className="w-[160px] flex gap-[12px] pl-[20px] mr-[20px]">
                    <Link to="/">
                        <CircleButton
                            isActive={viewMode === "list"}
                            imageUrl={"/images/listLogo.png"}
                            activeColor="rgba(255,255,255,1)"
                            inactiveColor="rgba(0,0,0,0)"
                        />
                    </Link>
                    <Link to="/calendar">
                        <CircleButton
                            isActive={viewMode === "calendar"}
                            imageUrl={"/images/calendarLogo.png"}
                            activeColor="rgba(255,255,255,1)"
                            inactiveColor="rgba(0,0,0,0)"
                        />
                    </Link>
                    <Link to="/stats">
                        <CircleButton
                            isActive={viewMode === "stats"}
                            imageUrl={"/images/statsLogo.png"}
                            activeColor="rgba(255,255,255,1)"
                            inactiveColor="rgba(0,0,0,0)"
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
