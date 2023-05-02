import { CreateElement, VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { ZidBox, ZidCard, ZidCardBody, ZidCardHeader, ZidCol, ZidRow } from '@zidsa/ui';
import { PaymentGetwaysMixin } from '../../mixins/payment-gateways.mixin';
import { I18nMessages } from '../../../i18n/messages';
import { PaymentGatewayEnum } from '../../../api/model/payment-gateway/type.enum';
import { ApiModelPaymentGatewayInterface } from '../../../api/model/payment-gateway/payment-gateway.interface';
import { PaymentOptionsComponentsPaymentGatewayCardComponent } from '../PaymentGatewayCard/PaymentGatewayCard';
import renderLoader from '../../../common/helpers/loader';

import styles from '../PaymentGateways/PaymentGateways.scss';
import images from '../../assets/images';
import { PaymentOptionsTypesPaymentGatewayInfoInterface } from '../../types/payment-gateways-info.interface';
@Component
export class PaymentOptionsComponentsInstallmentServicesComponent extends PaymentGetwaysMixin {
  render(h: CreateElement): VNode {
    return (
      <ZidCard class={styles['payment-gateways']}>
        <ZidCardHeader>
          <div class={styles['payment-gateways__header']}>
            <h3 class={styles['payment-gateways__header__title']}>
              {this.$t(I18nMessages['payment_options.installment.header.title'])}
            </h3>
            <div class={styles['payment-gateways__header__description']}>
              {this.$t(I18nMessages['payment_options.installment.header.description'])}
            </div>
          </div>
        </ZidCardHeader>
        <ZidCardBody>
          {!this.isLoading ? (
            <ZidBox>
              <ZidRow cols={1} cols-xl={2}>
                {this.supportedInstallmentServices.map((InstallmentService) => (
                  <ZidCol class={styles['payment-gateways__gateway']}>
                    <PaymentOptionsComponentsPaymentGatewayCardComponent
                      paymentGateway={this.gateway}
                      paymentGatewayInfo={InstallmentService}
                      isInstallment
                    />
                  </ZidCol>
                ))}
              </ZidRow>
            </ZidBox>
          ) : (
            renderLoader(h)
          )}
        </ZidCardBody>
      </ZidCard>
    );
  }

  private gateway(code: PaymentGatewayEnum): ApiModelPaymentGatewayInterface | undefined {
    return this.paymentGateways.find((gateway) => gateway.code === code);
  }

  private get supportedInstallmentServices(): Array<PaymentOptionsTypesPaymentGatewayInfoInterface> {
    return [
      {
        code: PaymentGatewayEnum.tabby,
        url: 'https://tabby.ai/en-AE',
        urlTitle: 'tabby.ai',
        logo: images['Tabby'],
        activateURL: '/market/integrations/tabby',
      },
      {
        code: PaymentGatewayEnum.tamara,
        url: 'https://tamara.co/',
        urlTitle: 'tamara.co',
        logo: images.Tamara,
        activateURL: '/market/integrations/tamara',
      },
    ];
  }
}
