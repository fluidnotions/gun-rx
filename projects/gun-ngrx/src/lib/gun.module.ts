import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GunOptions } from './gun-options';
import { GunService } from './gun.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: []
})
export class GunModule {
  static forRoot(config?: GunOptions) {
    return {
      ngModule: GunModule,
      providers: [
        GunService,
        { provide: 'gunOptions', useValue: config }
      ]
    };
  }
}
