import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClickStopPropagation } from './helpers';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HeaderComponent } from './componants/header/header.component';
import { RecipeComponent } from './componants/recipe/recipe.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NewRecipeComponent } from './pages/new-recipe/new-recipe.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RecipePageComponent } from './pages/recipe-page/recipe-page.component';
import { RateDialogComponent } from './componants/rate-dialog/rate-dialog.component';
import { LoginDialogComponent } from './componants/login-dialog/login-dialog.component';
import { TooltipComponent } from './componants/tooltip/tooltip.component';
import { RelatedRecipesComponent } from './componants/related-recipes/related-recipes.component';
import { DeleteConfirmComponent } from './componants/delete-confirm/delete-confirm.component';
import { EditRecipeComponent } from './componants/edit-recipe/edit-recipe.component';

import { IvyCarouselModule } from 'angular-responsive-carousel';
//* materials
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    RecipeComponent,
    NewRecipeComponent,
    ProfileComponent,
    RecipePageComponent,
    ClickStopPropagation,
    RateDialogComponent,
    LoginDialogComponent,
    TooltipComponent,
    RelatedRecipesComponent,
    EditRecipeComponent,
    DeleteConfirmComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    IvyCarouselModule,
    //mat
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
