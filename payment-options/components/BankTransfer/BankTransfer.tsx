import Vue, { CreateElement, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ZidBox, ZidCard, ZidCardBody, ZidCardHeader } from '@zidsa/ui';
import { I18nMessages } from '../../../i18n/messages';
import AppStoreReadyStateEnum from '../../../app/store/ready-state.enum';
import { BanksTransferStoreModule } from '../../store/banks-transfer-module';
import { BankAccount } from '../../../zidpay/types/BankAccount.interface';
import { PaymentOptionsComponentsBankTransferBankAccountActionsComponent } from './BankAccountActions/BankAccountActions';
import { PaymentOptionsComponentsBankTransferAddBankAccountComponent } from './AddBankAccount/AddBankAccount';
import { PaymentOptionsComponentsBankTransferBankTransferStatusComponent } from './BankTransferStatus/BankTransferStatus';
import renderLoader from '../../../common/helpers/loader';

import styles from './BankTransfer.scss';
import ApiModelUserInterface from '../../../api/model/user.interface';
@Component
export class PaymentOptionsComponentsBankTransferComponent extends Vue {
  created(): void {
    BanksTransferStoreModule.fetch();
  }

  @Prop()
  private readonly user!: ApiModelUserInterface | null | any;

  render(h: CreateElement): VNode {
    return (
      <ZidCard class={styles['bank-transfer']}>
        <ZidCardHeader class={styles['bank-transfer__card-header']}>
          <div class={styles['bank-transfer__header']}>
            <h3 class={styles['bank-transfer__header__title']}>
              {this.$t(I18nMessages['common.payment_method.bank_transfer'])}
            </h3>
            <PaymentOptionsComponentsBankTransferAddBankAccountComponent user={this.user} />
          </div>
        </ZidCardHeader>
        <ZidCardBody>
          {!this.isLoading ? (
            <ZidBox>
              <PaymentOptionsComponentsBankTransferBankTransferStatusComponent
                user={this.user}
                disabled={!this.banksAccounts.length}
              />
              <div>
                {this.banksAccounts.map((account) => (
                  <div class={styles['bank-transfer__account']}>
                    <div class={styles['bank-transfer__account__header']}>
                      <h4>{account.bank?.name}</h4>
                      <PaymentOptionsComponentsBankTransferBankAccountActionsComponent bankAccount={account} />
                    </div>
                    <div class={styles['bank-transfer__account__details']}>
                      <div class={styles['bank-transfer__account__details__img-hodler']}>
                        <img src={account.bank?.logo} />
                      </div>
                      <div class={styles['bank-transfer__account__details__info']}>
                        <p>
                          <strong>
                            {this.$t(I18nMessages['zidpay.activation.account.banckAccount.choose.beneficiary_name'])}
                          </strong>
                          {':'}
                          <span>{account.beneficiary_name}</span>
                        </p>
                        <p>
                          <strong>
                            {this.$t(I18nMessages['zidpay.activation.account.banckAccount.choose.account_number'])}
                          </strong>
                          {':'}
                          <span>{account.account_number}</span>
                        </p>
                        {account.iban && (
                          <p>
                            <strong>
                              {this.$t(I18nMessages['zidpay.activation.account.banckAccount.choose.iban'])}
                            </strong>
                            {':'}
                            <span>{account.iban}</span>
                          </p>
                        )}
                        {account.swift && (
                          <p>
                            <strong>
                              {this.$t(I18nMessages['zidpay.activation.account.banckAccount.choose.swift'])}
                            </strong>
                            {':'}
                            <span>{account.swift}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ZidBox>
          ) : (
            renderLoader(h)
          )}
        </ZidCardBody>
      </ZidCard>
    );
  }

  private get isLoading(): boolean {
    return [AppStoreReadyStateEnum.loading, AppStoreReadyStateEnum.pending].includes(
      BanksTransferStoreModule.loadingState,
    );
  }
  private get banksAccounts(): Array<BankAccount> {
    return BanksTransferStoreModule.data?.data.banksAccounts || [];
  }
}
