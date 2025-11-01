# Edit and Delete Task Integration

## Overview
Implemented comprehensive edit and delete functionality for tasks following existing project patterns with RTK Query, centralized endpoints, and proper error handling.

## Implementation Details

### 1. API Integration
- **Endpoints**: Added `TASK_EDIT` and `TASK_DELETE` to `constants/endpoints.ts`
- **Service Layer**: Extended `userApi` with `editUserTask` and `deleteUserTask` mutations
- **Cache Management**: Both mutations invalidate `UserTask` cache for automatic list refresh

### 2. Type Definitions
- **EditTaskRequest**: Same structure as CreateTaskRequest for consistency
- **TaskItem**: Reused existing type for response handling

### 3. Validation Rules
- **Title**: Required, trimmed, max 200 characters
- **Priority**: Must be one of ["1","2","3","4","5"]
- **Due Date**: Required, valid ISO datetime
- **Estimate**: Integer >= 0
- **Description**: Optional, max 10,000 characters

### 4. UI Components

#### EditTaskForm
- Pre-populates form with current task values
- Real-time validation with field-level error display
- Handles server errors (400/422 validation, 404 not found, 409 conflicts)
- Accessible form with proper ARIA attributes

#### DeleteConfirmDialog
- Modal confirmation dialog with clear messaging
- Keyboard accessible with focus management
- Handles 404 as success (task already deleted)
- Error handling with user feedback

#### MyToDoList Integration
- Added action menu (three dots) for each task
- Edit and Delete options in dropdown menu
- Proper state management for UI overlays
- Pagination support for large task lists

### 5. Error Handling
- **400/422**: Field-level validation errors mapped to form
- **401**: Handled by existing auth refresh logic
- **404**: "Task not found or already removed" message
- **409**: "Task was changed elsewhere" with refresh suggestion
- **Network errors**: Generic "Please try again" message

### 6. Accessibility Features
- Keyboard navigation for all interactive elements
- ARIA labels and descriptions for screen readers
- Focus management (dialog focus, error field focus)
- Semantic HTML structure
- High contrast error states

### 7. Cache Strategy
- **Optimistic Updates**: Not implemented due to complexity with pagination/filtering
- **Cache Invalidation**: Both edit and delete invalidate UserTask cache
- **Automatic Refresh**: Task list updates immediately after successful operations

### 8. Testing
- **Unit Tests**: Validation logic with comprehensive edge cases
- **Service Tests**: API integration with MSW mocking
- **Error Scenarios**: 404, 422, network failures
- **Success Flows**: Edit and delete operations

## Usage Examples

### Edit Task
```typescript
const [editTask] = useEditUserTaskMutation();
await editTask({ 
  id: 'task-123', 
  body: { title: 'Updated', priorityId: '3', ... } 
}).unwrap();
```

### Delete Task
```typescript
const [deleteTask] = useDeleteUserTaskMutation();
await deleteTask({ id: 'task-123' }).unwrap();
```

## Architecture Benefits
- **Consistency**: Follows existing patterns for auth, validation, and error handling
- **Maintainability**: Centralized endpoints and reusable validation logic
- **User Experience**: Immediate feedback with proper loading states
- **Accessibility**: Full keyboard and screen reader support
- **Reliability**: Comprehensive error handling and recovery

## Files Modified/Created
- `constants/endpoints.ts` - Added edit/delete endpoints
- `types/userTask/index.ts` - Added EditTaskRequest type
- `service/user/index.ts` - Added edit/delete mutations
- `components/EditTaskForm.tsx` - New edit form component
- `components/DeleteConfirmDialog.tsx` - New delete confirmation
- `components/MyToDoList.tsx` - Integrated edit/delete UI
- `utils/taskValidation.ts` - Centralized validation logic
- Test files for validation and service layers