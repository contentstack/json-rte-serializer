import isPlainObject from "lodash.isplainobject";
import isEqual from "lodash.isequal";

const resolveDescendants = (children: any[]) => {
  const nodes: any[] = [];

  const addChild = (child: any): void => {
    if (child == null) {
      return;
    }

    const prev = nodes[nodes.length - 1];

    if (typeof child === "string") {
      const text = { text: child };
      STRINGS.add(text);
      child = text;
    }

    if (isText(child)) {
      const c = child; // HACK: fix typescript complaining

      if (
        isText(prev) &&
        STRINGS.has(prev) &&
        STRINGS.has(c) &&
        textEquals(prev, c, { loose: true })
      ) {
        prev.text += c.text;
      } else {
        nodes.push(c);
      }
    } else if (isElement(child)) {
      nodes.push(child);
    } else {
      throw new Error(`Unexpected hyperscript child object: ${child}`);
    }
  };

  for (const child of children.flat(Infinity)) {
    addChild(child);
  }

  return nodes;
};

/**
 * Create an `Element` object.
 */

export function createElement(
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
) {
  return { ...attributes, children: resolveDescendants(children) };
}

/**
 * Create a fragment.
 */

export function createFragment(
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
) {
  return resolveDescendants(children);
}

/**
 * Create a `Text` object.
 */

export function createText(
  tagName: string,
  attributes: { [key: string]: any },
  children: any[]
) {
  const nodes = resolveDescendants(children);

  if (nodes.length > 1) {
    throw new Error(
      `The <text> hyperscript tag must only contain a single node's worth of children.`
    );
  }

  let [node] = nodes;

  if (node == null) {
    node = { text: "" };
  }

  if (!isText(node)) {
    throw new Error(`
      The <text> hyperscript tag can only contain text content as children.`);
  }

  // COMPAT: If they used the <text> tag we want to guarantee that it won't be
  // merge with other string children.
  STRINGS.delete(node);

  Object.assign(node, attributes);
  return node;
}

const STRINGS = new WeakSet();

function isText(value: any) {
  return isPlainObject(value) && typeof value.text === "string";
}

function textEquals(
  text: any,
  another: any,
  options: { loose?: boolean } = {}
): boolean {
  const { loose = false } = options;

  function omitText(obj: Record<any, any>) {
    const { text, ...rest } = obj;

    return rest;
  }

  return isEqual(
    loose ? omitText(text) : text,
    loose ? omitText(another) : another
  );
}

const isElement = (value: any): boolean => {
  return (
    isPlainObject(value) &&
    isNodeList(value.children) 
    // && !Editor.isEditor(value) // value cannot be editor
  )
};

export const jsx = (
  tagName: string,
  attributes?: Object,
  ...children: any[]
) => {
  const creators = {
    element: createElement,
    fragment: createFragment,
    text: createText,
  };
  const creator = creators[tagName];

  if (!creator) {
    throw new Error(`No hyperscript creator found for tag: <${tagName}>`);
  }

  if (attributes == null) {
    attributes = {};
  }

  if (!isPlainObject(attributes)) {
    children = [attributes].concat(children);
    attributes = {};
  }

  children = children.filter((child) => Boolean(child)).flat();
  const ret = creator(tagName, attributes, children);
  return ret;
};


function isNodeList (value: any[]) {
  return value.every(val => isNode(val))
}

function isNode(value: any){
  return (
    isText(value) || isElement(value) 
    // || Editor.isEditor(value) // // value cannot be editor
  )
}

/**
 * Returns string for the specified node
 */
export function getString(node: any): string {
  if (isText(node)) {
    return node.text
  } else {
    return node.children.map(getString).join('')
  }
}