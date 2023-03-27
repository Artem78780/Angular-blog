import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authService.isAuthenticated()) {
            req = req.clone({
                setHeaders: {
                    // Authorization: this.authService.token
                }
            })
        }
        return next.handle(req)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    console.log('[Interceptor Error]' , error)

                    if(error.status === 401) {
                        this.authService.logOut()
                        this.router.navigate(['/admin', 'login'], {
                            queryParams: {
                                authFailed: true
                            }
                        })
                    }
                    return throwError(error)
                })
            )
    }

}