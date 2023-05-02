import Vue, { CreateElement, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ZidInput, ZidText } from '@zidsa/ui';
import { I18nMessages } from '../../../../../i18n/messages';
import { PaymentGatewayStoreModule } from '../../../../store/payment-gateway/payment-gateway-module';
import { ApiModelPaymentGatewayInterface } from '../../../../../api/model/payment-gateway/payment-gateway.interface';

import styles from '../ActivationModal.scss';

@Component
export class PaymentOptionsComponentsPaymentGatewayCardActivationModalMoyasarFormComponent extends Vue {
  @Prop({
    required: true,
  })
  private readonly paymentGateway!: ApiModelPaymentGatewayInterface | null;

  render(h: CreateElement): VNode {
    return (
      <div>
        <div class={styles['activation-modal__form-group']}>
          <ZidText type='dark'>
            {this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.labels.token'])}
          </ZidText>
          <ZidInput
            name='token'
            type='text'
            value={this.paymentGateway?.settings.token}
            class={styles['activation-modal__form-group__input']}
            onChange={PaymentGatewayStoreModule.setToken}
            validation={'minLength:48|maxLength:48|startsWith:pk_live_,pk_test_|required'}
          />
        </div>
        <div class={styles['activation-modal__form-group']}>
          <ZidText type='dark'>
            {this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.labels.secret_key'])}
          </ZidText>
          <ZidInput
            type='text'
            name='secret_key'
            value={this.paymentGateway?.settings.secret_key}
            class={styles['activation-modal__form-group__input']}
            validation={'minLength:48|maxLength:48|startsWith:sk_live_,sk_test_|required'}
            onChange={PaymentGatewayStoreModule.setSecretKey}
          />
        </div>
      </div>
    );
  }
}
