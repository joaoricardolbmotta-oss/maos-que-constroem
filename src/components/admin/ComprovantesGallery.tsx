'use client';

import { Comprovante } from '@/types/database';
import { formatDate } from '@/lib/date';

interface ComprovantesGalleryProps {
  comprovantes: Comprovante[];
  entity_id?: string;
  onDelete: (id: string) => Promise<void>;
  onDownload: (id: string) => Promise<void>;
  isLoading: boolean;
}

function getFileIcon(fileType: string): string {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('image')) return '🖼️';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
  return '📎';
}

export function ComprovantesGallery({
  comprovantes,
  entity_id,
  onDelete,
  onDownload,
  isLoading,
}: ComprovantesGalleryProps) {
  const filteredComprovantes = entity_id
    ? comprovantes.filter((c) => c.entity_id === entity_id)
    : comprovantes;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-slate-500">Carregando comprovantes...</p>
      </div>
    );
  }

  if (filteredComprovantes.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-slate-500">Nenhum comprovante anexado</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredComprovantes.map((comprovante) => (
        <div
          key={comprovante.id}
          className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="text-3xl">{getFileIcon(comprovante.file_type)}</div>
            <button
              onClick={() => onDelete(comprovante.id)}
              className="text-red-600 hover:bg-red-50 p-1 rounded transition text-xs font-medium"
              title="Deletar comprovante"
            >
              ✕
            </button>
          </div>

          {/* File Info */}
          <div className="mb-3">
            <p className="text-sm font-medium text-slate-900 truncate">{comprovante.file_name}</p>
            <p className="text-xs text-slate-500 mt-1">
              {(comprovante.file_size / 1024).toFixed(1)} KB
            </p>
          </div>

          {/* Description */}
          {comprovante.description && (
            <p className="text-xs text-slate-600 mb-3 line-clamp-2">{comprovante.description}</p>
          )}

          {/* Date */}
          <p className="text-xs text-slate-400 mb-3">{formatDate(comprovante.created_at)}</p>

          {/* Actions */}
          <button
            onClick={() => onDownload(comprovante.id)}
            className="w-full px-3 py-2 bg-blue-50 text-blue-600 font-medium rounded hover:bg-blue-100 transition text-xs"
          >
            Baixar
          </button>
        </div>
      ))}
    </div>
  );
}
