import { createSlice } from "@reduxjs/toolkit";
import {Cards} from '../../data/data'
let card_id = Cards.length;
export const cardSlice = createSlice({

    name: "card",
    initialState: Cards,
    reducers: {
        addCard: (state, action) => {
            state.push({
                id: card_id++,
                title: action.payload.title,
                link : action.payload.link,
                bucket: action.payload.bucket,
                history: 0,
            });
        },
        deleteCard: (state, action) => {
            return state.filter((card) => card.id !== action.payload.title);
        },
        editCard: (state, action) => {
            const index = state.findIndex((card) => card.id === action.payload.id);
            state[index] = action.payload;
        },


    },
});
export const { addCard, deleteCard, editCard, moveCard, selectCard } = cardSlice.actions;

export default cardSlice.reducer;