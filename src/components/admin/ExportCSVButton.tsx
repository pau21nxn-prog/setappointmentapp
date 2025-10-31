'use client';

/**
 * Export CSV Button Component
 * =============================================================================
 * Download appointments as CSV file
 * Phase: 4 - Sprint 3
 * =============================================================================
 */

import { useState } from 'react';
import { appointmentsToCSV, downloadCSV, generateCSVFilename } from '@/lib/utils/csvExport';

interface ExportCSVButtonProps {
  appointments: any[];
  statusFilter?: string;
}

export function ExportCSVButton({ appointments, statusFilter }: ExportCSVButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    if (!appointments || appointments.length === 0) {
      alert('No appointments to export');
      return;
    }

    setIsExporting(true);

    try {
      const csvContent = appointmentsToCSV(appointments);
      const prefix =
        statusFilter && statusFilter !== 'all' ? `appointments_${statusFilter}` : 'appointments';
      const filename = generateCSVFilename(prefix);

      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('CSV export error:', error);
      alert('Failed to export CSV');
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || !appointments || appointments.length === 0}
      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2 transition-colors"
    >
      {isExporting ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Exporting...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export CSV
        </>
      )}
    </button>
  );
}
