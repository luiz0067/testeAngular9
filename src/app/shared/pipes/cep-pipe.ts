import { formatToCEP } from '../helpers/utils.helper';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'cep' })
export class CpfPipe implements PipeTransform {

  transform(value: string | null) {
    return formatToCEP(value || '');
  }

}

