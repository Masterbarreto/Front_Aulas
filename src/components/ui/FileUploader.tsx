import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import '../../Styles/FileUploader.css';
import { UploadCloud, X } from "lucide-react";

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  clearFiles?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected, clearFiles }) => {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

  // Limpa arquivos quando clearFiles mudar para true
  useEffect(() => {
    if (clearFiles) {
      setSelectedFiles([]);
      onFilesSelected([]);
    }
  }, [clearFiles, onFilesSelected]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...selectedFiles, ...acceptedFiles];
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  }, [onFilesSelected, selectedFiles]);

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open
  } = useDropzone({
    onDrop,
    noClick: true,
    multiple: true,
    maxSize: 4 * 1024 * 1024 // 4MB
  });

  return (
    <div className="uploader-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'dropzone--active' : ''}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="icon-upload" size={32} color="#fff" />
        <p className="text">
          {isDragActive
            ? 'Solte seus arquivos aqui...'
            : 'Arraste e solte seus arquivos aqui ou'}
        </p>
        <button
          type="button"
          className="btn-choose"
          onClick={open}
        >
          Escolher arquivos
        </button>
      </div>
      {/* Lista de arquivos */}
      {selectedFiles.length > 0 && (
        <ul className="file-list">
          {selectedFiles.map((file, idx) => (
            <li key={idx} className="file-item">
              <span>{file.name}</span>
              <button className="remove-btn" onClick={() => removeFile(idx)} title="Remover">
                <X size={18} color="#ff4d4d" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="hint">Only PNG and JPG , Pdf  (4mb max)</p>
    </div>
  );
};
