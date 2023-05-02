import Vue, { CreateElement, VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { ZidButton, ZidCard, ZidCardBody, ZidCardHeader, ZidHeading, ZidModal } from '@zidsa/ui';
import { I18nMessages } from '../../../../i18n/messages';
import { ButtonSizeEnum, ButtonTypeEnum } from '@zidsa/ui/types/enums';
import NotificationTypeEnum from '../../../../notifications/components/type.enum';
import { BankAccountStoreModule } from '../../../store/bank-account/bank-account-module';
import { BanksTransferStoreModule } from '../../../store/banks-transfer-module';
import UserStoreModule from '../../../../user/store/module';
import { PaymentOptionsComponentsBankTransferBankAccountFormComponent } from '../BankAccountForm/BankAccountForm';
import showNotification from '../../../../common/helpers/show-notification/show-notification';

import styles from './AddBankAccount.scss';

@Component
export class PaymentOptionsComponentsBankTransferAddBankAccountComponent extends Vue {
  private visible = false;
  private isSubmitting = false;
  private validateBankId = false;

  render(h: CreateElement): VNode {
    return (
      <div class={styles['add-bank']}>
        <ZidButton
          class={styles['add-bank__add']}
          size={ButtonSizeEnum.small}
          type={ButtonTypeEnum.secondary}
          disabled={!this.isUserEmailVerified}
          onClick={(): any => this.showAddBankAccountModal()}
        >
          {this.$t(I18nMessages['payment_options.bank_transfer.add.cta'])}
        </ZidButton>
        <ZidModal visible={this.visible} class={styles['add-bank__modal']} dismissible={false} onClose={this.onClose}>
          <ZidCard>
            <ZidCardHeader class={styles['add-bank__modal__header']}>
              <ZidHeading level={6} weight={'semibold'} type={'secondary'} class={styles['add-bank__title']}>
                {this.$t(I18nMessages['payment_options.bank_transfer.add.cta'])}
              </ZidHeading>
            </ZidCardHeader>
            <ZidCardBody class={styles['add-bank__modal__body']}>
              <PaymentOptionsComponentsBankTransferBankAccountFormComponent
                bankAccountData={BankAccountStoreModule.data}
                onSubmit={this.addBankAccount}
                isSubmitting={this.isSubmitting}
                validateBankId={this.validateBankId}
                onResetValidateBankId={this.resetValidateBankId}
              />
            </ZidCardBody>
          </ZidCard>
        </ZidModal>
      </div>
    );
  }

  private showAddBankAccountModal(): void {
    BankAccountStoreModule.initialize();
    this.visible = true;
  }

  private onClose(): void {
    this.visible = false;
  }

  private get isUserEmailVerified(): boolean | null {
    return UserStoreModule?.data?.is_email_verified || null;
  }

  private resetValidateBankId(): void {
    this.validateBankId = false;
  }

  private async addBankAccount(): Promise<void> {
    if (!BankAccountStoreModule.data.bank_id) {
      this.validateBankId = true;
      return;
    }
    this.isSubmitting = true;
    const response = await BankAccountStoreModule.addBankAccount();
    this.isSubmitting = false;
    this.onClose();
    if (response.status === 'success') {
      showNotification(
        this.$t(I18nMessages['payment_options.bank_transfer.add.success']).toString(),
        NotificationTypeEnum.success,
      );
      BanksTransferStoreModule.fetch();
    }
  }
}
