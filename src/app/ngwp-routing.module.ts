import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostComponent } from './components/post/post.component';

const routes: Routes = [
  {
    path: '',
    component: PostListComponent,
    pathMatch: 'full'
  },
  {
    path: ':slug',
    component: PostComponent
  }
];

// /{post}/
// /{post}/{page-number}/
// /{post}/comment-page-{number}/#comments

// /category|tag|author/{category|tag|author}/
// /category|tag|author/{category|tag|author}/page/{page-number}/

// /?s={search-term}
// /page/{page-number}/?s={search-term}

// /wp-admin/* reroutes to backend

// password protected stuff


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class NgWpRoutingModule { }
