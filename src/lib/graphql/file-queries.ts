import { gql } from '@apollo/client';

export const QUERY_RECENT_FILES = gql`
  query QueryRecentFiles(
    $first: Int
  ) {
    files(first: $first) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          id
          name
          type
          uploadTime
          status
          tags
        }
      }
    }
  }
`;

export const QUERY_FILE_DETAILS = gql`
  query QueryFileDetails($id: ID!) {
    file(id: $id) {
      id
      name
      type
      category
      uploadTime
      status
      size
      uploader
      previewUrl
      structuredInfo {
        reportYear
        department
        taxpayerName
        idNumber
        taxYear
      }
      tags
    }
  }
`;