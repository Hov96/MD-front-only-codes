import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import appStoreFactory from '../../app/store/factory';
import AppStoreReadyStateEnum from '../../app/store/ready-state.enum';
import Catch from '../../common/decorators/catch-error';
import { PaymentOptionsApiBanksResponseInterface } from '../api/banks/response.interface';
import { PaymentOptionsApiServiceFactory } from '../api/service-factory';

const PaymentOptionsService = PaymentOptionsApiServiceFactory();

@Module({
  dynamic: true,
  name: 'banks',
  store: appStoreFactory(),
  namespaced: true,
})
class BanksModule extends VuexModule {
  public loadingState: AppStoreReadyStateEnum = AppStoreReadyStateEnum.pending;
  public data: PaymentOptionsApiBanksResponseInterface | null = null;

  @Mutation
  private FETCH(): void {
    this.loadingState = AppStoreReadyStateEnum.loading;
    this.data = null;
  }

  @Mutation
  private FETCH_SUCCESS(data: PaymentOptionsApiBanksResponseInterface): void {
    this.loadingState = AppStoreReadyStateEnum.loaded;
    this.data = data;
  }

  @Action({ rawError: true })
  @Catch({ onError: (_, ctx) => ctx.FETCH_ERROR(null) })
  public async fetch(): Promise<void> {
    this.FETCH();
    const response = await PaymentOptionsService.getBanks();
    this.FETCH_SUCCESS(response);
  }
}

export const BanksStoreModule = getModule(BanksModule);
