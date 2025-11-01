import CalendarHeader from "./CalendarHeader";
import CalendarBody from "./CalendarBody";

const CalendarPage = () => {
    return (
        // 10. 캘린더 전체 컨테이너
        <section className="-mt-16 z-10 relative w-[960px] mx-auto bg-white border-t border-black">
            <CalendarHeader />
            <CalendarBody />
            {/* (총 합계 푸터는 나중에 데이터 연결 후 추가) */}
        </section>
    );
};

export default CalendarPage;
