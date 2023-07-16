import * as yup from 'yup';

export const customerOrderValidationSchema = yup.object().shape({
  order_date: yup.date().required(),
  customer_id: yup.string().nullable().required(),
  delivery_schedule_id: yup.string().nullable().required(),
});
