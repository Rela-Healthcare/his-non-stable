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
  onRowAction?: (item: T) => void;
  rowsPerPage?: number;
  tableName?: string;
}

export default function CustomTable<T>({
  data,
  columns,
  onRowAction,
  rowsPerPage = 10,
  tableName,
}: CustomTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <div className="table-responsive">
        <Table className="mt-2 mb-0">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              {columns.map((col) => (
                <th key={col.label} className="px-4 py-3 font-medium">
                  {col.label}
                </th>
              ))}
              {onRowAction && (
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr key={index} className="text-sm hover:bg-gray-50 transition">
                  {columns.map((col) => (
                    <td
                      key={String(col.accessor)}
                      className="px-4 py-3 text-gray-800">
                      {col.render
                        ? col.render(item)
                        : (item[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                  {onRowAction && (
                    <td className="py-auto px-auto">
                      <div className="flex justify-center items-center">
                        <Button
                          variant="primary"
                          className="text-white font-medium py-1 px-3 text-sm"
                          onClick={() => {
                            tableName === 'Search Results'
                              ? console.log(item)
                              : onRowAction(item);
                          }}>
                          {tableName === 'Search Results'
                            ? 'Modify'
                            : 'continue'}
                        </Button>
                        {tableName === 'Search Results' && (
                          <>
                            <TruncatedText
                              text={
                                <Button
                                  variant="outline-primary"
                                  className="text-blue-600 font-medium py-1 px-2 text-sm hover:text-blue-100"
                                  onClick={() => console.log('view')}>
                                  <Eye size={17} />
                                </Button>
                              }
                              as={'div'}
                              alwaysShowTooltip
                              tooltipText={'View Record'}
                              className="mr-1"
                            />
                            <TruncatedText
                              text={
                                <Button
                                  variant="outline-primary"
                                  className="text-blue-600 font-medium py-1 px-2 text-sm hover:text-blue-100"
                                  onClick={() =>
                                    console.log('book appointment')
                                  }>
                                  <BookA size={17} />
                                </Button>
                              }
                              as={'div'}
                              alwaysShowTooltip
                              tooltipText={'Book Appointment'}
                            />
                          </>
                        )}
                        {tableName === 'Inprogress Registration' && (
                          <TruncatedText
                            text={
                              <Button
                                variant="outline-danger"
                                className="font-medium py-1 px-2 text-sm text-rose-700 hover:text-rose-100"
                                onClick={() => console.log('remove')}>
                                <TrashIcon size={17} />
                              </Button>
                            }
                            as={'div'}
                            alwaysShowTooltip
                            tooltipText={'Remove patient from my bin'}
                          />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (onRowAction ? 1 : 0)}
                  className="px-4 py-6 text-center text-gray-500 text-sm italic">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination bottom right */}
      <div className="flex justify-end mt-4">
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm rounded-md border ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
            } transition`}>
            Prev
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages).keys()].map((page) => {
            const pageNum = page + 1;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 text-sm rounded-md border transition ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                }`}>
                {pageNum}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm rounded-md border ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
            } transition`}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
