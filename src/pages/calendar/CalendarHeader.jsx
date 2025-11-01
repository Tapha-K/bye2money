const CalendarHeader = () => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return (
        <div className="grid grid-cols-7">
            {days.map((day) => (
                <div
                    key={day}
                    className="text-center py-2 border-x border-b border-black"
                >
                    {day}
                </div>
            ))}
        </div>
    );
};

export default CalendarHeader;
