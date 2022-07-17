export class User {
  constructor(
    public email: string,
    public _id: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    public username: string,
    public profile?: Profile
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    } else {
      return this._token;
    }
  }
}

export interface Profile {
  profilePic?: string;
  birthDate?: Date;
  description?: string;
  facebook?: string;
  instagram?: string;
  pinterest?: string;
  personalWebsite?: string;
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
    public prepTime: number,
    public cookTime: number,
    public serving: number,
    public servingsYield: number,
    public tags: string[],
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
