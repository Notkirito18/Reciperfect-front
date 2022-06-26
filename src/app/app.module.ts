import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

//* materials
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NewRecipeComponent } from './pages/new-recipe/new-recipe.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RecipePageComponent } from './pages/recipe-page/recipe-page.component';
import { ImagesGridComponent } from './componants/images-grid/images-grid.component';
import { ClickStopPropagation } from './helpers';
import { MatDialogModule } from '@angular/material/dialog';
import { RateDialogComponent } from './componants/rate-dialog/rate-dialog.component';
import { LoginDialogComponent } from './componants/login-dialog/login-dialog.component';

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
    ImagesGridComponent,
    ClickStopPropagation,
    RateDialogComponent,
    LoginDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
