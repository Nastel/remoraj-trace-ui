import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CytoscapeNgLibModule} from 'cytoscape-ng-lib';
import {RemoraComponent} from './remora/remora.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import { TraceNodeTippieComponent } from './trace-node-tippie/trace-node-tippie.component';
import { DxRangeSelectorModule } from 'devextreme-angular';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AppComponent,
    RemoraComponent,
    TraceNodeTippieComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CytoscapeNgLibModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatAutocompleteModule,
        MatIconModule,
        DxRangeSelectorModule,
        MatMenuModule,
      MatSnackBarModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
