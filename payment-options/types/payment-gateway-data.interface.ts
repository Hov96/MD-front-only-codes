import { PaymentNetworkEnum } from '../../api/model/payment-gateway/type.enum';

export interface PaymentGatewayData {
  code: string;
  is_enabled: boolean;
  settings: {
    public_key?: string | null;
    secret_key?: string | null;
    merchant_email?: string | null;
    profile_id?: string | null;
    server_key?: string | null;
    country_code?: string | null;
    client_key?: string | null;
    token?: string | null;
    payment_options: Array<PaymentNetworkEnum>;
  };
}
