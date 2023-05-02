import Vue, { CreateElement, VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { AnchorButton } from '../../../../common/components/AnchorButton/AnchorButton';
import { AnchorButtonSizeEnum } from '../../../../common/components/AnchorButton/size.enum';
import { AnchorButtonTypeEnum } from '../../../../common/components/AnchorButton/type.enum';
import { I18nMessages } from '../../../../i18n/messages';
import unlock from './images/unlock.svg';

import styles from './UpgradePaymentComponents.scss';

@Component
export class UpgradePaymentComponents extends Vue {
  render(h: CreateElement): VNode {
    return (
      <div class={styles['payment-upgrade']}>
        <h2>{this.$t(I18nMessages['payment_options.upgrade_payment.header'])}</h2>
        <p>{this.$t(I18nMessages['payment_options.upgrade_payment.info'])}</p>
        <div class={styles['payment-upgrade__logos']}>
          <div class={styles['payment-upgrade__logos-list']}>{this.renderCompaniesList(h)}</div>
        </div>
        <AnchorButton
          type={AnchorButtonTypeEnum.primary}
          size={AnchorButtonSizeEnum.default}
          href='/subscriptions'
          class={styles['payment-upgrade__link']}
        >
          <img src={unlock} />
          <span>{this.$t(I18nMessages['upgrade.link'])}</span>
        </AnchorButton>
      </div>
    );
  }
  private renderCompaniesList(h: CreateElement): VNode[] {
    const limitLength = 7;
    return Array.from({ length: limitLength }, (_, i) => {
      return (
        <div>
          <img src={require(`./images/companies/${i + 1}.jpg`)} alt={`company-logo${i + 1}`} />
        </div>
      );
    });
  }
}
