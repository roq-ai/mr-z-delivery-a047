import { CustomerOrderInterface } from 'interfaces/customer-order';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface DeliveryScheduleInterface {
  id?: string;
  delivery_date: any;
  driver_id: string;
  created_at?: any;
  updated_at?: any;
  customer_order?: CustomerOrderInterface[];
  user?: UserInterface;
  _count?: {
    customer_order?: number;
  };
}

export interface DeliveryScheduleGetQueryInterface extends GetQueryInterface {
  id?: string;
  driver_id?: string;
}
