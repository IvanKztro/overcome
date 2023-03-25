import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//ROUTES GUARD
import {
  AuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToSignIn = () =>
  redirectUnauthorizedTo(['auth/login']);

const redirectLoggedInToHome = () => redirectLoggedInTo(['/boards/0/ticket/0']);

// import {}

const routes: Routes = [
  {
    path: '',
    redirectTo: 'boards/0',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
  },
  // {
  //   path: 'dashboard',
  //   loadChildren: () =>
  //     import('./modules/dashboard/dashboard.module').then(
  //       (m) => m.DashboardModule
  //     ),
  //   canActivate: [AuthGuard],
  //   data: { authGuardPipe: redirectUnauthorizedToSignIn },
  // },
  // {
  //   path: 'users',
  //   loadChildren: () =>
  //     import('./modules/users/users.module').then((m) => m.UsersModule),
  //   canActivate: [AuthGuard],
  //   data: { authGuardPipe: redirectUnauthorizedToSignIn },
  // },
  {
    path: 'boards/:id',
    loadChildren: () =>
      import('./modules/ticket/ticket.module').then((m) => m.TicketModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToSignIn },
  },
  // {
  //   path: 'boards/:boardId',
  //   loadChildren: () =>
  //     import('./modules/board/board.module').then((m) => m.BoardModule),
  //   data: { authGuardPipe: redirectUnauthorizedToSignIn },
  // },
  // {
  //   path: 'profile',
  //   loadChildren: () =>
  //     import('./modules/profile/profile.module').then((m) => m.ProfileModule),
  //   canActivate: [AuthGuard],
  //   data: { authGuardPipe: redirectUnauthorizedToSignIn },
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
