import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from 'src/app/models';
import { environment } from 'src/environments/environment';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  constructor(private http: HttpClient) {}

  addRecipe(
    recipeToAdd: Recipe,
    token: string,
    userDataId: string
  ): Observable<any> {
    // formation images to FormData
    const formData = new FormData();
    for (let i = 0; i < recipeToAdd.imagesFiles.length; i++) {
      formData.append(
        'image',
        recipeToAdd.imagesFiles[i],
        recipeToAdd.imagesFiles[i].name
      );
    }

    return this.http
      .post(environment.url + 'api/recipes/write/saveImage', formData, {
        headers: {
          key: environment.serverKey,
          authToken: token,
          userDataId: userDataId,
        },
      })
      .pipe(
        mergeMap((res: any) => {
          const imagesPaths = res.images.map((item: any) => item.url);
          const productToSend = {
            ...recipeToAdd,
            imagesSrcs: imagesPaths,
          };
          return this.http
            .post<{ recipe: any }>(
              environment.url + 'api/recipes/write',
              productToSend,
              {
                headers: {
                  key: environment.serverKey,
                  authToken: token,
                  userDataId: userDataId,
                },
              }
            )
            .pipe(
              map((recipeObject) => {
                return recipeObject.recipe;
              })
            );
        })
      );
  }

  getRecipes(userId?: string) {
    return this.http
      .get<{ recipes: Recipe[] }>(
        environment.url + 'api/recipe/read',
        userId
          ? {
              headers: {
                key: environment.serverKey,
                userDataId: userId,
              },
            }
          : {
              headers: {
                key: environment.serverKey,
              },
            }
      )
      .pipe(
        map((recipeObject) => {
          return recipeObject.recipes;
        })
      );
  }

  getRecipe(id: string, userId?: string) {
    return this.http
      .get<{ recipe: any }>(
        environment.url + 'api/recipe/read/' + id,
        userId
          ? {
              headers: {
                key: environment.serverKey,
                userDataId: userId,
              },
            }
          : {
              headers: {
                key: environment.serverKey,
              },
            }
      )
      .pipe(
        map((recipeObject) => {
          return recipeObject.recipe;
        })
      );
  }

  updateRecipe(
    id: string,
    newRecipe: Recipe,
    token: string,
    userDataId: string
  ) {
    return this.http
      .patch<{ recipe: any }>(
        environment.url + 'api/recipes/write/' + id,
        newRecipe,
        {
          headers: {
            key: environment.serverKey,
            authToken: token,
            userDataId: userDataId,
          },
        }
      )
      .pipe(
        map((recipeObject) => {
          return recipeObject.recipe;
        })
      );
  }

  // likeRecipe(id: string, token: string, userDataId: string) {
  //   this.getRecipe(id, userDataId).subscribe(
  //     (recipe) => {
  //       const idArr = [userDataId];
  //       const liked = recipe.likes.includes(userDataId);
  //       const newLikes = liked ? recipe.likes.filter((item: string) => {
  //             item != userDataId;
  //           })
  //         : recipe.likes.concat(idArr);
  //       const newRecipe = { ...recipe, likes: newLikes };
  //       this.updateRecipe(id, newRecipe, token, userDataId).subscribe(
  //         (updatedRecipe) => {
  //           return true;
  //         },
  //         (error) => {
  //           console.log(error);
  //           return false;
  //         }
  //       );
  //     },
  //     (error) => {
  //       console.log(error);
  //       return false;
  //     }
  //   );
  // }

  // rateRecipe(
  //   id: string,
  //   newRecipe: Recipe,
  //   token: string,
  //   userDataId: string
  // ) {}
}
