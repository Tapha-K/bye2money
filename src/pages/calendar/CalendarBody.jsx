import { useDate } from "../layout/Layout";

const CalendarBody = () => {
    // Context에서 현재 날짜를 가져옴
    const { currentDate } = useDate();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0 = 1월, 11 = 12월

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = 일요일 ~ 6 = 토요일
    const daysInMonth = lastDayOfMonth.getDate();

    const calendarDays = [];

    // 1일이 시작하기 전의 빈 칸
    for (let i = 0; i < startDayOfWeek; i++) {
        calendarDays.push(
            <div
                key={`cal-empty-${i}`}
                className="border-x border-b border-black h-[140px]"
            ></div>
        );
    }

    // 실제 날짜
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(
            <div
                key={`cal-day-${day}`}
                className="border-x border-b border-black h-[140px] p-2"
            >
                <span className="text-lg">{day}</span>
                {/* (나중에 이 div 안에 거래 내역이 들어감) */}
            </div>
        );
    }

    // 7*6이 될 때까지 빈 칸
    for (let i = 1 + startDayOfWeek + daysInMonth; i <= 42; i++) {
        calendarDays.push(
            <div
                key={`cal-empty-${i}`}
                className="border-x border-b border-black h-[140px] p-2"
            ></div>
        );
    }

    return <div className="grid grid-cols-7">{calendarDays}</div>;
};

export default CalendarBody;
