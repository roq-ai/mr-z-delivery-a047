const mapping: Record<string, string> = {
  'customer-orders': 'customer_order',
  'delivery-schedules': 'delivery_schedule',
  inventories: 'inventory',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
