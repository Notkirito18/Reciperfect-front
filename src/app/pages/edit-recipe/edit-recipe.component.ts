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
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { tags, unitsNames } from 'src/app/Constatns';
import { IdGenerator } from 'src/app/helpers';
import { Ingredient, Recipe } from 'src/app/models';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { RecipesService } from 'src/app/services/recipes/recipes.service';
import { DeleteConfirmComponent } from '../../components/delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss'],
})
export class EditRecipeComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private mediaObserver: MediaObserver,
    private globals: GlobalsService,
    private authService: AuthService,
    private recipesSercive: RecipesService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  unitsNames = unitsNames;
  tags = tags;

  loading = true;
  editingRecipe = false;
  editingForm!: FormGroup;
  mediaSubscription!: Subscription;
  screenSize = 'lg';
  userId!: string;
  authToken!: string;
  otherUnit: boolean[] = [];
  recipeToEdit!: Recipe;
  recipeId!: string;
  selectedTags: string[] = [];

  //*images variables
  imagesSrcs: { localId: string; url: string }[] = [];
  imagesFiles: { localId: string; file: File }[] = [];
  newImages: string[] = [];
  deletedImages: string[] = [];
  folderName!: string;
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
      this.authToken = user._token;
      this.userId = user._id;
      this.route.params.subscribe((params) => {
        this.recipeId = params['id'];
        this.recipesSercive.getRecipe(this.recipeId, user._id).subscribe(
          (recipe) => {
            this.recipeToEdit = recipe;
            //*initializing form arrays
            const ingredientsArray = [];
            const instructionsArray = [];
            for (let i = 0; i < recipe.ingredients.length; i++) {
              //*wether units selected were custom or from select
              this.unitsNames.includes(recipe.ingredients[i].unit)
                ? this.otherUnit.push(false)
                : this.otherUnit.push(true);
              ingredientsArray.push(
                this.fb.group({
                  ingName: [
                    recipe.ingredients[i].name,
                    [Validators.required, Validators.minLength(3)],
                  ],
                  ingUnit: [
                    recipe.ingredients[i].unit,
                    [Validators.maxLength(20)],
                  ],
                  ingAmount: [
                    recipe.ingredients[i].amount,
                    [Validators.min(0)],
                  ],
                })
              );
            }
            for (let i = 0; i < recipe.instructions.length; i++) {
              instructionsArray.push(
                this.fb.group({
                  inst: [recipe.instructions[i], [Validators.required]],
                })
              );
            }
            //*initializing form
            this.editingForm = this.fb.group({
              name: [
                recipe.name,
                [Validators.required, Validators.minLength(3)],
              ],
              description: [recipe.description, [Validators.maxLength(500)]],
              ingredients: this.fb.array(ingredientsArray),
              instructions: this.fb.array(instructionsArray),
              share: !recipe.share,
              prepTime: [recipe.prepTime, [Validators.min(1)]],
              cookTime: [recipe.cookTime, [Validators.min(1)]],
              serving: [recipe.serving, [Validators.min(1)]],
              servingsYield: [recipe.servingsYield, [Validators.min(1)]],
            });
            //*init tags
            this.selectedTags = recipe.tags;

            //*initializing images
            this.imagesSrcs = recipe.imagesSrcs.map((item: string) => {
              return { localId: IdGenerator(), url: item };
            });
            //*setting up folder of images name
            if (this.imagesSrcs.length > 0) {
              this.folderName = this.imagesSrcs[0].url
                .split('/')
                .slice(-2, -1)[0];
            } else {
              const date = new Date();
              this.folderName = 'rec-' + date.getTime().toString();
            }

            this.loading = false;
          },
          //* error handling
          (error) => {
            console.log(error);
            this.loading = false;
            this.globals.notification.next({
              msg: 'Failed to get recipe data',
              type: 'error',
            });
          }
        );
      });
    });
  }

  //*Form array controls
  get ingCtrl(): FormArray {
    return this.editingForm.get('ingredients') as FormArray;
  }
  get instCtrl(): FormArray {
    return this.editingForm.get('instructions') as FormArray;
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
  //*tags selecting
  selectTag(tag: string) {
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags = this.selectedTags.filter((item) => item != tag);
    }
  }

  //*files importing
  onFilesImport(event: Event) {
    const files = (event.target as HTMLInputElement)!.files;
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (files && files.length > 0) {
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
            this.newImages.push(reader.result as string);
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
      if (this.newImages.includes(url)) {
        this.imagesSrcs = this.imagesSrcs.filter((item) => {
          return item.localId != localId;
        });
        this.imagesFiles = this.imagesFiles.filter((item) => {
          return item.localId != localId;
        });
      } else {
        const dialogRef = this.dialog.open(DeleteConfirmComponent, {
          width: '400px',
          data: { msg: 'Are you sure you want to delete this Image ?' },
        });
        dialogRef.afterClosed().subscribe((data) => {
          if (data && data.confirm) {
            // this.loading = true;
            //*getting image id from url
            const imageId: string = url
              .split('/')
              .slice(-3)
              .join('/')
              .split('.')[0];
            this.deletedImages.push(imageId);
            this.imagesSrcs = this.imagesSrcs.filter((item) => {
              return item.localId != localId;
            });
          }
        });
      }
    }
  }
  otherUnitSelected(event: any, index: number) {
    const value = event.target?.value.toString();
    if (value == '') {
      this.otherUnit[index] = true;
    }
  }
  backToSelectUnit(index: number) {
    this.otherUnit[index] = false;
  }

  editRecipe(formValue: any, formDirective: FormGroupDirective) {
    const editedRecipe = new Recipe(
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
      formValue.servingsYield,
      this.selectedTags
    );

    this.editingRecipe = true;

    if (this.deletedImages.length > 0) {
      this.recipesSercive
        .deleteImages(this.deletedImages, this.authToken, this.userId)
        .pipe(
          mergeMap((deletedImagesResult) => {
            return this.recipesSercive.updateRecipe(
              this.recipeId,
              editedRecipe,
              this.authToken,
              this.userId,
              this.imagesFiles.length > 0 ? this.folderName : null
            );
          })
        )
        .subscribe(
          (result) => {
            this.editingRecipe = false;
            this.router.navigate(['recipe', this.recipeId]);
          },
          (error) => {
            this.editingRecipe = false;
            console.log(error);
          }
        );
    } else {
      this.recipesSercive
        .updateRecipe(
          this.recipeId,
          editedRecipe,
          this.authToken,
          this.userId,
          this.imagesFiles.length > 0 ? this.folderName : null
        )
        .subscribe(
          (result) => {
            this.editingRecipe = false;
            this.router.navigate(['recipe', this.recipeId]);
          },
          (error) => {
            this.editingRecipe = false;
            console.log(error);
          }
        );
    }
  }

  ngOnDestroy(): void {
    if (this.mediaSubscription) this.mediaSubscription.unsubscribe();
  }
  IdGenerator = IdGenerator;
}
