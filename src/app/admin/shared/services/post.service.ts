import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment.prod";
import { map, Observable } from "rxjs";
import { Post } from "../interfaces";
import { FbCreateResponse } from '../interfaces'

@Injectable({
    providedIn: 'root'
})
export class PostService {
    constructor(private http: HttpClient) { }

    create(post: Post): Observable<Post> {
        return this.http.post<any>(`${environment.fbDbUrl}/posts.json`, post)
            .pipe(
                map((response: FbCreateResponse) => {
                    const newPost: Post = {
                        ...post,
                        id: response.name,
                        date: new Date()
                    }
                    return newPost
                })
            )
    }

    getAll(): Observable<Post[]> {
        return this.http.get(`${environment.fbDbUrl}/posts.json`)
        .pipe(
            map((response: {[key: string]: any}) => {
                return  Object.keys(response).map(key => ({
                    ...response[key],
                    id: key,
                    date: new Date(response[key].date)
                }))
            })
        )
    }
}