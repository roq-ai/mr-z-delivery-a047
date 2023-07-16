import * as yup from 'yup';

export const inventoryValidationSchema = yup.object().shape({
  product_name: yup.string().required(),
  quantity: yup.number().integer().required(),
  shipment_status: yup.string().required(),
});
