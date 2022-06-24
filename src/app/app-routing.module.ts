import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AntyAuthGuard } from './guards/antyAuth.guard';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NewRecipeComponent } from './pages/new-recipe/new-recipe.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RecipePageComponent } from './pages/recipe-page/recipe-page.component';
import { RegisterComponent } from './pages/register/register.component';

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
    path: 'new-recipe',
    component: NewRecipeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'recipe/:id',
    component: RecipePageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
