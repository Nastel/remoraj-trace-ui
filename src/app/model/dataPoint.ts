import {NodeDataDefinition, NodeDefinition} from 'cytoscape';


export class dataPoint implements NodeDataDefinition{
  id: string;
  clazz: string;
  classEntries: string[]
  method: string;
  readonly color: string = 'green';
  readonly entryColor:string = 'lime';

  eventID: string[] = [];

  constructor(line: any, row: any) {
    this.id = getId(line);
    this.clazz = line.substring(0, line.lastIndexOf('.')).trim();
    this.classEntries = this.clazz.split('.');
    this.method = line.substring(line.lastIndexOf('.') + 1).trim();
    const eventID = line.substring(line.indexOf('[') + 1, line.lastIndexOf(']'));
    if (eventID != undefined && eventID.length >0) {
      this.method = this.method.substring(0,this.method.lastIndexOf('[')).trim();
      this.color = this.entryColor;
      this.eventID.push(eventID);
    }

    let rowClazz = row["Properties('class')"] == null ? "" : row["Properties('class')"].class;

    if (this.method.substring(0, this.method.length - 2) == row["EventName"] && rowClazz == this.clazz) {
      this.color = this.entryColor;
      this.eventID.push(row["EventID"]);
    }
  }

}

export class traceElement implements NodeDefinition{
  data: dataPoint
  constructor(dataPoint1: dataPoint) {
    this.data =dataPoint1;
  }

}

export function getId(line: string) {
  let end = line.lastIndexOf('()');
  let s = line.trim().substring(0, end == -1? line.length : end);
  return s;
}
