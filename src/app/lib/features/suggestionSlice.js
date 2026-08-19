import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    value: []
}

export const suggestionSlice = createSlice({
    name: "Suggestion",
    initialState,
    reducers: {
        addSuggestion: (state, action) => {
            state.value = action.payload
        },
        
    }
})

export const { addSuggestion } = suggestionSlice.actions

export const suggestionSelector = (state) => state.suggestion.value

export default suggestionSlice.reducer