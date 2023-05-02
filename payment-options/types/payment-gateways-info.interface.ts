import { PaymentGatewayEnum, PaymentNetworkEnum } from '../../api/model/payment-gateway/type.enum';

export interface PaymentOptionsTypesPaymentGatewayInfoInterface {
  code: PaymentGatewayEnum;
  logo: string;
  urlTitle: string;
  url: string;
  activateURL?: string;
  networks?: Array<PaymentNetworkEnum>;
}
