import { validateAllFormFields } from '../../../../../shared/helpers/iu.helper';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GrupoService } from '../../../services/grupo.service';
import { Grupo } from '../../../models/grupo.model';
import { Component, createPlatform, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { hasErrors } from 'src/app/shared/helpers/iu.helper';
import { ProdutoService } from '../../../../produto/services/produto.service';


@Component({
  selector: 'app-grupo-modal',
  templateUrl: './grupo-modal.component.html',
  styleUrls: ['./grupo-modal.component.scss']
})
export class GrupoModalComponent implements OnInit {

  // Parâmetro para receber o usuário como entrada
  @Input()
  grupo: Grupo | undefined;

  // Função para emitir de volta que o usuário for salvo (emite o novo usuário inserido/alterado)
  @Output()
  onSave: EventEmitter<Grupo> = new EventEmitter<Grupo>();

  // Função para emitir de volta que o usuário for excluído
  @Output()
  onDelete: EventEmitter<void> = new EventEmitter<void>();

  formGroup?: FormGroup;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private grupoService: GrupoService,
    private produtoService: ProdutoService
  ) { }

  ngOnInit(): void {
    this.createForm(this.grupo || {} as Grupo);
  }

  createForm(grupo: Grupo) {
    this.formGroup = this.formBuilder.group({
      descricao: [
        { value: grupo.descricao, disabled: grupo.id !== undefined },
        Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])
      ],
    });
  }

  public salvar(): void {
    if (this.formGroup?.invalid) {
      this.toastr.error('Campos inválidos ou não preenchidos!');
      validateAllFormFields(this.formGroup);
      return;
    }

    // Pega as informações que estão no formGroup (que são os campos da tela)
    const grupoForm = this.formGroup?.getRawValue();
    // Faz o merge dos objeto usuário inicial com os campos alterados na tela
    const grupo = { ...this.grupo, ...grupoForm };

    // Chama o service para salvar na API
    this.grupoService.salvar(grupo)
      .subscribe(result => {
        // Emite o evento que salvou com sucesso e passa o usuário que retornou do serviço atualizado
        this.onSave.emit(result);

        // Fecha o modal
        this.activeModal.close();
      }, error => {
        this.toastr.error(error.message);
      });

  }

  public async excluir(): Promise<void> {
    const filhos= await this.produtoService.buscarPorGrupo(this.grupo!.id!).toPromise() ;
    if(filhos.length===0){
      this.grupoService.excluir(this.grupo!.id!).subscribe(() => {
        // Emite o evento que excluiu

        this.onDelete.emit();

        // Fecha o modal
        this.activeModal.close();
      }, error => {
        this.toastr.error(error.message);
      });
    }
    else this.toastr.error('Existe produtos cadastrados neste Grupo!');
  }

  get descricao() {
    return this.formGroup?.get('descricao');
  }

  hasErrors = hasErrors;

}
