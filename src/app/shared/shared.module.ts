import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

//components
import { NavbarComponent } from './components/navbar/navbar.component';
import { DialogInfoComponent } from './components/dialog-info/dialog-info.component';

@NgModule({
  declarations: [NavbarComponent, DialogInfoComponent],
  imports: [
    CommonModule,
    // FlexLayoutModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    MatRippleModule,
    MatDialogModule,
    MatCheckboxModule,
    FormsModule,
  ],
  exports: [NavbarComponent],
})
export class SharedModule {}
