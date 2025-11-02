import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useDate } from "@/pages/layout/Layout";
import DonutChart from "./DonutChart";
import CategorySummary from "./CategorySummary";

const StatsPage = () => {
    const { items: allTransactions } = useSelector(
        (state) => state.transactions
    );
    const { currentDate } = useDate();

    // 1. 현재 월의 '지출' 내역만 필터링
    const monthlyExpenses = useMemo(() => {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        return allTransactions.filter((tx) => {
            const txDate = new Date(tx.date);
            return (
                tx.amount < 0 && // 지출만
                txDate.getFullYear() === currentYear &&
                txDate.getMonth() === currentMonth
            );
        });
    }, [allTransactions, currentDate]);

    // 2. 카테고리별 지출 합계 및 비율 계산
    const { categoryStats, totalExpense } = useMemo(() => {
        // { 식비: 10000, 교통: 5000, ... }
        const statsMap = monthlyExpenses.reduce((acc, tx) => {
            const category = tx.category || "미분류";
            const amount = Math.abs(tx.amount);

            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += amount;
            return acc;
        }, {});

        const total = Object.values(statsMap).reduce(
            (sum, val) => sum + val,
            0
        );

        // [{ name: "식비", amount: 10000, percentage: 66.7 }, ...]
        const statsArray = Object.entries(statsMap)
            .map(([name, amount]) => ({
                name,
                amount,
                percentage: total === 0 ? 0 : (amount / total) * 100,
            }))
            .sort((a, b) => b.amount - a.amount); // 금액이 큰 순서대로 정렬

        return { categoryStats: statsArray, totalExpense: total };
    }, [monthlyExpenses]);

    return (
        <section className="-mt-16 z-10 relative w-[960px] mx-auto bg-white p-2 border border-black">
            {/* 디자인대로 차트와 요약본을 나란히 배치 */}
            <div className="flex h-full justify-between">
                {/* 1. 도넛 차트 (왼쪽) */}
                <div className="w-[500px] flex justify-center items-center">
                    <DonutChart stats={categoryStats} />
                </div>

                {/* 2. 요약 표 (오른쪽) */}
                <div className="w-[400px] mx-8 my-12">
                    <CategorySummary
                        stats={categoryStats}
                        total={totalExpense}
                    />
                </div>
            </div>
        </section>
    );
};

export default StatsPage;
