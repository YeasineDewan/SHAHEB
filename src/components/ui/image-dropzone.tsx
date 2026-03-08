import { useState, useRef, useCallback } from "react";
import { Upload, X, ImageIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ImageDropZoneProps {
  value?: string;
  onChange?: (url: string) => void;
  onFileSelect?: (file: File) => void;
  aspectRatio?: string;
  className?: string;
  placeholder?: string;
  accept?: string;
  maxSizeMB?: number;
}

export function ImageDropZone({
  value,
  onChange,
  onFileSelect,
  aspectRatio = "aspect-[2/1]",
  className,
  placeholder = "Drag & drop an image here, or click to browse",
  accept = "image/png,image/jpeg,image/webp,image/gif",
  maxSizeMB = 5,
}: ImageDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (PNG, JPG, WEBP, GIF)");
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size must be under ${maxSizeMB}MB`);
        return;
      }
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange?.(url);
      onFileSelect?.(file);
    },
    [maxSizeMB, onChange, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    setFileName(null);
    setError(null);
    onChange?.("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !preview && inputRef.current?.click()}
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all overflow-hidden group",
          aspectRatio,
          isDragging
            ? "border-accent bg-accent/5 scale-[1.01]"
            : preview
            ? "border-border bg-secondary/30"
            : "border-border hover:border-accent/50 bg-secondary/20 cursor-pointer",
          error && "border-destructive/50 bg-destructive/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="rounded-full text-xs gap-1 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                <Upload className="h-3 w-3" /> Replace
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="rounded-full text-xs gap-1 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
              >
                <X className="h-3 w-3" /> Remove
              </Button>
            </div>
            {fileName && (
              <div className="absolute bottom-0 left-0 right-0 bg-foreground/70 text-background px-3 py-1.5 flex items-center gap-2">
                <Check className="h-3 w-3 text-green-400 shrink-0" />
                <span className="text-[10px] truncate">{fileName}</span>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors",
                isDragging
                  ? "bg-accent/20 text-accent"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {isDragging ? (
                <Upload className="h-5 w-5 animate-bounce" />
              ) : (
                <ImageIcon className="h-5 w-5" />
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
              {isDragging ? "Drop your image here" : placeholder}
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-1.5">
              PNG, JPG, WEBP · Max {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <X className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}
