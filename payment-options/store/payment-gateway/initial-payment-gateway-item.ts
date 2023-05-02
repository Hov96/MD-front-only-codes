import { PaymentGatewayData } from '../../types/payment-gateway-data.interface';

/* eslint-disable @typescript-eslint/camelcase */
const data: PaymentGatewayData = {
  code: '',
  is_enabled: true,
  settings: {
    public_key: null,
    secret_key: null,
    merchant_email: null,
    profile_id: null,
    server_key: null,
    country_code: null,
    client_key: null,
    token: null,
    payment_options: [],
  },
};

export default data;
