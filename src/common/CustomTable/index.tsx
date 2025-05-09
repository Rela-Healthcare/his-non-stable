import React, {useState} from 'react';
import {Table, Button} from 'react-bootstrap';
import {TrashIcon, BookA, Eye} from 'lucide-react';
import TruncatedText from '../TruncatedText';

interface Column<T> {
  label: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
}

interface CustomTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowsPerPage?: number;
  tableName?: string;
  onPrimaryAction?: (item: T) => void;
  onView?: (item: T) => void;
  onBook?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export default function CustomTable<T>({
  data,
  columns,
  rowsPerPage = 10,
  tableName,
  onPrimaryAction,
  onView,
  onBook,
  onDelete,
}: CustomTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-4">
      <div className="table-responsive">
        <Table className="mt-2 mb-0" bordered hover responsive>
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              {columns.map((col) => (
                <th key={col.label} className="px-4 py-auto font-medium">
                  {col.label}
                </th>
              ))}
              {(onPrimaryAction || onView || onBook || onDelete) && (
                <th className="px-4 py-auto font-medium text-center">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr
                  key={index}
                  className="text-sm hover:bg-gray-50 transition-all duration-150">
                  {columns.map((col) => (
                    <td
                      key={String(col.accessor)}
                      className="px-4 py-3 text-gray-800">
                      {col.render
                        ? col.render(item)
                        : (item[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                  {(onPrimaryAction || onView || onBook || onDelete) && (
                    <td className="px-4 py-2">
                      <div className="flex justify-center items-center gap-2 flex-wrap">
                        {onPrimaryAction && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onPrimaryAction(item)}>
                            {tableName === 'Search Results'
                              ? 'Modify'
                              : 'Continue'}
                          </Button>
                        )}
                        <div className="flex justify-center items-center gap-x-1">
                          {onView && (
                            <TruncatedText
                              as="div"
                              tooltipText="View Record"
                              alwaysShowTooltip
                              text={
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => onView(item)}>
                                  <Eye size={17} />
                                </Button>
                              }
                            />
                          )}
                          {onBook && (
                            <TruncatedText
                              as="div"
                              tooltipText="Book Appointment"
                              alwaysShowTooltip
                              text={
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => onBook(item)}>
                                  <BookA size={17} />
                                </Button>
                              }
                            />
                          )}
                          {onDelete && (
                            <TruncatedText
                              as="div"
                              tooltipText="Remove record"
                              alwaysShowTooltip
                              text={
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => onDelete(item)}>
                                  <TrashIcon size={17} />
                                </Button>
                              }
                            />
                          )}
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-6 text-center text-gray-500 text-sm italic">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm rounded-md border ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
            }`}>
            Prev
          </button>

          {Array.from({length: totalPages}, (_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                onClick={() => changePage(page)}
                className={`px-3 py-1 text-sm rounded-md border ${
                  page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                }`}>
                {page}
              </button>
            );
          })}

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm rounded-md border ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
            }`}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
