import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useDate } from "@/pages/layout/Layout";
import CalendarHeader from "./CalendarHeader";
import CalendarBody from "./CalendarBody";
import CalendarFooter from "./CalendarFooter";

const CalendarPage = () => {
    const { items: allTransactions } = useSelector(
        (state) => state.transactions
    );
    const { currentDate } = useDate();
    const today = useMemo(() => new Date(), []);

    // '월별' 내역 필터링
    const monthlyTransactions = useMemo(() => {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); //0: 1월 ~ 11: 12월

        return allTransactions.filter((tx) => {
            const txDate = new Date(tx.date);
            return (
                txDate.getFullYear() === currentYear &&
                txDate.getMonth() === currentMonth
            );
        });
    }, [allTransactions, currentDate]);

    // '일별' 요약 데이터 생성
    const dailySummaries = useMemo(() => {
        return monthlyTransactions.reduce((acc, tx) => {
            const txDate = new Date(tx.date);

            const yearStr = txDate.getFullYear();
            const monthStr = String(txDate.getMonth() + 1).padStart(2, "0");
            const dayStr = String(txDate.getDate()).padStart(2, "0");
            const dateKey = `${yearStr}-${monthStr}-${dayStr}`; // 예: "2025-11-01"

            if (!acc[dateKey]) {
                acc[dateKey] = { income: 0, expense: 0, total: 0 };
            }
            if (tx.amount > 0) acc[dateKey].income += tx.amount;
            else acc[dateKey].expense += tx.amount;
            acc[dateKey].total = acc[dateKey].income + acc[dateKey].expense;
            return acc;
        }, {});
    }, [monthlyTransactions]);

    return (
        <section className="-mt-16 z-10 relative w-[960px] mx-auto bg-white ">
            <div className="mx-auto border border-black">
                <CalendarHeader />
                <CalendarBody dailySummaries={dailySummaries} today={today} />
            </div>
            <CalendarFooter transactions={monthlyTransactions} />
        </section>
    );
};

export default CalendarPage;
