import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import appStoreFactory from '../../app/store/factory';
import AppStoreReadyStateEnum from '../../app/store/ready-state.enum';
import Catch from '../../common/decorators/catch-error';
import { BankAccount } from '../../zidpay/types/BankAccount.interface';
import { revalidate } from '../../common/helpers/revalidate/revalidate';
import { PaymentOptionsApiBanksTransferResponseInterface } from '../api/banks-transfer/response.interface';
import { PaymentOptionsApiServiceFactory } from '../api/service-factory';

const PaymentOptionsService = PaymentOptionsApiServiceFactory();

@Module({
  dynamic: true,
  name: 'banksTransfer',
  store: appStoreFactory(),
  namespaced: true,
})
class BanksTransferModule extends VuexModule {
  public loadingState: AppStoreReadyStateEnum = AppStoreReadyStateEnum.pending;
  public data: PaymentOptionsApiBanksTransferResponseInterface | null = null;
  public banksStatus = false;

  @Mutation
  private FETCH(): void {
    this.loadingState = AppStoreReadyStateEnum.loading;
    this.data = null;
  }

  @Mutation
  private FETCH_SUCCESS(data: PaymentOptionsApiBanksTransferResponseInterface): void {
    this.loadingState = AppStoreReadyStateEnum.loaded;
    this.data = data;
  }

  @Mutation
  private UPDATE_BANK_INFO(bankInfo: BankAccount): void {
    const bankIndex = this.data?.data.banksAccounts.findIndex((bank) => bank.id == bankInfo.id);
    if (bankIndex && this.data) this.data.data.banksAccounts[bankIndex] = bankInfo;
  }

  @Action
  public updateBankInfo(bankInfo: BankAccount): void {
    this.UPDATE_BANK_INFO(bankInfo);
  }

  @Action({ rawError: true })
  @Catch({ onError: (_, ctx) => ctx.FETCH_ERROR(null) })
  public async fetch(): Promise<void> {
    this.FETCH();
    const response = await PaymentOptionsService.getBanksAccounts();
    this.FETCH_SUCCESS(response.data);

    revalidate(response, (fresh: typeof response.data) => this.FETCH_SUCCESS(fresh));
  }
}

export const BanksTransferStoreModule = getModule(BanksTransferModule);
