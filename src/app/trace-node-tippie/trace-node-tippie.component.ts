import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {dataPoint} from '../model/dataPoint';
import * as tippy from 'tippy.js';
import {JkoolService} from '../jkool.service';


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
  additionalData: any;
  properties: any;

  constructor(private el: ElementRef, private jKoolService:JkoolService) {
  }

  public build() {
    this._tippy = tippy(this.nodeRef, this.tippyOptions || {}, true);
  }

  public hide() {
    this._tippy.tooltips[0].hide();
  }


  public show() {
    console.log('Tippie show:');
    console.log(this.data);
    this._tippy.tooltips[0].show();

    if (this.data.eventID.length && this.additionalData === undefined) {
      this.jKoolService.executeHttpRequest("get event fields average(ElapsedTime), Min(StartTime), Max(StartTime)  where EventID in ('" + this.data.eventID.join("','")+"')").then((data) =>{
        console.log("Additional data" +data);
        this.additionalData = data});
    }

  }

  getProperties() {
    if (this.properties === undefined) {
      this.jKoolService.executeHttpRequest("get event fields properties  where EventID in ('" + this.data.eventID.join("','")+"')").then((data) =>{
        console.log("Properties data" +data);
        let map = new Map(data.rows.map((e) => Object.entries(e.Properties)).flat(1).map(e => e.reverse()));
        let set = new Set(Array.from(map.values()));
        let reverseMap: Map<any, any> = new Map<any, any>();
        set.forEach(e => {
          let filter = [...map.entries()].filter(({ 1: v }) => v === e);
          reverseMap.set(e, filter.map(e=>e[0]));
          }
        );

        console.log(reverseMap);
        this.properties = reverseMap;
      });
    }
  }
}
