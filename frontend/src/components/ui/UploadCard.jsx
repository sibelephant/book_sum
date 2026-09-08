import React, { useRef, useState } from 'react';

const ACCEPTED = '.pdf,.docx,.txt,image/*';

export default function UploadCard({ label, onFile, accept = ACCEPTED }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const file = files && files[0];
    if (file) onFile(file);
  };

  return (
    <div
      className={`upload-card ${dragOver ? 'upload-drag' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
      }}
      aria-label="Upload a document"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="upload-input"
        onChange={(e) => handleFiles(e.target.files)}
        hidden
      />
      <div className="upload-icon" aria-hidden="true">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="M17 8l-5-5-5 5" />
          <path d="M12 3v12" />
        </svg>
      </div>
      <p className="upload-title">
        {label || 'Drag & drop your document here'}
      </p>
      <p className="upload-sub">or click to browse</p>
      <p className="upload-formats">PDF · DOCX · TXT · Image</p>
    </div>
  );
}