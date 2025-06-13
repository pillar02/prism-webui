// Renamed from FileInfo and properties updated to match GraphQL FileListItemView
export interface FileListItemView {
  id: string;
  fileName: string;
  documentType?: string; // Changed to optional
  fileType: string; // Changed from specific union to generic string
  processingStatus: PipelineStageStatusType; // Uses the defined type
  uploadTimestamp: string;
  userTags?: string[];
  certainty?: number;
  distance?: number;
  // previewUrl, structuredInfo, size, uploader REMOVED
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
  __typename?: 'ContractData';
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
  __typename?: 'InvoiceData';
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
  __typename?: 'BankSlipData';
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

// Type alias for possible processing status values, mirroring GraphQL enum
export type PipelineStageStatusType =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'ERROR'
  | 'CANCELLED'
  | 'NOT_APPLICABLE';

// Represents the detailed view of a file (FileDetailView from backend)
export interface FileDetailView {
  id: string;
  fileName?: string;
  documentType?: string; // e.g., 'CONTRACT', 'INVOICE'
  fileType?: string; // Added this line
  perkeepFileRef?: string;
  previewImageUrl?: string;
  processingHistory?: FileProcessingStatusView; // Note: GraphQL query had this as an array, but instructions imply single object. Clarify if array needed. For now, single object.
  userTags?: string[];
  relatedDocuments?: FileListItemView[]; // Updated to use FileListItemView
  structuredData?: StructuredDataUnion;
  uploadTimestamp: string; // Added
  processingStatus: PipelineStageStatusType; // Added
}