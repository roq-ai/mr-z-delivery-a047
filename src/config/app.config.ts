interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Business Owner'],
  customerRoles: [],
  tenantRoles: ['Business Owner', 'Delivery Manager', 'Inventory Manager', 'Customer Service Representative'],
  tenantName: 'Organization',
  applicationName: 'Mr.Z Delivery',
  addOns: ['notifications', 'chat'],
};
