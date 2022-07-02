import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IdGenerator } from 'src/app/helpers';
import { Ingredient, Recipe } from 'src/app/models';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { RecipesService } from 'src/app/services/recipes/recipes.service';

@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.component.html',
  styleUrls: ['./new-recipe.component.scss'],
})
export class NewRecipeComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private mediaObserver: MediaObserver,
    private globals: GlobalsService,
    private authService: AuthService,
    private recipesSercive: RecipesService,
    private router: Router
  ) {}

  mediaSubscription!: Subscription;
  screenSize = 'lg';
  newRecForm!: FormGroup;
  imagesSrcs: { localId: string; url: string }[] = [];
  imagesFiles: { localId: string; file: File }[] = [];
  userId!: string;
  authToken!: string;
  addingRecipe = false;
  otherUnit: boolean[] = [false];
  unitsNames = ['KG', 'MG'];

  //*on init
  ngOnInit(): void {
    //screen size
    this.mediaSubscription = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        this.screenSize = result.mqAlias;
      }
    );
    //header
    this.globals.headerTransparency.next(true);
    //*getting creator id
    this.authService.user.subscribe((user) => {
      this.authToken = user._token;
      this.userId = user._id;
    });
    //*inittialising form
    this.newRecForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      description: [null, [Validators.maxLength(500)]],
      ingredients: this.fb.array([
        this.fb.group({
          ingName: [null, [Validators.required, Validators.minLength(3)]],
          ingUnit: [null, [Validators.maxLength(20)]],
          ingAmount: [null, [Validators.min(0)]],
        }),
      ]),
      instructions: this.fb.array([
        this.fb.group({
          inst: [null, [Validators.required]],
        }),
      ]),
      share: false,
      prepTime: [null, [Validators.min(1)]],
      cookTime: [null, [Validators.min(1)]],
      serving: [null, [Validators.min(1)]],
      servingsYield: [null, [Validators.min(1)]],
    });
  }

  //*Form array controls
  get ingCtrl(): FormArray {
    return this.newRecForm.get('ingredients') as FormArray;
  }
  get instCtrl(): FormArray {
    return this.newRecForm.get('instructions') as FormArray;
  }

  addCtrl(type: 'ing' | 'inst') {
    if (type == 'ing') {
      this.ingCtrl.controls.push(
        this.fb.group({
          ingName: new FormControl(null),
          ingUnit: new FormControl(null),
          ingAmount: new FormControl(null),
        })
      );
      this.otherUnit.push(false);
    }
    if (type == 'inst') {
      this.instCtrl.controls.push(
        this.fb.group({
          inst: new FormControl(null),
        })
      );
    }
  }

  removeCtrl(index: number, type: 'ing' | 'inst') {
    if (type == 'ing') {
      this.ingCtrl.controls.splice(index, 1);
      this.otherUnit.pop();
    }
    if (type == 'inst') this.instCtrl.controls.splice(index, 1);
  }
  ngOnDestroy(): void {
    if (this.mediaSubscription) this.mediaSubscription.unsubscribe();
  }
  //* images saving
  //files importing
  onFilesImport(event: Event) {
    const files = (event.target as HTMLInputElement)!.files;
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (allowedMimeTypes.includes(files[i].type)) {
          // id for retreiving when deleting locally
          const localId = IdGenerator();
          //reading the file
          const reader = new FileReader();
          reader.onload = () => {
            this.imagesSrcs.push({
              localId: localId,
              url: reader.result as string,
            });
          };
          reader.readAsDataURL(files[i]);
          this.imagesFiles.push({ localId: localId, file: files[i] });
        }
      }
    }
  }
  //deleting images
  deleteImage(url: string, localId: string) {
    if (
      this.imagesSrcs
        .map((item) => {
          return item.localId;
        })
        .includes(localId)
    ) {
      this.imagesSrcs = this.imagesSrcs.filter((item) => {
        return item.localId != localId;
      });
      this.imagesFiles = this.imagesFiles.filter((item) => {
        return item.localId != localId;
      });
    }
  }

  //* On form submit (adding recipe)
  addRecipe(formValue: any, formDirective: FormGroupDirective) {
    const recipeToAdd = new Recipe(
      formValue.name,
      formValue.description,
      this.ingCtrl.controls
        .map((item) => {
          const name = item.value.ingName;
          let unit;
          if (item.value.ingUnit.length > 0) {
            unit = item.value.ingUnit;
          } else {
            unit = 'unit';
          }
          let amount;
          if (item.value.ingAmount > 0) {
            amount = item.value.ingAmount;
          } else {
            amount = 1;
          }
          return new Ingredient(name, unit, amount);
        })
        .filter((item) => item.name.length > 0),
      this.instCtrl.controls.map((item) => item.value.inst),
      this.imagesFiles.map((item) => item.file),
      this.imagesSrcs.map((item) => item.url),
      !formValue.share,
      this.userId,
      new Date(),
      formValue.prepTime,
      formValue.cookTime,
      formValue.serving,
      formValue.servingsYield
    );
    this.addingRecipe = true;

    this.recipesSercive
      .addRecipe(recipeToAdd, this.authToken, this.userId)
      .subscribe(
        (addedRecipe) => {
          this.newRecForm.reset();
          formDirective.resetForm();
          this.addingRecipe = false;
          this.router.navigate(['recipe', addedRecipe._id]);
          console.log('added', addedRecipe);
        },
        ({ error }) => {
          this.newRecForm.reset();
          formDirective.resetForm();
          this.addingRecipe = false;
          this.globals.notification.next({
            msg: error.msg
              ? error.msg
              : 'something went wrong when adding your recipe',
            type: 'error',
          });
        }
      );
  }
  // other unit
  otherUnitSelected(event: any, index: number) {
    const value = event.target?.value.toString();

    if (value == '') {
      this.otherUnit[index] = true;
    } else {
      //TODO make the brands array corespond to the selected category
    }
  }

  backToSelectUnit(index: number) {
    this.otherUnit[index] = false;
  }
  IdGenerator = IdGenerator;
}
