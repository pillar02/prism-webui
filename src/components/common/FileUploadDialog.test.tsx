import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUploadDialog from './FileUploadDialog'; // Adjust path as necessary

// Mock @subframe/core icons used by FileUploadDialog and its child components (Button, IconButton, etc.)
// This is a consolidated mock. If specific tests need more detailed icon behavior, this can be adjusted.
jest.mock('@subframe/core', () => ({
  FeatherX: jest.fn(() => <svg data-testid="feather-x" />),
  FeatherUploadCloud: jest.fn(() => <svg data-testid="feather-upload-cloud" />),
  FeatherPlus: jest.fn(() => <svg data-testid="feather-plus" />),
  FeatherFileText: jest.fn(() => <svg data-testid="feather-file-text" />),
  FeatherTable: jest.fn(() => <svg data-testid="feather-table" />),
  IconWrapper: jest.fn(({ children }) => <div data-testid="icon-wrapper">{children}</div>),
  Loader: jest.fn(() => <div data-testid="loader">Loading...</div>),
  createTwClassNames: jest.fn(() => (...args) => args.flat().filter(Boolean).join(' ')), // Corrected: returns a function
  // Progress is mocked directly via jest.mock('@/ui/components/Progress') below
}));

// Mock UI components that might be too complex or have their own side effects not relevant here.
// DialogLayout is crucial for open/close, so we'll mock its behavior simply.
jest.mock('@/ui/layouts/DialogLayout', () => ({
  DialogLayout: jest.fn(({ open, onOpenChange, children }) => {
    if (!open) return null;
    return (
      <div data-testid="dialog-layout">
        {children}
        <button data-testid="internal-close-button" onClick={() => onOpenChange(false)}>Close</button>
      </div>
    );
  }),
}));

// Mock the Progress component from the UI library directly
jest.mock('@/ui/components/Progress', () => ({
  Progress: jest.fn(({ value }) => (
    <div data-testid="mock-progress" role="progressbar" aria-valuenow={value}>
      Mock Progress at {value}%
    </div>
  )),
}));

describe('FileUploadDialog Component', () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    mockOnOpenChange.mockClear();
  });

  it('does not render when open is false', () => {
    render(<FileUploadDialog open={false} onOpenChange={mockOnOpenChange} />);
    expect(screen.queryByTestId('dialog-layout')).not.toBeInTheDocument();
  });

  it('renders when open is true', () => {
    render(<FileUploadDialog open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByTestId('dialog-layout')).toBeInTheDocument();
    // More specific query for the dialog title
    expect(screen.getByText((content, element) =>
      element?.tagName.toLowerCase() === 'span' &&
      element.classList.contains('text-heading-2') &&
      content === '选择文件'
    )).toBeInTheDocument();
  });

  it('calls onOpenChange when the main close button (mocked via IconButton) is clicked', () => {
    render(<FileUploadDialog open={true} onOpenChange={mockOnOpenChange} />);
    // The IconButton with FeatherX is the primary close button.
    // Its onClick directly calls onOpenChange(false).
    // Let's find it by its role or testid if IconButton gives one.
    // Assuming IconButton renders a button role.
    const closeButtons = screen.getAllByRole('button');
    // The first button is likely the one in DialogLayout's mock. The actual X button.
    // Let's find the one with the FeatherX icon mock.
    const actualCloseButton = screen.getAllByTestId('feather-x')[0].closest('button');
    if (actualCloseButton) {
      fireEvent.click(actualCloseButton);
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    } else {
      throw new Error("Could not find the actual close button with FeatherX icon");
    }
  });

  it('renders the main title "选择文件"', () => {
    render(<FileUploadDialog open={true} onOpenChange={mockOnOpenChange} />);
    // This also checks the main title "选择文件" in the previous test.
    // Adding a specific test for it.
    expect(screen.getByText((content, element) =>
      element?.tagName.toLowerCase() === 'span' &&
      element.classList.contains('text-heading-2') &&
      content === '选择文件'
    )).toBeInTheDocument();
  });

  it('renders the dropzone content', () => {
    render(<FileUploadDialog open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByTestId('feather-upload-cloud')).toBeInTheDocument();
    expect(screen.getByText('拖拽文件到这里或点击选择')).toBeInTheDocument();
    expect(screen.getByText('支持 PDF、DOCX、XLSX、CSV 等格式')).toBeInTheDocument();
    // Adjust button query due to potential "Loading..." prefix from default Button mock behavior
    expect(screen.getByRole('button', { name: /选择文件/i })).toBeInTheDocument();
  });

  it('renders the "uploading" section title and "取消全部" button', () => {
    render(<FileUploadDialog open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByText('正在上传 (3)')).toBeInTheDocument();
    // Adjust button query
    expect(screen.getByRole('button', { name: /取消全部/i })).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<FileUploadDialog open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByRole('columnheader', { name: '文件名' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '大小' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '进度' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '操作' })).toBeInTheDocument();
  });

  it('renders hardcoded file rows', () => {
    render(<FileUploadDialog open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByText('Q4_Financial_Report.pdf')).toBeInTheDocument();
    expect(screen.getByText('2.4 MB')).toBeInTheDocument();

    expect(screen.getByText('Tax_Records_2023.pdf')).toBeInTheDocument();
    expect(screen.getByText('1.8 MB')).toBeInTheDocument();

    expect(screen.getByText('Revenue_Analysis.xlsx')).toBeInTheDocument();
    expect(screen.getByText('856 KB')).toBeInTheDocument();

    // Check for progress bars (Progress component is now mocked directly)
    const progressBars = screen.getAllByTestId('mock-progress');
    expect(progressBars.length).toBeGreaterThanOrEqual(3);
    expect(progressBars[0]).toHaveAttribute('aria-valuenow', '75');
    expect(progressBars[0]).toHaveTextContent('Mock Progress at 75%');
    expect(progressBars[1]).toHaveAttribute('aria-valuenow', '45');
    expect(progressBars[2]).toHaveAttribute('aria-valuenow', '25');

    // Check for cancel buttons for each row (IconButtons with FeatherX)
    // There will be one main close button + 3 row cancel buttons + potentially one in "取消全部"
    const featherXIcons = screen.getAllByTestId('feather-x');
    // Expecting at least 3 for rows + 1 for dialog close + 1 for "取消全部" = 5
    expect(featherXIcons.length).toBeGreaterThanOrEqual(3+1+1);
  });

  // Note: Testing actual file drop/selection and upload progress is out of scope
  // for this component's unit test as it would require significant mocking of
  // browser APIs, File objects, and potentially XHR/fetch.
  // The internal "选择文件" and "取消全部" buttons have empty onClick handlers,
  // so testing their invocation doesn't add much value without further implementation.
});
