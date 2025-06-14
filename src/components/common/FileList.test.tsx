import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileList from './FileList'; // Adjust path as necessary
import { FileListItemView } from '@/types/file'; // Adjust path as necessary

// Mock @apollo/client
const mockFetchFileDetailsForPreview = jest.fn(() =>
  Promise.resolve({ data: { getFileDetails: null }, loading: false, error: null })
);
jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useLazyQuery: jest.fn(() => [mockFetchFileDetailsForPreview, { loading: false, error: null, data: null }]),
}));

// Mock subframe/core
jest.mock('@subframe/core', () => ({
  // Keep existing icon mocks as jest.fn() for consistency
  FeatherEye: jest.fn(() => 'EyeIcon'),
  FeatherDownloadCloud: jest.fn(() => 'DownloadCloudIcon'),
  FeatherFile: jest.fn(() => 'FileIcon'),
  FeatherFileSpreadsheet: jest.fn(() => 'FileSpreadsheetIcon'),
  FeatherFileText: jest.fn(() => 'FileTextIcon'),
  FeatherCheck: jest.fn(() => 'CheckIcon'),
  FeatherClock: jest.fn(() => 'ClockIcon'),
  FeatherAlertOctagon: jest.fn(() => 'AlertOctagonIcon'),
  FeatherLoader: jest.fn(() => 'LoaderIcon'), // This is a Feather icon, also used as SubframeCore.Loader
  // Add mock for createTwClassNames
  createTwClassNames: jest.fn((classNames) => (key) => classNames.includes(key) ? key : ''),
  // Add mocks for other SubframeCore components that are causing issues
  IconWrapper: jest.fn(({ children }) => <div data-testid="icon-wrapper">{children}</div>),
  // Loader might be the same as FeatherLoader or a different component.
  // If it's different, it needs its own mock. Assuming it's a component:
  Loader: jest.fn(() => <div data-testid="loader">Loading...</div>),
}));

describe('FileList Component', () => {
  const mockFiles: FileListItemView[] = [
    {
      id: '1',
      fileName: 'document.pdf',
      fileType: 'PDF',
      uploadTimestamp: '2023-01-01T12:00:00Z',
      processingStatus: 'COMPLETED',
      userTags: ['important', 'work'],
      // Add other required fields from FileListItemView if any, with mock values
      size: 1024, // Example value
      lastModified: '2023-01-01T12:00:00Z', // Example value
      summary: 'This is a PDF document.', // Example value
    },
    {
      id: '2',
      fileName: 'spreadsheet.xlsx',
      fileType: 'XLSX',
      uploadTimestamp: '2023-01-02T14:30:00Z',
      processingStatus: 'PROCESSING',
      userTags: ['finance'],
      // Add other required fields
      size: 2048, // Example value
      lastModified: '2023-01-02T14:30:00Z', // Example value
      summary: 'This is an Excel spreadsheet.', // Example value
    },
  ];

  const mockOnView = jest.fn();
  const mockOnDownload = jest.fn();

  it('renders a list of files', () => {
    render(
      <FileList
        files={mockFiles}
        onView={mockOnView}
        onDownload={mockOnDownload}
      />
    );

    // Check if file names are rendered
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText('spreadsheet.xlsx')).toBeInTheDocument();

    // Check if upload timestamps are rendered (adjust format as needed based on actual output)
    expect(screen.getByText('2023-01-01T12:00:00Z')).toBeInTheDocument();
    expect(screen.getByText('2023-01-02T14:30:00Z')).toBeInTheDocument();

    // Check for status (text within the badge)
    expect(screen.getByText('已完成')).toBeInTheDocument(); // For COMPLETED status
    expect(screen.getByText('处理中')).toBeInTheDocument(); // For PROCESSING status
  });

  it('calls onView when "View" button is clicked', async () => {
    render(
      <FileList
        files={[mockFiles[0]]} // Render with one file for simplicity
        onView={mockOnView}
        onDownload={mockOnDownload}
      />
    );

    const viewButtons = screen.getAllByText('查看'); // "查看" is the text for View button
    expect(viewButtons[0]).toBeInTheDocument();
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(mockOnView).toHaveBeenCalledWith(mockFiles[0].id);
    });
  });

  it('calls onDownload when "Download" button is clicked', () => {
    render(
      <FileList
        files={[mockFiles[0]]} // Render with one file for simplicity
        onView={mockOnView} // mockOnView is reset for each test by Jest's default config or if manually configured
        onDownload={mockOnDownload}
      />
    );

    const downloadButtons = screen.getAllByText('下载'); // "下载" is the text for Download button
    expect(downloadButtons[0]).toBeInTheDocument();
    fireEvent.click(downloadButtons[0]); // onDownload is synchronous
    expect(mockOnDownload).toHaveBeenCalledWith(mockFiles[0].id);
  });

});
