import { PaymentOptionsApiService } from './service';
import ApiClientFactory from '../../api/client-factory';

const service = new PaymentOptionsApiService(ApiClientFactory());

export function PaymentOptionsApiServiceFactory(): typeof service {
  return service;
}
