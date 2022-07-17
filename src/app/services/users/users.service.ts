import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';
import { User } from 'src/app/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUser(id: string) {
    return this.http
      .get<{ user: User }>(environment.url + 'api/users/' + id, {
        headers: {
          key: environment.serverKey,
        },
      })
      .pipe(
        map((userObject) => {
          return userObject.user;
        })
      );
  }

  editUser(
    userObject: any,
    token: string,
    userDataId: string,
    folderName: string | null
  ) {
    // formation images to FormData
    const formData = new FormData();
    if (userObject.profilePicFile) {
      formData.append(
        'image',
        userObject.profilePicFile,
        userObject.profilePicFile.name
      );

      return this.http
        .post(
          folderName
            ? environment.url + 'api/users/editProfileImage/' + folderName
            : environment.url + 'api/users/saveProfileImage',
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
            const imagePaths = res.images.map((item: any) => item.url)[0];
            const userToSend = {
              ...userObject,
              profile: { ...userObject.profile, profilePic: imagePaths },
            };
            return this.http
              .patch<{ user: User }>(
                environment.url + 'api/users/' + userObject._id,
                userToSend,
                {
                  headers: {
                    key: environment.serverKey,
                    authToken: token,
                    userDataId: userDataId,
                  },
                }
              )
              .pipe(
                map((userObject) => {
                  return userObject.user;
                })
              );
          })
        );
    } else {
      return this.http
        .patch<{ user: User }>(
          environment.url + 'api/users/' + userObject._id,
          userObject,
          {
            headers: {
              key: environment.serverKey,
              authToken: token,
              userDataId: userDataId,
            },
          }
        )
        .pipe(
          map((userObject) => {
            return userObject.user;
          })
        );
    }
  }
}
