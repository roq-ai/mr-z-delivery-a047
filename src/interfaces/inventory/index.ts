import { GetQueryInterface } from 'interfaces';

export interface InventoryInterface {
  id?: string;
  product_name: string;
  quantity: number;
  shipment_status: string;
  created_at?: any;
  updated_at?: any;

  _count?: {};
}

export interface InventoryGetQueryInterface extends GetQueryInterface {
  id?: string;
  product_name?: string;
  shipment_status?: string;
}
