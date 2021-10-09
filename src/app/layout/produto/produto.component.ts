import { FormControl } from '@angular/forms';
import { ProdutoModalComponent } from './componentes/modal/produto-modal/produto-modal.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Produto } from './models/produto.model';
import { ProdutoService } from './services/produto.service';
import { debounceTime } from 'rxjs/operators';
import { Grupo } from '../grupo/models/grupo.model';
import { GrupoService } from '../grupo/services/grupo.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {

  produtos: Produto[] = [];
  produtosSearch: Produto[] = [];
  searchControlNome: FormControl = new FormControl();
  searchControlGrupoId: FormControl = new FormControl();
  grupoSearch: Grupo[] = [];

  // Para todos os service que o componente for usar precisa ser injetado recebendo pelo construtor
  constructor(
    private toastr: ToastrService,
    private produtoService: ProdutoService,
    private grupoService: GrupoService,
    private modalService: NgbModal
  ) {

    // pega os valueChange do campo de pesquisa, ai toda vez que o produto digitar no campo irá cair e nós filtramos o produto pelo nome
    // debounceTime(500) => cria um timeOut para entrar no subscribe apenas quando o produto para de digitar após 0.5segundos
    this.searchControlNome.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {

        // Chama a função para filtrar os produtos
        this.filtrarProdutos(value.toLocaleLowerCase(),this.searchControlGrupoId.value);

      });

      this.searchControlGrupoId.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {

        // Chama a função para filtrar os produtos
        this.filtrarProdutos(this.searchControlNome.value,value.toLocaleLowerCase());

      });
  }

  public async carregaGruposId(id:string): Promise<Grupo> {
    var id_integer:number;
    try{
      id_integer =Number.parseInt(id);
      return  await this.grupoService.buscarPorId(id_integer).toPromise() ;
    }    catch(e){
      return {} as Grupo;
    }
  }
  ngOnInit(): void {
    // Quando iniciar a tela carrega os produtos através da api
    this.carregaprodutosFromApi();
    this.carregaGruposFromApi();
  }
  public async carregaGruposFromApi(): Promise<void> {
    this.grupoSearch= await this.grupoService.buscarTodos().toPromise() ;
  }
  private filtrarProdutos(value: string,valueGroupid:string): void {
    // Filtra os produto e responde no array de produtos filtrados
    this.produtosSearch = this.produtos.filter(u =>
      // coloca o nome do produto em minusculo para ignorar os maiusculos dos minusculos
      u.descricao?.toLocaleLowerCase().includes(value)
      ||
      u.grupoId?.toString().includes(valueGroupid)
    );
  }

  private carregaprodutosFromApi(): void {
    // Chama o service de produtos para buscar todos
    //    .buscarTodos() retorna um Observable<produto[]>
    //    como a chamada é assincrona para capturar o resultado é preciso "se inscrever" para receber o retorno

    this.produtoService.buscarTodos()
      .subscribe(result => {
        // pega o retorno recebido pela api e joga na nossa lista de produtos
        this.produtos = result;

        // Chama a função para filtrar os produtos para trazer toda a lista
        this.filtrarProdutos('','');

      }, error => {
        // Deu erro na requisição
        this.toastr.error(error.message, 'Ops.');
      });
  }



  public abrirModal(produto: Produto | undefined): void {
    // Instancia o modal
    const modalRef = this.modalService.open(ProdutoModalComponent, { size: 'lg' });

    // Passa o parâmetro do produto para dentro
    modalRef.componentInstance.produto = produto;

    // Pega a resposta quando o produto salvar no modal
    modalRef.componentInstance.onSave.subscribe((result: Produto) => {
      this.toastr.success('Produto salvo com sucesso!');

      if (!produto?.id) {
        // Se não tiver id no produto de entrada então é uma insert
        this.produtos.push(result);
      } else {
        // Remove o produto anterior e insere o novo
        const idx = this.produtos.findIndex(u => u.id === result!.id);
        this.produtos.splice(idx, 1, result);
      }
      this.limpaPesquisa();
    });

    // Pega a resposta quando o produto excluír no modal
    modalRef.componentInstance.onDelete.subscribe(() => {
      this.toastr.success('Produto excluído com sucesso!');

      // Acha o produto no array inicial e demove ele
      const idx = this.produtos.findIndex(u => u.id === produto!.id);
      this.produtos.splice(idx, 1);
      this.limpaPesquisa();
    });
  }

  private limpaPesquisa(): void {
    this.searchControlNome?.setValue('');
    this.searchControlGrupoId?.setValue('');
  }

}
