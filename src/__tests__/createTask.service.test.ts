import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { configureStore } from '@reduxjs/toolkit';
import { appAPI } from '../service/api';
import { userApi } from '../service/user';
import type { CreateTaskRequest, TaskItem } from '../types/userTask';

// Mock response
const mockTaskResponse: TaskItem = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Test Task',
  descriptionMd: 'Test description',
  statusId: 2,
  statusName: 'Todo',
  priorityId: 2,
  priorityName: 'Medium',
  dueAt: '2024-12-31T23:59:59Z',
  estimateMinutes: 120,
  spentMinutes: 0,
  completedAt: null,
  createdAt: '2024-01-01T09:00:00Z',
  updatedAt: '2024-01-01T09:00:00Z',
};

// MSW server setup
const server = setupServer(
  http.post('*/user/task', () => {
    return HttpResponse.json(mockTaskResponse);
  })
);

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

describe('Create Task Service', () => {
  it('successfully creates a task', async () => {
    const store = createTestStore();
    
    const taskData: CreateTaskRequest = {
      title: 'Test Task',
      descriptionMd: 'Test description',
      priorityId: '2',
      dueAt: '2024-12-31T23:59:59Z',
      estimateMinutes: 120,
    };
    
    const result = await store.dispatch(
      userApi.endpoints.createUserTask.initiate(taskData)
    );
    
    expect(result.data).toEqual(mockTaskResponse);
  });

  it('handles 400 validation errors', async () => {
    server.use(
      http.post('*/user/task', () => {
        return HttpResponse.json(
          {
            message: 'Validation failed',
            errors: {
              title: 'Title is required',
            },
          },
          { status: 400 }
        );
      })
    );
    
    const store = createTestStore();
    
    const taskData: CreateTaskRequest = {
      title: '',
      descriptionMd: 'Test description',
      priorityId: '2',
      dueAt: '2024-12-31T23:59:59Z',
      estimateMinutes: 120,
    };
    
    const result = await store.dispatch(
      userApi.endpoints.createUserTask.initiate(taskData)
    );
    
    expect(result.error).toBeDefined();
    expect((result.error as { status: number }).status).toBe(400);
  });

  it('handles 401 unauthorized errors', async () => {
    server.use(
      http.post('*/user/task', () => {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      })
    );
    
    const store = createTestStore();
    
    const taskData: CreateTaskRequest = {
      title: 'Test Task',
      descriptionMd: 'Test description',
      priorityId: '2',
      dueAt: '2024-12-31T23:59:59Z',
      estimateMinutes: 120,
    };
    
    const result = await store.dispatch(
      userApi.endpoints.createUserTask.initiate(taskData)
    );
    
    expect(result.error).toBeDefined();
    expect((result.error as { status: number }).status).toBe(401);
  });

  it('handles 500 server errors', async () => {
    server.use(
      http.post('*/user/task', () => {
        return HttpResponse.json({ message: 'Internal server error' }, { status: 500 });
      })
    );
    
    const store = createTestStore();
    
    const taskData: CreateTaskRequest = {
      title: 'Test Task',
      descriptionMd: 'Test description',
      priorityId: '2',
      dueAt: '2024-12-31T23:59:59Z',
      estimateMinutes: 120,
    };
    
    const result = await store.dispatch(
      userApi.endpoints.createUserTask.initiate(taskData)
    );
    
    expect(result.error).toBeDefined();
    expect((result.error as { status: number }).status).toBe(500);
  });

  it('sends correct request payload', async () => {
    let requestBody: CreateTaskRequest | undefined;
    
    server.use(
      http.post('*/user/task', async ({ request }) => {
        requestBody = await request.json() as CreateTaskRequest;
        return HttpResponse.json(mockTaskResponse);
      })
    );
    
    const store = createTestStore();
    
    const taskData: CreateTaskRequest = {
      title: 'Test Task',
      descriptionMd: 'Test description',
      priorityId: '3',
      dueAt: '2024-12-31T23:59:59Z',
      estimateMinutes: 180,
    };
    
    await store.dispatch(
      userApi.endpoints.createUserTask.initiate(taskData)
    );
    
    expect(requestBody).toEqual(taskData);
  });
});