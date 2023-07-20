import {HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http';
import { StorageService } from './storage.service';

export class AuthInterceptorService implements HttpInterceptor {

    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        let apiKey = sessionStorage.getItem("token")
        
        // const modified = req.clone({
        //     headers: req.headers
        //         .set('Content-Type', 'application/json')
        //         .append('Authorization', `Token ${apiKey}`
        //         )})
        // return next.handle(modified)

        if(apiKey == null) {
            const modRequest = req.clone({
                setHeaders: {
                  authorization: `Token${apiKey}`
                }
              });
              return next.handle(modRequest);
        } else {
            const modRequest = req.clone({
                setHeaders: {
                  authorization: `Token ${apiKey}`
                }
              });
              return next.handle(modRequest);
        }
    }
}
   