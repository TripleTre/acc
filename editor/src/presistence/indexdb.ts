import { ActionResult, IPresistence, RESOURCE } from "./IPresistence";
import localforage from 'localforage';

export class Presistence implements IPresistence {

  constructor() {
    localforage.config({
      driver      : localforage.INDEXEDDB,
      name        : 'ACC',
      version     : 1.0,
      storeName   : 'acc', // Should be alphanumeric, with underscores.
      description : ''
    });
  }

  async queryAllPage(): Promise<ActionResult<string[]>> {
    const result = await localforage.getItem<string[]>('list') || [];
    return {
      success: true,
      result,
    }
  }

  async createPage(name: string): Promise<ActionResult> {
    try {
      await localforage.setItem(name, {
        assets: {},
      });
      return {
        success: true
      };
    } catch (e) {
      return {
        success: false,
        message: e.toString()
      };
    }
  }

  async createResource(forPage: string, resourceID: string, resource: RESOURCE): Promise<ActionResult> {
    try {
      const prev = await localforage.getItem<any>(forPage);
      prev.assets[resourceID]= resource;
      await localforage.setItem(forPage, prev);
      return {
        success: true
      };
    } catch (e) {
      return {
        success: false,
        message: e.toString()
      };
    }
  }

  async createXML(forPage: string, xmlFilePath: string, xmlFileString: string): Promise<ActionResult> {
    try {
      const prev = await localforage.getItem<any>(forPage);
      prev[xmlFilePath] = xmlFileString;
      await localforage.setItem(forPage, prev);
      return {
        success: true
      };
    } catch (e) {
      return {
        success: false,
        message: e.toString()
      };
    }
  }

  async deletePage(name: string): Promise<ActionResult> {
    try {
      await localforage.removeItem(name);
      return {
        success: true
      }
    } catch (e) {
      return {
        success: false,
        message: e.toString()
      };
    }
  }

  async deleteResource(forPage: string, resourceID: string): Promise<ActionResult> {
    try {
      const prev = await localforage.getItem<any>(forPage);
      delete prev.assets[resourceID];
      await localforage.setItem(forPage, prev);
      return {
        success: true
      };
    } catch (e) {
      return {
        success: false,
        message: e.toString()
      };
    }
  }

  async deleteXML(forPage: string, xmlFilePath: string): Promise<ActionResult> {
    try {
      const prev = await localforage.getItem<any>(forPage);
      delete prev[xmlFilePath];
      await localforage.setItem(forPage, prev);
      return {
        success: true
      };
    } catch (e) {
      return {
        success: false,
        message: e.toString()
      };
    }
  }

  async loadResource(forPage: string, resourceID: string): Promise<ActionResult<RESOURCE>> {
    try {
      const page = await localforage.getItem<any>(forPage);
      if (!page.assets?.resourceID) {
        return {
          success: false,
          message: `resource not exists(${resourceID})`
        };
      } else {
        return {
          success: true,
          result: page.assets.resourceID
        };
      }
    } catch (e) {
      return {
        success: false,
        message: e.toString()
      };
    }
  }

  async loadXML(forPage: string, xmlFilePath: string): Promise<ActionResult<string>> {
    try {
      const page = await localforage.getItem<any>(forPage);
      if (!page?.xmlFilePath) {
        return {
          success: false,
          message: `xml file not exists(${xmlFilePath})`
        };
      } else {
        return {
          success: true,
          result: page.assets.resourceID
        };
      }
    } catch (e) {
      return {
        success: false,
        message: e.toString()
      };
    }
  }

  async updateResource(forPage: string, resourceID: string, resource: RESOURCE): Promise<ActionResult> {
    try {
      const prev = await localforage.getItem<any>(forPage);
      prev.assets[resourceID] = resource;
      await localforage.setItem(forPage, prev);
      return {
        success: true
      };
    } catch (e) {
      return {
        success: false,
        message: e.toString()
      };
    }
  }

  async updateXMLProperty(forPage: string, xmlFilePath: string, targetId: string, property: string, newValue: string): Promise<ActionResult> {
    try {
      const prev = await localforage.getItem<any>(forPage);

      const parser = new DOMParser();
      const doc = parser.parseFromString(prev[xmlFilePath], 'text/xml');

      // @ts-ignore
      doc.getElementById(targetId).setAttributeNS(null, property, newValue);

      prev[xmlFilePath] = (new XMLSerializer()).serializeToString(doc);

      await localforage.setItem(forPage, prev);
      return {
        success: true
      };
    } catch (e) {
      return {
        success: false,
        message: e.toString()
      };
    }
  }

  async appendXMLNode(forPage: string, xmlFilePath: string, targetId: string, newNode: Node): Promise<ActionResult> {
    try {
      const prev = await localforage.getItem<any>(forPage);
      const parser = new DOMParser();
      const doc = parser.parseFromString(prev[xmlFilePath], 'text/xml');
      // @ts-ignore
      doc.getElementById(targetId).appendChild(newNode);
      prev[xmlFilePath] = (new XMLSerializer()).serializeToString(doc);
      await localforage.setItem(forPage, prev);
      return {
        success: true
      };
    } catch (e) {
      return {
        success: false,
        message: e.toString()
      };
    }
  }

  async insertXMLNodeBefore(forPage: string, xmlFilePath: string, beforeNodeId: string, newNode: Node): Promise<ActionResult> {
    try {
      const prev = await localforage.getItem<any>(forPage);
      const parser = new DOMParser();
      const doc = parser.parseFromString(prev[xmlFilePath], 'text/xml');
      const target = doc.getElementById(beforeNodeId);
      // @ts-ignore
      target.parentNode.insertBefore(newNode, target);
      prev[xmlFilePath] = (new XMLSerializer()).serializeToString(doc);
      await localforage.setItem(forPage, prev);
      return {
        success: true
      };
    } catch (e) {
      return {
        success: false,
        message: e.toString()
      };
    }
  }

  async removeXMLNode(forPage: string, xmlFilePath: string, targetId: string): Promise<ActionResult> {
    try {
      const prev = await localforage.getItem<any>(forPage);
      const parser = new DOMParser();
      const doc = parser.parseFromString(prev[xmlFilePath], 'text/xml');
      const target = doc.getElementById(targetId);
      // @ts-ignore
      target.parentNode.removeChild(target);
      prev[xmlFilePath] = (new XMLSerializer()).serializeToString(doc);
      await localforage.setItem(forPage, prev);
      return {
        success: true
      };
    } catch (e) {
      return {
        success: false,
        message: e.toString()
      };
    }
  }
}
