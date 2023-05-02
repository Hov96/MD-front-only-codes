import Vue, { CreateElement, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ZidButton, ZidCard, ZidCardBody, ZidCardHeader, ZidHeading, ZidModal } from '@zidsa/ui';
import { BankAccount } from '../../../../zidpay/types/BankAccount.interface';
import { I18nMessages } from '../../../../i18n/messages';
import { ButtonSizeEnum, ButtonTypeEnum } from '@zidsa/ui/types/enums';
import { BankAccountStoreModule } from '../../../store/bank-account/bank-account-module';
import { PaymentOptionsComponentsBankTransferBankAccountFormComponent } from '../BankAccountForm/BankAccountForm';
import { BanksTransferStoreModule } from '../../../store/banks-transfer-module';
import showNotification from '../../../../common/helpers/show-notification/show-notification';
import NotificationTypeEnum from '../../../../notifications/components/type.enum';

import styles from '../AddBankAccount/AddBankAccount.scss';
@Component
export class PaymentOptionsComponentsBankTransferEditBankAccountComponent extends Vue {
  @Prop()
  private readonly bankAccount!: BankAccount;

  private visible = false;
  private isSubmitting = false;

  render(h: CreateElement): VNode {
    return (
      <div class={styles['add-bank']}>
        <ZidButton
          size={ButtonSizeEnum.small}
          type={ButtonTypeEnum.primary}
          onClick={(): any => this.fetchBankAccount()}
        >
          {this.$t(I18nMessages['common.edit'])}
        </ZidButton>
        <ZidModal visible={this.visible} class={styles['add-bank__modal']} dismissible={false} onClose={this.onClose}>
          <ZidCard>
            <ZidCardHeader class={styles['add-bank__modal__header']}>
              <ZidHeading level={6} weight={'semibold'} type={'secondary'} class={styles['add-bank__title']}>
                {this.$t(I18nMessages['payment_options.bank_transfer.edit.title'])}
              </ZidHeading>
            </ZidCardHeader>
            <ZidCardBody class={styles['add-bank__modal__body']}>
              <PaymentOptionsComponentsBankTransferBankAccountFormComponent
                bankAccountData={BankAccountStoreModule.data}
                onSubmit={this.editBankAccount}
                isSubmitting={this.isSubmitting}
              />
            </ZidCardBody>
          </ZidCard>
        </ZidModal>
      </div>
    );
  }

  private async fetchBankAccount(): Promise<void> {
    BankAccountStoreModule.setBankAccount(this.bankAccount);
    this.onShow();
  }

  private onClose(): void {
    this.visible = false;
  }

  private onShow(): void {
    this.visible = true;
  }

  private async editBankAccount(): Promise<void> {
    this.isSubmitting = true;

    const response = await BankAccountStoreModule.editBankAccount();

    this.isSubmitting = false;

    if (response.status === 'success') {
      showNotification(
        this.$t(I18nMessages['payment_options.bank_transfer.edit.success']).toString(),
        NotificationTypeEnum.success,
      );
      BanksTransferStoreModule.fetch();
      this.onClose();
    }
  }
}
