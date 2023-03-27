import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../shared/interfaces';
import { PostService } from '../shared/services/post.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  posts!: Post[]
  pSub?: Subscription

  constructor(private postsServiceL: PostService){}

  ngOnInit(): void {
    this.pSub = this.postsServiceL.getAll().subscribe(posts => {
      this.posts = posts
    })
  }

  remove(id?: string) {

  }

  ngOnDestroy(): void {
    if(this.pSub) {
      this.pSub.unsubscribe()
    }
  }
}
