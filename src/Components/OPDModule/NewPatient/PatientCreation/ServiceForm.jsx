import React, {useState, useEffect, useRef} from 'react';
import {Input} from '../../../../common/ui/input';
import {Button as CustomButton} from '../../../../common/ui/button';
import Select from '../../../../common/ui/select';
import {
  Container,
  Form,
  OverlayTrigger,
  Tooltip,
  Button,
} from 'react-bootstrap';
import {Info, PencilIcon, TrashIcon} from 'lucide-react';
import {useDispatch} from 'react-redux';
import {fetchServicesList} from '../../../../store/Slices/dropdownSlice';
import {formatPrice, truncateString} from '../../../../utils/utils';
import TruncatedText from '../../../../common/TruncatedText';

const initialService = {
  Service_Group: '',
  Service: '',
  ServiceName: '',
  Priority: '',
  Discount_Type: '',
  Discount: '',
  Discount_Reason: '',
  Actual_Amount: 0,
  Amount: '',
  Remarks: '',
  servicesListResponse: [],
  totalAmount: 0,
  saved: false,
};

function ServiceInvoice({services, setServices, dropdownData, onSubmit}) {
  const [errors, setErrors] = useState({});
  const [showTooltip, setShowTooltip] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0); // 🆕 Added
  const {serviceGroupListResponse, priorityListResponse} = dropdownData;
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleWheelScroll = (event) => {
      if (event.deltaY === 0) return;
      event.preventDefault();
      scrollContainer.scrollLeft += event.deltaY;
    };

    scrollContainer.addEventListener('wheel', handleWheelScroll);
    return () =>
      scrollContainer.removeEventListener('wheel', handleWheelScroll);
  }, []);

  useEffect(() => {
    const total = services.reduce((sum, service) => {
      const amt = parseFloat(service.Amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);
    setTotalAmount(total); // 🆕 Update totalAmount
  }, [services]); // 🆕 Recalculate when services change

  const handleChange = async (index, field, e) => {
    const {value} = e.target;

    const updated = [...services];
    // Clone the object to avoid mutation of frozen object
    const currentService = {...updated[index]};

    currentService[field] = value;

    if (field === 'Service_Group') {
      const response = await dispatch(fetchServicesList(value)).unwrap();
      currentService['Service'] = '';
      currentService['servicesListResponse'] = response;
    }

    if (field === 'Service') {
      const rate = Number(getServiceLabel(value, index)[1].split(':')[1]);
      currentService['Amount'] = rate;
      currentService['Actual_Amount'] = Math.max(rate, 0);
      const serviceName = services[index].servicesListResponse.find(
        (option) => {
          return option?.value === Number(value);
        }
      )?.label;
      currentService['ServiceName'] = serviceName ?? '';
    }

    if (
      ['Discount_Type', 'Discount', 'Service'].includes(field) &&
      currentService['Discount_Type'] &&
      currentService['Service']
    ) {
      const originalAmount = Number(
        getServiceLabel(currentService['Service'], index)[1].split(':')[1]
      );
      const discountValue = parseFloat(currentService['Discount']) || 0;
      let finalAmount = originalAmount;

      if (currentService['Discount_Type'] === 'Percentage') {
        finalAmount = originalAmount - (originalAmount * discountValue) / 100;
      } else if (currentService['Discount_Type'] === 'Flat') {
        finalAmount = originalAmount - discountValue;
      }

      currentService['Amount'] = Math.max(finalAmount, 0);
      currentService['Actual_Amount'] = Math.max(originalAmount, 0);
    }

    updated[index] = currentService;
    setServices(updated);

    const newErrors = {...errors};
    delete newErrors[`${index}-${field}`];
    setErrors(newErrors);
  };

  const toggleSaveEdit = (index) => {
    const updated = services[index];

    const newErrors = {};
    Object.keys(initialService).forEach((key) => {
      if (
        !updated[key] &&
        key !== 'saved' &&
        key !== 'totalAmount' &&
        key !== 'ServiceName'
      ) {
        newErrors[`${index}-${key}`] = `${key.replace(/_/g, ' ')} is required.`;
      }
    });
    if (Object.keys(newErrors).length === 0) {
      updated.saved = !updated.saved;
      if (services.length === index + 1) {
        setServices([...services, {...initialService}]);
      } else {
        setServices([...services]);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const deleteService = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  const resetForm = () => {
    setServices([{...initialService}]);
    setErrors({});
    setTotalAmount(0);
  };

  const getServiceGroupLabel = (value) => {
    const serviceGroupLabel =
      serviceGroupListResponse.find((option) => option.value === Number(value))
        ?.label || value;
    return serviceGroupLabel;
  };

  const getServiceLabel = (value, index) => {
    const serviceLabel =
      services[index]?.servicesListResponse.find(
        (option) => option.value === Number(value)
      )?.label || value;
    return serviceLabel;
  };

  const validateServices = (services) => {
    const newErrors = {};
    services.slice(0, -1).forEach((service, index) => {
      const {
        Service_Group,
        Service,
        Priority,
        Discount_Type,
        Discount,
        Amount,
      } = service;
      if (!Service_Group) {
        newErrors[`${index}-Service_Group`] = 'Required';
      }
      if (!Service) {
        newErrors[`${index}-Service`] = 'Required';
      }
      if (!Priority) {
        newErrors[`${index}-Priority`] = 'Required';
      }
      if (Discount_Type && !Discount) {
        newErrors[`${index}-Discount`] = 'Required';
      }
      if (Discount && !Amount) {
        newErrors[`${index}-Amount`] = 'Required';
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateServices(services);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(services, e);
    }
  };

  const renderFieldWithError = (fieldName, index, component) => {
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
  };

  return (
    <Container className="md:px-6 mt-4">
      <Form noValidate onSubmit={handleSubmit}>
        <div className="relative w-full">
          {showTooltip && (
            <div className="absolute top-[-2rem] right-0 bg-gray-800 text-white text-sm px-3 py-1 rounded-md shadow-lg z-20 animate-fadeIn">
              👉 Scroll to view more →
            </div>
          )}

          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 scroll-smooth border border-blue-300 rounded-md">
            <table className="min-w-[1200px] w-full table-auto bg-blue-100 rounded-md">
              <thead className="bg-blue-300 text-gray-800 font-semibold">
                <tr className="border-b border-gray-500">
                  <th className="px-2 py-3 min-w-[160px] text-left">
                    Service Group
                  </th>
                  <th className="px-2 py-3 min-w-[160px] text-left">Service</th>
                  <th className="px-2 py-3 min-w-[160px] text-left">
                    Priority
                  </th>
                  <th className="px-2 py-3 min-w-[160px] text-left">
                    Discount Type
                  </th>
                  <th className="px-2 py-3 min-w-[160px] text-left">
                    Discount
                  </th>
                  <th className="px-2 py-3 min-w-[160px] text-left">
                    Discount Reason
                  </th>
                  <th className="px-2 py-3 min-w-[160px] text-left">Amount</th>
                  <th className="px-2 py-3 min-w-[160px] text-left">Remarks</th>
                  <th className="px-2 py-3 text-center sticky right-0 bg-blue-300 z-20">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {services.map((service, index) => (
                  <tr key={index} className="border-b">
                    <td
                      className="px-2 py-2 min-w-full"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}>
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
                                handleChange(index, 'Service_Group', e)
                              }
                              placeholder="Service Group"
                              options={serviceGroupListResponse}
                              disabled={service.saved}
                              className={`${
                                errors[`${index}-Service_Group`]
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            />
                          )}
                        </>
                      )}
                    </td>

                    <td
                      className="px-2 py-2 min-w-[160px]"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}>
                      {renderFieldWithError(
                        'Service',
                        index,
                        <>
                          {service.saved ? (
                            <TruncatedText
                              text={getServiceLabel(service.Service, index)}
                              maxLength={14}
                              className="font-semibold text-sm px-2"
                            />
                          ) : (
                            <Select
                              name="Service"
                              isLabelNeeded={false}
                              value={service.Service || ''}
                              onChange={(e) =>
                                handleChange(index, 'Service', e)
                              }
                              placeholder="Service"
                              options={service.servicesListResponse || []}
                              disabled={service.saved}
                              className={`${
                                errors[`${index}-Service`]
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            />
                          )}
                        </>
                      )}
                    </td>

                    <td
                      className="px-2 py-2 min-w-[160px]"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}>
                      {renderFieldWithError(
                        'Priority',
                        index,
                        <Select
                          name="Priority"
                          isLabelNeeded={false}
                          value={service.Priority || ''}
                          onChange={(e) => handleChange(index, 'Priority', e)}
                          placeholder="Priority"
                          options={priorityListResponse}
                          disabled={service.saved}
                          className={`${
                            errors[`${index}-Priority`] ? 'border-red-500' : ''
                          }`}
                        />
                      )}
                    </td>

                    <td
                      className="px-2 py-2 min-w-[160px]"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}>
                      {renderFieldWithError(
                        'Discount_Type',
                        index,
                        <Select
                          name="Discount_Type"
                          isLabelNeeded={false}
                          value={service.Discount_Type || ''}
                          onChange={(e) =>
                            handleChange(index, 'Discount_Type', e)
                          }
                          placeholder="Discount Type"
                          options={[
                            {label: 'Percentage', value: 'Percentage'},
                            {label: 'Flat', value: 'Flat'},
                          ]}
                          disabled={service.saved}
                          className={`${
                            errors[`${index}-Discount_Type`]
                              ? 'border-red-500'
                              : ''
                          }`}
                        />
                      )}
                    </td>

                    <td
                      className="px-2 py-2 min-w-[160px]"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}>
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
                              return; // Prevent invalid input
                            }
                            handleChange(index, 'Discount', e);
                          }}
                          placeholder="Discount"
                          disabled={service.saved}
                          className={`bg-white ${
                            errors[`${index}-Discount`] ? 'border-red-500' : ''
                          }`}
                        />
                      )}
                    </td>

                    <td
                      className="px-2 py-2 min-w-[160px]"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}>
                      {renderFieldWithError(
                        'Discount_Reason',
                        index,
                        <Input
                          value={service.Discount_Reason || ''}
                          onChange={(e) =>
                            handleChange(index, 'Discount_Reason', e)
                          }
                          placeholder="Discount Reason"
                          disabled={service.saved}
                          className={`bg-white ${
                            errors[`${index}-Discount_Reason`]
                              ? 'border-red-500'
                              : ''
                          }`}
                        />
                      )}
                    </td>

                    <td
                      className="px-2 py-2 min-w-[160px]"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}>
                      {renderFieldWithError(
                        'Amount',
                        index,
                        <Input
                          value={formatPrice(service.Amount) || 0}
                          onChange={(e) => handleChange(index, 'Amount', e)}
                          placeholder="Amount"
                          type="number"
                          disabled
                          className={`bg-white ${
                            errors[`${index}-Amount`] ? 'border-red-500' : ''
                          }`}
                        />
                      )}
                    </td>

                    <td
                      className="px-2 py-2 min-w-[160px]"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}>
                      {renderFieldWithError(
                        'Remarks',
                        index,
                        <Input
                          value={service.Remarks || ''}
                          onChange={(e) => handleChange(index, 'Remarks', e)}
                          placeholder="Remarks"
                          disabled={service.saved}
                          className={`bg-white ${
                            errors[`${index}-Remarks`] ? 'border-red-500' : ''
                          }`}
                        />
                      )}
                    </td>

                    <td className="px-2 py-2 sticky right-0 bg-blue-100 z-10 text-center min-w-[100px]">
                      <div className="flex justify-center gap-2">
                        {!service.saved ? (
                          <CustomButton
                            type="button"
                            onClick={() => toggleSaveEdit(index)}
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                            size="md">
                            {'Save Service'}
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
                                onClick={() => toggleSaveEdit(index)}
                                className="border-1 bg-transparent border-blue-500 hover:border-blue-700 text-blue-500 hover:text-blue-700 font-bold py-3 px-3 rounded-lg"
                                size="sm">
                                <PencilIcon />
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
                                onClick={() => deleteService(index)}
                                className="border-1 bg-transparent border-blue-500 hover:bg-blue-700 text-red-500 hover:text-red-700 font-bold py-3 px-3 rounded-lg"
                                size="sm">
                                <TrashIcon />
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

          {/* 🆕 Show Total */}
          <div className="p-2 mt-3 flex justify-between items-center border-t-2 border-slate-200 ">
            <div className="text-[1.1rem] text-slate-500 font-semibold">
              Total Amount:{' '}
              <span className="font-bold text-black">{`₹ ${formatPrice(
                totalAmount
              )}`}</span>
            </div>
            <div>
              <Button
                variant="primary"
                type="button"
                size="md"
                onClick={resetForm}>
                Clear
              </Button>
              <Button variant="primary" type="submit" size="md">
                Save & Continue
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </Container>
  );
}

export default ServiceInvoice;
