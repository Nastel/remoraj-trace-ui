import {NodeDataDefinition, NodeDefinition} from 'cytoscape';

export class dataPoint implements NodeDataDefinition{
  id: string;
  clazz: string;
  method: string;
  color: string;
  eventID: string[] = [];

  constructor(line: any, row: any) {
    this.id = line.trim();
    this.clazz = line.substring(0, line.lastIndexOf('.')).trim();
    this.method = line.substring(line.lastIndexOf('.') + 1).trim();

    let rowClazz = row["Properties('class')"] == null ? "" : row["Properties('class')"].class;

    if (this.method.substring(0, this.method.length - 2) == row["EventName"] && rowClazz == this.clazz) {
      this.color = 'yellow';
      this.eventID.push(row["EventID"]);
    } else {
      this.color = 'green';
    }
  }

}

export class traceElement implements NodeDefinition{
  data: dataPoint
  constructor(dataPoint1: dataPoint) {
    this.data =dataPoint1;
  }

}

