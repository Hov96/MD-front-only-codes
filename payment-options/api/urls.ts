export const paymentOptionsApiUrls = {
  banks: '/api/v1/account/settings/payment-options/banks',
  banksAccounts: '/api/v1/account/settings/payment-options/bank-transfer',
  banksAccountsStatus: '/api/v1/account/settings/payment-options/bank-transfer/status',
  gateways: '/api/v1/account/settings/payment-options/gateways',
  updateGateway: '/api/v1/account/settings/payment-options/gateways/{paymentGatewayCode}',
  addBankAccount: '/api/v1/account/settings/payment-options/bank-transfer/add',
  editBankAccount: '/api/v1/account/settings/payment-options/bank-transfer/{bankAccountId}',
  deletebankAccount: '/api/v1/account/settings/payment-options/bank-transfer/{bankAccountId}',
};
