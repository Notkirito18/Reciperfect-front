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
          const recipeToSend = {
            ...recipeToAdd,
            imagesSrcs: imagesPaths,
          };
          return this.http
            .post<{ recipe: any }>(
              environment.url + 'api/recipes/write',
              recipeToSend,
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
  deleteImages(ids: string[], token: string, userDataId: string) {
    return this.http.post(
      environment.url + 'api/recipes/write/deleteImages',
      { ids },
      {
        headers: {
          key: environment.serverKey,
          authToken: token,
          userDataId: userDataId,
        },
      }
    );
  }

  updateRecipe(
    id: string,
    newRecipe: Recipe,
    token: string,
    userDataId: string,
    folderName: string | null
  ) {
    if (!folderName) {
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
    } else {
      const formData = new FormData();
      for (let i = 0; i < newRecipe.imagesFiles.length; i++) {
        formData.append(
          'image',
          newRecipe.imagesFiles[i],
          newRecipe.imagesFiles[i].name
        );
      }
      return this.http
        .post(
          environment.url + 'api/recipes/write/saveImage/' + folderName,
          formData,
          {
            headers: {
              key: environment.serverKey,
              authToken: token,
              userDataId: userDataId,
            },
          }
        )
        .pipe(
          mergeMap((res: any) => {
            const imagesPaths = res.images.map((item: any) => item.url);
            const recipeToSend = {
              ...newRecipe,
              imagesSrcs: newRecipe.imagesSrcs
                .concat(imagesPaths)
                .filter((item) => {
                  return item.slice(0, 4) != 'data';
                }),
            };
            console.log('imagesPaths', imagesPaths);
            console.log('recipeToSend', recipeToSend.imagesSrcs);

            return this.http
              .patch<{ recipe: any }>(
                environment.url + 'api/recipes/write/' + id,
                recipeToSend,
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
  }
}
