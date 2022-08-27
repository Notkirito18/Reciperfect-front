import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IdGenerator, inputToLink } from 'src/app/helpers';
import { Profile, User } from 'src/app/models';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  constructor(
    private globals: GlobalsService,
    private authService: AuthService,
    private usersService: UsersService,
    private fb: FormBuilder
  ) {}
  IdGenerator = IdGenerator;
  inputToLink = inputToLink;

  user!: User;
  userForm!: FormGroup;
  user$!: Subscription;
  imageFile!: File;
  imageSrc!: string;
  maxDate = new Date();
  loading = false;
  ngOnInit(): void {
    //header
    this.globals.headerTransparency.next(false);
    //initing max date
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 13);
    //initialising form
    this.userForm = this.fb.group({
      username: '',
      email: '',
      description: '',
      facebook: '',
      instagram: '',
      pinterest: '',
      personalWebsite: '',
      birthDate: this.maxDate,
    });
    //getting user info
    this.user$ = this.authService.user.subscribe(
      (user) => {
        this.user = user;
        this.imageSrc = user.profile?.profilePic
          ? user.profile?.profilePic
          : 'https://res.cloudinary.com/notkirito18/image/upload/v1658421093/assets/avth2x05glsetigstvdk_q6f4bi.jpg';
        //*initialising form
        this.userForm = this.fb.group({
          username: user.username,
          email: user.email,
          description: user.profile?.description,
          facebook: user.profile?.facebook,
          instagram: user.profile?.instagram,
          pinterest: user.profile?.pinterest,
          personalWebsite: user.profile?.personalWebsite,
          birthDate: user.profile?.birthDate,
        });
      },
      (error) => {
        this.globals.notification.next({
          msg: error.msg ? error.msg : 'error occured',
          type: 'error',
        });
      }
    );
  }
  //files importing
  onImageImport(event: Event) {
    const files = (event.target as HTMLInputElement)!.files;
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (allowedMimeTypes.includes(files[i].type)) {
          //reading the file
          const reader = new FileReader();
          reader.onload = () => {
            this.imageSrc = reader.result as string;
          };
          reader.readAsDataURL(files[i]);
          this.imageFile = files[i];
        }
      }
    }
  }

  //*Updating the user
  onSave(formValue: any, formDirective: FormGroupDirective) {
    const {
      username,
      email,
      description,
      facebook,
      instagram,
      pinterest,
      personalWebsite,
      birthDate,
    } = formValue;

    const updatedUser = {
      _id: this.user._id,
      email,
      username,
      profile: {
        profilePic: this.imageSrc,
        birthDate,
        description,
        facebook: facebook ? inputToLink(facebook, 'face') : '',
        instagram: instagram ? inputToLink(instagram, 'insta') : '',
        pinterest: pinterest ? inputToLink(pinterest, 'pin') : '',
        personalWebsite,
      },
      profilePicFile: this.imageFile,
    };

    this.loading = true;
    this.usersService
      .editUser(
        updatedUser,
        this.user.token ? this.user.token : '',
        this.user._id,
        this.user.profile?.profilePic
          ? this.user.profile?.profilePic.split('/').slice(-2, -1)[0]
          : null
      )
      .subscribe(
        (res) => {
          this.loading = false;
          this.authService.user.next(res);
          const userData: {
            email: string;
            _id: string;
            _token: string;
            _tokenExpirationDate: string;
            username: string;
            profile: Profile;
          } = JSON.parse(localStorage.getItem('userData') || '{}');
          const user = new User(
            res.email,
            res._id,
            userData._token,
            new Date(userData._tokenExpirationDate),
            res.username,
            res.profile
          );
          localStorage.setItem('userData', JSON.stringify(user));
        },
        (error) => {
          this.loading = false;
          console.log(error);
        }
      );
  }

  ngOnDestroy(): void {
    if (this.user$) this.user$.unsubscribe;
  }
}
