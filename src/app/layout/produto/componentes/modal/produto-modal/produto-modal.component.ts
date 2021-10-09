import { Grupo } from './../../../../grupo/models/grupo.model';
import { validateAllFormFields } from '../../../../../shared/helpers/iu.helper';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ProdutoService } from '../../../services/produto.service';
import { Produto, Preco } from '../../../models/produto.model';
import { Component, createPlatform, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { hasErrors } from 'src/app/shared/helpers/iu.helper';
import { GrupoService } from '../../../../grupo/services/grupo.service';
import { GrupoComponent } from '../../../../grupo/grupo.component';

@Component({
  selector: 'app-produto-modal',
  templateUrl: './produto-modal.component.html',
  styleUrls: ['./produto-modal.component.scss']
})
export class ProdutoModalComponent implements OnInit {

  // Parâmetro para receber o usuário como entrada

  @Input()
  produto: Produto | undefined;

  // Função para emitir de volta que o usuário for salvo (emite o novo usuário inserido/alterado)
  @Output()
  onSave: EventEmitter<Produto> = new EventEmitter<Produto>();

  // Função para emitir de volta que o usuário for excluído
  @Output()
  grupoSearch: Grupo[] = [];

  @Output()
  onDelete: EventEmitter<void> = new EventEmitter<void>();

  formGroup?: FormGroup;


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private produtoService: ProdutoService,
    private grupoService: GrupoService

  ) { }

  ngOnInit(): void {
    this.createForm(this.produto || {} as Produto);
    this.carregaGruposFromApi();
  }

  createFormPreco(preco: Preco) :FormGroup{
    return this.formBuilder.group({
      custo: [
        preco.custo,
        Validators.compose([Validators.min(0.00), Validators.max(999999999)])
      ],
      venda: [
        preco.venda,
        Validators.compose([Validators.min(0.01), Validators.max(999999999)])
      ],
    });
  }



  createForm(produto: Produto) {
    this.formGroup = this.formBuilder.group({
      descricao: [
        { value: produto.descricao, disabled: produto.id !== undefined },
        Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])
      ],
      estoque: [
        produto.estoque,
        Validators.compose([Validators.required, Validators.min(0), Validators.max(999999999)])
      ],
      preco: this.createFormPreco(produto.preco||{}),
      grupoId: [
        produto.grupoId,
        Validators.compose([Validators.required])
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
    const produtoForm = this.formGroup?.getRawValue();
    // Faz o merge dos objeto usuário inicial com os campos alterados na tela
    const produto = { ...this.produto, ...produtoForm };

    // Chama o service para salvar na API
    this.produtoService.salvar(produto)
      .subscribe(result => {
        // Emite o evento que salvou com sucesso e passa o usuário que retornou do serviço atualizado
        this.onSave.emit(result);

        // Fecha o modal
        this.activeModal.close();
      }, error => {
        this.toastr.error(error.message);
      });

  }

  public excluir(): void {
    this.produtoService.excluir(this.produto!.id!).subscribe(() => {
      // Emite o evento que excluiu
      this.onDelete.emit();

      // Fecha o modal
      this.activeModal.close();
    }, error => {
      this.toastr.error(error.message);
    });
  }


  public async carregaGruposFromApi(): Promise<void> {
    this.grupoSearch= await this.grupoService.buscarTodos().toPromise() ;
  }



  get descricao() {
    return this.formGroup?.get('descricao');
  }

  get grupoId() {
    return this.formGroup?.get('grupoId');
  }

  get preco_venda() {
    return this.formGroup?.get('preco_venda');
  }

  get preco_custo() {
    return this.formGroup?.get('preco_custo');
  }

  get estoque() {
    return this.formGroup?.get('estoque');
  }

  hasErrors = hasErrors;
  public getControl(controlName: string): AbstractControl {
    return this.formGroup?.get(controlName)!;
  }

}
