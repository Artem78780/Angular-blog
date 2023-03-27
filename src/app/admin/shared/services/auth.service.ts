import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { FbAuthResponse, User } from '../interfaces';


@Injectable({providedIn: 'root'})
export class AuthService {
  error$: Subject<string> = new Subject<string>;

  get token(): string | null {
    // const expDate = new Date(localStorage.getItem('fb-token-exp'))
    // if(new Date() > expDate) {
    //   this.logOut()
    //   return null
    // }
    return localStorage.getItem('fb-token')
  }

  constructor(private http: HttpClient) {}

  login(user: User): Observable<any> {
    user.returnSecureToken = true
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, 
    user)
    .pipe(
      tap(this.setToken),
      catchError(this.handleError.bind(this))
    )
  }

  logOut() {
    this.setToken(null)
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error

    switch(message) {
      case 'INVALID_EMAIL':
        this.error$.next('Невірний email')
        break
      case 'INVALID_PASSWORD':
        this.error$.next('Невірний пароль')
        break
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Такого email не існує')
        break
    }

    return throwError(error)
  }

  setToken(response: any): void {
    if(response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
      localStorage.setItem('fb-token', response.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
      localStorage.clear()
    }
  }

}
