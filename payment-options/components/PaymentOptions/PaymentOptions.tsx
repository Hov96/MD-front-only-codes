import Vue, { CreateElement, VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { ZidContainer } from '@zidsa/ui';
import { ZidPayInformationCardComponent } from '../../../zidpay/components/ZidPayInformationCard/ZidPayInformationCard';
import { PaymentOptionsComponentsPaymentGatewaysComponent } from '../PaymentGateways/PaymentGateways';
import { PaymentOptionsComponentsInstallmentServicesComponent } from '../InstallmentServices/InstallmentServices';
import { PaymentOptionsComponentsBankTransferComponent } from '../BankTransfer/BankTransfer';
import { SendConfirmEmailLinkAlertComponents } from '../../../common/components/SendConfirmEmailLinkAlert/SendConfirmEmailLinkAlert';
import UserStoreModule from '../../../user/store/module';
import { UpgradePaymentComponents } from './UpgradePayment/UpgradePayment';
import styles from './PaymentOptions.scss';
import { I18nMessages } from '../../../i18n/messages';
import ApiModelUserInterface from '../../../api/model/user.interface';

@Component
export class PaymentOptionsComponentsPaymentOptionsComponent extends Vue {
  private get user(): ApiModelUserInterface | null | any {
    return UserStoreModule?.data;
  }
  render(h: CreateElement): VNode {
    return (
      <ZidContainer fluid class={styles['payment-options']}>
        {!this.isUserEmailVerified && (
          <div class={styles['payment-options__confirm-email']}>
            <SendConfirmEmailLinkAlertComponents title={this.$t(I18nMessages['payment_options.confirm_email'])} />
          </div>
        )}
        <ZidPayInformationCardComponent class={styles['payment-options__zidpay']} hasCTA />
        {this.user?.store.subscription.package_key === 'starter' ? (
          <div>
            <PaymentOptionsComponentsBankTransferComponent user={this.user} />
            <UpgradePaymentComponents />
          </div>
        ) : (
          <div>
            <PaymentOptionsComponentsPaymentGatewaysComponent />
            <PaymentOptionsComponentsInstallmentServicesComponent />
            <PaymentOptionsComponentsBankTransferComponent user={this.user} />
          </div>
        )}
      </ZidContainer>
    );
  }

  private get isUserEmailVerified(): boolean | null {
    return UserStoreModule?.data?.is_email_verified || null;
  }
}
