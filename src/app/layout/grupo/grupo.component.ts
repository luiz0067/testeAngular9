import { FormControl } from '@angular/forms';
import { GrupoModalComponent } from './componentes/modal/grupo-modal/grupo-modal.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Grupo } from './models/grupo.model';
import { GrupoService } from './services/grupo.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.scss']
})
export class GrupoComponent implements OnInit {

  grupos: Grupo[] = [];
  gruposSearch: Grupo[] = [];
  searchControl: FormControl = new FormControl();

  // Para todos os service que o componente for usar precisa ser injetado recebendo pelo construtor
  constructor(
    private toastr: ToastrService,
    private grupoService: GrupoService,
    private modalService: NgbModal
  ) {

    // pega os valueChange do campo de pesquisa, ai toda vez que o usuário digitar no campo irá cair e nós filtramos o usuário pelo nome
    // debounceTime(500) => cria um timeOut para entrar no subscribe apenas quando o usuário para de digitar após 0.5segundos
    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {

        // Chama a função para filtrar os grupos
        this.filtrarGrupos(value.toLocaleLowerCase());

      });
  }

  ngOnInit(): void {
    // Quando iniciar a tela carrega os usuários através da api
    this.carregagruposFromApi();

  }

  private filtrarGrupos(value: string): void {
    // Filtra os usuário e responde no array de usuários filtrados
    this.gruposSearch = this.grupos.filter(u =>
      // coloca o nome do usuário em minusculo para ignorar os maiusculos dos minusculos
      u.descricao?.toLocaleLowerCase().includes(value)
    );
  }

  private filtrarGruposPorID(value: string): void {
    // Filtra os usuário e responde no array de usuários filtrados
    this.gruposSearch = this.grupos.filter(u =>
      // coloca o nome do usuário em minusculo para ignorar os maiusculos dos minusculos
      (u.id?.toString() == value)
    );
  }

  private carregagruposFromApi(): void {
    // Chama o service de grupos para buscar todos
    //    .buscarTodos() retorna um Observable<grupo[]>
    //    como a chamada é assincrona para capturar o resultado é preciso "se inscrever" para receber o retorno

    this.grupoService.buscarTodos()
      .subscribe(result => {
        // pega o retorno recebido pela api e joga na nossa lista de usuários
        this.grupos = result;

        // Chama a função para filtrar os usuários para trazer toda a lista
        this.filtrarGrupos('');

      }, error => {
        // Deu erro na requisição
        this.toastr.error(error.message, 'Ops.');
      });
  }

  public abrirModal(grupo: Grupo | undefined): void {
    // Instancia o modal
    const modalRef = this.modalService.open(GrupoModalComponent, { size: 'lg' });

    // Passa o parâmetro do usuário para dentro
    modalRef.componentInstance.grupo = grupo;

    // Pega a resposta quando o usuário salvar no modal
    modalRef.componentInstance.onSave.subscribe((result: Grupo) => {
      this.toastr.success('Usuário salvo com sucesso!');

      if (!grupo?.id) {
        // Se não tiver id no usuário de entrada então é uma insert
        this.grupos.push(result);
      } else {
        // Remove o usuário anterior e insere o novo
        const idx = this.grupos.findIndex(u => u.id === result!.id);
        this.grupos.splice(idx, 1, result);
      }
      this.limpaPesquisa();
    });

    // Pega a resposta quando o usuário excluír no modal
    modalRef.componentInstance.onDelete.subscribe(() => {
      this.toastr.success('Usuário excluído com sucesso!');

      // Acha o usuário no array inicial e demove ele
      const idx = this.grupos.findIndex(u => u.id === grupo!.id);
      this.grupos.splice(idx, 1);
      this.limpaPesquisa();
    });
  }

  private limpaPesquisa(): void {
    this.searchControl?.setValue('');
  }

}
