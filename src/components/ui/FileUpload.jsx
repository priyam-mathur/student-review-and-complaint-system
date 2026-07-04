import * as React from "react"
import { cn } from "@/utils/formatters"
import { FileUp, X } from "lucide-react"

const FileUpload = React.forwardRef(({ className, label, accept, multiple = false, onChange, error, ...props }, ref) => {
  const [dragActive, setDragActive] = React.useState(false)
  const [files, setFiles] = React.useState([])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      setFiles(multiple ? [...files, ...droppedFiles] : [droppedFiles[0]])
      if (onChange) onChange(multiple ? [...files, ...droppedFiles] : droppedFiles)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(multiple ? [...files, ...selectedFiles] : [selectedFiles[0]])
      if (onChange) onChange(multiple ? [...files, ...selectedFiles] : selectedFiles)
    }
  }

  const removeFile = (index) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
    if (onChange) onChange(newFiles)
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-accent/50 hover:border-muted-foreground/50",
          error && "border-destructive/50 hover:border-destructive"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
          <FileUp className="w-8 h-8 mb-3" />
          <p className="mb-1 text-sm"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
          <p className="text-xs">{label || "Any file up to 5MB"}</p>
        </div>
        <input
          ref={ref}
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
          {...props}
        />
      </div>
      
      {error && (
        <span className="text-xs text-destructive mt-2 block">
          {error}
        </span>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-2 text-sm border rounded-md bg-card">
              <span className="truncate max-w-[80%]">{file.name}</span>
              <button 
                type="button" 
                onClick={() => removeFile(i)}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
FileUpload.displayName = "FileUpload"

export { FileUpload }
