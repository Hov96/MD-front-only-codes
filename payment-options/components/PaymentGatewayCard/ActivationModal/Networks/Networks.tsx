import Vue, { CreateElement, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ZidCol, ZidRow, ZidText } from '@zidsa/ui';
import { I18nMessages } from '../../../../../i18n/messages';
import { PaymentNetworkEnum } from '../../../../../api/model/payment-gateway/type.enum';
import { PaymentGatewayStoreModule } from '../../../../store/payment-gateway/payment-gateway-module';
import { PaymentOptionsTypesPaymentGatewayInfoInterface } from '../../../../types/payment-gateways-info.interface';
import { arrayToggle } from '../../../../../common/helpers/array/toggle';
import { paymentNetworksImg } from '../../../../../common/helpers/payment-networks/img-payment-networks-by-enum';

import styles from '../ActivationModal.scss';

@Component
export class PaymentOptionsComponentsPaymentGatewayCardActivationModalNetworksComponent extends Vue {
  @Prop()
  private readonly paymentGatewayInfo!: PaymentOptionsTypesPaymentGatewayInfoInterface;

  @Prop()
  private readonly validateNetworks!: false;

  private selectedPaymentOption = [...PaymentGatewayStoreModule.data?.settings?.payment_options];

  render(h: CreateElement): VNode {
    return (
      <div class={styles['activation-modal__step']}>
        <ZidText tyep={'dark'} class={styles['activation-modal__step__title']}>
          <span>{'3.'}</span>
          {this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.step_3'])}
        </ZidText>
        <ZidRow class={styles['activation-modal__form-group']}>
          {this.paymentGatewayInfo?.networks?.map((network) => (
            <ZidCol cols={'6'} md={'3'} class={styles['activation-modal__img-holder']}>
              <a onClick={() => this.onChangePaymentOptions(network)} class={this.imgBoxClasses(network)}>
                <img src={`${paymentNetworksImg(network)}`} class={this.imgClasses(network)} />
              </a>
            </ZidCol>
          ))}
          {this.validateNetworks && (
            <p class={styles['activation-modal__required-field']}>
              {this.$t(I18nMessages['payment_options.payment_gateways.gateway.validation.networks'])}
            </p>
          )}
        </ZidRow>
      </div>
    );
  }

  private async onChangePaymentOptions(network: PaymentNetworkEnum): Promise<void> {
    this.selectedPaymentOption = await arrayToggle(this.selectedPaymentOption, network);
    PaymentGatewayStoreModule.setPaymentOptions(this.selectedPaymentOption);
    this.$emit('resetValidateNetworks');
  }

  private imgClasses(network: PaymentNetworkEnum): Record<string, boolean> {
    return {
      [styles['activation-modal__img']]: true,
      [styles['activation-modal__img--selected']]: this.selectedPaymentOption.includes(network),
    };
  }

  private imgBoxClasses(network: PaymentNetworkEnum): Record<string, boolean> {
    return {
      [styles['activation-modal__img-box']]: true,
      [styles['activation-modal__img-box--selected']]: this.selectedPaymentOption.includes(network),
    };
  }
}
