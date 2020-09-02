import {AfterViewInit, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
import * as cytoscape from 'cytoscape';
import * as popper from 'cytoscape-popper';
import * as tippy from 'tippy.js';
import {environment} from '../../environments/environment';
import {dataPoint, getEventID, getId, traceElement} from '../model/dataPoint';
import {TraceNodeTippieComponent} from '../trace-node-tippie/trace-node-tippie.component';
import {JkoolService} from '../jkool.service';


cytoscape.use(popper);

@Component({
  selector: 'app-remora',
  templateUrl: './remora.component.html',
  styleUrls: ['./remora.component.css']
})
export class RemoraComponent implements AfterViewInit {
  @ViewChild('tippie', {read: ViewContainerRef}) activeComponent: ViewContainerRef;
  private cy;
  readonly markNodeColor = 'red';
  query: string = '';
  mark: string = '';
  defaultOptions: any = ['eventName=\'read\'', 'eventName=\'executeQuery\'', 'eventName=\'executeupdate\''];
  filteredOptions: any;

  private readonly _storageKey = 'remoraQueries';

  constructor(private resolver: ComponentFactoryResolver, private jkoolService: JkoolService) {
    let remoraQueries = window.localStorage.getItem(this._storageKey);
    if (remoraQueries != undefined) {
      this.defaultOptions = JSON.parse(remoraQueries);
    }
    this.filteredOptions = this.defaultOptions;
  }

  private readonly _base_jkql = 'get latest 50 events fields message, EventName as name, EventID as id, map(\'class\') as class';
  endValue: Date = new Date();
  startValue: Date = new Date(this.endValue.getTime() - 6 * 60000);

  selectedStartValue: Date = new Date(2011, 1, 5);
  selectedEndValue: Date = new Date(2011, 2, 5);

  ngAfterViewInit(): void {
    this.jkoolService.executeHttpRequest('Get Event  fields open(starttime), close(starttime) for latest day').then(
      data => {

        let date = new Date(data.rows[0]['Open(StartTime,StartTime)'] / 1000);
        console.log(date);
        this.startValue = date;

        let date1 = new Date(data.rows[0]['Close(StartTime,StartTime)'] / 1000);
        console.log(date1);
        this.endValue = date1;


      });
    this.loadData(this._base_jkql);
    this.loadCytoscape();

  }

  markIt() {
    this.clearIt();
    let mark = this.markNodeColor;
    this.cy.elements('node[id *= "' + this.mark + '"]').forEach(function(ele) {
      ele.style('background-color', mark);
      ;
    });

  }

  clearIt() {
    this.cy.elements().forEach(function(ele) {
      ele.style('background-color', ele.data()['color']);
    });
  }

  private loadCytoscape() {
    this.cy = cytoscape({
      container: document.getElementById('cy'),

      style: [
        {
          selector: 'node',
          style: {
            shape: 'diamond',
            'background-color': 'data(color)',
            label: 'data(method)'
          }
        },

        {
          selector: 'edge',
          style: {
            'curve-style': 'haystack',
            'haystack-radius': 0.5,
            opacity: 0.4,
            'line-color': '#bbb',
            width: 1,
            'overlay-padding': '3px'
          }
        },
        {
          selector: 'edge[arrow]',
          style: {
            'target-arrow-shape': 'vee'
          }
        }]
    });

  }


  public loadData(jkql: string): void {

    var $ = document.querySelector.bind(document);

    this.jkoolService.executeHttpRequest(jkql).then(data => {
        console.log('Response from jkool', data);

        if (data != undefined) {
          let datum = data['data-date-range'];
          let strings = datum.split(" TO ");
          this.selectedStartValue=new Date(strings[0]/1000);
          this.selectedEndValue=new Date(strings[1]/1000);
          this.cy.startBatch();
          let cy = this.cy;
          for (let index = 0; index < data['rows'].length; index++) {
            let row = data['rows'][index];
            if (row['Message'] === undefined || row['Message'] == null ) continue;
            let traceElementLines = row['Message'].split('\n');
            let traceElementLinesFormatted = traceElementLines.map(e => e.trim()).map(e=> e.includes('[') ? e.substring(0, e.lastIndexOf('[')):e).map(e=> e.trim());
            let cy = this.cy;
            let lastEventId:string =row['EventID'];
            for (let innerIndex = 0; innerIndex < traceElementLines.length; innerIndex++) {

              let line = traceElementLines[innerIndex].trim();
              if (line.includes('[')) {
                lastEventId =getEventID(line);
              }
              if (line.startsWith('Stack length:') || line.trim() == '' || line.startsWith("com.jkoolcloud.remora") || !line.includes('()')) {
                continue;
              }
              if (!cy.hasElementWithId(getId(line))) {
                let dataPoint1 = new dataPoint(line, row);
                let traceElement1 = new traceElement(dataPoint1);
                cy.add(traceElement1);
              } else {
                let element = cy.getElementById(getId(line));
                let elementData = element.data();
                if (elementData.entryPoint) {

                  let eventIDs = elementData.eventID;
                  if (!eventIDs.includes(lastEventId)) {
                    eventIDs.push(lastEventId);
                  }
                }

              }

              if (innerIndex > 2 &&cy.hasElementWithId(getId(traceElementLinesFormatted[innerIndex - 1]))) {
                cy.add({
                  data: {
                    id: index + '_' + innerIndex,
                    source: getId(traceElementLinesFormatted[innerIndex - 1]),
                    target: getId(traceElementLinesFormatted[innerIndex].trim()),
                  }

                });
              }
            }


          }

          cy.on('tap', (e) => {
            if (e.target === cy) {
              this.hideAllTippies();
            }
          });

          cy.on('tap', 'edge', (e) => {
            this.hideAllTippies();
          });

          cy.on('zoom pan', (e) => {
            this.hideAllTippies();
          });

          cy.nodes().forEach((n) => {
            let tippy = this.makeNewTippy(n);
            n.data('tippy', tippy);

            n.on('click', (e) => {
              tippy.instance.show();
              cy.nodes().not(n).forEach((node) => this.hideTippy(node));
            });
          });


          this.cy.endBatch();
          cy.layout({
            name: 'cose',

            // Whether to animate while running the layout
            // true : Animate continuously as the layout is running
            // false : Just show the end result
            // 'end' : Animate with the end result, from the initial positions to the end positions
            animate: true,

            // Easing of the animation for animate:'end'
            animationEasing: undefined,

            // The duration of the animation for animate:'end'
            animationDuration: undefined,

            // Number of iterations between consecutive screen positions update
            refresh: 20,

            // Whether to fit the network view after when done
            fit: true,

            // Padding on fit
            padding: 30,

            // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
            boundingBox: undefined,

            // Excludes the label when calculating node bounding boxes for the layout algorithm
            nodeDimensionsIncludeLabels: false,

            // Randomize the initial positions of the nodes (true) or use existing positions (false)
            randomize: false,

            // Extra spacing between components in non-compound graphs
            componentSpacing: 40,


            // Nesting factor (multiplier) to compute ideal edge length for nested edges
            nestingFactor: 1.2,

            // Gravity force (constant)
            gravity: 1,

            // Maximum number of iterations to perform
            numIter: 1000,

            // Initial temperature (maximum node displacement)
            initialTemp: 1000,

            // Cooling factor (how the temperature is reduced between consecutive iterations
            coolingFactor: 0.99,

            // Lower temperature threshold (below this point the layout will end)
            minTemp: 1.0
          }).run();

        }
      }

      , error => {
        console.log('Error on jkool call', error);
      });
  }

  private makeNewTippy(n: any) {
    let factory = this.resolver.resolveComponentFactory(TraceNodeTippieComponent);
    let tippy = this.activeComponent.createComponent<TraceNodeTippieComponent>(factory);
    tippy.instance.nodeRef = n.popperRef();
    tippy.instance.data = n.data();
    tippy.instance.build();
    return tippy;
  }

  submit() {
    let jkql = this._base_jkql + ' where ' + this.query;
    console.log('Clicked', jkql);
    this.hideAllTippies();
    this.loadData(jkql);
    this.loadCytoscape();

  }


  private hideAllTippies() {
    this.cy.nodes().forEach((node) => this.hideTippy(node));
  }

  private hideTippy(node) {
    var tippy = node.data('tippy');

    if (tippy != null) {
      tippy.instance.hide();
    }
  }


  onTriggerSearch() {
    if (!this.defaultOptions.includes(this.query)) {
      this.defaultOptions.push(this.query);
      window.localStorage.setItem(this._storageKey, JSON.stringify(this.defaultOptions));
    }
    this.submit();
  }

  doFilter(query: string) {
    return this.defaultOptions.filter((option) => option.includes(query));
  }

  onRemoveQueryClick($event: MouseEvent, option: any) {

  }


}
