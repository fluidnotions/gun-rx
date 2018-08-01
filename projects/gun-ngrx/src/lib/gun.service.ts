import { Injectable, Inject } from '@angular/core';
import { GunRef } from './gun-ref';


@Injectable()
export class GunService {
  db: GunRef;
  constructor(
    @Inject('gunOptions') options?) {
    this.db = new GunRef();
    if (!!options) {
      this.db.opt(options);
    }
  }

}
