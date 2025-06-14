import { NextRequest, NextResponse } from 'next/server';
// Fix 1: Added FileListItemView to imports - Now removing FileInfo
import { FileDetailView, FileListItemView, FileProcessingStatusView, ContractData, InvoiceData, BankSlipData, StructuredDataUnion } from '@/types/file';
import { buildSchema, graphql } from 'graphql';

// Define a more comprehensive type for our mock data store
interface MockFileMasterData {
  id: string;
  fileName: string;
  documentType: string;
  fileType: string;
  processingStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'ERROR' | 'CANCELLED' | 'NOT_APPLICABLE';
  uploadTimestamp: string;
  userTags?: string[];
  certainty?: number;
  distance?: number;
  perkeepFileRef?: string;
  previewImageUrl?: string;
  processingHistory?: FileProcessingStatusView;
  relatedDocuments?: Partial<FileListItemView>[];
  structuredData?: StructuredDataUnion; // Fix 2: Changed this line
  // Optional original fields if needed for other logic, though try to phase out
  size?: string;
  uploader?: string;
}

const sampleRelatedDocs: Partial<FileListItemView>[] = [
  {
    id: 'rel-001',
    fileName: 'Related Policy Document.pdf',
    documentType: 'Policy',
    fileType: 'PDF',
    processingStatus: 'COMPLETED',
    uploadTimestamp: '2023-01-15T10:00:00Z',
    userTags: ['internal', 'policy'],
    certainty: 0.9,
    distance: 0.1,
  },
  {
    id: 'rel-002',
    fileName: 'Supporting Spreadsheet.xlsx',
    documentType: 'SupportingData',
    fileType: 'XLSX',
    processingStatus: 'COMPLETED',
    uploadTimestamp: '2023-02-20T11:00:00Z',
    userTags: ['data', 'support'],
    certainty: 0.85,
    distance: 0.15,
  }
];


const mockMasterData: MockFileMasterData[] = [
  {
    id: '101',
    fileName: '年度财务报告-2023-final.pdf',
    documentType: 'FinancialStatement', // Changed from category
    fileType: 'PDF', // Kept simple
    processingStatus: 'COMPLETED', // Mapped from status
    uploadTimestamp: '2024-07-15T09:30:00Z', // ISO 8601 format
    userTags: ['财务', '年度报告'], // Renamed from tags
    certainty: 0.98,
    distance: 0.02,
    perkeepFileRef: 'sha1-mock101ref-财务报告',
    previewImageUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/g5jou2tvabjzl7exoihk.png',
    processingHistory: {
      fppId: '101-fpp', batchId: 'batch-001', overallPipelineStatus: 'COMPLETED',
      perkeepUploadStatus: 'COMPLETED', ocrAnalysisStatus: 'COMPLETED',
      ocr2VectorDBStatus: 'COMPLETED', vectorDB2AnalyticsStatus: 'COMPLETED',
      lastUpdatedTimestamp: '2024-07-15T09:35:00Z',
    },
    relatedDocuments: [sampleRelatedDocs[0]],
    structuredData: {
      __typename: 'InvoiceData', // Example: Treat as Invoice for mocking, adjust as needed
      invoiceNumber: 'INV-FS-2023-001', totalAmount: 50000, invoiceDate: '2023-12-31T00:00:00Z', issuerName: '公司财务部'
    },
    size: '2.5 MB', uploader: '张三'
  },
  {
    id: '102',
    fileName: 'Q3营销计划.docx',
    documentType: 'Contract', // Changed from category
    fileType: 'DOCX',
    processingStatus: 'COMPLETED',
    uploadTimestamp: '2024-07-14T14:00:00Z',
    userTags: ['营销', '计划'],
    certainty: 0.95,
    distance: 0.05,
    perkeepFileRef: 'sha1-mock102ref-营销计划',
    previewImageUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/g5jou2tvabjzl7exoihk.png',
    processingHistory: {
      fppId: '102-fpp', batchId: 'batch-001', overallPipelineStatus: 'COMPLETED',
      perkeepUploadStatus: 'COMPLETED', ocrAnalysisStatus: 'COMPLETED',
      ocr2VectorDBStatus: 'COMPLETED', vectorDB2AnalyticsStatus: 'COMPLETED',
      lastUpdatedTimestamp: '2024-07-14T14:05:00Z',
    },
    relatedDocuments: [sampleRelatedDocs[1]],
    structuredData: {
      __typename: 'ContractData',
      contractNumber: 'MKT-PLAN-Q3-2024', contractName: 'Q3 Marketing Plan Agreement', partyA: '营销部', partyB: '销售部', totalAmount: 150000, currency: 'CNY', effectiveDate: '2024-07-01T00:00:00Z', expirationDate: '2024-09-30T00:00:00Z'
    },
    size: '1.2 MB', uploader: '李四'
  },
  {
    id: '103',
    fileName: '新产品设计稿.png',
    documentType: 'Other', // Changed from category
    fileType: 'PNG',
    processingStatus: 'PENDING',
    uploadTimestamp: '2024-07-13T11:20:00Z',
    userTags: ['设计', '新产品'],
    certainty: 0.90,
    distance: 0.10,
    perkeepFileRef: 'sha1-mock103ref-设计稿',
    previewImageUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/g5jou2tvabjzl7exoihk.png',
    processingHistory: {
      fppId: '103-fpp', batchId: 'batch-002', overallPipelineStatus: 'PENDING',
      perkeepUploadStatus: 'PENDING', ocrAnalysisStatus: 'PENDING',
      ocr2VectorDBStatus: 'NOT_APPLICABLE', vectorDB2AnalyticsStatus: 'NOT_APPLICABLE',
      lastUpdatedTimestamp: '2024-07-13T11:22:00Z',
    },
    relatedDocuments: [],
    structuredData: undefined, // No specific structured data for 'Other' or PNG in this mock
    size: '500 KB', uploader: '王五'
  },
  {
    id: '104',
    fileName: '客户合同-ABC公司.pdf',
    documentType: 'Contract',
    fileType: 'PDF',
    processingStatus: 'ERROR',
    uploadTimestamp: '2024-07-12T16:45:00Z',
    userTags: ['合同', '客户'],
    certainty: 0.80,
    distance: 0.20,
    perkeepFileRef: 'sha1-mock104ref-客户合同',
    previewImageUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/g5jou2tvabjzl7exoihk.png',
    processingHistory: {
      fppId: '104-fpp', batchId: 'batch-002', overallPipelineStatus: 'ERROR',
      perkeepUploadStatus: 'COMPLETED', ocrAnalysisStatus: 'ERROR',
      ocr2VectorDBStatus: 'CANCELLED', vectorDB2AnalyticsStatus: 'CANCELLED',
      lastUpdatedTimestamp: '2024-07-12T16:50:00Z',
    },
    relatedDocuments: [sampleRelatedDocs[0], sampleRelatedDocs[1]],
    structuredData: {
      __typename: 'ContractData',
      contractNumber: 'CUST-ABC-2024-001', contractName: 'Service Agreement with ABC Corp', partyA: '我方公司', partyB: 'ABC 公司', totalAmount: 250000, currency: 'USD', effectiveDate: '2024-07-10T00:00:00Z', expirationDate: '2025-07-09T00:00:00Z'
    },
    size: '800 KB', uploader: '赵六'
  },
  {
    id: '105',
    fileName: '会议纪要-20240710.txt',
    documentType: 'Other',
    fileType: 'TXT',
    processingStatus: 'COMPLETED',
    uploadTimestamp: '2024-07-10T10:00:00Z',
    userTags: ['会议', '纪要'],
    certainty: 0.92,
    distance: 0.08,
    perkeepFileRef: 'sha1-mock105ref-会议纪要',
    previewImageUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/g5jou2tvabjzl7exoihk.png',
    processingHistory: {
      fppId: '105-fpp', batchId: 'batch-003', overallPipelineStatus: 'COMPLETED',
      perkeepUploadStatus: 'COMPLETED', ocrAnalysisStatus: 'COMPLETED',
      ocr2VectorDBStatus: 'NOT_APPLICABLE', vectorDB2AnalyticsStatus: 'NOT_APPLICABLE',
      lastUpdatedTimestamp: '2024-07-10T10:05:00Z',
    },
    relatedDocuments: [],
    structuredData: undefined,
    size: '10 KB', uploader: '孙七'
  },
  // Add more mock data items following the new structure for 106-110
  {
    id: '106',
    fileName: '人力资源规划2024.xlsx',
    documentType: 'HRDocument', // Example, can be 'Other'
    fileType: 'XLSX',
    processingStatus: 'COMPLETED',
    uploadTimestamp: '2024-07-09T15:30:00Z',
    userTags: ['人力资源', '规划'],
    certainty: 0.96,
    distance: 0.04,
    perkeepFileRef: 'sha1-mock106ref-HR规划',
    previewImageUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/g5jou2tvabjzl7exoihk.png',
    processingHistory: {
      fppId: '106-fpp', batchId: 'batch-003', overallPipelineStatus: 'COMPLETED',
      perkeepUploadStatus: 'COMPLETED', ocrAnalysisStatus: 'COMPLETED',
      ocr2VectorDBStatus: 'COMPLETED', vectorDB2AnalyticsStatus: 'COMPLETED',
      lastUpdatedTimestamp: '2024-07-09T15:35:00Z',
    },
    relatedDocuments: [sampleRelatedDocs[0]],
    structuredData: {
        __typename: 'ContractData', // Example, could be other type or undefined
        contractNumber: 'HR-PLAN-2024', contractName: '2024 HR Strategic Plan', partyA: 'HR Department', totalAmount: 0, currency: 'N/A', effectiveDate: '2024-01-01T00:00:00Z'
    },
    size: '1.8 MB', uploader: '周八'
  },
  {
    id: '109', // Example: BankSlip
    fileName: '付款凭证-XYZ供应商.pdf',
    documentType: 'BankSlip',
    fileType: 'PDF',
    processingStatus: 'COMPLETED',
    uploadTimestamp: '2024-07-06T11:40:00Z',
    userTags: ['财务', '付款'],
    certainty: 0.99,
    distance: 0.01,
    perkeepFileRef: 'sha1-mock109ref-付款凭证',
    previewImageUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/tax_preview.png', // Reusing image
    processingHistory: {
      fppId: '109-fpp', batchId: 'batch-004', overallPipelineStatus: 'COMPLETED',
      perkeepUploadStatus: 'COMPLETED', ocrAnalysisStatus: 'COMPLETED',
      ocr2VectorDBStatus: 'COMPLETED', vectorDB2AnalyticsStatus: 'COMPLETED',
      lastUpdatedTimestamp: '2024-07-06T11:45:00Z',
    },
    relatedDocuments: [sampleRelatedDocs[1]],
    structuredData: {
      __typename: 'BankSlipData',
      payerName: '我方公司', payerAccount: '1234567890', payerBank: '招商银行', payeeName: 'XYZ 供应商', payeeAccount: '0987654321', payeeBank: '工商银行', paymentAmount: 85000, paymentDate: '2024-07-05T00:00:00Z', remarks: '支付货款'
    },
    size: '1.6 MB', uploader: '陈十一'
  },
   {
    id: '110', // Example: Invoice
    fileName: '服务费发票-顾问A.pdf',
    documentType: 'Invoice',
    fileType: 'PDF',
    processingStatus: 'COMPLETED',
    uploadTimestamp: '2024-07-05T09:50:00Z',
    userTags: ['财务', '发票', '顾问服务'],
    certainty: 0.97,
    distance: 0.03,
    perkeepFileRef: 'sha1-mock110ref-服务费发票',
    previewImageUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/training_preview.png', // Reusing image
    processingHistory: {
      fppId: '110-fpp', batchId: 'batch-004', overallPipelineStatus: 'COMPLETED',
      perkeepUploadStatus: 'COMPLETED', ocrAnalysisStatus: 'COMPLETED',
      ocr2VectorDBStatus: 'COMPLETED', vectorDB2AnalyticsStatus: 'COMPLETED',
      lastUpdatedTimestamp: '2024-07-05T09:55:00Z',
    },
    relatedDocuments: [],
    structuredData: {
      __typename: 'InvoiceData',
      invoiceNumber: 'INV-CONS-A-005', invoiceCode: 'IC123456', invoiceType: '服务费', issuerName: '顾问A公司', recipientName: '我方公司', totalAmount: 12000, taxAmount: 720, amountExcludingTax: 11280, invoiceDate: '2024-07-01T00:00:00Z'
    },
    size: '5.7 MB', uploader: '林十二'
  }
  // Note: Items 107, 108 are omitted for brevity in this example transformation but should be included
];


// --- Inserted GraphQL Setup ---
const schemaString = `
enum SortOrder {
  ASC
  DESC
}

enum PipelineStageStatus {
  PENDING
  PROCESSING
  COMPLETED
  ERROR
  CANCELLED
  NOT_APPLICABLE
}

interface BaseData {
  id: ID!
}

type ContractData {
  contractNumber: String
  contractName: String
  partyA: String
  partyB: String
  totalAmount: Float
  currency: String
  effectiveDate: String # Consider using DateTime scalar
  expirationDate: String # Consider using DateTime scalar
}

type InvoiceData {
  invoiceNumber: String
  invoiceCode: String
  invoiceType: String
  issuerName: String
  recipientName: String
  totalAmount: Float
  taxAmount: Float
  amountExcludingTax: Float
  invoiceDate: String # Consider using DateTime scalar
  lineItemsJson: String # JSON string for line items
}

type BankSlipData {
  payerName: String
  payerAccount: String
  payerBank: String
  payeeName: String
  payeeAccount: String
  payeeBank: String
  paymentAmount: Float
  paymentDate: String # Consider using DateTime scalar
  remarks: String
}

union StructuredDataUnion = ContractData | InvoiceData | BankSlipData

type FileProcessingStatusView {
  fppId: ID! # File Processing Pipeline ID
  batchId: String
  overallPipelineStatus: PipelineStageStatus!
  perkeepUploadStatus: PipelineStageStatus!
  ocrAnalysisStatus: PipelineStageStatus!
  ocr2VectorDBStatus: PipelineStageStatus!
  vectorDB2AnalyticsStatus: PipelineStageStatus!
  lastUpdatedTimestamp: String! # ISO 8601 DateTime string
}

type FileListItemView {
  id: ID!
  fileName: String!
  documentType: String # E.g., 'Invoice', 'Contract', 'BankSlip'. Could be an enum.
  fileType: String! # E.g., 'application/pdf', 'image/jpeg', 'text/plain'
  processingStatus: PipelineStageStatus!
  uploadTimestamp: String! # ISO 8601 DateTime string
  userTags: [String!]
  certainty: Float
  distance: Float
}

type FileDetailView {
  id: ID!
  fileName: String
  documentType: String
  fileType: String # Added this line
  perkeepFileRef: String # Perkeep blob reference
  previewImageUrl: String
  processingHistory: FileProcessingStatusView # Or [FileProcessingStatusView!] if multiple history entries
  userTags: [String!]
  relatedDocuments: [FileListItemView!]
  structuredData: StructuredDataUnion
  uploadTimestamp: String!       # Added
  processingStatus: PipelineStageStatus! # Added
}

input FileFilterInput {
  documentTypes: [String!]
  overallPipelineStatus_in: [PipelineStageStatus!]
  uploadDate_gte: String # ISO 8601 DateTime string
  uploadDate_lte: String # ISO 8601 DateTime string
  userTags_containsAll: [String!]
  userTags_containsAny: [String!]
}

type Query {
  searchFiles(
    limit: Int = 10
    offset: Int = 0
    sortBy: String = "uploadTimestamp"
    sortOrder: SortOrder = DESC
    filter: FileFilterInput
    searchText: String
  ): [FileListItemView!]!

  getFileDetails(id: ID!): FileDetailView

  getUploadActivity(
    from: String
    to: String
    userId: String
  ): [DailyUploadActivity!]!
}

type DailyUploadActivity {
  date: String!
  count: Int!
  level: Int!
}
`;

const schema = buildSchema(schemaString);

// Define FileListItemView based on schema for mapping
type FileListItemViewGQL = {
  id: string;
  fileName: string;
  documentType?: string;
  fileType: string;
  processingStatus: string; // Should match PipelineStageStatus enum values
  uploadTimestamp: string;
  userTags?: string[];
  certainty?: number;
  distance?: number;
};


const rootValue = {
  searchFiles: ({
    limit = 10,
    offset = 0,
    sortBy = "uploadTimestamp",
    sortOrder = "DESC",
    filter,
    searchText,
  }: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    filter?: { documentTypes?: string[]; overallPipelineStatus_in?: string[] };
    searchText?: string;
  }): FileListItemViewGQL[] => {
    let results = [...mockMasterData];

    // Filtering
    if (searchText) {
      results = results.filter(file =>
        file.fileName.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filter?.documentTypes && filter.documentTypes.length > 0) {
      results = results.filter(file =>
        filter.documentTypes!.includes(file.documentType)
      );
    }
    if (filter?.overallPipelineStatus_in && filter.overallPipelineStatus_in.length > 0) {
      results = results.filter(file =>
        filter.overallPipelineStatus_in!.includes(file.processingStatus)
      );
    }

    // Sorting
    results.sort((a, b) => {
      let valA, valB;
      if (sortBy === "uploadTimestamp") {
        valA = new Date(a.uploadTimestamp).getTime();
        valB = new Date(b.uploadTimestamp).getTime();
      } else if (sortBy === "fileName") {
        valA = a.fileName.toLowerCase();
        valB = b.fileName.toLowerCase();
      } else {
        return 0; // No sort for other fields in this mock
      }

      if (valA < valB) return sortOrder === "ASC" ? -1 : 1;
      if (valA > valB) return sortOrder === "ASC" ? 1 : -1;
      return 0;
    });

    // Pagination
    const paginatedResults = results.slice(offset, offset + limit);

    // Map to FileListItemView
    return paginatedResults.map(file => ({
      id: file.id,
      fileName: file.fileName,
      documentType: file.documentType,
      fileType: file.fileType,
      processingStatus: file.processingStatus,
      uploadTimestamp: file.uploadTimestamp,
      userTags: file.userTags || [],
      certainty: file.certainty,
      distance: file.distance,
    }));
  },

  getFileDetails: ({ id }: { id: string }): FileDetailView | null => {
    const file = mockMasterData.find(f => f.id === id);
    if (!file) {
      return null;
    }

    // Construct FileDetailView from MockFileMasterData
    // Ensure relatedDocuments are also mapped to FileListItemView
    const relatedDocsView = file.relatedDocuments?.map(rd => ({
        id: rd.id!,
        fileName: rd.fileName!,
        documentType: rd.documentType,
        fileType: rd.fileType!,
        processingStatus: rd.processingStatus!,
        uploadTimestamp: rd.uploadTimestamp!,
        userTags: rd.userTags || [],
        certainty: rd.certainty,
        distance: rd.distance,
    })) || [];


    return {
      id: file.id,
      fileName: file.fileName,
      documentType: file.documentType,
      fileType: file.fileType, // Added this line
      perkeepFileRef: file.perkeepFileRef,
      previewImageUrl: file.previewImageUrl,
      processingHistory: file.processingHistory,
      userTags: file.userTags || [],
      relatedDocuments: relatedDocsView,
      structuredData: file.structuredData, // Fix 3: Simplified this line
      uploadTimestamp: file.uploadTimestamp,
      processingStatus: file.processingStatus,
    };
  },

  getUploadActivity: ({ from, to, userId }: { from?: string; to?: string; userId?: string }) => {
    const activities: { date: string; count: number; level: number }[] = [];
    const endDate = to ? new Date(to) : new Date();
    const startDate = from ? new Date(from) : new Date(new Date().setDate(endDate.getDate() - 365)); // Default to one year back

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = Math.floor(Math.random() * 101); // 0 to 100 uploads
      let level = 0;
      if (count > 60) level = 4;
      else if (count > 30) level = 3;
      else if (count > 10) level = 2;
      else if (count > 0) level = 1;

      activities.push({
        date: dateStr,
        count,
        level,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    // If from and to are provided, the loop already respects them.
    // If only from is provided, it goes from 'from' to today.
    // If only to is provided, it goes from 1 year before 'to' up to 'to'.
    // If neither, it's the last 365 days from today.
    return activities;
  },
};
// --- End Inserted GraphQL Setup ---

export async function POST(req: NextRequest) {
  try {
    const { query, variables } = await req.json();

    if (!query) {
      return NextResponse.json({ errors: [{ message: 'Query is missing' }] }, { status: 400 });
    }

    const result = await graphql({
      schema,
      source: query,
      rootValue,
      variableValues: variables,
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('GraphQL API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ errors: [{ message: errorMessage }] }, { status: 500 });
  }
}

// 添加 GET 方法以确认路由是否可访问 (可选，用于测试)
export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'GraphQL mock endpoint is active. Use POST for queries.' });
}