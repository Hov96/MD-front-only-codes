import Vue from 'vue';
import { ApiModelPaymentGatewayInterface } from '../../api/model/payment-gateway/payment-gateway.interface';
import AppStoreReadyStateEnum from '../../app/store/ready-state.enum';
import { PaymentGatewaysStoreModule } from '../store/payment-gateways-module';

export const PaymentGetwaysMixin = Vue.extend({
  computed: {
    paymentGateways(): Array<ApiModelPaymentGatewayInterface> {
      return PaymentGatewaysStoreModule.data?.data || [];
    },
    isLoading(): boolean {
      return [AppStoreReadyStateEnum.loading, AppStoreReadyStateEnum.pending].includes(
        PaymentGatewaysStoreModule.loadingState,
      );
    },
  },
  methods: {
    async fetchPaymentGetways(): Promise<void> {
      await PaymentGatewaysStoreModule.fetch();
    },
  },
});
