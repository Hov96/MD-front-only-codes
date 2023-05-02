import Vue, { CreateElement, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ZidLoader, ZidSwitch, ZidTooltip } from '@zidsa/ui';
import NotificationTypeEnum from '../../../../notifications/components/type.enum';
import { BanksTransferStoreModule } from '../../../store/banks-transfer-module';
import { PaymentOptionsApiServiceFactory } from '../../../api/service-factory';
import { I18nMessages } from '../../../../i18n/messages';
import showNotification from '../../../../common/helpers/show-notification/show-notification';
import { LoaderSizeEnum } from '@zidsa/ui/types/enums';
import Catch from '../../../../common/decorators/catch-error';

import styles from './BankTransferStatus.scss';
import ApiModelUserInterface from '../../../../api/model/user.interface';

const PaymentOptionsService = PaymentOptionsApiServiceFactory();

@Component
export class PaymentOptionsComponentsBankTransferBankTransferStatusComponent extends Vue {
  @Prop()
  private readonly disabled!: false;
  private isSubmitting = false;
  private bankTransferStatus = BanksTransferStoreModule.data?.data.banksStatus;
  @Prop()
  private readonly user!: ApiModelUserInterface | null | any;

  render(h: CreateElement): VNode {
    return (
      <div class={styles['bank-transfer-status']}>
        <h5 class={styles['bank-transfer-status__label']}>
          {this.$t(I18nMessages['payment_options.bank_transfer.status.label1'])}
          <span>{this.$t(I18nMessages['payment_options.bank_transfer.status.label2'])} </span>
        </h5>
        {this.isSubmitting ? (
          this.renderLoader(h)
        ) : this.disabled ? (
          <ZidTooltip>
            {this.renderToggleBankTransferStatus(h)}
            <template slot='tooltip'>{this.$t(I18nMessages['payment_options.bank_transfer.status.tooltip'])}</template>
          </ZidTooltip>
        ) : this.user?.store.subscription.package_key === 'starter' ? (
          <ZidTooltip>
            {this.renderToggleBankTransferStatus(h)}
            <template slot='tooltip'>{this.$t(I18nMessages['upgrade_service_package.header'])}</template>
          </ZidTooltip>
        ) : (
          this.renderToggleBankTransferStatus(h)
        )}
      </div>
    );
  }

  private renderLoader(h: CreateElement): VNode {
    return <ZidLoader size={LoaderSizeEnum.small} />;
  }

  private renderToggleBankTransferStatus(h: CreateElement): VNode {
    return (
      <ZidSwitch
        key={'bankTransferStatus'}
        isSwitched={this.user?.store.subscription.package_key === 'starter' ? false : this.bankTransferStatus}
        disabled={this.user?.store.subscription.package_key === 'starter' ? true : this.disabled}
        onChange={() => this.onChangeStatusCell()}
      />
    );
  }

  @Catch({ onError: (_, ctx) => (ctx.isLoading = false) })
  private async onChangeStatusCell(): Promise<void> {
    this.isSubmitting = true;

    const response = await PaymentOptionsService.toggleBankTransferMethodStatus();
    if (response.status === 'success') {
      showNotification(
        this.$t(I18nMessages['payment_options.bank_transfer.status.success']).toString(),
        NotificationTypeEnum.success,
      );
      this.bankTransferStatus = !this.bankTransferStatus;

      this.isSubmitting = false;
    }
  }
}
