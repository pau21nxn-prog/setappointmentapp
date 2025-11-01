import {
  convertUTCOffsetToIANA,
  convertIANAToUTCOffset,
  getTimezoneOffset,
  detectUserTimezone,
  getAllTimezoneOptions,
  UTC_TO_IANA_MAP,
  IANA_TO_UTC_MAP,
} from '../timezone';

describe('Timezone Utilities', () => {
  describe('UTC_TO_IANA_MAP and IANA_TO_UTC_MAP', () => {
    it('should have matching bidirectional mappings', () => {
      // Every UTC offset should map to an IANA timezone
      Object.entries(UTC_TO_IANA_MAP).forEach(([utcOffset, iana]) => {
        expect(IANA_TO_UTC_MAP[iana]).toBe(utcOffset);
      });
    });

    it('should contain all major timezones', () => {
      // Check for some key timezones
      expect(UTC_TO_IANA_MAP['UTC +8 (Manila)']).toBe('Asia/Manila');
      expect(UTC_TO_IANA_MAP['UTC -5 (New York)']).toBe('America/New_York');
      expect(UTC_TO_IANA_MAP['UTC +0 (London)']).toBe('Europe/London');
      expect(UTC_TO_IANA_MAP['UTC +9 (Tokyo)']).toBe('Asia/Tokyo');
    });

    it('should support half-hour and quarter-hour offsets', () => {
      expect(UTC_TO_IANA_MAP['UTC +5.5 (Mumbai)']).toBe('Asia/Kolkata');
      expect(UTC_TO_IANA_MAP['UTC +5.75 (Kathmandu)']).toBe('Asia/Kathmandu');
      expect(UTC_TO_IANA_MAP['UTC +8.75 (Eucla)']).toBe('Australia/Eucla');
    });
  });

  describe('convertUTCOffsetToIANA', () => {
    it('should convert valid UTC offset to IANA timezone', () => {
      expect(convertUTCOffsetToIANA('UTC +8 (Manila)')).toBe('Asia/Manila');
      expect(convertUTCOffsetToIANA('UTC -5 (New York)')).toBe('America/New_York');
      expect(convertUTCOffsetToIANA('UTC +0 (London)')).toBe('Europe/London');
      expect(convertUTCOffsetToIANA('UTC +9 (Tokyo)')).toBe('Asia/Tokyo');
    });

    it('should handle negative offsets correctly', () => {
      expect(convertUTCOffsetToIANA('UTC -8 (Los Angeles)')).toBe('America/Los_Angeles');
      expect(convertUTCOffsetToIANA('UTC -6 (Chicago)')).toBe('America/Chicago');
    });

    it('should handle half-hour offsets correctly', () => {
      expect(convertUTCOffsetToIANA('UTC +5.5 (Mumbai)')).toBe('Asia/Kolkata');
      expect(convertUTCOffsetToIANA('UTC +9.5 (Adelaide)')).toBe('Australia/Adelaide');
    });

    it('should return UTC for invalid UTC offset format', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      expect(convertUTCOffsetToIANA('Invalid Format')).toBe('UTC');
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should return UTC for unmapped UTC offset', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      expect(convertUTCOffsetToIANA('UTC +99 (Mars)')).toBe('UTC');
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('convertIANAToUTCOffset', () => {
    it('should convert valid IANA timezone to UTC offset', () => {
      expect(convertIANAToUTCOffset('Asia/Manila')).toBe('UTC +8 (Manila)');
      expect(convertIANAToUTCOffset('America/New_York')).toBe('UTC -5 (New York)');
      expect(convertIANAToUTCOffset('Europe/London')).toBe('UTC +0 (London)');
      expect(convertIANAToUTCOffset('Asia/Tokyo')).toBe('UTC +9 (Tokyo)');
    });

    it('should handle all mapped IANA timezones', () => {
      expect(convertIANAToUTCOffset('America/Los_Angeles')).toBe('UTC -8 (Los Angeles)');
      expect(convertIANAToUTCOffset('America/Chicago')).toBe('UTC -6 (Chicago)');
      expect(convertIANAToUTCOffset('Asia/Kolkata')).toBe('UTC +5.5 (Mumbai)');
    });

    it('should return undefined for unmapped IANA timezone', () => {
      expect(convertIANAToUTCOffset('Invalid/Timezone')).toBeUndefined();
    });
  });

  describe('getTimezoneOffset', () => {
    it('should extract numeric offset from UTC string', () => {
      expect(getTimezoneOffset('UTC +8 (Manila)')).toBe(8);
      expect(getTimezoneOffset('UTC -5 (New York)')).toBe(-5);
      expect(getTimezoneOffset('UTC +0 (London)')).toBe(0);
    });

    it('should handle decimal offsets', () => {
      expect(getTimezoneOffset('UTC +5.5 (Mumbai)')).toBe(5.5);
      expect(getTimezoneOffset('UTC +5.75 (Kathmandu)')).toBe(5.75);
      expect(getTimezoneOffset('UTC -3.5 (Newfoundland)')).toBe(-3.5);
    });

    it('should handle offsets without spaces', () => {
      expect(getTimezoneOffset('UTC+8 (Manila)')).toBe(8);
      expect(getTimezoneOffset('UTC-5(New York)')).toBe(-5);
    });

    it('should return 0 for invalid format', () => {
      expect(getTimezoneOffset('Invalid Format')).toBe(0);
      expect(getTimezoneOffset('')).toBe(0);
      expect(getTimezoneOffset('No numbers here')).toBe(0);
    });
  });

  describe('detectUserTimezone', () => {
    it('should detect user timezone and return UTC offset format', () => {
      // Mock Intl.DateTimeFormat to return a known timezone
      const originalDateTimeFormat = Intl.DateTimeFormat;
      global.Intl.DateTimeFormat = jest.fn().mockImplementation(() => ({
        resolvedOptions: () => ({ timeZone: 'Asia/Manila' }),
      })) as any;

      const result = detectUserTimezone();
      expect(result).toBe('UTC +8 (Manila)');

      global.Intl.DateTimeFormat = originalDateTimeFormat;
    });

    it('should handle IANA timezone that maps directly', () => {
      const originalDateTimeFormat = Intl.DateTimeFormat;
      global.Intl.DateTimeFormat = jest.fn().mockImplementation(() => ({
        resolvedOptions: () => ({ timeZone: 'America/New_York' }),
      })) as any;

      const result = detectUserTimezone();
      expect(result).toBe('UTC -5 (New York)');

      global.Intl.DateTimeFormat = originalDateTimeFormat;
    });

    it('should find matching timezone by offset for unmapped IANA', () => {
      const originalDateTimeFormat = Intl.DateTimeFormat;
      const originalDate = Date;

      // Mock Date to return consistent offset
      global.Date = jest.fn().mockImplementation(() => ({
        getTimezoneOffset: () => -480, // UTC+8 (480 minutes = 8 hours, negative because getTimezoneOffset is reversed)
      })) as any;

      global.Intl.DateTimeFormat = jest.fn().mockImplementation(() => ({
        resolvedOptions: () => ({ timeZone: 'Asia/Unmapped_City' }),
      })) as any;

      const result = detectUserTimezone();
      // Should find any UTC+8 timezone
      expect(result).toMatch(/UTC \+8 \(/);

      global.Date = originalDate;
      global.Intl.DateTimeFormat = originalDateTimeFormat;
    });

    it('should return undefined for completely unmappable timezone', () => {
      const originalDateTimeFormat = Intl.DateTimeFormat;
      const originalDate = Date;
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Mock Date with weird offset that doesn't exist
      global.Date = jest.fn().mockImplementation(() => ({
        getTimezoneOffset: () => -999, // UTC+16.65 - doesn't exist
      })) as any;

      global.Intl.DateTimeFormat = jest.fn().mockImplementation(() => ({
        resolvedOptions: () => ({ timeZone: 'Unknown/Timezone' }),
      })) as any;

      const result = detectUserTimezone();
      expect(result).toBeUndefined();
      expect(consoleWarnSpy).toHaveBeenCalled();

      global.Date = originalDate;
      global.Intl.DateTimeFormat = originalDateTimeFormat;
      consoleWarnSpy.mockRestore();
    });

    it('should handle errors gracefully', () => {
      const originalDateTimeFormat = Intl.DateTimeFormat;
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      global.Intl.DateTimeFormat = jest.fn().mockImplementation(() => {
        throw new Error('Timezone detection failed');
      });

      const result = detectUserTimezone();
      expect(result).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalled();

      global.Intl.DateTimeFormat = originalDateTimeFormat;
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getAllTimezoneOptions', () => {
    it('should return all timezone options', () => {
      const options = getAllTimezoneOptions();
      expect(options.length).toBeGreaterThan(0);
      expect(options).toContain('UTC +8 (Manila)');
      expect(options).toContain('UTC -5 (New York)');
      expect(options).toContain('UTC +0 (London)');
    });

    it('should return timezones sorted by offset', () => {
      const options = getAllTimezoneOptions();

      // Extract offsets and check if sorted
      const offsets = options.map((option) => getTimezoneOffset(option));
      const sortedOffsets = [...offsets].sort((a, b) => a - b);

      expect(offsets).toEqual(sortedOffsets);
    });

    it('should start with negative offsets and end with positive', () => {
      const options = getAllTimezoneOptions();
      const firstOffset = getTimezoneOffset(options[0]);
      const lastOffset = getTimezoneOffset(options[options.length - 1]);

      expect(firstOffset).toBeLessThan(0); // First should be negative
      expect(lastOffset).toBeGreaterThan(0); // Last should be positive
    });

    it('should include all UTC offsets from -12 to +14', () => {
      const options = getAllTimezoneOptions();
      const offsets = options.map((option) => getTimezoneOffset(option));

      expect(Math.min(...offsets)).toBeLessThanOrEqual(-12);
      expect(Math.max(...offsets)).toBeGreaterThanOrEqual(14);
    });
  });

  describe('Integration tests', () => {
    it('should allow round-trip conversion UTC → IANA → UTC', () => {
      const utcOffset = 'UTC +8 (Manila)';
      const iana = convertUTCOffsetToIANA(utcOffset);
      const backToUTC = convertIANAToUTCOffset(iana);

      expect(backToUTC).toBe(utcOffset);
    });

    it('should handle all timezones in the map consistently', () => {
      Object.entries(UTC_TO_IANA_MAP).forEach(([utcOffset, expectedIANA]) => {
        const convertedIANA = convertUTCOffsetToIANA(utcOffset);
        expect(convertedIANA).toBe(expectedIANA);

        const backToUTC = convertIANAToUTCOffset(convertedIANA);
        expect(backToUTC).toBe(utcOffset);
      });
    });

    it('should support common timezone conversions for calendar integration', () => {
      // Test cases that are likely to be used in calendar integrations
      const commonConversions = [
        { utc: 'UTC +8 (Manila)', iana: 'Asia/Manila' },
        { utc: 'UTC +8 (Singapore)', iana: 'Asia/Singapore' },
        { utc: 'UTC -5 (New York)', iana: 'America/New_York' },
        { utc: 'UTC -8 (Los Angeles)', iana: 'America/Los_Angeles' },
        { utc: 'UTC +0 (London)', iana: 'Europe/London' },
        { utc: 'UTC +9 (Tokyo)', iana: 'Asia/Tokyo' },
      ];

      commonConversions.forEach(({ utc, iana }) => {
        expect(convertUTCOffsetToIANA(utc)).toBe(iana);
        expect(convertIANAToUTCOffset(iana)).toBe(utc);
      });
    });
  });
});
