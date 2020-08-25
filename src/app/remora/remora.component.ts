import {
  Component,
  ComponentFactoryResolver,
  Injector,
  AfterViewInit,
  ReflectiveInjector,
  ViewChild,
  ViewContainerRef,
  ViewChildren
} from '@angular/core';
import * as cytoscape from 'cytoscape';
import * as popper from 'cytoscape-popper';
import * as tippy from 'tippy.js';

import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {dataPoint, traceElement} from '../model/dataPoint';
import {TraceNodeTippieComponent} from '../trace-node-tippie/trace-node-tippie.component';


cytoscape.use(popper);

@Component({
  selector: 'app-remora',
  templateUrl: './remora.component.html',
  styleUrls: ['./remora.component.css']
})
export class RemoraComponent implements AfterViewInit {
  @ViewChild('tippie', {read: ViewContainerRef}) activeComponent: ViewContainerRef;
  private cy;
  readonly baseNodeColor = 'green';
  readonly markNodeColor = 'red';
  query: string = '';
  mark: string = '';
  defaultOptions: any = ['eventName=\'read\'', 'eventName=\'executeQuery\'', 'eventName=\'executeupdate\''];
  filteredOptions: any;

  private readonly _storageKey = 'remoraQueries';

  constructor(private http: HttpClient, private resolver: ComponentFactoryResolver, private injector: Injector) {
    let remoraQueries = window.localStorage.getItem(this._storageKey);
    if (remoraQueries != undefined) {
      this.defaultOptions = JSON.parse(remoraQueries);
    }
    this.filteredOptions = this.defaultOptions;
  }

  private readonly _base_jkql = 'get latest 50 events fields message, EventName as name, EventID as id, map(\'class\') as class';

  ngAfterViewInit(): void {

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
    let stantdard = this.baseNodeColor;
    this.cy.elements().forEach(function(ele) {
      ele.style('background-color', stantdard);
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

  private buildSearchUrl(searchQuery: string): string {
    const searchConf = {

      url: 'https://www.gocypher.com/gocypherservices/services/v1/proxy/jkql',
      param_token: '&jk_token=',
      param_query: '?jk_query=',
      param_max_rows: '&jk_maxrows=',
      max_rows: 500,
      param_time_zone: '&jk_tz=GMT',
      param_time_range: '&jk_date=last%2010%20years'


    };
    const accessToken = '35066921-9726-454e-aa5d-c1ae4c5fe686';

    return searchConf.url
      + searchConf.param_query + encodeURI(searchQuery)
      + searchConf.param_token + accessToken
      + searchConf.param_max_rows + searchConf.max_rows
      + searchConf.param_time_zone
      + searchConf.param_time_range
      ;
  }

  public executeHttpRequest(searchQuery: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.buildSearchUrl(searchQuery);
      console.log('URL', url);
      this.http.get<any>(url).subscribe(data => {
        // console.log("Response for dashboard:", data);
        resolve(data);

      }, error => {
        console.log('Error got on HTTP call', error);
        reject(error);
      });
    }) as Promise<any>;
  }


  public loadData(jkql: string): void {
    var h = function(tag, attrs, children) {
      var el = document.createElement(tag);

      Object.keys(attrs).forEach(function(key) {
        var val = attrs[key];

        el.setAttribute(key, val);
      });

      children.forEach(function(child) {
        el.appendChild(child);
      });

      return el;
    };

    var t = function(text) {
      var el = document.createTextNode(text);

      return el;
    };

    var $ = document.querySelector.bind(document);

    this.executeHttpRequest(jkql).then(data => {
        console.log('Response from jkool', data);

        if (data != undefined) {
          this.cy.startBatch();
          let cy = this.cy;
          for (let index = 0; index < data['rows'].length; index++) {
            let row = data['rows'][index];
            let traceElementLines = row['Message'].split('\n');
            let cy = this.cy;
            for (let innerIndex = 0; innerIndex < traceElementLines.length; innerIndex++) {
              let line = traceElementLines[innerIndex];
              if (line.startsWith('Stack length:') || line.trim() == '') {
                continue;
              }
              if (!cy.hasElementWithId(line.trim())) {
                let dataPoint1 = new dataPoint(line, row);
                let traceElement1 = new traceElement(dataPoint1);
                cy.add(traceElement1);
              }

              if (innerIndex >= 2) {
                cy.add({
                  data: {
                    id: index + '_' + innerIndex,
                    source: traceElementLines[innerIndex - 1].trim(),
                    target: line.trim(),
                  }

                });
              }
            }


          }

          var makeTippy = function(node, html) {

            return tippy(node.popperRef(), {
              html: html,
              trigger: 'manual',
              arrow: true,
              placement: 'bottom',
              hideOnClick: false,
              theme: 'light',
              interactive: true
            }).tooltips[0];
          };

          var hideTippy = function(node) {
            var tippy = node.data('tippy');

            if (tippy != null) {
              tippy.instance.hide();
            }
          };

          var hideAllTippies = function() {
            cy.nodes().forEach(hideTippy);
          };

          cy.on('tap', function(e) {
            if (e.target === cy) {
              hideAllTippies();
            }
          });

          cy.on('tap', 'edge', function(e) {
            hideAllTippies();
          });

          cy.on('zoom pan', function(e) {
            hideAllTippies();
          });

          cy.nodes().forEach((n) => {
            let tippy = this.makeNewTippy(n);
            n.data('tippy', tippy);

            n.on('click', function(e) {
              tippy.instance.show();
              cy.nodes().not(n).forEach((node) => hideTippy(node));
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
    tippy.instance.nodeRef=n.popperRef();
    tippy.instance.data=n.data();
    console.log(n.data);
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
      tippy.hide();
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

  public getContextRoot(): string {
    return environment.contextRootForConfiguration;
  }

}
