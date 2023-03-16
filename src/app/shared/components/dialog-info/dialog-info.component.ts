import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.css'],
})
export class DialogInfoComponent implements OnInit {
  public isshow: boolean = false;

  constructor(
    // private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogInfoComponent>,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    public us: UsersService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      id: string;
      typeItem: string;
      header: string;
      // functionDelete: Function;
    } // public cs: ContactsService, // public es: ExpensesService, // public ds: DepositsService, // public ofs: OfficesService,
  ) // public vs: VehiclesService,
  // public ms: MaintenancesService
  {}

  ngOnInit(): void {}

  async saveChanges() {
    const user = await this.auth.getUser();
    if (!user) {
      this.snackBar.open('Usuario no válido', 'Close', {
        duration: 4000,
      });
      return;
    }

    let updateUser = user;

    updateUser.dragdropInfo = this.isshow;

    if (this.data.typeItem === 'DragDrop')
      this.us.updateUser(user.uid, updateUser);
    // if (this.data.typeItem === 'Expense') this.es.deleteExpense(id);
    // if (this.data.typeItem === 'Deposit') this.ds.deleteDeposit(id);
    // if (this.data.typeItem === 'User') this.us.deleteUser(id);
    // if (this.data.typeItem === 'Sucursal') this.ofs.deleteOffice(id);
    // if (this.data.typeItem === 'Vehicle') this.vs.deleteVehicle(id);
    // if (this.data.typeItem === 'Maintenance') this.ms.deleteMaintenance(id);

    // this.data.functionDelete(id);
    this.dialogRef.close();
  }
}
