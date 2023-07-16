import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getCustomerOrderById, updateCustomerOrderById } from 'apiSdk/customer-orders';
import { Error } from 'components/error';
import { customerOrderValidationSchema } from 'validationSchema/customer-orders';
import { CustomerOrderInterface } from 'interfaces/customer-order';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { DeliveryScheduleInterface } from 'interfaces/delivery-schedule';
import { getUsers } from 'apiSdk/users';
import { getDeliverySchedules } from 'apiSdk/delivery-schedules';

function CustomerOrderEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CustomerOrderInterface>(
    () => (id ? `/customer-orders/${id}` : null),
    () => getCustomerOrderById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CustomerOrderInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCustomerOrderById(id, values);
      mutate(updated);
      resetForm();
      router.push('/customer-orders');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CustomerOrderInterface>({
    initialValues: data,
    validationSchema: customerOrderValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Customer Order
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="order_date" mb="4">
              <FormLabel>Order Date</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.order_date ? new Date(formik.values?.order_date) : null}
                  onChange={(value: Date) => formik.setFieldValue('order_date', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'customer_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<DeliveryScheduleInterface>
              formik={formik}
              name={'delivery_schedule_id'}
              label={'Select Delivery Schedule'}
              placeholder={'Select Delivery Schedule'}
              fetcher={getDeliverySchedules}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.delivery_date}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'customer_order',
    operation: AccessOperationEnum.UPDATE,
  }),
)(CustomerOrderEditPage);
