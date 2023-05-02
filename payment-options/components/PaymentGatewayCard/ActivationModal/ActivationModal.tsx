import Vue, { CreateElement, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import {
  ZidButton,
  ZidCard,
  ZidCardBody,
  ZidCardHeader,
  ZidCheckbox,
  ZidForm,
  ZidHeading,
  ZidModal,
  ZidSwitch,
  ZidText,
} from '@zidsa/ui';
import { I18nMessages } from '../../../../i18n/messages';
import { ButtonSizeEnum, ButtonTypeEnum } from '@zidsa/ui/types/enums';
import { PaymentGatewayEnum } from '../../../../api/model/payment-gateway/type.enum';
import { PaymentGatewayStoreModule } from '../../../store/payment-gateway/payment-gateway-module';
import { PaymentGatewaysStoreModule } from '../../../store/payment-gateways-module';
import { PaymentOptionsTypesPaymentGatewayInfoInterface } from '../../../types/payment-gateways-info.interface';
import { InputCheckboxChangeEventInterface } from '../../../../common/components/Input/Checkbox/change-event.interface';
import { ApiModelPaymentGatewayInterface } from '../../../../api/model/payment-gateway/payment-gateway.interface';
import { PaymentOptionsComponentsPaymentGatewayCardActivationModalTapFormComponent } from './TapForm/TapForm';
import { PaymentOptionsComponentsPaymentGatewayCardActivationModalMoyasarFormComponent } from './MoyasarForm/MoyasarForm';
import { PaymentOptionsComponentsPaymentGatewayCardActivationModalPaytapsFormComponent } from './PaytapsForm/PaytapsForm';
import { PaymentOptionsComponentsPaymentGatewayCardActivationModalNetworksComponent } from './Networks/Networks';
import showNotification from '../../../../common/helpers/show-notification/show-notification';
import NotificationTypeEnum from '../../../../notifications/components/type.enum';
import parentStyles from '../PaymentGatewayCard.scss';
import { CurrentMerchantRequest } from '../../../../Finance/types/CurrentMerchantRequest';
import { FinanceMarketingPageStoreModule } from '../../../../Finance/store/marketing-page-module';
import { CurrentStepEnum } from '../../../../Finance/types/current-step-enum';
import { StepStatusEnum } from '../../../../Finance/types/step-status-enum';

import styles from './ActivationModal.scss';

@Component
export class PaymentOptionsComponentsPaymentGatewayCardActivationModalComponent extends Vue {
  @Prop()
  private paymentGateway!: ApiModelPaymentGatewayInterface;

  @Prop()
  private readonly paymentGatewayInfo!: PaymentOptionsTypesPaymentGatewayInfoInterface;

  private visible = false;
  private isSubmitting = false;
  private isConfirmed = false;
  private validateCountryCode = false;
  private validateNetworks = false;

  private get currentRequestStatus(): CurrentMerchantRequest | null {
    return FinanceMarketingPageStoreModule.merchantStatus;
  }
  private get disablePaymentGateways(): boolean | undefined {
    return (
      this.currentRequestStatus?.currentStep === CurrentStepEnum.FundingDeposits &&
      this.currentRequestStatus?.financingRequestStatus.id === StepStatusEnum.AmountDeposited &&
      (this.currentRequestStatus?.remainingAmount as number) !== 0
    );
  }

  render(h: CreateElement): VNode {
    return (
      <div>
        <ZidButton
          class={parentStyles['payment-gateway__activation-way__button']}
          size={ButtonSizeEnum.default}
          type={ButtonTypeEnum.secondary}
          onClick={(): any => this.showModal()}
          disabled={this.disablePaymentGateways}
        >
          {this.paymentGateway && this.paymentGateway.is_enabled
            ? this.$t(I18nMessages['common.setup.edit'])
            : this.$t(I18nMessages['common.actions.activate'])}
        </ZidButton>
        <ZidModal class={styles['activation-modal']} visible={this.visible} dismissible={false} onClose={this.onClose}>
          <ZidCard>
            <ZidCardHeader class={styles['activation-modal__header']}>
              <div class={styles['activation-modal__header__box']}>
                <ZidHeading
                  level={6}
                  weight={'semibold'}
                  type={'secondary'}
                  class={styles['activation-modal__header__box__title']}
                >
                  {this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.title'])}
                  <span>{'-'}</span>
                  {this.$t(
                    I18nMessages[`common.payment_gateway.${this.paymentGatewayInfo.code}` as keyof typeof I18nMessages],
                  )}
                </ZidHeading>
                <ZidSwitch
                  key={'bankTransferStatus'}
                  isSwitched={PaymentGatewayStoreModule.data.is_enabled}
                  onChange={PaymentGatewayStoreModule.setIsEnabled}
                />
              </div>
            </ZidCardHeader>
            <ZidCardBody class={styles['activation-modal__body']}>
              <ZidForm
                onSubmit={this.activaitePaymentGateway}
                submitType='primary'
                submitting={this.isSubmitting}
                isDisabled={!this.isConfirmed}
              >
                <div class={styles['activation-modal__step']}>
                  <ZidText type={'dark'} class={styles['activation-modal__step__title']}>
                    <span>{'1.'}</span>
                    {this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.step_1'])}
                    <span class={styles['activation-modal__step__help-center']}>
                      <a href={`https://help.zid.sa/${this.paymentGatewayInfo.code}_actvation`} target='_blank'>
                        {this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.help_center'])}{' '}
                      </a>
                    </span>
                  </ZidText>
                </div>
                <div class={styles['activation-modal__step']}>
                  <ZidText type={'dark'} class={styles['activation-modal__step__title']}>
                    <span>{'2.'}</span>
                    {this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.step_2'])}
                  </ZidText>
                  {this.renderForm(h)}
                </div>
                <PaymentOptionsComponentsPaymentGatewayCardActivationModalNetworksComponent
                  paymentGatewayInfo={this.paymentGatewayInfo}
                  validateNetworks={this.validateNetworks}
                  onResetValidateNetworks={this.resetValidateNetworks}
                />
                <div class={styles['activation-modal__step']}>
                  <ZidText type={'dark'} class={styles['activation-modal__step__title']}>
                    <span>{'4.'}</span>
                    {this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.step_4'])}{' '}
                    <ZidText type={'dark'}>
                      {this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.step_4.contact'])}{' '}
                      {this.$t(
                        I18nMessages[
                          `payment_options.payment_gateways.${this.paymentGatewayInfo.code}.title` as keyof typeof I18nMessages
                        ],
                      )}
                    </ZidText>
                  </ZidText>
                </div>
                <div class={styles['activation-modal__step']}>
                  <ZidCheckbox
                    isChecked={this.isConfirmed}
                    onChange={this.onChangeConfirmation}
                    class={[styles['activation-modal__step__title'], styles['activation-modal__step__checkbox']]}
                  >
                    {this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.confirm'])}
                  </ZidCheckbox>
                </div>
              </ZidForm>
            </ZidCardBody>
          </ZidCard>
        </ZidModal>
      </div>
    );
  }

  private renderForm(h: CreateElement): VNode {
    switch (this.paymentGatewayInfo.code) {
      case PaymentGatewayEnum.tap:
        return this.renderTapForm(h);
        break;
      case PaymentGatewayEnum.moyasar:
        return this.renderMoyasarForm(h);
        break;
      case PaymentGatewayEnum.paytabs:
        return this.renderPaytapsForm(h);
      default:
        return <div></div>;
        break;
    }
  }

  private renderTapForm(h: CreateElement): VNode {
    return (
      <PaymentOptionsComponentsPaymentGatewayCardActivationModalTapFormComponent
        paymentGateway={PaymentGatewayStoreModule.data}
        onSubmit={this.activaitePaymentGateway}
        isSubmitting={this.isSubmitting}
      />
    );
  }

  private renderPaytapsForm(h: CreateElement): VNode {
    return (
      <PaymentOptionsComponentsPaymentGatewayCardActivationModalPaytapsFormComponent
        paymentGateway={PaymentGatewayStoreModule.data}
        onResetValidateCountryCode={this.resetValidateCountryCode}
        validateCountryCode={this.validateCountryCode}
      />
    );
  }

  private renderMoyasarForm(h: CreateElement): VNode {
    return (
      <PaymentOptionsComponentsPaymentGatewayCardActivationModalMoyasarFormComponent
        paymentGateway={PaymentGatewayStoreModule.data}
      />
    );
  }

  private showModal(): void {
    if (this.disablePaymentGateways) return;
    if (this.paymentGateway) {
      PaymentGatewayStoreModule.setPaymentGateway(this.paymentGateway);
    } else PaymentGatewayStoreModule.setPaymentGatewayCode(this.paymentGatewayInfo.code);

    this.visible = true;
  }
  private onClose(): void {
    this.visible = false;
  }

  private onChangeConfirmation(event: InputCheckboxChangeEventInterface): void {
    this.isConfirmed = event.isChecked;
  }

  private resetValidateCountryCode(): void {
    this.validateCountryCode = false;
  }

  private resetValidateNetworks(): void {
    this.validateNetworks = false;
  }

  private isPaymentNetworksValid(): boolean {
    return !PaymentGatewayStoreModule.data?.settings?.payment_options?.length;
  }

  private async activaitePaymentGateway(): Promise<void> {
    if (this.paymentGatewayInfo.code === PaymentGatewayEnum.paytabs && this.validateCountryCode) {
      this.validateCountryCode = true;
      return;
    }

    if (this.isPaymentNetworksValid()) {
      this.validateNetworks = true;
      return;
    }

    this.isSubmitting = true;
    const response = await PaymentGatewayStoreModule.updatePaymentGateway();

    if (response.status === 'success') {
      showNotification(
        this.$t(I18nMessages['payment_options.payment_gateways.gateway.modal.success']).toString(),
        NotificationTypeEnum.success,
      );
    }
    PaymentGatewaysStoreModule.fetch();
    this.isSubmitting = false;
  }
}
