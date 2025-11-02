import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useDate } from "@/pages/layout/Layout";
import DonutChart from "./DonutChart";
import CategorySummary from "./CategorySummary";
import { CATEGORY_EXPENSES, DEFAULT_STYLE } from "@/assets/constants";

const expenseStyleMap = new Map(
    CATEGORY_EXPENSES.map((cat) => [
        cat.name,
        { color: cat.color, bgClass: cat.bgClass },
    ])
);
const DEFAULT_STYLE_OBJ = {
    color: "#D1D5DB", // 미분류용 Hex (DonutChart용)
    bgClass: DEFAULT_STYLE.bgClass, // 미분류용 Tailwind 클래스 (CategorySummary용)
};

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
            .map(([name, amount]) => {
                // 5. [수정] Map에서 스타일 객체(color + bgClass)를 가져옵니다.
                const style = expenseStyleMap.get(name) || DEFAULT_STYLE_OBJ;

                return {
                    name,
                    amount,
                    percentage: total === 0 ? 0 : (amount / total) * 100,
                    color: style.color, // DonutChart가 사용할 Hex
                    bgClass: style.bgClass, // CategorySummary가 사용할 클래스
                };
            })
            .sort((a, b) => b.amount - a.amount);

        return { categoryStats: statsArray, totalExpense: total };
    }, [monthlyExpenses]);

    return (
        <section className="-mt-16 z-10 relative w-[960px] mx-auto bg-white p-2 border border-black">
            {/* 디자인대로 차트와 요약본을 나란히 배치 */}
            <div className="flex h-full justify-between">
                {/* 1. 도넛 차트 (왼쪽) */}
                <div className="w-full flex justify-center items-center">
                    <DonutChart stats={categoryStats} />
                </div>

                {/* 2. 요약 표 (오른쪽) */}
                <div className="w-[360px] mx-8 my-12">
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
