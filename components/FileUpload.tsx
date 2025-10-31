
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesAdded, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesAdded(Array.from(e.target.files));
      e.target.value = ''; // Reset input to allow re-uploading the same file
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);
  
  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  }, [onFilesAdded]);

  const dropzoneClasses = `
    flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer
    transition-colors duration-300
    ${disabled ? 'cursor-not-allowed bg-slate-800/50 border-slate-700' : 'border-slate-600 hover:border-brand-primary hover:bg-slate-800'}
    ${isDragging ? 'border-brand-primary bg-slate-800' : ''}
  `;

  return (
    <div
      className={dropzoneClasses}
      onClick={disabled ? undefined : handleClick}
      onDragEnter={disabled ? undefined : handleDragIn}
      onDragLeave={disabled ? undefined : handleDragOut}
      onDragOver={disabled ? undefined : handleDrag}
      onDrop={disabled ? undefined : handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <UploadIcon className={`w-12 h-12 mb-4 ${disabled ? 'text-slate-600' : 'text-slate-500'}`} />
      <p className={`text-lg ${disabled ? 'text-slate-600' : 'text-slate-400'}`}>
        <span className="font-semibold text-brand-primary">Click to upload</span> or drag and drop
      </p>
      <p className={`text-sm ${disabled ? 'text-slate-600' : 'text-slate-500'}`}>PDF files only</p>
    </div>
  );
};

export default FileUpload;
