import { isCPF, isCEP } from './utils.helper';
import { AbstractControl, Validators } from '@angular/forms';
import { GrupoService } from '../../layout/grupo/services/grupo.service';

export class GenericValidator {

  static isValidCpf() {
    return (control: AbstractControl): Validators | null => {
      if (control.value) {
        if (!isCPF(control.value)) {
          return { cpfNotValid: true };
        }
      }
      return null;
    };
  }

  static isValidCep() {
    return (control: AbstractControl): Validators | null => {
      if (control.value) {
        if (!isCEP(control.value)) {
          return { cepNotValid: true };
        }
      }
      return null;
    };
  }

 /* static isValidGrupo() {
    return (control: AbstractControl): Validators | null => {
      if (control.value) {
        if (!isGrupo(control.value)) {
          return { grupoNotValid: true };
        }
      }
      return null;
    };
  }*/
}
