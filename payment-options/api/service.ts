import ApiClient from '../../api/client';
import ApiHttpMethodEnum from '../../api/http-method.enum';
import { paymentOptionsApiUrls } from './urls';
import { PaymentOptionsApiBanksResponseInterface } from './banks/response.interface';
import { PaymentOptionsApiBanksTransferResponseInterface } from './banks-transfer/response.interface';
import { PaymentOptionsApiPaymentGatewaysResponseInterface } from './gateways/response.interface';
import { urlFormatParams } from '../../common/helpers/url/format-params';
import { ApiBaseDataResponseObjectType, ApiBaseResponseType, ApiResponseType } from '../../api/types';
import { BankAccountData } from '../types/account-bank-data.interface';
import { PaymentGatewayData } from '../types/payment-gateway-data.interface';

export class PaymentOptionsApiService {
  constructor(private readonly apiClient: ApiClient) {}

  public async getBanks(): Promise<PaymentOptionsApiBanksResponseInterface> {
    const response = await this.apiClient.request<PaymentOptionsApiBanksResponseInterface>(
      ApiHttpMethodEnum.get,
      paymentOptionsApiUrls.banks,
    );

    return response.data;
  }

  public async getBanksAccounts(): Promise<ApiResponseType<PaymentOptionsApiBanksTransferResponseInterface>> {
    const response = await this.apiClient.request<PaymentOptionsApiBanksTransferResponseInterface>(
      ApiHttpMethodEnum.get,
      paymentOptionsApiUrls.banksAccounts,
      { cacheable: true },
    );

    return response;
  }

  public async getPaymentGateways(): Promise<ApiResponseType<PaymentOptionsApiPaymentGatewaysResponseInterface>> {
    const response = await this.apiClient.request<PaymentOptionsApiPaymentGatewaysResponseInterface>(
      ApiHttpMethodEnum.get,
      paymentOptionsApiUrls.gateways,
      { cacheable: true },
    );

    return response;
  }

  public async updatePaymentGateway(
    paymentGatewayCode: string,
    data: PaymentGatewayData,
  ): Promise<ApiBaseDataResponseObjectType<PaymentGatewayData>> {
    const url = urlFormatParams(paymentOptionsApiUrls.updateGateway, {
      paymentGatewayCode,
    });

    const response = await this.apiClient.request<ApiBaseDataResponseObjectType<PaymentGatewayData>>(
      ApiHttpMethodEnum.post,
      url,
      { data },
    );
    return response.data;
  }

  public async addBankAccount(data: BankAccountData): Promise<ApiBaseDataResponseObjectType<BankAccountData>> {
    const response = await this.apiClient.request<ApiBaseDataResponseObjectType<BankAccountData>>(
      ApiHttpMethodEnum.post,
      paymentOptionsApiUrls.addBankAccount,
      { data },
    );
    return response.data;
  }

  public async editBankAccount(
    bankAccountId: string,
    data: BankAccountData,
  ): Promise<ApiBaseDataResponseObjectType<BankAccountData>> {
    const url = urlFormatParams(paymentOptionsApiUrls.editBankAccount, {
      bankAccountId,
    });
    // eslint-disable-next-line @typescript-eslint/camelcase
    data = { ...data, bank_id: data.bank_id };
    const response = await this.apiClient.request<ApiBaseDataResponseObjectType<BankAccountData>>(
      ApiHttpMethodEnum.post,
      url,
      { data },
    );
    return response.data;
  }

  public async toggleBankTransferMethodStatus(): Promise<ApiBaseDataResponseObjectType> {
    const response = await this.apiClient.request<ApiBaseDataResponseObjectType>(
      ApiHttpMethodEnum.post,
      paymentOptionsApiUrls.banksAccountsStatus,
    );
    return response.data;
  }

  public async deleteBankAccount(bankAccountId: string): Promise<ApiBaseResponseType> {
    const url = urlFormatParams(paymentOptionsApiUrls.deletebankAccount, {
      bankAccountId,
    });
    const response = await this.apiClient.request<ApiBaseResponseType>(ApiHttpMethodEnum.delete, url);

    return response.data;
  }
}
