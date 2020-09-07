export enum RESOURCE_TYPE {
  IMAGE
}

export type RESOURCE = {
  raw: ArrayBuffer;
  type: RESOURCE_TYPE;
  description: string;
}

export type ActionResult<T = void> = {
  success: boolean;
  message?: string;
  result?: T;
}

export interface IPresistence {
  createPage(name: string): Promise<ActionResult>;
  deletePage(name: string): Promise<ActionResult>;
  queryAllPage(): Promise<ActionResult<string[]>>;

  createXML(forPage: string, xmlFilePath: string, xmlFileString: string): Promise<ActionResult>;
  createResource(forPage: string, resourceID: string, resource: RESOURCE): Promise<ActionResult>;
  loadXML(forPage: string, xmlFilePath: string): Promise<ActionResult<string>>;
  loadResource(forPage: string, resourceID: string): Promise<ActionResult<RESOURCE>>;
  updateXMLProperty(forPage: string, xmlFilePath: string, targetId: string, property: string, newValue: string): Promise<ActionResult>;
  removeXMLNode(forPage: string, xmlFilePath: string, targetId: string): Promise<ActionResult>;
  appendXMLNode(forPage: string, xmlFilePath: string, targetId: string, newNode: Node): Promise<ActionResult>;
  insertXMLNodeBefore(forPage: string, xmlFilePath: string, beforeNodeId: string, newNode: Node): Promise<ActionResult>;
  updateResource(forPage: string, resourceID: string, resource: RESOURCE): Promise<ActionResult>;
  deleteResource(forPage: string, resourceID: string): Promise<ActionResult>;
  deleteXML(forPage: string, xmlFilePath: string): Promise<ActionResult>;
}