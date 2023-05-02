import Vue, { CreateElement, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ZidButton } from '@zidsa/ui';
import { I18nMessages } from '../../../../i18n/messages';
import { ButtonTypeEnum } from '@zidsa/ui/types/enums';
import { PaymentGatewayEnum } from '../../../../api/model/payment-gateway/type.enum';
import UserStoreModule from '../../../../user/store/module';
import { ApiModelPaymentGatewayInterface } from '../../../../api/model/payment-gateway/payment-gateway.interface';
import { PaymentOptionsTypesPaymentGatewayInfoInterface } from '../../../types/payment-gateways-info.interface';
import { ModalUpgradeComponent } from '../../../../common/components/Modal';
import { PaymentOptionsComponentsPaymentGatewayCardActivationModalComponent } from '../ActivationModal/ActivationModal';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { CurrentMerchantRequest } from '../../../../Finance/types/CurrentMerchantRequest';
import { FinanceMarketingPageStoreModule } from '../../../../Finance/store/marketing-page-module';
import { CurrentStepEnum } from '../../../../Finance/types/current-step-enum';
import { StepStatusEnum } from '../../../../Finance/types/step-status-enum';

import styles from '../PaymentGatewayCard.scss';

@Component
export class PaymentOptionsComponentsPaymentGatewayCardActivationButtonComponent extends Vue {
  @Prop()
  private readonly paymentGateway!: ApiModelPaymentGatewayInterface;

  @Prop()
  private readonly paymentGatewayInfo!: PaymentOptionsTypesPaymentGatewayInfoInterface;

  @Prop()
  private readonly isInstallment!: false;

  @Prop()
  private readonly applyFinance?: false;

  private isUpgradeModalOpen = false;

  private get currentRequestStatus(): CurrentMerchantRequest | null {
    return FinanceMarketingPageStoreModule.merchantStatus;
  }
  private get disablePaymentGateways(): boolean | undefined {
    return (
      this.currentRequestStatus?.currentStep === CurrentStepEnum.FundingDeposits &&
      this.currentRequestStatus?.financingRequestStatus.id === StepStatusEnum.AmountDeposited &&
      (this.currentRequestStatus?.remainingAmount as number) !== 0 &&
      this.applyFinance
    );
  }
  render(h: CreateElement): VNode {
    return (
      <div class={styles['payment-gateway__activation-way']}>
        {this.hasSubscriptionPolicies() || this.isInstallment ? (
          !this.hasExternalActivation() ? (
            <PaymentOptionsComponentsPaymentGatewayCardActivationModalComponent
              paymentGateway={this.paymentGateway}
              paymentGatewayInfo={this.paymentGatewayInfo}
            />
          ) : (
            this.renderExternalActivationButton(h)
          )
        ) : (
          <div>
            <ZidButton
              type={ButtonTypeEnum.secondary}
              class={styles['payment-gateway__activation-way__button']}
              onClick={() => (this.isUpgradeModalOpen = true)}
            >
              {this.$t(I18nMessages['payment_options.payment_gateways.gateway.activate.upgrade'])}
            </ZidButton>
            <ModalUpgradeComponent
              isOpen={this.isUpgradeModalOpen}
              icon={faExclamationCircle}
              title={this.$t(I18nMessages['subscriptions.upgrade.package.title'])}
              onConfirm={(): string => (window.location.href = '/subscriptions')}
              onClose={() => (this.isUpgradeModalOpen = false)}
              showCancel={false}
            />
          </div>
        )}
      </div>
    );
  }

  private hasExternalActivation(): boolean {
    return this.paymentGatewayInfo.activateURL !== undefined;
  }

  private get isExternalActivationEnabled(): boolean {
    return this.paymentGateway && this.paymentGateway.is_enabled && !this.isInstallment;
  }

  private renderExternalActivationButton(h: CreateElement): VNode {
    return (
      <ZidButton
        type={ButtonTypeEnum.secondary}
        class={styles['payment-gateway__activation-way__button']}
        disabled={this.isExternalActivationEnabled || this.disablePaymentGateways}
      >
        <a
          href={
            !this.isExternalActivationEnabled && !this.disablePaymentGateways && this.paymentGatewayInfo.activateURL
          }
          target={!this.isInstallment && '_blank'}
        >
          {this.paymentGateway && this.paymentGateway.is_enabled && !this.isInstallment
            ? this.$t(I18nMessages['common.status.active'])
            : this.$t(I18nMessages['common.actions.activate'])}
        </a>
      </ZidButton>
    );
  }

  private hasSubscriptionPolicies(): boolean {
    switch (this.paymentGatewayInfo.code) {
      case PaymentGatewayEnum.tap:
        return UserStoreModule.data?.store.subscription.policies.tap_payment ?? false;
        break;
      case PaymentGatewayEnum.hyperpay:
        return UserStoreModule.data?.store.subscription.policies.hyperpay_payment ?? false;
        break;
      case PaymentGatewayEnum.payfort:
        return UserStoreModule.data?.store.subscription.policies.payfort_payment ?? false;
        break;
      case PaymentGatewayEnum.paytabs:
        return UserStoreModule.data?.store.subscription.policies.paytabs_payment ?? false;
        break;
      case PaymentGatewayEnum.moyasar:
        return UserStoreModule.data?.store.subscription.policies.moyasar_payment ?? false;
        break;
      default:
        return false;
        break;
    }
  }
}
