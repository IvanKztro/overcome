import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketRoutingModule } from './ticket-routing.module';
import { TicketComponent } from './ticket.component';
import { FormTicketComponent } from './form-ticket/form-ticket.component';
import { TicketsListComponent } from './tickets-list/tickets-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

//materials components
// import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { TicketCardComponent } from './ticket-card/ticket-card.component';

@NgModule({
  declarations: [TicketComponent, TicketsListComponent, FormTicketComponent, TicketCardComponent],
  imports: [
    CommonModule,
    TicketRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    // FlexLayoutModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatInputModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDividerModule,
    MatCardModule,
    MatSelectModule,
    DragDropModule,
    // moveItemInArray,
    // transferArrayItem
  ],
})
export class TicketModule {}
