import { NextRequest, NextResponse } from 'next/server';
import { FileInfo } from '@/types/file';
import { buildSchema, graphql } from 'graphql';

const mockFileInfo: FileInfo[] = [
  {
    id: '101',
    name: '年度财务报告-2023-final.pdf',
    type: 'PDF',
    category: 'FINANCIAL_STATEMENT',
    uploadTime: '2024-07-15 09:30',
    status: 'COMPLETED',
    tags: ['财务', '年度报告'],
    previewUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/g5jou2tvabjzl7exoihk.png',
    structuredInfo: {
      reportYear: '2023',
      department: 'Finance'
    },
    size: '2.5 MB',
    uploader: '张三'
  },
  {
    id: '102',
    name: 'Q3营销计划.docx',
    type: 'DOCX',
    category: 'CONTRACT',
    uploadTime: '2024-07-14 14:00',
    status: 'COMPLETED',
    tags: ['营销', '计划'],
    previewUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/g5jou2tvabjzl7exoihk.png',
    size: '1.2 MB',
    uploader: '李四'
  },
  {
    id: '103',
    name: '新产品设计稿.png',
    type: 'PNG',
    category: 'OTHER',
    uploadTime: '2024-07-13 11:20',
    status: 'PENDING',
    tags: ['设计', '新产品'],
    previewUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/g5jou2tvabjzl7exoihk.png',
    size: '500 KB',
    uploader: '王五'
  },
  {
    id: '104',
    name: '客户合同-ABC公司.pdf',
    type: 'PDF',
    category: 'CONTRACT',
    uploadTime: '2024-07-12 16:45',
    status: 'ERROR',
    tags: ['合同', '客户'],
    previewUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/g5jou2tvabjzl7exoihk.png',
    size: '800 KB',
    uploader: '赵六'
  },
  {
    id: '105',
    name: '会议纪要-20240710.txt',
    type: 'TXT',
    category: 'OTHER',
    uploadTime: '2024-07-10 10:00',
    status: 'COMPLETED',
    tags: ['会议', '纪要'],
    previewUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/g5jou2tvabjzl7exoihk.png',
    size: '10 KB',
    uploader: '孙七'
  },
  {
    id: '106',
    name: '人力资源规划2024.xlsx',
    type: 'XLSX',
    category: 'OTHER',
    uploadTime: '2024-07-09 15:30',
    status: 'COMPLETED',
    tags: ['人力资源', '规划'],
    previewUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/g5jou2tvabjzl7exoihk.png',
    structuredInfo: {
      reportYear: '2024',
      department: 'HR'
    },
    size: '1.8 MB',
    uploader: '周八'
  },
  {
    id: '107',
    name: '研发项目进度报告.docx',
    type: 'DOCX',
    category: 'OTHER',
    uploadTime: '2024-07-08 13:25',
    status: 'PENDING',
    tags: ['研发', '项目管理'],
    previewUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/g5jou2tvabjzl7exoihk.png',
    size: '3.2 MB',
    uploader: '吴九'
  },
  {
    id: '108',
    name: '市场调研数据分析.csv',
    type: 'CSV',
    category: 'OTHER',
    uploadTime: '2024-07-07 16:15',
    status: 'COMPLETED',
    tags: ['市场', '数据分析'],
    previewUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/g5jou2tvabjzl7exoihk.png',
    structuredInfo: {
      department: 'Marketing',
      reportYear: '2024'
    },
    size: '4.5 MB',
    uploader: '郑十'
  },
  {
    id: '109',
    name: '纳税申报表2023.pdf',
    type: 'PDF',
    category: 'OTHER',
    uploadTime: '2024-07-06 11:40',
    status: 'COMPLETED',
    tags: ['财务', '税务'],
    previewUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/tax_preview.png',
    structuredInfo: {
      reportYear: '2023',
      department: 'Finance',
      taxpayerName: '示例公司',
      idNumber: '91310000XXXXXXXX1X',
      taxYear: '2023'
    },
    size: '1.6 MB',
    uploader: '陈十一'
  },
  {
    id: '110',
    name: '员工培训手册.pdf',
    type: 'PDF',
    category: 'OTHER',
    uploadTime: '2024-07-05 09:50',
    status: 'COMPLETED',
    tags: ['培训', 'HR'],
    previewUrl: 'https://res.cloudinary.com/subframe/image/upload/v1718999371/uploads/302/training_preview.png',
    size: '5.7 MB',
    uploader: '林十二'
  }
];

// --- Inserted GraphQL Setup ---
const schemaString = `
  type StructuredInfo {
    reportYear: String
    department: String
    taxpayerName: String
    idNumber: String
    taxYear: String
  }

  type FileInfo {
    id: ID!
    name: String!
    type: String!
    category: String
    uploadTime: String!
    status: String!
    tags: [String]
    previewUrl: String
    structuredInfo: StructuredInfo
    size: String
    uploader: String
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type FileEdge {
    cursor: String!
    node: FileInfo!
  }

  type FileConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    edges: [FileEdge!]!
  }

  type Query {
    files(first: Int, after: String): FileConnection!
    file(id: ID!): FileInfo
    recentFiles(limit: Int): [FileInfo!]! # Kept for compatibility if used elsewhere, though Get_Recent_Files_QUERY targets 'files'
  }
`;

const schema = buildSchema(schemaString);

const processFileForGraphQL = (file: FileInfo): any => {
  return {
    ...file,
    structuredInfo: file.structuredInfo || null,
  };
};

const rootValue = {
  files: ({ first, after }: { first?: number, after?: string }) => {
    let items = mockFileInfo.map(processFileForGraphQL);
    const totalCount = items.length;

    let startIndex = 0;
    if (after) {
      const afterIndex = items.findIndex(item => item.id === after);
      if (afterIndex !== -1) {
        startIndex = afterIndex + 1;
      }
    }

    const endIndex = first !== undefined ? startIndex + first : items.length;
    const paginatedItems = items.slice(startIndex, endIndex);

    const edges = paginatedItems.map((item, index) => ({
      cursor: item.id, // Using ID as cursor
      node: item,
    }));

    const hasNextPage = endIndex < totalCount;
    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

    return {
      totalCount,
      pageInfo: {
        hasNextPage,
        endCursor,
      },
      edges,
    };
  },
  file: ({ id }: { id: string }) => {
    const file = mockFileInfo.find(f => f.id === id);
    return file ? processFileForGraphQL(file) : null;
  },
  recentFiles: ({ limit = 5 }: { limit?: number }) => {
    // This resolver remains for the specific 'recentFiles' query if it's used directly.
    // The Get_Recent_Files_QUERY from fileQueries.ts targets the 'files' query with pagination.
    return mockFileInfo.slice(0, limit).map(processFileForGraphQL);
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