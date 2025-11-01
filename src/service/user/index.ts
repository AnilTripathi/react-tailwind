/**
 * User service using RTK Query
 * Handles user-related API calls and data management
 */

import { appAPI } from '../api';
import { ENDPOINTS } from '../../constants/endpoints';
import type { User } from '../../types/user';
import type { TaskItem, Page, TaskQueryParams, CreateTaskRequest, EditTaskRequest } from '../../types/userTask';

/**
 * Build query string from TaskQueryParams
 * Omits undefined values and formats parameters correctly
 */
const buildTaskQueryString = (params: TaskQueryParams): string => {
  const searchParams = new URLSearchParams();
  
  if (params.status !== undefined) searchParams.set('status', params.status.toString());
  if (params.q) searchParams.set('q', params.q);
  if (params.fromDue) searchParams.set('fromDue', params.fromDue);
  if (params.toDue) searchParams.set('toDue', params.toDue);
  
  searchParams.set('page', params.page.toString());
  searchParams.set('size', params.size.toString());
  searchParams.set('sort', params.sort);
  
  return searchParams.toString();
};

export const userApi = appAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ENDPOINTS.USER.GET_ALL,
    }),
    getUserById: builder.query<User, number>({
      query: (id) => ENDPOINTS.USER.GET_BY_ID(id),
    }),
    getUserTasks: builder.query<Page<TaskItem>, TaskQueryParams>({
      query: (params) => {
        const queryString = buildTaskQueryString(params);
        return `${ENDPOINTS.USER.TASK_LIST}?${queryString}`;
      },
      providesTags: ['UserTask'],
    }),
    createUserTask: builder.mutation<TaskItem, CreateTaskRequest>({
      query: (taskData) => ({
        url: ENDPOINTS.USER.TASK_CREATE,
        method: 'POST',
        body: taskData,
      }),
      invalidatesTags: ['UserTask'],
    }),
    editUserTask: builder.mutation<TaskItem, { id: string; body: EditTaskRequest }>({
      query: ({ id, body }) => ({
        url: `${ENDPOINTS.USER.TASK_EDIT}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['UserTask'],
    }),
    deleteUserTask: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${ENDPOINTS.USER.TASK_DELETE}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserTask'],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useGetUserTasksQuery, useCreateUserTaskMutation, useEditUserTaskMutation, useDeleteUserTaskMutation } = userApi;