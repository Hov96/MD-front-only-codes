/* eslint-disable @typescript-eslint/camelcase */
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { ApiBaseDataResponseObjectType } from '../../../api/types';
import appStoreFactory from '../../../app/store/factory';
import AppStoreReadyStateEnum from '../../../app/store/ready-state.enum';
import initialBankAccount from './initial-bank-account-item';
import { InputSelectOptionInterface, InputTextChangeEventInterface } from '../../../common/components/Input';
import Catch from '../../../common/decorators/catch-error';
import { BankAccount } from '../../../zidpay/types/BankAccount.interface';
import { PaymentOptionsApiServiceFactory } from '../../api/service-factory';
import { BankAccountData } from '../../types/account-bank-data.interface';
import { InputCheckboxChangeEventInterface } from '../../../common/components/Input/Checkbox/change-event.interface';

const PaymentOptionsService = PaymentOptionsApiServiceFactory();

@Module({
  dynamic: true,
  name: 'bankAccount',
  store: appStoreFactory(),
  namespaced: true,
})
class BankAccountModule extends VuexModule {
  public loadingState: AppStoreReadyStateEnum = AppStoreReadyStateEnum.pending;
  public data: BankAccountData = initialBankAccount;
  public bankAccountId = '';
  public error: Error | null = null;

  @Mutation
  private INITIALIZE(): void {
    this.data = { ...initialBankAccount };
    this.bankAccountId = '';
    this.data = {
      account_number: '',
      bank_id: null,
      beneficiary_name: '',
      iban: '',
      id: null,
      is_visible: true,
    };
  }

  @Action
  public async initialize(): Promise<void> {
    this.INITIALIZE();
  }

  @Mutation
  private RESET_ERROR(): void {
    this.error = null;
  }

  @Mutation
  FETCH_ERROR(error: Error): void {
    this.loadingState = AppStoreReadyStateEnum.error;
    this.error = error;
  }

  @Mutation
  private SET_BANK_ACCOUNT(data: BankAccount): void {
    this.loadingState = AppStoreReadyStateEnum.loaded;
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { bank, is_visible, ...bankAccountData } = data;
    this.data = bankAccountData;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.bank_id = bank?.id;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.is_visible = Boolean(is_visible);
    if (bankAccountData.id) this.bankAccountId = bankAccountData.id.toString();
  }

  @Action
  public setBankAccount(account: BankAccount): void {
    this.SET_BANK_ACCOUNT(account);
  }

  @Action({ rawError: true })
  @Catch({ onError: (error: any, ctx) => ctx.FETCH_ERROR(error) })
  public async addBankAccount(): Promise<ApiBaseDataResponseObjectType<BankAccountData>> {
    this.RESET_ERROR();
    const response = await PaymentOptionsService.addBankAccount(this.data);
    return response;
  }

  @Action({ rawError: true })
  @Catch({ onError: (error: any, ctx) => ctx.FETCH_ERROR(error) })
  public async editBankAccount(): Promise<ApiBaseDataResponseObjectType<BankAccountData>> {
    this.RESET_ERROR();
    const bankAccountId = this.data.id;
    const response = await PaymentOptionsService.editBankAccount(
      this.bankAccountId ? this.bankAccountId : String(bankAccountId),
      this.data,
    );
    return response;
  }

  @Action
  public setBankId(event: InputSelectOptionInterface): void {
    this.SET_BANK_ID(event);
  }

  @Mutation
  private SET_BANK_ID(event: InputSelectOptionInterface): void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.bank_id = Number(event.value);
  }

  @Mutation
  private SET_ACCOUNT_BANK_ID(id: number): void {
    this.data.id = id;
  }

  @Action
  public setAccountBankNumber(id: number): void {
    this.SET_ACCOUNT_BANK_ID(id);
  }

  @Action
  public setAccountNumber(event: InputTextChangeEventInterface): void {
    this.SET_ACCOUNT_NUMBER(event);
  }

  @Mutation
  private SET_ACCOUNT_NUMBER(event: InputTextChangeEventInterface): void {
    // eslint-ddisable-next-line @typescript-eslint/camelcase
    this.data.account_number = event.value;
  }

  @Action
  public setBeneficiaryName(event: InputTextChangeEventInterface): void {
    this.SET_BENEFICIARY_NAME(event);
  }

  @Mutation
  private SET_BENEFICIARY_NAME(event: InputTextChangeEventInterface): void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.beneficiary_name = event.value;
  }

  @Action
  public setIban(event: InputTextChangeEventInterface): void {
    this.SET_IBAN(event);
  }

  @Mutation
  private SET_IBAN(event: InputTextChangeEventInterface): void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.iban = event.value;
  }

  @Action
  public setSwift(event: InputTextChangeEventInterface): void {
    this.SET_SWIFT(event);
  }

  @Mutation
  private SET_SWIFT(event: InputTextChangeEventInterface): void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.swift = event.value;
  }

  @Mutation
  private SET_IS_VISIBLE(event: InputCheckboxChangeEventInterface): void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.is_visible = event.isChecked;
  }

  @Action
  public setIsVisible(event: InputCheckboxChangeEventInterface): void {
    this.SET_IS_VISIBLE(event);
  }
}

export const BankAccountStoreModule = getModule(BankAccountModule);
