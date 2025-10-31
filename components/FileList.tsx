
import React, { useRef, useState } from 'react';
import { ManagedFile } from '../types';
import FileItem from './FileItem';

interface FileListProps {
  files: ManagedFile[];
  onReorder: (files: ManagedFile[]) => void;
  onRemove: (id: string) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onReorder, onRemove }) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const dragOverItem = useRef<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    dragOverItem.current = id;
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedItemId || !dragOverItem.current || draggedItemId === dragOverItem.current) {
        return;
    }

    const newFiles = [...files];
    const draggedItemIndex = files.findIndex(file => file.id === draggedItemId);
    const targetItemIndex = files.findIndex(file => file.id === dragOverItem.current);
    
    if (draggedItemIndex === -1 || targetItemIndex === -1) return;

    const [draggedItem] = newFiles.splice(draggedItemIndex, 1);
    newFiles.splice(targetItemIndex, 0, draggedItem);
    
    onReorder(newFiles);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    dragOverItem.current = null;
  };

  return (
    <div className="space-y-3">
      {files.map((managedFile) => (
        <div
          key={managedFile.id}
          draggable
          onDragStart={(e) => handleDragStart(e, managedFile.id)}
          onDragEnter={(e) => handleDragEnter(e, managedFile.id)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          className="cursor-move"
        >
          <FileItem
            managedFile={managedFile}
            onRemove={onRemove}
            isDragging={draggedItemId === managedFile.id}
          />
        </div>
      ))}
    </div>
  );
};

export default FileList;
