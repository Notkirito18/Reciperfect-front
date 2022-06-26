export class User {
  constructor(
    public email: string,
    public _id: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    public username: string
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    } else {
      return this._token;
    }
  }
}

export class Recipe {
  constructor(
    public name: string,
    public description: string,
    public ingredients: Ingredient[],
    public instructions: string[],
    public imagesFiles: File[],
    public imagesSrcs: string[],
    public share: boolean,
    public creatorId: string,
    public date: Date,
    public ratings?: Rating[],
    public likes?: string[],
    public _id?: string
  ) {}
}

export class Rating {
  constructor(public ratorId: string, public ratingScore: number) {}
}

export class Ingredient {
  constructor(
    public name: string,
    public unit: string,
    public amount: number
  ) {}
}
