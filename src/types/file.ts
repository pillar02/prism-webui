export interface FileInfo {
  id: string;
  fileName: string; // Renamed from name
  fileType: 'PDF' | 'XLSX' | 'DOCX' | 'PNG' | 'TXT' | 'CSV' | 'FOLDER' | 'OTHER'; // Renamed from type
  documentType: string; // Added, assuming string type for now
  uploadTimestamp: string; // Renamed from uploadTime
  processingStatus: 'COMPLETED' | 'PROCESSING' | 'ERROR' | 'PENDING'; // Renamed from status
  userTags?: string[]; // Renamed from tags
  certainty?: number; // Added
  distance?: number; // Added
  previewUrl?: string; // Kept, though not in FileListItemView, might be used by FilePreviewDialog
  structuredInfo?: Record<string, any>; // Kept for similar reasons
  size?: string; // Kept
  uploader?: string; // Kept
}

export interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileDetailView; // Updated to use FileDetailView
}

// Represents the processing status of a file (FileProcessingStatusView from backend)
export interface FileProcessingStatusView {
  fppId: string;
  batchId: string;
  overallPipelineStatus: string;
  perkeepUploadStatus: string;
  ocrAnalysisStatus: string;
  ocr2VectorDBStatus: string;
  vectorDB2AnalyticsStatus: string;
  lastUpdatedTimestamp: string;
}

// Represents structured data for a contract (ContractData from backend)
export interface ContractData {
  contractNumber?: string;
  contractName?: string;
  partyA?: string;
  partyB?: string;
  totalAmount?: number;
  currency?: string;
  effectiveDate?: string;
  expirationDate?: string;
}

// Represents structured data for an invoice (InvoiceData from backend)
export interface InvoiceData {
  invoiceNumber?: string;
  invoiceCode?: string;
  invoiceType?: string;
  issuerName?: string;
  recipientName?: string;
  totalAmount?: number;
  taxAmount?: number;
  amountExcludingTax?: number;
  invoiceDate?: string;
  lineItemsJson?: string; // JSON string for line items
}

// Represents structured data for a bank slip (BankSlipData from backend)
export interface BankSlipData {
  payerName?: string;
  payerAccount?: string;
  payerBank?: string;
  payeeName?: string;
  payeeAccount?: string;
  payeeBank?: string;
  paymentAmount?: number;
  paymentDate?: string;
  remarks?: string;
}

// Union type for different kinds of structured data
export type StructuredDataUnion = ContractData | InvoiceData | BankSlipData;

// Represents the detailed view of a file (FileDetailView from backend)
export interface FileDetailView {
  id: string;
  fileName?: string;
  documentType?: string; // e.g., 'CONTRACT', 'INVOICE'
  perkeepFileRef?: string;
  previewImageUrl?: string;
  processingHistory?: FileProcessingStatusView; // Note: GraphQL query had this as an array, but instructions imply single object. Clarify if array needed. For now, single object.
  userTags?: string[];
  relatedDocuments?: FileInfo[]; // Array of FileInfo for related documents
  structuredData?: StructuredDataUnion;
}