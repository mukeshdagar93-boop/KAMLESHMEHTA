
import React from 'react';
import { ManagedFile } from '../types';
import { PdfIcon, CloseIcon, DragHandleIcon } from './Icons';

interface FileItemProps {
  managedFile: ManagedFile;
  onRemove: (id: string) => void;
  isDragging?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileItem: React.FC<FileItemProps> = React.memo(({ managedFile, onRemove, isDragging }) => {
  return (
    <div 
        className={`
            flex items-center p-3 bg-slate-800 rounded-lg shadow-md transition-all duration-300
            ${isDragging ? 'opacity-50 scale-105 shadow-xl' : 'opacity-100'}
        `}
    >
      <div className="flex items-center flex-grow truncate">
        <DragHandleIcon className="w-6 h-6 text-slate-500 cursor-grab mr-3 flex-shrink-0" />
        <PdfIcon className="w-8 h-8 text-brand-primary mr-4 flex-shrink-0" />
        <div className="truncate">
          <p className="font-medium text-slate-100 truncate" title={managedFile.file.name}>
            {managedFile.file.name}
          </p>
          <p className="text-sm text-slate-400">
            {formatFileSize(managedFile.file.size)}
          </p>
        </div>
      </div>
      <button
        onClick={() => onRemove(managedFile.id)}
        className="ml-4 p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors flex-shrink-0"
        aria-label={`Remove ${managedFile.file.name}`}
      >
        <CloseIcon className="w-5 h-5" />
      </button>
    </div>
  );
});

export default FileItem;
