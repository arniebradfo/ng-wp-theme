import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgWpRoutingModule } from './ngwp-routing.module';

import { WpRestService } from './services/wp-rest.service';
import { DynamicTemplateCompilerService } from './services/dynamic-template-compiler.service';
import { NgWpComponent } from './ngwp.component';
import { NavComponent } from './components/nav/nav.component';
import { PostComponent } from './components/post/post.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { ExampleComponent } from './shortcodes/example/example.component';
import { RecentPostsComponent } from './widgets/recent-posts/recent-posts.component';

@NgModule({
  declarations: [
    NgWpComponent,
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
    WpRestService,
    DynamicTemplateCompilerService
  ],
  bootstrap: [NgWpComponent],
  exports: [ // export shortcodes
    ExampleComponent
  ]
})
export class NgWpModule { }
