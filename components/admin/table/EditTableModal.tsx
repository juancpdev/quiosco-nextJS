'use client';

import { useState } from 'react';
import { Table } from '@prisma/client';
import { X, Edit3, Trash2, Check, AlertTriangle } from 'lucide-react';
import { updateTableNumber, deleteTable } from '@/actions/table-actions';
import { toast } from 'react-toastify';

type EditTableModalProps = {
  table: Table;
  onClose: () => void;
  onUpdateSuccess: () => void;
};

// 🎯 Modal de confirmación custom (más ligero que SweetAlert2)
function ConfirmDeleteModal({ 
  tableNumber, 
  onConfirm, 
  onCancel 
}: { 
  tableNumber: number; 
  onConfirm: () => void; 
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-150">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¿Eliminar mesa?
            </h3>
            <p className="text-gray-600 mb-1">
              Estás por eliminar la <span className="font-semibold text-gray-900">Mesa #{tableNumber}</span>
            </p>
            <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mt-3">
              Esta acción no se puede deshacer
            </p>
          </div>

          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditTableModal({ table, onClose, onUpdateSuccess }: EditTableModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [newNumber, setNewNumber] = useState(table.number);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdate = async () => {
    if (newNumber === table.number) {
      setEditMode(false);
      return;
    }

    if (newNumber <= 0) {
      toast.error('El número debe ser mayor a 0');
      return;
    }

    setIsLoading(true);
    const res = await updateTableNumber(table.id, newNumber);

    if (res.success) {
      toast.success(`Mesa actualizada a #${newNumber}`);
      onUpdateSuccess();
      setEditMode(false);
    } else {
      toast.error(res.error || 'Error al actualizar');
    }
    setIsLoading(false);
  };

  const handleDeleteConfirm = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    
    const res = await deleteTable(table.number);

    if (res.success) {
      toast.success(`Mesa #${table.number} eliminada`);
      onUpdateSuccess();
      onClose();
    } else {
      toast.error(res.error || 'No se pudo eliminar');
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/40 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-slate-50 to-slate-100/50 px-6 pt-6 pb-4 border-b border-gray-200">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <X size={20} className="text-gray-600" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">#{table.number}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Mesa {table.number}</h2>
                <p className="text-sm text-gray-500">Gestionar mesa</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-3">
            {/* Editar */}
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                disabled={isLoading}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors group disabled:opacity-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Edit3 size={18} className="text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-700">Cambiar número</span>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <div className="space-y-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <label className="block text-sm font-semibold text-gray-700">
                  Nuevo número
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newNumber}
                    onChange={(e) => setNewNumber(Number(e.target.value))}
                    min="1"
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 font-semibold"
                    autoFocus
                  />
                  <button
                    onClick={handleUpdate}
                    disabled={isLoading || newNumber === table.number}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Check size={18} />
                    )}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setNewNumber(table.number);
                  }}
                  disabled={isLoading}
                  className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}

            {/* Separador */}
            <div className="border-t border-gray-200" />

            {/* Eliminar */}
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isLoading}
              className="w-full flex items-center justify-between px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors group disabled:opacity-50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                  <Trash2 size={18} className="text-red-600" />
                </div>
                <span className="font-semibold text-red-700">Eliminar mesa</span>
              </div>
              <svg className="w-5 h-5 text-red-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirm && (
        <ConfirmDeleteModal
          tableNumber={table.number}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}