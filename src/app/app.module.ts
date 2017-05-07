import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgWpRoutingModule } from './ngwp-routing.module';

import { PostsService } from './services/posts.service';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { PostComponent } from './components/post/post.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { ExampleComponent } from './shortcodes/example/example.component';
import { RecentPostsComponent } from './widgets/recent-posts/recent-posts.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    PostComponent,
    PostListComponent,
    ExampleComponent,
    RecentPostsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgWpRoutingModule
  ],
  providers: [
    PostsService
  ],
  bootstrap: [AppComponent],
  exports: [ // export shortcodes
    ExampleComponent
  ]
})
export class AppModule { }
