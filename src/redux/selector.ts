import { RootState } from './store';

export const selectPaginatedTasks = (state: RootState) => {
  const { currentPage, pageSize, filteredTasks } = state.tasks;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  return filteredTasks.slice(start, end);
};

export const selectTotalPages = (state: RootState) => {
  const { filteredTasks, pageSize } = state.tasks;
  return Math.ceil(filteredTasks.length / pageSize);
};
