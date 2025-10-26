import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import type { Todo, UpdateTodoPayload } from '@/types/user'

// Define a type for the slice state
interface TodoState {
  value: Todo[] | [];
  error?: string;
  isLoading?: boolean;
}

// Define the initial state using that type
const initialState: TodoState = {
  value: [],
  error: undefined,
  isLoading: false,
}

export const myTodoSlice = createSlice({
  name: 'myTodos',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addTodo: (state,action:PayloadAction<Todo>) => {
      const tdList=[...state.value,action.payload];
      tdList.sort((a,b)=>new Date(a.dueDate).getTime()-new Date(b.dueDate).getTime());
      state.value = tdList;
    },
    // Update todo based on id then sort by dueDate
    updateToto: (state,action:PayloadAction<Todo>) => {
      const tdList=state.value.map(td=>{
        if(td.id===action.payload.id){
          return action.payload;
        }
        return td;
      });
      tdList.sort((a,b)=>new Date(a.dueDate).getTime()-new Date(b.dueDate).getTime());
      state.value = tdList;
    },
    // toggle todo based on id then sort by dueDate
    toggleTodo: (state, action: PayloadAction<UpdateTodoPayload>) => {
      const tdList=state.value.map(td=>{
        if(td.id===action.payload.id){
          return {
            ...td,
            completed: action.payload.completed,
            completedDate: action.payload.completedDate
          }
        }
        return td;
      });
      tdList.sort((a,b)=>new Date(a.dueDate).getTime()-new Date(b.dueDate).getTime());
      state.value = tdList;
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      const tdList=state.value.filter(td=>td.id!==action.payload);
      state.value = tdList;
    },
  },
})

export const {addTodo,deleteTodo,toggleTodo,updateToto} = myTodoSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectTotoList = (state: RootState) => state.myTodos.value;

export default myTodoSlice.reducer