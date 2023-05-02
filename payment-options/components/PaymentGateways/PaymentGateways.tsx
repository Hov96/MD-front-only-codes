import { CreateElement, VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { ZidBox, ZidCard, ZidCardBody, ZidCardHeader, ZidCol, ZidRow } from '@zidsa/ui';
import { PaymentGatewayEnum, PaymentNetworkEnum } from '../../../api/model/payment-gateway/type.enum';
import { PaymentGetwaysMixin } from '../../mixins/payment-gateways.mixin';
import { I18nMessages } from '../../../i18n/messages';
import { ApiModelPaymentGatewayInterface } from '../../../api/model/payment-gateway/payment-gateway.interface';
import { PaymentOptionsComponentsPaymentGatewayCardComponent } from '../PaymentGatewayCard/PaymentGatewayCard';
import images from '../../assets/images';
import renderLoader from '../../../common/helpers/loader';
import { PaymentOptionsTypesPaymentGatewayInfoInterface } from '../../types/payment-gateways-info.interface';
import { DisablePaymentGatewaysComponent } from '../../../Finance/components/FinanceNotificationCenter/DisablePaymentGateways/DisablePaymentGateways';
import { FinanceMarketingPageStoreModule } from '../../../Finance/store/marketing-page-module';
import { CurrentStepEnum } from '../../../Finance/types/current-step-enum';
import { StepStatusEnum } from '../../../Finance/types/step-status-enum';
import { CurrentMerchantRequest } from '../../../Finance/types/CurrentMerchantRequest';
import { ZidpayStoreSettingsModule } from '../../../zidpay/store/settings-module';

import styles from './PaymentGateways.scss';

@Component
export class PaymentOptionsComponentsPaymentGatewaysComponent extends PaymentGetwaysMixin {
  async created(): Promise<void> {
    await this.fetchMerchantData();
    this.fetchPaymentGetways();
  }
  private get currentRequestStatus(): CurrentMerchantRequest | null {
    return FinanceMarketingPageStoreModule.merchantStatus;
  }
  private get disablePaymentGateways(): boolean | undefined {
    return (
      this.currentRequestStatus?.currentStep === CurrentStepEnum.FundingDeposits &&
      this.currentRequestStatus?.financingRequestStatus.id === StepStatusEnum.AmountDeposited &&
      (this.currentRequestStatus?.remainingAmount as number) !== 0
    );
  }
  render(h: CreateElement): VNode {
    return (
      <ZidCard class={styles['payment-gateways']}>
        <ZidCardHeader>
          <div class={styles['payment-gateways__header']}>
            <h3 class={styles['payment-gateways__header__title']}>
              {this.$t(I18nMessages['payment_options.payment_gateways.header.title'])}
            </h3>
            <div class={styles['payment-gateways__header__description']}>
              {this.$t(I18nMessages['payment_options.payment_gateways.header.description'])}
            </div>
          </div>
        </ZidCardHeader>
        <ZidCardBody class={styles.wrapper}>
          {!this.isLoading ? (
            <ZidBox>
              <ZidRow cols={1} cols-xl={2}>
                {this.supportedPaymentGateways.map((paymentGatewayInfo) => (
                  <ZidCol class={styles['payment-gateways__gateway']}>
                    <PaymentOptionsComponentsPaymentGatewayCardComponent
                      paymentGateway={this.gateway(paymentGatewayInfo.code)}
                      paymentGatewayInfo={paymentGatewayInfo}
                      applyFinance={true}
                    />
                  </ZidCol>
                ))}
              </ZidRow>
            </ZidBox>
          ) : (
            renderLoader(h)
          )}
          {!this.isLoading && this.disablePaymentGateways && (
            <div class={styles.wrapper__overlay}>
              <div class={styles.wrapper__overlay__content}>
                <ZidRow>
                  <ZidCol cols={1} cols-xl={4}></ZidCol>
                  <ZidCol class={styles.wrapper__overlay__content__target} cols={10}>
                    <DisablePaymentGatewaysComponent />
                  </ZidCol>
                  <ZidCol cols={1} cols-xl={4}></ZidCol>
                </ZidRow>
              </div>
            </div>
          )}
        </ZidCardBody>
      </ZidCard>
    );
  }

  private gateway(code: PaymentGatewayEnum): ApiModelPaymentGatewayInterface | undefined {
    return this.paymentGateways.find((gateway) => gateway.code === code);
  }

  private get supportedPaymentGateways(): Array<PaymentOptionsTypesPaymentGatewayInfoInterface> {
    return [
      {
        code: PaymentGatewayEnum.tap,
        logo: images.Tap,
        url: 'https://register.tap.company/ar',
        urlTitle: 'Tap.company',
        networks: [
          PaymentNetworkEnum.mada,
          PaymentNetworkEnum.visa,
          PaymentNetworkEnum.knet,
          PaymentNetworkEnum.applePay,
          PaymentNetworkEnum.amex,
        ],
      },
      {
        code: PaymentGatewayEnum.hyperpay,
        logo: images.Hyperpay,
        url: 'https://www.hyperpay.com/ar/',
        urlTitle: 'Hyperpay.com',
        networks: [PaymentNetworkEnum.mada, PaymentNetworkEnum.visa, PaymentNetworkEnum.applePay],
        activateURL: 'https://zid-services.typeform.com/to/dHSdeHWB',
      },
      {
        code: PaymentGatewayEnum.payfort,
        logo: images.Payfort,
        url: 'https://paymentservices.amazon.com/',
        urlTitle: 'paymentservices.amazon.com',
        networks: [PaymentNetworkEnum.mada, PaymentNetworkEnum.visa],
        activateURL: 'https://zid-services.typeform.com/to/tAm5j3no',
      },
      {
        code: PaymentGatewayEnum.paytabs,
        url: 'https://site.paytabs.com/ar/المدفوعات-الرقمية/?utm_source=zid&utm_medium=zid&utm_campaign=web.merchant',
        urlTitle: 'site.paytabs.com',
        logo: images.Paytabs,
        networks: [
          PaymentNetworkEnum.mada,
          PaymentNetworkEnum.visa,
          PaymentNetworkEnum.knet,
          PaymentNetworkEnum.applePay,
          PaymentNetworkEnum.omannet,
          PaymentNetworkEnum.stcPay,
          PaymentNetworkEnum.amex,
        ],
      },
      {
        code: PaymentGatewayEnum.moyasar,
        url: 'https://moyasar.com?utm_source=zid&utm_medium=zid&utm_campaign=web.merchant',
        urlTitle: 'moyasar',
        logo: images.Moyasar,
        networks: [PaymentNetworkEnum.mada, PaymentNetworkEnum.visa, PaymentNetworkEnum.applePay],
      },
    ];
  }
  private async fetchMerchantData(): Promise<void> {
    if (
      (ZidpayStoreSettingsModule.data && Object.keys(ZidpayStoreSettingsModule.data).length === 0) ||
      !ZidpayStoreSettingsModule.data
    ) {
      await ZidpayStoreSettingsModule.fetchMerchantDetails();
    }
    if (ZidpayStoreSettingsModule.data?.referenceNumber) {
      await FinanceMarketingPageStoreModule.fetchMerchantCurrentRequest(
        ZidpayStoreSettingsModule.data?.referenceNumber,
      );
    }
  }
}
