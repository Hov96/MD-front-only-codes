import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import appStoreFactory from '../../../app/store/factory';
import { PaymentOptionsApiServiceFactory } from '../../api/service-factory';
import AppStoreReadyStateEnum from '../../../app/store/ready-state.enum';
import { PaymentNetworkEnum } from '../../../api/model/payment-gateway/type.enum';
import { ApiBaseDataResponseObjectType } from '../../../api/types';
import { InputSwitchChangeEventInterface } from '../../../common/components/Input/Switch/change-event.interface';
import { InputTextChangeEventInterface } from '../../../common/components/Input';
import { PaymentGatewayData } from '../../types/payment-gateway-data.interface';
import initialPaymentGateway from './initial-payment-gateway-item';
import Catch from '../../../common/decorators/catch-error';

const PaymentOptionsService = PaymentOptionsApiServiceFactory();

@Module({
  dynamic: true,
  name: 'paymentGateway',
  store: appStoreFactory(),
  namespaced: true,
})
class PaymentGatewayModule extends VuexModule {
  public loadingState: AppStoreReadyStateEnum = AppStoreReadyStateEnum.pending;
  public data: PaymentGatewayData = initialPaymentGateway;
  public paymetGatewayCode = '';
  public error: Error | null = null;

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
  private SET_PAYMENT_GATEWAY(data: PaymentGatewayData): void {
    this.loadingState = AppStoreReadyStateEnum.loaded;
    this.data = data;
    this.paymetGatewayCode = data.code;
  }

  @Action
  public setPaymentGateway(data: PaymentGatewayData): void {
    this.SET_PAYMENT_GATEWAY(data);
  }

  @Mutation
  private SET_PAYMENT_GATEWAY_CODE(code: string): void {
    this.paymetGatewayCode = code;
  }

  @Action
  public setPaymentGatewayCode(code: string): void {
    this.SET_PAYMENT_GATEWAY_CODE(code);
  }

  @Action({ rawError: true })
  @Catch({ onError: (error: any, ctx) => ctx.FETCH_ERROR(error) })
  public async updatePaymentGateway(): Promise<ApiBaseDataResponseObjectType<PaymentGatewayData>> {
    this.RESET_ERROR();
    const response = await PaymentOptionsService.updatePaymentGateway(this.paymetGatewayCode, this.data);
    return response;
  }

  @Action
  public setIsEnabled(event: InputSwitchChangeEventInterface): void {
    this.SET_IS_ENABLED(event);
  }

  @Mutation
  private SET_IS_ENABLED(event: InputSwitchChangeEventInterface): void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.is_enabled = event.isSwitched;
  }

  @Action
  public setPublicKey(event: InputTextChangeEventInterface): void {
    this.SET_PUBLIC_KEY(event);
  }

  @Mutation
  private SET_PUBLIC_KEY(event: InputTextChangeEventInterface): void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.settings.public_key = event.value;
  }

  @Action
  public setSecretKey(event: InputTextChangeEventInterface): void {
    this.SET_SECRET_KEY(event);
  }

  @Mutation
  private SET_SECRET_KEY(event: InputTextChangeEventInterface): void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.settings.secret_key = event.value;
  }

  @Action
  public setPaymentOptions(event: Array<PaymentNetworkEnum>): void {
    this.SET_PAYMENT_OPTIONS(event);
  }

  @Mutation
  private SET_PAYMENT_OPTIONS(event: Array<PaymentNetworkEnum>): void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.settings.payment_options = event;
  }

  @Action
  public setToken(event: InputTextChangeEventInterface): void {
    this.SET_TOKEN(event);
  }

  @Mutation
  private SET_TOKEN(event: InputTextChangeEventInterface): void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.settings.token = event.value;
  }

  @Action
  public setProfileId(event: InputTextChangeEventInterface): void {
    this.SET_PROFILE_ID(event);
  }

  @Mutation
  private SET_PROFILE_ID(event: InputTextChangeEventInterface): void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.settings.profile_id = event.value;
  }

  @Action
  public setServerKey(event: InputTextChangeEventInterface): void {
    this.SET_SERVER_KEY(event);
  }

  @Mutation
  private SET_SERVER_KEY(event: InputTextChangeEventInterface): void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.settings.server_key = event.value;
  }

  @Action
  public setClientKey(event: InputTextChangeEventInterface): void {
    this.SET_CLIENT_KEY(event);
  }

  @Mutation
  private SET_CLIENT_KEY(event: InputTextChangeEventInterface): void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.settings.client_key = event.value;
  }

  @Action
  public setCountryCode(event: string): void {
    this.SET_COUNTRY_CODE(event);
  }

  @Mutation
  private SET_COUNTRY_CODE(event: string): void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.data.settings.country_code = event;
  }
}

export const PaymentGatewayStoreModule = getModule(PaymentGatewayModule);
