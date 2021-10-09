import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GrupoComponent } from './grupo.component';
import { GrupoRoutingModule } from './grupo-routing.module';
import { GrupoModalComponent } from './componentes/modal/grupo-modal/grupo-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    GrupoRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ToastrModule
  ],
  declarations: [
    GrupoComponent,
    GrupoModalComponent
  ],
  entryComponents: [
    GrupoModalComponent
  ]
})
export class GrupoModule { }
