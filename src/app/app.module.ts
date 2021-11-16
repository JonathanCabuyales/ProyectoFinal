import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule, PERSISTENCE } from "@angular/fire/auth";
import { environment } from 'src/environments/environment.prod';

import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from "ng-starrating";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { PipesModule } from './pipes/pipes.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(),
    BrowserModule, 
    AppRoutingModule,
    HttpClientModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    RatingModule,
    PipesModule,
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence({synchronizeTabs: true}),
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: PERSISTENCE, useValue: 'none' },
    
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
