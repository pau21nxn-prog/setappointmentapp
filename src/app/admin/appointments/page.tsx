/**
 * Admin Appointments Management Page
 * =============================================================================
 * View, filter, search, and manage all appointments
 * Update appointment status and view details
 * Now with bulk operations support
 *
 * Last Updated: 2025-10-31
 * Phase: 4 - Admin Dashboard (Sprint 3)
 * =============================================================================
 */

import { getAdminSession, createServiceClient } from '@/lib/auth/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AppointmentsTable } from '@/components/admin/AppointmentsTable';
import { ExportCSVButton } from '@/components/admin/ExportCSVButton';
import { AdvancedFilters } from '@/components/admin/AdvancedFilters';

// Force dynamic rendering for this page (uses cookies for authentication)
export const dynamic = 'force-dynamic';

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: {
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}) {
  // Verify admin session
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Get filter parameters
  const statusFilter = searchParams.status;
  const searchQuery = searchParams.search;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;
  const sortBy = searchParams.sortBy || 'created_at';
  const sortOrder = searchParams.sortOrder || 'desc';

  // Fetch appointments with filters
  const supabase = createServiceClient();

  let query = supabase.from('appointments').select('*');

  // Apply status filter
  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  // Apply search filter (name or email)
  if (searchQuery) {
    query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
  }

  // Apply date range filters
  if (dateFrom) {
    query = query.gte('created_at', `${dateFrom}T00:00:00`);
  }
  if (dateTo) {
    query = query.lte('created_at', `${dateTo}T23:59:59`);
  }

  // Apply sorting
  const ascending = sortOrder === 'asc';
  query = query.order(sortBy, { ascending });

  const { data: appointments, error } = await query;

  if (error) {
    console.error('Error fetching appointments:', error);
  }

  // Get counts for status badges
  const { count: totalCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true });

  const { count: pendingCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: confirmedCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'confirmed');

  const { count: completedCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-2 text-gray-600">Manage and track all appointment bookings</p>
        </div>
        <ExportCSVButton appointments={appointments || []} statusFilter={statusFilter} />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <form method="get" action="/admin/appointments">
              <input
                type="text"
                name="search"
                placeholder="Search by name or email..."
                defaultValue={searchQuery}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <input type="hidden" name="status" value={statusFilter || 'all'} />
            </form>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2">
            <StatusFilterButton
              status="all"
              label="All"
              count={totalCount || 0}
              active={!statusFilter || statusFilter === 'all'}
            />
            <StatusFilterButton
              status="pending"
              label="Pending"
              count={pendingCount || 0}
              active={statusFilter === 'pending'}
            />
            <StatusFilterButton
              status="confirmed"
              label="Confirmed"
              count={confirmedCount || 0}
              active={statusFilter === 'confirmed'}
            />
            <StatusFilterButton
              status="completed"
              label="Completed"
              count={completedCount || 0}
              active={statusFilter === 'completed'}
            />
          </div>
        </div>

        {/* Advanced Filters */}
        <AdvancedFilters />
      </div>

      {/* Appointments Table with Bulk Actions */}
      <AppointmentsTable
        appointments={appointments || []}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
      />
    </div>
  );
}

/**
 * Status Filter Button Component
 */
function StatusFilterButton({
  status,
  label,
  count,
  active,
}: {
  status: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={`/admin/appointments?status=${status}`}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label} <span className="ml-1">({count})</span>
    </Link>
  );
}
