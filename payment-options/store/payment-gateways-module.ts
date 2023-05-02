import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import appStoreFactory from '../../app/store/factory';
import AppStoreReadyStateEnum from '../../app/store/ready-state.enum';
import Catch from '../../common/decorators/catch-error';
import { revalidate } from '../../common/helpers/revalidate/revalidate';
import { PaymentOptionsApiPaymentGatewaysResponseInterface } from '../api/gateways/response.interface';
import { PaymentOptionsApiServiceFactory } from '../api/service-factory';

const PaymentOptionsService = PaymentOptionsApiServiceFactory();

@Module({
  dynamic: true,
  name: 'paymentGateways',
  store: appStoreFactory(),
  namespaced: true,
})
class PaymentGatewaysModule extends VuexModule {
  public loadingState: AppStoreReadyStateEnum = AppStoreReadyStateEnum.pending;
  public data: PaymentOptionsApiPaymentGatewaysResponseInterface | null = null;

  @Mutation
  private FETCH(): void {
    this.loadingState = AppStoreReadyStateEnum.loading;
    this.data = null;
  }

  @Mutation
  private FETCH_SUCCESS(data: PaymentOptionsApiPaymentGatewaysResponseInterface): void {
    this.loadingState = AppStoreReadyStateEnum.loaded;
    this.data = data;
  }

  @Action({ rawError: true })
  @Catch({ onError: (_, ctx) => ctx.FETCH_ERROR(null) })
  public async fetch(): Promise<void> {
    this.FETCH();
    const response = await PaymentOptionsService.getPaymentGateways();
    this.FETCH_SUCCESS(response.data);

    revalidate(response, (fresh: typeof response.data) => this.FETCH_SUCCESS(fresh));
  }
}

export const PaymentGatewaysStoreModule = getModule(PaymentGatewaysModule);
