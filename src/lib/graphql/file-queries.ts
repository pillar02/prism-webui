import { gql } from '@apollo/client';

export const searchFiles = gql`
  query searchFiles(
    $limit: Int
    $offset: Int
    $sortBy: String
    $sortOrder: SortOrder
    $filter: FileFilterInput
    $searchText: String
  ) {
    searchFiles(
      limit: $limit
      offset: $offset
      sortBy: $sortBy
      sortOrder: $sortOrder
      filter: $filter
      searchText: $searchText
    ) {
      id
      fileName
      documentType
      fileType
      processingStatus
      uploadTimestamp
      userTags
      certainty
      distance
    }
  }
`;

export const getFileDetails = gql`
  query getFileDetails($id: ID!) {
    getFileDetails(id: $id) { # Changed root operation
      id
      fileName
      documentType
      fileType # Added this line
      uploadTimestamp # Added
      processingStatus # Added
      perkeepFileRef
      previewImageUrl
      processingHistory {
        fppId # Added
        batchId # Added
        overallPipelineStatus # Added
        perkeepUploadStatus # Added
        ocrAnalysisStatus # Added
        ocr2VectorDBStatus # Added
        vectorDB2AnalyticsStatus # Added
        lastUpdatedTimestamp # Added
      }
      userTags
      relatedDocuments {
        id
        fileName
        documentType
        fileType
        processingStatus
        uploadTimestamp
        userTags
        certainty
        distance
      }
      structuredData {
        ... on ContractData {
          contractNumber # Renamed from contractId
          contractName # Renamed from contractType
          partyA
          partyB
          totalAmount # Added
          currency # Added
          effectiveDate
          expirationDate
        }
        ... on InvoiceData {
          invoiceNumber
          invoiceCode # Added
          invoiceType # Added
          issuerName # Renamed from vendorName
          recipientName # Renamed from customerName
          totalAmount
          taxAmount # Added
          amountExcludingTax # Added
          invoiceDate
          lineItemsJson # Added
        }
        ... on BankSlipData {
          payerName
          payerAccount # Added
          payerBank # Added
          payeeName # Renamed from receiverName
          payeeAccount # Added
          payeeBank # Added
          paymentAmount # Renamed from amount
          paymentDate
          remarks # Added
        }
      }
    }
  }
`;