import React from 'react';
import {formatPrice} from '../../../../../utils/utils';
import {getConvertPercentageToDecimal} from '../../../../../utils/PaymentUtil';
import TruncatedText from '../../../../../common/TruncatedText';

interface ServiceDetail {
  ServiceName: string;
  Discount: number;
  Discount_Type: 'Percentage' | 'Flat';
  Amount: number;
  Actual_Amount: number;
}
interface ServicesTableProps {
  services: ServiceDetail[];
}

export const ServicesTable: React.FC<ServicesTableProps> = ({services}) => {
  return (
    <div className="border-b-2 border-slate-200 pb-2 mt-3">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Services</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border">
          <thead className="sticky top-0 z-10 block bg-slate-200">
            <tr className="table w-full m-0 border-0 table-fixed">
              <th className="border px-1 py-0 text-left w-6/12">Service</th>
              <th className="border px-1 py-0 text-left w-3/12">
                Discount (₹)
              </th>
              <th className="border px-1 py-0 text-left w-3/12">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="block max-h-[20vh] overflow-y-auto w-full">
            {services.slice(0, -1).length > 0 ? (
              services.slice(0, -1).map((service, index) => (
                <tr key={index} className="table m-0 w-full table-fixed">
                  <td className="border px-1 w-6/12">
                    <TruncatedText
                      text={service.ServiceName}
                      maxLength={30}
                      middleEllipsis={true}
                      className="font-semibold text-sm px-2"
                    />
                  </td>
                  <td className="border px-1 w-3/12">
                    {service.Discount_Type === 'Percentage'
                      ? `${service.Discount ?? 0}% ( ₹${
                          service.Discount &&
                          service?.Actual_Amount &&
                          getConvertPercentageToDecimal(
                            service?.Discount,
                            service?.Actual_Amount
                          ).toFixed(2)
                        } )`
                      : service.Discount_Type === 'Flat'
                      ? `₹${service.Discount ?? 0}`
                      : '—'}
                  </td>
                  <td className="border px-1 w-3/12 font-medium">
                    <TruncatedText
                      text={`₹${formatPrice(service.Amount)}`}
                      alwaysShowTooltip={true}
                      tooltipText={`without discount: ₹${formatPrice(
                        service?.Actual_Amount
                      )}`}
                      maxLength={30}
                      middleEllipsis={true}
                      className="font-semibold text-sm px-2"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-1">
                  No services available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
