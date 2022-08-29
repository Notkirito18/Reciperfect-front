import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClickStopPropagation } from './helpers';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NewRecipeComponent } from './pages/new-recipe/new-recipe.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RecipePageComponent } from './pages/recipe-page/recipe-page.component';
import { RateDialogComponent } from './components/rate-dialog/rate-dialog.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { DeleteConfirmComponent } from './components/delete-confirm/delete-confirm.component';
import { EditRecipeComponent } from './pages/edit-recipe/edit-recipe.component';

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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MyspaceComponent } from './pages/myspace/myspace.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FooterComponent } from './components/footer/footer.component';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { UserPageComponent } from './pages/user-page/user-page.component';

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
    EditRecipeComponent,
    DeleteConfirmComponent,
    MyspaceComponent,
    FooterComponent,
    UserDialogComponent,
    UserPageComponent,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
