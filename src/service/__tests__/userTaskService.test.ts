/**
 * User task service tests
 */

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { configureStore } from '@reduxjs/toolkit';
import { appAPI } from '../api';
import { userApi } from '../user';
import { ENDPOINTS } from '../../constants/endpoints';
import type { TaskItem, EditTaskRequest } from '../../types/userTask';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const createTestStore = () => {
  return configureStore({
    reducer: {
      [appAPI.reducerPath]: appAPI.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(appAPI.middleware),
  });
};

const mockTask: TaskItem = {
  id: '123',
  title: 'Test Task',
  descriptionMd: 'Test description',
  statusId: 2,
  statusName: 'Todo',
  priorityId: 2,
  priorityName: 'Medium',
  dueAt: '2024-12-31T23:59:59Z',
  estimateMinutes: 60,
  spentMinutes: 0,
  completedAt: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('editUserTask', () => {
  it('should edit task successfully', async () => {
    server.use(
      http.put(`${ENDPOINTS.BASE_URL}${ENDPOINTS.USER.TASK_EDIT}/123`, () => {
        return HttpResponse.json(mockTask);
      })
    );

    const store = createTestStore();
    const editRequest: EditTaskRequest = {
      title: 'Updated Task',
      descriptionMd: 'Updated description',
      priorityId: '3',
      dueAt: '2024-12-31T23:59:59Z',
      estimateMinutes: 90,
    };

    const result = await store.dispatch(
      userApi.endpoints.editUserTask.initiate({ id: '123', body: editRequest })
    );

    expect(result.data).toEqual(mockTask);
  });

  it('should handle 404 error', async () => {
    server.use(
      http.put(`${ENDPOINTS.BASE_URL}${ENDPOINTS.USER.TASK_EDIT}/123`, () => {
        return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
      })
    );

    const store = createTestStore();
    const editRequest: EditTaskRequest = {
      title: 'Updated Task',
      descriptionMd: 'Updated description',
      priorityId: '3',
      dueAt: '2024-12-31T23:59:59Z',
      estimateMinutes: 90,
    };

    const result = await store.dispatch(
      userApi.endpoints.editUserTask.initiate({ id: '123', body: editRequest })
    );

    expect(result.error).toBeDefined();
    expect((result.error as { status: number }).status).toBe(404);
  });

  it('should handle validation errors', async () => {
    server.use(
      http.put(`${ENDPOINTS.BASE_URL}${ENDPOINTS.USER.TASK_EDIT}/123`, () => {
        return HttpResponse.json(
          {
            message: 'Validation failed',
            errors: { title: 'Title is required' }
          },
          { status: 422 }
        );
      })
    );

    const store = createTestStore();
    const editRequest: EditTaskRequest = {
      title: '',
      descriptionMd: 'Updated description',
      priorityId: '3',
      dueAt: '2024-12-31T23:59:59Z',
      estimateMinutes: 90,
    };

    const result = await store.dispatch(
      userApi.endpoints.editUserTask.initiate({ id: '123', body: editRequest })
    );

    expect(result.error).toBeDefined();
    expect((result.error as { status: number }).status).toBe(422);
  });
});

describe('deleteUserTask', () => {
  it('should delete task successfully', async () => {
    server.use(
      http.delete(`${ENDPOINTS.BASE_URL}${ENDPOINTS.USER.TASK_DELETE}/123`, () => {
        return new HttpResponse(null, { status: 204 });
      })
    );

    const store = createTestStore();
    const result = await store.dispatch(
      userApi.endpoints.deleteUserTask.initiate({ id: '123' })
    );

    expect(result.data).toBeUndefined();
    expect(result.error).toBeUndefined();
  });

  it('should handle 404 error on delete', async () => {
    server.use(
      http.delete(`${ENDPOINTS.BASE_URL}${ENDPOINTS.USER.TASK_DELETE}/123`, () => {
        return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
      })
    );

    const store = createTestStore();
    const result = await store.dispatch(
      userApi.endpoints.deleteUserTask.initiate({ id: '123' })
    );

    expect(result.error).toBeDefined();
    expect((result.error as { status: number }).status).toBe(404);
  });
});