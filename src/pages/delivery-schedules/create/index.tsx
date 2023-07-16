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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createDeliverySchedule } from 'apiSdk/delivery-schedules';
import { Error } from 'components/error';
import { deliveryScheduleValidationSchema } from 'validationSchema/delivery-schedules';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { DeliveryScheduleInterface } from 'interfaces/delivery-schedule';

function DeliveryScheduleCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: DeliveryScheduleInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createDeliverySchedule(values);
      resetForm();
      router.push('/delivery-schedules');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<DeliveryScheduleInterface>({
    initialValues: {
      delivery_date: new Date(new Date().toDateString()),
      driver_id: (router.query.driver_id as string) ?? null,
    },
    validationSchema: deliveryScheduleValidationSchema,
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
            Create Delivery Schedule
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="delivery_date" mb="4">
            <FormLabel>Delivery Date</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.delivery_date ? new Date(formik.values?.delivery_date) : null}
                onChange={(value: Date) => formik.setFieldValue('delivery_date', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'driver_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
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
    entity: 'delivery_schedule',
    operation: AccessOperationEnum.CREATE,
  }),
)(DeliveryScheduleCreatePage);
