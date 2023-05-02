import Vue, { CreateElement, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ZidConfirmModal } from '@zidsa/ui';
import NotificationTypeEnum from '../../../../notifications/components/type.enum';
import { BanksTransferStoreModule } from '../../../store/banks-transfer-module';
import { PaymentOptionsApiServiceFactory } from '../../../api/service-factory';
import { BankAccount } from '../../../../zidpay/types/BankAccount.interface';
import { I18nMessages } from '../../../../i18n/messages';
import showNotification from '../../../../common/helpers/show-notification/show-notification';
import Catch from '../../../../common/decorators/catch-error';

const PaymentOptionsService = PaymentOptionsApiServiceFactory();

@Component
export class PaymentOptionsComponentsBankTransferDeleteBankAccountComponent extends Vue {
  @Prop()
  private readonly bankAccount!: BankAccount;

  @Prop()
  private visible!: boolean;

  private isLoading = false;

  render(h: CreateElement): VNode {
    return (
      <div>
        <ZidConfirmModal
          visible={this.visible}
          title={this.$t(I18nMessages['common.confirmation_modal.title'])}
          description={this.$t(I18nMessages['payment_options.bank_transfer.delete.modal.description'])}
          loading={this.isLoading}
          onClose={this.onClose}
          onConfirm={this.deleteCoupon}
          danger
        />
      </div>
    );
  }

  @Catch({ onError: (_, ctx) => (ctx.isLoading = false) })
  private async deleteCoupon(): Promise<void> {
    if (this.bankAccount.id) {
      this.isLoading = true;
      await PaymentOptionsService.deleteBankAccount(this.bankAccount.id.toString());
      this.isLoading = false;
      this.onClose();
      showNotification(
        this.$t(I18nMessages['payment_options.bank_transfer.delete.success']).toString(),
        NotificationTypeEnum.success,
      );
      BanksTransferStoreModule.fetch();
    }
  }

  private onClose(): void {
    this.$emit('close');
  }
}
