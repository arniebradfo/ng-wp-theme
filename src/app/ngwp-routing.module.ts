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


// ROUTES TO POST/PAGE
// /{post-page-slug}/
// /{post}/{page-number}/
// /{post}/comment-page-{number}/#comments

// ROUTES TO LIST
// /
// /page/{page-number}/
// /category|tag|author/{category-slug|tag-slug|author-slug}/
// /category|tag|author/{category-slug|tag-slug|author-slug}/page/{page-number}/
// /?s={search-term}
// /page/{page-number}/?s={search-term}

// BACKEND //
// /wp-admin/*

// password protected stuff ??


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class NgWpRoutingModule { }
