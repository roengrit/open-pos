import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

import {IndexDBServiceService} from "./indexdb.service";

export interface Auth {
  id: string;
  authentication_token: string;
}

@Injectable()
export class AuthService {
  _auth: Auth = <Auth>{};
  _auth$: Subject<Auth> = <Subject<Auth>> new Subject();

  constructor(
              private _indexDB: IndexDBServiceService) {

    this.init();
  }

  set auth(data: Auth) {
    this._auth = data;
    this._auth$.next(data);
  }


  get auth(): Auth {
    return this._auth;
  }

  get auth$(): Observable<Auth> {
    return this._auth$.asObservable();
  }

  async getAuthData(): Promise<Auth> {
    return await this._indexDB.auth.limit(1).toArray().then((data) => {
      return data[0];
    });
  }

  deleteAuthData(): Promise<boolean> {
    return this._indexDB.auth.clear().then((data) => {
      return data
    });
  }


  setAuthData = (id: string, token: string): Promise<boolean> => {
    return this._indexDB.auth.clear().then(()=>{
      return this._indexDB.auth.add({id: id, authentication_token: token}).then((data) => {
        return data
      }, () => {
        this._indexDB.auth.update(id, {id: id, authentication_token: token}).then((data) => {
          return data

        }, (data) => {
          return data
        })
      });
    });
  };

  init(): void {
    this.getAuthData().then((data)=>{
      if (data) {
        this.auth = data;
      }
    });
  }

}
