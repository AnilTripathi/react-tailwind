import type { TaskItem, Page, TaskQueryParams } from '../types/userTask';
import { toStartOfDay, toEndOfDay } from '../utils/dateUtils';

describe('UserTask Types', () => {
  it('should define TaskItem interface correctly', () => {
    const task: TaskItem = {
      id: 'test-id',
      title: 'Test Task',
      descriptionMd: 'Test description',
      statusId: 2,
      statusName: 'Todo',
      priorityId: 1,
      priorityName: 'Low',
      dueAt: '2024-01-01T00:00:00Z',
      estimateMinutes: 60,
      spentMinutes: 30,
      completedAt: null,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };
    
    expect(task.id).toBe('test-id');
    expect(task.statusId).toBe(2);
    expect(task.priorityId).toBe(1);
  });
  
  it('should define Page interface correctly', () => {
    const page: Page<TaskItem> = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 20,
      number: 0,
      first: true,
      last: true,
      numberOfElements: 0,
    };
    
    expect(page.content).toEqual([]);
    expect(page.totalElements).toBe(0);
  });
  
  it('should define TaskQueryParams correctly', () => {
    const params: TaskQueryParams = {
      status: 2,
      q: 'search term',
      fromDue: '2024-01-01T00:00:00Z',
      toDue: '2024-01-31T23:59:59Z',
      page: 0,
      size: 20,
      sort: 'dueAt,asc',
    };
    
    expect(params.page).toBe(0);
    expect(params.size).toBe(20);
    expect(params.sort).toBe('dueAt,asc');
  });
});

describe('Date Utils', () => {
  it('should convert date to start of day', () => {
    const date = new Date('2024-01-15T14:30:00Z');
    const startOfDay = toStartOfDay(date);
    
    expect(startOfDay).toMatch(/2024-01-15T00:00:00\.000Z/);
  });
  
  it('should convert date to end of day', () => {
    const date = new Date('2024-01-15T14:30:00Z');
    const endOfDay = toEndOfDay(date);
    
    expect(endOfDay).toMatch(/2024-01-15T23:59:59\.999Z/);
  });
  
  it('should handle string dates', () => {
    const dateString = '2024-01-15';
    const startOfDay = toStartOfDay(dateString);
    const endOfDay = toEndOfDay(dateString);
    
    expect(startOfDay).toContain('T00:00:00.000Z');
    expect(endOfDay).toContain('T23:59:59.999Z');
  });
});