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
import { getInventoryById, updateInventoryById } from 'apiSdk/inventories';
import { Error } from 'components/error';
import { inventoryValidationSchema } from 'validationSchema/inventories';
import { InventoryInterface } from 'interfaces/inventory';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

function InventoryEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<InventoryInterface>(
    () => (id ? `/inventories/${id}` : null),
    () => getInventoryById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: InventoryInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateInventoryById(id, values);
      mutate(updated);
      resetForm();
      router.push('/inventories');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<InventoryInterface>({
    initialValues: data,
    validationSchema: inventoryValidationSchema,
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
            Edit Inventory
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
            <FormControl id="product_name" mb="4" isInvalid={!!formik.errors?.product_name}>
              <FormLabel>Product Name</FormLabel>
              <Input
                type="text"
                name="product_name"
                value={formik.values?.product_name}
                onChange={formik.handleChange}
              />
              {formik.errors.product_name && <FormErrorMessage>{formik.errors?.product_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="quantity" mb="4" isInvalid={!!formik.errors?.quantity}>
              <FormLabel>Quantity</FormLabel>
              <NumberInput
                name="quantity"
                value={formik.values?.quantity}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('quantity', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.quantity && <FormErrorMessage>{formik.errors?.quantity}</FormErrorMessage>}
            </FormControl>
            <FormControl id="shipment_status" mb="4" isInvalid={!!formik.errors?.shipment_status}>
              <FormLabel>Shipment Status</FormLabel>
              <Input
                type="text"
                name="shipment_status"
                value={formik.values?.shipment_status}
                onChange={formik.handleChange}
              />
              {formik.errors.shipment_status && <FormErrorMessage>{formik.errors?.shipment_status}</FormErrorMessage>}
            </FormControl>

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
    entity: 'inventory',
    operation: AccessOperationEnum.UPDATE,
  }),
)(InventoryEditPage);
