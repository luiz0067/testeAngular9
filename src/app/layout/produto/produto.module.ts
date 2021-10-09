import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProdutoComponent } from './produto.component';
import { ProdutoRoutingModule } from './produto-routing.module';
import { ProdutoModalComponent } from './componentes/modal/produto-modal/produto-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ProdutoRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ToastrModule,
    NgSelectModule
  ],
  declarations: [
    ProdutoComponent,
    ProdutoModalComponent
  ],
  entryComponents: [
    ProdutoModalComponent
  ]
})
export class ProdutoModule { }
