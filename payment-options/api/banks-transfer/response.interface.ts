import { BankAccount } from '../../../zidpay/types/BankAccount.interface';
import { ApiBaseDataResponseObjectType } from '../../../api/types';

export type PaymentOptionsApiBanksTransferResponseInterface = ApiBaseDataResponseObjectType<{
  banksAccounts: Array<BankAccount>;
  banksStatus: boolean;
}>;
