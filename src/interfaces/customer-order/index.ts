import { UserInterface } from 'interfaces/user';
import { DeliveryScheduleInterface } from 'interfaces/delivery-schedule';
import { GetQueryInterface } from 'interfaces';

export interface CustomerOrderInterface {
  id?: string;
  customer_id: string;
  order_date: any;
  delivery_schedule_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  delivery_schedule?: DeliveryScheduleInterface;
  _count?: {};
}

export interface CustomerOrderGetQueryInterface extends GetQueryInterface {
  id?: string;
  customer_id?: string;
  delivery_schedule_id?: string;
}
