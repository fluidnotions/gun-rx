import * as Gun from 'gun';
import 'gun/lib/open';
import 'gun/lib/load';
import 'gun/lib/path';
import 'gun/lib/not';
import * as _ from 'lodash';
import { GunOptions } from './gun-options';
import { Observable } from 'rxjs';

export class GunRef {
    gun: Gun;
    constructor(
        options?: GunOptions
    ) {
        this.gun = new Gun();
        // this.gun.open = gun_open;
        if (!!options) { this.gun.opt(options); }
    }
    static create(gun: Gun) {
        const newRef = new GunRef();
        newRef.gun = gun;
        return newRef;
    }
    opt(options: GunOptions): GunRef {
        this.gun.opt(options);
        return this;
    }
    not(key: string, timeout?: number): Observable<boolean> {
        return Observable.create(o => {
            this.gun.get(key).not((key) => {
                o.next(true);
                console.log("assuming ",key," is indeed not, emitting true")
                o.complete();
            })
            let to = timeout || 1000;
            setTimeout(()=> {
                o.next(false);
                console.log("not called on ",key," timed out after ", to)
                o.complete();
            }, to)
        })
    }
    get(key: string): GunRef {
        return GunRef.create(this.gun.get(key));
    }
    
    path(path: string): GunRef {
        return GunRef.create(this.gun.path(path));
    }
    //doesn't seem to work as expected can't put on a path result
    pathAlt(path: string, ref: GunRef): GunRef{
        let pathSegs = path.split(".");
        let tragetRef = ref;
        pathSegs.forEach(seg => {
          tragetRef = tragetRef.get(seg);
        })
        return tragetRef;
      }
    put(data: any): Observable<boolean> {
        return Observable.create(o => {
            this.gun.put(data, (ack) => {
                if (ack.err) {
                    console.error("ERROR gun:put ", ack.err, ", data: ", data)
                    o.next(false);
                    o.complete();
                } else {
                    console.log("SUCCESS gun:put ", ack, ", data: ", data)
                    o.next(true);
                    o.complete();
                }
            })
        });
    }
    back(): GunRef {
        return GunRef.create(this.gun.back());
    }
    map(): GunRef {
        return GunRef.create(this.gun.map());
    }
    open<T>(): Observable<T> {
        return Observable.create(o => {
            this.gun.open((data, key, at, ev) => {
                console.log("open: changed: ", data, key, at, ev);
                o.next(this.extractData(data));
            });
        });
    }
    load<T>(): Observable<T> {
        return Observable.create(o => {
            this.gun.load((data, key, at, ev) => {
                //console.log(data, key, at, ev);
                o.next(this.extractData(data));
                o.complete();
            });
        });
    }
    set(data: any): GunRef {
        return GunRef.create(this.gun.set(data));
    }
    once<T>(): Observable<T> {
        return Observable.create(o => {
            this.gun.once((data, key, at, ev) => {
                //console.log(data, key, at, ev);
                o.next(this.extractData(data));
                o.complete();
            });
        });
    }
    on<T>(): Observable<T> {
        return Observable.create(o => {
            let stopped = false;
            this.gun.on((data: T, key, at, ev) => {
                if (stopped) {
                    o.complete();
                    return ev.off();
                }
                o.next(this.extractData(data));
            });
            return () => {
                // Caller unsubscribed
                stopped = true;
            };
        });
    }

    private extractData(data) {
        return _.pickBy(data, (val, key) => val !== null && key !== '_');
        // return data;
    }
}
