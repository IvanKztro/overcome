import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  opened: boolean = false;
  title = 'tickets overcome';
  constructor(private auth: AuthService) {
    this.auth.user$.subscribe((user) => {
      user ? (this.opened = true) : (this.opened = false);
    });
  }
}
