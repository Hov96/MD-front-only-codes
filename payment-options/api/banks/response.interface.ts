import { Banck } from '../../../zidpay/types/BankAccount.interface';
import { ApiBaseResponseObjectType } from '../../../api/types';

export interface PaymentOptionsApiBanksResponseInterface extends ApiBaseResponseObjectType {
  data: Array<Banck>;
}
