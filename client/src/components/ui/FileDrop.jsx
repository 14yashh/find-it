import React, { useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';

export default function FileDrop({
  label,
  hint = 'JPG, PNG, WebP up to 5 MB',
  accept = 'image/jpeg,image/png,image/webp',
  multiple = false,
  maxFiles = 4,
  files = [],
  onChange,
  onRemove,
  error,
  required = false,
  className = '',
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (onChange) {
        onChange(multiple ? Array.from(e.dataTransfer.files) : [e.dataTransfer.files[0]]);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (onChange) {
        onChange(multiple ? Array.from(e.target.files) : [e.target.files[0]]);
      }
    }
  };

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {label && (
        <label className="block font-meta text-xs md:text-sm font-bold uppercase tracking-wider text-ink">
          {label} {required && <span className="text-stamp-lost">*</span>}
        </label>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed border-ink p-6 bg-paper text-center cursor-pointer interactive-hard hard-shadow-2 hover:bg-manila/50 transition-colors ${
          isDragging ? 'bg-manila ring-2 ring-primary-container' : ''
        } ${error ? 'border-stamp-lost' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 border-2 border-ink bg-paper-light rounded-none hard-shadow-2">
            <Upload className="w-6 h-6 text-ink" />
          </div>
          <div className="font-sans font-bold text-ink text-sm md:text-base">
            Click to upload or drag & drop files
          </div>
          <p className="font-meta text-xs text-ink-muted">{hint}</p>
        </div>
      </div>

      {/* Previews */}
      {files && files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          {files.map((file, idx) => {
            const isFileObj = file instanceof File;
            const url = isFileObj ? URL.createObjectURL(file) : file;
            const isImg = isFileObj
              ? file.type.startsWith('image/')
              : typeof file === 'string' && (file.startsWith('data:image') || file.includes('.webp') || file.includes('.jpg') || file.includes('.png'));

            return (
              <div
                key={idx}
                className="relative border-2 border-ink bg-paper-light p-1 hard-shadow-2 group"
              >
                {isImg ? (
                  <img
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-24 object-cover border border-ink"
                  />
                ) : (
                  <div className="w-full h-24 flex flex-col items-center justify-center p-2 text-center bg-manila/20">
                    <FileText className="w-8 h-8 text-ink mb-1" />
                    <span className="font-meta text-[11px] truncate w-full text-ink font-bold">
                      {isFileObj ? file.name : 'Document'}
                    </span>
                  </div>
                )}
                {onRemove && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(idx);
                    }}
                    className="absolute -top-2 -right-2 bg-stamp-lost text-white p-1 border border-ink hard-shadow-2 hover:scale-110"
                    title="Remove file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <p className="font-meta text-xs font-bold text-stamp-lost">{error}</p>
      )}
    </div>
  );
}
