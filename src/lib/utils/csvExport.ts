/**
 * CSV Export Utilities
 * =============================================================================
 * Generate and download CSV files from appointment data
 * Phase: 4 - Sprint 3
 * =============================================================================
 */

interface AppointmentData {
  id: string;
  full_name: string;
  company_name?: string;
  email: string;
  phone?: string;
  project_type: string;
  budget_range: string;
  timeline?: string;
  preferred_contact_time?: string;
  status: string;
  created_at: string;
  updated_at: string;
  project_description?: string;
  additional_notes?: string;
}

/**
 * Convert appointments to CSV string
 */
export function appointmentsToCSV(appointments: AppointmentData[]): string {
  if (!appointments || appointments.length === 0) {
    return '';
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Full Name',
    'Company',
    'Email',
    'Phone',
    'Project Type',
    'Budget Range',
    'Timeline',
    'Preferred Contact Time',
    'Status',
    'Created Date',
    'Updated Date',
    'Project Description',
    'Additional Notes',
  ];

  // Escape CSV field (handle commas, quotes, newlines)
  const escapeField = (field: any): string => {
    if (field === null || field === undefined) return '';
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Build CSV rows
  const rows = appointments.map((apt) => [
    escapeField(apt.id),
    escapeField(apt.full_name),
    escapeField(apt.company_name || ''),
    escapeField(apt.email),
    escapeField(apt.phone || ''),
    escapeField(apt.project_type),
    escapeField(apt.budget_range),
    escapeField(apt.timeline || ''),
    escapeField(apt.preferred_contact_time || ''),
    escapeField(apt.status),
    escapeField(new Date(apt.created_at).toLocaleString()),
    escapeField(new Date(apt.updated_at).toLocaleString()),
    escapeField(apt.project_description || ''),
    escapeField(apt.additional_notes || ''),
  ]);

  // Combine headers and rows
  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string = 'appointments.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate filename with current date/time
 */
export function generateCSVFilename(prefix: string = 'appointments'): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
  return `${prefix}_${dateStr}_${timeStr}.csv`;
}
