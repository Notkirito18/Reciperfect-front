import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditRecipeComponent } from './pages/edit-recipe/edit-recipe.component';
import { AntyAuthGuard } from './guards/antyAuth.guard';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NewRecipeComponent } from './pages/new-recipe/new-recipe.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RecipePageComponent } from './pages/recipe-page/recipe-page.component';
import { RegisterComponent } from './pages/register/register.component';
import { MyspaceComponent } from './pages/myspace/myspace.component';
import { UserPageComponent } from './pages/user-page/user-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AntyAuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AntyAuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my',
    component: MyspaceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'new-recipe',
    component: NewRecipeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:id',
    component: EditRecipeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'recipe/:id',
    component: RecipePageComponent,
  },
  {
    path: 'user-page/:id',
    component: UserPageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
