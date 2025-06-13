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
    file(id: $id) {
      id
      fileName
      documentType
      perkeepFileRef
      previewImageUrl
      processingHistory {
        status
        timestamp
        workerName
        errorMessage
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
          contractId
          contractType
          effectiveDate
          expirationDate
          partyA
          partyB
        }
        ... on InvoiceData {
          invoiceNumber
          invoiceDate
          dueDate
          totalAmount
          vendorName
          customerName
        }
        ... on BankSlipData {
          slipId
          paymentDate
          amount
          payerName
          receiverName
        }
      }
    }
  }
`;