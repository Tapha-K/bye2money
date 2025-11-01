import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "./transactionsSlice";

export const store = configureStore({
    reducer: {
        // "transactions"라는 이름으로 'transactionsSlice'를 등록
        transactions: transactionsReducer,
    },
});
