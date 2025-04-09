import { RootState } from './store';

// Selector functions used to extract and compute specific pieces of state from a Redux store
// Handle paginated data

//Get subset of tasks based on the current page and page size
export const selectPaginatedTasks = (state: RootState) => {
  const { currentPage, pageSize, filteredTasks } = state.tasks;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  return filteredTasks.slice(start, end);
};

//Calculates the total number of pages needed to display all tasks
export const selectTotalPages = (state: RootState) => {
  const { filteredTasks, pageSize } = state.tasks;
  return Math.ceil(filteredTasks.length / pageSize);
};
