import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {dataPoint} from '../model/dataPoint';
import * as tippy from 'tippy.js';

@Component({
  selector: 'app-trace-node-tippie',
  templateUrl: './trace-node-tippie.component.html',
  styleUrls: ['./trace-node-tippie.component.css']
})
export class TraceNodeTippieComponent {
  @Input() data: dataPoint;
  @Input('tippyOptions') public tippyOptions: Object = {
    html: this.el.nativeElement,
    trigger: 'manual',
    arrow: true,
    placement: 'bottom',
    hideOnClick: false,
    theme: 'light',
    interactive: true
  };

  nodeRef: any;
  private _tippy;

  constructor(private el: ElementRef) {
  }

  public build() {
    this._tippy = tippy(this.nodeRef, this.tippyOptions || {}, true);
  }

  public hide() {
    this._tippy.tooltips[0].hide();
  }


  public show() {
    console.log('Tippie show');
    this._tippy.tooltips[0].show();
  }
}
