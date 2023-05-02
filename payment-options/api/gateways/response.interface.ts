import { ApiBaseResponseObjectType } from '../../../api/types';
import { ApiModelPaymentGatewayInterface } from '../../../api/model/payment-gateway/payment-gateway.interface';

export interface PaymentOptionsApiPaymentGatewaysResponseInterface extends ApiBaseResponseObjectType {
  data: Array<ApiModelPaymentGatewayInterface>;
}
