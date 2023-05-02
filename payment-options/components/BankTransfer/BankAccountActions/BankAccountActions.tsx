import Vue, { CreateElement, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ZidButton, ZidIcon } from '@zidsa/ui';
import { BankAccount } from '../../../../zidpay/types/BankAccount.interface';
import { ButtonSizeEnum, ButtonTypeEnum } from '@zidsa/ui/types/enums';
import { PaymentOptionsComponentsBankTransferDeleteBankAccountComponent } from '../DeleteBankAccount/DeleteBankAccount';
import { PaymentOptionsComponentsBankTransferEditBankAccountComponent } from '../EditBankAccount/EditBankAccount';

import styles from './BankAccountActions.scss';

@Component
export class PaymentOptionsComponentsBankTransferBankAccountActionsComponent extends Vue {
  @Prop()
  private readonly bankAccount!: BankAccount;

  private isDeleteModalOpen = false;

  render(h: CreateElement): VNode {
    return (
      <div class={styles['bank-tansfer-actions']}>
        <PaymentOptionsComponentsBankTransferEditBankAccountComponent bankAccount={this.bankAccount} />
        <ZidButton
          class={styles['bank-tansfer-actions__delete-button']}
          link
          size={ButtonSizeEnum.small}
          onClick={(): boolean => (this.isDeleteModalOpen = true)}
        >
          <ZidIcon icon={'delete'} size='xxs' color={ButtonTypeEnum.primary}></ZidIcon>
        </ZidButton>
        <PaymentOptionsComponentsBankTransferDeleteBankAccountComponent
          bankAccount={this.bankAccount}
          visible={this.isDeleteModalOpen}
          onClose={(): boolean => (this.isDeleteModalOpen = false)}
        />
      </div>
    );
  }
}
