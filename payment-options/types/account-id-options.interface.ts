import { TranslateResult } from 'vue-i18n';
import { InputSelectOptionInterface } from '../../common/components/Input';

export interface AccountIdOPtions extends Omit<InputSelectOptionInterface, 'label'> {
  label: TranslateResult;
}
