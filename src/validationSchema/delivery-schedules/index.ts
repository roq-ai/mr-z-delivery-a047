import * as yup from 'yup';

export const deliveryScheduleValidationSchema = yup.object().shape({
  delivery_date: yup.date().required(),
  driver_id: yup.string().nullable().required(),
});
