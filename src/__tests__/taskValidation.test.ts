/**
 * Task validation unit tests
 * Tests the validation logic used in CreateTaskForm
 */

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Extract validation logic for testing
const validateTaskData = (data: {
  title: string;
  descriptionMd: string;
  priorityId: string;
  dueAt: string;
  estimateMinutes: number;
}): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Title validation
  if (!data.title.trim()) {
    errors.title = 'Title is required';
  }
  
  // Priority validation
  if (!['1', '2', '3', '4', '5'].includes(data.priorityId)) {
    errors.priorityId = 'Invalid priority selected';
  }
  
  // Due date validation
  if (!data.dueAt) {
    errors.dueAt = 'Due date is required';
  } else {
    const dueDate = new Date(data.dueAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(dueDate.getTime())) {
      errors.dueAt = 'Invalid date format';
    } else if (dueDate < today) {
      errors.dueAt = 'Due date must be today or in the future';
    }
  }
  
  // Estimate validation
  if (data.estimateMinutes < 0) {
    errors.estimateMinutes = 'Estimate must be 0 or greater';
  }
  
  // Description validation
  if (data.descriptionMd.length > 10000) {
    errors.descriptionMd = 'Description must be less than 10,000 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

describe('Task Validation', () => {
  const validTaskData = {
    title: 'Valid Task Title',
    descriptionMd: 'Valid description',
    priorityId: '2',
    dueAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    estimateMinutes: 60,
  };

  describe('Title Validation', () => {
    it('should pass with valid title', () => {
      const result = validateTaskData(validTaskData);
      expect(result.errors.title).toBeUndefined();
    });

    it('should fail with empty title', () => {
      const result = validateTaskData({ ...validTaskData, title: '' });
      expect(result.errors.title).toBe('Title is required');
      expect(result.isValid).toBe(false);
    });

    it('should fail with whitespace-only title', () => {
      const result = validateTaskData({ ...validTaskData, title: '   ' });
      expect(result.errors.title).toBe('Title is required');
      expect(result.isValid).toBe(false);
    });

    it('should pass with title that has leading/trailing whitespace', () => {
      const result = validateTaskData({ ...validTaskData, title: '  Valid Title  ' });
      expect(result.errors.title).toBeUndefined();
    });
  });

  describe('Priority Validation', () => {
    it('should pass with valid priority IDs', () => {
      ['1', '2', '3', '4', '5'].forEach(priorityId => {
        const result = validateTaskData({ ...validTaskData, priorityId });
        expect(result.errors.priorityId).toBeUndefined();
      });
    });

    it('should fail with invalid priority ID', () => {
      const result = validateTaskData({ ...validTaskData, priorityId: '6' });
      expect(result.errors.priorityId).toBe('Invalid priority selected');
      expect(result.isValid).toBe(false);
    });

    it('should fail with non-numeric priority ID', () => {
      const result = validateTaskData({ ...validTaskData, priorityId: 'high' });
      expect(result.errors.priorityId).toBe('Invalid priority selected');
      expect(result.isValid).toBe(false);
    });
  });

  describe('Due Date Validation', () => {
    it('should pass with future date', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      const result = validateTaskData({ ...validTaskData, dueAt: futureDate });
      expect(result.errors.dueAt).toBeUndefined();
    });

    it('should pass with today\'s date', () => {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      const result = validateTaskData({ ...validTaskData, dueAt: today.toISOString() });
      expect(result.errors.dueAt).toBeUndefined();
    });

    it('should fail with past date', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString();
      const result = validateTaskData({ ...validTaskData, dueAt: pastDate });
      expect(result.errors.dueAt).toBe('Due date must be today or in the future');
      expect(result.isValid).toBe(false);
    });

    it('should fail with empty date', () => {
      const result = validateTaskData({ ...validTaskData, dueAt: '' });
      expect(result.errors.dueAt).toBe('Due date is required');
      expect(result.isValid).toBe(false);
    });

    it('should fail with invalid date format', () => {
      const result = validateTaskData({ ...validTaskData, dueAt: 'invalid-date' });
      expect(result.errors.dueAt).toBe('Invalid date format');
      expect(result.isValid).toBe(false);
    });
  });

  describe('Estimate Minutes Validation', () => {
    it('should pass with positive minutes', () => {
      const result = validateTaskData({ ...validTaskData, estimateMinutes: 120 });
      expect(result.errors.estimateMinutes).toBeUndefined();
    });

    it('should pass with zero minutes', () => {
      const result = validateTaskData({ ...validTaskData, estimateMinutes: 0 });
      expect(result.errors.estimateMinutes).toBeUndefined();
    });

    it('should fail with negative minutes', () => {
      const result = validateTaskData({ ...validTaskData, estimateMinutes: -10 });
      expect(result.errors.estimateMinutes).toBe('Estimate must be 0 or greater');
      expect(result.isValid).toBe(false);
    });
  });

  describe('Description Validation', () => {
    it('should pass with empty description', () => {
      const result = validateTaskData({ ...validTaskData, descriptionMd: '' });
      expect(result.errors.descriptionMd).toBeUndefined();
    });

    it('should pass with normal length description', () => {
      const result = validateTaskData({ ...validTaskData, descriptionMd: 'A'.repeat(5000) });
      expect(result.errors.descriptionMd).toBeUndefined();
    });

    it('should pass with exactly 10,000 characters', () => {
      const result = validateTaskData({ ...validTaskData, descriptionMd: 'A'.repeat(10000) });
      expect(result.errors.descriptionMd).toBeUndefined();
    });

    it('should fail with more than 10,000 characters', () => {
      const result = validateTaskData({ ...validTaskData, descriptionMd: 'A'.repeat(10001) });
      expect(result.errors.descriptionMd).toBe('Description must be less than 10,000 characters');
      expect(result.isValid).toBe(false);
    });
  });

  describe('Complete Validation', () => {
    it('should pass with all valid data', () => {
      const result = validateTaskData(validTaskData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should fail with multiple invalid fields', () => {
      const invalidData = {
        title: '',
        descriptionMd: 'A'.repeat(10001),
        priorityId: '6',
        dueAt: '',
        estimateMinutes: -10,
      };
      
      const result = validateTaskData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
      expect(result.errors.descriptionMd).toBeDefined();
      expect(result.errors.priorityId).toBeDefined();
      expect(result.errors.dueAt).toBeDefined();
      expect(result.errors.estimateMinutes).toBeDefined();
    });
  });
});