import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DropZoneProps {
  onDrop: (files: File[]) => void;
  multiple?: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop, multiple = true }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
      setIsDragActive(false);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
    multiple,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div className="relative">
      <div
        {...getRootProps()}
        className={cn(
          'dropzone relative z-10 flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors',
          isDragActive && 'border-primary bg-primary/10',
          'cursor-pointer hover:border-primary/50 hover:bg-primary/5'
        )}
      >
        <input {...getInputProps()} {...(multiple && { webkitdirectory: 'true' } as any)} />
        <Image className="w-12 h-12 text-primary/70" />
        <p className="text-center text-muted-foreground">
          {multiple
            ? 'Drag & drop images or folder here, or click to select'
            : 'Drag & drop your image here, or click to select'}
        </p>
      </div>
    </div>
  );
};

export default DropZone;
