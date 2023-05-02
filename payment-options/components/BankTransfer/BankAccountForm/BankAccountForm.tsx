import Vue, { CreateElement, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import {
  ZidCheckbox,
  ZidForm,
  ZidInput,
  ZidSelect,
  ZidSelectBody,
  ZidSelectHeader,
  ZidSelectOption,
  ZidText,
} from '@zidsa/ui';
import { Banck } from '../../../../zidpay/types/BankAccount.interface';
import { I18nMessages } from '../../../../i18n/messages';
import { BankAccountStoreModule } from '../../../store/bank-account/bank-account-module';
import { BanksStoreModule } from '../../../store/banks-module';
import AppStoreReadyStateEnum from '../../../../app/store/ready-state.enum';
import { BankAccountData } from '../../../types/account-bank-data.interface';
import { InputSelectOptionInterface } from '../../../../common/components/Input';
import { AccountIdOptionsActionsComponent } from '../../../../payment-options/components/BankTransfer/BankAccountForm/_accountIdOptions/index';
import styles from './BankAccountForm.scss';
import ApiModelUserInterface from '../../../../api/model/user.interface';
import UserStoreModule from '../../../../user/store/module';
@Component
export class PaymentOptionsComponentsBankTransferBankAccountFormComponent extends Vue {
  private activBankOption = 'iban';
  @Prop({
    required: true,
  })
  private readonly bankAccountData!: BankAccountData;

  @Prop()
  private readonly isSubmitting!: false;

  @Prop()
  private readonly validateBankId!: false;

  private bankLabel = '';

  async created(): Promise<void> {
    await BanksStoreModule.fetch();
    this.bankLabel = this.bankName();
    if (this.user?.store.subscription.package_key === 'starter') {
      this.bankAccountData.is_visible = false;
    }
  }
  private changeOption(optionValue: { type: string }): void {
    this.activBankOption = optionValue.type;
    if (this.activBankOption === 'iban') {
      console.log('iban');
      this.bankAccountData.swift = '';
    } else if (this.activBankOption === 'swift') {
      this.bankAccountData.iban = '';
      console.log('swift');
    }
  }

  private get user(): ApiModelUserInterface | null {
    return UserStoreModule?.data;
  }

  render(h: CreateElement): VNode {
    return (
      <div>
        <div class={styles['bank-account-form__field-group']}>
          <ZidText type={'dark'}>{this.$t(I18nMessages['zidpay.activation.account.banckAccount.choose.bank'])}</ZidText>
          <ZidSelect
            value={{ value: this.bankAccountData?.bank_id }}
            onChange={this.onChangeBank}
            loading={this.isLoading}
            class={styles['bank-account-form__field-group__input']}
          >
            <ZidSelectHeader class={styles['bank-account-form__select__header']}>{this.bankLabel}</ZidSelectHeader>
            <ZidSelectBody class={styles['bank-account-form__select__body']}>
              {this.banksList?.map((bank) => (
                <ZidSelectOption value={{ ...bank, label: bank.name, value: bank.id }}>{bank.name}</ZidSelectOption>
              ))}
            </ZidSelectBody>
          </ZidSelect>
          {this.validateBankId && (
            <p class={styles['bank-account-form__required-field']}>
              {this.$t(I18nMessages['common.validations.field_required'])}
            </p>
          )}
        </div>

        <ZidForm
          class={styles['bank-account-form']}
          onSubmit={this.validateForm}
          submitting={this.isSubmitting}
          submitType='primary'
        >
          <div class={styles['bank-account-form__field-group']}>
            <ZidText type={'dark'}>{this.$t(I18nMessages['zidpay.transaction.refund.customer.name'])}</ZidText>
            <ZidInput
              type='text'
              name='beneficiary_name'
              value={this.bankAccountData?.beneficiary_name}
              onChange={BankAccountStoreModule.setBeneficiaryName}
              class={styles['bank-account-form__field-group__input']}
              validation='required'
            />
          </div>
          <div class={styles['bank-account-form__field-group']}>
            <ZidText type={'dark'}>
              {this.$t(I18nMessages['zidpay.activation.account.banckAccount.choose.account_number'])}
            </ZidText>
            <ZidInput
              name='account_number'
              type='number'
              value={this.bankAccountData?.account_number}
              onChange={BankAccountStoreModule.setAccountNumber}
              class={styles['bank-account-form__field-group__input']}
              validation='minLength:5|maxLength:50|required'
            />
          </div>
          <AccountIdOptionsActionsComponent
            activBankOption={this.activBankOption}
            onChangeBankOption={this.changeOption}
          />
          <div>
            {(this.activBankOption == 'iban' || this.activBankOption == 'all') && (
              <div class={styles['bank-account-form__field-group']} key='iban'>
                <ZidText htmlfor={'iban'} type={'dark'}>
                  {this.$t(I18nMessages['payment_options.bank_transfer.form.labels.iban'])}
                </ZidText>
                <ZidInput
                  name='iban'
                  type='text'
                  value={this.bankAccountData?.iban}
                  onChange={BankAccountStoreModule.setIban}
                  class={styles['bank-account-form__field-group__input']}
                  validation={'minLength:22|maxLength:34|required'}
                  placeholder={this.$t(I18nMessages['payment_options.bank_transfer.form.labels.iban.placeholder'])}
                />
              </div>
            )}
            {(this.activBankOption == 'swift' || this.activBankOption == 'all') && (
              <div class={styles['bank-account-form__field-group']} key='swift'>
                <ZidText htmlfor={'swift'} type={'dark'}>
                  {this.$t(I18nMessages['payment_options.bank_transfer.form.labels.swift'])}{' '}
                </ZidText>
                <ZidInput
                  name='swift'
                  type='text'
                  value={this.bankAccountData?.swift}
                  onChange={BankAccountStoreModule.setSwift}
                  class={styles['bank-account-form__field-group__input']}
                  validation={'minLength:8|maxLength:11|required'}
                  placeholder={this.$t(I18nMessages['payment_options.bank_transfer.form.labels.swift.placeholder'])}
                />
              </div>
            )}
          </div>
          <div class={styles['bank-account-form__field-group']}>
            <ZidCheckbox
              class={styles['bank-account-form__checkbox']}
              isChecked={this.bankAccountData?.is_visible}
              onChange={BankAccountStoreModule.setIsVisible}
              disabled={this.user?.store.subscription.package_key === 'starter'}
            >
              {this.$t(I18nMessages['payment_options.bank_transfer.form.labels.is_visible'])}
            </ZidCheckbox>
          </div>
        </ZidForm>
      </div>
    );
  }

  private get isLoading(): boolean {
    return [AppStoreReadyStateEnum.loading, AppStoreReadyStateEnum.pending].includes(BanksStoreModule.loadingState);
  }

  private get banksList(): Array<Banck> {
    return BanksStoreModule.data?.data || [];
  }

  private async onChangeBank(event: InputSelectOptionInterface): Promise<void> {
    await BankAccountStoreModule.setBankId(event);
    this.bankLabel = this.bankName();
    this.$emit('resetValidateBankId');
  }

  private validateForm(): void {
    this.$emit('submit');
  }

  private bankName(): string {
    return (
      this.banksList.find((bank) => bank.id === this.bankAccountData?.bank_id)?.name ||
      (this.$t(I18nMessages['zidpay.transaction.refund.offline.bank.default']) as string)
    );
  }
}
