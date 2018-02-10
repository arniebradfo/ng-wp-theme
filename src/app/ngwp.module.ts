import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgWpRoutingModule } from './ngwp-routing.module';

import { WpRestService } from './services/wp-rest.service';
import { NgWpComponent } from './ngwp.component';
import { NavComponent } from './components/nav/nav.component';
import { PostComponent } from './components/post/post.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { ExampleComponent, ExampleTwoComponent } from './shortcodes/example/example.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { SearchComponent } from './components/search/search.component';

@NgModule({
  declarations: [
    NgWpComponent,
    NavComponent,
    PostComponent,
    PostListComponent,
    CommentFormComponent,
    SearchComponent,
    ExampleTwoComponent,
    ExampleComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgWpRoutingModule
  ],
  providers: [
    WpRestService,
  ],
  bootstrap: [NgWpComponent],
  entryComponents: [ // all shortcodes go here
    ExampleTwoComponent,
    ExampleComponent,
  ],
  exports: [ // export shortcodes
    ExampleTwoComponent,
    ExampleComponent,
  ]
})
export class NgWpModule { }
