import { useMemo } from "react";
import MonthlySummary from "./MonthlySummary";
import DailyTransactionGroup from "./DailyTransactionGroup";

const TransactionList = ({
    transactions,
    onEdit,
    onDelete,
    filter,
    onFilterChange,
}) => {
    // filtering transactions by total income/expense
    const filteredTransactions = useMemo(() => {
        const { income, expense } = filter;

        if (income && expense) {
            return transactions; // 둘 다 켜져 있는 경우
        }
        if (income) {
            return transactions.filter((tx) => tx.amount > 0); // 수입만 켜져 있는 경우
        }
        if (expense) {
            return transactions.filter((tx) => tx.amount < 0); // 지출만 켜져 있는 경우
        }

        return []; // 둘 다 꺼져 있는 경우
    }, [transactions, filter]);

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
                transactions={transactions} // MonthlySummary에는 원본 리스트 전달
                filter={filter}
                onFilterChange={onFilterChange}
            />
            {/* 내역은 필터링된 sortedDates 사용 */}
            {sortedDates.map((date) => (
                <DailyTransactionGroup
                    key={date}
                    date={date}
                    transactions={groupedTransactions[date]}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </section>
    );
};

export default TransactionList;
