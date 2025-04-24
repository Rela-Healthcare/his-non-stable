import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Input} from '../../../../common/ui/input';
import {Button as CustomButton} from '../../../../common/ui/button';
import Select from '../../../../common/ui/select';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {Info, PencilIcon, TrashIcon} from 'lucide-react';
import TruncatedText from '../../../../common/TruncatedText';
import {formatPrice} from '../../../../utils/utils';

const EditableServiceTable = ({
  services = [],
  onChange,
  onDelete,
  onToggleSave,
  totalAmount,
  errors,
  serviceGroupListResponse = [],
  priorityListResponse = [],
}) => {
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollRef = useRef(null);
  const timeoutRef = useRef();
  const rowRefs = useRef([]);

  // Initialize row refs
  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, services.length);
  }, [services]);

  // Hide scroll hint after first scroll or after 10 seconds
  useEffect(() => {
    if (hasScrolled) {
      setShowScrollHint(false);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setShowScrollHint(false);
    }, 10000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [hasScrolled]);

  const handleScroll = useCallback(() => {
    if (!hasScrolled) {
      setHasScrolled(true);
    }
  }, [hasScrolled]);

  // Handle horizontal scroll with mouse wheel
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleWheelScroll = (event) => {
      if (event.deltaY === 0) return;
      event.preventDefault();
      scrollContainer.scrollLeft += event.deltaY;
    };

    scrollContainer.addEventListener('wheel', handleWheelScroll);
    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheelScroll);
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const getServiceGroupLabel = useCallback(
    (value) => {
      return (
        (serviceGroupListResponse || []).find(
          (option) => option.value === Number(value)
        )?.label || value
      );
    },
    [serviceGroupListResponse]
  );

  const getServiceLabel = useCallback((value, servicesListResponse) => {
    return (
      (servicesListResponse || []).find(
        (option) => option.value === Number(value)
      )?.label || value
    );
  }, []);

  const renderFieldWithError = useCallback(
    (fieldName, index, component) => {
      const errorKey = `${index}-${fieldName}`;
      const hasError = errors[errorKey];

      return (
        <div className="relative">
          {component}
          {hasError && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${errorKey}`}>{errors[errorKey]}</Tooltip>
              }>
              <div className="absolute -top-1 -right-1 bg-white z-10">
                <Info size={16} className="text-red-500 cursor-pointer" />
              </div>
            </OverlayTrigger>
          )}
        </div>
      );
    },
    [errors]
  );

  const scrollToElement = (element) => {
    if (!element || !scrollRef.current) return;

    const container = scrollRef.current;
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // Calculate positions considering the sticky action column
    const stickyColumnWidth = 120; // Match this with your actual sticky column width
    const scrollLeft = container.scrollLeft;
    const elementLeft = elementRect.left - containerRect.left + scrollLeft;
    const elementRight = elementRect.right - containerRect.left + scrollLeft;
    const containerWidth = containerRect.width - stickyColumnWidth; // Adjust for sticky column

    // If element is left of visible area
    if (elementLeft < scrollLeft) {
      container.scrollTo({
        left: elementLeft - 20, // Small offset
        behavior: 'smooth',
      });
    }
    // If element is right of visible area (accounting for sticky column)
    else if (elementRight > scrollLeft + containerWidth) {
      container.scrollTo({
        left: elementRight - containerWidth + 20,
        behavior: 'smooth',
      });
    }
  };

  const handleFocus = (e) => {
    scrollToElement(e.target);
  };

  const handleKeyDown = (e, index, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.currentTarget.closest('tr');
      const inputs = form?.querySelectorAll(
        'input, select, button:not([disabled])'
      );
      const currentIndex = Array.from(inputs || []).indexOf(e.currentTarget);

      if (currentIndex >= 0 && inputs && currentIndex < inputs.length - 1) {
        const nextInput = inputs[currentIndex + 1];
        nextInput.focus();
        scrollToElement(nextInput);
      }
    } else if (e.key === 'Tab') {
      setTimeout(() => {
        const activeElement = document.activeElement;
        if (activeElement && scrollRef.current.contains(activeElement)) {
          // Special handling for action buttons
          if (activeElement.closest('.sticky-actions')) {
            // Scroll all the way right for action buttons
            scrollRef.current.scrollTo({
              left: scrollRef.current.scrollWidth,
              behavior: 'smooth',
            });
          } else {
            scrollToElement(activeElement);
          }
        }
      }, 10);
    }
  };

  return (
    <div className="relative w-full">
      {/* Persistent scroll hint until user scrolls */}
      {showScrollHint && (
        <div className="absolute top-[-2rem] right-0 bg-gray-800 text-white text-sm px-3 py-1 rounded-md shadow-lg z-20 animate-fadeIn">
          👉 Scroll horizontally to view more columns →
        </div>
      )}

      <div className="relative">
        <div
          ref={scrollRef}
          className="overflow-x-auto border border-gray-300 rounded-md"
          style={{
            scrollbarColor: '#3b82f6 #f1f5f9',
            scrollbarWidth: 'thin',
          }}>
          <table className="min-w-[1200px] w-full table-auto bg-gray-100 rounded-md">
            <thead className="bg-gray-300 text-gray-800 font-semibold">
              <tr className="border-b border-gray-500">
                <th className="px-2 py-3 min-w-[160px] text-left">
                  Service Group
                </th>
                <th className="px-2 py-3 min-w-[160px] text-left">Service</th>
                <th className="px-2 py-3 min-w-[160px] text-left">Priority</th>
                <th className="px-2 py-3 min-w-[160px] text-left">
                  Discount Type
                </th>
                <th className="px-2 py-3 min-w-[160px] text-left">Discount</th>
                <th className="px-2 py-3 min-w-[160px] text-left">
                  Discount Reason
                </th>
                <th className="px-2 py-3 min-w-[160px] text-left">Amount</th>
                <th className="px-2 py-3 min-w-[160px] text-left">Remarks</th>
                <th className="px-2 py-3 text-center sticky right-0 bg-gray-300 z-20 min-w-[120px]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {services.map((service, index) => (
                <tr
                  key={`service-${index}`}
                  className="border-b hover:bg-gray-50 transition-colors"
                  aria-label={`Service row ${index + 1}`}
                  ref={(el) => (rowRefs.current[index] = el)}>
                  <td className="px-2 py-2 min-w-[160px]">
                    {renderFieldWithError(
                      'Service_Group',
                      index,
                      <>
                        {service.saved ? (
                          <TruncatedText
                            text={getServiceGroupLabel(service.Service_Group)}
                            maxLength={14}
                            className="font-semibold text-sm px-2"
                          />
                        ) : (
                          <Select
                            name="Service_Group"
                            isLabelNeeded={false}
                            value={service.Service_Group || ''}
                            onChange={(e) =>
                              onChange(index, 'Service_Group', e.target.value)
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(e, index, 'Service_Group')
                            }
                            onFocus={handleFocus}
                            placeholder="Service Group"
                            options={serviceGroupListResponse}
                            disabled={service.saved}
                            aria-label={`Service Group for row ${index + 1}`}
                            className={
                              errors[`${index}-Service_Group`]
                                ? 'border-red-500'
                                : ''
                            }
                          />
                        )}
                      </>
                    )}
                  </td>

                  <td className="px-2 py-2 min-w-[160px]">
                    {renderFieldWithError(
                      'Service',
                      index,
                      <>
                        {service.saved ? (
                          <TruncatedText
                            text={getServiceLabel(
                              service.Service,
                              service.servicesListResponse
                            )}
                            maxLength={14}
                            middleEllipsis={true}
                            className="font-semibold text-sm px-2"
                          />
                        ) : (
                          <Select
                            name="Service"
                            isLabelNeeded={false}
                            value={service.Service || ''}
                            onChange={(e) =>
                              onChange(index, 'Service', e.target.value)
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(e, index, 'Service')
                            }
                            onFocus={handleFocus}
                            placeholder="Service"
                            options={service.servicesListResponse || []}
                            disabled={service.saved}
                            aria-label={`Service for row ${index + 1}`}
                            className={
                              errors[`${index}-Service`] ? 'border-red-500' : ''
                            }
                          />
                        )}
                      </>
                    )}
                  </td>

                  <td className="px-2 py-2 min-w-[160px]">
                    {renderFieldWithError(
                      'Priority',
                      index,
                      <Select
                        name="Priority"
                        isLabelNeeded={false}
                        value={service.Priority || ''}
                        onChange={(e) =>
                          onChange(index, 'Priority', e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index, 'Priority')}
                        onFocus={handleFocus}
                        placeholder="Priority"
                        options={priorityListResponse}
                        disabled={service.saved}
                        aria-label={`Priority for row ${index + 1}`}
                        className={
                          errors[`${index}-Priority`] ? 'border-red-500' : ''
                        }
                      />
                    )}
                  </td>

                  <td className="px-2 py-2 min-w-[160px]">
                    {renderFieldWithError(
                      'Discount_Type',
                      index,
                      <Select
                        name="Discount_Type"
                        isLabelNeeded={false}
                        value={service.Discount_Type || ''}
                        onChange={(e) =>
                          onChange(index, 'Discount_Type', e.target.value)
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, 'Discount_Type')
                        }
                        onFocus={handleFocus}
                        placeholder="Discount Type"
                        options={[
                          {label: 'Percentage', value: 'Percentage'},
                          {label: 'Flat', value: 'Flat'},
                        ]}
                        disabled={service.saved}
                        aria-label={`Discount Type for row ${index + 1}`}
                        className={
                          errors[`${index}-Discount_Type`]
                            ? 'border-red-500'
                            : ''
                        }
                      />
                    )}
                  </td>

                  <td className="px-2 py-2 min-w-[160px]">
                    {renderFieldWithError(
                      'Discount',
                      index,
                      <Input
                        value={service.Discount || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            service.Discount_Type === 'Percentage' &&
                            value !== '' &&
                            !/^(100|[1-9]?[0-9])$/.test(value)
                          ) {
                            return;
                          }
                          onChange(index, 'Discount', value);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, index, 'Discount')}
                        onFocus={handleFocus}
                        placeholder="Discount"
                        disabled={service.saved}
                        aria-label={`Discount for row ${index + 1}`}
                        className={`bg-white ${
                          errors[`${index}-Discount`] ? 'border-red-500' : ''
                        }`}
                      />
                    )}
                  </td>

                  <td className="px-2 py-2 min-w-[160px]">
                    {renderFieldWithError(
                      'Discount_Reason',
                      index,
                      <Input
                        value={service.Discount_Reason || ''}
                        onChange={(e) =>
                          onChange(index, 'Discount_Reason', e.target.value)
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, 'Discount_Reason')
                        }
                        onFocus={handleFocus}
                        placeholder="Discount Reason"
                        disabled={service.saved}
                        aria-label={`Discount Reason for row ${index + 1}`}
                        className={`bg-white ${
                          errors[`${index}-Discount_Reason`]
                            ? 'border-red-500'
                            : ''
                        }`}
                      />
                    )}
                  </td>

                  <td className="px-2 py-2 min-w-[160px]">
                    {renderFieldWithError(
                      'Amount',
                      index,
                      <Input
                        value={formatPrice(service.Amount) || 0}
                        onChange={(e) =>
                          onChange(index, 'Amount', e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index, 'Amount')}
                        onFocus={handleFocus}
                        placeholder="Amount"
                        type="number"
                        disabled
                        aria-label={`Amount for row ${index + 1}`}
                        className={`bg-white ${
                          errors[`${index}-Amount`] ? 'border-red-500' : ''
                        }`}
                      />
                    )}
                  </td>

                  <td className="px-2 py-2 min-w-[160px]">
                    {renderFieldWithError(
                      'Remarks',
                      index,
                      <Input
                        value={service.Remarks || ''}
                        onChange={(e) =>
                          onChange(index, 'Remarks', e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index, 'Remarks')}
                        onFocus={handleFocus}
                        placeholder="Remarks"
                        disabled={service.saved}
                        aria-label={`Remarks for row ${index + 1}`}
                        className={`bg-white ${
                          errors[`${index}-Remarks`] ? 'border-red-500' : ''
                        }`}
                      />
                    )}
                  </td>

                  <td className="px-2 py-2 sticky right-0 bg-gray-100 z-10 min-w-[120px] sticky-actions">
                    <div className="flex justify-center gap-2">
                      {!service.saved ? (
                        <CustomButton
                          type="button"
                          onClick={() => onToggleSave(index)}
                          className="w-full bg-gray-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg"
                          size="md"
                          aria-label={`Save service row ${index + 1}`}>
                          Save
                        </CustomButton>
                      ) : (
                        <>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-edit-${index}`}>
                                Edit Service
                              </Tooltip>
                            }>
                            <CustomButton
                              type="button"
                              onClick={() => onToggleSave(index)}
                              className="border-1 bg-transparent border-gray-500 hover:border-gray-700 text-blue-500 hover:text-blue-700 font-bold py-3 px-3 rounded-lg"
                              size="sm"
                              aria-label={`Edit service row ${index + 1}`}>
                              <PencilIcon size={16} />
                            </CustomButton>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-delete-${index}`}>
                                Delete Service
                              </Tooltip>
                            }>
                            <CustomButton
                              type="button"
                              onClick={() => onDelete(index)}
                              className="border-1 bg-transparent border-gray-500 hover:bg-gray-700 text-red-500 hover:text-red-700 font-bold py-3 px-3 rounded-lg"
                              size="sm"
                              aria-label={`Delete service row ${index + 1}`}>
                              <TrashIcon size={16} />
                            </CustomButton>
                          </OverlayTrigger>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Custom scrollbar track */}
        <div className="h-2 bg-gray-200 rounded-b-md overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-b-md"
            style={{
              width: `${
                (scrollRef.current?.scrollLeft /
                  (scrollRef.current?.scrollWidth -
                    scrollRef.current?.clientWidth)) *
                100
              }%`,
              transition: 'width 0.2s ease-out',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(EditableServiceTable);
