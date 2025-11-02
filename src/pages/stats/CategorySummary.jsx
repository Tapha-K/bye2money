import Amount from "@/components/Amount";

const CategorySummary = ({ stats, total }) => {
    return (
        <div className="w-full">
            {/* 1. 표 헤더 */}
            <div className="flex justify-between items-center py-6">
                <h2 className="text-xl">이번 달 지출 금액</h2>
                <span className="text-xl">
                    {/* Amount 컴포넌트 재활용 */}
                    <Amount
                        value={-total}
                        colorVariant="neutral"
                        className="text-xl"
                    />
                    원
                </span>
            </div>

            {/* 2. 표 바디 (카테고리 목록) */}
            <div className="border border-black divide-y divide-black">
                {stats.length > 0 ? (
                    stats.map((stat) => (
                        <div
                            key={stat.name}
                            className="flex justify-between items-center py-4 divide-x divide-black"
                        >
                            <div className="flex justify-center items-center w-[100px]">
                                {/* 카테고리 이름 */}
                                <span className="text-xl">{stat.name}</span>
                            </div>
                            <div className="flex justify-between items-center w-[300px]">
                                {/* 비율 */}
                                <span className="text-xl text-black pl-10">
                                    {stat.percentage.toFixed(0)}%
                                </span>
                                {/* 금액 */}
                                <span className="text-xl pr-10">
                                    {stat.amount.toLocaleString()}원
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-500">
                        지출 내역이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategorySummary;
