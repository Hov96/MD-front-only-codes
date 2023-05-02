import { Banck } from '../../zidpay/types/BankAccount.interface';

export interface BankAccountData {
  account_number?: string;
  bank_id?: number | null;
  beneficiary_name?: string;
  iban?: string;
  id?: number | null;
  swift?: string;
  is_visible?: boolean;
  bank?: Banck;
}
