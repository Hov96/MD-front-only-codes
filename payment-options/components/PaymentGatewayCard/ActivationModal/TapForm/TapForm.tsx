import Vue, { CreateElement, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ZidInput, ZidText } from '@zidsa/ui';
import { I18nMessages } from '../../../../../i18n/messages';
import { PaymentGatewayStoreModule } from '../../../../store/payment-gateway/payment-gateway-module';
import { ApiModelPaymentGatewayInterface } from '../../../../../api/model/payment-gateway/payment-gateway.interface';

import styles from '../ActivationModal.scss';

@Component
export class PaymentOptionsComponentsPaymentGatewayCardActivationModalTapFormComponent extends Vue {
  @Prop({
    required: true,
  })
  private readonly paymentGateway!: ApiModelPaymentGatewayInterface | null;

  render(h: CreateElement): VNode {
    return (
      <div>
        <div class={styles['activation-modal__form-group']}>
          <ZidText tyep={'dark'}>
            {this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.labels.public_key'])}
          </ZidText>
          <ZidInput
            type='text'
            name='public_key'
            value={this.paymentGateway?.settings.public_key}
            class={styles['activation-modal__form-group__input']}
            validation={'minLength:32|maxLength:32|startsWith:pk_live_,pk_test_|required'}
            onChange={PaymentGatewayStoreModule.setPublicKey}
          />
        </div>
        <div class={styles['activation-modal__form-group']}>
          <ZidText tyep={'dark'}>
            {this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.labels.secret_key'])}
          </ZidText>
          <ZidInput
            type='text'
            name='secret_key'
            value={this.paymentGateway?.settings.secret_key}
            class={styles['activation-modal__form-group__input']}
            validation={'minLength:32|maxLength:32|startsWith:sk_live_,sk_test_|required'}
            onChange={PaymentGatewayStoreModule.setSecretKey}
          />
        </div>
      </div>
    );
  }
}
