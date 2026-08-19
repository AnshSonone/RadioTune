import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    value: ""
}

export const SearchSlice = createSlice({
    name: "Search",
    initialState,
    reducers: {
        addSearch: (state, action) => {
            state.value = action.payload
        },
        
    }
})

export const { addSearch } = SearchSlice.actions

export const searchSelector = (state) => state.search.value

export default SearchSlice.reducer