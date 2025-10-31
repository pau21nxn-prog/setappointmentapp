'use client';

/**
 * Notes Section Component
 * =============================================================================
 * Displays and manages appointment notes with edit/delete functionality
 *
 * Last Updated: 2025-10-31
 * Phase: 4 - Admin Dashboard (Sprint 2)
 * =============================================================================
 */

import { useState } from 'react';
import { deleteAppointmentNote, updateAppointmentNote } from '@/app/admin/actions';

interface Note {
  id: string;
  note_text: string;
  created_by: string;
  is_important: boolean;
  created_at: string;
  updated_at: string;
}

interface NotesSectionProps {
  notes: Note[];
  appointmentId: string;
  currentUserEmail: string;
}

export function NotesSection({ notes, appointmentId, currentUserEmail }: NotesSectionProps) {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editImportant, setEditImportant] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditText(note.note_text);
    setEditImportant(note.is_important);
    setError(null);
  };

  const handleSaveEdit = async (noteId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await updateAppointmentNote(noteId, editText, editImportant);

      if (result.success) {
        setEditingNoteId(null);
        setEditText('');
        setEditImportant(false);
      } else {
        setError(result.error || result.message);
      }
    } catch (err) {
      setError('Failed to update note');
      console.error('Update note error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await deleteAppointmentNote(noteId, appointmentId);

      if (!result.success) {
        setError(result.error || result.message);
      }
    } catch (err) {
      setError('Failed to delete note');
      console.error('Delete note error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg
          className="w-12 h-12 mx-auto mb-3 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
        <p className="text-sm">No notes yet. Add a note to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {notes.map((note) => {
        const isEditing = editingNoteId === note.id;
        const canEdit = note.created_by === currentUserEmail;
        const isUpdated = note.updated_at !== note.created_at;

        return (
          <div
            key={note.id}
            className={`p-4 rounded-lg border ${
              note.is_important ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{note.created_by}</span>
                  {note.is_important && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Important
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(note.created_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {isUpdated && ' (edited)'}
                </p>
              </div>

              {canEdit && !isEditing && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(note)}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-blue-600 disabled:opacity-50"
                    title="Edit note"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                    title="Delete note"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={4}
                  disabled={isLoading}
                  maxLength={5000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 text-sm"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editImportant}
                    onChange={(e) => setEditImportant(e.target.checked)}
                    disabled={isLoading}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Mark as important</span>
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveEdit(note.id)}
                    disabled={!editText.trim() || isLoading}
                    className="px-3 py-1 bg-emerald-500 text-white rounded text-sm hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setEditingNoteId(null)}
                    disabled={isLoading}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.note_text}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
