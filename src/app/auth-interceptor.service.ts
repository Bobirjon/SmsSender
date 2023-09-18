import {HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http';

export class AuthInterceptorService implements HttpInterceptor {

    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        let apiKey = localStorage.getItem("token")
        
        if(apiKey == null) {
            const modRequest = req.clone({
                setHeaders: {
                  authorization: `Token${apiKey}`
                }
              });
              return next.handle(modRequest);
        } else {
            const modRequest = req.clone({
                setHeaders: { authorization: `Token ${apiKey}`
                }
              });
              return next.handle(modRequest);
        }
    }
}
   