import { useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileUpload?: (file: File, content?: string) => void;
  onFileRemove?: () => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  className?: string;
}

interface UploadedFile {
  file: File;
  content?: string;
  preview?: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export function FileUpload({
  onFileUpload,
  onFileRemove,
  acceptedTypes = ['.pdf', '.doc', '.docx'],
  maxSize = 10,
  className
}: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `文件大小不能超过 ${maxSize}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `只支持 ${acceptedTypes.join(', ')} 格式的文件`;
    }

    return null;
  };

  const processFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setUploadedFile({
        file,
        status: 'error',
        progress: 0,
        error
      });
      return;
    }

    // Start upload simulation
    setUploadedFile({
      file,
      status: 'uploading',
      progress: 0
    });

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadedFile(prev => {
        if (!prev || prev.progress >= 100) {
          clearInterval(progressInterval);
          return prev;
        }
        return {
          ...prev,
          progress: Math.min(prev.progress + 10, 100)
        };
      });
    }, 200);

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll just read the file as text
      // In a real app, you'd send this to a backend service for processing
      let content = '';
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        content = await file.text();
      } else {
        // For PDF/Word files, you'd typically use a library like pdf-parse or mammoth
        content = `已上传文件: ${file.name}\n文件大小: ${(file.size / 1024 / 1024).toFixed(2)}MB\n文件类型: ${file.type || '未知'}\n\n[此处应显示解析后的简历内容]`;
      }

      clearInterval(progressInterval);
      setUploadedFile({
        file,
        content,
        status: 'success',
        progress: 100
      });

      onFileUpload?.(file, content);
    } catch (err) {
      clearInterval(progressInterval);
      setUploadedFile({
        file,
        status: 'error',
        progress: 0,
        error: '文件处理失败，请重试'
      });
    }
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    processFile(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setUploadedFile(null);
    onFileRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (uploadedFile) {
    return (
      <Card className={cn("transition-all duration-200", className)}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium truncate">{uploadedFile.file.name}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                <span>{formatFileSize(uploadedFile.file.size)}</span>
                <span>•</span>
                <span>{uploadedFile.file.type || '未知类型'}</span>
              </div>

              {uploadedFile.status === 'uploading' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">上传中...</span>
                    <span className="font-medium">{uploadedFile.progress}%</span>
                  </div>
                  <Progress value={uploadedFile.progress} className="h-2" />
                </div>
              )}

              {uploadedFile.status === 'success' && (
                <div className="space-y-3">
                  <Badge variant="default" className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    上传成功
                  </Badge>
                  
                  {uploadedFile.content && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          预览内容
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          下载
                        </Button>
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-lg border border-border max-h-32 overflow-y-auto">
                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                          {uploadedFile.content.substring(0, 200)}...
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {uploadedFile.status === 'error' && (
                <div className="space-y-2">
                  <Badge variant="destructive" className="bg-error/10 text-error border-error/20">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    上传失败
                  </Badge>
                  {uploadedFile.error && (
                    <p className="text-sm text-error">{uploadedFile.error}</p>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => processFile(uploadedFile.file)}
                  >
                    重试
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("transition-all duration-200", className)}>
      <CardContent className="p-0">
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
            "hover:border-primary/50 hover:bg-primary/5",
            isDragOver && "border-primary bg-primary/10",
            "group"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <Upload className="h-8 w-8" />
            </div>
            
            <div>
              <p className="font-medium mb-1">
                {isDragOver ? '释放文件以上传' : '点击上传或拖拽文件'}
              </p>
              <p className="text-sm text-muted-foreground">
                支持 {acceptedTypes.join(', ')} 格式，最大 {maxSize}MB
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}