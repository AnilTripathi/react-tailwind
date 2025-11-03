/**
 * MyToDoList Integration Tests
 * Tests task list functionality, filtering, and API integration
 */

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { configureStore } from '@reduxjs/toolkit';
import { appAPI } from '../service/api';
import { userApi } from '../service/user';
import type { Page, TaskItem, TaskQueryParams } from '../types/userTask';

// Mock data
const mockTasksPage: Page<TaskItem> = {
  content: [
    {
      id: '1',
      title: 'Test Task 1',
      descriptionMd: 'Test description 1',
      statusId: 2,
      statusName: 'Todo',
      priorityId: 1,
      priorityName: 'Low',
      dueAt: '2024-01-15T10:00:00Z',
      estimateMinutes: 120,
      spentMinutes: 60,
      completedAt: null,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Test Task 2',
      descriptionMd: 'Test description 2',
      statusId: 5,
      statusName: 'Done',
      priorityId: 3,
      priorityName: 'High',
      dueAt: '2024-01-10T10:00:00Z',
      estimateMinutes: 60,
      spentMinutes: 60,
      completedAt: '2024-01-10T15:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-10T15:00:00Z',
    },
  ],
  totalElements: 2,
  totalPages: 1,
  size: 20,
  number: 0,
  first: true,
  last: true,
  numberOfElements: 2,
};

// MSW server setup
const server = setupServer(
  http.get('*/user/task', () => {
    return HttpResponse.json(mockTasksPage);
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

describe('MyToDoList Integration', () => {
  it('should fetch tasks successfully', async () => {
    const store = createTestStore();
    
    const queryParams: TaskQueryParams = {
      page: 0,
      size: 20,
      sort: 'dueAt,asc',
    };
    
    const result = await store.dispatch(
      userApi.endpoints.getUserTasks.initiate(queryParams)
    );
    
    expect(result.data).toEqual(mockTasksPage);
    expect(result.data?.content).toHaveLength(2);
  });

  it('should handle query parameters correctly', () => {
    const buildQueryString = (params: TaskQueryParams): string => {
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

    const params: TaskQueryParams = {
      status: 2,
      q: 'test',
      fromDue: '2024-01-01',
      toDue: '2024-01-31',
      page: 0,
      size: 10,
      sort: 'dueAt,desc',
    };

    const queryString = buildQueryString(params);
    
    expect(queryString).toContain('status=2');
    expect(queryString).toContain('q=test');
    expect(queryString).toContain('page=0');
    expect(queryString).toContain('size=10');
  });

  it('should handle filter state changes', () => {
    const initialFilters = {
      status: undefined as number | undefined,
      q: '',
      fromDue: '',
      toDue: '',
      page: 0,
      size: 20,
      sort: 'dueAt,asc',
    };

    const handleFilterChange = (key: keyof typeof initialFilters, value: string | number | undefined) => {
      return {
        ...initialFilters,
        [key]: value,
        page: key !== 'page' ? 0 : (value as number),
      };
    };

    // Test status filter
    const statusFiltered = handleFilterChange('status', 2);
    expect(statusFiltered.status).toBe(2);
    expect(statusFiltered.page).toBe(0); // Should reset page

    // Test search filter
    const searchFiltered = handleFilterChange('q', 'test search');
    expect(searchFiltered.q).toBe('test search');
    expect(searchFiltered.page).toBe(0); // Should reset page

    // Test page change
    const pageChanged = handleFilterChange('page', 1);
    expect(pageChanged.page).toBe(1); // Should not reset page
  });

  it('should handle error responses', async () => {
    server.use(
      http.get('*/user/task', () => {
        return HttpResponse.json(
          { message: 'Server error' },
          { status: 500 }
        );
      })
    );

    const store = createTestStore();
    
    const result = await store.dispatch(
      userApi.endpoints.getUserTasks.initiate({
        page: 0,
        size: 20,
        sort: 'dueAt,asc',
      })
    );
    
    expect(result.error).toBeDefined();
    expect((result.error as { status: number }).status).toBe(500);
  });

  it('should handle empty task list', async () => {
    server.use(
      http.get('*/user/task', () => {
        return HttpResponse.json({
          ...mockTasksPage,
          content: [],
          totalElements: 0,
          numberOfElements: 0,
        });
      })
    );

    const store = createTestStore();
    
    const result = await store.dispatch(
      userApi.endpoints.getUserTasks.initiate({
        page: 0,
        size: 20,
        sort: 'dueAt,asc',
      })
    );
    
    expect(result.data?.content).toHaveLength(0);
    expect(result.data?.totalElements).toBe(0);
  });

  it('should format dates correctly', () => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };

    const testDate = '2024-01-15T10:00:00Z';
    const formatted = formatDate(testDate);
    
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });

  it('should format time correctly', () => {
    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    expect(formatTime(60)).toBe('1h 0m');
    expect(formatTime(90)).toBe('1h 30m');
    expect(formatTime(30)).toBe('30m');
    expect(formatTime(0)).toBe('0m');
  });

  it('should validate pagination logic', () => {
    const mockPage = { ...mockTasksPage, totalPages: 5, number: 2 };
    
    const canGoPrevious = mockPage.number > 0;
    const canGoNext = mockPage.number < mockPage.totalPages - 1;
    
    expect(canGoPrevious).toBe(true);
    expect(canGoNext).toBe(true);
    
    // Test first page
    const firstPage = { ...mockPage, number: 0 };
    expect(firstPage.number > 0).toBe(false);
    
    // Test last page
    const lastPage = { ...mockPage, number: 4 };
    expect(lastPage.number < lastPage.totalPages - 1).toBe(false);
  });
});