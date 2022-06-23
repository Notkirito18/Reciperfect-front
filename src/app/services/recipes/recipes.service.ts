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
  ): Observable<Recipe> {
    // formation product to FormData
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
          const imagesPaths = res.images.map((item: any) => item.imagePath);
          const productToSend = {
            ...recipeToAdd,
            imageGallery: imagesPaths,
            imagesSrcs: imagesPaths,
          };
          return this.http
            .post<{ recipe: Recipe }>(
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
              map((productsObject) => {
                return productsObject.recipe;
              })
            );
        })
      );
  }
}
