export interface FileInfo {
  id: string;
  name: string;
  type: 'PDF' | 'XLSX' | 'DOCX' | 'PNG' | 'TXT' | 'CSV' | 'FOLDER' | 'OTHER';
  category: 'CONTRACT' | 'INVOICE' | 'BANK_RECEIPT' | 'FINANCIAL_STATEMENT' | 'OTHER';
  uploadTime: string;
  status: 'COMPLETED' | 'PROCESSING' | 'ERROR' | 'PENDING';
  tags?: string[];
  previewUrl?: string;
  structuredInfo?: Record<string, any>;
  size?: string;
  uploader?: string;
}

export interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileInfo;
}