import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
    private recipesSercive: RecipesService
  ) {}

  mediaSubscription!: Subscription;
  screenSize = 'lg';
  newRecForm!: FormGroup;
  imagesSrcs: { localId: string; url: string }[] = [];
  imagesFiles: { localId: string; file: File }[] = [];
  userId!: string;
  authToken!: string;

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
    //getting creator id
    this.authService.user.subscribe((user) => {
      console.log(user);
      this.authToken = user._token;
      this.userId = user._id;
    });
    //inittialising form
    this.newRecForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ],
      ],
      description: ['', [Validators.maxLength(250)]],
      ingredients: this.fb.array([
        this.fb.group({
          ingName: [
            '',
            [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(15),
            ],
          ],
          ingUnit: ['', [Validators.maxLength(15)]],
          ingAmount: ['', [Validators.min(1)]],
        }),
      ]),
      instructions: this.fb.array([
        this.fb.group({
          inst: ['', [Validators.required, Validators.maxLength(80)]],
        }),
      ]),
      share: false,
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
          ingName: new FormControl(''),
          ingUnit: new FormControl(''),
          ingAmount: new FormControl(''),
        })
      );
    }
    if (type == 'inst') {
      this.instCtrl.controls.push(
        this.fb.group({
          inst: new FormControl(''),
        })
      );
    }
  }

  removeCtrl(index: number, type: 'ing' | 'inst') {
    if (type == 'ing') this.ingCtrl.controls.splice(index, 1);
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
  addRecipe(formValue: any) {
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
      new Date()
    );

    this.recipesSercive
      .addRecipe(recipeToAdd, this.authToken, this.userId)
      .subscribe(
        (addedRecipe) => {
          console.log('added', addedRecipe);
        },
        ({ error }) => {
          this.globals.notification.next({
            msg: error.msg
              ? error.msg
              : 'something went wrong when adding your recipe',
            type: 'error',
          });
        }
      );
  }
  IdGenerator = IdGenerator;
}