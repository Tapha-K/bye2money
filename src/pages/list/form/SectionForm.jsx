import InputDate from "./InputDate";
import SignToggleButton from "./SignToggleButton";
import Amount from "@/components/Amount";
import InputContent from "./InputContent";
import Payment from "./Payment";
import ActionModal from "@/components/ActionModal";
import Category from "./Category";
import CircleButton from "@/components/CircleButton";
import {
    INITIAL_PAYMENT_METHODS,
    CATEGORY_EXPENSES,
    CATEGORY_INCOMES,
} from "@/assets/constants";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTransaction, updateTransaction } from "@/store/transactionsSlice";

const paymentMethodsMap = new Map(
    INITIAL_PAYMENT_METHODS.map((m) => [m.name, m])
);
const categoryIncomesMap = new Map(CATEGORY_INCOMES.map((c) => [c.name, c]));
const categoryExpensesMap = new Map(CATEGORY_EXPENSES.map((c) => [c.name, c]));

const SectionForm = () => {
    const editingTransaction = useSelector(
        (state) => state.transactions.editingTransaction
    );
    const dispatch = useDispatch();

    // For InputDate
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [isPlus, setIsPlus] = useState(true);
    const [amount, setAmount] = useState("");
    const [content, setContent] = useState("");
    const [paymentMethods, setPaymentMethods] = useState(
        INITIAL_PAYMENT_METHODS
    );
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // For Payment modal
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: null,
        data: null,
    });
    const [newMethodName, setNewMethodName] = useState("");

    // For Payment method function
    const handleConfirm = () => {
        if (modalState.type === "add" && newMethodName.trim()) {
            const newMethod = { id: Date.now(), name: newMethodName.trim() };
            setPaymentMethods((current) => [...current, newMethod]);
        }
        if (modalState.type === "delete" && modalState.data) {
            setPaymentMethods((current) =>
                current.filter((m) => m.id !== modalState.data.id)
            );
            if (selectedMethod?.id === modalState.data.id) {
                setSelectedMethod(null);
            }
        }
        closeModal();
    };
    // For Payment modal function
    const openAddModal = () => {
        setModalState({ isOpen: true, type: "add" });
    };
    const openDeleteModal = (methodToDelete) => {
        setModalState({ isOpen: true, type: "delete", data: methodToDelete });
    };
    const closeModal = () => {
        setModalState({ isOpen: false, type: null, data: null });
        setNewMethodName("");
    };

    useEffect(() => {
        if (editingTransaction) {
            // "수정 모드"일 때: 폼을 채움
            setDate(editingTransaction.date.split("T")[0]);
            setIsPlus(editingTransaction.amount > 0);
            setAmount(Math.abs(editingTransaction.amount).toString());
            setContent(editingTransaction.content);
            setSelectedMethod(
                paymentMethodsMap.get(editingTransaction.paymentMethod) || null
            );

            const currentCategoryMap =
                editingTransaction.amount > 0
                    ? categoryIncomesMap
                    : categoryExpensesMap;
            setSelectedCategory(
                currentCategoryMap.get(editingTransaction.category) || null
            );
        } else {
            // "입력 모드"일 때 (저장 후 null이 될 때): 폼을 초기화
            setDate(new Date().toISOString().slice(0, 10));
            setIsPlus(true);
            setAmount("");
            setContent("");
            setSelectedMethod(null);
            setSelectedCategory(null);
        }
        // editingTransaction이 바뀔 때마다 이 effect가 실행됩니다.
    }, [editingTransaction]);

    // Validation
    const isFormValid =
        amount.trim() !== "" &&
        content.trim() !== "" &&
        selectedMethod !== null &&
        selectedCategory !== null;

    const handleSubmit = (event) => {
        event.preventDefault(); // form의 기본 제출 동작(새로고침)을 막기

        if (!isFormValid) {
            return;
        }

        const transactionData = {
            date,
            amount: isPlus ? Number(amount) : -Number(amount),
            content,
            paymentMethod: selectedMethod.name,
            category: selectedCategory.name,
        };

        if (editingTransaction) {
            // updateTransaction Action에 '수정된 데이터'를 실어 보냄
            dispatch(
                updateTransaction({
                    ...transactionData,
                    id: editingTransaction.id,
                })
            );
        } else {
            // addTransaction Action에 '새 데이터'를 실어 보냄
            dispatch(addTransaction({ ...transactionData, id: Date.now() }));

            setDate(new Date().toISOString().slice(0, 10));
            setIsPlus(true);
            setAmount("");
            setContent("");
            setSelectedMethod(null);
            setSelectedCategory(null);
        }
    };

    // Rendering
    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="bg-white flex divide-x divide-black items-center w-[960px] h-[100px] px-[12px] border border-black mx-auto"
            >
                <div className="flex items-center pr-4 w-[140px] h-[60px]">
                    <InputDate value={date} onChange={setDate} />
                </div>

                <div className="flex items-center px-4 w-[240px] h-[60px]">
                    <SignToggleButton isPlus={isPlus} onChange={setIsPlus} />

                    <div className="flex items-center ml-2">
                        <Amount
                            value={amount}
                            onChange={setAmount}
                            readOnly={false}
                        />
                        <span className="text-xl text-black ml-1"> 원</span>
                    </div>
                </div>

                <div className="flex items-center px-4 w-[200px] h-[60px]">
                    <InputContent value={content} onChange={setContent} />
                </div>

                <div className="flex items-center px-4 w-[160px] h-[60px]">
                    <Payment
                        options={paymentMethods}
                        selectedOption={selectedMethod}
                        onSelect={setSelectedMethod}
                        onAdd={openAddModal}
                        onDelete={openDeleteModal}
                    />
                </div>
                <div className="flex items-center px-4 w-[160px] h-[60px]">
                    <Category
                        options={isPlus ? CATEGORY_INCOMES : CATEGORY_EXPENSES}
                        selectedOption={selectedCategory}
                        onSelect={setSelectedCategory}
                    />
                </div>
                <div className="flex items-center pl-4 w-auto h-[60px]">
                    <CircleButton
                        isActive={isFormValid} // 유효성 검사 결과에 따라 활성화 상태 전달
                        activeClass="bg-black"
                        inactiveClass="bg-gray-400"
                        imageUrl={"/images/checkLogo.png"}
                        onClick={handleSubmit}
                    />
                </div>
            </form>
            {modalState.isOpen && (
                <ActionModal
                    title={
                        modalState.type === "add"
                            ? "추가하실 결제 수단을 입력해주세요."
                            : "해당 결제 수단을 삭제하시겠습니까?"
                    }
                    confirmText={modalState.type === "add" ? "추가" : "삭제"}
                    onConfirm={handleConfirm}
                    onClose={closeModal}
                >
                    {modalState.type === "add" && (
                        <input
                            type="text"
                            value={newMethodName}
                            onChange={(e) => setNewMethodName(e.target.value)}
                            placeholder="예: 네이버페이"
                            className="border p-2 rounded w-full mt-2"
                            autoFocus
                        />
                    )}
                    {modalState.type === "delete" && (
                        <p>
                            <strong>{modalState.data?.name}</strong>'
                        </p>
                    )}
                </ActionModal>
            )}
        </>
    );
};

export default SectionForm;
