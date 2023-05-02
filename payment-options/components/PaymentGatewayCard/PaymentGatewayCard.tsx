import Vue, { CreateElement, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ZidBadge, ZidBox } from '@zidsa/ui';
import { I18nMessages } from '../../../i18n/messages';
import { BadgeTypeEnum } from '../../../common/components/Badge';
import { PaymentGatewayEnum, PaymentNetworkEnum } from '../../../api/model/payment-gateway/type.enum';
import { ApiModelPaymentGatewayInterface } from '../../../api/model/payment-gateway/payment-gateway.interface';
import { PaymentOptionsTypesPaymentGatewayInfoInterface } from '../../types/payment-gateways-info.interface';
import { PaymentOptionsComponentsPaymentGatewayCardActivationButtonComponent } from './ActivationButton/ActivationButton';

import styles from './PaymentGatewayCard.scss';

@Component
export class PaymentOptionsComponentsPaymentGatewayCardComponent extends Vue {
  @Prop()
  private readonly paymentGateway!: ApiModelPaymentGatewayInterface;

  @Prop()
  private readonly paymentGatewayInfo!: PaymentOptionsTypesPaymentGatewayInfoInterface;

  @Prop()
  private readonly isInstallment!: false;

  @Prop()
  private readonly applyFinance?: false;

  render(h: CreateElement): VNode {
    return (
      <ZidBox class={styles['payment-gateway']}>
        <div class={styles['payment-gateway__info']}>
          <div class={styles['payment-gateway__header']}>
            <img src={this.paymentGatewayInfo.logo} class={this.installmentImgClasses()} />
            <h3 class={styles['payment-gateway__header__title']}>
              {this.$t(
                I18nMessages[
                  `payment_options.payment_gateways.${this.paymentGatewayInfo.code}.title` as keyof typeof I18nMessages
                ],
              )}
            </h3>
          </div>
          <div class={styles['payment-gateway__body']}>
            <div>
              <ZidBadge class={styles['payment-gateway__body__badge']} size={'small'} type={BadgeTypeEnum.primary}>
                {this.$t(I18nMessages['payment_options.payment_gateways.gateway.account_required'])}
              </ZidBadge>
              <div class={styles['payment-gateway__body__methods']}>
                {this.isInstallment ? (
                  this.$t(
                    I18nMessages[
                      `payment_options.installment.${this.paymentGatewayInfo.code}` as keyof typeof I18nMessages
                    ],
                  )
                ) : (
                  <div>
                    <h5 class={styles['payment-gateway__body__methods__title']}>
                      {this.$t(I18nMessages['payment_options.payment_gateways.gateway.supported_networks'])}
                    </h5>
                    {this.paymentGatewayInfo.networks &&
                      this.paymentGatewayInfo.networks.map((network: PaymentNetworkEnum, index: number) => (
                        <span class={styles['payment-gateway__body__method']}>
                          {this.$t(I18nMessages[`common.payment_method.${network}` as keyof typeof I18nMessages])}
                          {this.paymentGatewayInfo.networks &&
                            index !== this.paymentGatewayInfo.networks.length - 1 &&
                            '-'}
                        </span>
                      ))}
                  </div>
                )}
              </div>
              <div class={styles['payment-gateway__body__website']}>
                <h5>
                  {this.$t(I18nMessages['common.website'])}
                  {':'}
                </h5>
                <a href={this.paymentGatewayInfo.url} target={'_blank'}>
                  {this.paymentGatewayInfo.urlTitle}
                </a>
              </div>
            </div>
          </div>
        </div>
        <PaymentOptionsComponentsPaymentGatewayCardActivationButtonComponent
          paymentGateway={this.paymentGateway}
          paymentGatewayInfo={this.paymentGatewayInfo}
          isInstallment={this.isInstallment}
          applyFinance={this.applyFinance}
        />
      </ZidBox>
    );
  }

  private installmentImgClasses(): Record<string, boolean> {
    return {
      [styles['payment-gateway__header__small-img']]: this.paymentGatewayInfo.code === PaymentGatewayEnum.tamara,
    };
  }
}
