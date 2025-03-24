import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  serviceList: [],
  totalAmount: 0,
  totalItems: 0,
  isDiscountApplied: false,
  netAmount: 0,
};

export const serviceListSlice = createSlice({
  name: "serviceList",
  initialState,
  reducers: {
    addItemsInServiceCart: (state, action) => {
      const {
        ServiceID,
        Unit,
        Rate,
        DiscountType,
        Discount,
        Amount,
        PriorityType,
        Priority,
        Remarks,
        ServiceGroup,
        Service,
      } = action.payload;

      const existingService = state.serviceList.find(
        (value) => value.ServiceID === ServiceID
      );

      if (existingService) {
        const validity = window.confirm(
          "Service has already been added. Click 'OK' to continue or 'Cancel'."
        );
        if (validity) {
          state.serviceList.push({
            ServiceID,
            Unit,
            Rate,
            DiscountType,
            Discount,
            Amount,
            PriorityType: PriorityType.toString(),
            Remarks,
            Priority,
            ServiceGroup,
            Service,
          });
        }
      } else {
        state.serviceList.push({
          ServiceID,
          Unit,
          Rate,
          DiscountType,
          Discount,
          Amount,
          PriorityType,
          Remarks,
          Priority,
          ServiceGroup,
          Service,
        });
      }

      // Recalculate total amount and items
      state.totalAmount = state.serviceList.reduce(
        (total, service) => total + service.Amount,
        0
      );
      state.totalItems = state.serviceList.reduce(
        (total, item) => total + item.Unit,
        0
      );
    },

    updateServiceList: (state, action) => {
      const { netAmount } = action.payload;
      state.netAmount = netAmount;
    },

    applyFinalDiscount: (state, action) => {
      const { discountType, discountValue } = action.payload;
      state.serviceList = state.serviceList.map((service) => {
        const baseAmount = service.Rate * service.Unit;
        const discountAmount =
          discountType === "P"
            ? (baseAmount * discountValue) / 100
            : discountValue;
        return {
          ...service,
          Discount: discountValue,
          DiscountType: discountType,
          Amount: Math.max(baseAmount - discountAmount, 0),
        };
      });
    },

    resetItemsInServiceCart: (state) => {
      state.serviceList = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      state.isDiscountApplied = false;
      state.netAmount = 0; 
    },

    deleteItemsInServiceCart: (state, action) => {
      const { index } = action.payload;
      state.serviceList.splice(index, 1);

      // Recalculate total amount and items
      state.totalAmount = state.serviceList.reduce(
        (total, service) => total + service.Amount,
        0
      );
      state.totalItems = state.serviceList.reduce(
        (total, item) => total + item.Unit,
        0
      );
    },
  },
});

export const {
  addItemsInServiceCart,
  applyFinalDiscount,
  resetItemsInServiceCart,
  deleteItemsInServiceCart,
  updateServiceList,
} = serviceListSlice.actions;

export default serviceListSlice.reducer;
