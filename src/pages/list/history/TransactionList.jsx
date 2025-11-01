import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFilter, setEditing } from "@/store/transactionsSlice";
import { useDate } from "@/pages/layout/Layout";
import MonthlySummary from "./MonthlySummary";
import DailyTransactionGroup from "./DailyTransactionGroup";

const TransactionList = ({ onDelete }) => {
    const { items: allTransactions, filter } = useSelector(
        (state) => state.transactions
    );
    const dispatch = useDispatch();
    const { currentDate } = useDate();

    // 전체 transactions을 Header의 '월'로 필터링
    const monthlyTransactions = useMemo(() => {
        return allTransactions.filter((tx) => {
            const txDate = new Date(tx.date);
            return (
                txDate.getFullYear() === currentDate.getFullYear() &&
                txDate.getMonth() === currentDate.getMonth()
            );
        });
    }, [allTransactions, currentDate]);

    // filtering transactions by total income/expense
    const filteredTransactions = useMemo(() => {
        const { income, expense } = filter;

        if (income && expense) {
            return monthlyTransactions; // 둘 다 켜져 있는 경우
        }
        if (income) {
            return monthlyTransactions.filter((tx) => tx.amount > 0); // 수입만 켜져 있는 경우
        }
        if (expense) {
            return monthlyTransactions.filter((tx) => tx.amount < 0); // 지출만 켜져 있는 경우
        }

        return []; // 둘 다 꺼져 있는 경우
    }, [monthlyTransactions, filter]);

    // filteredTransactions 기준으로 날짜 별 그룹
    const groupedTransactions = filteredTransactions.reduce((groups, tx) => {
        const date = tx.date.split("T")[0]; // 날짜 부분만 추출
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(tx);
        return groups;
    }, {});

    const sortedDates = Object.keys(groupedTransactions).sort(
        (a, b) => new Date(b) - new Date(a)
    );

    return (
        <section className="mt-12 w-[900px] mx-auto">
            <MonthlySummary
                transactions={monthlyTransactions} // MonthlySummary에는 월 별 리스트 전달
                filter={filter}
                onFilterChange={(filterType) => dispatch(setFilter(filterType))}
            />
            {/* 내역은 필터링된 sortedDates 사용 */}
            {sortedDates.map((date) => (
                <DailyTransactionGroup
                    key={date}
                    date={date}
                    transactions={groupedTransactions[date]}
                    onEdit={(tx) => dispatch(setEditing(tx))}
                    onDelete={onDelete}
                />
            ))}
        </section>
    );
};

export default TransactionList;
