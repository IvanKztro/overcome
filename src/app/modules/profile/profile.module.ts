import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// material components
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

import { ProfileRoutingModule } from './profile-routing.module';
import { DialogProfileComponent } from './components/dialog-profile/dialog-profile.component';
import { ProfileComponent } from './profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadPhotoComponent } from './components/upload-photo/upload-photo.component';

@NgModule({
  declarations: [
    ProfileComponent,
    DialogProfileComponent,
    UploadPhotoComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
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
  ],
})
export class ProfileModule {}
