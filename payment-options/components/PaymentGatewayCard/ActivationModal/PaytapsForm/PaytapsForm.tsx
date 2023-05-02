import { CreateElement, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import {
  ZidCol,
  ZidInput,
  ZidRow,
  ZidSelect,
  ZidSelectBody,
  ZidSelectHeader,
  ZidSelectOption,
  ZidText,
} from '@zidsa/ui';
import { CountriesCommonMixin } from '../../../../../mixins/countries/countries.mixin';
import { I18nMessages } from '../../../../../i18n/messages';
import { PaymentGatewayStoreModule } from '../../../../store/payment-gateway/payment-gateway-module';
import { ApiModelPaymentGatewayInterface } from '../../../../../api/model/payment-gateway/payment-gateway.interface';
import ApiModelCountryInterface from '../../../../../api/model/country.interface';

import styles from '../ActivationModal.scss';

@Component
export class PaymentOptionsComponentsPaymentGatewayCardActivationModalPaytapsFormComponent extends CountriesCommonMixin {
  @Prop({
    required: true,
  })
  private readonly paymentGateway!: ApiModelPaymentGatewayInterface | null;

  @Prop()
  private readonly validateCountryCode!: false;

  created(): void {
    this.fetchCountires();
  }

  render(h: CreateElement): VNode {
    return (
      <ZidRow cols={1} cols-md={2}>
        <ZidCol class={styles['activation-modal__form-group']}>
          <ZidText tyep={'dark'}>
            {this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.labels.profile_id'])}
          </ZidText>
          <ZidInput
            name='profile_id'
            type='text'
            value={this.paymentGateway?.settings.profile_id}
            class={styles['activation-modal__form-group__input']}
            validation={'required'}
            onChange={PaymentGatewayStoreModule.setProfileId}
          />
        </ZidCol>
        <ZidCol class={styles['activation-modal__form-group']}>
          <ZidText tyep={'dark'}>
            {this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.labels.server_key'])}
          </ZidText>
          <ZidInput
            name='server_key'
            type='text'
            value={this.paymentGateway?.settings.server_key}
            class={styles['activation-modal__form-group__input']}
            validation={'required'}
            onChange={PaymentGatewayStoreModule.setServerKey}
          />
        </ZidCol>
        <ZidCol class={styles['activation-modal__form-group']}>
          <ZidText tyep={'dark'}>
            {this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.labels.client_key'])}
          </ZidText>
          <ZidInput
            name='client_key'
            type='text'
            value={this.paymentGateway?.settings.client_key}
            class={styles['activation-modal__form-group__input']}
            validation={'required'}
            onChange={PaymentGatewayStoreModule.setClientKey}
          />
        </ZidCol>
        <ZidCol class={styles['activation-modal__form-group']}>
          <ZidText tyep={'dark'}>{this.$t(I18nMessages['common.address.country'])}</ZidText>
          <ZidSelect
            value={
              this.paymentGateway?.settings?.country_code
                ? { value: this.paymentGateway?.settings?.country_code }
                : null
            }
            onChange={this.onChangeCountryCode}
            loading={this.isCountriesLoading}
            class={styles['activation-modal__select']}
          >
            <ZidSelectHeader class={styles['activation-modal__select__header']}>
              {this.paymentGateway?.settings?.country_code
                ? this.getCountryNameByCode(this.paymentGateway.settings.country_code)
                : this.$t(I18nMessages['common.address.country.choose'])}
            </ZidSelectHeader>
            <ZidSelectBody class={styles['activation-modal__select__body']}>
              {this.countries.map((country: ApiModelCountryInterface) => (
                <ZidSelectOption
                  value={{ ...country, label: country.name, value: country.code }}
                  selected={this.paymentGateway?.settings?.country_code}
                >
                  {country.name}
                </ZidSelectOption>
              ))}
            </ZidSelectBody>
          </ZidSelect>
          {this.validateCountryCode && (
            <p class={styles['activation-modal__required-field']}>
              {this.$t(I18nMessages['common.validations.field_required'])}
            </p>
          )}
        </ZidCol>
      </ZidRow>
    );
  }

  private onChangeCountryCode(country: ApiModelCountryInterface): void {
    PaymentGatewayStoreModule.setCountryCode(country.code);
    this.$emit('resetValidateCountryCode');
  }
}
