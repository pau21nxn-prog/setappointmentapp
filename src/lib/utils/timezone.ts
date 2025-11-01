/**
 * Timezone Utilities
 * =============================================================================
 * Utilities for converting between UTC offset format and IANA timezone identifiers
 * Supports auto-detection and calendar integration
 * =============================================================================
 */

/**
 * Comprehensive mapping of UTC offset format to IANA timezone identifiers
 * Organized by UTC offset from -12 to +14
 */
export const UTC_TO_IANA_MAP: Record<string, string> = {
  // UTC -12
  'UTC -12 (Baker Island)': 'Etc/GMT+12',

  // UTC -11
  'UTC -11 (Pago Pago)': 'Pacific/Pago_Pago',
  'UTC -11 (Midway)': 'Pacific/Midway',

  // UTC -10
  'UTC -10 (Honolulu)': 'Pacific/Honolulu',

  // UTC -9
  'UTC -9 (Anchorage)': 'America/Anchorage',

  // UTC -8
  'UTC -8 (Los Angeles)': 'America/Los_Angeles',
  'UTC -8 (Vancouver)': 'America/Vancouver',
  'UTC -8 (Tijuana)': 'America/Tijuana',

  // UTC -7
  'UTC -7 (Denver)': 'America/Denver',
  'UTC -7 (Phoenix)': 'America/Phoenix',
  'UTC -7 (Calgary)': 'America/Edmonton',

  // UTC -6
  'UTC -6 (Chicago)': 'America/Chicago',
  'UTC -6 (Mexico City)': 'America/Mexico_City',
  'UTC -6 (Guatemala City)': 'America/Guatemala',

  // UTC -5
  'UTC -5 (New York)': 'America/New_York',
  'UTC -5 (Toronto)': 'America/Toronto',
  'UTC -5 (Bogota)': 'America/Bogota',
  'UTC -5 (Lima)': 'America/Lima',

  // UTC -4
  'UTC -4 (Caracas)': 'America/Caracas',
  'UTC -4 (Santiago)': 'America/Santiago',
  'UTC -4 (La Paz)': 'America/La_Paz',

  // UTC -3
  'UTC -3 (Buenos Aires)': 'America/Argentina/Buenos_Aires',
  'UTC -3 (Sao Paulo)': 'America/Sao_Paulo',
  'UTC -3 (Montevideo)': 'America/Montevideo',

  // UTC -2
  'UTC -2 (South Georgia)': 'Atlantic/South_Georgia',

  // UTC -1
  'UTC -1 (Azores)': 'Atlantic/Azores',
  'UTC -1 (Cape Verde)': 'Atlantic/Cape_Verde',

  // UTC +0
  'UTC +0 (London)': 'Europe/London',
  'UTC +0 (Dublin)': 'Europe/Dublin',
  'UTC +0 (Lisbon)': 'Europe/Lisbon',
  'UTC +0 (Reykjavik)': 'Atlantic/Reykjavik',
  'UTC +0 (Accra)': 'Africa/Accra',

  // UTC +1
  'UTC +1 (Paris)': 'Europe/Paris',
  'UTC +1 (Berlin)': 'Europe/Berlin',
  'UTC +1 (Rome)': 'Europe/Rome',
  'UTC +1 (Madrid)': 'Europe/Madrid',
  'UTC +1 (Amsterdam)': 'Europe/Amsterdam',
  'UTC +1 (Brussels)': 'Europe/Brussels',
  'UTC +1 (Lagos)': 'Africa/Lagos',

  // UTC +2
  'UTC +2 (Cairo)': 'Africa/Cairo',
  'UTC +2 (Johannesburg)': 'Africa/Johannesburg',
  'UTC +2 (Athens)': 'Europe/Athens',
  'UTC +2 (Helsinki)': 'Europe/Helsinki',
  'UTC +2 (Istanbul)': 'Europe/Istanbul',

  // UTC +3
  'UTC +3 (Moscow)': 'Europe/Moscow',
  'UTC +3 (Nairobi)': 'Africa/Nairobi',
  'UTC +3 (Riyadh)': 'Asia/Riyadh',
  'UTC +3 (Baghdad)': 'Asia/Baghdad',

  // UTC +3.5
  'UTC +3.5 (Tehran)': 'Asia/Tehran',

  // UTC +4
  'UTC +4 (Dubai)': 'Asia/Dubai',
  'UTC +4 (Baku)': 'Asia/Baku',

  // UTC +4.5
  'UTC +4.5 (Kabul)': 'Asia/Kabul',

  // UTC +5
  'UTC +5 (Karachi)': 'Asia/Karachi',
  'UTC +5 (Tashkent)': 'Asia/Tashkent',

  // UTC +5.5
  'UTC +5.5 (Mumbai)': 'Asia/Kolkata',
  'UTC +5.5 (Colombo)': 'Asia/Colombo',

  // UTC +5.75
  'UTC +5.75 (Kathmandu)': 'Asia/Kathmandu',

  // UTC +6
  'UTC +6 (Dhaka)': 'Asia/Dhaka',
  'UTC +6 (Almaty)': 'Asia/Almaty',

  // UTC +6.5
  'UTC +6.5 (Yangon)': 'Asia/Yangon',

  // UTC +7
  'UTC +7 (Bangkok)': 'Asia/Bangkok',
  'UTC +7 (Jakarta)': 'Asia/Jakarta',
  'UTC +7 (Ho Chi Minh City)': 'Asia/Ho_Chi_Minh',

  // UTC +8
  'UTC +8 (Manila)': 'Asia/Manila',
  'UTC +8 (Singapore)': 'Asia/Singapore',
  'UTC +8 (Hong Kong)': 'Asia/Hong_Kong',
  'UTC +8 (Beijing)': 'Asia/Shanghai',
  'UTC +8 (Taipei)': 'Asia/Taipei',
  'UTC +8 (Kuala Lumpur)': 'Asia/Kuala_Lumpur',
  'UTC +8 (Perth)': 'Australia/Perth',

  // UTC +8.75
  'UTC +8.75 (Eucla)': 'Australia/Eucla',

  // UTC +9
  'UTC +9 (Tokyo)': 'Asia/Tokyo',
  'UTC +9 (Seoul)': 'Asia/Seoul',

  // UTC +9.5
  'UTC +9.5 (Adelaide)': 'Australia/Adelaide',
  'UTC +9.5 (Darwin)': 'Australia/Darwin',

  // UTC +10
  'UTC +10 (Sydney)': 'Australia/Sydney',
  'UTC +10 (Melbourne)': 'Australia/Melbourne',
  'UTC +10 (Brisbane)': 'Australia/Brisbane',
  'UTC +10 (Port Moresby)': 'Pacific/Port_Moresby',

  // UTC +11
  'UTC +11 (Noumea)': 'Pacific/Noumea',
  'UTC +11 (Solomon Islands)': 'Pacific/Guadalcanal',

  // UTC +12
  'UTC +12 (Auckland)': 'Pacific/Auckland',
  'UTC +12 (Fiji)': 'Pacific/Fiji',

  // UTC +13
  "UTC +13 (Nuku'alofa)": 'Pacific/Tongatapu',
  'UTC +13 (Apia)': 'Pacific/Apia',

  // UTC +14
  'UTC +14 (Kiritimati)': 'Pacific/Kiritimati',
};

/**
 * Reverse mapping: IANA timezone identifier to UTC offset format
 * Automatically generated from UTC_TO_IANA_MAP
 */
export const IANA_TO_UTC_MAP: Record<string, string> = Object.entries(UTC_TO_IANA_MAP).reduce(
  (acc, [utcOffset, iana]) => {
    acc[iana] = utcOffset;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Convert UTC offset format to IANA timezone identifier
 * @param utcOffset - UTC offset format (e.g., "UTC +8 (Manila)")
 * @returns IANA timezone identifier (e.g., "Asia/Manila") or fallback to UTC
 */
export function convertUTCOffsetToIANA(utcOffset: string): string {
  const iana = UTC_TO_IANA_MAP[utcOffset];
  if (!iana) {
    console.warn(`No IANA mapping found for UTC offset: ${utcOffset}. Falling back to UTC.`);
    return 'UTC';
  }
  return iana;
}

/**
 * Convert IANA timezone identifier to UTC offset format
 * @param iana - IANA timezone identifier (e.g., "Asia/Manila")
 * @returns UTC offset format (e.g., "UTC +8 (Manila)") or undefined if not found
 */
export function convertIANAToUTCOffset(iana: string): string | undefined {
  return IANA_TO_UTC_MAP[iana];
}

/**
 * Extract numeric offset from UTC string
 * @param utcOffset - UTC offset format (e.g., "UTC +8 (Manila)")
 * @returns Numeric offset (e.g., 8) or 0 if parsing fails
 */
export function getTimezoneOffset(utcOffset: string): number {
  const match = utcOffset.match(/UTC\s*([+-]?\d+(?:\.\d+)?)/);
  if (match && match[1]) {
    return parseFloat(match[1]);
  }
  return 0;
}

/**
 * Detect user's timezone from browser and convert to UTC offset format
 * @returns UTC offset format string or undefined if detection fails
 */
export function detectUserTimezone(): string | undefined {
  try {
    // Get IANA timezone from browser
    const userIANA = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Try direct mapping first
    const directMatch = convertIANAToUTCOffset(userIANA);
    if (directMatch) {
      return directMatch;
    }

    // If no direct match, try to find a city in the same timezone
    // by comparing the current UTC offset
    const now = new Date();
    const userOffset = -now.getTimezoneOffset() / 60; // Convert to hours

    // Find all UTC offset entries that match the current offset
    const matchingEntries = Object.entries(UTC_TO_IANA_MAP).filter(([utcOffsetStr, _iana]) => {
      const offsetNum = getTimezoneOffset(utcOffsetStr);
      return Math.abs(offsetNum - userOffset) < 0.1; // Allow small floating point differences
    });

    if (matchingEntries.length > 0) {
      // Return the first matching entry
      return matchingEntries[0][0];
    }

    console.warn(`Could not detect timezone for IANA: ${userIANA}, offset: ${userOffset}`);
    return undefined;
  } catch (error) {
    console.error('Error detecting user timezone:', error);
    return undefined;
  }
}

/**
 * Get all available timezone options sorted by UTC offset
 * @returns Array of timezone strings in UTC offset format
 */
export function getAllTimezoneOptions(): string[] {
  return Object.keys(UTC_TO_IANA_MAP).sort((a, b) => {
    const offsetA = getTimezoneOffset(a);
    const offsetB = getTimezoneOffset(b);
    return offsetA - offsetB;
  });
}
