import axios from 'axios';
import queryString from 'query-string';
import { DeliveryScheduleInterface, DeliveryScheduleGetQueryInterface } from 'interfaces/delivery-schedule';
import { GetQueryInterface } from '../../interfaces';

export const getDeliverySchedules = async (query?: DeliveryScheduleGetQueryInterface) => {
  const response = await axios.get(`/api/delivery-schedules${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createDeliverySchedule = async (deliverySchedule: DeliveryScheduleInterface) => {
  const response = await axios.post('/api/delivery-schedules', deliverySchedule);
  return response.data;
};

export const updateDeliveryScheduleById = async (id: string, deliverySchedule: DeliveryScheduleInterface) => {
  const response = await axios.put(`/api/delivery-schedules/${id}`, deliverySchedule);
  return response.data;
};

export const getDeliveryScheduleById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/delivery-schedules/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDeliveryScheduleById = async (id: string) => {
  const response = await axios.delete(`/api/delivery-schedules/${id}`);
  return response.data;
};
