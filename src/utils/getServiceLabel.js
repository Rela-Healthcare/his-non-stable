import {fetchServicesList} from '../store/Slices/dropdownSlice';

export async function getServiceLabel(dispatch, serviceGroupId, serviceId) {
  try {
    const servicesList = await dispatch(
      fetchServicesList(serviceGroupId)
    ).unwrap();

    const service = (servicesList || []).find(
      (option) => option.value === Number(serviceId)
    );

    return service?.label || String(serviceId);
  } catch (error) {
    console.error('Failed to fetch service label:', error);
    return String(serviceId);
  }
}
