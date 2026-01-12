import { formatDate } from '../formatDate';

describe('formatDate', () => {
  describe('long format (default)', () => {
    it('should format date in long format by default', () => {
      const result = formatDate('2026-01-10T12:00:00');
      expect(result).toBe('10 de enero de 2026');
    });

    it('should format date in long format when explicitly specified', () => {
      const result = formatDate('2026-01-10T12:00:00', 'long');
      expect(result).toBe('10 de enero de 2026');
    });

    it('should format January correctly', () => {
      const result = formatDate('2026-01-15T12:00:00', 'long');
      expect(result).toBe('15 de enero de 2026');
    });

    it('should format February correctly', () => {
      const result = formatDate('2026-02-20T12:00:00', 'long');
      expect(result).toBe('20 de febrero de 2026');
    });

    it('should format March correctly', () => {
      const result = formatDate('2026-03-05T12:00:00', 'long');
      expect(result).toBe('5 de marzo de 2026');
    });

    it('should format April correctly', () => {
      const result = formatDate('2026-04-12T12:00:00', 'long');
      expect(result).toBe('12 de abril de 2026');
    });

    it('should format May correctly', () => {
      const result = formatDate('2026-05-25T12:00:00', 'long');
      expect(result).toBe('25 de mayo de 2026');
    });

    it('should format June correctly', () => {
      const result = formatDate('2026-06-30T12:00:00', 'long');
      expect(result).toBe('30 de junio de 2026');
    });

    it('should format July correctly', () => {
      const result = formatDate('2026-07-04T12:00:00', 'long');
      expect(result).toBe('4 de julio de 2026');
    });

    it('should format August correctly', () => {
      const result = formatDate('2026-08-15T12:00:00', 'long');
      expect(result).toBe('15 de agosto de 2026');
    });

    it('should format September correctly', () => {
      const result = formatDate('2026-09-22T12:00:00', 'long');
      expect(result).toBe('22 de septiembre de 2026');
    });

    it('should format October correctly', () => {
      const result = formatDate('2026-10-31T12:00:00', 'long');
      expect(result).toBe('31 de octubre de 2026');
    });

    it('should format November correctly', () => {
      const result = formatDate('2026-11-11T12:00:00', 'long');
      expect(result).toBe('11 de noviembre de 2026');
    });

    it('should format December correctly', () => {
      const result = formatDate('2026-12-25T12:00:00', 'long');
      expect(result).toBe('25 de diciembre de 2026');
    });

    it('should format first day of month correctly', () => {
      const result = formatDate('2026-06-01T12:00:00', 'long');
      expect(result).toBe('1 de junio de 2026');
    });

    it('should format last day of month correctly', () => {
      const result = formatDate('2026-01-31T12:00:00', 'long');
      expect(result).toBe('31 de enero de 2026');
    });

    it('should format different years correctly', () => {
      const result2025 = formatDate('2025-03-15T12:00:00', 'long');
      const result2027 = formatDate('2027-03-15T12:00:00', 'long');

      expect(result2025).toBe('15 de marzo de 2025');
      expect(result2027).toBe('15 de marzo de 2027');
    });
  });

  describe('short format', () => {
    it('should format date in short format', () => {
      const result = formatDate('2026-01-10T12:00:00', 'short');
      expect(result).toBe('ene 10');
    });

    it('should format January in short format', () => {
      const result = formatDate('2026-01-15T12:00:00', 'short');
      expect(result).toBe('ene 15');
    });

    it('should format February in short format', () => {
      const result = formatDate('2026-02-20T12:00:00', 'short');
      expect(result).toBe('feb 20');
    });

    it('should format March in short format', () => {
      const result = formatDate('2026-03-05T12:00:00', 'short');
      expect(result).toBe('mar 5');
    });

    it('should format April in short format', () => {
      const result = formatDate('2026-04-12T12:00:00', 'short');
      expect(result).toBe('abr 12');
    });

    it('should format May in short format', () => {
      const result = formatDate('2026-05-25T12:00:00', 'short');
      expect(result).toBe('may 25');
    });

    it('should format June in short format', () => {
      const result = formatDate('2026-06-30T12:00:00', 'short');
      expect(result).toBe('jun 30');
    });

    it('should format July in short format', () => {
      const result = formatDate('2026-07-04T12:00:00', 'short');
      expect(result).toBe('jul 4');
    });

    it('should format August in short format', () => {
      const result = formatDate('2026-08-15T12:00:00', 'short');
      expect(result).toBe('ago 15');
    });

    it('should format September in short format', () => {
      const result = formatDate('2026-09-22T12:00:00', 'short');
      expect(result).toBe('sep 22');
    });

    it('should format October in short format', () => {
      const result = formatDate('2026-10-31T12:00:00', 'short');
      expect(result).toBe('oct 31');
    });

    it('should format November in short format', () => {
      const result = formatDate('2026-11-11T12:00:00', 'short');
      expect(result).toBe('nov 11');
    });

    it('should format December in short format', () => {
      const result = formatDate('2026-12-25T12:00:00', 'short');
      expect(result).toBe('dic 25');
    });

    it('should not include year in short format', () => {
      const result = formatDate('2026-06-15T12:00:00', 'short');
      expect(result).not.toContain('2026');
      expect(result).toBe('jun 15');
    });

    it('should format first day of month in short format', () => {
      const result = formatDate('2026-06-01T12:00:00', 'short');
      expect(result).toBe('jun 1');
    });

    it('should format last day of month in short format', () => {
      const result = formatDate('2026-12-31T12:00:00', 'short');
      expect(result).toBe('dic 31');
    });
  });

  describe('date parsing', () => {
    it('should handle ISO date format with UTC', () => {
      const result = formatDate('2026-01-10T06:00:00.000Z');
      expect(result).toContain('de enero de 2026');
    });

    it('should handle date with time', () => {
      const result = formatDate('2026-01-10T14:30:00');
      expect(result).toContain('de enero de 2026');
    });

    it('should handle different date separators', () => {
      const result = formatDate('2026/03/15 12:00:00');
      expect(result).toBe('15 de marzo de 2026');
    });

    it('should be deterministic for same input', () => {
      const date = '2026-06-15T12:00:00';
      const result1 = formatDate(date);
      const result2 = formatDate(date);
      expect(result1).toBe(result2);
    });

    it('should handle leap year dates', () => {
      const result = formatDate('2024-02-29T12:00:00', 'long');
      expect(result).toBe('29 de febrero de 2024');
    });
  });

  describe('edge cases', () => {
    it('should handle single digit days', () => {
      const result = formatDate('2026-01-01T12:00:00', 'long');
      expect(result).toBe('1 de enero de 2026');
    });

    it('should handle single digit days in short format', () => {
      const result = formatDate('2026-01-09T12:00:00', 'short');
      expect(result).toBe('ene 9');
    });

    it('should handle double digit days', () => {
      const result = formatDate('2026-01-31T12:00:00', 'long');
      expect(result).toBe('31 de enero de 2026');
    });

    it('should handle double digit days in short format', () => {
      const result = formatDate('2026-01-31T12:00:00', 'short');
      expect(result).toBe('ene 31');
    });

    it('should handle dates from past centuries', () => {
      const result = formatDate('1999-12-31T12:00:00', 'long');
      expect(result).toBe('31 de diciembre de 1999');
    });

    it('should handle dates from future centuries', () => {
      const result = formatDate('2100-01-01T12:00:00', 'long');
      expect(result).toBe('1 de enero de 2100');
    });
  });

  describe('format parameter validation', () => {
    it('should use long format as default when no format specified', () => {
      const withoutFormat = formatDate('2026-06-15T12:00:00');
      const withLongFormat = formatDate('2026-06-15T12:00:00', 'long');
      expect(withoutFormat).toBe(withLongFormat);
    });

    it('should return different results for different formats', () => {
      const date = '2026-06-15T12:00:00';
      const longFormat = formatDate(date, 'long');
      const shortFormat = formatDate(date, 'short');
      expect(longFormat).not.toBe(shortFormat);
      expect(longFormat).toBe('15 de junio de 2026');
      expect(shortFormat).toBe('jun 15');
    });
  });
});
