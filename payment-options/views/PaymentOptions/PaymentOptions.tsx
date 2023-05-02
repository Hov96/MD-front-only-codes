import Vue, { CreateElement, VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { ZidBreadcrumb, ZidBreadcrumbItem, ZidPageHeader } from '@zidsa/ui';
import { I18nMessages } from '../../../i18n/messages';
import { PaymentOptionsComponentsPaymentOptionsComponent } from '../../components/PaymentOptions/PaymentOptions';

@Component
export class PaymentOptionsViewsPaymentOptionsComponent extends Vue {
  render(h: CreateElement): VNode {
    return (
      <div>
        <ZidPageHeader title={this.$t(I18nMessages['payment_options.title'])}>
          <template slot='breadcrumb'>
            <ZidBreadcrumb>
              <ZidBreadcrumbItem href={'/account/settings/'}>
                {this.$t(I18nMessages['sidebar.navigation_section.settings.title'])}
              </ZidBreadcrumbItem>
              <ZidBreadcrumbItem>{this.$t(I18nMessages['payment_options.title'])}</ZidBreadcrumbItem>
            </ZidBreadcrumb>
          </template>
        </ZidPageHeader>
        <div>
          <PaymentOptionsComponentsPaymentOptionsComponent />
        </div>
      </div>
    );
  }
}
