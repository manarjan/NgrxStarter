import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { HomeModule } from './components/home/home.module';
import { UserService } from './services/user.service';
import { UserEffects } from './store/user.effects';
import { userReducer } from './store/user.reducer';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    EffectsModule.forRoot([UserEffects]),
    HomeModule,
    HttpClientModule,
    StoreModule.forRoot({ user: userReducer }),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [UserService],
})
export class AppModule {}
