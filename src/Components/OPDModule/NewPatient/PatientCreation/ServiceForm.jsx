import React, {useState, useCallback, useMemo} from 'react';
import {Container, Form} from 'react-bootstrap';
import {useDispatch} from 'react-redux';
import {
  fetchPackageList,
  fetchServicesList,
} from '../../../../store/Slices/dropdownSlice';
import {extractAmountFromString, formatPrice} from '../../../../utils/utils';
import EditableServiceTable from './EditableServiceTable';
import FormActionButtons from './FormActionButtons';

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

const ServiceInvoice = ({services, setServices, dropdownData, onSubmit}) => {
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return services.reduce((sum, service) => {
      const amt = parseFloat(service.Amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);
  }, [services]);

  // Handle field changes
  const handleChange = useCallback(
    async (index, field, e) => {
      const value = e?.target?.value ?? e;
      const updated = [...services];
      const currentService = {...updated[index]};

      currentService[field] = value;

      if (field === 'Service_Group') {
        if (value === 'Packages') {
          const response = await dispatch(fetchPackageList()).unwrap();
          currentService.servicesListResponse = response;
          currentService.Service = '';
        } else {
          const response = await dispatch(fetchServicesList(value)).unwrap();
          currentService.servicesListResponse = response;
          currentService.Service = '';
        }
      }

      if (field === 'Service') {
        const selectedService = currentService.servicesListResponse.find(
          (option) =>
            typeof option?.value === 'number'
              ? option.value === Number(value)
              : option.value === value
        );

        if (selectedService) {
          const rate = Number(extractAmountFromString(selectedService.label));
          currentService.Amount = rate;
          currentService.Actual_Amount = Math.max(rate, 0);
          currentService.ServiceName = selectedService.label;
        }
      }

      if (
        ['Discount_Type', 'Discount', 'Service'].includes(field) &&
        currentService.Discount_Type &&
        currentService.Service
      ) {
        const selectedService = currentService.servicesListResponse.find(
          (option) => option.value === Number(currentService.Service)
        );

        if (selectedService) {
          const originalAmount = Number(
            extractAmountFromString(selectedService.label)
          );
          const discountValue = parseFloat(currentService.Discount) || 0;
          let finalAmount = originalAmount;

          if (currentService.Discount_Type === 'Percentage') {
            finalAmount =
              originalAmount - (originalAmount * discountValue) / 100;
          } else if (currentService.Discount_Type === 'Flat') {
            finalAmount = originalAmount - discountValue;
          }

          currentService.Amount = Math.max(finalAmount, 0);
          currentService.Actual_Amount = Math.max(originalAmount, 0);
        }
      }

      updated[index] = currentService;
      setServices(updated);

      // Clear error for this field if it exists
      setErrors((prev) => {
        const newErrors = {...prev};
        delete newErrors[`${index}-${field}`];
        return newErrors;
      });
    },
    [services, setServices, dispatch]
  );

  // Toggle save/edit state
  const toggleSaveEdit = useCallback(
    (index) => {
      const updatedService = services[index];
      const requiredFields = Object.keys(initialService).filter(
        (key) =>
          key !== 'saved' && key !== 'totalAmount' && key !== 'ServiceName'
      );

      const newErrors = requiredFields.reduce((acc, key) => {
        if (!updatedService[key]) {
          if (
            key !== 'Discount_Type' &&
            key !== 'Discount_Reason' &&
            key !== 'Discount'
          ) {
            acc[`${index}-${key}`] = `${key.replace(/_/g, ' ')} is required.`;
          }
        }
        return acc;
      }, {});

      if (Object.keys(newErrors).length === 0) {
        const newServices = [...services];
        newServices[index].saved = !newServices[index].saved;

        // Add new empty service if this is the last one
        if (index === services.length - 1) {
          newServices.push({...initialService});
        }

        setServices(newServices);
      } else {
        setErrors(newErrors);
      }
    },
    [services, setServices]
  );

  // Delete a service
  const deleteService = useCallback(
    (index) => {
      setServices((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    },
    [setServices]
  );

  // Reset form
  const resetForm = useCallback(() => {
    setServices([{...initialService}]);
    setErrors({});
  }, [setServices]);

  const validateServices = useCallback((servicesToValidate) => {
    // Filter out unsaved services and validate only saved ones
    return servicesToValidate
      .filter((service) => service.saved)
      .reduce((acc, service, index) => {
        const {Service_Group, Service, Priority, Amount} = service;

        if (!Service_Group)
          acc[`${index}-Service_Group`] = 'Service Group is required';
        if (!Service) acc[`${index}-Service`] = 'Service is required';
        if (!Priority) acc[`${index}-Priority`] = 'Priority is required';
        if (!Amount || isNaN(Amount))
          acc[`${index}-Amount`] = 'Valid Amount is required';

        return acc;
      }, {});
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const newErrors = validateServices(services);
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const servicesToSubmit = services.filter((service) => service.saved);

        if (servicesToSubmit.length === 0) {
          setErrors({general: 'Please add and save at least one service'});
          return;
        }

        onSubmit(servicesToSubmit, e);
      }
    },
    [services, onSubmit, validateServices]
  );

  return (
    <Container className="px-2 md:px-6">
      <Form noValidate onSubmit={handleSubmit} className="pt-4">
        <EditableServiceTable
          services={services}
          setServices={setServices}
          serviceGroupListResponse={dropdownData.serviceGroupListResponse || []}
          priorityListResponse={dropdownData.priorityListResponse || []}
          packageListResponse={dropdownData.packageListResponse || []}
          onChange={handleChange}
          onDelete={deleteService}
          onToggleSave={toggleSaveEdit}
          totalAmount={totalAmount}
          errors={errors}
        />

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 mt-6">
          <div className="text-lg text-gray-600 font-semibold">
            Total Amount <span className="mx-2">:</span>
            <span className="font-bold text-black">{`₹ ${formatPrice(
              totalAmount
            )}`}</span>
          </div>
          <FormActionButtons onClear={resetForm} />{' '}
          {/* Clear and Save Button */}
        </div>
      </Form>
    </Container>
  );
};

export default React.memo(ServiceInvoice);
