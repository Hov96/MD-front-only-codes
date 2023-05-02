import Vue, { CreateElement, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { I18nMessages } from '../../../../../../src/i18n/messages';
import { AccountIdOPtions } from '../../../../../payment-options/types/account-id-options.interface';
import style from './_AccountOptions.scss';

@Component
export class AccountIdOptionsActionsComponent extends Vue {
  @Prop({ type: String, default: '' }) private readonly activBankOption!: string;

  private options: Array<AccountIdOPtions> = [
    {
      label: this.$t(I18nMessages['payment_options.bank_transfer.form.option.iban']),
      value: 'iban',
    },
    {
      label: this.$t(I18nMessages['payment_options.bank_transfer.form.option.swift']),
      value: 'swift',
    },
    {
      label: this.$t(I18nMessages['common.all']),
      value: 'all',
    },
  ];

  private changeOptionBank(option: AccountIdOPtions): void {
    this.$emit('changeBankOption', { type: option.value });
  }

  render(h: CreateElement): VNode {
    return (
      <div class={style['bank-items']}>
        {this.options.map((option, i) => (
          <div
            class={`${style['bank-items__option']} ${
              option.value == this.activBankOption ? style['bank-items__option--active'] : null
            }`}
            key={`tag_${i}`}
            onClick={(): void => this.changeOptionBank(option)}
          >
            {option.label}
          </div>
        ))}
      </div>
    );
  }
}
