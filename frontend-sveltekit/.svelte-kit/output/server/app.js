var __require = typeof require !== "undefined" ? require : (x) => {
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
import axios from "axios";
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
function lowercase_keys(obj) {
  const clone = {};
  for (const key in obj) {
    clone[key.toLowerCase()] = obj[key];
  }
  return clone;
}
function error$1(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler) {
    return;
  }
  const params = route.params(match);
  const response = await handler({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error$1(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error$1(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop$1() {
}
function safe_not_equal$1(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
const subscriber_queue$1 = [];
function writable$1(value, start2 = noop$1) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal$1(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue$1.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue$1.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue$1.length; i += 2) {
            subscriber_queue$1[i][0](subscriber_queue$1[i + 1]);
          }
          subscriber_queue$1.length = 0;
        }
      }
    }
  }
  function update(fn2) {
    set(fn2(value));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start2(set) || noop$1;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash$2(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
const s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page: page2
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable$1($session);
    const props = {
      stores: {
        page: writable$1(null),
        navigating: writable$1(null),
        session
      },
      page: page2,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page2 && page2.host ? s$1(page2.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2 && page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page2 && page2.path)},
						query: new URLSearchParams(${page2 ? s$1(page2.query.toString()) : ""}),
						params: ${page2 && s$1(page2.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash$2(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(coalesce_to_error(err));
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
const s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module } = node;
  let uses_credentials = false;
  const fetched = [];
  let set_cookie_headers = [];
  let loaded;
  const page_proxy = new Proxy(page2, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page2.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = {
            ...opts.headers
          };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 === "set-cookie") {
                    set_cookie_headers = set_cookie_headers.concat(value);
                  } else if (key2 !== "etag") {
                    headers[key2] = value;
                  }
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape$5(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    set_cookie_headers,
    uses_credentials
  };
}
const escaped$2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape$5(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$2) {
      result += escaped$2[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
const absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page: page2,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page: page2
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  let set_cookie_headers = [];
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
            if (loaded.loaded.redirect) {
              return with_cookies({
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              }, set_cookie_headers);
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return with_cookies(await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            }), set_cookie_headers);
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return with_cookies(await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    }), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return with_cookies(await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    }), set_cookie_headers);
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    response.headers["set-cookie"] = set_cookie_headers;
  }
  return response;
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page: page2
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
class ReadOnlyFormData {
  constructor(map) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
}
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        const decoded = decodeURI(request2.path);
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(decoded);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash$2(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function noop() {
}
function run(fn2) {
  return fn2();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}
function compute_rest_props(props, keys) {
  const rest = {};
  keys = new Set(keys);
  for (const k in props)
    if (!keys.has(k) && k[0] !== "$")
      rest[k] = props[k];
  return rest;
}
function null_to_empty(value) {
  return value == null ? "" : value;
}
function custom_event(type, detail, bubbles = false) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onDestroy(fn2) {
  get_current_component().$$.on_destroy.push(fn2);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach((fn2) => {
        fn2.call(component, event);
      });
    }
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
Promise.resolve();
const boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function spread(args, classes_to_add) {
  const attributes = Object.assign({}, ...args);
  if (classes_to_add) {
    if (attributes.class == null) {
      attributes.class = classes_to_add;
    } else {
      attributes.class += " " + classes_to_add;
    }
  }
  let str = "";
  Object.keys(attributes).forEach((name) => {
    if (invalid_attribute_name_character.test(name))
      return;
    const value = attributes[name];
    if (value === true)
      str += " " + name;
    else if (boolean_attributes.has(name.toLowerCase())) {
      if (value)
        str += " " + name;
    } else if (value != null) {
      str += ` ${name}="${value}"`;
    }
  });
  return str;
}
const escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape$4(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function escape_attribute_value(value) {
  return typeof value === "string" ? escape$4(value) : value;
}
function escape_object(obj) {
  const result = {};
  for (const key in obj) {
    result[key] = escape_attribute_value(obj[key]);
  }
  return result;
}
function each(items, fn2) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn2(items[i], i);
  }
  return str;
}
const missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
let on_destroy;
function create_ssr_component(fn2) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn2(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape$4(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var root_svelte_svelte_type_style_lang = "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}";
const css$d = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$d);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
let base = "";
let assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
const template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="fr_FR">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
let options = null;
const default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-de303ce5.js",
      css: [assets + "/_app/assets/start-61d1577b.css", assets + "/_app/assets/vendor-cf063f61.css"],
      js: [assets + "/_app/start-de303ce5.js", assets + "/_app/chunks/vendor-3fdee985.js", assets + "/_app/chunks/preload-helper-ec9aa979.js", assets + "/_app/chunks/singletons-12a22614.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
const d = (s2) => s2.replace(/%23/g, "#").replace(/%3[Bb]/g, ";").replace(/%2[Cc]/g, ",").replace(/%2[Ff]/g, "/").replace(/%3[Ff]/g, "?").replace(/%3[Aa]/g, ":").replace(/%40/g, "@").replace(/%26/g, "&").replace(/%3[Dd]/g, "=").replace(/%2[Bb]/g, "+").replace(/%24/g, "$");
const empty = () => ({});
const manifest = {
  assets: [{ "file": "favicon.png", "size": 4646, "type": "image/png" }, { "file": "fonts/Roboto-Regular.eot", "size": 168436, "type": "application/vnd.ms-fontobject" }, { "file": "fonts/Roboto-Regular.otf", "size": 233484, "type": "font/otf" }, { "file": "fonts/Roboto-Regular.svg", "size": 1013951, "type": "image/svg+xml" }, { "file": "fonts/Roboto-Regular.ttf", "size": 168260, "type": "font/ttf" }, { "file": "fonts/Roboto-Regular.woff", "size": 119608, "type": "font/woff" }, { "file": "fonts/omotenashi2-4be39-webfont.woff", "size": 16832, "type": "font/woff" }, { "file": "fonts/omotenashi2-4be39-webfont.woff2", "size": 12532, "type": "font/woff2" }, { "file": "global.css", "size": 816, "type": "text/css" }, { "file": "images/fond.jpg", "size": 18516, "type": "image/jpeg" }, { "file": "images/logo-projection-transition.png", "size": 32213, "type": "image/png" }, { "file": "images/og_logo.jpg", "size": 34095, "type": "image/jpeg" }, { "file": "mains.min.css", "size": 176697, "type": "text/css" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/article(?:\/(.*))?\/?$/,
      params: (m) => ({ data: d(m[1] || "") }),
      a: ["src/routes/__layout.svelte", "src/routes/article/[...data].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/login\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/login.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/film\/([^/]+?)\/?$/,
      params: (m) => ({ id: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/film/[id].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^(?:\/(.*))?\/?$/,
      params: (m) => ({ data: d(m[1] || "") }),
      a: ["src/routes/__layout.svelte", "src/routes/[...data].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
const get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
const module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error;
  }),
  "src/routes/article/[...data].svelte": () => Promise.resolve().then(function() {
    return ____data_$1;
  }),
  "src/routes/login.svelte": () => Promise.resolve().then(function() {
    return login;
  }),
  "src/routes/film/[id].svelte": () => Promise.resolve().then(function() {
    return _id_;
  }),
  "src/routes/[...data].svelte": () => Promise.resolve().then(function() {
    return ____data_;
  })
};
const metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-e3c55cde.js", "css": ["assets/pages/__layout.svelte-4023d378.css", "assets/vendor-cf063f61.css"], "js": ["pages/__layout.svelte-e3c55cde.js", "chunks/vendor-3fdee985.js", "chunks/navigation-51f4a605.js", "chunks/singletons-12a22614.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-51ec9325.js", "css": ["assets/vendor-cf063f61.css"], "js": ["error.svelte-51ec9325.js", "chunks/vendor-3fdee985.js"], "styles": [] }, "src/routes/article/[...data].svelte": { "entry": "pages/article/[...data].svelte-6891b843.js", "css": ["assets/vendor-cf063f61.css", "assets/Loading-cf5c7f6a.css"], "js": ["pages/article/[...data].svelte-6891b843.js", "chunks/vendor-3fdee985.js", "chunks/articleActions-ad1ac21e.js", "chunks/CustomContainer-bc27152c.js", "chunks/Loading-dcfb4fcc.js", "chunks/navigation-51f4a605.js", "chunks/singletons-12a22614.js"], "styles": [] }, "src/routes/login.svelte": { "entry": "pages/login.svelte-62a72403.js", "css": ["assets/vendor-cf063f61.css"], "js": ["pages/login.svelte-62a72403.js", "chunks/vendor-3fdee985.js", "chunks/CustomContainer-bc27152c.js", "chunks/navigation-51f4a605.js", "chunks/singletons-12a22614.js"], "styles": [] }, "src/routes/film/[id].svelte": { "entry": "pages/film/[id].svelte-ef1a2ecd.js", "css": ["assets/pages/film/[id].svelte-3e993aa3.css", "assets/vendor-cf063f61.css", "assets/SeoComponent-49d123e3.css", "assets/Loading-cf5c7f6a.css"], "js": ["pages/film/[id].svelte-ef1a2ecd.js", "chunks/vendor-3fdee985.js", "chunks/SeoComponent-930bd339.js", "chunks/CustomContainer-bc27152c.js", "chunks/Loading-dcfb4fcc.js", "chunks/navigation-51f4a605.js", "chunks/singletons-12a22614.js"], "styles": [] }, "src/routes/[...data].svelte": { "entry": "pages/[...data].svelte-7ad2d73e.js", "css": ["assets/pages/[...data].svelte-33008d0b.css", "assets/vendor-cf063f61.css", "assets/Loading-cf5c7f6a.css", "assets/SeoComponent-49d123e3.css"], "js": ["pages/[...data].svelte-7ad2d73e.js", "chunks/vendor-3fdee985.js", "chunks/CustomContainer-bc27152c.js", "chunks/Loading-dcfb4fcc.js", "chunks/navigation-51f4a605.js", "chunks/singletons-12a22614.js", "chunks/SeoComponent-930bd339.js", "chunks/articleActions-ad1ac21e.js", "chunks/preload-helper-ec9aa979.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender: prerender2
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender: prerender2 });
}
function isObject(value) {
  const type = typeof value;
  return value != null && (type == "object" || type == "function");
}
function getColumnSizeClass(isXs, colWidth, colSize) {
  if (colSize === true || colSize === "") {
    return isXs ? "col" : `col-${colWidth}`;
  } else if (colSize === "auto") {
    return isXs ? "col-auto" : `col-${colWidth}-auto`;
  }
  return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
}
function toClassName(value) {
  let result = "";
  if (typeof value === "string" || typeof value === "number") {
    result += value;
  } else if (typeof value === "object") {
    if (Array.isArray(value)) {
      result = value.map(toClassName).filter(Boolean).join(" ");
    } else {
      for (let key in value) {
        if (value[key]) {
          result && (result += " ");
          result += key;
        }
      }
    }
  }
  return result;
}
function classnames(...args) {
  return args.map(toClassName).filter(Boolean).join(" ");
}
const subscriber_queue = [];
function writable(value, start2 = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn2) {
    set(fn2(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start2(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
const Collapse = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, [
    "isOpen",
    "class",
    "navbar",
    "onEntering",
    "onEntered",
    "onExiting",
    "onExited",
    "expand",
    "toggler"
  ]);
  const dispatch = createEventDispatcher();
  let { isOpen = false } = $$props;
  let { class: className = "" } = $$props;
  let { navbar = false } = $$props;
  let { onEntering = () => dispatch("opening") } = $$props;
  let { onEntered = () => dispatch("open") } = $$props;
  let { onExiting = () => dispatch("closing") } = $$props;
  let { onExited = () => dispatch("close") } = $$props;
  let { expand: expand2 = false } = $$props;
  let { toggler = null } = $$props;
  let windowWidth = 0;
  let _wasMaximized = false;
  const minWidth = {};
  minWidth["xs"] = 0;
  minWidth["sm"] = 576;
  minWidth["md"] = 768;
  minWidth["lg"] = 992;
  minWidth["xl"] = 1200;
  function notify() {
    dispatch("update", isOpen);
  }
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.navbar === void 0 && $$bindings.navbar && navbar !== void 0)
    $$bindings.navbar(navbar);
  if ($$props.onEntering === void 0 && $$bindings.onEntering && onEntering !== void 0)
    $$bindings.onEntering(onEntering);
  if ($$props.onEntered === void 0 && $$bindings.onEntered && onEntered !== void 0)
    $$bindings.onEntered(onEntered);
  if ($$props.onExiting === void 0 && $$bindings.onExiting && onExiting !== void 0)
    $$bindings.onExiting(onExiting);
  if ($$props.onExited === void 0 && $$bindings.onExited && onExited !== void 0)
    $$bindings.onExited(onExited);
  if ($$props.expand === void 0 && $$bindings.expand && expand2 !== void 0)
    $$bindings.expand(expand2);
  if ($$props.toggler === void 0 && $$bindings.toggler && toggler !== void 0)
    $$bindings.toggler(toggler);
  classes = classnames(className, navbar && "navbar-collapse");
  {
    if (navbar && expand2) {
      if (windowWidth >= minWidth[expand2] && !isOpen) {
        isOpen = true;
        _wasMaximized = true;
        notify();
      } else if (windowWidth < minWidth[expand2] && _wasMaximized) {
        isOpen = false;
        _wasMaximized = false;
        notify();
      }
    }
  }
  return `

${isOpen ? `<div${spread([
    {
      style: escape_attribute_value(navbar ? void 0 : "overflow: hidden;")
    },
    escape_object($$restProps),
    { class: escape_attribute_value(classes) }
  ])}>${slots.default ? slots.default({}) : ``}</div>` : ``}`;
});
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let ariaLabel;
  let classes;
  let defaultAriaLabel;
  let $$restProps = compute_rest_props($$props, [
    "class",
    "active",
    "block",
    "children",
    "close",
    "color",
    "disabled",
    "href",
    "inner",
    "outline",
    "size",
    "style",
    "value"
  ]);
  let { class: className = "" } = $$props;
  let { active = false } = $$props;
  let { block: block2 = false } = $$props;
  let { children = void 0 } = $$props;
  let { close = false } = $$props;
  let { color = "secondary" } = $$props;
  let { disabled = false } = $$props;
  let { href = "" } = $$props;
  let { inner = void 0 } = $$props;
  let { outline = false } = $$props;
  let { size = null } = $$props;
  let { style = "" } = $$props;
  let { value = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.block === void 0 && $$bindings.block && block2 !== void 0)
    $$bindings.block(block2);
  if ($$props.children === void 0 && $$bindings.children && children !== void 0)
    $$bindings.children(children);
  if ($$props.close === void 0 && $$bindings.close && close !== void 0)
    $$bindings.close(close);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.inner === void 0 && $$bindings.inner && inner !== void 0)
    $$bindings.inner(inner);
  if ($$props.outline === void 0 && $$bindings.outline && outline !== void 0)
    $$bindings.outline(outline);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  ariaLabel = $$props["aria-label"];
  classes = classnames(className, close ? "btn-close" : "btn", close || `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block2 ? "d-block w-100" : false, { active });
  defaultAriaLabel = close ? "Close" : null;
  return `${href ? `<a${spread([
    escape_object($$restProps),
    { class: escape_attribute_value(classes) },
    { disabled: disabled || null },
    { href: escape_attribute_value(href) },
    {
      "aria-label": escape_attribute_value(ariaLabel || defaultAriaLabel)
    },
    { style: escape_attribute_value(style) }
  ])}${add_attribute("this", inner, 0)}>${children ? `${escape$4(children)}` : `${slots.default ? slots.default({}) : ``}`}</a>` : `<button${spread([
    escape_object($$restProps),
    { class: escape_attribute_value(classes) },
    { disabled: disabled || null },
    { value: escape_attribute_value(value) },
    {
      "aria-label": escape_attribute_value(ariaLabel || defaultAriaLabel)
    },
    { style: escape_attribute_value(style) }
  ])}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : `
      ${children ? `${escape$4(children)}` : `${slots.default ? slots.default({}) : ``}`}
    `}</button>`}`;
});
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
var round$1 = Math.round;
function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (isHTMLElement(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth;
    if (offsetWidth > 0) {
      scaleX = rect.width / offsetWidth || 1;
    }
    if (offsetHeight > 0) {
      scaleY = rect.height / offsetHeight || 1;
    }
  }
  return {
    width: round$1(rect.width / scaleX),
    height: round$1(rect.height / scaleY),
    top: round$1(rect.top / scaleY),
    right: round$1(rect.right / scaleX),
    bottom: round$1(rect.bottom / scaleY),
    left: round$1(rect.left / scaleX),
    x: round$1(rect.left / scaleX),
    y: round$1(rect.top / scaleY)
  };
}
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = rect.width / element.offsetWidth || 1;
  var scaleY = rect.height / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
}
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
}
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1;
  var isIE = navigator.userAgent.indexOf("Trident") !== -1;
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css2 = getComputedStyle(currentNode);
    if (css2.transform !== "none" || css2.perspective !== "none" || css2.contain === "paint" || ["transform", "perspective"].indexOf(css2.willChange) !== -1 || isFirefox && css2.willChange === "filter" || isFirefox && css2.filter && css2.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
function debounce(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve2) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve2(fn2());
        });
      });
    }
    return pending;
  };
}
function getBasePlacement(placement) {
  return placement.split("-")[0];
}
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}
function getViewportRect(element) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y
  };
}
var max = Math.max;
var min = Math.min;
var round = Math.round;
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;
  if (getComputedStyle(body || html).direction === "rtl") {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}
function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
function getVariation(placement) {
  return placement.split("-")[1];
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
    }
  }
  return offsets;
}
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}
function expandToHashMap(value, keys) {
  return keys.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}
function detectOverflow(state, options2) {
  if (options2 === void 0) {
    options2 = {};
  }
  var _options = options2, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions2 = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper2(reference2, popper2, options2) {
    if (options2 === void 0) {
      options2 = defaultOptions2;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions2),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state,
      setOptions: function setOptions(setOptionsAction) {
        var options3 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions2, state.options, options3);
        state.scrollParents = {
          reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state = fn2({
              state,
              options: _options,
              name,
              instance
            }) || state;
          }
        }
      },
      update: debounce(function() {
        return new Promise(function(resolve2) {
          instance.forceUpdate();
          resolve2(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options2).then(function(state2) {
      if (!isDestroyed && options2.onFirstUpdate) {
        options2.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref3) {
        var name = _ref3.name, _ref3$options = _ref3.options, options3 = _ref3$options === void 0 ? {} : _ref3$options, effect2 = _ref3.effect;
        if (typeof effect2 === "function") {
          var cleanupFn = effect2({
            state,
            name,
            instance,
            options: options3
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}
var passive = {
  passive: true
};
function effect$2(_ref) {
  var state = _ref.state, instance = _ref.instance, options2 = _ref.options;
  var _options$scroll = options2.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options2.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
var eventListeners = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect: effect$2,
  data: {}
};
function popperOffsets(_ref) {
  var state = _ref.state, name = _ref.name;
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
var popperOffsets$1 = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref) {
  var x = _ref.x, y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(round(x * dpr) / dpr) || 0,
    y: round(round(y * dpr) / dpr) || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets;
  var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === "function" ? roundOffsets(offsets) : offsets, _ref3$x = _ref3.x, x = _ref3$x === void 0 ? 0 : _ref3$x, _ref3$y = _ref3.y, y = _ref3$y === void 0 ? 0 : _ref3$y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      y -= offsetParent[heightProp] - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      x -= offsetParent[widthProp] - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref4) {
  var state = _ref4.state, options2 = _ref4.options;
  var _options$gpuAccelerat = options2.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options2.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options2.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
var computeStyles$1 = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect$1(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles$1 = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect: effect$1,
  requires: ["computeStyles"]
};
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state, options2 = _ref2.options, name = _ref2.name;
  var _options$offset = options2.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }
  state.modifiersData[name] = data;
}
var offset$1 = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};
var hash$1 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash$1[matched];
  });
}
var hash = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash[matched];
  });
}
function computeAutoPlacement(state, options2) {
  if (options2 === void 0) {
    options2 = {};
  }
  var _options = options2, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a, b) {
    return overflows[a] - overflows[b];
  });
}
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state, options2 = _ref.options, name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options2.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options2.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options2.fallbackPlacements, padding = options2.padding, boundary = options2.boundary, rootBoundary = options2.rootBoundary, altBoundary = options2.altBoundary, _options$flipVariatio = options2.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options2.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i = 0; i < placements2.length; i++) {
    var placement = placements2[i];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break")
        break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
var flip$1 = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function preventOverflow(_ref) {
  var state = _ref.state, options2 = _ref.options, name = _ref.name;
  var _options$mainAxis = options2.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options2.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options2.boundary, rootBoundary = options2.rootBoundary, altBoundary = options2.altBoundary, padding = options2.padding, _options$tether = options2.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options2.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis || checkAltAxis) {
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min$1 = popperOffsets2[mainAxis] + overflow[mainSide];
    var max$1 = popperOffsets2[mainAxis] - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
    var tetherMin = popperOffsets2[mainAxis] + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = popperOffsets2[mainAxis] + maxOffset - offsetModifierValue;
    if (checkMainAxis) {
      var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1);
      popperOffsets2[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset2;
    }
    if (checkAltAxis) {
      var _mainSide = mainAxis === "x" ? top : left;
      var _altSide = mainAxis === "x" ? bottom : right;
      var _offset = popperOffsets2[altAxis];
      var _min = _offset + overflow[_mainSide];
      var _max = _offset - overflow[_altSide];
      var _preventedOffset = within(tether ? min(_min, tetherMin) : _min, _offset, tether ? max(_max, tetherMax) : _max);
      popperOffsets2[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }
  }
  state.modifiersData[name] = data;
}
var preventOverflow$1 = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};
var toPaddingObject = function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name = _ref.name, options2 = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options2.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect(_ref2) {
  var state = _ref2.state, options2 = _ref2.options;
  var _options$element = options2.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }
  state.elements.arrow = arrowElement;
}
var arrow$1 = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state, name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
var hide$1 = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};
var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});
function createPopperActions(initOptions) {
  let contentNode;
  let options2 = initOptions;
  let popperInstance = null;
  let referenceNode;
  const initPopper = () => {
    if (referenceNode && contentNode) {
      popperInstance = createPopper(referenceNode, contentNode, options2);
    }
  };
  const deinitPopper = () => {
    if (popperInstance) {
      popperInstance.destroy();
      popperInstance = null;
    }
  };
  const referenceAction = (node) => {
    referenceNode = node;
    initPopper();
    return {
      destroy() {
        deinitPopper();
      }
    };
  };
  const contentAction = (node, contentOptions) => {
    contentNode = node;
    options2 = Object.assign(Object.assign({}, initOptions), contentOptions);
    initPopper();
    return {
      update(newContentOptions) {
        options2 = Object.assign(Object.assign({}, initOptions), newContentOptions);
        if (popperInstance && options2) {
          popperInstance.setOptions(options2);
        }
      },
      destroy() {
        deinitPopper();
      }
    };
  };
  return [referenceAction, contentAction, () => popperInstance];
}
const createContext = () => writable({});
const Dropdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let subItemIsActive;
  let classes;
  let handleToggle;
  let $$restProps = compute_rest_props($$props, [
    "class",
    "active",
    "addonType",
    "direction",
    "dropup",
    "group",
    "inNavbar",
    "isOpen",
    "nav",
    "setActiveFromChild",
    "size",
    "toggle"
  ]);
  const noop2 = () => void 0;
  let context = createContext();
  setContext("dropdownContext", context);
  let { class: className = "" } = $$props;
  let { active = false } = $$props;
  let { addonType = false } = $$props;
  let { direction = "down" } = $$props;
  let { dropup = false } = $$props;
  let { group = false } = $$props;
  let { inNavbar = false } = $$props;
  let { isOpen = false } = $$props;
  let { nav = false } = $$props;
  let { setActiveFromChild = false } = $$props;
  let { size = "" } = $$props;
  let { toggle = void 0 } = $$props;
  const [popperRef, popperContent] = createPopperActions();
  const validDirections = ["up", "down", "left", "right", "start", "end"];
  if (validDirections.indexOf(direction) === -1) {
    throw new Error(`Invalid direction sent: '${direction}' is not one of 'up', 'down', 'left', 'right', 'start', 'end'`);
  }
  let component;
  let dropdownDirection;
  function handleDocumentClick(e) {
    if (e && (e.which === 3 || e.type === "keyup" && e.which !== 9))
      return;
    if (component.contains(e.target) && component !== e.target && (e.type !== "keyup" || e.which === 9)) {
      return;
    }
    handleToggle(e);
  }
  onDestroy(() => {
    if (typeof document !== "undefined") {
      ["click", "touchstart", "keyup"].forEach((event) => document.removeEventListener(event, handleDocumentClick, true));
    }
  });
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.addonType === void 0 && $$bindings.addonType && addonType !== void 0)
    $$bindings.addonType(addonType);
  if ($$props.direction === void 0 && $$bindings.direction && direction !== void 0)
    $$bindings.direction(direction);
  if ($$props.dropup === void 0 && $$bindings.dropup && dropup !== void 0)
    $$bindings.dropup(dropup);
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.inNavbar === void 0 && $$bindings.inNavbar && inNavbar !== void 0)
    $$bindings.inNavbar(inNavbar);
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.nav === void 0 && $$bindings.nav && nav !== void 0)
    $$bindings.nav(nav);
  if ($$props.setActiveFromChild === void 0 && $$bindings.setActiveFromChild && setActiveFromChild !== void 0)
    $$bindings.setActiveFromChild(setActiveFromChild);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0)
    $$bindings.toggle(toggle);
  subItemIsActive = !!(setActiveFromChild && component && typeof component.querySelector === "function" && component.querySelector(".active"));
  {
    {
      if (direction === "left")
        dropdownDirection = "start";
      else if (direction === "right")
        dropdownDirection = "end";
      else
        dropdownDirection = direction;
    }
  }
  handleToggle = toggle || (() => isOpen = !isOpen);
  classes = classnames(className, direction !== "down" && `drop${dropdownDirection}`, nav && active ? "active" : false, setActiveFromChild && subItemIsActive ? "active" : false, {
    [`input-group-${addonType}`]: addonType,
    "btn-group": group,
    [`btn-group-${size}`]: !!size,
    dropdown: !group && !addonType,
    show: isOpen,
    "nav-item": nav
  });
  {
    {
      if (typeof document !== "undefined") {
        if (isOpen) {
          ["click", "touchstart", "keyup"].forEach((event) => document.addEventListener(event, handleDocumentClick, true));
        } else {
          ["click", "touchstart", "keyup"].forEach((event) => document.removeEventListener(event, handleDocumentClick, true));
        }
      }
    }
  }
  {
    {
      context.update(() => {
        return {
          toggle: handleToggle,
          isOpen,
          direction: direction === "down" && dropup ? "up" : direction,
          inNavbar,
          popperRef: nav ? noop2 : popperRef,
          popperContent: nav ? noop2 : popperContent
        };
      });
    }
  }
  return `${nav ? `<li${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}${add_attribute("this", component, 0)}>${slots.default ? slots.default({}) : ``}</li>` : `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}${add_attribute("this", component, 0)}>${slots.default ? slots.default({}) : ``}</div>`}`;
});
const Carousel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "class",
    "style",
    "items",
    "activeIndex",
    "dark",
    "ride",
    "interval",
    "pause",
    "keyboard"
  ]);
  let classes = "";
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { items = [] } = $$props;
  let { activeIndex = 0 } = $$props;
  let { dark = false } = $$props;
  let { ride = true } = $$props;
  let { interval = 5e3 } = $$props;
  let { pause = true } = $$props;
  let { keyboard = true } = $$props;
  onDestroy(() => {
  });
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.activeIndex === void 0 && $$bindings.activeIndex && activeIndex !== void 0)
    $$bindings.activeIndex(activeIndex);
  if ($$props.dark === void 0 && $$bindings.dark && dark !== void 0)
    $$bindings.dark(dark);
  if ($$props.ride === void 0 && $$bindings.ride && ride !== void 0)
    $$bindings.ride(ride);
  if ($$props.interval === void 0 && $$bindings.interval && interval !== void 0)
    $$bindings.interval(interval);
  if ($$props.pause === void 0 && $$bindings.pause && pause !== void 0)
    $$bindings.pause(pause);
  if ($$props.keyboard === void 0 && $$bindings.keyboard && keyboard !== void 0)
    $$bindings.keyboard(keyboard);
  classes = classnames(className, "carousel", "slide", { "carousel-dark": dark });
  return `

<div${spread([
    escape_object($$restProps),
    { class: escape_attribute_value(classes) },
    { style: escape_attribute_value(style) }
  ])}>${slots.default ? slots.default({}) : ``}</div>`;
});
const CarouselCaption = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "captionHeader", "captionText"]);
  let classes = "";
  let { class: className = "" } = $$props;
  let { captionHeader = "" } = $$props;
  let { captionText = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.captionHeader === void 0 && $$bindings.captionHeader && captionHeader !== void 0)
    $$bindings.captionHeader(captionHeader);
  if ($$props.captionText === void 0 && $$bindings.captionText && captionText !== void 0)
    $$bindings.captionText(captionText);
  classes = classnames(className, "carousel-caption", "d-none", "d-md-block");
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${captionHeader ? `<h5>${escape$4(captionHeader)}</h5>` : ``}
  ${captionText ? `<p>${escape$4(captionText)}</p>` : ``}
  ${slots.default ? slots.default({}) : ``}</div>`;
});
const CarouselControl = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "direction", "directionText", "activeIndex", "items", "wrap"]);
  let classes = "";
  let { class: className = "" } = $$props;
  let srText = "";
  let { direction = "" } = $$props;
  let { directionText = "" } = $$props;
  let { activeIndex = 0 } = $$props;
  let { items = [] } = $$props;
  let { wrap = true } = $$props;
  const getSrText = (direction2) => {
    if (direction2 === "next") {
      return "Next";
    } else if (direction2 === "prev") {
      return "Previous";
    }
  };
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.direction === void 0 && $$bindings.direction && direction !== void 0)
    $$bindings.direction(direction);
  if ($$props.directionText === void 0 && $$bindings.directionText && directionText !== void 0)
    $$bindings.directionText(directionText);
  if ($$props.activeIndex === void 0 && $$bindings.activeIndex && activeIndex !== void 0)
    $$bindings.activeIndex(activeIndex);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.wrap === void 0 && $$bindings.wrap && wrap !== void 0)
    $$bindings.wrap(wrap);
  classes = classnames(`carousel-control-${direction}`, className);
  srText = directionText ? directionText : getSrText(direction);
  return `<a${spread([
    escape_object($$restProps),
    { class: escape_attribute_value(classes) },
    { role: "button" },
    { href: "#" + escape$4(direction) }
  ])}><span class="${"carousel-control-" + escape$4(direction) + "-icon"}" aria-hidden="${"true"}"></span>
  <span class="${"visually-hidden"}">${escape$4(srText)}</span></a>`;
});
const CarouselItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "itemIndex", "activeIndex"]);
  let classes = "";
  let { class: className = "" } = $$props;
  let { itemIndex = 0 } = $$props;
  let { activeIndex = 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.itemIndex === void 0 && $$bindings.itemIndex && itemIndex !== void 0)
    $$bindings.itemIndex(itemIndex);
  if ($$props.activeIndex === void 0 && $$bindings.activeIndex && activeIndex !== void 0)
    $$bindings.activeIndex(activeIndex);
  classes = classnames(className, "carousel-item");
  return `<div${spread([escape_object($$restProps), { class: escape$4(classes) + " active" }], itemIndex === activeIndex ? "active" : "")}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Col = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "xs", "sm", "md", "lg", "xl", "xxl"]);
  let { class: className = "" } = $$props;
  let { xs = void 0 } = $$props;
  let { sm = void 0 } = $$props;
  let { md = void 0 } = $$props;
  let { lg = void 0 } = $$props;
  let { xl = void 0 } = $$props;
  let { xxl = void 0 } = $$props;
  const colClasses = [];
  const lookup = { xs, sm, md, lg, xl, xxl };
  Object.keys(lookup).forEach((colWidth) => {
    const columnProp = lookup[colWidth];
    if (!columnProp && columnProp !== "") {
      return;
    }
    const isXs = colWidth === "xs";
    if (isObject(columnProp)) {
      const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
      const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);
      if (columnProp.size || columnProp.size === "") {
        colClasses.push(colClass);
      }
      if (columnProp.push) {
        colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
      }
      if (columnProp.pull) {
        colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
      }
      if (columnProp.offset) {
        colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
      }
    } else {
      colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    }
  });
  if (!colClasses.length) {
    colClasses.push("col");
  }
  if (className) {
    colClasses.push(className);
  }
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.xs === void 0 && $$bindings.xs && xs !== void 0)
    $$bindings.xs(xs);
  if ($$props.sm === void 0 && $$bindings.sm && sm !== void 0)
    $$bindings.sm(sm);
  if ($$props.md === void 0 && $$bindings.md && md !== void 0)
    $$bindings.md(md);
  if ($$props.lg === void 0 && $$bindings.lg && lg !== void 0)
    $$bindings.lg(lg);
  if ($$props.xl === void 0 && $$bindings.xl && xl !== void 0)
    $$bindings.xl(xl);
  if ($$props.xxl === void 0 && $$bindings.xxl && xxl !== void 0)
    $$bindings.xxl(xxl);
  return `<div${spread([
    escape_object($$restProps),
    {
      class: escape_attribute_value(colClasses.join(" "))
    }
  ])}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Container = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "sm", "md", "lg", "xl", "xxl", "fluid"]);
  let { class: className = "" } = $$props;
  let { sm = void 0 } = $$props;
  let { md = void 0 } = $$props;
  let { lg = void 0 } = $$props;
  let { xl = void 0 } = $$props;
  let { xxl = void 0 } = $$props;
  let { fluid = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.sm === void 0 && $$bindings.sm && sm !== void 0)
    $$bindings.sm(sm);
  if ($$props.md === void 0 && $$bindings.md && md !== void 0)
    $$bindings.md(md);
  if ($$props.lg === void 0 && $$bindings.lg && lg !== void 0)
    $$bindings.lg(lg);
  if ($$props.xl === void 0 && $$bindings.xl && xl !== void 0)
    $$bindings.xl(xl);
  if ($$props.xxl === void 0 && $$bindings.xxl && xxl !== void 0)
    $$bindings.xxl(xxl);
  if ($$props.fluid === void 0 && $$bindings.fluid && fluid !== void 0)
    $$bindings.fluid(fluid);
  classes = classnames(className, {
    "container-sm": sm,
    "container-md": md,
    "container-lg": lg,
    "container-xl": xl,
    "container-xxl": xxl,
    "container-fluid": fluid,
    container: !sm && !md && !lg && !xl && !xxl && !fluid
  });
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</div>`;
});
const DropdownItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "active", "disabled", "divider", "header", "toggle", "href"]);
  let $$unsubscribe_context;
  const context = getContext("dropdownContext");
  $$unsubscribe_context = subscribe(context, (value) => value);
  let { class: className = "" } = $$props;
  let { active = false } = $$props;
  let { disabled = false } = $$props;
  let { divider = false } = $$props;
  let { header = false } = $$props;
  let { toggle = true } = $$props;
  let { href = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.divider === void 0 && $$bindings.divider && divider !== void 0)
    $$bindings.divider(divider);
  if ($$props.header === void 0 && $$bindings.header && header !== void 0)
    $$bindings.header(header);
  if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0)
    $$bindings.toggle(toggle);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  classes = classnames(className, {
    disabled,
    "dropdown-item": !divider && !header,
    active,
    "dropdown-header": header,
    "dropdown-divider": divider
  });
  $$unsubscribe_context();
  return `${header ? `<h6${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</h6>` : `${divider ? `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</div>` : `${href ? `<a${spread([
    escape_object($$restProps),
    { click: true },
    { href: escape_attribute_value(href) },
    { class: escape_attribute_value(classes) }
  ])}>${slots.default ? slots.default({}) : ``}</a>` : `<button${spread([
    { type: "button" },
    escape_object($$restProps),
    { class: escape_attribute_value(classes) }
  ])}>${slots.default ? slots.default({}) : ``}</button>`}`}`}`;
});
const DropdownMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "dark", "end", "right"]);
  let $context, $$unsubscribe_context;
  const context = getContext("dropdownContext");
  $$unsubscribe_context = subscribe(context, (value) => $context = value);
  let { class: className = "" } = $$props;
  let { dark = false } = $$props;
  let { end: end2 = false } = $$props;
  let { right: right2 = false } = $$props;
  const popperPlacement = (direction, end3) => {
    let prefix = direction;
    if (direction === "up")
      prefix = "top";
    else if (direction === "down")
      prefix = "bottom";
    let suffix = end3 ? "end" : "start";
    return `${prefix}-${suffix}`;
  };
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.dark === void 0 && $$bindings.dark && dark !== void 0)
    $$bindings.dark(dark);
  if ($$props.end === void 0 && $$bindings.end && end2 !== void 0)
    $$bindings.end(end2);
  if ($$props.right === void 0 && $$bindings.right && right2 !== void 0)
    $$bindings.right(right2);
  ({
    modifiers: [
      { name: "flip" },
      {
        name: "offset",
        options: { offset: [0, 2] }
      }
    ],
    placement: popperPlacement($context.direction, end2 || right2)
  });
  classes = classnames(className, "dropdown-menu", {
    "dropdown-menu-dark": dark,
    "dropdown-menu-end": end2 || right2,
    show: $context.isOpen
  });
  $$unsubscribe_context();
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</div>`;
});
const DropdownToggle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let btnClasses;
  let $$restProps = compute_rest_props($$props, [
    "class",
    "ariaLabel",
    "active",
    "block",
    "caret",
    "color",
    "disabled",
    "inner",
    "nav",
    "outline",
    "size",
    "split",
    "tag"
  ]);
  let $context, $$unsubscribe_context;
  const context = getContext("dropdownContext");
  $$unsubscribe_context = subscribe(context, (value) => $context = value);
  let { class: className = "" } = $$props;
  let { ariaLabel = "Toggle Dropdown" } = $$props;
  let { active = false } = $$props;
  let { block: block2 = false } = $$props;
  let { caret: caret2 = false } = $$props;
  let { color = "secondary" } = $$props;
  let { disabled = false } = $$props;
  let { inner = void 0 } = $$props;
  let { nav = false } = $$props;
  let { outline = false } = $$props;
  let { size = "" } = $$props;
  let { split = false } = $$props;
  let { tag = null } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.ariaLabel === void 0 && $$bindings.ariaLabel && ariaLabel !== void 0)
    $$bindings.ariaLabel(ariaLabel);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.block === void 0 && $$bindings.block && block2 !== void 0)
    $$bindings.block(block2);
  if ($$props.caret === void 0 && $$bindings.caret && caret2 !== void 0)
    $$bindings.caret(caret2);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.inner === void 0 && $$bindings.inner && inner !== void 0)
    $$bindings.inner(inner);
  if ($$props.nav === void 0 && $$bindings.nav && nav !== void 0)
    $$bindings.nav(nav);
  if ($$props.outline === void 0 && $$bindings.outline && outline !== void 0)
    $$bindings.outline(outline);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.split === void 0 && $$bindings.split && split !== void 0)
    $$bindings.split(split);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  classes = classnames(className, {
    "dropdown-toggle": caret2 || split,
    "dropdown-toggle-split": split,
    "nav-link": nav
  });
  btnClasses = classnames(classes, "btn", `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block2 ? "d-block w-100" : false, { active });
  $$unsubscribe_context();
  return `${nav ? `<a${spread([
    escape_object($$restProps),
    { href: "#nav" },
    {
      "aria-expanded": escape_attribute_value($context.isOpen)
    },
    { class: escape_attribute_value(classes) }
  ])}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : `
      <span class="${"visually-hidden"}">${escape$4(ariaLabel)}</span>
    `}</a>` : `${tag === "div" ? `<div${spread([
    escape_object($$restProps),
    {
      "aria-expanded": escape_attribute_value($context.isOpen)
    },
    { class: escape_attribute_value(classes) }
  ])}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : `
      <span class="${"visually-hidden"}">${escape$4(ariaLabel)}</span>
    `}</div>` : `${tag === "span" ? `<span${spread([
    escape_object($$restProps),
    {
      "aria-expanded": escape_attribute_value($context.isOpen)
    },
    { class: escape_attribute_value(classes) }
  ])}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : `
      <span class="${"visually-hidden"}">${escape$4(ariaLabel)}</span>
    `}</span>` : `<button${spread([
    escape_object($$restProps),
    { type: "button" },
    {
      "aria-expanded": escape_attribute_value($context.isOpen)
    },
    {
      class: escape_attribute_value(btnClasses)
    }
  ])}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : `
      <span class="${"visually-hidden"}">${escape$4(ariaLabel)}</span>
    `}</button>`}`}`}`;
});
const Form = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "inline", "validated"]);
  let { class: className = "" } = $$props;
  let { inline: inline2 = false } = $$props;
  let { validated = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.inline === void 0 && $$bindings.inline && inline2 !== void 0)
    $$bindings.inline(inline2);
  if ($$props.validated === void 0 && $$bindings.validated && validated !== void 0)
    $$bindings.validated(validated);
  classes = classnames(className, {
    "form-inline": inline2,
    "was-validated": validated
  });
  return `<form${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</form>`;
});
const FormCheck = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let inputClasses;
  let idFor;
  let $$restProps = compute_rest_props($$props, [
    "class",
    "checked",
    "disabled",
    "group",
    "id",
    "inline",
    "inner",
    "invalid",
    "label",
    "name",
    "size",
    "type",
    "valid",
    "value"
  ]);
  let { class: className = "" } = $$props;
  let { checked = false } = $$props;
  let { disabled = false } = $$props;
  let { group = void 0 } = $$props;
  let { id = void 0 } = $$props;
  let { inline: inline2 = false } = $$props;
  let { inner = void 0 } = $$props;
  let { invalid = false } = $$props;
  let { label = "" } = $$props;
  let { name = "" } = $$props;
  let { size = "" } = $$props;
  let { type = "checkbox" } = $$props;
  let { valid = false } = $$props;
  let { value = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.inline === void 0 && $$bindings.inline && inline2 !== void 0)
    $$bindings.inline(inline2);
  if ($$props.inner === void 0 && $$bindings.inner && inner !== void 0)
    $$bindings.inner(inner);
  if ($$props.invalid === void 0 && $$bindings.invalid && invalid !== void 0)
    $$bindings.invalid(invalid);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.valid === void 0 && $$bindings.valid && valid !== void 0)
    $$bindings.valid(valid);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  classes = classnames(className, "form-check", {
    "form-switch": type === "switch",
    "form-check-inline": inline2,
    [`form-control-${size}`]: size
  });
  inputClasses = classnames("form-check-input", { "is-invalid": invalid, "is-valid": valid });
  idFor = id || label;
  return `<div${add_attribute("class", classes, 0)}>${type === "radio" ? `<input${spread([
    escape_object($$restProps),
    {
      class: escape_attribute_value(inputClasses)
    },
    { id: escape_attribute_value(idFor) },
    { type: "radio" },
    { disabled: disabled || null },
    { name: escape_attribute_value(name) },
    { value: escape_attribute_value(value) }
  ])}${value === group ? add_attribute("checked", true, 1) : ""}${add_attribute("this", inner, 0)}>` : `${type === "switch" ? `<input${spread([
    escape_object($$restProps),
    {
      class: escape_attribute_value(inputClasses)
    },
    { id: escape_attribute_value(idFor) },
    { type: "checkbox" },
    { disabled: disabled || null },
    { name: escape_attribute_value(name) },
    { value: escape_attribute_value(value) }
  ])}${add_attribute("checked", checked, 1)}${add_attribute("this", inner, 0)}>` : `<input${spread([
    escape_object($$restProps),
    {
      class: escape_attribute_value(inputClasses)
    },
    { id: escape_attribute_value(idFor) },
    { type: "checkbox" },
    { disabled: disabled || null },
    { name: escape_attribute_value(name) },
    { value: escape_attribute_value(value) }
  ])}${add_attribute("checked", checked, 1)}${add_attribute("this", inner, 0)}>`}`}
  ${label ? `<label class="${"form-check-label"}"${add_attribute("for", idFor, 0)}>${slots.label ? slots.label({}) : `${escape$4(label)}`}</label>` : ``}</div>`;
});
const FormFeedback = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "valid", "tooltip"]);
  let { class: className = "" } = $$props;
  let { valid = void 0 } = $$props;
  let { tooltip = false } = $$props;
  let classes;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.valid === void 0 && $$bindings.valid && valid !== void 0)
    $$bindings.valid(valid);
  if ($$props.tooltip === void 0 && $$bindings.tooltip && tooltip !== void 0)
    $$bindings.tooltip(tooltip);
  {
    {
      const validMode = tooltip ? "tooltip" : "feedback";
      classes = classnames(className, valid ? `valid-${validMode}` : `invalid-${validMode}`);
    }
  }
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</div>`;
});
const FormGroup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "check", "disabled", "inline", "row", "tag"]);
  let { class: className = "" } = $$props;
  let { check = false } = $$props;
  let { disabled = false } = $$props;
  let { inline: inline2 = false } = $$props;
  let { row = false } = $$props;
  let { tag = null } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.check === void 0 && $$bindings.check && check !== void 0)
    $$bindings.check(check);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.inline === void 0 && $$bindings.inline && inline2 !== void 0)
    $$bindings.inline(inline2);
  if ($$props.row === void 0 && $$bindings.row && row !== void 0)
    $$bindings.row(row);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  classes = classnames(className, "mb-3", {
    row,
    "form-check": check,
    "form-check-inline": check && inline2,
    disabled: check && disabled
  });
  return `${tag === "fieldset" ? `<fieldset${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</fieldset>` : `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</div>`}`;
});
const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "name"]);
  let { class: className = "" } = $$props;
  let { name = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  classes = classnames(className, `bi-${name}`);
  return `<i${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}></i>`;
});
const InlineContainer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div>${slots.default ? slots.default({}) : ``}</div>`;
});
const Input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "class",
    "bsSize",
    "checked",
    "color",
    "disabled",
    "feedback",
    "files",
    "group",
    "inner",
    "invalid",
    "label",
    "multiple",
    "name",
    "placeholder",
    "plaintext",
    "readonly",
    "size",
    "type",
    "valid",
    "value"
  ]);
  let { class: className = "" } = $$props;
  let { bsSize = void 0 } = $$props;
  let { checked = false } = $$props;
  let { color = void 0 } = $$props;
  let { disabled = void 0 } = $$props;
  let { feedback = void 0 } = $$props;
  let { files = void 0 } = $$props;
  let { group = void 0 } = $$props;
  let { inner = void 0 } = $$props;
  let { invalid = false } = $$props;
  let { label = void 0 } = $$props;
  let { multiple = void 0 } = $$props;
  let { name = "" } = $$props;
  let { placeholder = "" } = $$props;
  let { plaintext = false } = $$props;
  let { readonly = void 0 } = $$props;
  let { size = void 0 } = $$props;
  let { type = "text" } = $$props;
  let { valid = false } = $$props;
  let { value = "" } = $$props;
  let classes;
  let tag;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.bsSize === void 0 && $$bindings.bsSize && bsSize !== void 0)
    $$bindings.bsSize(bsSize);
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.feedback === void 0 && $$bindings.feedback && feedback !== void 0)
    $$bindings.feedback(feedback);
  if ($$props.files === void 0 && $$bindings.files && files !== void 0)
    $$bindings.files(files);
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.inner === void 0 && $$bindings.inner && inner !== void 0)
    $$bindings.inner(inner);
  if ($$props.invalid === void 0 && $$bindings.invalid && invalid !== void 0)
    $$bindings.invalid(invalid);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.multiple === void 0 && $$bindings.multiple && multiple !== void 0)
    $$bindings.multiple(multiple);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.plaintext === void 0 && $$bindings.plaintext && plaintext !== void 0)
    $$bindings.plaintext(plaintext);
  if ($$props.readonly === void 0 && $$bindings.readonly && readonly !== void 0)
    $$bindings.readonly(readonly);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.valid === void 0 && $$bindings.valid && valid !== void 0)
    $$bindings.valid(valid);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        const isNotaNumber = new RegExp("\\D", "g");
        let isBtn = false;
        let formControlClass = "form-control";
        tag = "input";
        switch (type) {
          case "color":
            formControlClass = `form-control form-control-color`;
            break;
          case "range":
            formControlClass = "form-range";
            break;
          case "select":
            formControlClass = `form-select`;
            tag = "select";
            break;
          case "textarea":
            tag = "textarea";
            break;
          case "button":
          case "reset":
          case "submit":
            formControlClass = `btn btn-${color || "secondary"}`;
            isBtn = true;
            break;
          case "hidden":
          case "image":
            formControlClass = void 0;
            break;
          default:
            formControlClass = "form-control";
            tag = "input";
        }
        if (plaintext) {
          formControlClass = `${formControlClass}-plaintext`;
          tag = "input";
        }
        if (size && isNotaNumber.test(size)) {
          console.warn(`Please use the prop "bsSize" instead of the "size" to bootstrap's input sizing.`);
          bsSize = size;
          size = void 0;
        }
        classes = classnames(className, formControlClass, {
          "is-invalid": invalid,
          "is-valid": valid,
          [`form-control-${bsSize}`]: bsSize && !isBtn,
          [`btn-${bsSize}`]: bsSize && isBtn
        });
      }
    }
    $$rendered = `${tag === "input" ? `${type === "text" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "text" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null },
      { size: escape_attribute_value(size) }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "password" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "password" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null },
      { size: escape_attribute_value(size) }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "color" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "color" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "email" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "email" },
      { disabled: disabled || null },
      { multiple: multiple || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null },
      { size: escape_attribute_value(size) }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "file" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "file" },
      { disabled: disabled || null },
      { invalid: escape_attribute_value(invalid) },
      { multiple: multiple || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null },
      { valid: escape_attribute_value(valid) }
    ])}>` : `${type === "checkbox" || type === "radio" || type === "switch" ? `${validate_component(FormCheck, "FormCheck").$$render($$result, Object.assign($$restProps, { class: className }, { size: bsSize }, { type }, { disabled }, { invalid }, { label }, { name }, { placeholder }, { readonly }, { valid }, { checked }, { inner }, { group }, { value }), {
      checked: ($$value) => {
        checked = $$value;
        $$settled = false;
      },
      inner: ($$value) => {
        inner = $$value;
        $$settled = false;
      },
      group: ($$value) => {
        group = $$value;
        $$settled = false;
      },
      value: ($$value) => {
        value = $$value;
        $$settled = false;
      }
    }, {})}` : `${type === "url" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "url" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null },
      { size: escape_attribute_value(size) }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "number" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "number" },
      { readonly: readonly || null },
      { name: escape_attribute_value(name) },
      { disabled: disabled || null },
      {
        placeholder: escape_attribute_value(placeholder)
      }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "date" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "date" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "time" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "time" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "datetime" ? `<input${spread([
      escape_object($$restProps),
      { type: "datetime" },
      { readonly: readonly || null },
      { class: escape_attribute_value(classes) },
      { name: escape_attribute_value(name) },
      { disabled: disabled || null },
      {
        placeholder: escape_attribute_value(placeholder)
      }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "datetime-local" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "datetime-local" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "month" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "month" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "color" ? `<input${spread([
      escape_object($$restProps),
      { type: "color" },
      { readonly: readonly || null },
      { class: escape_attribute_value(classes) },
      { name: escape_attribute_value(name) },
      { disabled: disabled || null },
      {
        placeholder: escape_attribute_value(placeholder)
      }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "range" ? `<input${spread([
      escape_object($$restProps),
      { type: "range" },
      { readonly: readonly || null },
      { class: escape_attribute_value(classes) },
      { name: escape_attribute_value(name) },
      { disabled: disabled || null },
      {
        placeholder: escape_attribute_value(placeholder)
      }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "search" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "search" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null },
      { size: escape_attribute_value(size) }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "tel" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "tel" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null },
      { size: escape_attribute_value(size) }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "week" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "week" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `<input${spread([
      escape_object($$restProps),
      { type: escape_attribute_value(type) },
      { readonly: readonly || null },
      { class: escape_attribute_value(classes) },
      { name: escape_attribute_value(name) },
      { disabled: disabled || null },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { value: escape_attribute_value(value) }
    ])}>`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}` : `${tag === "textarea" ? `<textarea${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null }
    ])}${add_attribute("this", inner, 0)}>${value || ""}</textarea>` : `${tag === "select" && !multiple ? `<select${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { name: escape_attribute_value(name) },
      { disabled: disabled || null },
      { readonly: readonly || null }
    ])}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : ``}</select>

  ` : ``}`}`}
${feedback ? `${Array.isArray(feedback) ? `${each(feedback, (msg) => `${validate_component(FormFeedback, "FormFeedback").$$render($$result, { valid }, {}, { default: () => `${escape$4(msg)}` })}`)}` : `${validate_component(FormFeedback, "FormFeedback").$$render($$result, { valid }, {}, { default: () => `${escape$4(feedback)}` })}`}` : ``}`;
  } while (!$$settled);
  return $$rendered;
});
const Label = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "hidden", "check", "size", "for", "xs", "sm", "md", "lg", "xl", "xxl", "widths"]);
  let { class: className = "" } = $$props;
  let { hidden = false } = $$props;
  let { check = false } = $$props;
  let { size = "" } = $$props;
  let { for: fore = null } = $$props;
  let { xs = "" } = $$props;
  let { sm = "" } = $$props;
  let { md = "" } = $$props;
  let { lg = "" } = $$props;
  let { xl = "" } = $$props;
  let { xxl = "" } = $$props;
  const colWidths = { xs, sm, md, lg, xl, xxl };
  let { widths = Object.keys(colWidths) } = $$props;
  const colClasses = [];
  widths.forEach((colWidth) => {
    let columnProp = $$props[colWidth];
    if (!columnProp && columnProp !== "") {
      return;
    }
    const isXs = colWidth === "xs";
    let colClass;
    if (isObject(columnProp)) {
      const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
      colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);
      colClasses.push(classnames({
        [colClass]: columnProp.size || columnProp.size === "",
        [`order${colSizeInterfix}${columnProp.order}`]: columnProp.order || columnProp.order === 0,
        [`offset${colSizeInterfix}${columnProp.offset}`]: columnProp.offset || columnProp.offset === 0
      }));
    } else {
      colClass = getColumnSizeClass(isXs, colWidth, columnProp);
      colClasses.push(colClass);
    }
  });
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.hidden === void 0 && $$bindings.hidden && hidden !== void 0)
    $$bindings.hidden(hidden);
  if ($$props.check === void 0 && $$bindings.check && check !== void 0)
    $$bindings.check(check);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.for === void 0 && $$bindings.for && fore !== void 0)
    $$bindings.for(fore);
  if ($$props.xs === void 0 && $$bindings.xs && xs !== void 0)
    $$bindings.xs(xs);
  if ($$props.sm === void 0 && $$bindings.sm && sm !== void 0)
    $$bindings.sm(sm);
  if ($$props.md === void 0 && $$bindings.md && md !== void 0)
    $$bindings.md(md);
  if ($$props.lg === void 0 && $$bindings.lg && lg !== void 0)
    $$bindings.lg(lg);
  if ($$props.xl === void 0 && $$bindings.xl && xl !== void 0)
    $$bindings.xl(xl);
  if ($$props.xxl === void 0 && $$bindings.xxl && xxl !== void 0)
    $$bindings.xxl(xxl);
  if ($$props.widths === void 0 && $$bindings.widths && widths !== void 0)
    $$bindings.widths(widths);
  classes = classnames(className, hidden ? "visually-hidden" : false, check ? "form-check-label" : false, size ? `col-form-label-${size}` : false, colClasses, colClasses.length ? "col-form-label" : "form-label");
  return `<label${spread([
    escape_object($$restProps),
    { class: escape_attribute_value(classes) },
    { for: escape_attribute_value(fore) }
  ])}>${slots.default ? slots.default({}) : ``}</label>`;
});
const ModalBackdrop = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "isOpen", "fade"]);
  let { class: className = "" } = $$props;
  let { isOpen = false } = $$props;
  let { fade = true } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.fade === void 0 && $$bindings.fade && fade !== void 0)
    $$bindings.fade(fade);
  classes = classnames(className, "modal-backdrop");
  return `${isOpen ? `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], fade ? "fade" : "")}></div>` : ``}`;
});
const ModalBody = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  classes = classnames(className, "modal-body");
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</div>`;
});
const ModalHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "toggle", "closeAriaLabel", "children"]);
  let { class: className = "" } = $$props;
  let { toggle = void 0 } = $$props;
  let { closeAriaLabel = "Close" } = $$props;
  let { children = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0)
    $$bindings.toggle(toggle);
  if ($$props.closeAriaLabel === void 0 && $$bindings.closeAriaLabel && closeAriaLabel !== void 0)
    $$bindings.closeAriaLabel(closeAriaLabel);
  if ($$props.children === void 0 && $$bindings.children && children !== void 0)
    $$bindings.children(children);
  classes = classnames(className, "modal-header");
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}><h5 class="${"modal-title"}">${children ? `${escape$4(children)}` : `${slots.default ? slots.default({}) : ``}`}</h5>
  ${slots.close ? slots.close({}) : `
    ${typeof toggle === "function" ? `<button type="${"button"}" class="${"btn-close"}"${add_attribute("aria-label", closeAriaLabel, 0)}></button>` : ``}
  `}</div>`;
});
const Portal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  let ref;
  let portal;
  onDestroy(() => {
    if (typeof document !== "undefined") {
      document.body.removeChild(portal);
    }
  });
  return `<div${spread([escape_object($$restProps)])}${add_attribute("this", ref, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
var Modal_svelte_svelte_type_style_lang = ".modal-open{overflow:hidden;padding-right:0}";
const css$c = {
  code: ".modal-open{overflow:hidden;padding-right:0}",
  map: `{"version":3,"file":"Modal.svelte","sources":["Modal.svelte"],"sourcesContent":["<script context=\\"module\\">\\n  // TODO fade option\\n  let openCount = 0;\\n<\/script>\\n\\n<script>\\n  import classnames from './utils';\\n  import { browserEvent } from './utils';\\n  import {\\n    createEventDispatcher,\\n    onDestroy,\\n    onMount,\\n    afterUpdate\\n  } from 'svelte';\\n  import { modalIn, modalOut } from './transitions';\\n  import InlineContainer from './InlineContainer.svelte';\\n  import ModalBackdrop from './ModalBackdrop.svelte';\\n  import ModalBody from './ModalBody.svelte';\\n  import ModalHeader from './ModalHeader.svelte';\\n  import Portal from './Portal.svelte';\\n  import {\\n    conditionallyUpdateScrollbar,\\n    getOriginalBodyPadding,\\n    setScrollbarWidth\\n  } from './utils';\\n\\n  const dispatch = createEventDispatcher();\\n\\n  let className = '';\\n  let staticModal = false;\\n  export { className as class };\\n  export { staticModal as static };\\n  export let isOpen = false;\\n  export let autoFocus = true;\\n  export let body = false;\\n  export let centered = false;\\n  export let container = undefined;\\n  export let fullscreen = false;\\n  export let header = undefined;\\n  export let scrollable = false;\\n  export let size = '';\\n  export let toggle = undefined;\\n  export let labelledBy = '';\\n  export let backdrop = true;\\n  export let wrapClassName = '';\\n  export let modalClassName = '';\\n  export let contentClassName = '';\\n  export let fade = true;\\n  export let unmountOnClose = true;\\n  export let returnFocusAfterClose = true;\\n\\n  let hasOpened = false;\\n  let _isMounted = false;\\n  let _triggeringElement;\\n  let _originalBodyPadding;\\n  let _lastIsOpen = isOpen;\\n  let _lastHasOpened = hasOpened;\\n  let _dialog;\\n  let _mouseDownElement;\\n  let _removeEscListener;\\n\\n  onMount(() => {\\n    if (isOpen) {\\n      init();\\n      hasOpened = true;\\n    }\\n\\n    if (hasOpened && autoFocus) {\\n      setFocus();\\n    }\\n  });\\n\\n  onDestroy(() => {\\n    destroy();\\n    if (hasOpened) {\\n      close();\\n    }\\n  });\\n\\n  afterUpdate(() => {\\n    if (isOpen && !_lastIsOpen) {\\n      init();\\n      hasOpened = true;\\n    }\\n\\n    if (autoFocus && hasOpened && !_lastHasOpened) {\\n      setFocus();\\n    }\\n\\n    _lastIsOpen = isOpen;\\n    _lastHasOpened = hasOpened;\\n  });\\n\\n  function setFocus() {\\n    if (\\n      _dialog &&\\n      _dialog.parentNode &&\\n      typeof _dialog.parentNode.focus === 'function'\\n    ) {\\n      _dialog.parentNode.focus();\\n    }\\n  }\\n\\n  function init() {\\n    try {\\n      _triggeringElement = document.activeElement;\\n    } catch (err) {\\n      _triggeringElement = null;\\n    }\\n\\n    if (!staticModal) {\\n      _originalBodyPadding = getOriginalBodyPadding();\\n      conditionallyUpdateScrollbar();\\n      if (openCount === 0) {\\n        document.body.className = classnames(\\n          document.body.className,\\n          'modal-open'\\n        );\\n      }\\n\\n      ++openCount;\\n    }\\n    _isMounted = true;\\n  }\\n\\n  function manageFocusAfterClose() {\\n    if (_triggeringElement) {\\n      if (\\n        typeof _triggeringElement.focus === 'function' &&\\n        returnFocusAfterClose\\n      ) {\\n        _triggeringElement.focus();\\n      }\\n\\n      _triggeringElement = null;\\n    }\\n  }\\n\\n  function destroy() {\\n    manageFocusAfterClose();\\n  }\\n\\n  function close() {\\n    if (openCount <= 1) {\\n      document.body.classList.remove('modal-open');\\n    }\\n\\n    manageFocusAfterClose();\\n    openCount = Math.max(0, openCount - 1);\\n\\n    setScrollbarWidth(_originalBodyPadding);\\n  }\\n\\n  function handleBackdropClick(e) {\\n    if (e.target === _mouseDownElement) {\\n      e.stopPropagation();\\n      if (!isOpen || !backdrop) {\\n        return;\\n      }\\n\\n      const backdropElem = _dialog ? _dialog.parentNode : null;\\n      if (\\n        backdrop === true &&\\n        backdropElem &&\\n        e.target === backdropElem &&\\n        toggle\\n      ) {\\n        toggle(e);\\n      }\\n    }\\n  }\\n\\n  function onModalOpened() {\\n    dispatch('open');\\n    _removeEscListener = browserEvent(document, 'keydown', (event) => {\\n      if (event.key && event.key === 'Escape') {\\n        if (toggle && backdrop === true) toggle(event);\\n      }\\n    });\\n  }\\n\\n  function onModalClosed() {\\n    dispatch('close');\\n    if (_removeEscListener) {\\n      _removeEscListener();\\n    }\\n\\n    if (unmountOnClose) {\\n      destroy();\\n    }\\n    close();\\n    if (_isMounted) {\\n      hasOpened = false;\\n    }\\n    _isMounted = false;\\n  }\\n\\n  function handleBackdropMouseDown(e) {\\n    _mouseDownElement = e.target;\\n  }\\n\\n  const dialogBaseClass = 'modal-dialog';\\n\\n  $: classes = classnames(dialogBaseClass, className, {\\n    [\`modal-\${size}\`]: size,\\n    'modal-fullscreen': fullscreen === true,\\n    [\`modal-fullscreen-\${fullscreen}-down\`]:\\n      fullscreen && typeof fullscreen === 'string',\\n    [\`\${dialogBaseClass}-centered\`]: centered,\\n    [\`\${dialogBaseClass}-scrollable\`]: scrollable\\n  });\\n\\n  $: outer = container === 'inline' || staticModal ? InlineContainer : Portal;\\n<\/script>\\n\\n{#if _isMounted}\\n  <svelte:component this={outer}>\\n    <div class={wrapClassName} tabindex=\\"-1\\" {...$$restProps}>\\n      {#if isOpen}\\n        <div\\n          in:modalIn\\n          out:modalOut\\n          ariaLabelledby={labelledBy}\\n          class={classnames('modal', modalClassName, {\\n            fade,\\n            'position-static': staticModal\\n          })}\\n          role=\\"dialog\\"\\n          on:introstart={() => dispatch('opening')}\\n          on:introend={onModalOpened}\\n          on:outrostart={() => dispatch('closing')}\\n          on:outroend={onModalClosed}\\n          on:click={handleBackdropClick}\\n          on:mousedown={handleBackdropMouseDown}\\n        >\\n          <slot name=\\"external\\" />\\n          <div class={classes} role=\\"document\\" bind:this={_dialog}>\\n            <div class={classnames('modal-content', contentClassName)}>\\n              {#if header}\\n                <ModalHeader {toggle}>\\n                  {header}\\n                </ModalHeader>\\n              {/if}\\n              {#if body}\\n                <ModalBody>\\n                  <slot />\\n                </ModalBody>\\n              {:else}\\n                <slot />\\n              {/if}\\n            </div>\\n          </div>\\n        </div>\\n      {/if}\\n    </div>\\n  </svelte:component>\\n{/if}\\n{#if backdrop && !staticModal}\\n  <svelte:component this={outer}>\\n    <ModalBackdrop {fade} {isOpen} />\\n  </svelte:component>\\n{/if}\\n\\n<style>\\n  :global(.modal-open) {\\n    overflow: hidden;\\n    padding-right: 0;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAwQU,WAAW,AAAE,CAAC,AACpB,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,CAAC,AAClB,CAAC"}`
};
const dialogBaseClass = "modal-dialog";
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let outer;
  compute_rest_props($$props, [
    "class",
    "static",
    "isOpen",
    "autoFocus",
    "body",
    "centered",
    "container",
    "fullscreen",
    "header",
    "scrollable",
    "size",
    "toggle",
    "labelledBy",
    "backdrop",
    "wrapClassName",
    "modalClassName",
    "contentClassName",
    "fade",
    "unmountOnClose",
    "returnFocusAfterClose"
  ]);
  createEventDispatcher();
  let { class: className = "" } = $$props;
  let { static: staticModal = false } = $$props;
  let { isOpen = false } = $$props;
  let { autoFocus = true } = $$props;
  let { body = false } = $$props;
  let { centered = false } = $$props;
  let { container = void 0 } = $$props;
  let { fullscreen = false } = $$props;
  let { header = void 0 } = $$props;
  let { scrollable = false } = $$props;
  let { size = "" } = $$props;
  let { toggle = void 0 } = $$props;
  let { labelledBy = "" } = $$props;
  let { backdrop = true } = $$props;
  let { wrapClassName = "" } = $$props;
  let { modalClassName = "" } = $$props;
  let { contentClassName = "" } = $$props;
  let { fade = true } = $$props;
  let { unmountOnClose = true } = $$props;
  let { returnFocusAfterClose = true } = $$props;
  onDestroy(() => {
  });
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.static === void 0 && $$bindings.static && staticModal !== void 0)
    $$bindings.static(staticModal);
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.autoFocus === void 0 && $$bindings.autoFocus && autoFocus !== void 0)
    $$bindings.autoFocus(autoFocus);
  if ($$props.body === void 0 && $$bindings.body && body !== void 0)
    $$bindings.body(body);
  if ($$props.centered === void 0 && $$bindings.centered && centered !== void 0)
    $$bindings.centered(centered);
  if ($$props.container === void 0 && $$bindings.container && container !== void 0)
    $$bindings.container(container);
  if ($$props.fullscreen === void 0 && $$bindings.fullscreen && fullscreen !== void 0)
    $$bindings.fullscreen(fullscreen);
  if ($$props.header === void 0 && $$bindings.header && header !== void 0)
    $$bindings.header(header);
  if ($$props.scrollable === void 0 && $$bindings.scrollable && scrollable !== void 0)
    $$bindings.scrollable(scrollable);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0)
    $$bindings.toggle(toggle);
  if ($$props.labelledBy === void 0 && $$bindings.labelledBy && labelledBy !== void 0)
    $$bindings.labelledBy(labelledBy);
  if ($$props.backdrop === void 0 && $$bindings.backdrop && backdrop !== void 0)
    $$bindings.backdrop(backdrop);
  if ($$props.wrapClassName === void 0 && $$bindings.wrapClassName && wrapClassName !== void 0)
    $$bindings.wrapClassName(wrapClassName);
  if ($$props.modalClassName === void 0 && $$bindings.modalClassName && modalClassName !== void 0)
    $$bindings.modalClassName(modalClassName);
  if ($$props.contentClassName === void 0 && $$bindings.contentClassName && contentClassName !== void 0)
    $$bindings.contentClassName(contentClassName);
  if ($$props.fade === void 0 && $$bindings.fade && fade !== void 0)
    $$bindings.fade(fade);
  if ($$props.unmountOnClose === void 0 && $$bindings.unmountOnClose && unmountOnClose !== void 0)
    $$bindings.unmountOnClose(unmountOnClose);
  if ($$props.returnFocusAfterClose === void 0 && $$bindings.returnFocusAfterClose && returnFocusAfterClose !== void 0)
    $$bindings.returnFocusAfterClose(returnFocusAfterClose);
  $$result.css.add(css$c);
  classnames(dialogBaseClass, className, {
    [`modal-${size}`]: size,
    "modal-fullscreen": fullscreen === true,
    [`modal-fullscreen-${fullscreen}-down`]: fullscreen && typeof fullscreen === "string",
    [`${dialogBaseClass}-centered`]: centered,
    [`${dialogBaseClass}-scrollable`]: scrollable
  });
  outer = container === "inline" || staticModal ? InlineContainer : Portal;
  return `${``}
${backdrop && !staticModal ? `${validate_component(outer || missing_component, "svelte:component").$$render($$result, {}, {}, {
    default: () => `${validate_component(ModalBackdrop, "ModalBackdrop").$$render($$result, { fade, isOpen }, {}, {})}`
  })}` : ``}`;
});
const ModalFooter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  classes = classnames(className, "modal-footer");
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</div>`;
});
function getVerticalClass(vertical) {
  if (vertical === false) {
    return false;
  } else if (vertical === true || vertical === "xs") {
    return "flex-column";
  }
  return `flex-${vertical}-column`;
}
const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, [
    "class",
    "tabs",
    "pills",
    "vertical",
    "horizontal",
    "justified",
    "fill",
    "navbar",
    "card"
  ]);
  let { class: className = "" } = $$props;
  let { tabs = false } = $$props;
  let { pills = false } = $$props;
  let { vertical = false } = $$props;
  let { horizontal = "" } = $$props;
  let { justified = false } = $$props;
  let { fill = false } = $$props;
  let { navbar = false } = $$props;
  let { card = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.tabs === void 0 && $$bindings.tabs && tabs !== void 0)
    $$bindings.tabs(tabs);
  if ($$props.pills === void 0 && $$bindings.pills && pills !== void 0)
    $$bindings.pills(pills);
  if ($$props.vertical === void 0 && $$bindings.vertical && vertical !== void 0)
    $$bindings.vertical(vertical);
  if ($$props.horizontal === void 0 && $$bindings.horizontal && horizontal !== void 0)
    $$bindings.horizontal(horizontal);
  if ($$props.justified === void 0 && $$bindings.justified && justified !== void 0)
    $$bindings.justified(justified);
  if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0)
    $$bindings.fill(fill);
  if ($$props.navbar === void 0 && $$bindings.navbar && navbar !== void 0)
    $$bindings.navbar(navbar);
  if ($$props.card === void 0 && $$bindings.card && card !== void 0)
    $$bindings.card(card);
  classes = classnames(className, navbar ? "navbar-nav" : "nav", horizontal ? `justify-content-${horizontal}` : false, getVerticalClass(vertical), {
    "nav-tabs": tabs,
    "card-header-tabs": card && tabs,
    "nav-pills": pills,
    "card-header-pills": card && pills,
    "nav-justified": justified,
    "nav-fill": fill
  });
  return `<ul${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</ul>`;
});
function getExpandClass(expand2) {
  if (expand2 === false) {
    return false;
  } else if (expand2 === true || expand2 === "xs") {
    return "navbar-expand";
  }
  return `navbar-expand-${expand2}`;
}
const Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "container", "color", "dark", "expand", "fixed", "light", "sticky"]);
  let { class: className = "" } = $$props;
  let { container = "fluid" } = $$props;
  let { color = "" } = $$props;
  let { dark = false } = $$props;
  let { expand: expand2 = "" } = $$props;
  let { fixed = "" } = $$props;
  let { light = false } = $$props;
  let { sticky = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.container === void 0 && $$bindings.container && container !== void 0)
    $$bindings.container(container);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.dark === void 0 && $$bindings.dark && dark !== void 0)
    $$bindings.dark(dark);
  if ($$props.expand === void 0 && $$bindings.expand && expand2 !== void 0)
    $$bindings.expand(expand2);
  if ($$props.fixed === void 0 && $$bindings.fixed && fixed !== void 0)
    $$bindings.fixed(fixed);
  if ($$props.light === void 0 && $$bindings.light && light !== void 0)
    $$bindings.light(light);
  if ($$props.sticky === void 0 && $$bindings.sticky && sticky !== void 0)
    $$bindings.sticky(sticky);
  classes = classnames(className, "navbar", getExpandClass(expand2), {
    "navbar-light": light,
    "navbar-dark": dark,
    [`bg-${color}`]: color,
    [`fixed-${fixed}`]: fixed,
    [`sticky-${sticky}`]: sticky
  });
  return `<nav${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${container ? `${validate_component(Container, "Container").$$render($$result, { fluid: container === "fluid" }, {}, {
    default: () => `${slots.default ? slots.default({}) : ``}`
  })}` : `${slots.default ? slots.default({}) : ``}`}</nav>`;
});
const NavItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "active"]);
  let { class: className = "" } = $$props;
  let { active = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  classes = classnames(className, "nav-item", active ? "active" : false);
  return `<li${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</li>`;
});
const NavLink = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "disabled", "active", "href"]);
  let { class: className = "" } = $$props;
  let { disabled = false } = $$props;
  let { active = false } = $$props;
  let { href = "#" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  classes = classnames(className, "nav-link", { disabled, active });
  return `<a${spread([
    escape_object($$restProps),
    { href: escape_attribute_value(href) },
    { class: escape_attribute_value(classes) }
  ])}>${slots.default ? slots.default({}) : ``}</a>`;
});
const NavbarBrand = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "href"]);
  let { class: className = "" } = $$props;
  let { href = "/" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  classes = classnames(className, "navbar-brand");
  return `<a${spread([
    escape_object($$restProps),
    { class: escape_attribute_value(classes) },
    { href: escape_attribute_value(href) }
  ])}>${slots.default ? slots.default({}) : ``}</a>`;
});
const NavbarToggler = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  classes = classnames(className, "navbar-toggler");
  return `${validate_component(Button, "Button").$$render($$result, Object.assign($$restProps, { class: classes }), {}, {
    default: () => `${slots.default ? slots.default({}) : `
    <span class="${"navbar-toggler-icon"}"></span>
  `}`
  })}`;
});
var Offcanvas_svelte_svelte_type_style_lang = ".overflow-noscroll{overflow:hidden;padding-right:0px}";
function getCols(cols) {
  const colsValue = parseInt(cols);
  if (!isNaN(colsValue)) {
    if (colsValue > 0) {
      return [`row-cols-${colsValue}`];
    }
  } else if (typeof cols === "object") {
    return ["xs", "sm", "md", "lg", "xl"].map((colWidth) => {
      const isXs = colWidth === "xs";
      const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
      const value = cols[colWidth];
      if (typeof value === "number" && value > 0) {
        return `row-cols${colSizeInterfix}${value}`;
      }
      return null;
    }).filter((value) => !!value);
  }
  return [];
}
const Row = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "noGutters", "form", "cols"]);
  let { class: className = "" } = $$props;
  let { noGutters = false } = $$props;
  let { form = false } = $$props;
  let { cols = 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.noGutters === void 0 && $$bindings.noGutters && noGutters !== void 0)
    $$bindings.noGutters(noGutters);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.cols === void 0 && $$bindings.cols && cols !== void 0)
    $$bindings.cols(cols);
  classes = classnames(className, noGutters ? "gx-0" : null, form ? "form-row" : "row", ...getCols(cols));
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</div>`;
});
var Nav_svelte_svelte_type_style_lang = ".titre.svelte-azukai{font-family:'omotenashi_2regular';font-size:1.5rem}.item.svelte-azukai{font-family:'Roboto-Regular';font-size:1.1rem;font-weight:bold}";
const css$b = {
  code: ".titre.svelte-azukai{font-family:'omotenashi_2regular';font-size:1.5rem}.item.svelte-azukai{font-family:'Roboto-Regular';font-size:1.1rem;font-weight:bold}",
  map: `{"version":3,"file":"Nav.svelte","sources":["Nav.svelte"],"sourcesContent":["<script context='module'>\\n  export const prerender = true;\\n<\/script>\\n<script>\\n    //import { push } from 'svelte-spa-router';\\n    import { goto } from '$app/navigation';\\n    \\n    import {\\n        Collapse,\\n        Navbar,\\n        NavbarToggler,\\n        NavbarBrand,\\n        Nav,\\n        NavItem,\\n        NavLink,\\n        Dropdown,\\n        DropdownToggle,\\n        DropdownMenu,\\n        DropdownItem,\\n    } from 'sveltestrap';\\n  \\n    const expand = 'xl';\\n    let isOpen = false;\\n\\n    const navigateHandler = (url) => {\\n        isOpen = false;\\n        //push(url);\\n        goto(url);\\n    }\\n\\n<\/script>\\n  \\n<Navbar \\n    color=\\"white\\"\\n    light\\n    expand={expand}\\n    class='mb-3 fixed-top'\\n>\\n    <NavbarBrand on:click={() => navigateHandler('/')}>\\n      <img class='img-fluid mx-3' style=\\"max-width: 130px;\\" src='/images/logo-projection-transition.png' alt='logo'/>\\n    </NavbarBrand>\\n    <NavbarToggler on:click={() => (isOpen = !isOpen)} />\\n    <Collapse {isOpen} navbar expand={expand}>\\n        <Nav class=\\"ms-auto align-items-center\\" navbar>\\n            <Dropdown nav inNavbar>\\n                <DropdownToggle class='text-dark mx-2' nav caret><span class='titre'>LE FESTIVAL</span></DropdownToggle>\\n                <DropdownMenu end class='bg-white'>\\n                  <!-- <DropdownItem class='bg-white'><NavItem><span class='item'><a href=\\"/edito\\">Edito</a> </span></NavItem></DropdownItem> -->\\n                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/edito')}><span class='item'>Edito</span></NavLink></NavItem></DropdownItem>\\n                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/partenaires')}><span class='item'>Partenaires</span></NavLink></NavItem></DropdownItem>\\n                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/equipe')}><span class='item'>L'\xE9quipe</span></NavLink></NavItem></DropdownItem>\\n                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/publications')}><span class='item'>Publications</span></NavLink></NavItem></DropdownItem>\\n                </DropdownMenu>\\n            </Dropdown>       \\n            <Dropdown nav inNavbar>\\n                <DropdownToggle class='text-dark mx-2' nav caret><span class='titre'>LA PROGRAMMATION 2021</span></DropdownToggle>\\n                <DropdownMenu end class='bg-white'>\\n                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/programmation/paris')} ><span class='item'>Paris</span></NavLink></NavItem></DropdownItem>\\n                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/programmation/nantes')} ><span class='item'>Nantes</span></NavLink></NavItem></DropdownItem>\\n                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/programmation/toulouse')} ><span class='item'>Toulouse</span></NavLink></NavItem></DropdownItem>\\n                </DropdownMenu>\\n            </Dropdown>\\n            <!-- <Dropdown nav inNavbar>\\n                <DropdownToggle class='text-dark mx-2' nav caret><span class='titre'>PROJET PEDAGOGIQUE</span></DropdownToggle>\\n                <DropdownMenu end class='bg-white'>\\n                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/presentation')}><span class='item'>Pr\xE9sentation</span></NavLink></NavItem></DropdownItem>\\n                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/projesseurs')}><span class='item'>Mots des professeurs</span></NavLink></NavItem></DropdownItem>\\n                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/eleves')}><span class='item'>El\xE8ves</span></NavLink></NavItem></DropdownItem>\\n                </DropdownMenu>\\n            </Dropdown> -->\\n            <Dropdown nav inNavbar>\\n                <NavItem><NavLink class='text-dark mx-2' on:click={() => navigateHandler('/informationsPratiques')}><span class='titre'>INFORMATIONS PRATIQUES</span></NavLink></NavItem>\\n            </Dropdown>\\n            <Dropdown nav inNavbar>\\n                <DropdownToggle class='text-dark ms-2 me-5' nav caret><span class='titre'>BILLETTERIE</span></DropdownToggle>\\n                <DropdownMenu end class='bg-white'>\\n                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/billetterie/paris')}><span class='item'>Paris</span></NavLink></NavItem></DropdownItem>\\n                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/billetterie/nantes')}><span class='item'>Nantes</span></NavLink></NavItem></DropdownItem>\\n                  <DropdownItem class='bg-white'><NavItem><NavLink on:click={() => navigateHandler('/billetterie/toulouse')}><span class='item'>Toulouse</span></NavLink></NavItem></DropdownItem>\\n                </DropdownMenu>\\n            </Dropdown>\\n      </Nav>\\n    </Collapse>\\n</Navbar>\\n\\n<style>\\n  .titre {\\n    font-family: 'omotenashi_2regular';\\n    font-size: 1.5rem;\\n  }\\n  .item {\\n    font-family: 'Roboto-Regular';\\n    font-size:1.1rem;\\n    font-weight: bold;\\n  }\\n</style>"],"names":[],"mappings":"AAsFE,MAAM,cAAC,CAAC,AACN,WAAW,CAAE,qBAAqB,CAClC,SAAS,CAAE,MAAM,AACnB,CAAC,AACD,KAAK,cAAC,CAAC,AACL,WAAW,CAAE,gBAAgB,CAC7B,UAAU,MAAM,CAChB,WAAW,CAAE,IAAI,AACnB,CAAC"}`
};
const expand = "xl";
const Nav_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isOpen = false;
  $$result.css.add(css$b);
  return `${validate_component(Navbar, "Navbar").$$render($$result, {
    color: "white",
    light: true,
    expand,
    class: "mb-3 fixed-top"
  }, {}, {
    default: () => `${validate_component(NavbarBrand, "NavbarBrand").$$render($$result, {}, {}, {
      default: () => `<img class="${"img-fluid mx-3"}" style="${"max-width: 130px;"}" src="${"/images/logo-projection-transition.png"}" alt="${"logo"}">`
    })}
    ${validate_component(NavbarToggler, "NavbarToggler").$$render($$result, {}, {}, {})}
    ${validate_component(Collapse, "Collapse").$$render($$result, { isOpen, navbar: true, expand }, {}, {
      default: () => `${validate_component(Nav, "Nav").$$render($$result, {
        class: "ms-auto align-items-center",
        navbar: true
      }, {}, {
        default: () => `${validate_component(Dropdown, "Dropdown").$$render($$result, { nav: true, inNavbar: true }, {}, {
          default: () => `${validate_component(DropdownToggle, "DropdownToggle").$$render($$result, {
            class: "text-dark mx-2",
            nav: true,
            caret: true
          }, {}, {
            default: () => `<span class="${"titre svelte-azukai"}">LE FESTIVAL</span>`
          })}
                ${validate_component(DropdownMenu, "DropdownMenu").$$render($$result, { end: true, class: "bg-white" }, {}, {
            default: () => `
                  ${validate_component(DropdownItem, "DropdownItem").$$render($$result, { class: "bg-white" }, {}, {
              default: () => `${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                default: () => `${validate_component(NavLink, "NavLink").$$render($$result, {}, {}, {
                  default: () => `<span class="${"item svelte-azukai"}">Edito</span>`
                })}`
              })}`
            })}
                  ${validate_component(DropdownItem, "DropdownItem").$$render($$result, { class: "bg-white" }, {}, {
              default: () => `${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                default: () => `${validate_component(NavLink, "NavLink").$$render($$result, {}, {}, {
                  default: () => `<span class="${"item svelte-azukai"}">Partenaires</span>`
                })}`
              })}`
            })}
                  ${validate_component(DropdownItem, "DropdownItem").$$render($$result, { class: "bg-white" }, {}, {
              default: () => `${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                default: () => `${validate_component(NavLink, "NavLink").$$render($$result, {}, {}, {
                  default: () => `<span class="${"item svelte-azukai"}">L&#39;\xE9quipe</span>`
                })}`
              })}`
            })}
                  ${validate_component(DropdownItem, "DropdownItem").$$render($$result, { class: "bg-white" }, {}, {
              default: () => `${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                default: () => `${validate_component(NavLink, "NavLink").$$render($$result, {}, {}, {
                  default: () => `<span class="${"item svelte-azukai"}">Publications</span>`
                })}`
              })}`
            })}`
          })}`
        })}       
            ${validate_component(Dropdown, "Dropdown").$$render($$result, { nav: true, inNavbar: true }, {}, {
          default: () => `${validate_component(DropdownToggle, "DropdownToggle").$$render($$result, {
            class: "text-dark mx-2",
            nav: true,
            caret: true
          }, {}, {
            default: () => `<span class="${"titre svelte-azukai"}">LA PROGRAMMATION 2021</span>`
          })}
                ${validate_component(DropdownMenu, "DropdownMenu").$$render($$result, { end: true, class: "bg-white" }, {}, {
            default: () => `${validate_component(DropdownItem, "DropdownItem").$$render($$result, { class: "bg-white" }, {}, {
              default: () => `${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                default: () => `${validate_component(NavLink, "NavLink").$$render($$result, {}, {}, {
                  default: () => `<span class="${"item svelte-azukai"}">Paris</span>`
                })}`
              })}`
            })}
                  ${validate_component(DropdownItem, "DropdownItem").$$render($$result, { class: "bg-white" }, {}, {
              default: () => `${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                default: () => `${validate_component(NavLink, "NavLink").$$render($$result, {}, {}, {
                  default: () => `<span class="${"item svelte-azukai"}">Nantes</span>`
                })}`
              })}`
            })}
                  ${validate_component(DropdownItem, "DropdownItem").$$render($$result, { class: "bg-white" }, {}, {
              default: () => `${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                default: () => `${validate_component(NavLink, "NavLink").$$render($$result, {}, {}, {
                  default: () => `<span class="${"item svelte-azukai"}">Toulouse</span>`
                })}`
              })}`
            })}`
          })}`
        })}
            
            ${validate_component(Dropdown, "Dropdown").$$render($$result, { nav: true, inNavbar: true }, {}, {
          default: () => `${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
            default: () => `${validate_component(NavLink, "NavLink").$$render($$result, { class: "text-dark mx-2" }, {}, {
              default: () => `<span class="${"titre svelte-azukai"}">INFORMATIONS PRATIQUES</span>`
            })}`
          })}`
        })}
            ${validate_component(Dropdown, "Dropdown").$$render($$result, { nav: true, inNavbar: true }, {}, {
          default: () => `${validate_component(DropdownToggle, "DropdownToggle").$$render($$result, {
            class: "text-dark ms-2 me-5",
            nav: true,
            caret: true
          }, {}, {
            default: () => `<span class="${"titre svelte-azukai"}">BILLETTERIE</span>`
          })}
                ${validate_component(DropdownMenu, "DropdownMenu").$$render($$result, { end: true, class: "bg-white" }, {}, {
            default: () => `${validate_component(DropdownItem, "DropdownItem").$$render($$result, { class: "bg-white" }, {}, {
              default: () => `${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                default: () => `${validate_component(NavLink, "NavLink").$$render($$result, {}, {}, {
                  default: () => `<span class="${"item svelte-azukai"}">Paris</span>`
                })}`
              })}`
            })}
                  ${validate_component(DropdownItem, "DropdownItem").$$render($$result, { class: "bg-white" }, {}, {
              default: () => `${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                default: () => `${validate_component(NavLink, "NavLink").$$render($$result, {}, {}, {
                  default: () => `<span class="${"item svelte-azukai"}">Nantes</span>`
                })}`
              })}`
            })}
                  ${validate_component(DropdownItem, "DropdownItem").$$render($$result, { class: "bg-white" }, {}, {
              default: () => `${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                default: () => `${validate_component(NavLink, "NavLink").$$render($$result, {}, {}, {
                  default: () => `<span class="${"item svelte-azukai"}">Toulouse</span>`
                })}`
              })}`
            })}`
          })}`
        })}`
      })}`
    })}`
  })}`;
});
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"row bg-white text-dark align-items-center px-5 py-2 "}" style="${"min-height:5vh;"}"><div class="${"col-sm-12 col-md-9 text-center"}"><span class="${"mx-3 fw-bold "}" style="${"font-size:1.2rem; cursor:pointer;"}">MENTIONS LEGALES</span>
        <span class="${"fw-bold "}" style="${"font-size:1.2rem;"}">|</span>
        <span class="${"mx-3 fw-bold "}" style="${"font-size:1.2rem; cursor:pointer;"}">THE SHIFT PROJECT</span>
        <span class="${"fw-bold "}" style="${"font-size:1.2rem;"}">|</span>
        <span class="${"mx-3 fw-bold "}" style="${"font-size:1.2rem; cursor:pointer;"}">ARCHIVES 2020</span></div>
    
    <div class="${"col-sm-12 col-md-3 text-center"}"><div class="${"row my-1"}"><div class="${"col text-center"}" style="${"font-size:1.4rem"}"><span class="${"fw-bold"}" style="${"margin: 0px 15px;"}"><a class="${""}" target="${"_blank"}" href="${"https://www.facebook.com/FestivalProjectionTransition/"}"><i class="${"bi bi-facebook text-dark"}"></i></a></span>
                <span class="${"fw-bold"}" style="${"margin: 0px 15px;"}"><a class="${""}" target="${"_blank"}" href="${"https://www.instagram.com/projectiontransition/"}"><i class="${"bi bi-instagram text-dark"}"></i></a></span>
                <span class="${"fw-bold"}" style="${"margin: 0px 15px;"}"><a class="${""}" target="${"_blank"}" href="${"mailto:contact@projectiontransition.fr"}"><i class="${"bi bi-envelope-fill text-dark"}"></i></a></span></div></div></div></div>`;
});
const prerender$3 = true;
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<link rel="${"stylesheet"}" href="${"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"}" data-svelte="svelte-y9luo2"><link rel="${"stylesheet"}" href="${"/global.css"}" data-svelte="svelte-y9luo2"><link rel="${"stylesheet"}" href="${"/mains.min.css"}" data-svelte="svelte-y9luo2">`, ""}

${validate_component(Nav_1, "Nav").$$render($$result, {}, {}, {})}
<main>${slots.default ? slots.default({}) : ``}</main>
<footer>${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</footer>`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout,
  prerender: prerender$3
});
function load$3({ error: error2, status }) {
  return { props: { error: error2, status } };
}
const Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error2 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  return `<h1>${escape$4(status)}</h1>

<pre>${escape$4(error2.message)}</pre>



${error2.frame ? `<pre>${escape$4(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape$4(error2.stack)}</pre>` : ``}`;
});
var error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load: load$3
});
const userInfo = writable("");
const pageRequest = writable({ content: { content: [], name: "" }, loading: false, message: "" });
const articleRequest = writable({ article: null, loading: false, message: "" });
const articleUpdateRequest = writable({ success: false, loading: false, message: "" });
const articleAllRequest = writable({ articles: null, loading: false, message: "" });
const articleCreateRequest = writable({ success: false, loading: false, message: "" });
const articleDeleteRequest = writable({ success: false, loading: false, message: "" });
const filmRequest = writable({ film: null, loading: false, message: "" });
const filmUpdateRequest = writable({ success: false, loading: false, message: "" });
const emailSendRequest = writable({ success: false, loading: false, message: "" });
const SVELTE_ENV = "dev";
const API_URL_DEV = "http://localhost:5000";
const API_URL_PREPROD = "https://dev.projtranapi.jprdev.ovh";
const API_URL_PROD = "https://dev.projtranapi.jprdev.ovh";
const SITE_URL_DEV = "https://localhost:3000";
const SITE_URL_PREPROD = "https://dev.projtran.jprdev.ovh";
const SITE_URL_PROD = "https://dev.projtran.jprdev.ovh";
var config = {
  SVELTE_ENV,
  API_URL_DEV,
  API_URL_PREPROD,
  API_URL_PROD,
  SITE_URL_DEV,
  SITE_URL_PREPROD,
  SITE_URL_PROD
};
const API_URL$2 = config.API_URL_DEV;
const getAllArticles = async (category, size, page2, keyword) => {
  articleAllRequest.set({ articles: null, loading: true, message: "" });
  try {
    const config2 = {
      headers: {
        "Content-type": "Application/json"
      }
    };
    const { data } = await axios.get(`${API_URL$2}/api/article?category=${category}&keyword=${keyword}&page=${page2}&size=${size}`, config2);
    articleAllRequest.set({ articles: data.value, loading: false, message: "" });
    return { articles: data.value, loading: false, message: "" };
  } catch (error2) {
    articleRequest.set({ articles: null, loading: false, message: "Error loading articles " + category + " " + error2 });
    return { articles: null, loading: false, message: "Error loading articles " + category + " " + error2 };
  }
};
const getArticle = async (id) => {
  articleRequest.set({ article: null, loading: true, message: "" });
  try {
    const config2 = {
      headers: {
        "Content-type": "Application/json"
      }
    };
    const { data } = await axios.get(`${API_URL$2}/api/article/${id}`, config2);
    articleRequest.set({ article: data.value, loading: false, message: "" });
    return { article: data.value, loading: false, message: "" };
  } catch (error2) {
    articleRequest.set({ article: null, loading: false, message: "Error loading the article" + error2 });
    return { article: null, loading: false, message: "Error loading the article" + error2 };
  }
};
const updateArticleRequest = async (id, article) => {
  articleUpdateRequest.set({ success: false, loading: true, message: "" });
  const userInfoStored = get_store_value(userInfo);
  try {
    const config2 = {
      headers: {
        "Content-type": "Application/json",
        Authorization: `Bearer ${userInfoStored.token}`
      }
    };
    const { data } = await axios.put(`${API_URL$2}/api/article/${id}`, article, config2);
    articleUpdateRequest.set({ success: true, loading: false, message: "Article updated" });
  } catch (error2) {
    articleUpdateRequest.set({ success: false, loading: false, message: "Error updating article " + error2 });
  }
};
const AdminButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { admin = false } = $$props;
  let { isAuthenticate = false } = $$props;
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.isAuthenticate === void 0 && $$bindings.isAuthenticate && isAuthenticate !== void 0)
    $$bindings.isAuthenticate(isAuthenticate);
  return `${isAuthenticate ? `<div class="${"alert alert-warning text-center py-2"}"><div class="${"row align-items-center"}"><div class="${"col my-auto"}"${add_attribute("sm", 4, 0)}${add_attribute("md", 10, 0)}>You are in admin mode. Be careful!</div>
            <div class="${"col text-end"}"${add_attribute("sm", 4, 0)}${add_attribute("md", 1, 0)}><button class="${"btn btn-light"}" block><i${add_attribute("class", admin ? "bi bi-arrow-counterclockwise" : "bi bi-box-arrow-up-left", 0)}></i>
                ${escape$4(admin ? "Sauvegarder" : "Editer")}</button></div>
            <div class="${"col text-start"}"${add_attribute("sm", 4, 0)}${add_attribute("md", 1, 0)}><button class="${"btn btn-light"}" block><i class="${"bi bi-door-open"}"></i>Logout</button></div></div></div>` : ``}`;
});
const EditButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { updateContent } = $$props;
  let { admin = false } = $$props;
  let { edit: edit2 = false } = $$props;
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.edit === void 0 && $$bindings.edit && edit2 !== void 0)
    $$bindings.edit(edit2);
  return `${admin ? `${validate_component(Row, "Row").$$render($$result, { class: "text-end m-3" }, {}, {
    default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
      default: () => `${validate_component(Button, "Button").$$render($$result, { color: "ambre" }, {}, {
        default: () => `${validate_component(Icon, "Icon").$$render($$result, {
          name: edit2 ? "arrow-counterclockwise" : "box-arrow-up-left"
        }, {}, {})}
                ${escape$4(edit2 ? "Save" : "Edit")}`
      })}`
    })}`
  })}` : ``}`;
});
var ImageComponent_svelte_svelte_type_style_lang = ".content-container.svelte-2sm8o1.svelte-2sm8o1{position:relative}.middle.svelte-2sm8o1.svelte-2sm8o1{transition:.5s ease;opacity:0.7;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);text-align:center}.content-container.svelte-2sm8o1:hover .middle.svelte-2sm8o1{opacity:1}";
const css$a = {
  code: ".content-container.svelte-2sm8o1.svelte-2sm8o1{position:relative}.middle.svelte-2sm8o1.svelte-2sm8o1{transition:.5s ease;opacity:0.7;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);text-align:center}.content-container.svelte-2sm8o1:hover .middle.svelte-2sm8o1{opacity:1}",
  map: "{\"version\":3,\"file\":\"ImageComponent.svelte\",\"sources\":[\"ImageComponent.svelte\"],\"sourcesContent\":[\"<script>\\n\\n    import { Button, Col, Icon, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from \\\"sveltestrap\\\";\\n    import { uploadImage } from \\\"../actions/imagesActions\\\";\\n    import EditButton from \\\"./EditButton.svelte\\\";\\n    import config from '../config.json';\\n\\n    const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;\\n\\n\\n    export let values=[];\\n    export let styles=[];\\n    export let admin='false';\\n    export let edit='false';\\n    export let updateContent;\\n\\n    styles;\\n    //$: console.log('edit', edit);\\n\\n    const toggle = async () => {\\n        if (edit && updateContent) {\\n            await updateContent();\\n        }\\n        edit = !edit;\\n    };\\n\\n\\n    const onChangeHandler = async(index, e) => {\\n        const data = new FormData();\\n\\n        data.append('file', e.target.files[0]);\\n\\n        const imageToReplace = values[index].url;\\n        \\n        const result = await uploadImage(data, imageToReplace);\\n\\n        if (result.status === 'Ok') {\\n            values[index].url = result.data;\\n            values = values;\\n        } else {\\n            console.log('error', result.data);\\n        }\\n    };\\n\\n    // Build the first component\\n    $:{\\n        if (values.length === 0) {\\n            values.push({caption: '',substitution: '',url: ''});\\n        }\\n    }\\n    \\n    // styles section\\n    $: shadow = styles.filter(x => x.name === 'shadow')[0] && styles.filter(x => x.name === 'shadow')[0].value;\\n    $: rounded = styles.filter(x => x.name === 'rounded')[0] && styles.filter(x => x.name === 'rounded')[0].value;\\n    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;\\n    \\n    $: transformR = styles.filter(x => x.name === 'transformR')[0] ? styles.filter(x => x.name === 'transformR')[0].value : 0;\\n    $: transformX = styles.filter(x => x.name === 'transformX')[0] ? styles.filter(x => x.name === 'transformX')[0].value : 0;\\n    $: transformY = styles.filter(x => x.name === 'transformY')[0] ? styles.filter(x => x.name === 'transformY')[0].value : 0;\\n    $: scaleXY = styles.filter(x => x.name === 'scaleXY')[0] ? styles.filter(x => x.name === 'scaleXY')[0].value : 1;\\n\\n\\n    const updateStyle = ({name, value}) => {\\n        //console.log('updatesstyle', {name, value});\\n        const curentStyleItem = styles.filter(x => x.name === name);\\n        if (curentStyleItem.length) {\\n            for (let index = 0; index < styles.length; index++) {\\n                if (styles[index].name === name) {\\n                    styles[index].value = value;\\n                }\\n            }\\n            styles = styles;\\n        } else {\\n            styles = [...styles, {name, value}];\\n        }\\n    };\\n\\n<\/script>\\n\\n<style>\\n    .content-container{\\n        position: relative;\\n    }\\n    .middle {\\n        transition: .5s ease;\\n        opacity: 0.7;\\n        position: absolute;\\n        top: 50%;\\n        left: 50%;\\n        transform: translate(-50%, -50%);\\n        -ms-transform: translate(-50%, -50%);\\n        text-align: center;\\n    }\\n    .content-container:hover .middle {\\n        opacity: 1;\\n    }\\n</style>\\n\\n<Modal isOpen={edit} {toggle}>\\n    <ModalHeader {toggle}>Editer l'image</ModalHeader>\\n    <ModalBody>\\n    <Row>\\n        <Col class={`col`}>\\n            <Input type='file' name='image-url' on:change={(e) => onChangeHandler (0, e)} />\\n            <Input type='text' name='text' class='my-3' bind:value={values[0].caption} placeholder='Caption'/>\\n            <Input type='text' name='text' class='my-3' bind:value={values[0].substitution} placeholder='Substitution text'/>\\n            <div class='row py-1'><div class='col'>\\n                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'text-align', value:'text-start'})}><Icon name='text-left' /></button>\\n                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'text-align', value:'text-center'})}><Icon name='text-center' /></button>\\n                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'text-align', value:'text-end'})}><Icon name='text-right' /></button>\\n            </div></div>\\n            <div class='row py-1'>\\n                <div class='col'>\\n                    <Button class='px-1' on:click={() => updateStyle({name:'shadow', value:'shadow'})}><Icon name='back' /></Button>\\n                    <Button class='px-1' on:click={() => updateStyle({name:'shadow', value:''})}>No shadow</Button>\\n                </div>\\n            </div>\\n            <div class='row py-1'>\\n                <div class='col'>\\n                    <Button class='px-1 rounded-3' on:click={() => updateStyle({name:'rounded', value:'rounded-3'})}><Icon name='app' /></Button>\\n                    <Button class='px-1 rounded-circle' on:click={() => updateStyle({name:'rounded', value:'rounded-circle'})}>Circle</Button>\\n                    <Button class='px-1' on:click={() => updateStyle({name:'rounded', value:''})}>No rounded</Button>\\n                </div>\\n            </div>\\n            <div class='row py-1 align-items-center'>\\n                <div class='col-4'>Rotate : </div>\\n                <div class='col-8'>\\n                    <Input type='number' class='px-1' value={transformR} on:change={(e) => updateStyle({name:'transformR', value: e.target.value})} />\\n                </div>\\n            </div>\\n            <div class='row py-1 align-items-center'>\\n                <div class='col-4'>Translate X : </div>\\n                <div class='col-8'>\\n                    <Input type='number' class='px-1' value={transformX} on:change={(e) => updateStyle({name:'transformX', value:e.target.value})} />\\n                </div>\\n            </div>\\n            <div class='row py-1 align-items-center'>\\n                <div class='col-4'>Translate Y : </div>\\n                <div class='col-8'>\\n                    <Input type='number' class='px-1' value={transformY} on:change={(e) => updateStyle({name:'transformY', value:e.target.value})} />\\n                </div>\\n            </div>\\n            <div class='row py-1 align-items-center'>\\n                <div class='col-4'>Scale XY : </div>\\n                <div class='col-8'>\\n                    <Input type='number' class='px-1' value={scaleXY} on:change={(e) => updateStyle({name:'scaleXY', value:e.target.value})} step={0.05} />\\n                </div>\\n            </div>\\n            <p class='my-3'><strong>Pr\xE9visualisation</strong></p>\\n            <div class={`col ${textAlign}`}>\\n                <figure class='figure m-0 p-0' style={`transform: rotate(${transformR}deg) translateX(${transformX}vh) translateY(${transformY}vh) scale(${scaleXY, scaleXY});`}>\\n                    <img class={`figure-img img-fluid m-0 p-0 ${rounded} ${shadow}`} src={`${API_URL}${values[0].url}`} alt={values[0].substitution}>\\n                    <figcaption class='figure-caption'>{values[0].caption}</figcaption>\\n                </figure>\\n            </div>\\n            \\n        </Col>\\n    </Row>\\n    </ModalBody>\\n    <ModalFooter>\\n        <Button color=\\\"primary\\\" on:click={toggle}>Enregistrer</Button>\\n        <Button color=\\\"secondary\\\" on:click={toggle}>Cancel</Button>\\n    </ModalFooter>\\n</Modal>\\n\\n<div class='content-container'>\\n    <div class='row'>\\n        <div class={`col ${textAlign}`}>   \\n            {#if !values[0].url}\\n                <div class='bg-secondary text-center text-dark rounded-3' style='min-height:100px;'>Ajouter l'image</div>\\n            {/if}\\n            <figure class='figure m-0 p-0' style={`transform: rotate(${transformR}deg) translateX(${transformX}vh) translateY(${transformY}vh) scale(${scaleXY, scaleXY});`}>\\n                <img class={`figure-img img-fluid m-0 p-0 ${rounded} ${shadow}`} src={`${API_URL}${values[0].url}`} alt={values[0].substitution}>\\n                <figcaption class='figure-caption'>{values[0].caption}</figcaption>\\n            </figure>\\n        </div>\\n    </div>\\n\\n    {#if admin}\\n        <div class='middle'>\\n            <EditButton\\n                admin={admin}\\n                updateContent={updateContent}\\n                bind:edit={edit}\\n            />\\n        </div>\\n    {/if}\\n</div>\"],\"names\":[],\"mappings\":\"AAgFI,8CAAkB,CAAC,AACf,QAAQ,CAAE,QAAQ,AACtB,CAAC,AACD,OAAO,4BAAC,CAAC,AACL,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,OAAO,CAAE,GAAG,CACZ,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,GAAG,CACR,IAAI,CAAE,GAAG,CACT,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAChC,aAAa,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CACpC,UAAU,CAAE,MAAM,AACtB,CAAC,AACD,gCAAkB,MAAM,CAAC,OAAO,cAAC,CAAC,AAC9B,OAAO,CAAE,CAAC,AACd,CAAC\"}"
};
const ImageComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let shadow;
  let rounded;
  let textAlign;
  let transformR;
  let transformX;
  let transformY;
  let scaleXY;
  const API_URL2 = config.API_URL_DEV;
  let { values = [] } = $$props;
  let { styles = [] } = $$props;
  let { admin = "false" } = $$props;
  let { edit: edit2 = "false" } = $$props;
  let { updateContent } = $$props;
  const toggle = async () => {
    if (edit2 && updateContent) {
      await updateContent();
    }
    edit2 = !edit2;
  };
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.styles === void 0 && $$bindings.styles && styles !== void 0)
    $$bindings.styles(styles);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.edit === void 0 && $$bindings.edit && edit2 !== void 0)
    $$bindings.edit(edit2);
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  $$result.css.add(css$a);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        if (values.length === 0) {
          values.push({ caption: "", substitution: "", url: "" });
        }
      }
    }
    shadow = styles.filter((x) => x.name === "shadow")[0] && styles.filter((x) => x.name === "shadow")[0].value;
    rounded = styles.filter((x) => x.name === "rounded")[0] && styles.filter((x) => x.name === "rounded")[0].value;
    textAlign = styles.filter((x) => x.name === "text-align")[0] && styles.filter((x) => x.name === "text-align")[0].value;
    transformR = styles.filter((x) => x.name === "transformR")[0] ? styles.filter((x) => x.name === "transformR")[0].value : 0;
    transformX = styles.filter((x) => x.name === "transformX")[0] ? styles.filter((x) => x.name === "transformX")[0].value : 0;
    transformY = styles.filter((x) => x.name === "transformY")[0] ? styles.filter((x) => x.name === "transformY")[0].value : 0;
    scaleXY = styles.filter((x) => x.name === "scaleXY")[0] ? styles.filter((x) => x.name === "scaleXY")[0].value : 1;
    $$rendered = `${validate_component(Modal, "Modal").$$render($$result, { isOpen: edit2, toggle }, {}, {
      default: () => `${validate_component(ModalHeader, "ModalHeader").$$render($$result, { toggle }, {}, { default: () => `Editer l&#39;image` })}
    ${validate_component(ModalBody, "ModalBody").$$render($$result, {}, {}, {
        default: () => `${validate_component(Row, "Row").$$render($$result, {}, {}, {
          default: () => `${validate_component(Col, "Col").$$render($$result, { class: `col` }, {}, {
            default: () => `${validate_component(Input, "Input").$$render($$result, { type: "file", name: "image-url" }, {}, {})}
            ${validate_component(Input, "Input").$$render($$result, {
              type: "text",
              name: "text",
              class: "my-3",
              placeholder: "Caption",
              value: values[0].caption
            }, {
              value: ($$value) => {
                values[0].caption = $$value;
                $$settled = false;
              }
            }, {})}
            ${validate_component(Input, "Input").$$render($$result, {
              type: "text",
              name: "text",
              class: "my-3",
              placeholder: "Substitution text",
              value: values[0].substitution
            }, {
              value: ($$value) => {
                values[0].substitution = $$value;
                $$settled = false;
              }
            }, {})}
            <div class="${"row py-1"}"><div class="${"col"}"><button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, { name: "text-left" }, {}, {})}</button>
                <button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, { name: "text-center" }, {}, {})}</button>
                <button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, { name: "text-right" }, {}, {})}</button></div></div>
            <div class="${"row py-1"}"><div class="${"col"}">${validate_component(Button, "Button").$$render($$result, { class: "px-1" }, {}, {
              default: () => `${validate_component(Icon, "Icon").$$render($$result, { name: "back" }, {}, {})}`
            })}
                    ${validate_component(Button, "Button").$$render($$result, { class: "px-1" }, {}, { default: () => `No shadow` })}</div></div>
            <div class="${"row py-1"}"><div class="${"col"}">${validate_component(Button, "Button").$$render($$result, { class: "px-1 rounded-3" }, {}, {
              default: () => `${validate_component(Icon, "Icon").$$render($$result, { name: "app" }, {}, {})}`
            })}
                    ${validate_component(Button, "Button").$$render($$result, { class: "px-1 rounded-circle" }, {}, { default: () => `Circle` })}
                    ${validate_component(Button, "Button").$$render($$result, { class: "px-1" }, {}, { default: () => `No rounded` })}</div></div>
            <div class="${"row py-1 align-items-center"}"><div class="${"col-4"}">Rotate : </div>
                <div class="${"col-8"}">${validate_component(Input, "Input").$$render($$result, {
              type: "number",
              class: "px-1",
              value: transformR
            }, {}, {})}</div></div>
            <div class="${"row py-1 align-items-center"}"><div class="${"col-4"}">Translate X : </div>
                <div class="${"col-8"}">${validate_component(Input, "Input").$$render($$result, {
              type: "number",
              class: "px-1",
              value: transformX
            }, {}, {})}</div></div>
            <div class="${"row py-1 align-items-center"}"><div class="${"col-4"}">Translate Y : </div>
                <div class="${"col-8"}">${validate_component(Input, "Input").$$render($$result, {
              type: "number",
              class: "px-1",
              value: transformY
            }, {}, {})}</div></div>
            <div class="${"row py-1 align-items-center"}"><div class="${"col-4"}">Scale XY : </div>
                <div class="${"col-8"}">${validate_component(Input, "Input").$$render($$result, {
              type: "number",
              class: "px-1",
              value: scaleXY,
              step: 0.05
            }, {}, {})}</div></div>
            <p class="${"my-3"}"><strong>Pr\xE9visualisation</strong></p>
            <div class="${escape$4(null_to_empty(`col ${textAlign}`)) + " svelte-2sm8o1"}"><figure class="${"figure m-0 p-0"}"${add_attribute("style", `transform: rotate(${transformR}deg) translateX(${transformX}vh) translateY(${transformY}vh) scale(${scaleXY});`, 0)}><img class="${escape$4(null_to_empty(`figure-img img-fluid m-0 p-0 ${rounded} ${shadow}`)) + " svelte-2sm8o1"}"${add_attribute("src", `${API_URL2}${values[0].url}`, 0)}${add_attribute("alt", values[0].substitution, 0)}>
                    <figcaption class="${"figure-caption"}">${escape$4(values[0].caption)}</figcaption></figure></div>`
          })}`
        })}`
      })}
    ${validate_component(ModalFooter, "ModalFooter").$$render($$result, {}, {}, {
        default: () => `${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, { default: () => `Enregistrer` })}
        ${validate_component(Button, "Button").$$render($$result, { color: "secondary" }, {}, { default: () => `Cancel` })}`
      })}`
    })}

<div class="${"content-container svelte-2sm8o1"}"><div class="${"row"}"><div class="${escape$4(null_to_empty(`col ${textAlign}`)) + " svelte-2sm8o1"}">${!values[0].url ? `<div class="${"bg-secondary text-center text-dark rounded-3"}" style="${"min-height:100px;"}">Ajouter l&#39;image</div>` : ``}
            <figure class="${"figure m-0 p-0"}"${add_attribute("style", `transform: rotate(${transformR}deg) translateX(${transformX}vh) translateY(${transformY}vh) scale(${scaleXY});`, 0)}><img class="${escape$4(null_to_empty(`figure-img img-fluid m-0 p-0 ${rounded} ${shadow}`)) + " svelte-2sm8o1"}"${add_attribute("src", `${API_URL2}${values[0].url}`, 0)}${add_attribute("alt", values[0].substitution, 0)}>
                <figcaption class="${"figure-caption"}">${escape$4(values[0].caption)}</figcaption></figure></div></div>

    ${admin ? `<div class="${"middle svelte-2sm8o1"}">${validate_component(EditButton, "EditButton").$$render($$result, { admin, updateContent, edit: edit2 }, {
      edit: ($$value) => {
        edit2 = $$value;
        $$settled = false;
      }
    }, {})}</div>` : ``}</div>`;
  } while (!$$settled);
  return $$rendered;
});
const Parser$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["type", "tokens", "ordered", "renderers"]);
  let { type = void 0 } = $$props;
  let { tokens = void 0 } = $$props;
  let { ordered = false } = $$props;
  let { renderers } = $$props;
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.tokens === void 0 && $$bindings.tokens && tokens !== void 0)
    $$bindings.tokens(tokens);
  if ($$props.ordered === void 0 && $$bindings.ordered && ordered !== void 0)
    $$bindings.ordered(ordered);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `${!type ? `${each(tokens, (token) => `${validate_component(Parser$1, "svelte:self").$$render($$result, Object.assign(token, { renderers }), {}, {})}`)}` : `${renderers[type] ? `${type === "table" ? `${validate_component(renderers.table || missing_component, "svelte:component").$$render($$result, {}, {}, {
    default: () => `${validate_component(renderers.tablehead || missing_component, "svelte:component").$$render($$result, {}, {}, {
      default: () => `${validate_component(renderers.tablerow || missing_component, "svelte:component").$$render($$result, {}, {}, {
        default: () => `${each(tokens.header, (cells, i) => `${validate_component(renderers.tablecell || missing_component, "svelte:component").$$render($$result, {
          header: true,
          align: $$restProps.align[i] || "center"
        }, {}, {
          default: () => `${validate_component(Parser$1, "svelte:self").$$render($$result, { tokens: cells, renderers }, {}, {})}
              `
        })}`)}`
      })}`
    })}
        ${validate_component(renderers.tablebody || missing_component, "svelte:component").$$render($$result, {}, {}, {
      default: () => `${each(tokens.cells, (row) => `${validate_component(renderers.tablerow || missing_component, "svelte:component").$$render($$result, {}, {}, {
        default: () => `${each(row, (cells, i) => `${validate_component(renderers.tablecell || missing_component, "svelte:component").$$render($$result, {
          header: false,
          align: $$restProps.align[i] || "center"
        }, {}, {
          default: () => `${validate_component(Parser$1, "svelte:self").$$render($$result, { tokens: cells, renderers }, {}, {})}
                `
        })}`)}
            `
      })}`)}`
    })}`
  })}` : `${type === "list" ? `${ordered ? `${validate_component(renderers.list || missing_component, "svelte:component").$$render($$result, Object.assign({ ordered }, $$restProps), {}, {
    default: () => `${each($$restProps.items, (item) => `${validate_component(renderers.orderedlistitem || renderers.listitem || missing_component, "svelte:component").$$render($$result, Object.assign(item), {}, {
      default: () => `${validate_component(Parser$1, "svelte:self").$$render($$result, { tokens: item.tokens, renderers }, {}, {})}
            `
    })}`)}`
  })}` : `${validate_component(renderers.list || missing_component, "svelte:component").$$render($$result, Object.assign({ ordered }, $$restProps), {}, {
    default: () => `${each($$restProps.items, (item) => `${validate_component(renderers.unorderedlistitem || renderers.listitem || missing_component, "svelte:component").$$render($$result, Object.assign(item), {}, {
      default: () => `${validate_component(Parser$1, "svelte:self").$$render($$result, { tokens: item.tokens, renderers }, {}, {})}
            `
    })}`)}`
  })}`}` : `${validate_component(renderers[type] || missing_component, "svelte:component").$$render($$result, Object.assign($$restProps), {}, {
    default: () => `${tokens ? `${validate_component(Parser$1, "svelte:self").$$render($$result, { tokens, renderers }, {}, {})}` : `${escape$4($$restProps.raw)}`}`
  })}`}`}` : ``}`}`;
});
var defaults$5 = { exports: {} };
function getDefaults$1() {
  return {
    baseUrl: null,
    breaks: false,
    extensions: null,
    gfm: true,
    headerIds: true,
    headerPrefix: "",
    highlight: null,
    langPrefix: "language-",
    mangle: true,
    pedantic: false,
    renderer: null,
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartLists: false,
    smartypants: false,
    tokenizer: null,
    walkTokens: null,
    xhtml: false
  };
}
function changeDefaults$1(newDefaults) {
  defaults$5.exports.defaults = newDefaults;
}
defaults$5.exports = {
  defaults: getDefaults$1(),
  getDefaults: getDefaults$1,
  changeDefaults: changeDefaults$1
};
const escapeTest = /[&<>"']/;
const escapeReplace = /[&<>"']/g;
const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
const escapeReplacements = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
const getEscapeReplacement = (ch) => escapeReplacements[ch];
function escape$3(html, encode) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }
  return html;
}
const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
function unescape$1(html) {
  return html.replace(unescapeTest, (_, n) => {
    n = n.toLowerCase();
    if (n === "colon")
      return ":";
    if (n.charAt(0) === "#") {
      return n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
    }
    return "";
  });
}
const caret = /(^|[^\[])\^/g;
function edit$1$1(regex, opt) {
  regex = regex.source || regex;
  opt = opt || "";
  const obj = {
    replace: (name, val) => {
      val = val.source || val;
      val = val.replace(caret, "$1");
      regex = regex.replace(name, val);
      return obj;
    },
    getRegex: () => {
      return new RegExp(regex, opt);
    }
  };
  return obj;
}
const nonWordAndColonTest = /[^\w:]/g;
const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
function cleanUrl$1(sanitize, base2, href) {
  if (sanitize) {
    let prot;
    try {
      prot = decodeURIComponent(unescape$1(href)).replace(nonWordAndColonTest, "").toLowerCase();
    } catch (e) {
      return null;
    }
    if (prot.indexOf("javascript:") === 0 || prot.indexOf("vbscript:") === 0 || prot.indexOf("data:") === 0) {
      return null;
    }
  }
  if (base2 && !originIndependentUrl.test(href)) {
    href = resolveUrl(base2, href);
  }
  try {
    href = encodeURI(href).replace(/%25/g, "%");
  } catch (e) {
    return null;
  }
  return href;
}
const baseUrls = {};
const justDomain = /^[^:]+:\/*[^/]*$/;
const protocol = /^([^:]+:)[\s\S]*$/;
const domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;
function resolveUrl(base2, href) {
  if (!baseUrls[" " + base2]) {
    if (justDomain.test(base2)) {
      baseUrls[" " + base2] = base2 + "/";
    } else {
      baseUrls[" " + base2] = rtrim$1(base2, "/", true);
    }
  }
  base2 = baseUrls[" " + base2];
  const relativeBase = base2.indexOf(":") === -1;
  if (href.substring(0, 2) === "//") {
    if (relativeBase) {
      return href;
    }
    return base2.replace(protocol, "$1") + href;
  } else if (href.charAt(0) === "/") {
    if (relativeBase) {
      return href;
    }
    return base2.replace(domain, "$1") + href;
  } else {
    return base2 + href;
  }
}
const noopTest$1 = { exec: function noopTest() {
} };
function merge$2(obj) {
  let i = 1, target, key;
  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }
  return obj;
}
function splitCells$1(tableRow, count) {
  const row = tableRow.replace(/\|/g, (match, offset2, str) => {
    let escaped2 = false, curr = offset2;
    while (--curr >= 0 && str[curr] === "\\")
      escaped2 = !escaped2;
    if (escaped2) {
      return "|";
    } else {
      return " |";
    }
  }), cells = row.split(/ \|/);
  let i = 0;
  if (cells.length > count) {
    cells.splice(count);
  } else {
    while (cells.length < count)
      cells.push("");
  }
  for (; i < cells.length; i++) {
    cells[i] = cells[i].trim().replace(/\\\|/g, "|");
  }
  return cells;
}
function rtrim$1(str, c, invert) {
  const l = str.length;
  if (l === 0) {
    return "";
  }
  let suffLen = 0;
  while (suffLen < l) {
    const currChar = str.charAt(l - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }
  return str.substr(0, l - suffLen);
}
function findClosingBracket$1(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  const l = str.length;
  let level = 0, i = 0;
  for (; i < l; i++) {
    if (str[i] === "\\") {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  return -1;
}
function checkSanitizeDeprecation$1(opt) {
  if (opt && opt.sanitize && !opt.silent) {
    console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");
  }
}
function repeatString$1(pattern, count) {
  if (count < 1) {
    return "";
  }
  let result = "";
  while (count > 1) {
    if (count & 1) {
      result += pattern;
    }
    count >>= 1;
    pattern += pattern;
  }
  return result + pattern;
}
var helpers = {
  escape: escape$3,
  unescape: unescape$1,
  edit: edit$1$1,
  cleanUrl: cleanUrl$1,
  resolveUrl,
  noopTest: noopTest$1,
  merge: merge$2,
  splitCells: splitCells$1,
  rtrim: rtrim$1,
  findClosingBracket: findClosingBracket$1,
  checkSanitizeDeprecation: checkSanitizeDeprecation$1,
  repeatString: repeatString$1
};
const { defaults: defaults$4 } = defaults$5.exports;
const {
  rtrim,
  splitCells,
  escape: escape$2,
  findClosingBracket
} = helpers;
function outputLink(cap, link, raw) {
  const href = link.href;
  const title = link.title ? escape$2(link.title) : null;
  const text = cap[1].replace(/\\([\[\]])/g, "$1");
  if (cap[0].charAt(0) !== "!") {
    return {
      type: "link",
      raw,
      href,
      title,
      text
    };
  } else {
    return {
      type: "image",
      raw,
      href,
      title,
      text: escape$2(text)
    };
  }
}
function indentCodeCompensation(raw, text) {
  const matchIndentToCode = raw.match(/^(\s+)(?:```)/);
  if (matchIndentToCode === null) {
    return text;
  }
  const indentToCode = matchIndentToCode[1];
  return text.split("\n").map((node) => {
    const matchIndentInNode = node.match(/^\s+/);
    if (matchIndentInNode === null) {
      return node;
    }
    const [indentInNode] = matchIndentInNode;
    if (indentInNode.length >= indentToCode.length) {
      return node.slice(indentToCode.length);
    }
    return node;
  }).join("\n");
}
var Tokenizer_1 = class Tokenizer {
  constructor(options2) {
    this.options = options2 || defaults$4;
  }
  space(src) {
    const cap = this.rules.block.newline.exec(src);
    if (cap) {
      if (cap[0].length > 1) {
        return {
          type: "space",
          raw: cap[0]
        };
      }
      return { raw: "\n" };
    }
  }
  code(src) {
    const cap = this.rules.block.code.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ {1,4}/gm, "");
      return {
        type: "code",
        raw: cap[0],
        codeBlockStyle: "indented",
        text: !this.options.pedantic ? rtrim(text, "\n") : text
      };
    }
  }
  fences(src) {
    const cap = this.rules.block.fences.exec(src);
    if (cap) {
      const raw = cap[0];
      const text = indentCodeCompensation(raw, cap[3] || "");
      return {
        type: "code",
        raw,
        lang: cap[2] ? cap[2].trim() : cap[2],
        text
      };
    }
  }
  heading(src) {
    const cap = this.rules.block.heading.exec(src);
    if (cap) {
      let text = cap[2].trim();
      if (/#$/.test(text)) {
        const trimmed = rtrim(text, "#");
        if (this.options.pedantic) {
          text = trimmed.trim();
        } else if (!trimmed || / $/.test(trimmed)) {
          text = trimmed.trim();
        }
      }
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[1].length,
        text
      };
    }
  }
  nptable(src) {
    const cap = this.rules.block.nptable.exec(src);
    if (cap) {
      const item = {
        type: "table",
        header: splitCells(cap[1].replace(/^ *| *\| *$/g, "")),
        align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
        cells: cap[3] ? cap[3].replace(/\n$/, "").split("\n") : [],
        raw: cap[0]
      };
      if (item.header.length === item.align.length) {
        let l = item.align.length;
        let i;
        for (i = 0; i < l; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = "right";
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = "center";
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = "left";
          } else {
            item.align[i] = null;
          }
        }
        l = item.cells.length;
        for (i = 0; i < l; i++) {
          item.cells[i] = splitCells(item.cells[i], item.header.length);
        }
        return item;
      }
    }
  }
  hr(src) {
    const cap = this.rules.block.hr.exec(src);
    if (cap) {
      return {
        type: "hr",
        raw: cap[0]
      };
    }
  }
  blockquote(src) {
    const cap = this.rules.block.blockquote.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ *> ?/gm, "");
      return {
        type: "blockquote",
        raw: cap[0],
        text
      };
    }
  }
  list(src) {
    const cap = this.rules.block.list.exec(src);
    if (cap) {
      let raw = cap[0];
      const bull = cap[2];
      const isordered = bull.length > 1;
      const list = {
        type: "list",
        raw,
        ordered: isordered,
        start: isordered ? +bull.slice(0, -1) : "",
        loose: false,
        items: []
      };
      const itemMatch = cap[0].match(this.rules.block.item);
      let next = false, item, space, bcurr, bnext, addBack, loose, istask, ischecked, endMatch;
      let l = itemMatch.length;
      bcurr = this.rules.block.listItemStart.exec(itemMatch[0]);
      for (let i = 0; i < l; i++) {
        item = itemMatch[i];
        raw = item;
        if (!this.options.pedantic) {
          endMatch = item.match(new RegExp("\\n\\s*\\n {0," + (bcurr[0].length - 1) + "}\\S"));
          if (endMatch) {
            addBack = item.length - endMatch.index + itemMatch.slice(i + 1).join("\n").length;
            list.raw = list.raw.substring(0, list.raw.length - addBack);
            item = item.substring(0, endMatch.index);
            raw = item;
            l = i + 1;
          }
        }
        if (i !== l - 1) {
          bnext = this.rules.block.listItemStart.exec(itemMatch[i + 1]);
          if (!this.options.pedantic ? bnext[1].length >= bcurr[0].length || bnext[1].length > 3 : bnext[1].length > bcurr[1].length) {
            itemMatch.splice(i, 2, itemMatch[i] + (!this.options.pedantic && bnext[1].length < bcurr[0].length && !itemMatch[i].match(/\n$/) ? "" : "\n") + itemMatch[i + 1]);
            i--;
            l--;
            continue;
          } else if (!this.options.pedantic || this.options.smartLists ? bnext[2][bnext[2].length - 1] !== bull[bull.length - 1] : isordered === (bnext[2].length === 1)) {
            addBack = itemMatch.slice(i + 1).join("\n").length;
            list.raw = list.raw.substring(0, list.raw.length - addBack);
            i = l - 1;
          }
          bcurr = bnext;
        }
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+[.)]) ?/, "");
        if (~item.indexOf("\n ")) {
          space -= item.length;
          item = !this.options.pedantic ? item.replace(new RegExp("^ {1," + space + "}", "gm"), "") : item.replace(/^ {1,4}/gm, "");
        }
        item = rtrim(item, "\n");
        if (i !== l - 1) {
          raw = raw + "\n";
        }
        loose = next || /\n\n(?!\s*$)/.test(raw);
        if (i !== l - 1) {
          next = raw.slice(-2) === "\n\n";
          if (!loose)
            loose = next;
        }
        if (loose) {
          list.loose = true;
        }
        if (this.options.gfm) {
          istask = /^\[[ xX]\] /.test(item);
          ischecked = void 0;
          if (istask) {
            ischecked = item[1] !== " ";
            item = item.replace(/^\[[ xX]\] +/, "");
          }
        }
        list.items.push({
          type: "list_item",
          raw,
          task: istask,
          checked: ischecked,
          loose,
          text: item
        });
      }
      return list;
    }
  }
  html(src) {
    const cap = this.rules.block.html.exec(src);
    if (cap) {
      return {
        type: this.options.sanitize ? "paragraph" : "html",
        raw: cap[0],
        pre: !this.options.sanitizer && (cap[1] === "pre" || cap[1] === "script" || cap[1] === "style"),
        text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape$2(cap[0]) : cap[0]
      };
    }
  }
  def(src) {
    const cap = this.rules.block.def.exec(src);
    if (cap) {
      if (cap[3])
        cap[3] = cap[3].substring(1, cap[3].length - 1);
      const tag = cap[1].toLowerCase().replace(/\s+/g, " ");
      return {
        type: "def",
        tag,
        raw: cap[0],
        href: cap[2],
        title: cap[3]
      };
    }
  }
  table(src) {
    const cap = this.rules.block.table.exec(src);
    if (cap) {
      const item = {
        type: "table",
        header: splitCells(cap[1].replace(/^ *| *\| *$/g, "")),
        align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
        cells: cap[3] ? cap[3].replace(/\n$/, "").split("\n") : []
      };
      if (item.header.length === item.align.length) {
        item.raw = cap[0];
        let l = item.align.length;
        let i;
        for (i = 0; i < l; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = "right";
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = "center";
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = "left";
          } else {
            item.align[i] = null;
          }
        }
        l = item.cells.length;
        for (i = 0; i < l; i++) {
          item.cells[i] = splitCells(item.cells[i].replace(/^ *\| *| *\| *$/g, ""), item.header.length);
        }
        return item;
      }
    }
  }
  lheading(src) {
    const cap = this.rules.block.lheading.exec(src);
    if (cap) {
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[2].charAt(0) === "=" ? 1 : 2,
        text: cap[1]
      };
    }
  }
  paragraph(src) {
    const cap = this.rules.block.paragraph.exec(src);
    if (cap) {
      return {
        type: "paragraph",
        raw: cap[0],
        text: cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1]
      };
    }
  }
  text(src) {
    const cap = this.rules.block.text.exec(src);
    if (cap) {
      return {
        type: "text",
        raw: cap[0],
        text: cap[0]
      };
    }
  }
  escape(src) {
    const cap = this.rules.inline.escape.exec(src);
    if (cap) {
      return {
        type: "escape",
        raw: cap[0],
        text: escape$2(cap[1])
      };
    }
  }
  tag(src, inLink, inRawBlock) {
    const cap = this.rules.inline.tag.exec(src);
    if (cap) {
      if (!inLink && /^<a /i.test(cap[0])) {
        inLink = true;
      } else if (inLink && /^<\/a>/i.test(cap[0])) {
        inLink = false;
      }
      if (!inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        inRawBlock = true;
      } else if (inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        inRawBlock = false;
      }
      return {
        type: this.options.sanitize ? "text" : "html",
        raw: cap[0],
        inLink,
        inRawBlock,
        text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape$2(cap[0]) : cap[0]
      };
    }
  }
  link(src) {
    const cap = this.rules.inline.link.exec(src);
    if (cap) {
      const trimmedUrl = cap[2].trim();
      if (!this.options.pedantic && /^</.test(trimmedUrl)) {
        if (!/>$/.test(trimmedUrl)) {
          return;
        }
        const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
        if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
          return;
        }
      } else {
        const lastParenIndex = findClosingBracket(cap[2], "()");
        if (lastParenIndex > -1) {
          const start2 = cap[0].indexOf("!") === 0 ? 5 : 4;
          const linkLen = start2 + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = "";
        }
      }
      let href = cap[2];
      let title = "";
      if (this.options.pedantic) {
        const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
        if (link) {
          href = link[1];
          title = link[3];
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : "";
      }
      href = href.trim();
      if (/^</.test(href)) {
        if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
          href = href.slice(1);
        } else {
          href = href.slice(1, -1);
        }
      }
      return outputLink(cap, {
        href: href ? href.replace(this.rules.inline._escapes, "$1") : href,
        title: title ? title.replace(this.rules.inline._escapes, "$1") : title
      }, cap[0]);
    }
  }
  reflink(src, links) {
    let cap;
    if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
      let link = (cap[2] || cap[1]).replace(/\s+/g, " ");
      link = links[link.toLowerCase()];
      if (!link || !link.href) {
        const text = cap[0].charAt(0);
        return {
          type: "text",
          raw: text,
          text
        };
      }
      return outputLink(cap, link, cap[0]);
    }
  }
  emStrong(src, maskedSrc, prevChar = "") {
    let match = this.rules.inline.emStrong.lDelim.exec(src);
    if (!match)
      return;
    if (match[3] && prevChar.match(/[\p{L}\p{N}]/u))
      return;
    const nextChar = match[1] || match[2] || "";
    if (!nextChar || nextChar && (prevChar === "" || this.rules.inline.punctuation.exec(prevChar))) {
      const lLength = match[0].length - 1;
      let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
      const endReg = match[0][0] === "*" ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
      endReg.lastIndex = 0;
      maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
      while ((match = endReg.exec(maskedSrc)) != null) {
        rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
        if (!rDelim)
          continue;
        rLength = rDelim.length;
        if (match[3] || match[4]) {
          delimTotal += rLength;
          continue;
        } else if (match[5] || match[6]) {
          if (lLength % 3 && !((lLength + rLength) % 3)) {
            midDelimTotal += rLength;
            continue;
          }
        }
        delimTotal -= rLength;
        if (delimTotal > 0)
          continue;
        rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
        if (Math.min(lLength, rLength) % 2) {
          return {
            type: "em",
            raw: src.slice(0, lLength + match.index + rLength + 1),
            text: src.slice(1, lLength + match.index + rLength)
          };
        }
        return {
          type: "strong",
          raw: src.slice(0, lLength + match.index + rLength + 1),
          text: src.slice(2, lLength + match.index + rLength - 1)
        };
      }
    }
  }
  codespan(src) {
    const cap = this.rules.inline.code.exec(src);
    if (cap) {
      let text = cap[2].replace(/\n/g, " ");
      const hasNonSpaceChars = /[^ ]/.test(text);
      const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text = text.substring(1, text.length - 1);
      }
      text = escape$2(text, true);
      return {
        type: "codespan",
        raw: cap[0],
        text
      };
    }
  }
  br(src) {
    const cap = this.rules.inline.br.exec(src);
    if (cap) {
      return {
        type: "br",
        raw: cap[0]
      };
    }
  }
  del(src) {
    const cap = this.rules.inline.del.exec(src);
    if (cap) {
      return {
        type: "del",
        raw: cap[0],
        text: cap[2]
      };
    }
  }
  autolink(src, mangle2) {
    const cap = this.rules.inline.autolink.exec(src);
    if (cap) {
      let text, href;
      if (cap[2] === "@") {
        text = escape$2(this.options.mangle ? mangle2(cap[1]) : cap[1]);
        href = "mailto:" + text;
      } else {
        text = escape$2(cap[1]);
        href = text;
      }
      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: "text",
            raw: text,
            text
          }
        ]
      };
    }
  }
  url(src, mangle2) {
    let cap;
    if (cap = this.rules.inline.url.exec(src)) {
      let text, href;
      if (cap[2] === "@") {
        text = escape$2(this.options.mangle ? mangle2(cap[0]) : cap[0]);
        href = "mailto:" + text;
      } else {
        let prevCapZero;
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
        } while (prevCapZero !== cap[0]);
        text = escape$2(cap[0]);
        if (cap[1] === "www.") {
          href = "http://" + text;
        } else {
          href = text;
        }
      }
      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: "text",
            raw: text,
            text
          }
        ]
      };
    }
  }
  inlineText(src, inRawBlock, smartypants2) {
    const cap = this.rules.inline.text.exec(src);
    if (cap) {
      let text;
      if (inRawBlock) {
        text = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape$2(cap[0]) : cap[0];
      } else {
        text = escape$2(this.options.smartypants ? smartypants2(cap[0]) : cap[0]);
      }
      return {
        type: "text",
        raw: cap[0],
        text
      };
    }
  }
};
const {
  noopTest: noopTest2,
  edit: edit$2,
  merge: merge$1
} = helpers;
const block$1 = {
  newline: /^(?: *(?:\n|$))+/,
  code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
  fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
  heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?! {0,3}bull )\n*|\s*$)/,
  html: "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",
  def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
  nptable: noopTest2,
  table: noopTest2,
  lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
  _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html| +\n)[^\n]+)*)/,
  text: /^[^\n]+/
};
block$1._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
block$1._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block$1.def = edit$2(block$1.def).replace("label", block$1._label).replace("title", block$1._title).getRegex();
block$1.bullet = /(?:[*+-]|\d{1,9}[.)])/;
block$1.item = /^( *)(bull) ?[^\n]*(?:\n(?! *bull ?)[^\n]*)*/;
block$1.item = edit$2(block$1.item, "gm").replace(/bull/g, block$1.bullet).getRegex();
block$1.listItemStart = edit$2(/^( *)(bull) */).replace("bull", block$1.bullet).getRegex();
block$1.list = edit$2(block$1.list).replace(/bull/g, block$1.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + block$1.def.source + ")").getRegex();
block$1._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
block$1._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
block$1.html = edit$2(block$1.html, "i").replace("comment", block$1._comment).replace("tag", block$1._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
block$1.paragraph = edit$2(block$1._paragraph).replace("hr", block$1.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block$1._tag).getRegex();
block$1.blockquote = edit$2(block$1.blockquote).replace("paragraph", block$1.paragraph).getRegex();
block$1.normal = merge$1({}, block$1);
block$1.gfm = merge$1({}, block$1.normal, {
  nptable: "^ *([^|\\n ].*\\|.*)\\n {0,3}([-:]+ *\\|[-| :]*)(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)",
  table: "^ *\\|(.+)\\n {0,3}\\|?( *[-:]+[-| :]*)(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
});
block$1.gfm.nptable = edit$2(block$1.gfm.nptable).replace("hr", block$1.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block$1._tag).getRegex();
block$1.gfm.table = edit$2(block$1.gfm.table).replace("hr", block$1.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block$1._tag).getRegex();
block$1.pedantic = merge$1({}, block$1.normal, {
  html: edit$2(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", block$1._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: noopTest2,
  paragraph: edit$2(block$1.normal._paragraph).replace("hr", block$1.hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", block$1.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
});
const inline$1 = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noopTest2,
  tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  reflinkSearch: "reflink|nolink(?!\\()",
  emStrong: {
    lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
    rDelimAst: /\_\_[^_*]*?\*[^_*]*?\_\_|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
    rDelimUnd: /\*\*[^_*]*?\_[^_*]*?\*\*|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/
  },
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noopTest2,
  text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
  punctuation: /^([\spunctuation])/
};
inline$1._punctuation = "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~";
inline$1.punctuation = edit$2(inline$1.punctuation).replace(/punctuation/g, inline$1._punctuation).getRegex();
inline$1.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
inline$1.escapedEmSt = /\\\*|\\_/g;
inline$1._comment = edit$2(block$1._comment).replace("(?:-->|$)", "-->").getRegex();
inline$1.emStrong.lDelim = edit$2(inline$1.emStrong.lDelim).replace(/punct/g, inline$1._punctuation).getRegex();
inline$1.emStrong.rDelimAst = edit$2(inline$1.emStrong.rDelimAst, "g").replace(/punct/g, inline$1._punctuation).getRegex();
inline$1.emStrong.rDelimUnd = edit$2(inline$1.emStrong.rDelimUnd, "g").replace(/punct/g, inline$1._punctuation).getRegex();
inline$1._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
inline$1._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline$1._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline$1.autolink = edit$2(inline$1.autolink).replace("scheme", inline$1._scheme).replace("email", inline$1._email).getRegex();
inline$1._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
inline$1.tag = edit$2(inline$1.tag).replace("comment", inline$1._comment).replace("attribute", inline$1._attribute).getRegex();
inline$1._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
inline$1._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
inline$1._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
inline$1.link = edit$2(inline$1.link).replace("label", inline$1._label).replace("href", inline$1._href).replace("title", inline$1._title).getRegex();
inline$1.reflink = edit$2(inline$1.reflink).replace("label", inline$1._label).getRegex();
inline$1.reflinkSearch = edit$2(inline$1.reflinkSearch, "g").replace("reflink", inline$1.reflink).replace("nolink", inline$1.nolink).getRegex();
inline$1.normal = merge$1({}, inline$1);
inline$1.pedantic = merge$1({}, inline$1.normal, {
  strong: {
    start: /^__|\*\*/,
    middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    endAst: /\*\*(?!\*)/g,
    endUnd: /__(?!_)/g
  },
  em: {
    start: /^_|\*/,
    middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
    endAst: /\*(?!\*)/g,
    endUnd: /_(?!_)/g
  },
  link: edit$2(/^!?\[(label)\]\((.*?)\)/).replace("label", inline$1._label).getRegex(),
  reflink: edit$2(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", inline$1._label).getRegex()
});
inline$1.gfm = merge$1({}, inline$1.normal, {
  escape: edit$2(inline$1.escape).replace("])", "~|])").getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
});
inline$1.gfm.url = edit$2(inline$1.gfm.url, "i").replace("email", inline$1.gfm._extended_email).getRegex();
inline$1.breaks = merge$1({}, inline$1.gfm, {
  br: edit$2(inline$1.br).replace("{2,}", "*").getRegex(),
  text: edit$2(inline$1.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
});
var rules = {
  block: block$1,
  inline: inline$1
};
const Tokenizer$1 = Tokenizer_1;
const { defaults: defaults$3 } = defaults$5.exports;
const { block, inline } = rules;
const { repeatString } = helpers;
function smartypants(text) {
  return text.replace(/---/g, "\u2014").replace(/--/g, "\u2013").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018").replace(/'/g, "\u2019").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C").replace(/"/g, "\u201D").replace(/\.{3}/g, "\u2026");
}
function mangle(text) {
  let out = "", i, ch;
  const l = text.length;
  for (i = 0; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = "x" + ch.toString(16);
    }
    out += "&#" + ch + ";";
  }
  return out;
}
var Lexer_1 = class Lexer {
  constructor(options2) {
    this.tokens = [];
    this.tokens.links = Object.create(null);
    this.options = options2 || defaults$3;
    this.options.tokenizer = this.options.tokenizer || new Tokenizer$1();
    this.tokenizer = this.options.tokenizer;
    this.tokenizer.options = this.options;
    const rules2 = {
      block: block.normal,
      inline: inline.normal
    };
    if (this.options.pedantic) {
      rules2.block = block.pedantic;
      rules2.inline = inline.pedantic;
    } else if (this.options.gfm) {
      rules2.block = block.gfm;
      if (this.options.breaks) {
        rules2.inline = inline.breaks;
      } else {
        rules2.inline = inline.gfm;
      }
    }
    this.tokenizer.rules = rules2;
  }
  static get rules() {
    return {
      block,
      inline
    };
  }
  static lex(src, options2) {
    const lexer = new Lexer(options2);
    return lexer.lex(src);
  }
  static lexInline(src, options2) {
    const lexer = new Lexer(options2);
    return lexer.inlineTokens(src);
  }
  lex(src) {
    src = src.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ");
    this.blockTokens(src, this.tokens, true);
    this.inline(this.tokens);
    return this.tokens;
  }
  blockTokens(src, tokens = [], top2 = true) {
    if (this.options.pedantic) {
      src = src.replace(/^ +$/gm, "");
    }
    let token, i, l, lastToken, cutSrc, lastParagraphClipped;
    while (src) {
      if (this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((extTokenizer) => {
        if (token = extTokenizer.call(this, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.space(src)) {
        src = src.substring(token.raw.length);
        if (token.type) {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.code(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === "paragraph") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.fences(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.heading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.nptable(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.hr(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.blockquote(src)) {
        src = src.substring(token.raw.length);
        token.tokens = this.blockTokens(token.text, [], top2);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.list(src)) {
        src = src.substring(token.raw.length);
        l = token.items.length;
        for (i = 0; i < l; i++) {
          token.items[i].tokens = this.blockTokens(token.items[i].text, [], false);
        }
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.html(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (top2 && (token = this.tokenizer.def(src))) {
        src = src.substring(token.raw.length);
        if (!this.tokens.links[token.tag]) {
          this.tokens.links[token.tag] = {
            href: token.href,
            title: token.title
          };
        }
        continue;
      }
      if (token = this.tokenizer.table(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.lheading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startBlock) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startBlock.forEach(function(getStartIndex) {
          tempStart = getStartIndex.call(this, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (top2 && (token = this.tokenizer.paragraph(cutSrc))) {
        lastToken = tokens[tokens.length - 1];
        if (lastParagraphClipped && lastToken.type === "paragraph") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
        } else {
          tokens.push(token);
        }
        lastParagraphClipped = cutSrc.length !== src.length;
        src = src.substring(token.raw.length);
        continue;
      }
      if (token = this.tokenizer.text(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === "text") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    return tokens;
  }
  inline(tokens) {
    let i, j, k, l2, row, token;
    const l = tokens.length;
    for (i = 0; i < l; i++) {
      token = tokens[i];
      switch (token.type) {
        case "paragraph":
        case "text":
        case "heading": {
          token.tokens = [];
          this.inlineTokens(token.text, token.tokens);
          break;
        }
        case "table": {
          token.tokens = {
            header: [],
            cells: []
          };
          l2 = token.header.length;
          for (j = 0; j < l2; j++) {
            token.tokens.header[j] = [];
            this.inlineTokens(token.header[j], token.tokens.header[j]);
          }
          l2 = token.cells.length;
          for (j = 0; j < l2; j++) {
            row = token.cells[j];
            token.tokens.cells[j] = [];
            for (k = 0; k < row.length; k++) {
              token.tokens.cells[j][k] = [];
              this.inlineTokens(row[k], token.tokens.cells[j][k]);
            }
          }
          break;
        }
        case "blockquote": {
          this.inline(token.tokens);
          break;
        }
        case "list": {
          l2 = token.items.length;
          for (j = 0; j < l2; j++) {
            this.inline(token.items[j].tokens);
          }
          break;
        }
      }
    }
    return tokens;
  }
  inlineTokens(src, tokens = [], inLink = false, inRawBlock = false) {
    let token, lastToken, cutSrc;
    let maskedSrc = src;
    let match;
    let keepPrevChar, prevChar;
    if (this.tokens.links) {
      const links = Object.keys(this.tokens.links);
      if (links.length > 0) {
        while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
          if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
            maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
          }
        }
      }
    }
    while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    }
    while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
    }
    while (src) {
      if (!keepPrevChar) {
        prevChar = "";
      }
      keepPrevChar = false;
      if (this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((extTokenizer) => {
        if (token = extTokenizer.call(this, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.escape(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.tag(src, inLink, inRawBlock)) {
        src = src.substring(token.raw.length);
        inLink = token.inLink;
        inRawBlock = token.inRawBlock;
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === "text" && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.link(src)) {
        src = src.substring(token.raw.length);
        if (token.type === "link") {
          token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
        }
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.reflink(src, this.tokens.links)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (token.type === "link") {
          token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
          tokens.push(token);
        } else if (lastToken && token.type === "text" && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
        src = src.substring(token.raw.length);
        token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.codespan(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.br(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.del(src)) {
        src = src.substring(token.raw.length);
        token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.autolink(src, mangle)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (!inLink && (token = this.tokenizer.url(src, mangle))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startInline) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startInline.forEach(function(getStartIndex) {
          tempStart = getStartIndex.call(this, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (token = this.tokenizer.inlineText(cutSrc, inRawBlock, smartypants)) {
        src = src.substring(token.raw.length);
        if (token.raw.slice(-1) !== "_") {
          prevChar = token.raw.slice(-1);
        }
        keepPrevChar = true;
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    return tokens;
  }
};
const { defaults: defaults$2 } = defaults$5.exports;
const {
  cleanUrl,
  escape: escape$1
} = helpers;
var Renderer_1 = class Renderer {
  constructor(options2) {
    this.options = options2 || defaults$2;
  }
  code(code, infostring, escaped2) {
    const lang = (infostring || "").match(/\S*/)[0];
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped2 = true;
        code = out;
      }
    }
    code = code.replace(/\n$/, "") + "\n";
    if (!lang) {
      return "<pre><code>" + (escaped2 ? code : escape$1(code, true)) + "</code></pre>\n";
    }
    return '<pre><code class="' + this.options.langPrefix + escape$1(lang, true) + '">' + (escaped2 ? code : escape$1(code, true)) + "</code></pre>\n";
  }
  blockquote(quote) {
    return "<blockquote>\n" + quote + "</blockquote>\n";
  }
  html(html) {
    return html;
  }
  heading(text, level, raw, slugger) {
    if (this.options.headerIds) {
      return "<h" + level + ' id="' + this.options.headerPrefix + slugger.slug(raw) + '">' + text + "</h" + level + ">\n";
    }
    return "<h" + level + ">" + text + "</h" + level + ">\n";
  }
  hr() {
    return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
  }
  list(body, ordered, start2) {
    const type = ordered ? "ol" : "ul", startatt = ordered && start2 !== 1 ? ' start="' + start2 + '"' : "";
    return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
  }
  listitem(text) {
    return "<li>" + text + "</li>\n";
  }
  checkbox(checked) {
    return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
  }
  paragraph(text) {
    return "<p>" + text + "</p>\n";
  }
  table(header, body) {
    if (body)
      body = "<tbody>" + body + "</tbody>";
    return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
  }
  tablerow(content) {
    return "<tr>\n" + content + "</tr>\n";
  }
  tablecell(content, flags) {
    const type = flags.header ? "th" : "td";
    const tag = flags.align ? "<" + type + ' align="' + flags.align + '">' : "<" + type + ">";
    return tag + content + "</" + type + ">\n";
  }
  strong(text) {
    return "<strong>" + text + "</strong>";
  }
  em(text) {
    return "<em>" + text + "</em>";
  }
  codespan(text) {
    return "<code>" + text + "</code>";
  }
  br() {
    return this.options.xhtml ? "<br/>" : "<br>";
  }
  del(text) {
    return "<del>" + text + "</del>";
  }
  link(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = '<a href="' + escape$1(href) + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += ">" + text + "</a>";
    return out;
  }
  image(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = '<img src="' + href + '" alt="' + text + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? "/>" : ">";
    return out;
  }
  text(text) {
    return text;
  }
};
var TextRenderer_1 = class TextRenderer {
  strong(text) {
    return text;
  }
  em(text) {
    return text;
  }
  codespan(text) {
    return text;
  }
  del(text) {
    return text;
  }
  html(text) {
    return text;
  }
  text(text) {
    return text;
  }
  link(href, title, text) {
    return "" + text;
  }
  image(href, title, text) {
    return "" + text;
  }
  br() {
    return "";
  }
};
var Slugger_1 = class Slugger {
  constructor() {
    this.seen = {};
  }
  serialize(value) {
    return value.toLowerCase().trim().replace(/<[!\/a-z].*?>/ig, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
  }
  getNextSafeSlug(originalSlug, isDryRun) {
    let slug = originalSlug;
    let occurenceAccumulator = 0;
    if (this.seen.hasOwnProperty(slug)) {
      occurenceAccumulator = this.seen[originalSlug];
      do {
        occurenceAccumulator++;
        slug = originalSlug + "-" + occurenceAccumulator;
      } while (this.seen.hasOwnProperty(slug));
    }
    if (!isDryRun) {
      this.seen[originalSlug] = occurenceAccumulator;
      this.seen[slug] = 0;
    }
    return slug;
  }
  slug(value, options2 = {}) {
    const slug = this.serialize(value);
    return this.getNextSafeSlug(slug, options2.dryrun);
  }
};
const Renderer$1 = Renderer_1;
const TextRenderer$1 = TextRenderer_1;
const Slugger$1 = Slugger_1;
const { defaults: defaults$1 } = defaults$5.exports;
const {
  unescape
} = helpers;
var Parser_1 = class Parser {
  constructor(options2) {
    this.options = options2 || defaults$1;
    this.options.renderer = this.options.renderer || new Renderer$1();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.textRenderer = new TextRenderer$1();
    this.slugger = new Slugger$1();
  }
  static parse(tokens, options2) {
    const parser = new Parser(options2);
    return parser.parse(tokens);
  }
  static parseInline(tokens, options2) {
    const parser = new Parser(options2);
    return parser.parseInline(tokens);
  }
  parse(tokens, top2 = true) {
    let out = "", i, j, k, l2, l3, row, cell, header, body, token, ordered, start2, loose, itemBody, item, checked, task, checkbox, ret;
    const l = tokens.length;
    for (i = 0; i < l; i++) {
      token = tokens[i];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        ret = this.options.extensions.renderers[token.type].call(this, token);
        if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(token.type)) {
          out += ret || "";
          continue;
        }
      }
      switch (token.type) {
        case "space": {
          continue;
        }
        case "hr": {
          out += this.renderer.hr();
          continue;
        }
        case "heading": {
          out += this.renderer.heading(this.parseInline(token.tokens), token.depth, unescape(this.parseInline(token.tokens, this.textRenderer)), this.slugger);
          continue;
        }
        case "code": {
          out += this.renderer.code(token.text, token.lang, token.escaped);
          continue;
        }
        case "table": {
          header = "";
          cell = "";
          l2 = token.header.length;
          for (j = 0; j < l2; j++) {
            cell += this.renderer.tablecell(this.parseInline(token.tokens.header[j]), { header: true, align: token.align[j] });
          }
          header += this.renderer.tablerow(cell);
          body = "";
          l2 = token.cells.length;
          for (j = 0; j < l2; j++) {
            row = token.tokens.cells[j];
            cell = "";
            l3 = row.length;
            for (k = 0; k < l3; k++) {
              cell += this.renderer.tablecell(this.parseInline(row[k]), { header: false, align: token.align[k] });
            }
            body += this.renderer.tablerow(cell);
          }
          out += this.renderer.table(header, body);
          continue;
        }
        case "blockquote": {
          body = this.parse(token.tokens);
          out += this.renderer.blockquote(body);
          continue;
        }
        case "list": {
          ordered = token.ordered;
          start2 = token.start;
          loose = token.loose;
          l2 = token.items.length;
          body = "";
          for (j = 0; j < l2; j++) {
            item = token.items[j];
            checked = item.checked;
            task = item.task;
            itemBody = "";
            if (item.task) {
              checkbox = this.renderer.checkbox(checked);
              if (loose) {
                if (item.tokens.length > 0 && item.tokens[0].type === "text") {
                  item.tokens[0].text = checkbox + " " + item.tokens[0].text;
                  if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
                    item.tokens[0].tokens[0].text = checkbox + " " + item.tokens[0].tokens[0].text;
                  }
                } else {
                  item.tokens.unshift({
                    type: "text",
                    text: checkbox
                  });
                }
              } else {
                itemBody += checkbox;
              }
            }
            itemBody += this.parse(item.tokens, loose);
            body += this.renderer.listitem(itemBody, task, checked);
          }
          out += this.renderer.list(body, ordered, start2);
          continue;
        }
        case "html": {
          out += this.renderer.html(token.text);
          continue;
        }
        case "paragraph": {
          out += this.renderer.paragraph(this.parseInline(token.tokens));
          continue;
        }
        case "text": {
          body = token.tokens ? this.parseInline(token.tokens) : token.text;
          while (i + 1 < l && tokens[i + 1].type === "text") {
            token = tokens[++i];
            body += "\n" + (token.tokens ? this.parseInline(token.tokens) : token.text);
          }
          out += top2 ? this.renderer.paragraph(body) : body;
          continue;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return;
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
  parseInline(tokens, renderer) {
    renderer = renderer || this.renderer;
    let out = "", i, token, ret;
    const l = tokens.length;
    for (i = 0; i < l; i++) {
      token = tokens[i];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        ret = this.options.extensions.renderers[token.type].call(this, token);
        if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(token.type)) {
          out += ret || "";
          continue;
        }
      }
      switch (token.type) {
        case "escape": {
          out += renderer.text(token.text);
          break;
        }
        case "html": {
          out += renderer.html(token.text);
          break;
        }
        case "link": {
          out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
          break;
        }
        case "image": {
          out += renderer.image(token.href, token.title, token.text);
          break;
        }
        case "strong": {
          out += renderer.strong(this.parseInline(token.tokens, renderer));
          break;
        }
        case "em": {
          out += renderer.em(this.parseInline(token.tokens, renderer));
          break;
        }
        case "codespan": {
          out += renderer.codespan(token.text);
          break;
        }
        case "br": {
          out += renderer.br();
          break;
        }
        case "del": {
          out += renderer.del(this.parseInline(token.tokens, renderer));
          break;
        }
        case "text": {
          out += renderer.text(token.text);
          break;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return;
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
};
const Lexer$1 = Lexer_1;
const Parser2 = Parser_1;
const Tokenizer2 = Tokenizer_1;
const Renderer2 = Renderer_1;
const TextRenderer2 = TextRenderer_1;
const Slugger2 = Slugger_1;
const {
  merge,
  checkSanitizeDeprecation,
  escape
} = helpers;
const {
  getDefaults,
  changeDefaults,
  defaults
} = defaults$5.exports;
function marked(src, opt, callback) {
  if (typeof src === "undefined" || src === null) {
    throw new Error("marked(): input parameter is undefined or null");
  }
  if (typeof src !== "string") {
    throw new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected");
  }
  if (typeof opt === "function") {
    callback = opt;
    opt = null;
  }
  opt = merge({}, marked.defaults, opt || {});
  checkSanitizeDeprecation(opt);
  if (callback) {
    const highlight = opt.highlight;
    let tokens;
    try {
      tokens = Lexer$1.lex(src, opt);
    } catch (e) {
      return callback(e);
    }
    const done = function(err) {
      let out;
      if (!err) {
        try {
          if (opt.walkTokens) {
            marked.walkTokens(tokens, opt.walkTokens);
          }
          out = Parser2.parse(tokens, opt);
        } catch (e) {
          err = e;
        }
      }
      opt.highlight = highlight;
      return err ? callback(err) : callback(null, out);
    };
    if (!highlight || highlight.length < 3) {
      return done();
    }
    delete opt.highlight;
    if (!tokens.length)
      return done();
    let pending = 0;
    marked.walkTokens(tokens, function(token) {
      if (token.type === "code") {
        pending++;
        setTimeout(() => {
          highlight(token.text, token.lang, function(err, code) {
            if (err) {
              return done(err);
            }
            if (code != null && code !== token.text) {
              token.text = code;
              token.escaped = true;
            }
            pending--;
            if (pending === 0) {
              done();
            }
          });
        }, 0);
      }
    });
    if (pending === 0) {
      done();
    }
    return;
  }
  try {
    const tokens = Lexer$1.lex(src, opt);
    if (opt.walkTokens) {
      marked.walkTokens(tokens, opt.walkTokens);
    }
    return Parser2.parse(tokens, opt);
  } catch (e) {
    e.message += "\nPlease report this to https://github.com/markedjs/marked.";
    if (opt.silent) {
      return "<p>An error occurred:</p><pre>" + escape(e.message + "", true) + "</pre>";
    }
    throw e;
  }
}
marked.options = marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  changeDefaults(marked.defaults);
  return marked;
};
marked.getDefaults = getDefaults;
marked.defaults = defaults;
marked.use = function(...args) {
  const opts = merge({}, ...args);
  const extensions = marked.defaults.extensions || { renderers: {}, childTokens: {} };
  let hasExtensions;
  args.forEach((pack) => {
    if (pack.extensions) {
      hasExtensions = true;
      pack.extensions.forEach((ext) => {
        if (!ext.name) {
          throw new Error("extension name required");
        }
        if (ext.renderer) {
          const prevRenderer = extensions.renderers ? extensions.renderers[ext.name] : null;
          if (prevRenderer) {
            extensions.renderers[ext.name] = function(...args2) {
              let ret = ext.renderer.apply(this, args2);
              if (ret === false) {
                ret = prevRenderer.apply(this, args2);
              }
              return ret;
            };
          } else {
            extensions.renderers[ext.name] = ext.renderer;
          }
        }
        if (ext.tokenizer) {
          if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
            throw new Error("extension level must be 'block' or 'inline'");
          }
          if (extensions[ext.level]) {
            extensions[ext.level].unshift(ext.tokenizer);
          } else {
            extensions[ext.level] = [ext.tokenizer];
          }
          if (ext.start) {
            if (ext.level === "block") {
              if (extensions.startBlock) {
                extensions.startBlock.push(ext.start);
              } else {
                extensions.startBlock = [ext.start];
              }
            } else if (ext.level === "inline") {
              if (extensions.startInline) {
                extensions.startInline.push(ext.start);
              } else {
                extensions.startInline = [ext.start];
              }
            }
          }
        }
        if (ext.childTokens) {
          extensions.childTokens[ext.name] = ext.childTokens;
        }
      });
    }
    if (pack.renderer) {
      const renderer = marked.defaults.renderer || new Renderer2();
      for (const prop in pack.renderer) {
        const prevRenderer = renderer[prop];
        renderer[prop] = (...args2) => {
          let ret = pack.renderer[prop].apply(renderer, args2);
          if (ret === false) {
            ret = prevRenderer.apply(renderer, args2);
          }
          return ret;
        };
      }
      opts.renderer = renderer;
    }
    if (pack.tokenizer) {
      const tokenizer = marked.defaults.tokenizer || new Tokenizer2();
      for (const prop in pack.tokenizer) {
        const prevTokenizer = tokenizer[prop];
        tokenizer[prop] = (...args2) => {
          let ret = pack.tokenizer[prop].apply(tokenizer, args2);
          if (ret === false) {
            ret = prevTokenizer.apply(tokenizer, args2);
          }
          return ret;
        };
      }
      opts.tokenizer = tokenizer;
    }
    if (pack.walkTokens) {
      const walkTokens = marked.defaults.walkTokens;
      opts.walkTokens = (token) => {
        pack.walkTokens.call(this, token);
        if (walkTokens) {
          walkTokens(token);
        }
      };
    }
    if (hasExtensions) {
      opts.extensions = extensions;
    }
    marked.setOptions(opts);
  });
};
marked.walkTokens = function(tokens, callback) {
  for (const token of tokens) {
    callback(token);
    switch (token.type) {
      case "table": {
        for (const cell of token.tokens.header) {
          marked.walkTokens(cell, callback);
        }
        for (const row of token.tokens.cells) {
          for (const cell of row) {
            marked.walkTokens(cell, callback);
          }
        }
        break;
      }
      case "list": {
        marked.walkTokens(token.items, callback);
        break;
      }
      default: {
        if (marked.defaults.extensions && marked.defaults.extensions.childTokens && marked.defaults.extensions.childTokens[token.type]) {
          marked.defaults.extensions.childTokens[token.type].forEach(function(childTokens) {
            marked.walkTokens(token[childTokens], callback);
          });
        } else if (token.tokens) {
          marked.walkTokens(token.tokens, callback);
        }
      }
    }
  }
};
marked.parseInline = function(src, opt) {
  if (typeof src === "undefined" || src === null) {
    throw new Error("marked.parseInline(): input parameter is undefined or null");
  }
  if (typeof src !== "string") {
    throw new Error("marked.parseInline(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected");
  }
  opt = merge({}, marked.defaults, opt || {});
  checkSanitizeDeprecation(opt);
  try {
    const tokens = Lexer$1.lexInline(src, opt);
    if (opt.walkTokens) {
      marked.walkTokens(tokens, opt.walkTokens);
    }
    return Parser2.parseInline(tokens, opt);
  } catch (e) {
    e.message += "\nPlease report this to https://github.com/markedjs/marked.";
    if (opt.silent) {
      return "<p>An error occurred:</p><pre>" + escape(e.message + "", true) + "</pre>";
    }
    throw e;
  }
};
marked.Parser = Parser2;
marked.parser = Parser2.parse;
marked.Renderer = Renderer2;
marked.TextRenderer = TextRenderer2;
marked.Lexer = Lexer$1;
marked.lexer = Lexer$1.lex;
marked.Tokenizer = Tokenizer2;
marked.Slugger = Slugger2;
marked.parse = marked;
var marked_1 = marked;
const Heading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { depth } = $$props;
  let { raw } = $$props;
  if ($$props.depth === void 0 && $$bindings.depth && depth !== void 0)
    $$bindings.depth(depth);
  if ($$props.raw === void 0 && $$bindings.raw && raw !== void 0)
    $$bindings.raw(raw);
  return `${depth === 1 ? `<h1>${slots.default ? slots.default({}) : ``}</h1>` : `${depth === 2 ? `<h2>${slots.default ? slots.default({}) : ``}</h2>` : `${depth === 3 ? `<h3>${slots.default ? slots.default({}) : ``}</h3>` : `${depth === 4 ? `<h4>${slots.default ? slots.default({}) : ``}</h4>` : `${depth === 5 ? `<h5>${slots.default ? slots.default({}) : ``}</h5>` : `${depth === 6 ? `<h6>${slots.default ? slots.default({}) : ``}</h6>` : `${escape$4(raw)}`}`}`}`}`}`}`;
});
const Paragraph = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<p>${slots.default ? slots.default({}) : ``}</p>`;
});
const Text = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { text } = $$props;
  let { raw } = $$props;
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  if ($$props.raw === void 0 && $$bindings.raw && raw !== void 0)
    $$bindings.raw(raw);
  return `${slots.default ? slots.default({}) : ``}`;
});
const Image = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { href = "" } = $$props;
  let { title = void 0 } = $$props;
  let { text = "" } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  return `<img${add_attribute("src", href, 0)}${add_attribute("title", title, 0)}${add_attribute("alt", text, 0)}>`;
});
const Link = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { href = "" } = $$props;
  let { title = void 0 } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  return `<a${add_attribute("href", href, 0)}${add_attribute("title", title, 0)}>${slots.default ? slots.default({}) : ``}</a>`;
});
const Em = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<em>${slots.default ? slots.default({}) : ``}</em>`;
});
const Del = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<del>${slots.default ? slots.default({}) : ``}</del>`;
});
const Codespan = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { raw } = $$props;
  if ($$props.raw === void 0 && $$bindings.raw && raw !== void 0)
    $$bindings.raw(raw);
  return `<code>${escape$4(raw.replace(/`/g, ""))}</code>`;
});
const Strong = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<strong>${slots.default ? slots.default({}) : ``}</strong>`;
});
const Table = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<table>${slots.default ? slots.default({}) : ``}</table>`;
});
const TableHead = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<thead>${slots.default ? slots.default({}) : ``}</thead>`;
});
const TableBody = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<tbody>${slots.default ? slots.default({}) : ``}</tbody>`;
});
const TableRow = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<tr>${slots.default ? slots.default({}) : ``}</tr>`;
});
const TableCell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { header } = $$props;
  let { align } = $$props;
  if ($$props.header === void 0 && $$bindings.header && header !== void 0)
    $$bindings.header(header);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0)
    $$bindings.align(align);
  return `${header ? `<th${add_attribute("align", align, 0)}>${slots.default ? slots.default({}) : ``}</th>` : `<td${add_attribute("align", align, 0)}>${slots.default ? slots.default({}) : ``}</td>`}`;
});
const List = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { ordered } = $$props;
  let { start: start2 } = $$props;
  if ($$props.ordered === void 0 && $$bindings.ordered && ordered !== void 0)
    $$bindings.ordered(ordered);
  if ($$props.start === void 0 && $$bindings.start && start2 !== void 0)
    $$bindings.start(start2);
  return `${ordered ? `<ol${add_attribute("start", start2, 0)}>${slots.default ? slots.default({}) : ``}</ol>` : `<ul>${slots.default ? slots.default({}) : ``}</ul>`}`;
});
const ListItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<li>${slots.default ? slots.default({}) : ``}</li>`;
});
const Hr = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<hr>`;
});
const Html = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { text } = $$props;
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  return `<!-- HTML_TAG_START -->${text}<!-- HTML_TAG_END -->`;
});
const Blockquote = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<blockquote>${slots.default ? slots.default({}) : ``}</blockquote>`;
});
const Code = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { lang } = $$props;
  let { text } = $$props;
  if ($$props.lang === void 0 && $$bindings.lang && lang !== void 0)
    $$bindings.lang(lang);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  return `<pre${add_attribute("class", lang, 0)}><code>${escape$4(text)}</code></pre>`;
});
const Br = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<br>${slots.default ? slots.default({}) : ``}`;
});
const defaultRenderers = {
  heading: Heading,
  paragraph: Paragraph,
  text: Text,
  image: Image,
  link: Link,
  em: Em,
  strong: Strong,
  codespan: Codespan,
  del: Del,
  table: Table,
  tablehead: TableHead,
  tablebody: TableBody,
  tablerow: TableRow,
  tablecell: TableCell,
  list: List,
  orderedlistitem: null,
  unorderedlistitem: null,
  listitem: ListItem,
  hr: Hr,
  html: Html,
  blockquote: Blockquote,
  code: Code,
  br: Br
};
const defaultOptions = {
  baseUrl: null,
  breaks: false,
  gfm: true,
  headerIds: true,
  headerPrefix: "",
  highlight: null,
  langPrefix: "language-",
  mangle: true,
  pedantic: false,
  renderer: null,
  sanitize: false,
  sanitizer: null,
  silent: false,
  smartLists: false,
  smartypants: false,
  tokenizer: null,
  xhtml: false
};
const Lexer2 = marked_1.Lexer;
const SvelteMarkdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let combinedRenderers;
  let { source = "" } = $$props;
  let { renderers = {} } = $$props;
  let { options: options2 = {} } = $$props;
  let { isInline = false } = $$props;
  let lexer;
  let tokens;
  if ($$props.source === void 0 && $$bindings.source && source !== void 0)
    $$bindings.source(source);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  if ($$props.options === void 0 && $$bindings.options && options2 !== void 0)
    $$bindings.options(options2);
  if ($$props.isInline === void 0 && $$bindings.isInline && isInline !== void 0)
    $$bindings.isInline(isInline);
  {
    {
      lexer = new Lexer2({ ...defaultOptions, ...options2 });
      tokens = isInline ? lexer.inlineTokens(source) : lexer.lex(source);
    }
  }
  combinedRenderers = { ...defaultRenderers, ...renderers };
  return `${validate_component(Parser$1, "Parser").$$render($$result, { tokens, renderers: combinedRenderers }, {}, {})}`;
});
const ParagrapheMarkdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<p class="${"my-2"}">${slots.default ? slots.default({}) : ``}</p>`;
});
const TableMarkdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<table class="${"table table-striped table-hover"}">${slots.default ? slots.default({}) : ``}</table>`;
});
const TdMarkdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<td class="${"px-2 py-1 text-center"}">${slots.default ? slots.default({}) : ``}</td>`;
});
const TextBgFillPrimaryMarkdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<span class="${"bg-primary px-1"}">${slots.default ? slots.default({}) : ``}</span>`;
});
const TextMarkdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<span>${slots.default ? slots.default({}) : ``}</span>`;
});
var TextComponent_svelte_svelte_type_style_lang = ".content-container.svelte-14jnuhk.svelte-14jnuhk{position:relative}.content.svelte-14jnuhk.svelte-14jnuhk{opacity:1;width:100%;height:100%;backface-visibility:hidden}.middle.svelte-14jnuhk.svelte-14jnuhk{transition:.5s ease;opacity:0.5;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);text-align:center}.content-container.svelte-14jnuhk:hover .middle.svelte-14jnuhk{opacity:1}";
const css$9 = {
  code: ".content-container.svelte-14jnuhk.svelte-14jnuhk{position:relative}.content.svelte-14jnuhk.svelte-14jnuhk{opacity:1;width:100%;height:100%;backface-visibility:hidden}.middle.svelte-14jnuhk.svelte-14jnuhk{transition:.5s ease;opacity:0.5;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);text-align:center}.content-container.svelte-14jnuhk:hover .middle.svelte-14jnuhk{opacity:1}",
  map: `{"version":3,"file":"TextComponent.svelte","sources":["TextComponent.svelte"],"sourcesContent":["<script>\\n    import SvelteMarkdown from \\"svelte-markdown\\";\\n\\n    import { Icon, Modal, ModalBody, ModalFooter, ModalHeader } from \\"sveltestrap\\";\\n\\n    import EditButton from \\"./EditButton.svelte\\";\\n    //import LinkDarkBgMarkdown from \\"./markdown/LinkDarkBgMarkdown.svelte\\";\\n    //import LinkLightBgMarkdown from \\"./markdown/LinkLightBgMarkdown.svelte\\";\\n    import ParagrapheMarkdown from \\"./markdown/ParagrapheMarkdown.svelte\\";\\n    import TableMarkdown from \\"./markdown/TableMarkdown.svelte\\";\\n    import TdMarkdown from \\"./markdown/TdMarkdown.svelte\\";\\n    import TextBgFillPrimaryMarkdown from \\"./markdown/TextBgFillPrimaryMarkdown.svelte\\";\\n    import TextMarkdown from \\"./markdown/TextMarkdown.svelte\\";\\n\\n    export let values=[];\\n    export let styles=[];\\n    export let admin='false';\\n    export let edit='false';\\n    export let updateContent;\\n\\n    //components;\\n\\n    const colors = ['pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];\\n\\n    const toggle = async() => {\\n        if (edit && updateContent) {\\n            await updateContent();\\n        }\\n        edit = !edit;\\n    };\\n\\n    //$: console.log('TextComponent', values);\\n\\n    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;\\n    $: textColor = styles.filter(x => x.name === 'text-color')[0] && styles.filter(x => x.name === 'text-color')[0].value;\\n    $: bgColor = styles.filter(x => x.name === 'backgroud-color')[0] && styles.filter(x => x.name === 'backgroud-color')[0].value;\\n    $: fontWeight = styles.filter(x => x.name === 'font-weight')[0] && styles.filter(x => x.name === 'font-weight')[0].value;\\n    $: fontStyle = styles.filter(x => x.name === 'font-style')[0] && styles.filter(x => x.name === 'font-style')[0].value;\\n\\n    $: bgPrimaryText = styles.filter(x => x.name === 'bgPrimaryText')[0] && styles.filter(x => x.name === 'bgPrimaryText')[0].value;\\n    $: padding = styles.filter(x => x.name === 'padding')[0] && styles.filter(x => x.name === 'padding')[0].value;\\n    \\n    $: rounded = styles.filter(x => x.name === 'rounded')[0] && styles.filter(x => x.name === 'rounded')[0].value;\\n\\n    $: transformR = styles.filter(x => x.name === 'transformR')[0] ? styles.filter(x => x.name === 'transformR')[0].value : 0;\\n    $: transformX = styles.filter(x => x.name === 'transformX')[0] ? styles.filter(x => x.name === 'transformX')[0].value : 0;\\n    $: transformY = styles.filter(x => x.name === 'transformY')[0] ? styles.filter(x => x.name === 'transformY')[0].value : 0;\\n\\n    //$: dark = (['bg-white', 'bg-light', 'bg-pomme', 'bg-caraibe', 'bg-ambre'].includes(bgColor)) ? false : true;\\n\\n    const updateStyle = ({name, value}) => {\\n        const curentStyleItem = styles.filter(x => x.name === name);\\n        if (curentStyleItem.length) {\\n            for (let index = 0; index < styles.length; index++) {\\n                if (styles[index].name === name) {\\n                    styles[index].value = value;\\n                }\\n            }\\n        } else {\\n            styles = [...styles, {name, value}];\\n        }\\n        styles = styles;\\n    };\\n\\n    $:{\\n        if (values.length === 0) {\\n            values.push({type:'text', value:'#Edit your text here'});\\n        }\\n    }\\n    $:{\\n        if (!styles.length) {\\n            styles = [];\\n        }\\n    }\\n\\n<\/script>\\n\\n<style>\\n    .content-container{\\n        position: relative;\\n    }\\n    .content {\\n        opacity: 1;\\n        width: 100%;\\n        height: 100%;\\n        backface-visibility: hidden;\\n    }\\n    .middle {\\n        transition: .5s ease;\\n        opacity: 0.5;\\n        position: absolute;\\n        top: 50%;\\n        left: 50%;\\n        transform: translate(-50%, -50%);\\n        -ms-transform: translate(-50%, -50%);\\n        text-align: center;\\n    }\\n    .content-container:hover .middle {\\n        opacity: 1;\\n    }\\n    \\n</style>\\n\\n<div class='content-container'>\\n\\n    <Modal isOpen={edit} {toggle} size='lg' scrollable>\\n        <ModalHeader {toggle}>Ajouter un contenu</ModalHeader>\\n        <ModalBody>\\n            <div class='row'>\\n                <div class='col'>\\n                    <textarea \\n                        name='textarea' \\n                        id='input-textarea' \\n                        class='my-3 form-control' \\n                        bind:value={values[0].value}\\n                    />\\n                    <div class='row py-1'><div class='col'>\\n                        <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'text-align', value:'start'})}><Icon name='text-left' /></button>\\n                        <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'text-align', value:'center'})}><Icon name='text-center' /></button>\\n                        <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'text-align', value:'justify'})}><Icon name='justify-left' /></button>\\n                        <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'text-align', value:'end'})}><Icon name='text-right' /></button>\\n                    </div></div>\\n                    <div class='row py-1'><div class='col'>\\n                        {#each colors as color}\\n                            <btn class='px-1 btn btn-light' on:click={() => updateStyle({name:'text-color', value:\`text-\${color}\`})}><Icon name='fonts' class={\`text-\${color}\`} /></btn>\\n                        {/each}\\n                    </div></div>\\n                    <div class='row py-1'><div class='col'>\\n                        {#each colors as color}\\n                            <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'backgroud-color', value:\`bg-\${color}\`})}><Icon name='file-font-fill' class={\`text-\${color}\`} /></button>\\n                        {/each}\\n                        <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'backgroud-color', value:\`\`})}>Transparent</button>\\n                    </div></div>\\n                    <div class='row py-1'><div class='col'>\\n                        <button class='btn btn-light px-1' on:click={() => updateStyle({name:'font-weight', value:'normal'})}>B</button>\\n                        <button class='btn btn-light px-1' on:click={() => updateStyle({name:'font-weight', value:'bold'})}><Icon name='type-bold' /></button>\\n                        <button class='btn btn-light px-1' on:click={() => updateStyle({name:'font-style', value:'normal'})}>I</button>\\n                        <button class='btn btn-light px-1' on:click={() => updateStyle({name:'font-style', value:'italic'})}><Icon name='type-italic' /></button>\\n                    </div></div>\\n                    <div class='row py-1'>\\n                        <div class='col'>\\n                            <button class='btn btn-light px-1' on:click={() => updateStyle({name:'bgPrimaryText', value:true})}><span class='bg-primary'>Background</span></button>\\n                            <button class='btn btn-light px-1' on:click={() => updateStyle({name:'bgPrimaryText', value:false})}><span class='bg-transparent'>No Background</span></button>\\n                        </div>\\n                    </div>\\n                    <div class='row py-1'>\\n                        <div class='col'>\\n                            <button class='btn btn-light p-0' on:click={() => updateStyle({name:'padding', value:'p-0'})}><span>p-0</span></button>\\n                            <button class='btn btn-light p-1' on:click={() => updateStyle({name:'padding', value:'p-1'})}><span>p-1</span></button>\\n                            <button class='btn btn-light p-2' on:click={() => updateStyle({name:'padding', value:'p-2'})}><span>p-2</span></button>\\n                            <button class='btn btn-light p-3' on:click={() => updateStyle({name:'padding', value:'p-3'})}><span>p-3</span></button>\\n                            <button class='btn btn-light p-4' on:click={() => updateStyle({name:'padding', value:'p-4'})}><span>p-4</span></button>\\n                            <button class='btn btn-light p-5' on:click={() => updateStyle({name:'padding', value:'p-5'})}><span>p-5</span></button>\\n                        </div>\\n                    </div>\\n                    <div class='row py-1'>\\n                        <div class='col'>\\n                            <button class='btn btn-light px-1 rounded-0' on:click={() => updateStyle({name:'rounded', value:'rounded-0'})}><span>r-0</span></button>\\n                            <button class='btn btn-light px-1 rounded-1' on:click={() => updateStyle({name:'rounded', value:'rounded-1'})}><span>r-1</span></button>\\n                            <button class='btn btn-light px-1 rounded-2' on:click={() => updateStyle({name:'rounded', value:'rounded-2'})}><span>r-2</span></button>\\n                            <button class='btn btn-light px-1 rounded-3' on:click={() => updateStyle({name:'rounded', value:'rounded-3'})}><span>r-3</span></button>\\n                        </div>\\n                    </div>\\n                    <div class='row py-1 align-items-center'>\\n                        <div class='col-4'>Rotate : </div>\\n                        <div class='col-8'>\\n                            <input type='number' class='px-1 form-control' value={transformR} on:change={(e) => updateStyle({name:'transformR', value:e.target.value})}>\\n                        </div>\\n                    </div>\\n                    <div class='row py-1 align-items-center'>\\n                        <div class='col-4'>Translate X : </div>\\n                        <div class='col-8'>\\n                            <input type='number' class='px-1 form-control' value={transformX} on:change={(e) => updateStyle({name:'transformX', value:e.target.value})}>\\n                        </div>\\n                    </div>\\n                    <div class='row py-1 align-items-center'>\\n                        <div class='col-4'>Translate Y : </div>\\n                        <div class='col-8'>\\n                            <input type='number' class='px-1 form-control' value={transformY} on:change={(e) => updateStyle({name:'transformY', value:e.target.value})}>\\n                        </div>\\n                    </div>\\n                    <p class='my-3'><strong>Pr\xE9visualisation</strong></p>\\n                    <div class='row'>\\n                        <div class='col'>\\n                            <div class={\`\${textColor} \${bgColor} \${padding} \${rounded}\`} style={\`text-align: \${textAlign};font-weight: \${fontWeight};font-style: \${fontStyle};transform: rotate(\${transformR}deg) translateX(\${transformX}vh) translateY(\${transformY}vh);\`}>\\n                                <SvelteMarkdown source={values[0] && values[0].value ? values[0].value : ''} renderers={{\\n                                    paragraph: ParagrapheMarkdown, \\n                                    table: TableMarkdown, \\n                                    tablecell: TdMarkdown,\\n                                    text: bgPrimaryText ? TextBgFillPrimaryMarkdown : TextMarkdown,\\n                                    }}/>\\n                            </div>\\n                        </div>\\n                    </div>\\n                    \\n                </div>\\n            </div>\\n        </ModalBody>\\n        <ModalFooter>\\n            <button class=\\"btn btn-primary\\" on:click={toggle}>Enregistrer</button>\\n            <button class=\\"btn btn-secondary\\" on:click={toggle}>Cancel</button>\\n        </ModalFooter>\\n    </Modal>\\n    <div class='content' >\\n        <div class={\`\${textColor} \${bgColor} \${padding} \${rounded}\`} style={\`text-align: \${textAlign};font-weight: \${fontWeight};font-style: \${fontStyle};transform: rotate(\${transformR}deg) translateX(\${transformX}vh) translateY(\${transformY}vh);\`}>\\n            <SvelteMarkdown source={values[0] && values[0].value ? values[0].value : ''} renderers={{\\n                paragraph: ParagrapheMarkdown, \\n                table: TableMarkdown, \\n                tablecell: TdMarkdown,\\n                text: bgPrimaryText ? TextBgFillPrimaryMarkdown : TextMarkdown,\\n                }} />\\n        </div>\\n    </div>\\n\\n    {#if admin}\\n        <div class='middle'>\\n        <EditButton\\n            admin={admin}\\n            updateContent={updateContent}\\n            bind:edit={edit}\\n        />\\n        </div>\\n    {/if}\\n\\n</div>"],"names":[],"mappings":"AA8EI,gDAAkB,CAAC,AACf,QAAQ,CAAE,QAAQ,AACtB,CAAC,AACD,QAAQ,8BAAC,CAAC,AACN,OAAO,CAAE,CAAC,CACV,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,mBAAmB,CAAE,MAAM,AAC/B,CAAC,AACD,OAAO,8BAAC,CAAC,AACL,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,OAAO,CAAE,GAAG,CACZ,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,GAAG,CACR,IAAI,CAAE,GAAG,CACT,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAChC,aAAa,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CACpC,UAAU,CAAE,MAAM,AACtB,CAAC,AACD,iCAAkB,MAAM,CAAC,OAAO,eAAC,CAAC,AAC9B,OAAO,CAAE,CAAC,AACd,CAAC"}`
};
const TextComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let textAlign;
  let textColor;
  let bgColor;
  let fontWeight;
  let fontStyle;
  let bgPrimaryText;
  let padding;
  let rounded;
  let transformR;
  let transformX;
  let transformY;
  let { values = [] } = $$props;
  let { styles = [] } = $$props;
  let { admin = "false" } = $$props;
  let { edit: edit2 = "false" } = $$props;
  let { updateContent } = $$props;
  const colors = [
    "pomme",
    "outremer",
    "lavande",
    "caraibe",
    "tangerine",
    "ambre",
    "light",
    "white",
    "dark",
    "black"
  ];
  const toggle = async () => {
    if (edit2 && updateContent) {
      await updateContent();
    }
    edit2 = !edit2;
  };
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.styles === void 0 && $$bindings.styles && styles !== void 0)
    $$bindings.styles(styles);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.edit === void 0 && $$bindings.edit && edit2 !== void 0)
    $$bindings.edit(edit2);
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  $$result.css.add(css$9);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        if (!styles.length) {
          styles = [];
        }
      }
    }
    textAlign = styles.filter((x) => x.name === "text-align")[0] && styles.filter((x) => x.name === "text-align")[0].value;
    textColor = styles.filter((x) => x.name === "text-color")[0] && styles.filter((x) => x.name === "text-color")[0].value;
    bgColor = styles.filter((x) => x.name === "backgroud-color")[0] && styles.filter((x) => x.name === "backgroud-color")[0].value;
    fontWeight = styles.filter((x) => x.name === "font-weight")[0] && styles.filter((x) => x.name === "font-weight")[0].value;
    fontStyle = styles.filter((x) => x.name === "font-style")[0] && styles.filter((x) => x.name === "font-style")[0].value;
    bgPrimaryText = styles.filter((x) => x.name === "bgPrimaryText")[0] && styles.filter((x) => x.name === "bgPrimaryText")[0].value;
    padding = styles.filter((x) => x.name === "padding")[0] && styles.filter((x) => x.name === "padding")[0].value;
    rounded = styles.filter((x) => x.name === "rounded")[0] && styles.filter((x) => x.name === "rounded")[0].value;
    transformR = styles.filter((x) => x.name === "transformR")[0] ? styles.filter((x) => x.name === "transformR")[0].value : 0;
    transformX = styles.filter((x) => x.name === "transformX")[0] ? styles.filter((x) => x.name === "transformX")[0].value : 0;
    transformY = styles.filter((x) => x.name === "transformY")[0] ? styles.filter((x) => x.name === "transformY")[0].value : 0;
    {
      {
        if (values.length === 0) {
          values.push({
            type: "text",
            value: "#Edit your text here"
          });
        }
      }
    }
    $$rendered = `<div class="${"content-container svelte-14jnuhk"}">${validate_component(Modal, "Modal").$$render($$result, {
      isOpen: edit2,
      toggle,
      size: "lg",
      scrollable: true
    }, {}, {
      default: () => `${validate_component(ModalHeader, "ModalHeader").$$render($$result, { toggle }, {}, { default: () => `Ajouter un contenu` })}
        ${validate_component(ModalBody, "ModalBody").$$render($$result, {}, {}, {
        default: () => `<div class="${"row"}"><div class="${"col"}"><textarea name="${"textarea"}" id="${"input-textarea"}" class="${"my-3 form-control"}">${values[0].value || ""}</textarea>
                    <div class="${"row py-1"}"><div class="${"col"}"><button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, { name: "text-left" }, {}, {})}</button>
                        <button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, { name: "text-center" }, {}, {})}</button>
                        <button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, { name: "justify-left" }, {}, {})}</button>
                        <button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, { name: "text-right" }, {}, {})}</button></div></div>
                    <div class="${"row py-1"}"><div class="${"col"}">${each(colors, (color) => `<btn class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, { name: "fonts", class: `text-${color}` }, {}, {})}</btn>`)}</div></div>
                    <div class="${"row py-1"}"><div class="${"col"}">${each(colors, (color) => `<button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, {
          name: "file-font-fill",
          class: `text-${color}`
        }, {}, {})}</button>`)}
                        <button class="${"px-1 btn btn-light"}">Transparent</button></div></div>
                    <div class="${"row py-1"}"><div class="${"col"}"><button class="${"btn btn-light px-1"}">B</button>
                        <button class="${"btn btn-light px-1"}">${validate_component(Icon, "Icon").$$render($$result, { name: "type-bold" }, {}, {})}</button>
                        <button class="${"btn btn-light px-1"}">I</button>
                        <button class="${"btn btn-light px-1"}">${validate_component(Icon, "Icon").$$render($$result, { name: "type-italic" }, {}, {})}</button></div></div>
                    <div class="${"row py-1"}"><div class="${"col"}"><button class="${"btn btn-light px-1"}"><span class="${"bg-primary"}">Background</span></button>
                            <button class="${"btn btn-light px-1"}"><span class="${"bg-transparent"}">No Background</span></button></div></div>
                    <div class="${"row py-1"}"><div class="${"col"}"><button class="${"btn btn-light p-0"}"><span>p-0</span></button>
                            <button class="${"btn btn-light p-1"}"><span>p-1</span></button>
                            <button class="${"btn btn-light p-2"}"><span>p-2</span></button>
                            <button class="${"btn btn-light p-3"}"><span>p-3</span></button>
                            <button class="${"btn btn-light p-4"}"><span>p-4</span></button>
                            <button class="${"btn btn-light p-5"}"><span>p-5</span></button></div></div>
                    <div class="${"row py-1"}"><div class="${"col"}"><button class="${"btn btn-light px-1 rounded-0"}"><span>r-0</span></button>
                            <button class="${"btn btn-light px-1 rounded-1"}"><span>r-1</span></button>
                            <button class="${"btn btn-light px-1 rounded-2"}"><span>r-2</span></button>
                            <button class="${"btn btn-light px-1 rounded-3"}"><span>r-3</span></button></div></div>
                    <div class="${"row py-1 align-items-center"}"><div class="${"col-4"}">Rotate : </div>
                        <div class="${"col-8"}"><input type="${"number"}" class="${"px-1 form-control"}"${add_attribute("value", transformR, 0)}></div></div>
                    <div class="${"row py-1 align-items-center"}"><div class="${"col-4"}">Translate X : </div>
                        <div class="${"col-8"}"><input type="${"number"}" class="${"px-1 form-control"}"${add_attribute("value", transformX, 0)}></div></div>
                    <div class="${"row py-1 align-items-center"}"><div class="${"col-4"}">Translate Y : </div>
                        <div class="${"col-8"}"><input type="${"number"}" class="${"px-1 form-control"}"${add_attribute("value", transformY, 0)}></div></div>
                    <p class="${"my-3"}"><strong>Pr\xE9visualisation</strong></p>
                    <div class="${"row"}"><div class="${"col"}"><div class="${escape$4(null_to_empty(`${textColor} ${bgColor} ${padding} ${rounded}`)) + " svelte-14jnuhk"}"${add_attribute("style", `text-align: ${textAlign};font-weight: ${fontWeight};font-style: ${fontStyle};transform: rotate(${transformR}deg) translateX(${transformX}vh) translateY(${transformY}vh);`, 0)}>${validate_component(SvelteMarkdown, "SvelteMarkdown").$$render($$result, {
          source: values[0] && values[0].value ? values[0].value : "",
          renderers: {
            paragraph: ParagrapheMarkdown,
            table: TableMarkdown,
            tablecell: TdMarkdown,
            text: bgPrimaryText ? TextBgFillPrimaryMarkdown : TextMarkdown
          }
        }, {}, {})}</div></div></div></div></div>`
      })}
        ${validate_component(ModalFooter, "ModalFooter").$$render($$result, {}, {}, {
        default: () => `<button class="${"btn btn-primary"}">Enregistrer</button>
            <button class="${"btn btn-secondary"}">Cancel</button>`
      })}`
    })}
    <div class="${"content svelte-14jnuhk"}"><div class="${escape$4(null_to_empty(`${textColor} ${bgColor} ${padding} ${rounded}`)) + " svelte-14jnuhk"}"${add_attribute("style", `text-align: ${textAlign};font-weight: ${fontWeight};font-style: ${fontStyle};transform: rotate(${transformR}deg) translateX(${transformX}vh) translateY(${transformY}vh);`, 0)}>${validate_component(SvelteMarkdown, "SvelteMarkdown").$$render($$result, {
      source: values[0] && values[0].value ? values[0].value : "",
      renderers: {
        paragraph: ParagrapheMarkdown,
        table: TableMarkdown,
        tablecell: TdMarkdown,
        text: bgPrimaryText ? TextBgFillPrimaryMarkdown : TextMarkdown
      }
    }, {}, {})}</div></div>

    ${admin ? `<div class="${"middle svelte-14jnuhk"}">${validate_component(EditButton, "EditButton").$$render($$result, { admin, updateContent, edit: edit2 }, {
      edit: ($$value) => {
        edit2 = $$value;
        $$settled = false;
      }
    }, {})}</div>` : ``}</div>`;
  } while (!$$settled);
  return $$rendered;
});
const Message = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "primary" } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  return `<div${add_attribute("class", `alert alert-${color} my-3`, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Loading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { number = 1 } = $$props;
  let { color = "primary" } = $$props;
  if ($$props.number === void 0 && $$bindings.number && number !== void 0)
    $$bindings.number(number);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  return `${each([...Array(number).keys()], (item) => `<div${add_attribute("class", `spinner-grow my-2 text-${color}`, 0)} role="${"status"}"${add_attribute("keys", item, 0)}><span class="${"visually-hidden"}">Loading...</span>
    </div>`)}`;
});
const CustomContainer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = { xs: 12, sm: 10, md: 10, lg: 10 } } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  return `${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => `${validate_component(Row, "Row").$$render($$result, {}, {}, {
      default: () => `${validate_component(Col, "Col").$$render($$result, {
        xs: {
          size: size.xs,
          offset: (12 - size.xs) / 2
        },
        sm: {
          size: size.sm,
          offset: (12 - size.sm) / 2
        },
        md: {
          size: size.md,
          offset: (12 - size.md) / 2
        },
        lg: {
          size: size.lg,
          offset: (12 - size.lg) / 2
        }
      }, {}, {
        default: () => `${slots.default ? slots.default({}) : ``}`
      })}`
    })}`
  })}`;
});
const prerender$2 = true;
async function load$2({ page: page2, fetch: fetch2, session, context }) {
  const params = { id: null, category: null };
  let [category, id] = page2.params.data.split("/");
  params.category = category ? category : "";
  params.id = id ? id : "";
  let redirection = page2.path.split("/login");
  let articleRequest2 = {
    content: { content: [], name: "" },
    loading: true,
    message: ""
  };
  if (redirection.length === 1) {
    page2.path.substring(1).replace("/", "-");
    articleRequest2 = await getArticle(id);
  }
  return {
    props: { articleRequest: articleRequest2, params, redirection }
  };
}
let edit$1 = false;
const U5B_datau5D$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let id;
  let isAuthenticate;
  let $userInfo, $$unsubscribe_userInfo;
  let $articleUpdateRequest, $$unsubscribe_articleUpdateRequest;
  $$unsubscribe_userInfo = subscribe(userInfo, (value) => $userInfo = value);
  $$unsubscribe_articleUpdateRequest = subscribe(articleUpdateRequest, (value) => $articleUpdateRequest = value);
  let { params } = $$props;
  let { articleRequest: articleRequest2 } = $$props;
  let { redirection } = $$props;
  let admin = false;
  const updateArticle = () => {
    updateArticleRequest(id, articleRequest2.article);
  };
  if ($$props.params === void 0 && $$bindings.params && params !== void 0)
    $$bindings.params(params);
  if ($$props.articleRequest === void 0 && $$bindings.articleRequest && articleRequest2 !== void 0)
    $$bindings.articleRequest(articleRequest2);
  if ($$props.redirection === void 0 && $$bindings.redirection && redirection !== void 0)
    $$bindings.redirection(redirection);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    id = params.id;
    isAuthenticate = $userInfo && $userInfo.profil === "admin" ? true : false;
    $$rendered = `${isAuthenticate ? `${validate_component(AdminButton, "AdminButton").$$render($$result, { isAuthenticate, admin }, {
      admin: ($$value) => {
        admin = $$value;
        $$settled = false;
      }
    }, {})}

    ${articleRequest2.message ? `${validate_component(Message, "Message").$$render($$result, { color: "warning" }, {}, {
      default: () => `${escape$4(articleRequest2.message)}`
    })}` : ``}
    
    ${articleRequest2.loading ? `${validate_component(Loading, "Loading").$$render($$result, { color: "secondary", number: 3 }, {}, {})}` : ``}

    ${$articleUpdateRequest.message ? `${validate_component(Message, "Message").$$render($$result, {
      color: $articleUpdateRequest.success ? "success" : "error"
    }, {}, {
      default: () => `${escape$4($articleUpdateRequest.message)}`
    })}` : ``}

    ${$articleUpdateRequest.loading ? `${validate_component(Loading, "Loading").$$render($$result, { color: "secondary", number: 3 }, {}, {})}` : ``}` : ``}

${articleRequest2.article ? `${validate_component(CustomContainer, "CustomContainer").$$render($$result, {}, {}, {
      default: () => `<div class="${"row align-items-center"}"><div class="${"col-md-3 col-sm-12"}">${validate_component(ImageComponent, "ImageComponent").$$render($$result, {
        admin,
        edit: edit$1,
        updateContent: updateArticle,
        values: articleRequest2.article.url.values,
        styles: articleRequest2.article.url.styles
      }, {
        values: ($$value) => {
          articleRequest2.article.url.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          articleRequest2.article.url.styles = $$value;
          $$settled = false;
        }
      }, {})}</div>

            <div class="${"col-md-9 col-sm-12"}"><h1>${validate_component(TextComponent, "TextComponent").$$render($$result, {
        admin,
        edit: edit$1,
        updateContent: updateArticle,
        values: articleRequest2.article.title.values,
        styles: articleRequest2.article.title.styles
      }, {
        values: ($$value) => {
          articleRequest2.article.title.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          articleRequest2.article.title.styles = $$value;
          $$settled = false;
        }
      }, {})}</h1>
                <div class="${"row"}"><div class="${"col text-end"}">R\xE9dig\xE9 par : 
                    </div>
                    <div class="${"col text-start"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
        admin,
        edit: edit$1,
        updateContent: updateArticle,
        values: articleRequest2.article.author.values,
        styles: articleRequest2.article.author.styles
      }, {
        values: ($$value) => {
          articleRequest2.article.author.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          articleRequest2.article.author.styles = $$value;
          $$settled = false;
        }
      }, {})}</div>
                    <div class="${"col text-end"}">Publi\xE9 le : 
                    </div>
                    <div class="${"col text-start"}">${admin ? `${validate_component(Input, "Input").$$render($$result, {
        type: "date",
        value: articleRequest2.article.createdAt
      }, {
        value: ($$value) => {
          articleRequest2.article.createdAt = $$value;
          $$settled = false;
        }
      }, {})}` : `<p>${escape$4(articleRequest2.article.createdAt.toString().substring(0, 10))}</p>`}</div></div></div></div>

        <div class="${"row"}"><div class="${"col mx-5"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
        admin,
        edit: edit$1,
        updateContent: updateArticle,
        values: articleRequest2.article.subTitle.values,
        styles: articleRequest2.article.subTitle.styles
      }, {
        values: ($$value) => {
          articleRequest2.article.subTitle.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          articleRequest2.article.subTitle.styles = $$value;
          $$settled = false;
        }
      }, {})}</div></div>

        <div class="${"row"}"><div class="${"col"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
        admin,
        edit: edit$1,
        updateContent: updateArticle,
        values: articleRequest2.article.content.values,
        styles: articleRequest2.article.content.styles
      }, {
        values: ($$value) => {
          articleRequest2.article.content.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          articleRequest2.article.content.styles = $$value;
          $$settled = false;
        }
      }, {})}</div></div>`
    })}` : ``}`;
  } while (!$$settled);
  $$unsubscribe_userInfo();
  $$unsubscribe_articleUpdateRequest();
  return $$rendered;
});
var ____data_$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5B_datau5D$1,
  prerender: prerender$2,
  load: load$2
});
const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
const page = {
  subscribe(fn2) {
    const store = getStores().page;
    return store.subscribe(fn2);
  }
};
const Login = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $userInfo, $$unsubscribe_userInfo;
  let $page, $$unsubscribe_page;
  $$unsubscribe_userInfo = subscribe(userInfo, (value) => $userInfo = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $page.query.get("redirection");
  let email = "";
  let password = "";
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        $userInfo && $userInfo.profil === "admin" ? true : false;
      }
    }
    $$rendered = `${$$result.head += `${$$result.title = `<title>Login - Projection Transition</title>`, ""}<meta name="${"description"}"${add_attribute("content", `Retrouvez toutes les informations sur le festival Projection Transition Login`, 0)} data-svelte="svelte-1i64zcu"><meta name="${"keywords"}" content="${"\xE9cologie, transition, projection transition, cin\xE9ma, shiftProject, cine-debat"}" data-svelte="svelte-1i64zcu">`, ""}

${validate_component(CustomContainer, "CustomContainer").$$render($$result, { size: { xs: 12, sm: 6, md: 6, lg: 6 } }, {}, {
      default: () => `${validate_component(Row, "Row").$$render($$result, { class: "my-5" }, {}, {
        default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
          default: () => `<h3>Login</h3>
            ${validate_component(Form, "Form").$$render($$result, {}, {}, {
            default: () => `${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
              default: () => `${validate_component(Label, "Label").$$render($$result, { for: "email-input" }, {}, { default: () => `Email :` })}
                    ${validate_component(Input, "Input").$$render($$result, {
                type: "email",
                name: "mail",
                id: "email-input",
                placeholder: "Enter your email",
                value: email
              }, {
                value: ($$value) => {
                  email = $$value;
                  $$settled = false;
                }
              }, {})}`
            })}
                ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
              default: () => `${validate_component(Label, "Label").$$render($$result, { for: "password-input" }, {}, { default: () => `Password :` })}
                    ${validate_component(Input, "Input").$$render($$result, {
                type: "password",
                name: "password",
                id: "password-input",
                placeholder: "Enter your password",
                value: password
              }, {
                value: ($$value) => {
                  password = $$value;
                  $$settled = false;
                }
              }, {})}`
            })}
                ${validate_component(Button, "Button").$$render($$result, { type: "submit", color: "primary" }, {}, { default: () => `Submit` })}`
          })}`
        })}`
      })}
    
    ${``}`
    })}`;
  } while (!$$settled);
  $$unsubscribe_userInfo();
  $$unsubscribe_page();
  return $$rendered;
});
var login = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Login
});
const API_URL$1 = config.API_URL_DEV;
const getFilm = async (id) => {
  filmRequest.set({ film: null, loading: true, message: "" });
  try {
    const config2 = {
      headers: {
        "Content-type": "Application/json"
      }
    };
    const { data } = await axios.get(`${API_URL$1}/api/film/${id}`, config2);
    filmRequest.set({ film: data.value, loading: false, message: "" });
    return { film: data.value, loading: false, message: "" };
  } catch (error2) {
    filmRequest.set({ film: null, loading: false, message: "Error loading the film" + error2 });
    return { film: null, loading: false, message: "Error loading the film" + error2 };
  }
};
const updateFilmRequest = async (id, film) => {
  filmUpdateRequest.set({ success: false, loading: true, message: "" });
  const userInfoStored = get_store_value(userInfo);
  try {
    const config2 = {
      headers: {
        "Content-type": "Application/json",
        Authorization: `Bearer ${userInfoStored.token}`
      }
    };
    const { data } = await axios.put(`${API_URL$1}/api/film/${id}`, film, config2);
    filmUpdateRequest.set({ success: true, loading: false, message: "film updated" });
  } catch (error2) {
    filmUpdateRequest.set({ success: false, loading: false, message: "Error updating film " + error2 });
  }
};
const AddElement = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { addContent = null } = $$props;
  let { position = 0 } = $$props;
  let { addToLayout = null } = $$props;
  let { open = false } = $$props;
  let type = "";
  let values = [];
  let styles = [];
  const toggle = async (save) => {
    if (open && addContent && save) {
      await addContent({ type, values, styles }, position);
    }
    if (open && addToLayout && save) {
      await addToLayout({ type, values, styles }, position);
    }
    open = !open;
  };
  if ($$props.addContent === void 0 && $$bindings.addContent && addContent !== void 0)
    $$bindings.addContent(addContent);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  if ($$props.addToLayout === void 0 && $$bindings.addToLayout && addToLayout !== void 0)
    $$bindings.addToLayout(addToLayout);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  return `${validate_component(Modal, "Modal").$$render($$result, {
    isOpen: open,
    toggle,
    size: "lg",
    scrollable: true
  }, {}, {
    default: () => `${validate_component(ModalHeader, "ModalHeader").$$render($$result, { toggle }, {}, { default: () => `Ajouter un contenu` })}
    
    ${validate_component(ModalBody, "ModalBody").$$render($$result, {}, {}, {
      default: () => `${validate_component(Row, "Row").$$render($$result, {}, {}, {
        default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
          default: () => `${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
            default: () => `${validate_component(Label, "Label").$$render($$result, { for: "exampleSelect" }, {}, { default: () => `Select` })}
                <select class="${"form-select"}" type="${"select"}" name="${"select"}" id="${"exampleSelect"}"><option value="${""}" ${"selected"}>--- select ---</option><option value="${"layoutComponent"}" ${""}>type LAYOUT</option><option value="${"textComponent"}" ${""}>type TEXT</option><option value="${"imageComponent"}" ${""}>type IMAGE</option><option value="${"videoComponent"}" ${""}>type VIDEO</option><option value="${"carouselComponent"}" ${""}>type CAROUSEL</option><option value="${"editoComponent"}" ${""}>type EDITO</option><option value="${"articlesComponent"}" ${""}>type ARTICLES</option><option value="${"partenairesComponent"}" ${""}>type PARTENAIRES</option><option value="${"infoComponent"}" ${""}>type INFO VILLE</option><option value="${"programmationComponent"}" ${""}>type PROGRAMMATION VILLE</option><option value="${"equipeComponent"}" ${""}>type EQUIPE</option><option value="${"contactComponent"}" ${""}>type CONTACT</option><option value="${"test"}" ${""}>type TEST</option></select>`
          })}`
        })}`
      })}`
    })}

    ${validate_component(ModalFooter, "ModalFooter").$$render($$result, {}, {}, {
      default: () => `${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, { default: () => `Enregistrer` })}
      ${validate_component(Button, "Button").$$render($$result, { color: "secondary" }, {}, { default: () => `Cancel` })}`
    })}`
  })}`;
});
var MovingContent_svelte_svelte_type_style_lang = ".moving-container.svelte-dg0a67.svelte-dg0a67{-webkit-transform:scale(1);transform:scale(1);transition:.5s ease;border:dashed 1px}.moving-container.svelte-dg0a67.svelte-dg0a67:hover{-webkit-transform:scale(1.03);transform:scale(1.03);transition:.5s ease}.edition.svelte-dg0a67.svelte-dg0a67{-webkit-transform:scale(0);transform:scale(0);transition:.5s ease;width:0px}.moving-container.svelte-dg0a67:hover .edition.svelte-dg0a67{-webkit-transform:scale(1);transform:scale(1);transition:.5s ease;width:5vh}";
const css$8 = {
  code: ".moving-container.svelte-dg0a67.svelte-dg0a67{-webkit-transform:scale(1);transform:scale(1);transition:.5s ease;border:dashed 1px}.moving-container.svelte-dg0a67.svelte-dg0a67:hover{-webkit-transform:scale(1.03);transform:scale(1.03);transition:.5s ease}.edition.svelte-dg0a67.svelte-dg0a67{-webkit-transform:scale(0);transform:scale(0);transition:.5s ease;width:0px}.moving-container.svelte-dg0a67:hover .edition.svelte-dg0a67{-webkit-transform:scale(1);transform:scale(1);transition:.5s ease;width:5vh}",
  map: `{"version":3,"file":"MovingContent.svelte","sources":["MovingContent.svelte"],"sourcesContent":["<script>\\nimport { recursiveFilmDelete } from \\"../actions/filmActions\\";\\n\\n    import { recursiveDeleteAction } from '../utils/imageFunctions'\\n    import AddElement from \\"./AddElement.svelte\\";\\n    \\n    export let array = [];\\n    export let position = 0;\\n    export let admin = false;\\n    export let updateMovedArray;\\n    export let addContent;\\n\\n    let addUp = false;\\n    let addDown = false;\\n\\n    const arrayMove = (arr, fromIndex, toIndex) => {\\n        var element = arr[fromIndex];\\n        arr.splice(fromIndex, 1);\\n        arr.splice(toIndex, 0, element);\\n        return arr;\\n    }\\n\\n    const upAction = () => {\\n        if (position > 0) {\\n            array = arrayMove(array, position, position - 1);\\n        }\\n        updateMovedArray(array);\\n    };\\n\\n    const downAction = () => {\\n        if (position < array.length - 1) {\\n            array = arrayMove(array, position, position + 1);\\n        }\\n        updateMovedArray(array); \\n    };\\n\\n\\n    const deleteAction = async() => {\\n\\n        // Delete any tied media (image and video)\\n        const values = array[position];\\n        await recursiveDeleteAction(values);\\n\\n        // Delete any film tied to object\\n        await recursiveFilmDelete(array[position]);\\n\\n        array.splice(position, 1);\\n        updateMovedArray(array);\\n    };\\n\\n    const addElementHandler = async(posToAdd) => {\\n        console.log('add element position: ', posToAdd);\\n    }\\n\\n<\/script>\\n\\n<style>\\n    .moving-container {\\n        -webkit-transform: scale(1);\\n\\t    transform: scale(1);\\n        transition: .5s ease;\\n        border: dashed 1px;\\n    }\\n    .moving-container:hover {\\n        -webkit-transform: scale(1.03);\\n\\t    transform: scale(1.03);\\n        transition: .5s ease;\\n    }\\n    .edition {\\n        -webkit-transform: scale(0);\\n\\t    transform: scale(0);\\n        transition: .5s ease;\\n        width: 0px;\\n    }\\n    .moving-container:hover .edition {\\n        -webkit-transform: scale(1);\\n\\t    transform: scale(1);\\n        transition: .5s ease;\\n        width: 5vh;\\n    }\\n</style>\\n\\n\\n{#if admin}\\n\\n    {#if addContent}\\n        <AddElement \\n            addContent={addContent}\\n            position={position}      \\n            bind:open={addUp}\\n            addToLayout={''}\\n        />\\n        <AddElement \\n            addContent={addContent}\\n            position={position + 1}      \\n            bind:open={addDown}\\n            addToLayout={''}\\n        />\\n    {/if}\\n\\n    <div class='moving-container border-light rounded-3 mt-3 mb-1 p-3 bg-lavande shadow-lg'>\\n        <div class='row align-items-center'>\\n            <div class=\\"col\\">\\n                <slot></slot>\\n            </div>\\n            <div class='edition text-center'>\\n                <div class=\\"d-grid gap-2\\">\\n                    {#if addContent}\\n                    <button class='btn btn-primary btn-sm' on:click={() => addUp = true}><i class=\\"bi bi-plus-circle-dotted\\"></i></button>\\n                    {/if}\\n                    <button class='btn btn-secondary btn-sm' on:click={() => upAction()}><i class='bi bi-caret-up'/></button>\\n                    <button class='btn btn-danger btn-sm' on:click={async() => await deleteAction()}><i class='bi bi-trash'/></button>\\n                    <button class='btn btn-secondary btn-sm' on:click={() => downAction()}><i class='bi bi-caret-down'/></button>\\n                    {#if addContent}\\n                    <button class='btn btn-primary btn-sm' on:click={() => addDown = true}><i class=\\"bi bi-plus-circle-dotted\\"></i></button>\\n                    {/if}\\n                </div>\\n            </div>\\n        </div>\\n    </div>\\n{:else}\\n    <span><slot></slot></span>\\n{/if}\\n"],"names":[],"mappings":"AAyDI,iBAAiB,4BAAC,CAAC,AACf,iBAAiB,CAAE,MAAM,CAAC,CAAC,CAC9B,SAAS,CAAE,MAAM,CAAC,CAAC,CAChB,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,MAAM,CAAE,MAAM,CAAC,GAAG,AACtB,CAAC,AACD,6CAAiB,MAAM,AAAC,CAAC,AACrB,iBAAiB,CAAE,MAAM,IAAI,CAAC,CACjC,SAAS,CAAE,MAAM,IAAI,CAAC,CACnB,UAAU,CAAE,GAAG,CAAC,IAAI,AACxB,CAAC,AACD,QAAQ,4BAAC,CAAC,AACN,iBAAiB,CAAE,MAAM,CAAC,CAAC,CAC9B,SAAS,CAAE,MAAM,CAAC,CAAC,CAChB,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,KAAK,CAAE,GAAG,AACd,CAAC,AACD,+BAAiB,MAAM,CAAC,QAAQ,cAAC,CAAC,AAC9B,iBAAiB,CAAE,MAAM,CAAC,CAAC,CAC9B,SAAS,CAAE,MAAM,CAAC,CAAC,CAChB,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,KAAK,CAAE,GAAG,AACd,CAAC"}`
};
const MovingContent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { array = [] } = $$props;
  let { position = 0 } = $$props;
  let { admin = false } = $$props;
  let { updateMovedArray } = $$props;
  let { addContent } = $$props;
  let addUp = false;
  let addDown = false;
  if ($$props.array === void 0 && $$bindings.array && array !== void 0)
    $$bindings.array(array);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.updateMovedArray === void 0 && $$bindings.updateMovedArray && updateMovedArray !== void 0)
    $$bindings.updateMovedArray(updateMovedArray);
  if ($$props.addContent === void 0 && $$bindings.addContent && addContent !== void 0)
    $$bindings.addContent(addContent);
  $$result.css.add(css$8);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${admin ? `${addContent ? `${validate_component(AddElement, "AddElement").$$render($$result, {
      addContent,
      position,
      addToLayout: "",
      open: addUp
    }, {
      open: ($$value) => {
        addUp = $$value;
        $$settled = false;
      }
    }, {})}
        ${validate_component(AddElement, "AddElement").$$render($$result, {
      addContent,
      position: position + 1,
      addToLayout: "",
      open: addDown
    }, {
      open: ($$value) => {
        addDown = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

    <div class="${"moving-container border-light rounded-3 mt-3 mb-1 p-3 bg-lavande shadow-lg svelte-dg0a67"}"><div class="${"row align-items-center"}"><div class="${"col"}">${slots.default ? slots.default({}) : ``}</div>
            <div class="${"edition text-center svelte-dg0a67"}"><div class="${"d-grid gap-2"}">${addContent ? `<button class="${"btn btn-primary btn-sm"}"><i class="${"bi bi-plus-circle-dotted"}"></i></button>` : ``}
                    <button class="${"btn btn-secondary btn-sm"}"><i class="${"bi bi-caret-up"}"></i></button>
                    <button class="${"btn btn-danger btn-sm"}"><i class="${"bi bi-trash"}"></i></button>
                    <button class="${"btn btn-secondary btn-sm"}"><i class="${"bi bi-caret-down"}"></i></button>
                    ${addContent ? `<button class="${"btn btn-primary btn-sm"}"><i class="${"bi bi-plus-circle-dotted"}"></i></button>` : ``}</div></div></div></div>` : `<span>${slots.default ? slots.default({}) : ``}</span>`}`;
  } while (!$$settled);
  return $$rendered;
});
const defaultDescriptionSeo = "Retrouvez toutes les informations sur le festival Projection Transition";
const defaultTitleOG = "Projection Transition - Le festival cin\xE9-d\xE9bat pour la transition \xE9cologique";
const defaultDescriptionOG = "Retrouvez toutes les informations sur le festival Projection Transition";
const SeoComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { pageContent } = $$props;
  let { page: page2 } = $$props;
  let { siteURL } = $$props;
  let { admin } = $$props;
  let { updateContent } = $$props;
  const defaultTitleSeo = `Projection Transition ${pageContent.name}`;
  if ($$props.pageContent === void 0 && $$bindings.pageContent && pageContent !== void 0)
    $$bindings.pageContent(pageContent);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.siteURL === void 0 && $$bindings.siteURL && siteURL !== void 0)
    $$bindings.siteURL(siteURL);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  return `${$$result.head += `${$$result.title = `<title>${escape$4(`${pageContent && pageContent.titleSeo ? pageContent.titleSeo : defaultTitleSeo}`)}</title>`, ""}<meta name="${"description"}"${add_attribute("content", `${pageContent && pageContent.descriptionSeo ? pageContent.descriptionSeo : defaultDescriptionSeo}`, 0)} data-svelte="svelte-12notnu"><meta property="${"og:title"}"${add_attribute("content", `${pageContent && pageContent.titleOG ? pageContent.titleOG : defaultTitleOG}`, 0)} data-svelte="svelte-12notnu"><meta property="${"og:description"}"${add_attribute("content", `${pageContent && pageContent.descriptionOG ? pageContent.descriptionOG : defaultDescriptionOG}`, 0)} data-svelte="svelte-12notnu"><meta property="${"og:type"}" content="${"website"}" data-svelte="svelte-12notnu"><meta property="${"og:image"}"${add_attribute("content", `${siteURL}/images/og_logo.jpg`, 0)} data-svelte="svelte-12notnu"><meta property="${"og:image:width"}" content="${"800"}" data-svelte="svelte-12notnu"><meta property="${"og:image:height"}" content="${"400"}" data-svelte="svelte-12notnu"><meta property="${"og:url"}"${add_attribute("content", `${siteURL}${page2.path}`, 0)} data-svelte="svelte-12notnu"><meta property="${"og:locale"}" content="${"fr_FR"}" data-svelte="svelte-12notnu"><meta name="${"twitter:image"}"${add_attribute("content", `${siteURL}/images/og_logo.jpg`, 0)} data-svelte="svelte-12notnu"><meta name="${"twitter:card"}" content="${"summary_large_image"}" data-svelte="svelte-12notnu"><meta name="${"twitter:description"}"${add_attribute("content", `${pageContent && pageContent.descriptionOG ? pageContent.descriptionOG : defaultDescriptionOG}`, 0)} data-svelte="svelte-12notnu">`, ""}

${validate_component(CustomContainer, "CustomContainer").$$render($$result, { size: { xs: 12, sm: 8, md: 8, lg: 8 } }, {}, {
    default: () => `${admin && pageContent.content.length ? `<label for="${"seo-title"}" class="${"mt-5"}">Balise &quot;title&quot; pour le SEO</label>
        <input id="${"seo-title"}" class="${"form-control"}" type="${"text"}" aria-describedby="${"seo-title-helper"}" placeholder="${"Entrer le titre de la page (important pour le SEO)"}"${add_attribute("value", pageContent.titleSeo, 0)}>
        <div id="${"seo-title-helper"}" class="${"form-text"}">Tr\xE8s important pour le SEO. 
            Synth\xE8se du contenu de la page. 
            Structure unique sur l&#39;ensemble du site. 
            Chaque page a son propre titre (unique).
            Ne pas d\xE9passer 60 \xE0 80 caract\xE8res.
            Ne pas bourrer le mots cl\xE9s.
        </div>
        
        <label for="${"seo-description"}" class="${"mt-3"}">Balise &quot;description&quot; pour le SEO</label>
        <input id="${"seo-description"}" class="${"form-control"}" type="${"text"}" aria-describedby="${"seo-description-helper"}" placeholder="${"Entrer la description de la page"}"${add_attribute("value", pageContent.descriptionSeo, 0)}>
        <div id="${"seo-description-helper"}" class="${"form-text"}">Pas importante pour le SEO. Mais importante dans l&#39;affichage du r\xE9sultat de la recherche.
            Le contenu de cette balise peut se retrouver juste sous le titre de la page dans le r\xE9sultat de la recherche.
            Ce n&#39;est pas obligatoire, parfois le moteur de recherche pr\xE9f\xE9rera afficher une partie du contenu de la page. 
            Soigner le contenu (des phrases). Mettre les mots cl\xE9s de la page dans ces phrases.
            Eviter de d\xE9passer 160 caract\xE8res.
            Avoir une description unique pour chacune des pages.
        </div>

        <label for="${"og-titre"}" class="${"mt-3"}">Titre (Open Graph) : vignette lorsque vous partagez la page sur les r\xE9seaux sociaux</label>
        <input id="${"og-titre"}" class="${"form-control"}" type="${"text"}" aria-describedby="${"og-titre-helper"}" placeholder="${"Titre de la vignette sur les r\xE9seaux sociaux"}"${add_attribute("value", pageContent.titleOG, 0)}>
        <div id="${"og-titre-helper"}" class="${"form-text"}">Pas d&#39;impact sur le SEO.
            Lorsqu&#39;un utilisateur partagera le lien de cette page sur les r\xE9seaux sociaux, une vignette s&#39;affichera avec en titre le contenu que vous aurez renseign\xE9.
        </div>

        <label for="${"og-description"}" class="${"mt-3"}">Description (Open Graph) : vignette lorsque vous partagez la page sur les r\xE9seaux sociaux</label>
        <input id="${"og-description"}" class="${"form-control"}" type="${"text"}" aria-describedby="${"og-description-helper"}" placeholder="${"Description de la vignette sur les r\xE9seaux sociaux"}"${add_attribute("value", pageContent.descriptionOG, 0)}>
        <div id="${"og-description-helper"}" class="${"form-text"}">Pas d&#39;impact sur le SEO.
            Lorsqu&#39;un utilisateur partagera le lien de cette page sur les r\xE9seaux sociaux, une vignette s&#39;affichera avec en description le contenu que vous aurez renseign\xE9.
        </div>` : ``}`
  })}`;
});
var _id__svelte_svelte_type_style_lang = ".book.svelte-1gb281t:hover{-webkit-transform:scale(1.13);transform:scale(1.13);transition:.5s ease}.book.svelte-1gb281t{-webkit-transform:scale(1);transform:scale(1);transition:.5s ease}";
const css$7 = {
  code: ".book.svelte-1gb281t:hover{-webkit-transform:scale(1.13);transform:scale(1.13);transition:.5s ease}.book.svelte-1gb281t{-webkit-transform:scale(1);transform:scale(1);transition:.5s ease}",
  map: `{"version":3,"file":"[id].svelte","sources":["[id].svelte"],"sourcesContent":["<script context='module'>\\n\\n    import { getFilm } from '../../actions/filmActions';\\n    \\n    export const prerender = true;\\n\\n    export async function load({page, fetch, session, context}){\\n\\n        //verify if login\\n        let redirection = page.path.split('/login');\\n\\n        let filmRequest = {film:null, loading:true, message:''}\\n        const id = page.params.id ? page.params.id : null;\\n        \\n        filmRequest = await getFilm(id);\\n\\n        //console.log(page)\\n\\n        return {status:200, props: {filmRequest, id, redirection, page}};\\n    }\\n\\n<\/script>\\n\\n<script>\\n    \\n    import { updateFilmRequest } from '../../actions/filmActions';\\n    import AdminButton from '../../components/AdminButton.svelte';\\n    import ImageComponent from '../../components/ImageComponent.svelte';\\n    import Message from '../../components/Message.svelte';\\n    import Loading from '../../components/Loading.svelte';\\n    import CustomContainer from '../../components/CustomContainer.svelte';\\n    import TextComponent from '../../components/TextComponent.svelte';\\n    import MovingContent from '../../components/MovingContent.svelte';\\n\\n    import { userInfo, filmUpdateRequest } from '../../store';\\n    import { goto } from '$app/navigation';\\n    import { onMount } from 'svelte';\\n\\n    import config from '../../config.json';\\n    import SeoComponent from '../../components/SeoComponent.svelte';\\n    const SITE_URL = config.SVELTE_ENV === 'dev' ? config.SITE_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.SITE_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.SITE_URL_PROD : config.SITE_URL_DEV;\\n    \\n    export let filmRequest;\\n    export let id;\\n    export let redirection;\\n    export let page;\\n    \\n    // redirect to login page if requested\\n    onMount(() => {\\n        if (redirection.length > 1) {\\n            goto(\`/login?redirection=\${redirection[0]}\`);\\n        }\\n    });\\n\\n    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;\\n\\n\\n    let admin = false;\\n    let edit = false;\\n\\n    const updateFilm = async () => {\\n        await updateFilmRequest(id, filmRequest.film);\\n    };\\n\\n    const addActionHandler = () => {\\n        const tempFilmRequest = filmRequest;\\n        tempFilmRequest.film.actions = [ ...tempFilmRequest.film.actions, {\\n            heure: {values:[], styles:[]},\\n            titre: {values:[], styles:[]},\\n            description: {values:[], styles:[]},\\n            complement:{values:[], styles:[]}\\n        }];\\n        filmRequest = tempFilmRequest;\\n        updateFilm();\\n    };\\n\\n    const updateMovedArray = (array) => {\\n        const tempFilmRequest = filmRequest;\\n        tempFilmRequest.film.actions = array;\\n        //filmRequest.set(tempFilmRequest);\\n        filmRequest = tempFilmRequest;\\n        updateFilm();\\n    };\\n\\n    const bookAvailableHandler = (e) => {\\n        filmRequest.film.bookingAvailable = e.target.checked;\\n        updateFilm();\\n    };\\n\\n<\/script>\\n\\n{#if filmRequest.message}\\n    <Message color='warning'>{filmRequest.message}</Message>\\n{/if}\\n\\n{#if filmRequest.film}\\n\\n    {#if isAuthenticate}\\n        <AdminButton\\n            bind:admin={admin}\\n            isAuthenticate={isAuthenticate}\\n        />\\n\\n        {#if filmRequest.message}\\n            <Message color='warning'>{filmRequest.message}</Message>\\n        {/if}\\n        \\n        {#if filmRequest.loading}\\n            <Loading color='secondary' number={3} />\\n        {/if}\\n\\n        {#if $filmUpdateRequest.message}\\n            <Message color={$filmUpdateRequest.success ? 'success' : 'error'}>{$filmUpdateRequest.message}</Message>\\n        {/if}\\n\\n        {#if $filmUpdateRequest.loading}\\n            <Loading color='secondary' number={3} />\\n        {/if}\\n\\n    {/if}\\n\\n    {#if filmRequest.film}\\n        <CustomContainer size={{xs: 12, sm:12, md:12, lg:12}}>\\n            <div class='row mt-5'>\\n                <!-- contents for conference -->\\n                <div class='col-sm-12 col-md-5'>\\n                    <div class='row align-items-center'>\\n                        <div class='col-2'>\\n                        </div>\\n                        <div class='col-10'>\\n                            <h3 class='mb-3'><span class='text-white bg-primary'>PROGRAMME</span></h3>\\n                            <TextComponent\\n                                bind:values={filmRequest.film.infosGenerales.values}\\n                                bind:styles={filmRequest.film.infosGenerales.styles}\\n                                admin={admin}\\n                                edit={edit}\\n                                updateContent={updateFilm}\\n                            />\\n                        </div>\\n                    </div>\\n                    {#each filmRequest.film.actions as action, position}\\n                        <MovingContent\\n                            array={filmRequest.film.actions} \\n                            position={position} \\n                            admin={admin} \\n                            updateMovedArray={updateMovedArray}\\n                        >\\n                        <div class='row mt-3'>\\n                            <div class='col-2'>\\n                                <div class='text-center'>\\n                                    <TextComponent\\n                                        bind:values={action.heure.values}\\n                                        bind:styles={action.heure.styles}\\n                                        admin={admin}\\n                                        edit={edit}\\n                                        updateContent={updateFilm}\\n                                    />\\n                                </div>\\n                            </div>\\n                            <div class='col-10'>\\n                                <!-- <div class='row'>\\n                                    <div class='col-sm-12 col-md-8'> -->\\n                                        <TextComponent\\n                                            bind:values={action.titre.values}\\n                                            bind:styles={action.titre.styles}\\n                                            admin={admin}\\n                                            edit={edit}\\n                                            updateContent={updateFilm}\\n                                        />\\n                                        <TextComponent\\n                                            bind:values={action.description.values}\\n                                            bind:styles={action.description.styles}\\n                                            admin={admin}\\n                                            edit={edit}\\n                                            updateContent={updateFilm}\\n                                        />\\n                                        <TextComponent\\n                                            bind:values={action.complement.values}\\n                                            bind:styles={action.complement.styles}\\n                                            admin={admin}\\n                                            edit={edit}\\n                                            updateContent={updateFilm}\\n                                        />\\n                                    <!-- </div> -->\\n                                    <!-- <div class='col-sm-12 col-md-4'>\\n                                    </div> -->\\n                                <!-- </div> -->\\n                            </div>\\n                        </div>\\n                        </MovingContent>\\n                    {/each}\\n                    {#if admin}\\n                        <button class='btn btn-primary text-center' on:click={addActionHandler}>Add an action</button>\\n                    {/if}\\n                </div>\\n\\n                <!-- content for film -->\\n                <div class='col-sm-12 col-md-7'>\\n                    <div class='row'>\\n                        <div class='col-sm-12 col-md-6 text-center mt-5'>\\n                            <ImageComponent\\n                                bind:values={filmRequest.film.url.values}\\n                                bind:styles={filmRequest.film.url.styles}\\n                                admin={admin}\\n                                edit={edit}\\n                                updateContent={updateFilm}\\n                            />\\n                        </div>\\n                        <div class='col-sm-12 col-md-6 mt-5'>\\n                            <div class='row'>\\n                                <div class='col'>\\n                                    <TextComponent\\n                                        bind:values={filmRequest.film.title.values}\\n                                        bind:styles={filmRequest.film.title.styles}\\n                                        admin={admin}\\n                                        edit={edit}\\n                                        updateContent={updateFilm}\\n                                    />\\n                                    <div class='ligne-titre border-top border-5 border-primary' style=\\"max-width: 10vh;\\"></div>\\n                                </div>\\n                            </div>\\n                            <div class='row mt-3'>\\n                                <div class='col-4 border-end border-primary my-auto'>\\n                                    <strong>R\xE9alisation</strong>\\n                                </div>\\n                                <div class='col-8'>\\n                                    <TextComponent\\n                                        bind:values={filmRequest.film.real.values}\\n                                        bind:styles={filmRequest.film.real.styles}\\n                                        admin={admin}\\n                                        edit={edit}\\n                                        updateContent={updateFilm}\\n                                    />\\n                                </div>\\n                            </div>\\n                            <div class='row mt-3'>\\n                                <TextComponent\\n                                    bind:values={filmRequest.film.summury.values}\\n                                    bind:styles={filmRequest.film.summury.styles}\\n                                    admin={admin}\\n                                    edit={edit}\\n                                    updateContent={updateFilm}\\n                                />\\n                            </div>\\n                        </div>\\n                    </div>\\n                </div>\\n            </div>\\n            <div class='row mt-3'>\\n                <div class='col text-center'>\\n\\n                    {#if filmRequest.film.bookingAvailable}\\n                        <a class='book-link text-primary' href={filmRequest.film.book} target=\\"_blank\\" >\\n                            <button \\n                                class=\\"book btn btn-light border border-primary text-wrap text-break text-center text-primary bg-transparent\\"\\n                            >RESERVER MA PLACE</button>\\n                        </a>\\n                    {:else}\\n                        <button \\n                            type='button'\\n                            class=\\"btn btn-light border border-primary text-wrap text-break text-center text-primary bg-transparent\\"\\n                            data-bs-toggle=\\"tooltip\\" \\n                            data-bs-placement=\\"right\\" \\n                            title={filmRequest.film.justification}\\n                        >R\xE9servation non disponible</button>\\n                    {/if}\\n                    {#if admin}\\n                        <div class=\\"text-start\\">\\n                            <CustomContainer size={{ xs: 12, sm:4, md:4, lg:4 }}>\\n                            <label for=\\"book-url\\" class='mt-3'>Adresse de r\xE9servation</label>\\n                            <input id='book-url' class='form-control' placeholder=\\"https://acheter-ma-place\\" bind:value={filmRequest.film.book} on:change={updateFilm} />\\n                            <div class=\\"form-check form-switch mt-3\\">\\n                                <input class=\\"form-check-input\\" type=\\"checkbox\\" id=\\"flexSwitchCheckDefault\\" checked={filmRequest.film.bookingAvailable} on:change={bookAvailableHandler}>\\n                                <label class=\\"form-check-label\\" for=\\"flexSwitchCheckDefault\\">Disponible \xE0 la vente</label>\\n                            </div>\\n                            {#if !filmRequest.film.bookingAvailable}\\n                                <label for=\\"book-availability\\">Raison de la non disponibilit\xE9</label>\\n                                <textarea \\n                                    class='form-control'\\n                                    id=\\"book-availability\\"\\n                                    placeholder=\\"Raison de la non disponibilit\xE9 (Billetterie non ouverte, Tous les tickets sont vendus..)\\"\\n                                    bind:value={filmRequest.film.justification}\\n                                    on:change={updateFilm}\\n                                />  \\n                            {/if}\\n                            </CustomContainer>\\n                        </div>\\n                    {/if}\\n                </div>\\n            </div>\\n            <div class='row mt-5'>\\n                <div class='col text-center'>\\n                    <button class='btn btn-white border border-white' on:click={() => goto(\`/programmation/\${filmRequest.film.location}\`)}>\\n                        <i class=\\"bi bi-box-arrow-in-left\\"></i>\\n                        Retour \xE0 la programmation\\n                    </button>\\n                </div>\\n            </div>\\n\\n            <SeoComponent\\n                pageContent={filmRequest.film}\\n                page={page}\\n                siteURL={SITE_URL}\\n                admin={admin}\\n                updateContent={updateFilm}\\n            />\\n\\n        </CustomContainer>\\n    {/if}\\n{/if}\\n\\n<style>\\n    .book:hover {\\n        -webkit-transform: scale(1.13);\\n\\t    transform: scale(1.13);\\n        transition: .5s ease;\\n    }\\n    .book {\\n        -webkit-transform: scale(1);\\n\\t    transform: scale(1);\\n        transition: .5s ease;\\n    }\\n</style>"],"names":[],"mappings":"AAwTI,oBAAK,MAAM,AAAC,CAAC,AACT,iBAAiB,CAAE,MAAM,IAAI,CAAC,CACjC,SAAS,CAAE,MAAM,IAAI,CAAC,CACnB,UAAU,CAAE,GAAG,CAAC,IAAI,AACxB,CAAC,AACD,KAAK,eAAC,CAAC,AACH,iBAAiB,CAAE,MAAM,CAAC,CAAC,CAC9B,SAAS,CAAE,MAAM,CAAC,CAAC,CAChB,UAAU,CAAE,GAAG,CAAC,IAAI,AACxB,CAAC"}`
};
const prerender$1 = true;
async function load$1({ page: page2, fetch: fetch2, session, context }) {
  let redirection = page2.path.split("/login");
  let filmRequest2 = { film: null, loading: true, message: "" };
  const id = page2.params.id ? page2.params.id : null;
  filmRequest2 = await getFilm(id);
  return {
    status: 200,
    props: { filmRequest: filmRequest2, id, redirection, page: page2 }
  };
}
let edit = false;
const U5Bidu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isAuthenticate;
  let $userInfo, $$unsubscribe_userInfo;
  let $filmUpdateRequest, $$unsubscribe_filmUpdateRequest;
  $$unsubscribe_userInfo = subscribe(userInfo, (value) => $userInfo = value);
  $$unsubscribe_filmUpdateRequest = subscribe(filmUpdateRequest, (value) => $filmUpdateRequest = value);
  const SITE_URL = config.SITE_URL_DEV;
  let { filmRequest: filmRequest2 } = $$props;
  let { id } = $$props;
  let { redirection } = $$props;
  let { page: page2 } = $$props;
  let admin = false;
  const updateFilm = async () => {
    await updateFilmRequest(id, filmRequest2.film);
  };
  const updateMovedArray = (array) => {
    const tempFilmRequest = filmRequest2;
    tempFilmRequest.film.actions = array;
    filmRequest2 = tempFilmRequest;
    updateFilm();
  };
  if ($$props.filmRequest === void 0 && $$bindings.filmRequest && filmRequest2 !== void 0)
    $$bindings.filmRequest(filmRequest2);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.redirection === void 0 && $$bindings.redirection && redirection !== void 0)
    $$bindings.redirection(redirection);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  $$result.css.add(css$7);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    isAuthenticate = $userInfo && $userInfo.profil === "admin" ? true : false;
    $$rendered = `${filmRequest2.message ? `${validate_component(Message, "Message").$$render($$result, { color: "warning" }, {}, {
      default: () => `${escape$4(filmRequest2.message)}`
    })}` : ``}

${filmRequest2.film ? `${isAuthenticate ? `${validate_component(AdminButton, "AdminButton").$$render($$result, { isAuthenticate, admin }, {
      admin: ($$value) => {
        admin = $$value;
        $$settled = false;
      }
    }, {})}

        ${filmRequest2.message ? `${validate_component(Message, "Message").$$render($$result, { color: "warning" }, {}, {
      default: () => `${escape$4(filmRequest2.message)}`
    })}` : ``}
        
        ${filmRequest2.loading ? `${validate_component(Loading, "Loading").$$render($$result, { color: "secondary", number: 3 }, {}, {})}` : ``}

        ${$filmUpdateRequest.message ? `${validate_component(Message, "Message").$$render($$result, {
      color: $filmUpdateRequest.success ? "success" : "error"
    }, {}, {
      default: () => `${escape$4($filmUpdateRequest.message)}`
    })}` : ``}

        ${$filmUpdateRequest.loading ? `${validate_component(Loading, "Loading").$$render($$result, { color: "secondary", number: 3 }, {}, {})}` : ``}` : ``}

    ${filmRequest2.film ? `${validate_component(CustomContainer, "CustomContainer").$$render($$result, { size: { xs: 12, sm: 12, md: 12, lg: 12 } }, {}, {
      default: () => `<div class="${"row mt-5"}">
                <div class="${"col-sm-12 col-md-5"}"><div class="${"row align-items-center"}"><div class="${"col-2"}"></div>
                        <div class="${"col-10"}"><h3 class="${"mb-3"}"><span class="${"text-white bg-primary"}">PROGRAMME</span></h3>
                            ${validate_component(TextComponent, "TextComponent").$$render($$result, {
        admin,
        edit,
        updateContent: updateFilm,
        values: filmRequest2.film.infosGenerales.values,
        styles: filmRequest2.film.infosGenerales.styles
      }, {
        values: ($$value) => {
          filmRequest2.film.infosGenerales.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          filmRequest2.film.infosGenerales.styles = $$value;
          $$settled = false;
        }
      }, {})}</div></div>
                    ${each(filmRequest2.film.actions, (action, position) => `${validate_component(MovingContent, "MovingContent").$$render($$result, {
        array: filmRequest2.film.actions,
        position,
        admin,
        updateMovedArray
      }, {}, {
        default: () => `<div class="${"row mt-3"}"><div class="${"col-2"}"><div class="${"text-center"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
          admin,
          edit,
          updateContent: updateFilm,
          values: action.heure.values,
          styles: action.heure.styles
        }, {
          values: ($$value) => {
            action.heure.values = $$value;
            $$settled = false;
          },
          styles: ($$value) => {
            action.heure.styles = $$value;
            $$settled = false;
          }
        }, {})}
                                </div></div>
                            <div class="${"col-10"}">
                                        ${validate_component(TextComponent, "TextComponent").$$render($$result, {
          admin,
          edit,
          updateContent: updateFilm,
          values: action.titre.values,
          styles: action.titre.styles
        }, {
          values: ($$value) => {
            action.titre.values = $$value;
            $$settled = false;
          },
          styles: ($$value) => {
            action.titre.styles = $$value;
            $$settled = false;
          }
        }, {})}
                                        ${validate_component(TextComponent, "TextComponent").$$render($$result, {
          admin,
          edit,
          updateContent: updateFilm,
          values: action.description.values,
          styles: action.description.styles
        }, {
          values: ($$value) => {
            action.description.values = $$value;
            $$settled = false;
          },
          styles: ($$value) => {
            action.description.styles = $$value;
            $$settled = false;
          }
        }, {})}
                                        ${validate_component(TextComponent, "TextComponent").$$render($$result, {
          admin,
          edit,
          updateContent: updateFilm,
          values: action.complement.values,
          styles: action.complement.styles
        }, {
          values: ($$value) => {
            action.complement.values = $$value;
            $$settled = false;
          },
          styles: ($$value) => {
            action.complement.styles = $$value;
            $$settled = false;
          }
        }, {})}
                                    
                                    
                                
                            </div></div>
                        `
      })}`)}
                    ${admin ? `<button class="${"btn btn-primary text-center"}">Add an action</button>` : ``}</div>

                
                <div class="${"col-sm-12 col-md-7"}"><div class="${"row"}"><div class="${"col-sm-12 col-md-6 text-center mt-5"}">${validate_component(ImageComponent, "ImageComponent").$$render($$result, {
        admin,
        edit,
        updateContent: updateFilm,
        values: filmRequest2.film.url.values,
        styles: filmRequest2.film.url.styles
      }, {
        values: ($$value) => {
          filmRequest2.film.url.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          filmRequest2.film.url.styles = $$value;
          $$settled = false;
        }
      }, {})}</div>
                        <div class="${"col-sm-12 col-md-6 mt-5"}"><div class="${"row"}"><div class="${"col"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
        admin,
        edit,
        updateContent: updateFilm,
        values: filmRequest2.film.title.values,
        styles: filmRequest2.film.title.styles
      }, {
        values: ($$value) => {
          filmRequest2.film.title.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          filmRequest2.film.title.styles = $$value;
          $$settled = false;
        }
      }, {})}
                                    <div class="${"ligne-titre border-top border-5 border-primary"}" style="${"max-width: 10vh;"}"></div></div></div>
                            <div class="${"row mt-3"}"><div class="${"col-4 border-end border-primary my-auto"}"><strong>R\xE9alisation</strong></div>
                                <div class="${"col-8"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
        admin,
        edit,
        updateContent: updateFilm,
        values: filmRequest2.film.real.values,
        styles: filmRequest2.film.real.styles
      }, {
        values: ($$value) => {
          filmRequest2.film.real.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          filmRequest2.film.real.styles = $$value;
          $$settled = false;
        }
      }, {})}</div></div>
                            <div class="${"row mt-3"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
        admin,
        edit,
        updateContent: updateFilm,
        values: filmRequest2.film.summury.values,
        styles: filmRequest2.film.summury.styles
      }, {
        values: ($$value) => {
          filmRequest2.film.summury.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          filmRequest2.film.summury.styles = $$value;
          $$settled = false;
        }
      }, {})}</div></div></div></div></div>
            <div class="${"row mt-3"}"><div class="${"col text-center"}">${filmRequest2.film.bookingAvailable ? `<a class="${"book-link text-primary"}"${add_attribute("href", filmRequest2.film.book, 0)} target="${"_blank"}"><button class="${"book btn btn-light border border-primary text-wrap text-break text-center text-primary bg-transparent svelte-1gb281t"}">RESERVER MA PLACE</button></a>` : `<button type="${"button"}" class="${"btn btn-light border border-primary text-wrap text-break text-center text-primary bg-transparent"}" data-bs-toggle="${"tooltip"}" data-bs-placement="${"right"}"${add_attribute("title", filmRequest2.film.justification, 0)}>R\xE9servation non disponible</button>`}
                    ${admin ? `<div class="${"text-start"}">${validate_component(CustomContainer, "CustomContainer").$$render($$result, { size: { xs: 12, sm: 4, md: 4, lg: 4 } }, {}, {
        default: () => `<label for="${"book-url"}" class="${"mt-3"}">Adresse de r\xE9servation</label>
                            <input id="${"book-url"}" class="${"form-control"}" placeholder="${"https://acheter-ma-place"}"${add_attribute("value", filmRequest2.film.book, 0)}>
                            <div class="${"form-check form-switch mt-3"}"><input class="${"form-check-input"}" type="${"checkbox"}" id="${"flexSwitchCheckDefault"}" ${filmRequest2.film.bookingAvailable ? "checked" : ""}>
                                <label class="${"form-check-label"}" for="${"flexSwitchCheckDefault"}">Disponible \xE0 la vente</label></div>
                            ${!filmRequest2.film.bookingAvailable ? `<label for="${"book-availability"}">Raison de la non disponibilit\xE9</label>
                                <textarea class="${"form-control"}" id="${"book-availability"}" placeholder="${"Raison de la non disponibilit\xE9 (Billetterie non ouverte, Tous les tickets sont vendus..)"}">${filmRequest2.film.justification || ""}</textarea>` : ``}`
      })}</div>` : ``}</div></div>
            <div class="${"row mt-5"}"><div class="${"col text-center"}"><button class="${"btn btn-white border border-white"}"><i class="${"bi bi-box-arrow-in-left"}"></i>
                        Retour \xE0 la programmation
                    </button></div></div>

            ${validate_component(SeoComponent, "SeoComponent").$$render($$result, {
        pageContent: filmRequest2.film,
        page: page2,
        siteURL: SITE_URL,
        admin,
        updateContent: updateFilm
      }, {}, {})}`
    })}` : ``}` : ``}`;
  } while (!$$settled);
  $$unsubscribe_userInfo();
  $$unsubscribe_filmUpdateRequest();
  return $$rendered;
});
var _id_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bidu5D,
  prerender: prerender$1,
  load: load$1
});
const API_URL = config.API_URL_DEV;
const updateOrCreateContent = async (content) => {
  const userInfoStored = get_store_value(userInfo);
  const currentPageRequest = get_store_value(pageRequest);
  pageRequest.set({ ...currentPageRequest, loading: true, message: "" });
  try {
    const config2 = {
      headers: {
        "Content-type": "Application/json",
        Authorization: `Bearer ${userInfoStored.token}`
      }
    };
    const { data } = await axios.post(`${API_URL}/api/page/${content.name}`, content, config2);
    pageRequest.set({ content: data.value, loading: false, message: "" });
    return { content: data.value, loading: false, message: "" };
  } catch (error2) {
    pageRequest.set({ ...currentPageRequest, loading: false, message: "Error updating page " + error2 });
    return { ...currentPageRequest, loading: false, message: "Error updating page " + error2 };
  }
};
const getContent = async (pageName) => {
  try {
    pageRequest.set({ content: { content: [], name: pageName }, loading: true, message: "" });
    const config2 = {
      headers: {
        "Content-type": "application/json"
      }
    };
    const { data } = await axios.get(`${API_URL}/api/page/${pageName}`, config2);
    pageRequest.set({ content: data.value, loading: false, message: "" });
    return { content: data.value, loading: false, message: "" };
  } catch (error2) {
    pageRequest.set({ content: { content: [], name: pageName }, loading: false, message: "Error loading page " + pageName + " " + error2 });
    return { content: { content: [], name: pageName }, loading: false, message: "Error loading page " + pageName + " " + error2 };
  }
};
const AddContent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { admin = false } = $$props;
  let { addContent = null } = $$props;
  let { position = 0 } = $$props;
  let { addToLayout = null } = $$props;
  let open = false;
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.addContent === void 0 && $$bindings.addContent && addContent !== void 0)
    $$bindings.addContent(addContent);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  if ($$props.addToLayout === void 0 && $$bindings.addToLayout && addToLayout !== void 0)
    $$bindings.addToLayout(addToLayout);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(AddElement, "AddElement").$$render($$result, { addContent, position, addToLayout, open }, {
      open: ($$value) => {
        open = $$value;
        $$settled = false;
      }
    }, {})}

${validate_component(Row, "Row").$$render($$result, { class: "my-3 pt-3" }, {}, {
      default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
        default: () => `${validate_component(Button, "Button").$$render($$result, { color: "primary", class: "my-3 p-3" }, {}, { default: () => `Ajouter un contenu` })}

    `
      })}`
    })}`;
  } while (!$$settled);
  return $$rendered;
});
const TestComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let textAlign;
  let { values = [] } = $$props;
  let { styles = [] } = $$props;
  let { admin = "false" } = $$props;
  let { edit: edit2 = "false" } = $$props;
  let { updateContent } = $$props;
  const toggle = () => {
    if (edit2 && updateContent) {
      updateContent();
    }
    edit2 = !edit2;
  };
  if (values.length === 0) {
    values.push({ type: "text", value: "" });
    values.push({
      type: "textComponent",
      values: [],
      styles: []
    });
  }
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.styles === void 0 && $$bindings.styles && styles !== void 0)
    $$bindings.styles(styles);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.edit === void 0 && $$bindings.edit && edit2 !== void 0)
    $$bindings.edit(edit2);
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    textAlign = styles.filter((x) => x.name === "text-align")[0] && styles.filter((x) => x.name === "text-align")[0].value;
    $$rendered = `${admin ? `${validate_component(EditButton, "EditButton").$$render($$result, { admin, updateContent, edit: edit2 }, {
      edit: ($$value) => {
        edit2 = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

${validate_component(Row, "Row").$$render($$result, {}, {}, {
      default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
        default: () => `${validate_component(Modal, "Modal").$$render($$result, { isOpen: edit2, toggle }, {}, {
          default: () => `${validate_component(ModalHeader, "ModalHeader").$$render($$result, { toggle }, {}, {
            default: () => `Editer le contenu de la Card`
          })}
            ${validate_component(ModalBody, "ModalBody").$$render($$result, {}, {}, {
            default: () => `${validate_component(Row, "Row").$$render($$result, {}, {}, {
              default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
                default: () => `${validate_component(Input, "Input").$$render($$result, {
                  type: "textarea",
                  name: "textarea",
                  id: "input-textarea",
                  class: "my-3",
                  value: values[0].value
                }, {
                  value: ($$value) => {
                    values[0].value = $$value;
                    $$settled = false;
                  }
                }, {})}
                    ${validate_component(Button, "Button").$$render($$result, {}, {}, {
                  default: () => `${validate_component(Icon, "Icon").$$render($$result, { name: "text-left" }, {}, {})}`
                })}
                    ${validate_component(Button, "Button").$$render($$result, {}, {}, {
                  default: () => `${validate_component(Icon, "Icon").$$render($$result, { name: "text-center" }, {}, {})}`
                })}
                    ${validate_component(Button, "Button").$$render($$result, {}, {}, {
                  default: () => `${validate_component(Icon, "Icon").$$render($$result, { name: "text-right" }, {}, {})}`
                })}
                    <p class="${"my-3"}"><strong>Pr\xE9visualisation</strong></p>

                    ${validate_component(Row, "Row").$$render($$result, { class: `${textAlign}` }, {}, {
                  default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
                    default: () => `${validate_component(SvelteMarkdown, "SvelteMarkdown").$$render($$result, {
                      source: values[0] && values[0].value ? values[0].value : ""
                    }, {}, {})}`
                  })}`
                })}`
              })}`
            })}`
          })}
      
            ${validate_component(ModalFooter, "ModalFooter").$$render($$result, {}, {}, {
            default: () => `${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, { default: () => `Enregistrer` })}
              ${validate_component(Button, "Button").$$render($$result, { color: "secondary" }, {}, { default: () => `Cancel` })}`
          })}`
        })}
        
        ${validate_component(Row, "Row").$$render($$result, { class: `${textAlign}` }, {}, {
          default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
            default: () => `${validate_component(SvelteMarkdown, "SvelteMarkdown").$$render($$result, {
              source: values[0] && values[0].value ? values[0].value : ""
            }, {}, {})}`
          })}`
        })}

        ${validate_component(Row, "Row").$$render($$result, {}, {}, {
          default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
            default: () => `${validate_component(TextComponent, "TextComponent").$$render($$result, {
              updateContent,
              admin,
              edit: false,
              values: values[1].values,
              styles: values[1].styles
            }, {
              values: ($$value) => {
                values[1].values = $$value;
                $$settled = false;
              },
              styles: ($$value) => {
                values[1].styles = $$value;
                $$settled = false;
              }
            }, {})}`
          })}`
        })}`
      })}`
    })}`;
  } while (!$$settled);
  return $$rendered;
});
var CarouselComponent_svelte_svelte_type_style_lang = ".content-container.svelte-14apyyo.svelte-14apyyo{position:relative}.content.svelte-14apyyo.svelte-14apyyo{transition:.5s ease;opacity:1;width:100%;height:100%;backface-visibility:hidden}.middle.svelte-14apyyo.svelte-14apyyo{transition:.5s ease;opacity:0.5;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);text-align:center}.content-container.svelte-14apyyo:hover .middle.svelte-14apyyo{opacity:1}";
const css$6 = {
  code: ".content-container.svelte-14apyyo.svelte-14apyyo{position:relative}.content.svelte-14apyyo.svelte-14apyyo{transition:.5s ease;opacity:1;width:100%;height:100%;backface-visibility:hidden}.middle.svelte-14apyyo.svelte-14apyyo{transition:.5s ease;opacity:0.5;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);text-align:center}.content-container.svelte-14apyyo:hover .middle.svelte-14apyyo{opacity:1}",
  map: `{"version":3,"file":"CarouselComponent.svelte","sources":["CarouselComponent.svelte"],"sourcesContent":["<script>\\nimport { Button, Carousel, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem, Col, Image, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, NavItem, Row } from \\"sveltestrap\\";\\nimport { deleteImage } from \\"../actions/imagesActions\\";\\nimport EditButton from \\"./EditButton.svelte\\";\\nimport ImageComponent from \\"./ImageComponent.svelte\\";\\n\\n    export let values=[];\\n    export let styles=[];\\n    export let admin='false';\\n    export let edit='false';\\n    export let updateContent;\\n\\n    styles\\n\\n    let activeIndex = 0;\\n\\n    $:{\\n        if (values.length === 0) {\\n            // do something\\n            values.push({title: '', subTitle: '', component: {values: [], styles: []}});\\n        }\\n    }\\n    $:{\\n        if (values.length && !values[0].component) {\\n            values[0].component = {values: [], styles: []};\\n        }\\n    }\\n\\n    const addAnItem = () => {\\n        values = [ ...values, {\\n            title: '',\\n            subTitle: '',\\n            component: {values: [], styles: []}\\n        }];\\n    };\\n\\n    const removeAnItem = async (index) => {\\n        // delete Image in database\\n        const imageToDelete = values[index].component.values[0] && values[index].component.values[0].url;\\n        \\n        if (imageToDelete && imageToDelete.length) {\\n            await deleteImage(values[index].component.values[0].url);\\n        }\\n\\n        values.splice(index,1);\\n        values = values;\\n    };\\n\\n<\/script>\\n\\n<style>\\n    .content-container{\\n        position: relative;\\n    }\\n    .content {\\n        transition: .5s ease;\\n        opacity: 1;\\n        width: 100%;\\n        height: 100%;\\n        backface-visibility: hidden;\\n    }\\n    .middle {\\n        transition: .5s ease;\\n        opacity: 0.5;\\n        position: absolute;\\n        top: 50%;\\n        left: 50%;\\n        transform: translate(-50%, -50%);\\n        -ms-transform: translate(-50%, -50%);\\n        text-align: center;\\n    }\\n    .content-container:hover .middle {\\n        opacity: 1;\\n    }\\n    \\n</style>\\n\\n\\n<div class='content-container'>\\n\\n<Row class='text-center my-5'>\\n    <Col>\\n        <div class='content'>\\n        <Carousel items={values} bind:activeIndex ride interval={2000}>\\n            <!-- <CarouselIndicators bind:activeIndex items={values} /> -->\\n\\n            <div class=\\"carousel-inner\\">\\n            {#each values as item, index}\\n\\n                <CarouselItem bind:activeIndex itemIndex={index}>\\n                \\n                {#if edit}\\n                    <Row class='mt-3'>\\n                        <Col><Input type='text' bind:value={item.title} placeholder='Titre'/></Col>\\n                        <Col><Input type='text' bind:value={item.subTitle} placeholder='Sous-titre'/></Col>\\n                    </Row>\\n    \\n                    <Row class='my-3'>\\n                        <Col><Button block on:click={() => addAnItem()}>Add an item</Button></Col>\\n                        <Col><Button block on:click={() => removeAnItem(index)}>Delete</Button></Col>\\n                    </Row> \\n                    <Row>\\n                        <Col>\\n                            <Label>Image</Label>\\n                            <ImageComponent\\n                                bind:values={item.component.values}\\n                                bind:styles={item.component.styles}\\n                                admin={admin}\\n                                edit={false}\\n                                updateContent={null}\\n                            />\\n                        </Col>\\n                    </Row>\\n                \\n                {:else}\\n                    <ImageComponent\\n                        bind:values={item.component.values}\\n                        bind:styles={item.component.styles}\\n                        admin={false}\\n                        edit={false}\\n                        updateContent={null}\\n                    />\\n                    <CarouselCaption\\n                        captionHeader={item.title}\\n                        captionText={item.subTitle}\\n                    />\\n                {/if}\\n\\n                </CarouselItem>\\n            {/each}\\n            </div>\\n            {#if !edit}\\n                <CarouselControl direction=\\"prev\\" bind:activeIndex items={values} />\\n                <CarouselControl direction=\\"next\\" bind:activeIndex items={values} />\\n            {/if}\\n        </Carousel>\\n        </div>\\n    </Col>\\n</Row>\\n\\n{#if admin}\\n    <div class='middle'>\\n        <EditButton\\n            admin={admin}\\n            updateContent={updateContent}\\n            bind:edit={edit}\\n        />\\n    </div>\\n{/if}\\n</div>"],"names":[],"mappings":"AAmDI,gDAAkB,CAAC,AACf,QAAQ,CAAE,QAAQ,AACtB,CAAC,AACD,QAAQ,8BAAC,CAAC,AACN,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,OAAO,CAAE,CAAC,CACV,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,mBAAmB,CAAE,MAAM,AAC/B,CAAC,AACD,OAAO,8BAAC,CAAC,AACL,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,OAAO,CAAE,GAAG,CACZ,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,GAAG,CACR,IAAI,CAAE,GAAG,CACT,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAChC,aAAa,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CACpC,UAAU,CAAE,MAAM,AACtB,CAAC,AACD,iCAAkB,MAAM,CAAC,OAAO,eAAC,CAAC,AAC9B,OAAO,CAAE,CAAC,AACd,CAAC"}`
};
const CarouselComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { values = [] } = $$props;
  let { styles = [] } = $$props;
  let { admin = "false" } = $$props;
  let { edit: edit2 = "false" } = $$props;
  let { updateContent } = $$props;
  let activeIndex = 0;
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.styles === void 0 && $$bindings.styles && styles !== void 0)
    $$bindings.styles(styles);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.edit === void 0 && $$bindings.edit && edit2 !== void 0)
    $$bindings.edit(edit2);
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  $$result.css.add(css$6);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        if (values.length && !values[0].component) {
          values[0].component = { values: [], styles: [] };
        }
      }
    }
    {
      {
        if (values.length === 0) {
          values.push({
            title: "",
            subTitle: "",
            component: { values: [], styles: [] }
          });
        }
      }
    }
    $$rendered = `<div class="${"content-container svelte-14apyyo"}">${validate_component(Row, "Row").$$render($$result, { class: "text-center my-5" }, {}, {
      default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
        default: () => `<div class="${"content svelte-14apyyo"}">${validate_component(Carousel, "Carousel").$$render($$result, {
          items: values,
          ride: true,
          interval: 2e3,
          activeIndex
        }, {
          activeIndex: ($$value) => {
            activeIndex = $$value;
            $$settled = false;
          }
        }, {
          default: () => `

            <div class="${"carousel-inner"}">${each(values, (item, index) => `${validate_component(CarouselItem, "CarouselItem").$$render($$result, { itemIndex: index, activeIndex }, {
            activeIndex: ($$value) => {
              activeIndex = $$value;
              $$settled = false;
            }
          }, {
            default: () => `${edit2 ? `${validate_component(Row, "Row").$$render($$result, { class: "mt-3" }, {}, {
              default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
                default: () => `${validate_component(Input, "Input").$$render($$result, {
                  type: "text",
                  placeholder: "Titre",
                  value: item.title
                }, {
                  value: ($$value) => {
                    item.title = $$value;
                    $$settled = false;
                  }
                }, {})}`
              })}
                        ${validate_component(Col, "Col").$$render($$result, {}, {}, {
                default: () => `${validate_component(Input, "Input").$$render($$result, {
                  type: "text",
                  placeholder: "Sous-titre",
                  value: item.subTitle
                }, {
                  value: ($$value) => {
                    item.subTitle = $$value;
                    $$settled = false;
                  }
                }, {})}`
              })}
                    `
            })}
    
                    ${validate_component(Row, "Row").$$render($$result, { class: "my-3" }, {}, {
              default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
                default: () => `${validate_component(Button, "Button").$$render($$result, { block: true }, {}, { default: () => `Add an item` })}`
              })}
                        ${validate_component(Col, "Col").$$render($$result, {}, {}, {
                default: () => `${validate_component(Button, "Button").$$render($$result, { block: true }, {}, { default: () => `Delete` })}`
              })}
                    `
            })} 
                    ${validate_component(Row, "Row").$$render($$result, {}, {}, {
              default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
                default: () => `${validate_component(Label, "Label").$$render($$result, {}, {}, { default: () => `Image` })}
                            ${validate_component(ImageComponent, "ImageComponent").$$render($$result, {
                  admin,
                  edit: false,
                  updateContent: null,
                  values: item.component.values,
                  styles: item.component.styles
                }, {
                  values: ($$value) => {
                    item.component.values = $$value;
                    $$settled = false;
                  },
                  styles: ($$value) => {
                    item.component.styles = $$value;
                    $$settled = false;
                  }
                }, {})}
                        `
              })}
                    `
            })}` : `${validate_component(ImageComponent, "ImageComponent").$$render($$result, {
              admin: false,
              edit: false,
              updateContent: null,
              values: item.component.values,
              styles: item.component.styles
            }, {
              values: ($$value) => {
                item.component.values = $$value;
                $$settled = false;
              },
              styles: ($$value) => {
                item.component.styles = $$value;
                $$settled = false;
              }
            }, {})}
                    ${validate_component(CarouselCaption, "CarouselCaption").$$render($$result, {
              captionHeader: item.title,
              captionText: item.subTitle
            }, {}, {})}`}

                `
          })}`)}</div>
            ${!edit2 ? `${validate_component(CarouselControl, "CarouselControl").$$render($$result, {
            direction: "prev",
            items: values,
            activeIndex
          }, {
            activeIndex: ($$value) => {
              activeIndex = $$value;
              $$settled = false;
            }
          }, {})}
                ${validate_component(CarouselControl, "CarouselControl").$$render($$result, {
            direction: "next",
            items: values,
            activeIndex
          }, {
            activeIndex: ($$value) => {
              activeIndex = $$value;
              $$settled = false;
            }
          }, {})}` : ``}`
        })}</div>`
      })}`
    })}

${admin ? `<div class="${"middle svelte-14apyyo"}">${validate_component(EditButton, "EditButton").$$render($$result, { admin, updateContent, edit: edit2 }, {
      edit: ($$value) => {
        edit2 = $$value;
        $$settled = false;
      }
    }, {})}</div>` : ``}</div>`;
  } while (!$$settled);
  return $$rendered;
});
var VideoComponent_svelte_svelte_type_style_lang = ".content-container.svelte-16ootmj.svelte-16ootmj{position:relative}.content.svelte-16ootmj.svelte-16ootmj{transition:.5s ease;opacity:1;width:100%;height:100%;backface-visibility:hidden}.middle.svelte-16ootmj.svelte-16ootmj{transition:.5s ease;opacity:0.5;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);text-align:center}.content-container.svelte-16ootmj:hover .middle.svelte-16ootmj{opacity:1}.video-container.svelte-16ootmj.svelte-16ootmj{position:relative;padding-bottom:56.25%;height:0}.video-container.svelte-16ootmj iframe.svelte-16ootmj{position:absolute;top:0;left:0;width:100%;height:100%}.video-insert.svelte-16ootmj.svelte-16ootmj{min-width:100%;min-height:100%;width:100%;height:100%;background-size:cover;overflow:hidden}";
const css$5 = {
  code: ".content-container.svelte-16ootmj.svelte-16ootmj{position:relative}.content.svelte-16ootmj.svelte-16ootmj{transition:.5s ease;opacity:1;width:100%;height:100%;backface-visibility:hidden}.middle.svelte-16ootmj.svelte-16ootmj{transition:.5s ease;opacity:0.5;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);text-align:center}.content-container.svelte-16ootmj:hover .middle.svelte-16ootmj{opacity:1}.video-container.svelte-16ootmj.svelte-16ootmj{position:relative;padding-bottom:56.25%;height:0}.video-container.svelte-16ootmj iframe.svelte-16ootmj{position:absolute;top:0;left:0;width:100%;height:100%}.video-insert.svelte-16ootmj.svelte-16ootmj{min-width:100%;min-height:100%;width:100%;height:100%;background-size:cover;overflow:hidden}",
  map: `{"version":3,"file":"VideoComponent.svelte","sources":["VideoComponent.svelte"],"sourcesContent":["<script>\\nimport { uploadVideo } from \\"../actions/videosActions\\";\\nimport { Button, Col, Icon, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from \\"sveltestrap\\";\\nimport EditButton from \\"./EditButton.svelte\\";\\nimport config from '../config.json';\\nconst API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;\\nlet local = false;\\n\\n    export let values=[];\\n    export let styles=[];\\n    export let admin='false';\\n    export let edit='false';\\n    export let updateContent;\\n\\n    styles;\\n\\n    let size = '';\\n\\n    const sizeChange = (e) => {\\n\\n        const size = e.target.value;\\n\\n        if(size === 'small') {\\n            styles.filter( x => x.name === 'maxWidth')[0].value = '250px';\\n            styles.filter( x => x.name === 'maxWidth')[0].size = size;\\n        } else if(size === 'normal') {\\n            styles.filter( x => x.name === 'maxWidth')[0].value = '500px';\\n            styles.filter( x => x.name === 'maxWidth')[0].size = size;\\n        }else if(size === 'large') {\\n            styles.filter( x => x.name === 'maxWidth')[0].value = '1000px';\\n            styles.filter( x => x.name === 'maxWidth')[0].size = size;\\n        }\\n        styles = styles;\\n    };\\n    \\n\\n    const toggle = async() => {\\n        if (edit && updateContent) {\\n            await updateContent();\\n        }\\n        edit = !edit;\\n    };\\n\\n    $: {\\n        if (values.length === 0) {\\n            values.push({\\n                type: 'youtube',\\n                url: '',\\n            })\\n        }\\n        if (values.length === 1) {\\n            values.push({\\n                type: 'local',\\n                url: '',\\n            })\\n        }\\n    }\\n\\n    $: {\\n        if (styles.length === 0) {\\n            styles.push({\\n                name: 'maxWidth', size: 'normal', value: '500px',\\n            });\\n            size = 'normal'\\n        } else {\\n            size = styles.filter( x => x.name === 'maxWidth')[0].size;\\n        }\\n    }\\n\\n    const updateStyle = ({name, value}) => {\\n        const curentStyleItem = styles.filter(x => x.name === name);\\n        if (curentStyleItem.length) {\\n            for (let index = 0; index < styles.length; index++) {\\n                if (styles[index].name === name) {\\n                    styles[index].value = value;\\n                }\\n            }\\n        } else {\\n            styles = [...styles, {name, value}];\\n        }\\n        styles = styles;\\n    };\\n\\n    $: textAlign = styles.filter(x => x.name === 'text-align')[0] && styles.filter(x => x.name === 'text-align')[0].value;\\n\\n    const onChangeHandler = async(index, e) => {\\n        const data = new FormData();\\n\\n        data.append('video', e.target.files[0]);\\n\\n        const videoToReplace = values[index].url;\\n        \\n        const result = await uploadVideo(data, videoToReplace);\\n\\n        if (result.status === 'Ok') {\\n            values[index].url = result.data;\\n            values = values;\\n        } else {\\n            console.log('error', result.data);\\n        }\\n    };\\n\\n<\/script>\\n\\n<style>\\n    .content-container{\\n        position: relative;\\n    }\\n    .content {\\n        transition: .5s ease;\\n        opacity: 1;\\n        width: 100%;\\n        height: 100%;\\n        backface-visibility: hidden;\\n    }\\n    .middle {\\n        transition: .5s ease;\\n        opacity: 0.5;\\n        position: absolute;\\n        top: 50%;\\n        left: 50%;\\n        transform: translate(-50%, -50%);\\n        -ms-transform: translate(-50%, -50%);\\n        text-align: center;\\n    }\\n    .content-container:hover .middle {\\n        opacity: 1;\\n    }\\n    .video-container {\\n        position: relative;\\n        padding-bottom: 56.25%; /* 16:9 */\\n        height: 0;\\n    }\\n    .video-container iframe {\\n        position: absolute;\\n        top: 0;\\n        left: 0;\\n        width: 100%;\\n        height: 100%;\\n    }\\n\\n    .video-insert {\\n        min-width: 100%; \\n        min-height: 100%;\\n        width: 100%; \\n        height: 100%;\\n        background-size: cover;\\n        overflow: hidden;\\n    }\\n    \\n</style>\\n\\n<div class='content-container'>\\n<Row>\\n    <Col>  \\n        <Modal isOpen={edit} {toggle} size='lg' scrollable>\\n            <ModalHeader {toggle}>Editer le contenu de la Card</ModalHeader>\\n            <ModalBody>\\n              <Row>\\n                <Col>\\n                    <Row class='my-3'>\\n                        <Col>\\n                            <Label for='input-text'>URL de la vid\xE9o Youtube</Label>\\n                            <Input type='text' name='text' id='input-text' bind:value={values[0].url} placeholder='url'/>\\n                            <Label for='upload-video' class='mt-3'>Charger une vid\xE9o localement</Label>\\n                            <Input type='file' class='h-1' on:change={(e) => onChangeHandler (1, e)}/>\\n                        </Col>\\n                        <Col>\\n                            <Label for='select-size'>Select display size</Label>\\n                            {size}\\n                            <select class='form-control' id='select-size' name='select-size' bind:value={size} on:change={sizeChange}>\\n                                <option value=''>--- select ---</option>\\n                                <option value='small'>Smal 250px</option>\\n                                <option value='normal'>Normal 500px [default]</option>\\n                                <option value='large'>Large 1000px</option>\\n                            </select>\\n                            <div class='row py-1'><div class='col'>\\n                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'text-align', value:'margin-right: auto;'})}><Icon name='text-left' /></button>\\n                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'text-align', value:'margin-left: auto;margin-right: auto'})}><Icon name='text-center' /></button>\\n                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'text-align', value:'margin-left: auto'})}><Icon name='text-right' /></button>\\n                            </div></div>\\n                        </Col>\\n                    </Row>\\n                    <Row class='my-3'>\\n                        <Col>\\n                            \\n                        </Col>\\n                    </Row>\\n\\n                </Col>\\n              </Row>\\n            </ModalBody>\\n      \\n            <ModalFooter>\\n              <Button color=\\"primary\\" on:click={toggle}>Enregistrer</Button>\\n              <Button color=\\"secondary\\" on:click={toggle}>Cancel</Button>\\n            </ModalFooter>\\n      \\n        </Modal>\\n        \\n        <div class='content'>\\n        <Row class='my-3'>\\n            <Col class='text-center'>\\n                {#if values[0].url}\\n                    <div class='video-dimension' style={\`max-width:\${styles.filter(x => x.name === 'maxWidth')[0].value};\${textAlign};\`}>\\n                        <div class={\`video-container\`}>\\n                            <iframe \\n                                width=\\"1280\\"\\n                                height=\\"720\\"\\n                                src={values[0].url} \\n                                title=\\"YouTube video player\\" \\n                                frameborder=\\"0\\" \\n                                allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\\" \\n                                allowfullscreen\\n                            ></iframe>\\n                        </div>\\n                    </div>\\n                {/if}\\n                {#if values[1].url}\\n                    <!-- Afficher la version locale si la version youtube n'est pas disponible -->\\n                    {#if !values[0].url}\\n                        <div class='video-local-dimension' style={\`max-width:\${styles.filter(x => x.name === 'maxWidth')[0].value};\${textAlign};\`}>\\n                            <video class='video-insert' controls >\\n                                <source src={API_URL + '/' + values[1].url} type=\\"video/mp4\\">\\n                                <source src={API_URL + '/' + values[1].url} type=\\"video/webm\\">\\n                                <source src={API_URL + '/' + values[1].url} type=\\"video/ogg\\">\\n                                <track default kind=\\"captions\\"/>\\n                                Sorry, your browser doesn't support embedded videos.\\n                            </video>\\n                        </div>\\n                    {:else}\\n                        <!-- si la version youtube est disponible on peut regarder optionnellement la version locale -->\\n                        <button class='btn btn-sm btn-primary my-3' on:click={() => local = !local}>\\n                            {local ? 'Retour' : 'Voir la version locale'}\\n                        </button>\\n                        {#if local}\\n                            <div class='video-local-dimension' style={\`max-width:\${styles.filter(x => x.name === 'maxWidth')[0].value};\${textAlign};\`}>\\n                                <video class='video-insert' controls >\\n                                    <source src={API_URL + '/' + values[1].url} type=\\"video/mp4\\">\\n                                    <source src={API_URL + '/' + values[1].url} type=\\"video/webm\\">\\n                                    <source src={API_URL + '/' + values[1].url} type=\\"video/ogg\\">\\n                                    <track default kind=\\"captions\\"/>\\n                                    Sorry, your browser doesn't support embedded videos.\\n                                </video>\\n                            </div>\\n                        {/if}\\n                    {/if}\\n                {/if}\\n            </Col>\\n        </Row>\\n        </div>\\n\\n    </Col>\\n</Row>\\n\\n{#if admin}\\n    <div class='middle'>\\n        <EditButton\\n            admin={admin}\\n            updateContent={updateContent}\\n            bind:edit={edit}\\n        />\\n    </div>\\n{/if}\\n\\n</div>"],"names":[],"mappings":"AAyGI,gDAAkB,CAAC,AACf,QAAQ,CAAE,QAAQ,AACtB,CAAC,AACD,QAAQ,8BAAC,CAAC,AACN,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,OAAO,CAAE,CAAC,CACV,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,mBAAmB,CAAE,MAAM,AAC/B,CAAC,AACD,OAAO,8BAAC,CAAC,AACL,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,OAAO,CAAE,GAAG,CACZ,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,GAAG,CACR,IAAI,CAAE,GAAG,CACT,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAChC,aAAa,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CACpC,UAAU,CAAE,MAAM,AACtB,CAAC,AACD,iCAAkB,MAAM,CAAC,OAAO,eAAC,CAAC,AAC9B,OAAO,CAAE,CAAC,AACd,CAAC,AACD,gBAAgB,8BAAC,CAAC,AACd,QAAQ,CAAE,QAAQ,CAClB,cAAc,CAAE,MAAM,CACtB,MAAM,CAAE,CAAC,AACb,CAAC,AACD,+BAAgB,CAAC,MAAM,eAAC,CAAC,AACrB,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,AAChB,CAAC,AAED,aAAa,8BAAC,CAAC,AACX,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,eAAe,CAAE,KAAK,CACtB,QAAQ,CAAE,MAAM,AACpB,CAAC"}`
};
const VideoComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let textAlign;
  const API_URL2 = config.API_URL_DEV;
  let { values = [] } = $$props;
  let { styles = [] } = $$props;
  let { admin = "false" } = $$props;
  let { edit: edit2 = "false" } = $$props;
  let { updateContent } = $$props;
  let size = "";
  const toggle = async () => {
    if (edit2 && updateContent) {
      await updateContent();
    }
    edit2 = !edit2;
  };
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.styles === void 0 && $$bindings.styles && styles !== void 0)
    $$bindings.styles(styles);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.edit === void 0 && $$bindings.edit && edit2 !== void 0)
    $$bindings.edit(edit2);
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  $$result.css.add(css$5);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        if (values.length === 0) {
          values.push({ type: "youtube", url: "" });
        }
        if (values.length === 1) {
          values.push({ type: "local", url: "" });
        }
      }
    }
    {
      {
        if (styles.length === 0) {
          styles.push({
            name: "maxWidth",
            size: "normal",
            value: "500px"
          });
          size = "normal";
        } else {
          size = styles.filter((x) => x.name === "maxWidth")[0].size;
        }
      }
    }
    textAlign = styles.filter((x) => x.name === "text-align")[0] && styles.filter((x) => x.name === "text-align")[0].value;
    $$rendered = `<div class="${"content-container svelte-16ootmj"}">${validate_component(Row, "Row").$$render($$result, {}, {}, {
      default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
        default: () => `${validate_component(Modal, "Modal").$$render($$result, {
          isOpen: edit2,
          toggle,
          size: "lg",
          scrollable: true
        }, {}, {
          default: () => `${validate_component(ModalHeader, "ModalHeader").$$render($$result, { toggle }, {}, {
            default: () => `Editer le contenu de la Card`
          })}
            ${validate_component(ModalBody, "ModalBody").$$render($$result, {}, {}, {
            default: () => `${validate_component(Row, "Row").$$render($$result, {}, {}, {
              default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
                default: () => `${validate_component(Row, "Row").$$render($$result, { class: "my-3" }, {}, {
                  default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
                    default: () => `${validate_component(Label, "Label").$$render($$result, { for: "input-text" }, {}, { default: () => `URL de la vid\xE9o Youtube` })}
                            ${validate_component(Input, "Input").$$render($$result, {
                      type: "text",
                      name: "text",
                      id: "input-text",
                      placeholder: "url",
                      value: values[0].url
                    }, {
                      value: ($$value) => {
                        values[0].url = $$value;
                        $$settled = false;
                      }
                    }, {})}
                            ${validate_component(Label, "Label").$$render($$result, { for: "upload-video", class: "mt-3" }, {}, {
                      default: () => `Charger une vid\xE9o localement`
                    })}
                            ${validate_component(Input, "Input").$$render($$result, { type: "file", class: "h-1" }, {}, {})}`
                  })}
                        ${validate_component(Col, "Col").$$render($$result, {}, {}, {
                    default: () => `${validate_component(Label, "Label").$$render($$result, { for: "select-size" }, {}, { default: () => `Select display size` })}
                            ${escape$4(size)}
                            <select class="${"form-control"}" id="${"select-size"}" name="${"select-size"}"><option value="${""}">--- select ---</option><option value="${"small"}">Smal 250px</option><option value="${"normal"}">Normal 500px [default]</option><option value="${"large"}">Large 1000px</option></select>
                            <div class="${"row py-1"}"><div class="${"col"}"><button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, { name: "text-left" }, {}, {})}</button>
                                <button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, { name: "text-center" }, {}, {})}</button>
                                <button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, { name: "text-right" }, {}, {})}</button></div></div>`
                  })}`
                })}
                    ${validate_component(Row, "Row").$$render($$result, { class: "my-3" }, {}, {
                  default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {})}`
                })}`
              })}`
            })}`
          })}
      
            ${validate_component(ModalFooter, "ModalFooter").$$render($$result, {}, {}, {
            default: () => `${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, { default: () => `Enregistrer` })}
              ${validate_component(Button, "Button").$$render($$result, { color: "secondary" }, {}, { default: () => `Cancel` })}`
          })}`
        })}
        
        <div class="${"content svelte-16ootmj"}">${validate_component(Row, "Row").$$render($$result, { class: "my-3" }, {}, {
          default: () => `${validate_component(Col, "Col").$$render($$result, { class: "text-center" }, {}, {
            default: () => `${values[0].url ? `<div class="${"video-dimension"}"${add_attribute("style", `max-width:${styles.filter((x) => x.name === "maxWidth")[0].value};${textAlign};`, 0)}><div class="${escape$4(null_to_empty(`video-container`)) + " svelte-16ootmj"}"><iframe width="${"1280"}" height="${"720"}"${add_attribute("src", values[0].url, 0)} title="${"YouTube video player"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen class="${"svelte-16ootmj"}"></iframe></div></div>` : ``}
                ${values[1].url ? `
                    ${!values[0].url ? `<div class="${"video-local-dimension"}"${add_attribute("style", `max-width:${styles.filter((x) => x.name === "maxWidth")[0].value};${textAlign};`, 0)}><video class="${"video-insert svelte-16ootmj"}" controls><source${add_attribute("src", API_URL2 + "/" + values[1].url, 0)} type="${"video/mp4"}"><source${add_attribute("src", API_URL2 + "/" + values[1].url, 0)} type="${"video/webm"}"><source${add_attribute("src", API_URL2 + "/" + values[1].url, 0)} type="${"video/ogg"}"><track default kind="${"captions"}">
                                Sorry, your browser doesn&#39;t support embedded videos.
                            </video></div>` : `
                        <button class="${"btn btn-sm btn-primary my-3"}">${escape$4("Voir la version locale")}</button>
                        ${``}`}` : ``}`
          })}`
        })}</div>`
      })}`
    })}

${admin ? `<div class="${"middle svelte-16ootmj"}">${validate_component(EditButton, "EditButton").$$render($$result, { admin, updateContent, edit: edit2 }, {
      edit: ($$value) => {
        edit2 = $$value;
        $$settled = false;
      }
    }, {})}</div>` : ``}</div>`;
  } while (!$$settled);
  return $$rendered;
});
var EditoComponent_svelte_svelte_type_style_lang = ".ligne-titre.svelte-tgtlqm{max-width:10vh}";
const css$4 = {
  code: ".ligne-titre.svelte-tgtlqm{max-width:10vh}",
  map: `{"version":3,"file":"EditoComponent.svelte","sources":["EditoComponent.svelte"],"sourcesContent":["<script>\\n    import ImageComponent from \\"./ImageComponent.svelte\\";\\n    import TextComponent from \\"./TextComponent.svelte\\";\\n\\n    export let values=[];\\n    export let styles=[];\\n    export let admin='false';\\n    export let edit='false';\\n    export let updateContent;\\n\\n    styles;\\n    edit;\\n\\n    $: {\\n        // if (values.length < 4) {\\n        //     values.push({name:'title', values:[], styles:[]});\\n        //     values.push({name:'image', values:[], styles:[]});\\n        //     values.push({name:'colonne-1', values:[], styles:[]});\\n        //     values.push({name:'colonne-2', values:[], styles:[]});\\n        // }\\n        if (values.length < 1) { values.push({name: 'titre', values:[], styles:[]});}\\n        if (values.length < 2) { values.push({name: 'image', values:[], styles:[]});}\\n        if (values.length < 3) { values.push({name: 'colonne-1', values:[], styles:[]});}\\n        if (values.length < 4) { values.push({name: 'colonne-2', values:[], styles:[]});}\\n        if (values.length < 5) { values.push({name: 'illustration', values:[], styles:[]});}\\n    }\\n\\n<\/script>\\n\\n<!-- section titre -->\\n<div class='row'>\\n    <div class='col'>\\n        <div style='padding-left: 5vh;'>\\n            <TextComponent \\n                bind:values={values[0].values}\\n                bind:styles={values[0].styles}\\n                admin={admin}\\n                edit={false}\\n                updateContent={updateContent}\\n            />\\n            <div class='ligne-titre border-top border-5 border-primary'></div>\\n        </div>\\n    </div>\\n</div>\\n\\n<!-- section contenu -->\\n<div class='row my-5 text-align-center'>\\n    <!-- illustration de l'\xE9dito -->\\n    <div class='col-sm-12 col-md-4 text-center pt-3'>\\n            <ImageComponent \\n                bind:values={values[1].values}\\n                bind:styles={values[1].styles}\\n                admin={admin}\\n                edit={false}\\n                updateContent={updateContent}\\n            />\\n            <TextComponent \\n                bind:values={values[4].values}\\n                bind:styles={values[4].styles}\\n                admin={admin}\\n                edit={false}\\n                updateContent={updateContent}\\n            />\\n    </div>\\n\\n    <!-- premi\xE8re colonne -->\\n    <div class='col-sm-12 col-md-4'> \\n        <TextComponent \\n            bind:values={values[2].values}\\n            bind:styles={values[2].styles}\\n            admin={admin}\\n            edit={false}\\n            updateContent={updateContent}\\n        />\\n    </div>\\n\\n    <!-- deuxi\xE8me colonne -->\\n    <div class='col-sm-12 col-md-4'> \\n        <TextComponent \\n            bind:values={values[3].values}\\n            bind:styles={values[3].styles}\\n            admin={admin}\\n            edit={false}\\n            updateContent={updateContent}\\n        />\\n    </div>\\n    \\n</div>\\n\\n<style>\\n    .ligne-titre {\\n        max-width: 10vh;\\n    }\\n</style>"],"names":[],"mappings":"AA0FI,YAAY,cAAC,CAAC,AACV,SAAS,CAAE,IAAI,AACnB,CAAC"}`
};
const EditoComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { values = [] } = $$props;
  let { styles = [] } = $$props;
  let { admin = "false" } = $$props;
  let { edit: edit2 = "false" } = $$props;
  let { updateContent } = $$props;
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.styles === void 0 && $$bindings.styles && styles !== void 0)
    $$bindings.styles(styles);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.edit === void 0 && $$bindings.edit && edit2 !== void 0)
    $$bindings.edit(edit2);
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  $$result.css.add(css$4);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        if (values.length < 1) {
          values.push({ name: "titre", values: [], styles: [] });
        }
        if (values.length < 2) {
          values.push({ name: "image", values: [], styles: [] });
        }
        if (values.length < 3) {
          values.push({
            name: "colonne-1",
            values: [],
            styles: []
          });
        }
        if (values.length < 4) {
          values.push({
            name: "colonne-2",
            values: [],
            styles: []
          });
        }
        if (values.length < 5) {
          values.push({
            name: "illustration",
            values: [],
            styles: []
          });
        }
      }
    }
    $$rendered = `
<div class="${"row"}"><div class="${"col"}"><div style="${"padding-left: 5vh;"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
      admin,
      edit: false,
      updateContent,
      values: values[0].values,
      styles: values[0].styles
    }, {
      values: ($$value) => {
        values[0].values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        values[0].styles = $$value;
        $$settled = false;
      }
    }, {})}
            <div class="${"ligne-titre border-top border-5 border-primary svelte-tgtlqm"}"></div></div></div></div>


<div class="${"row my-5 text-align-center"}">
    <div class="${"col-sm-12 col-md-4 text-center pt-3"}">${validate_component(ImageComponent, "ImageComponent").$$render($$result, {
      admin,
      edit: false,
      updateContent,
      values: values[1].values,
      styles: values[1].styles
    }, {
      values: ($$value) => {
        values[1].values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        values[1].styles = $$value;
        $$settled = false;
      }
    }, {})}
            ${validate_component(TextComponent, "TextComponent").$$render($$result, {
      admin,
      edit: false,
      updateContent,
      values: values[4].values,
      styles: values[4].styles
    }, {
      values: ($$value) => {
        values[4].values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        values[4].styles = $$value;
        $$settled = false;
      }
    }, {})}</div>

    
    <div class="${"col-sm-12 col-md-4"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
      admin,
      edit: false,
      updateContent,
      values: values[2].values,
      styles: values[2].styles
    }, {
      values: ($$value) => {
        values[2].values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        values[2].styles = $$value;
        $$settled = false;
      }
    }, {})}</div>

    
    <div class="${"col-sm-12 col-md-4"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
      admin,
      edit: false,
      updateContent,
      values: values[3].values,
      styles: values[3].styles
    }, {
      values: ($$value) => {
        values[3].values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        values[3].styles = $$value;
        $$settled = false;
      }
    }, {})}</div>
    
</div>`;
  } while (!$$settled);
  return $$rendered;
});
const ArticlesComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $articleDeleteRequest, $$unsubscribe_articleDeleteRequest;
  let $articleCreateRequest, $$unsubscribe_articleCreateRequest;
  let $articleAllRequest, $$unsubscribe_articleAllRequest;
  $$unsubscribe_articleDeleteRequest = subscribe(articleDeleteRequest, (value) => $articleDeleteRequest = value);
  $$unsubscribe_articleCreateRequest = subscribe(articleCreateRequest, (value) => $articleCreateRequest = value);
  $$unsubscribe_articleAllRequest = subscribe(articleAllRequest, (value) => $articleAllRequest = value);
  let { values = [] } = $$props;
  let { styles = [] } = $$props;
  let { admin = "false" } = $$props;
  let { edit: edit2 = "false" } = $$props;
  let { updateContent } = $$props;
  let keyword = "";
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.styles === void 0 && $$bindings.styles && styles !== void 0)
    $$bindings.styles(styles);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.edit === void 0 && $$bindings.edit && edit2 !== void 0)
    $$bindings.edit(edit2);
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        if (values.length === 0) {
          values.push({ category: "", label: [], maxSize: "" });
        }
      }
    }
    {
      {
        if (styles.length === 0) {
          styles.push([]);
        }
      }
    }
    {
      {
        getAllArticles(values[0].category, values[0].maxSize, "", keyword);
      }
    }
    {
      {
        if ($articleCreateRequest.success) {
          getAllArticles(values[0].category, values[0].maxSize, "", keyword);
        }
      }
    }
    {
      {
        if ($articleDeleteRequest.success) {
          getAllArticles(values[0].category, values[0].maxSize, "", keyword);
        }
      }
    }
    $$rendered = `<div><div class="${"row"}"><div class="${"col"}">${$articleAllRequest.loading ? `${validate_component(Loading, "Loading").$$render($$result, { color: "secondary", number: 3 }, {}, {})}` : ``}
            ${$articleAllRequest.message ? `${validate_component(Message, "Message").$$render($$result, {
      color: $articleAllRequest.success ? "success" : "danger"
    }, {}, {
      default: () => `${escape$4($articleAllRequest.message)}`
    })}` : ``}
            ${$articleCreateRequest.loading ? `${validate_component(Loading, "Loading").$$render($$result, { color: "secondary", number: 3 }, {}, {})}` : ``}
            ${$articleCreateRequest.message ? `${validate_component(Message, "Message").$$render($$result, {
      color: $articleCreateRequest.success ? "success" : "danger"
    }, {}, {
      default: () => `${escape$4($articleCreateRequest.message)}`
    })}` : ``}
            ${$articleDeleteRequest.loading ? `${validate_component(Loading, "Loading").$$render($$result, { color: "secondary", number: 3 }, {}, {})}` : ``}
            ${$articleDeleteRequest.message ? `${validate_component(Message, "Message").$$render($$result, {
      color: $articleDeleteRequest.success ? "success" : "danger"
    }, {}, {
      default: () => `${escape$4($articleDeleteRequest.message)}`
    })}` : ``}

            ${admin ? `<div class="${"row"}"><div class="${"col text-end"}"><button class="${"btn btn-primary m-3"}">Save</button></div></div>

                <div class="${"row"}"><div class="${"row px-5"}"><h3 class="${"pt-3"}">Global configurations:</h3>
                        <div class="${"col"}">${validate_component(Label, "Label").$$render($$result, { for: "category" }, {}, { default: () => `Category: ` })}
                            ${validate_component(Input, "Input").$$render($$result, {
      type: "text",
      name: "category",
      id: "category",
      class: "my-3",
      value: values[0].category
    }, {
      value: ($$value) => {
        values[0].category = $$value;
        $$settled = false;
      }
    }, {})}</div>

                        <div class="${"col"}">${validate_component(Label, "Label").$$render($$result, { for: "maxSize" }, {}, { default: () => `Max display articles ` })}
                            ${validate_component(Input, "Input").$$render($$result, {
      type: "number",
      min: 0,
      step: 1,
      name: "maxSize",
      id: "maxSize",
      class: "my-3",
      value: values[0].maxSize
    }, {
      value: ($$value) => {
        values[0].maxSize = $$value;
        $$settled = false;
      }
    }, {})}</div></div></div>

                <div class="${"row"}"><div class="${"col px-5"}"><h3>Manage the articles</h3>
                        <button class="${"btn btn-primary"}" variant="${"primary"}">New Article</button></div></div> 

                <div class="${"row"}"><div class="${"col px-5"}"><h3 class="${"my-3"}">Preview: </h3></div></div>` : ``}

            <div class="${"row mt-5 mb-3"}"><div class="${"col"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
      admin,
      edit: false,
      values: values[0].label,
      styles: styles[0]
    }, {
      values: ($$value) => {
        values[0].label = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        styles[0] = $$value;
        $$settled = false;
      }
    }, {})}</div>

                <div class="${"col text-center"}"><input type="${"text"}" class="${"bg-secondary boder-none"}" placeholder="${"Rechercher un article"}"${add_attribute("value", keyword, 0)}></div></div>

            <div class="${"row mt-3"}">${$articleAllRequest.articles ? `${each($articleAllRequest.articles, (article) => `${article.title.values && article.url.values ? `<div class="${"col-12 col-md-4 py-3"}"><div class="${"card bg-light border-light align-middle shadow-sm"}" style="${"border-radius: 10%;"}"><div class="${"card-header border-0 bg-transparent"}" style="${"height: 5rem;"}"><h4 class="${"text-center text-primary my-auto"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
      values: article.title.values,
      styles: article.title.styles,
      edit: false,
      admin: false,
      updateContent: null
    }, {}, {})}
                                    </h4></div>
                                <div class="${"card-body"}" style="${"height: 15rem"}">${validate_component(ImageComponent, "ImageComponent").$$render($$result, {
      values: article.url.values,
      styles: article.url.styles,
      edit: false,
      admin: false,
      updateContent: null
    }, {}, {})}</div>

                                <p class="${"mx-auto"}">Publi\xE9 le : ${escape$4(article.createdAt.substring(0, 10))} par ${escape$4(article.author && article.author.values.length && article.author.values[0].value)}</p>

                                <div class="${"card-footer border-0 bg-transparent m-auto d-grid gap-1"}"><button type="${"button"}" class="${"btn btn-light text-secondary"}"><i class="${"bi bi-eyeglasses"}"></i>
                                        ${escape$4(admin ? "Editer" : "Lire l'article")}</button> 
                                </div></div>
                            ${admin ? `<button class="${"btn btn-danger btn-block mt-3"}">Delete</button>` : ``}
                        </div>` : ``}`)}` : ``}</div></div></div></div>`;
  } while (!$$settled);
  $$unsubscribe_articleDeleteRequest();
  $$unsubscribe_articleCreateRequest();
  $$unsubscribe_articleAllRequest();
  return $$rendered;
});
const PartenairesComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { values = [] } = $$props;
  let { styles = [] } = $$props;
  let { admin = "false" } = $$props;
  let { edit: edit2 = "false" } = $$props;
  let { updateContent } = $$props;
  const updateMovedArray = async (array) => {
    values[1].values = array;
    values = values;
    updateContent();
  };
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.styles === void 0 && $$bindings.styles && styles !== void 0)
    $$bindings.styles(styles);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.edit === void 0 && $$bindings.edit && edit2 !== void 0)
    $$bindings.edit(edit2);
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        if (values.length < 2) {
          values.push({ name: "category", values: [], styles: [] });
          values.push({
            name: "partenaires",
            values: [
              {
                name: {
                  name: "Partenaire name",
                  values: [],
                  styles: []
                },
                url: {
                  name: "Partenaire image",
                  values: [],
                  styles: []
                }
              }
            ]
          });
        }
      }
    }
    $$rendered = `
${admin ? `<div class="${"row my-5"}"><div class="${"col text-center"}"><button class="${"btn btn-primary"}">Add a partner</button></div></div>` : ``}


<div class="${"row mt-5"}"><div class="${"col"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
      admin,
      edit: edit2,
      updateContent,
      values: values[0].values,
      styles: values[0].styles
    }, {
      values: ($$value) => {
        values[0].values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        values[0].styles = $$value;
        $$settled = false;
      }
    }, {})}</div></div>


<div class="${"row pt-3 gx-3"}">${each(values[1].values, (partenaire, position) => `<div class="${"col-sm-6 col-md-3 text-center"}">${validate_component(MovingContent, "MovingContent").$$render($$result, {
      array: values[1].values,
      position,
      admin,
      updateMovedArray
    }, {}, {
      default: () => `<div class="${"my-2"}">${validate_component(ImageComponent, "ImageComponent").$$render($$result, {
        edit: edit2,
        admin,
        updateContent,
        values: partenaire.url.values,
        styles: partenaire.url.styles
      }, {
        values: ($$value) => {
          partenaire.url.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          partenaire.url.styles = $$value;
          $$settled = false;
        }
      }, {})}
                    ${validate_component(TextComponent, "TextComponent").$$render($$result, {
        edit: edit2,
        admin,
        updateContent,
        values: partenaire.name.values,
        styles: partenaire.name.styles
      }, {
        values: ($$value) => {
          partenaire.name.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          partenaire.name.styles = $$value;
          $$settled = false;
        }
      }, {})}</div>    
            `
    })}
        </div>`)}</div>`;
  } while (!$$settled);
  return $$rendered;
});
const DropDownSection = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { sectionTitle = "section" } = $$props;
  let { visible = false } = $$props;
  let { type = "p" } = $$props;
  if ($$props.sectionTitle === void 0 && $$bindings.sectionTitle && sectionTitle !== void 0)
    $$bindings.sectionTitle(sectionTitle);
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  return `<div class="${"d-grid gap-2"}"><button class="${"btn btn-transparent text-start text-dark border-bottom"}"><div${add_attribute("class", type, 0)}>${visible ? `<i class="${"bi bi-chevron-up"}"></i>` : `<i class="${"bi bi-chevron-down"}"></i>`}
            ${escape$4(sectionTitle)}</div></button></div>
${visible ? `${slots.default ? slots.default({}) : ``}` : ``}`;
});
var MapComponent_svelte_svelte_type_style_lang = ".mapid.svelte-1psfy55{height:230px}";
const css$3 = {
  code: ".mapid.svelte-1psfy55{height:230px}",
  map: `{"version":3,"file":"MapComponent.svelte","sources":["MapComponent.svelte"],"sourcesContent":["<script>\\n    export let adresse = '';\\n    export let latitude = 0;\\n    export let longitude = 0;\\n    export let mapid = 'id';\\n    import { browser } from '$app/env'; \\n    import { onMount } from 'svelte';\\n    //import L from 'leaflet';\\n    \\n    //console.log('mapid', mapid)\\n\\n    //let map;\\n    \\n    const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';\\n    const attribution = '&copy; <a href=\\"https://www.openstreetmap.org/copyright\\">OpenStreetMap</a> contributors';    \\n    \\n    onMount(async() => {\\n        if (browser) {\\n            const L = await import('leaflet');\\n\\n            const myMap = L.map(mapid.toString()).setView([latitude, longitude], 13);\\n\\n            L.tileLayer(tileLayerUrl, {\\n                attribution: attribution\\n            }).addTo(myMap);\\n            // Add a marker\\n            L.marker([latitude, longitude]).addTo(myMap)\\n                .bindPopup(\`<b>\${adresse.replaceAll(/[#|*|_]/g,'')}</b>\`)\\n                .openPopup();\\n        }\\n\\n    });\\n\\n\\n    // https://leafletjs.com/examples/quick-start/\\n\\n<\/script>\\n\\n<!-- Integrate map from openstreetmap -->\\n<link \\n    rel=\\"stylesheet\\" href=\\"https://unpkg.com/leaflet@1.7.1/dist/leaflet.css\\"\\n    integrity=\\"sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==\\"\\n    crossorigin=\\"\\"\\n/>\\n\\n{#if browser}\\n    <div id={mapid.toString()} class='mapid'></div>\\n{/if}\\n<!-- <div class='mapid m-0 p-0 rounded-3' use:mapAction></div> -->\\n<!-- <div class='mapid m-0 p-0 rounded-3'></div> -->\\n\\n\\n<style>\\n    .mapid { \\n        height: 230px; \\n    }\\n</style>"],"names":[],"mappings":"AAqDI,MAAM,eAAC,CAAC,AACJ,MAAM,CAAE,KAAK,AACjB,CAAC"}`
};
const MapComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { adresse = "" } = $$props;
  let { latitude = 0 } = $$props;
  let { longitude = 0 } = $$props;
  let { mapid = "id" } = $$props;
  if ($$props.adresse === void 0 && $$bindings.adresse && adresse !== void 0)
    $$bindings.adresse(adresse);
  if ($$props.latitude === void 0 && $$bindings.latitude && latitude !== void 0)
    $$bindings.latitude(latitude);
  if ($$props.longitude === void 0 && $$bindings.longitude && longitude !== void 0)
    $$bindings.longitude(longitude);
  if ($$props.mapid === void 0 && $$bindings.mapid && mapid !== void 0)
    $$bindings.mapid(mapid);
  $$result.css.add(css$3);
  return `
<link rel="${"stylesheet"}" href="${"https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"}" integrity="${"sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="}" crossorigin="${""}">

${``}

`;
});
const LieuxComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { values = [] } = $$props;
  let { styles = [] } = $$props;
  let { admin = "false" } = $$props;
  let { edit: edit2 = "false" } = $$props;
  let { updateContent } = $$props;
  const updateMovedArray = async (array) => {
    values[0].values = array;
    values = values;
    updateContent();
  };
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.styles === void 0 && $$bindings.styles && styles !== void 0)
    $$bindings.styles(styles);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.edit === void 0 && $$bindings.edit && edit2 !== void 0)
    $$bindings.edit(edit2);
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        if (values.length === 0) {
          values.push({
            name: "Info pratiques",
            values: [
              {
                name: { name: "ville", values: [], styles: [] },
                adresse: { name: "adresse", values: [], styles: [] },
                telephone: {
                  name: "telephone",
                  values: [],
                  styles: []
                },
                tarifs: { name: "tarifs", values: [], styles: [] },
                access: { name: "access", values: [], styles: [] },
                internet: "",
                maps: { name: "maps", values: [], styles: [] },
                latitude: "",
                longitude: "",
                gmapsLink: ""
              }
            ]
          });
        }
      }
    }
    $$rendered = `
${admin ? `<div class="${"row my-5"}"><div class="${"col text-center"}"><button class="${"btn btn-primary"}">Add a Location</button></div></div>` : ``}

<div class="${"row mt-3 mb-5 gx-5 gy-3"}">${each(values[0].values, (lieu, position) => `
        <div class="${"col-sm-12 col-md-6"}">${validate_component(MovingContent, "MovingContent").$$render($$result, {
      array: values[0].values,
      position,
      admin,
      updateMovedArray
    }, {}, {
      default: () => `<div class="${"p-3 bg-white rounded-3 lieu-content"}"><div class="${"row"}">
                    <div class="${"text-center my-1"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
        edit: edit2,
        admin,
        updateContent,
        values: lieu.name.values,
        styles: lieu.name.styles
      }, {
        values: ($$value) => {
          lieu.name.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          lieu.name.styles = $$value;
          $$settled = false;
        }
      }, {})}
                    </div></div>
            
                <div class="${"row align-items-center"}">${admin ? `<div class="${"row"}"><div class="${"col"}"><span>Lien Google Maps :</span>
                                <input class="${"form-control"}" type="${"text"}"${add_attribute("value", lieu.gmapsLink, 0)}>
                            </div></div>
                        <div class="${"row"}"><div class="${"col"}"><span>Latitude : </span>
                                <input class="${"form-control"}" type="${"number"}"${add_attribute("step", 1e-5, 0)}${add_attribute("value", lieu.latitude, 0)}>
                            </div></div>
                        <div class="${"row"}"><div class="${"col"}"><span>Longitude : </span>
                                <input class="${"form-control"}" type="${"number"}"${add_attribute("step", 1e-5, 0)}${add_attribute("value", lieu.longitude, 0)}></div>
                        </div>` : ``}
                            
                    <div class="${"row align-items-center"}"><div class="${"col text-center my-3"}">${validate_component(MapComponent, "MapComponent").$$render($$result, {
        latitude: lieu.latitude,
        longitude: lieu.longitude,
        adresse: lieu.adresse.values[0] ? lieu.adresse.values[0].value : "Unknown",
        mapid: position
      }, {}, {})}
                        </div></div>


                    <div class="${"row align-items-center mt-1"}"><div class="${"col-2 text-end"}"><i class="${"bi bi-geo-alt text-dark"}"></i></div>
                        <div class="${"col-10 text-start"}"><a${add_attribute("href", lieu.gmapsLink ? lieu.gmapsLink : lieu.gmapsLink = "", 0)} target="${"_blank"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
        edit: edit2,
        admin,
        updateContent,
        values: lieu.adresse.values,
        styles: lieu.adresse.styles
      }, {
        values: ($$value) => {
          lieu.adresse.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          lieu.adresse.styles = $$value;
          $$settled = false;
        }
      }, {})}</a>
                        </div></div>
                    <div class="${"row align-items-center mt-1"}"><div class="${"col-2 text-end"}"><i class="${"bi bi-telephone text-dark"}"></i></div>
                        <div class="${"col-10 text-start"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
        edit: edit2,
        admin,
        updateContent,
        values: lieu.telephone.values,
        styles: lieu.telephone.styles
      }, {
        values: ($$value) => {
          lieu.telephone.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          lieu.telephone.styles = $$value;
          $$settled = false;
        }
      }, {})}
                        </div></div>
                    <div class="${"row align-items-center mt-1"}"><div class="${"col-2 text-end"}"><i class="${"bi bi-globe text-dark"}"></i></div>
                        ${admin ? `<div class="${"row"}"><div class="${"col"}"><span>Site web du cin\xE9ma :</span>
                                    <input class="${"form-control"}" type="${"text"}"${add_attribute("value", lieu.internet, 0)}></div>
                            </div>` : `<div class="${"col-10 text-start"}"><a${add_attribute("href", lieu.internet ? lieu.internet : lieu.internet = "", 0)} target="${"_blank"}" class="${"text-dark"}">Acc\xE9der directement au site web du cin\xE9ma</a>
                            </div>`}
                    </div></div>
                
                <div class="${"mt-3"}">
                    ${validate_component(DropDownSection, "DropDownSection").$$render($$result, {
        sectionTitle: "Acc\xE9s au site",
        visible: false,
        type: "h4"
      }, {}, {
        default: () => `<div class="${"row align-items-center"}"><div class="${"col-12 text-center"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
          edit: edit2,
          admin,
          updateContent,
          values: lieu.access.values,
          styles: lieu.access.styles
        }, {
          values: ($$value) => {
            lieu.access.values = $$value;
            $$settled = false;
          },
          styles: ($$value) => {
            lieu.access.styles = $$value;
            $$settled = false;
          }
        }, {})}
                            </div></div>
                    `
      })}
                    
                    
                    ${validate_component(DropDownSection, "DropDownSection").$$render($$result, {
        sectionTitle: "Tarifs",
        visible: false,
        type: "h4"
      }, {}, {
        default: () => `<div class="${"row align-items-center mt-2"}"><div class="${"col-12 text-center"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
          edit: edit2,
          admin,
          updateContent,
          values: lieu.tarifs.values,
          styles: lieu.tarifs.styles
        }, {
          values: ($$value) => {
            lieu.tarifs.values = $$value;
            $$settled = false;
          },
          styles: ($$value) => {
            lieu.tarifs.styles = $$value;
            $$settled = false;
          }
        }, {})}
                            </div></div>
                    `
      })}
                </div></div>
            `
    })}
        </div>`)}</div>`;
  } while (!$$settled);
  return $$rendered;
});
var ProgrammationComponent_svelte_svelte_type_style_lang = ".image-container.svelte-kurlj3.svelte-kurlj3{position:relative}.image.svelte-kurlj3.svelte-kurlj3{opacity:1;backface-visibility:hidden}.middle.svelte-kurlj3.svelte-kurlj3{transition:.5s ease;opacity:0;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);text-align:center}.event-container.svelte-kurlj3.svelte-kurlj3{-webkit-transform:scale(1);transform:scale(1);transition:.5s ease}.event-container.svelte-kurlj3:hover .middle.svelte-kurlj3{opacity:1}.event-container.svelte-kurlj3.svelte-kurlj3:hover{-webkit-transform:scale(1.13);transform:scale(1.13);transition:.5s ease}";
const css$2 = {
  code: ".image-container.svelte-kurlj3.svelte-kurlj3{position:relative}.image.svelte-kurlj3.svelte-kurlj3{opacity:1;backface-visibility:hidden}.middle.svelte-kurlj3.svelte-kurlj3{transition:.5s ease;opacity:0;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);text-align:center}.event-container.svelte-kurlj3.svelte-kurlj3{-webkit-transform:scale(1);transform:scale(1);transition:.5s ease}.event-container.svelte-kurlj3:hover .middle.svelte-kurlj3{opacity:1}.event-container.svelte-kurlj3.svelte-kurlj3:hover{-webkit-transform:scale(1.13);transform:scale(1.13);transition:.5s ease}",
  map: `{"version":3,"file":"ProgrammationComponent.svelte","sources":["ProgrammationComponent.svelte"],"sourcesContent":["<script>\\nimport { goto } from \\"$app/navigation\\";\\n\\n//import { push } from \\"svelte-spa-router\\";\\n\\nimport { createFilmRequest } from \\"../actions/filmActions\\";\\n\\n    import ImageComponent from \\"./ImageComponent.svelte\\";\\n    import MovingContent from \\"./MovingContent.svelte\\";\\n    import TextComponent from \\"./TextComponent.svelte\\";\\n    export let values=[];\\n    export let styles=[];\\n    export let admin='false';\\n    export let edit='false';\\n    export let updateContent;\\n    export let city='';\\n\\n    styles;\\n\\n    $:{\\n        if (values.length === 0 ) {\\n            values.push({date: ''});\\n        }\\n    }\\n\\n    const updateMovedArray = async(array) => {\\n        values[1].values = array;\\n        values = values;\\n        updateContent && updateContent();\\n    };\\n\\n    const addEventHandler = async () => {\\n        if (values.length === 1) {\\n            values.push({values: []});\\n        }\\n        if (!values[1].values) {\\n            console.log(values);\\n        }\\n        const filmCreatedId = await createFilmRequest(city);\\n\\n        values[1].values.push({ \\n            //date: {name:'date', values:[], styles:[]},\\n            url: {name: 'image', values:[], styles:[]},\\n            film: {name: 'film', values:[], styles:[]},\\n            debat: {name: 'debat', values:[], styles:[]},\\n            horaire: {name: 'horaire', values:[], styles:[]},\\n            filmId: filmCreatedId,\\n        });\\n        //values = values;\\n        updateContent && updateContent();\\n    };\\n\\n<\/script>\\n\\n<div class=\\"row align-items-center\\">\\n    <!-- date des \xE9v\xE9nements -->\\n    <div class='col text-start'>\\n        {#if admin}\\n            <input type='texte' bind:value={values[0].date} on:change={updateContent} placeholder=\\"Date de l'\xE9v\xE9nement\\"/>\\n        {:else}\\n            <h2><span class='text-white bg-primary text-center px-1'>\\n                {values[0].date ? values[0].date.toUpperCase() : 'Journ\xE9e ?' }\\n            </span></h2>\\n        {/if}\\n    </div>\\n</div>\\n<div class='row mt-2'>\\n        {#if values[1] && values[1].values}\\n            {#each values[1].values as evenement, position }\\n                <div class='col-sm-12 col-md-6 my-4'>\\n                    <MovingContent\\n                    array={values[1].values} \\n                    position={position} \\n                    admin={admin} \\n                    updateMovedArray={updateMovedArray}\\n                    >\\n                    <div class='p-3 bg-white rounded-3 event-container'>\\n                        <div class='image-container'>\\n                            <div class=\\"image my-auto\\">\\n                                <ImageComponent\\n                                    bind:values={evenement.url.values}\\n                                    bind:styles={evenement.url.styles}\\n                                    admin={admin}\\n                                    edit={edit}\\n                                    updateContent={updateContent}\\n                                />\\n                            </div>\\n                            {#if !admin}\\n                                <div class=\\"middle\\">\\n                                    <button class='btn btn-secondary mt-3' on:click={() => goto(\`/film/\${evenement.filmId}\`)}>Voir l'\xE9v\xE9nement</button>\\n                                </div>\\n                            {/if}\\n                        </div>\\n                        <div class='film mt-1'>\\n                            <TextComponent\\n                                bind:values={evenement.film.values}\\n                                bind:styles={evenement.film.styles}\\n                                admin={admin}\\n                                edit={edit}\\n                                updateContent={updateContent}\\n                            />\\n                        </div>\\n                        <div class='debat my-1'>\\n                            <TextComponent\\n                                bind:values={evenement.debat.values}\\n                                bind:styles={evenement.debat.styles}\\n                                admin={admin}\\n                                edit={edit}\\n                                updateContent={updateContent}\\n                            />\\n                        </div>\\n                        <div class='horaire'>\\n                            <TextComponent\\n                                bind:values={evenement.horaire.values}\\n                                bind:styles={evenement.horaire.styles}\\n                                admin={admin}\\n                                edit={edit}\\n                                updateContent={updateContent}\\n                            />\\n                        </div>\\n                    </div>\\n                    </MovingContent>\\n                </div>\\n            {/each}\\n        {/if}\\n        {#if admin && updateContent}\\n            <div class='row'>\\n                <div class='col text-center'>\\n                    <button class='btn btn-primary text-center' on:click={addEventHandler}>Add Event</button>\\n                </div>\\n            </div>\\n        {/if}\\n\\n\\n</div>\\n\\n<style>\\n    .image-container {\\n        position: relative;\\n    }\\n    .image {\\n        opacity: 1;\\n        backface-visibility: hidden;\\n    }\\n    .middle {\\n        transition: .5s ease;\\n        opacity: 0;\\n        position: absolute;\\n        top: 50%;\\n        left: 50%;\\n        transform: translate(-50%, -50%);\\n        -ms-transform: translate(-50%, -50%);\\n        text-align: center;\\n    }\\n    .event-container {\\n        -webkit-transform: scale(1);\\n\\t    transform: scale(1);\\n        transition: .5s ease;\\n    }\\n    .event-container:hover .middle {\\n        opacity: 1;\\n    }\\n    .event-container:hover {\\n        -webkit-transform: scale(1.13);\\n\\t    transform: scale(1.13);\\n        transition: .5s ease;\\n    }\\n    \\n</style>"],"names":[],"mappings":"AAyII,gBAAgB,4BAAC,CAAC,AACd,QAAQ,CAAE,QAAQ,AACtB,CAAC,AACD,MAAM,4BAAC,CAAC,AACJ,OAAO,CAAE,CAAC,CACV,mBAAmB,CAAE,MAAM,AAC/B,CAAC,AACD,OAAO,4BAAC,CAAC,AACL,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,OAAO,CAAE,CAAC,CACV,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,GAAG,CACR,IAAI,CAAE,GAAG,CACT,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAChC,aAAa,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CACpC,UAAU,CAAE,MAAM,AACtB,CAAC,AACD,gBAAgB,4BAAC,CAAC,AACd,iBAAiB,CAAE,MAAM,CAAC,CAAC,CAC9B,SAAS,CAAE,MAAM,CAAC,CAAC,CAChB,UAAU,CAAE,GAAG,CAAC,IAAI,AACxB,CAAC,AACD,8BAAgB,MAAM,CAAC,OAAO,cAAC,CAAC,AAC5B,OAAO,CAAE,CAAC,AACd,CAAC,AACD,4CAAgB,MAAM,AAAC,CAAC,AACpB,iBAAiB,CAAE,MAAM,IAAI,CAAC,CACjC,SAAS,CAAE,MAAM,IAAI,CAAC,CACnB,UAAU,CAAE,GAAG,CAAC,IAAI,AACxB,CAAC"}`
};
const ProgrammationComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { values = [] } = $$props;
  let { styles = [] } = $$props;
  let { admin = "false" } = $$props;
  let { edit: edit2 = "false" } = $$props;
  let { updateContent } = $$props;
  let { city = "" } = $$props;
  const updateMovedArray = async (array) => {
    values[1].values = array;
    values = values;
    updateContent && updateContent();
  };
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.styles === void 0 && $$bindings.styles && styles !== void 0)
    $$bindings.styles(styles);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.edit === void 0 && $$bindings.edit && edit2 !== void 0)
    $$bindings.edit(edit2);
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  if ($$props.city === void 0 && $$bindings.city && city !== void 0)
    $$bindings.city(city);
  $$result.css.add(css$2);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        if (values.length === 0) {
          values.push({ date: "" });
        }
      }
    }
    $$rendered = `<div class="${"row align-items-center"}">
    <div class="${"col text-start"}">${admin ? `<input type="${"texte"}" placeholder="${"Date de l'\xE9v\xE9nement"}"${add_attribute("value", values[0].date, 0)}>` : `<h2><span class="${"text-white bg-primary text-center px-1"}">${escape$4(values[0].date ? values[0].date.toUpperCase() : "Journ\xE9e ?")}</span></h2>`}</div></div>
<div class="${"row mt-2"}">${values[1] && values[1].values ? `${each(values[1].values, (evenement, position) => `<div class="${"col-sm-12 col-md-6 my-4"}">${validate_component(MovingContent, "MovingContent").$$render($$result, {
      array: values[1].values,
      position,
      admin,
      updateMovedArray
    }, {}, {
      default: () => `<div class="${"p-3 bg-white rounded-3 event-container svelte-kurlj3"}"><div class="${"image-container svelte-kurlj3"}"><div class="${"image my-auto svelte-kurlj3"}">${validate_component(ImageComponent, "ImageComponent").$$render($$result, {
        admin,
        edit: edit2,
        updateContent,
        values: evenement.url.values,
        styles: evenement.url.styles
      }, {
        values: ($$value) => {
          evenement.url.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          evenement.url.styles = $$value;
          $$settled = false;
        }
      }, {})}</div>
                            ${!admin ? `<div class="${"middle svelte-kurlj3"}"><button class="${"btn btn-secondary mt-3"}">Voir l&#39;\xE9v\xE9nement</button>
                                </div>` : ``}</div>
                        <div class="${"film mt-1"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
        admin,
        edit: edit2,
        updateContent,
        values: evenement.film.values,
        styles: evenement.film.styles
      }, {
        values: ($$value) => {
          evenement.film.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          evenement.film.styles = $$value;
          $$settled = false;
        }
      }, {})}</div>
                        <div class="${"debat my-1"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
        admin,
        edit: edit2,
        updateContent,
        values: evenement.debat.values,
        styles: evenement.debat.styles
      }, {
        values: ($$value) => {
          evenement.debat.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          evenement.debat.styles = $$value;
          $$settled = false;
        }
      }, {})}</div>
                        <div class="${"horaire"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
        admin,
        edit: edit2,
        updateContent,
        values: evenement.horaire.values,
        styles: evenement.horaire.styles
      }, {
        values: ($$value) => {
          evenement.horaire.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          evenement.horaire.styles = $$value;
          $$settled = false;
        }
      }, {})}
                        </div></div>
                    `
    })}
                </div>`)}` : ``}
        ${admin && updateContent ? `<div class="${"row"}"><div class="${"col text-center"}"><button class="${"btn btn-primary text-center"}">Add Event</button></div></div>` : ``}


</div>`;
  } while (!$$settled);
  return $$rendered;
});
const EquipeComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { values = [] } = $$props;
  let { styles = [] } = $$props;
  let { updateContent } = $$props;
  let { edit: edit2 = false } = $$props;
  let { admin = false } = $$props;
  const updateMovedArray = async (array) => {
    values[1].values = array;
    values = values;
    updateContent();
  };
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.styles === void 0 && $$bindings.styles && styles !== void 0)
    $$bindings.styles(styles);
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  if ($$props.edit === void 0 && $$bindings.edit && edit2 !== void 0)
    $$bindings.edit(edit2);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        if (values.length === 0) {
          values.push({
            intro: { name: "intro", values: [], styles: [] }
          });
        }
      }
    }
    $$rendered = `
<div class="${"row"}"><div class="${"col"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
      updateContent,
      admin,
      edit: false,
      values: values[0].intro.values,
      styles: values[0].intro.styles
    }, {
      values: ($$value) => {
        values[0].intro.values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        values[0].intro.styles = $$value;
        $$settled = false;
      }
    }, {})}</div></div>


${values[1] && values[1].values ? `<div class="${"row my-1"}">${each(values[1].values, (personne, position) => `<div class="${"col-sm-6 col-md-4 my-1"}"><div class="${"p-2 mb-2 text-center"}">${validate_component(MovingContent, "MovingContent").$$render($$result, {
      array: values[1].values,
      position,
      admin,
      updateMovedArray
    }, {}, {
      default: () => `${validate_component(ImageComponent, "ImageComponent").$$render($$result, {
        admin,
        edit: false,
        updateContent,
        values: personne.url.values,
        styles: personne.url.styles
      }, {
        values: ($$value) => {
          personne.url.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          personne.url.styles = $$value;
          $$settled = false;
        }
      }, {})}
                ${validate_component(TextComponent, "TextComponent").$$render($$result, {
        admin,
        edit: false,
        updateContent,
        values: personne.nomPrenom.values,
        styles: personne.nomPrenom.styles
      }, {
        values: ($$value) => {
          personne.nomPrenom.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          personne.nomPrenom.styles = $$value;
          $$settled = false;
        }
      }, {})}
                ${validate_component(TextComponent, "TextComponent").$$render($$result, {
        admin,
        edit: false,
        updateContent,
        values: personne.role.values,
        styles: personne.role.styles
      }, {
        values: ($$value) => {
          personne.role.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          personne.role.styles = $$value;
          $$settled = false;
        }
      }, {})}
            `
    })}</div>
        </div>`)}</div>` : ``}
${admin ? `<button class="${"btn btn-primary"}">+ Add</button>` : ``}`;
  } while (!$$settled);
  return $$rendered;
});
const ContactForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $emailSendRequest, $$unsubscribe_emailSendRequest;
  $$unsubscribe_emailSendRequest = subscribe(emailSendRequest, (value) => $emailSendRequest = value);
  let { values = [] } = $$props;
  let { styles = [] } = $$props;
  let { admin = "false" } = $$props;
  let { edit: edit2 = "false" } = $$props;
  let { updateContent } = $$props;
  let subject = "";
  let email = "";
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.styles === void 0 && $$bindings.styles && styles !== void 0)
    $$bindings.styles(styles);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.edit === void 0 && $$bindings.edit && edit2 !== void 0)
    $$bindings.edit(edit2);
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        if (values.length === 0) {
          values.push({
            title: { name: "title", values: [], styles: [] }
          });
        }
      }
    }
    $$rendered = `${validate_component(CustomContainer, "CustomContainer").$$render($$result, { size: { xs: 12, sm: 12, md: 12, lg: 6 } }, {}, {
      default: () => `<div class="${"mt-5"}"><div class="${"text-center my-3"}">${validate_component(TextComponent, "TextComponent").$$render($$result, {
        edit: edit2,
        admin,
        updateContent,
        values: values[0].title.values,
        styles: values[0].title.styles
      }, {
        values: ($$value) => {
          values[0].title.values = $$value;
          $$settled = false;
        },
        styles: ($$value) => {
          values[0].title.styles = $$value;
          $$settled = false;
        }
      }, {})}</div>
    
        <form class="${"row contact-form"}"><div class="${"row align-items-center"}"><div class="${"col-4"}"><label for="${"exampleInputEmail1"}" class="${"form-label"}">Adresse email pour vous joindre *</label></div>
                <div class="${"col-8"}"><input type="${"email"}" class="${"form-control"}" id="${"exampleInputEmail1"}" aria-describedby="${"emailHelp"}" placeholder="${"Email"}" required${add_attribute("value", email, 0)}></div></div>
            <div class="${"row mb-3"}"><div class="${"col text-end"}"><div id="${"emailHelp"}" class="${"form-text"}">Nous ne partagerons pas votre adresse email.</div></div></div>

            <div class="${"row align-items-center"}"><div class="${"col-4"}"><label for="${"emailObject"}" class="${"form-label"}">Objet de votre message *</label></div>
                <div class="${"col-8"}"><input type="${"text"}" class="${"form-control"}" id="${"emailObject"}" aria-describedby="${"emailObjectHelper"}" placeholder="${"Objet de votre message"}" required${add_attribute("value", subject, 0)}></div></div>
            <div class="${"row mb-3"}"><div class="${"col text-end"}"><div id="${"emailObjectHelper"}" class="${"form-text"}">L&#39;objet nous permet d&#39;orienter le traitement de votre message.</div></div></div>

            <div class="${"row mb-3"}"><div class="${"col"}"><label for="${"emailBody"}" class="${"form-label"}">Votre message *</label>
                    <textarea class="${"form-control"}" id="${"emailBody"}" aria-describedby="${"bodyHelper"}" placeholder="${"Votre message"}" rows="${"6"}" required>${""}</textarea>
                    <div id="${"bodyHelper"}" class="${"form-text"}">Saisissez ici votre message.</div></div></div>
            <div class="${"row"}"><div class="${"col text-start"}"><button type="${"submit"}" class="${"btn btn-primary"}">Envoyer</button></div></div></form>
    
        ${$emailSendRequest.message ? `${$emailSendRequest.success ? `${validate_component(Message, "Message").$$render($$result, { color: "success" }, {}, {
        default: () => `${escape$4($emailSendRequest.message)}`
      })}` : `${validate_component(Message, "Message").$$render($$result, { color: "warning" }, {}, {
        default: () => `${escape$4($emailSendRequest.message)}`
      })}`}` : ``}
        
        ${$emailSendRequest.loading ? `${validate_component(Loading, "Loading").$$render($$result, { color: "secondary", number: 3 }, {}, {})}` : ``}</div>`
    })}`;
  } while (!$$settled);
  $$unsubscribe_emailSendRequest();
  return $$rendered;
});
var LayoutComponent_svelte_svelte_type_style_lang = ".content-container.svelte-p27fjs.svelte-p27fjs{position:relative}.content.svelte-p27fjs.svelte-p27fjs{opacity:1;width:100%;height:100%;backface-visibility:hidden}.middle.svelte-p27fjs.svelte-p27fjs{transition:.5s ease;opacity:0.5;position:absolute;top:10%;left:50%;transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);text-align:center;z-index:1000}.content-container.svelte-p27fjs:hover .middle.svelte-p27fjs{opacity:1}.moving-container.svelte-p27fjs.svelte-p27fjs{-webkit-transform:scale(1);transform:scale(1);transition:.5s ease;border:dashed 1px}.moving-container.svelte-p27fjs.svelte-p27fjs:hover{-webkit-transform:scale(1.03);transform:scale(1.03);transition:.5s ease}";
const css$1 = {
  code: ".content-container.svelte-p27fjs.svelte-p27fjs{position:relative}.content.svelte-p27fjs.svelte-p27fjs{opacity:1;width:100%;height:100%;backface-visibility:hidden}.middle.svelte-p27fjs.svelte-p27fjs{transition:.5s ease;opacity:0.5;position:absolute;top:10%;left:50%;transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);text-align:center;z-index:1000}.content-container.svelte-p27fjs:hover .middle.svelte-p27fjs{opacity:1}.moving-container.svelte-p27fjs.svelte-p27fjs{-webkit-transform:scale(1);transform:scale(1);transition:.5s ease;border:dashed 1px}.moving-container.svelte-p27fjs.svelte-p27fjs:hover{-webkit-transform:scale(1.03);transform:scale(1.03);transition:.5s ease}",
  map: `{"version":3,"file":"LayoutComponent.svelte","sources":["LayoutComponent.svelte"],"sourcesContent":["<script>\\n\\n    import { onMount } from \\"svelte\\";\\n    import { Icon, Modal, ModalBody, ModalFooter, ModalHeader } from \\"sveltestrap\\";\\n    import AddContent from \\"./AddContent.svelte\\";\\n    import DisplayCustomComponent from \\"./DisplayCustomComponent.svelte\\";\\n    import EditButton from \\"./EditButton.svelte\\";\\n    import MovingContent from \\"./MovingContent.svelte\\";\\n    export let values=[];\\n    export let styles=[];\\n    export let admin='false';\\n    export let edit='false';\\n    export let updateContent;\\n\\n    styles;\\n\\n    let columnNumber = 1;\\n    let md = 12;\\n\\n    $:{\\n        if (values.length === 0) {\\n            values.push({type:'layout', values:[]});\\n        }\\n    };\\n    $:{\\n        if (!styles.length) {\\n            styles = [];\\n        }\\n    };\\n\\n    onMount(() => {\\n        columnNumber = values.length;\\n        md = 12 / columnNumber;\\n    });\\n\\n    $: columnChangeHandler = (number) => {\\n\\n        if (number > values.length && number >=1) {\\n            values.push({type:'layout', values:[]})\\n        } else {\\n            values.pop();\\n        }\\n        md = 12 / number;\\n        values = values;\\n        updateContent && updateContent();\\n\\n    };\\n\\n    const addToLayout = async(item, position) => {\\n        //values[position] = item;\\n        values[position].values.push(item);\\n\\n        \\n        updateContent && await updateContent();\\n    };\\n\\n    const updateMovedArray = async(array) => {\\n        values = array;\\n        columnNumber = values.length;\\n        updateContent && await updateContent();\\n    }\\n\\n    const toggle = async() => {\\n        if (edit && updateContent) {\\n            await updateContent();\\n        }\\n        edit = !edit;\\n    };\\n\\n    const colors = ['pomme', 'outremer', 'lavande', 'caraibe', 'tangerine', 'ambre', 'light', 'white', 'dark', 'black'];\\n\\n\\n    $: alignContent = styles.filter(x => x.name === 'align-items')[0] && styles.filter(x => x.name === 'align-items')[0].value;\\n    $: bgColor = styles.filter(x => x.name === 'backgroud-color')[0] && styles.filter(x => x.name === 'backgroud-color')[0].value;\\n    $: padding = styles.filter(x => x.name === 'padding')[0] && styles.filter(x => x.name === 'padding')[0].value;\\n    $: marginX = styles.filter(x => x.name === 'marginX')[0] && styles.filter(x => x.name === 'marginX')[0].value;\\n    $: marginY = styles.filter(x => x.name === 'marginY')[0] && styles.filter(x => x.name === 'marginY')[0].value;\\n    $: rounded = styles.filter(x => x.name === 'rounded')[0] && styles.filter(x => x.name === 'rounded')[0].value;\\n    $: border = styles.filter(x => x.name === 'border')[0] && styles.filter(x => x.name === 'border')[0].value;\\n    $: borderColor = styles.filter(x => x.name === 'border-color')[0] && styles.filter(x => x.name === 'border-color')[0].value;\\n\\n    const updateStyle = ({name, value}) => {\\n        const curentStyleItem = styles.filter(x => x.name === name);\\n        if (curentStyleItem.length) {\\n            for (let index = 0; index < styles.length; index++) {\\n                if (styles[index].name === name) {\\n                    styles[index].value = value;\\n                }\\n            }\\n        } else {\\n            styles = [...styles, {name, value}];\\n        }\\n        styles = styles;\\n    };\\n\\n<\/script>\\n\\n<style>\\n    .content-container{\\n        position: relative;\\n    }\\n    .content {\\n        opacity: 1;\\n        width: 100%;\\n        height: 100%;\\n        backface-visibility: hidden;\\n    }\\n    .middle {\\n        transition: .5s ease;\\n        opacity: 0.5;\\n        position: absolute;\\n        top: 10%;\\n        left: 50%;\\n        transform: translate(-50%, -50%);\\n        -ms-transform: translate(-50%, -50%);\\n        text-align: center;\\n        z-index: 1000;\\n    }\\n    .content-container:hover .middle {\\n        opacity: 1;\\n    }\\n    .moving-container {\\n        -webkit-transform: scale(1);\\n\\t    transform: scale(1);\\n        transition: .5s ease;\\n        border: dashed 1px;\\n    }\\n    .moving-container:hover {\\n        -webkit-transform: scale(1.03);\\n\\t    transform: scale(1.03);\\n        transition: .5s ease;\\n    }\\n    \\n</style>\\n\\n<div class='content-container'>\\n\\n    {#if admin}\\n        <div class='middle'>\\n        <EditButton\\n            admin={admin}\\n            updateContent={updateContent}\\n            bind:edit={edit}\\n        />\\n        </div>\\n    {/if}\\n\\n    <Modal isOpen={edit} {toggle} size='lg' scrollable>\\n        <ModalHeader {toggle}>Editer le layout</ModalHeader>\\n        <ModalBody>\\n                <div class=\\"row align-items-center\\">\\n                    <div class='col'>\\n                        <label for=\\"input-columns\\" class=\\"form-label\\">Nombre de colonnes *</label>\\n                        <input type=\\"number\\" class=\\"form-control\\" id=\\"input-columns\\" \\n                            aria-describedby=\\"nombre de colonnes\\" \\n                            placeholder=\\"Nombre de colonnes\\"\\n                            min={1}\\n                            max={4}\\n                            required\\n                            bind:value={columnNumber}\\n                            on:change={(e) => columnChangeHandler(e.target.value)}\\n                        />\\n                        <div class='row py-1'>\\n                            <div class='col'>\\n                                <span>Alignement : </span>\\n                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'align-items', value:'start'})}><Icon name='align-top' /></button>\\n                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'align-items', value:'center'})}><Icon name='align-middle' /></button>\\n                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'align-items', value:'end'})}><Icon name='align-bottom' /></button>\\n                            </div>\\n                        </div>\\n                        <div class='row py-1'>\\n                            <div class='col'>\\n                                <span>Fond : </span>\\n                                {#each colors as color}\\n                                    <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'backgroud-color', value:\`bg-\${color}\`})}><Icon name='file-font-fill' class={\`text-\${color}\`} /></button>\\n                                {/each}\\n                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'backgroud-color', value:\`\`})}>Transparent</button>\\n                            </div>\\n                        </div>\\n                        <div class='row py-1'>\\n                            <div class='col'>\\n                                <span>Padding : </span>\\n                                <button class='btn btn-light p-0' on:click={() => updateStyle({name:'padding', value:'p-0'})}><span>p-0</span></button>\\n                                <button class='btn btn-light p-1' on:click={() => updateStyle({name:'padding', value:'p-1'})}><span>p-1</span></button>\\n                                <button class='btn btn-light p-2' on:click={() => updateStyle({name:'padding', value:'p-2'})}><span>p-2</span></button>\\n                                <button class='btn btn-light p-3' on:click={() => updateStyle({name:'padding', value:'p-3'})}><span>p-3</span></button>\\n                                <button class='btn btn-light p-4' on:click={() => updateStyle({name:'padding', value:'p-4'})}><span>p-4</span></button>\\n                                <button class='btn btn-light p-5' on:click={() => updateStyle({name:'padding', value:'p-5'})}><span>p-5</span></button>\\n                            </div>\\n                        </div>\\n                        <div class=\\"row py-1\\">\\n                            <div class='col'>\\n                                <span>Margin X : </span>\\n                                <button class='btn btn-light mx-0' on:click={() => updateStyle({name:'marginX', value:'mx-0'})}><span>marginX-0</span></button>\\n                                <button class='btn btn-light mx-1' on:click={() => updateStyle({name:'marginX', value:'mx-1'})}><span>marginX-1</span></button>\\n                                <button class='btn btn-light mx-2' on:click={() => updateStyle({name:'marginX', value:'mx-2'})}><span>marginX-2</span></button>\\n                                <button class='btn btn-light mx-3' on:click={() => updateStyle({name:'marginX', value:'mx-3'})}><span>marginX-3</span></button>\\n                                <button class='btn btn-light mx-4' on:click={() => updateStyle({name:'marginX', value:'mx-4'})}><span>marginX-4</span></button>\\n                                <button class='btn btn-light mx-5' on:click={() => updateStyle({name:'marginX', value:'mx-5'})}><span>marginX-5</span></button>\\n                            </div>\\n                        </div>\\n                        <div class=\\"row py-1\\">\\n                            <div class='col'>\\n                                <span>Margin Y : </span>\\n                                <button class='btn btn-light my-0' on:click={() => updateStyle({name:'marginY', value:'my-0'})}><span>marginY-0</span></button>\\n                                <button class='btn btn-light my-1' on:click={() => updateStyle({name:'marginY', value:'my-1'})}><span>marginY-1</span></button>\\n                                <button class='btn btn-light my-2' on:click={() => updateStyle({name:'marginY', value:'my-2'})}><span>marginY-2</span></button>\\n                                <button class='btn btn-light my-3' on:click={() => updateStyle({name:'marginY', value:'my-3'})}><span>marginY-3</span></button>\\n                                <button class='btn btn-light my-4' on:click={() => updateStyle({name:'marginY', value:'my-4'})}><span>marginY-4</span></button>\\n                                <button class='btn btn-light my-5' on:click={() => updateStyle({name:'marginY', value:'my-5'})}><span>marginY-5</span></button>\\n                            </div>\\n                        </div>\\n                        <div class='row py-1'>\\n                            <div class='col'>\\n                                <span>Bordure : </span>\\n                                <button class='btn btn-light px-1 rounded-0' on:click={() => updateStyle({name:'rounded', value:'rounded-0'})}><span>r-0</span></button>\\n                                <button class='btn btn-light px-1 rounded-1' on:click={() => updateStyle({name:'rounded', value:'rounded-1'})}><span>r-1</span></button>\\n                                <button class='btn btn-light px-1 rounded-2' on:click={() => updateStyle({name:'rounded', value:'rounded-2'})}><span>r-2</span></button>\\n                                <button class='btn btn-light px-1 rounded-3' on:click={() => updateStyle({name:'rounded', value:'rounded-3'})}><span>r-3</span></button>\\n                            </div>\\n                        </div>\\n                        <div class='row py-1'>\\n                            <div class='col'>\\n                                <span>Couleur de la bordure : </span>\\n                                {#each colors as color}\\n                                    <button class='px-1 btn btn-light' on:click={() => {\\n                                        updateStyle({name:'border-color', value:\`border-\${color}\`});\\n                                        updateStyle({name:'border', value:\`border\`});\\n                                    }}>\\n                                        <Icon name='border-outer' class={\`text-\${color}\`} />\\n                                    </button>                            \\n                                {/each}\\n                                <button class='px-1 btn btn-light' on:click={() => updateStyle({name:'border', value:''})}>Transparent</button>\\n                            </div>\\n                        </div>\\n                    </div>\\n                </div>\\n\\n                <p class='my-3'><strong>Pr\xE9visualisation</strong></p>\\n                <div class={\`row gx-2 align-items-\${alignContent} \${bgColor} \${padding} \${marginX} \${marginY} \${rounded} \${border} \${borderColor}\`}>\\n                    {#each values as column, position}\\n                        <div class={\`col-sm-12 col-md-\${md.toString()} border border-light\`} style={\`min-height: 5vh;\`};>\\n                            Colonne {position}                                \\n                        </div>\\n                    {/each}\\n                </div>\\n        </ModalBody>\\n        <ModalFooter>\\n            <button class=\\"btn btn-primary\\" on:click={toggle}>Enregistrer</button>\\n            <button class=\\"btn btn-secondary\\" on:click={toggle}>Cancel</button>\\n        </ModalFooter>\\n    </Modal> \\n    \\n    <div class={\`row gx-2 content align-items-\${alignContent} \${bgColor} \${padding} \${marginX} \${marginY} \${rounded} \${border} \${borderColor}\`}>\\n        {#each values as column, position}\\n            <div class={\`col-sm-12 col-md-\${md.toString()}\`} style={\`min-height: 5vh;\`};>\\n                <MovingContent \\n                    array={values} \\n                    position={position} \\n                    admin={admin} \\n                    updateMovedArray={updateMovedArray}\\n                    addContent={null}\\n                >\\n                \\n                {#each column.values as content, pos}\\n                    <MovingContent \\n                        array={column.values} \\n                        position={pos} \\n                        admin={admin} \\n                        updateMovedArray={async (array) => {\\n                            values[position].values = array;\\n                            updateContent && await updateContent();\\n                        }}\\n                        addContent={null}\\n                    >\\n                        <DisplayCustomComponent \\n                            bind:value={content.value}\\n                            bind:values={content.values}\\n                            bind:styles={content.styles}\\n                            type={content.type}\\n                            updateContent={updateContent}\\n                            admin={admin}\\n                            edit={false}\\n                            city={\\"\\"}\\n                        />\\n                    </MovingContent>\\n                {/each}\\n\\n                {#if admin}\\n                    <!-- <AddContent admin={admin} addContent={addContent}/> -->\\n                    <div class=\\"moving-container border-light rounded-3 mt-3 mb-1 py-1 px-3 bg-lavande shadow-lg text-center\\">\\n                        <AddContent admin={admin} position={position} addToLayout={addToLayout} />\\n                    </div>\\n                {/if}\\n                    \\n                </MovingContent>\\n            </div>\\n        {/each}\\n    </div>\\n\\n</div>"],"names":[],"mappings":"AAkGI,8CAAkB,CAAC,AACf,QAAQ,CAAE,QAAQ,AACtB,CAAC,AACD,QAAQ,4BAAC,CAAC,AACN,OAAO,CAAE,CAAC,CACV,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,mBAAmB,CAAE,MAAM,AAC/B,CAAC,AACD,OAAO,4BAAC,CAAC,AACL,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,OAAO,CAAE,GAAG,CACZ,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,GAAG,CACR,IAAI,CAAE,GAAG,CACT,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAChC,aAAa,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CACpC,UAAU,CAAE,MAAM,CAClB,OAAO,CAAE,IAAI,AACjB,CAAC,AACD,gCAAkB,MAAM,CAAC,OAAO,cAAC,CAAC,AAC9B,OAAO,CAAE,CAAC,AACd,CAAC,AACD,iBAAiB,4BAAC,CAAC,AACf,iBAAiB,CAAE,MAAM,CAAC,CAAC,CAC9B,SAAS,CAAE,MAAM,CAAC,CAAC,CAChB,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,MAAM,CAAE,MAAM,CAAC,GAAG,AACtB,CAAC,AACD,6CAAiB,MAAM,AAAC,CAAC,AACrB,iBAAiB,CAAE,MAAM,IAAI,CAAC,CACjC,SAAS,CAAE,MAAM,IAAI,CAAC,CACnB,UAAU,CAAE,GAAG,CAAC,IAAI,AACxB,CAAC"}`
};
const LayoutComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let alignContent;
  let bgColor;
  let padding;
  let marginX;
  let marginY;
  let rounded;
  let border;
  let borderColor;
  let { values = [] } = $$props;
  let { styles = [] } = $$props;
  let { admin = "false" } = $$props;
  let { edit: edit2 = "false" } = $$props;
  let { updateContent } = $$props;
  let columnNumber = 1;
  let md = 12;
  const addToLayout = async (item, position) => {
    values[position].values.push(item);
    updateContent && await updateContent();
  };
  const updateMovedArray = async (array) => {
    values = array;
    columnNumber = values.length;
    updateContent && await updateContent();
  };
  const toggle = async () => {
    if (edit2 && updateContent) {
      await updateContent();
    }
    edit2 = !edit2;
  };
  const colors = [
    "pomme",
    "outremer",
    "lavande",
    "caraibe",
    "tangerine",
    "ambre",
    "light",
    "white",
    "dark",
    "black"
  ];
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.styles === void 0 && $$bindings.styles && styles !== void 0)
    $$bindings.styles(styles);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.edit === void 0 && $$bindings.edit && edit2 !== void 0)
    $$bindings.edit(edit2);
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        if (values.length === 0) {
          values.push({ type: "layout", values: [] });
        }
      }
    }
    {
      {
        if (!styles.length) {
          styles = [];
        }
      }
    }
    alignContent = styles.filter((x) => x.name === "align-items")[0] && styles.filter((x) => x.name === "align-items")[0].value;
    bgColor = styles.filter((x) => x.name === "backgroud-color")[0] && styles.filter((x) => x.name === "backgroud-color")[0].value;
    padding = styles.filter((x) => x.name === "padding")[0] && styles.filter((x) => x.name === "padding")[0].value;
    marginX = styles.filter((x) => x.name === "marginX")[0] && styles.filter((x) => x.name === "marginX")[0].value;
    marginY = styles.filter((x) => x.name === "marginY")[0] && styles.filter((x) => x.name === "marginY")[0].value;
    rounded = styles.filter((x) => x.name === "rounded")[0] && styles.filter((x) => x.name === "rounded")[0].value;
    border = styles.filter((x) => x.name === "border")[0] && styles.filter((x) => x.name === "border")[0].value;
    borderColor = styles.filter((x) => x.name === "border-color")[0] && styles.filter((x) => x.name === "border-color")[0].value;
    $$rendered = `<div class="${"content-container svelte-p27fjs"}">${admin ? `<div class="${"middle svelte-p27fjs"}">${validate_component(EditButton, "EditButton").$$render($$result, { admin, updateContent, edit: edit2 }, {
      edit: ($$value) => {
        edit2 = $$value;
        $$settled = false;
      }
    }, {})}</div>` : ``}

    ${validate_component(Modal, "Modal").$$render($$result, {
      isOpen: edit2,
      toggle,
      size: "lg",
      scrollable: true
    }, {}, {
      default: () => `${validate_component(ModalHeader, "ModalHeader").$$render($$result, { toggle }, {}, { default: () => `Editer le layout` })}
        ${validate_component(ModalBody, "ModalBody").$$render($$result, {}, {}, {
        default: () => `<div class="${"row align-items-center"}"><div class="${"col"}"><label for="${"input-columns"}" class="${"form-label"}">Nombre de colonnes *</label>
                        <input type="${"number"}" class="${"form-control"}" id="${"input-columns"}" aria-describedby="${"nombre de colonnes"}" placeholder="${"Nombre de colonnes"}"${add_attribute("min", 1, 0)}${add_attribute("max", 4, 0)} required${add_attribute("value", columnNumber, 0)}>
                        <div class="${"row py-1"}"><div class="${"col"}"><span>Alignement : </span>
                                <button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, { name: "align-top" }, {}, {})}</button>
                                <button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, { name: "align-middle" }, {}, {})}</button>
                                <button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, { name: "align-bottom" }, {}, {})}</button></div></div>
                        <div class="${"row py-1"}"><div class="${"col"}"><span>Fond : </span>
                                ${each(colors, (color) => `<button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, {
          name: "file-font-fill",
          class: `text-${color}`
        }, {}, {})}</button>`)}
                                <button class="${"px-1 btn btn-light"}">Transparent</button></div></div>
                        <div class="${"row py-1"}"><div class="${"col"}"><span>Padding : </span>
                                <button class="${"btn btn-light p-0"}"><span>p-0</span></button>
                                <button class="${"btn btn-light p-1"}"><span>p-1</span></button>
                                <button class="${"btn btn-light p-2"}"><span>p-2</span></button>
                                <button class="${"btn btn-light p-3"}"><span>p-3</span></button>
                                <button class="${"btn btn-light p-4"}"><span>p-4</span></button>
                                <button class="${"btn btn-light p-5"}"><span>p-5</span></button></div></div>
                        <div class="${"row py-1"}"><div class="${"col"}"><span>Margin X : </span>
                                <button class="${"btn btn-light mx-0"}"><span>marginX-0</span></button>
                                <button class="${"btn btn-light mx-1"}"><span>marginX-1</span></button>
                                <button class="${"btn btn-light mx-2"}"><span>marginX-2</span></button>
                                <button class="${"btn btn-light mx-3"}"><span>marginX-3</span></button>
                                <button class="${"btn btn-light mx-4"}"><span>marginX-4</span></button>
                                <button class="${"btn btn-light mx-5"}"><span>marginX-5</span></button></div></div>
                        <div class="${"row py-1"}"><div class="${"col"}"><span>Margin Y : </span>
                                <button class="${"btn btn-light my-0"}"><span>marginY-0</span></button>
                                <button class="${"btn btn-light my-1"}"><span>marginY-1</span></button>
                                <button class="${"btn btn-light my-2"}"><span>marginY-2</span></button>
                                <button class="${"btn btn-light my-3"}"><span>marginY-3</span></button>
                                <button class="${"btn btn-light my-4"}"><span>marginY-4</span></button>
                                <button class="${"btn btn-light my-5"}"><span>marginY-5</span></button></div></div>
                        <div class="${"row py-1"}"><div class="${"col"}"><span>Bordure : </span>
                                <button class="${"btn btn-light px-1 rounded-0"}"><span>r-0</span></button>
                                <button class="${"btn btn-light px-1 rounded-1"}"><span>r-1</span></button>
                                <button class="${"btn btn-light px-1 rounded-2"}"><span>r-2</span></button>
                                <button class="${"btn btn-light px-1 rounded-3"}"><span>r-3</span></button></div></div>
                        <div class="${"row py-1"}"><div class="${"col"}"><span>Couleur de la bordure : </span>
                                ${each(colors, (color) => `<button class="${"px-1 btn btn-light"}">${validate_component(Icon, "Icon").$$render($$result, {
          name: "border-outer",
          class: `text-${color}`
        }, {}, {})}
                                    </button>`)}
                                <button class="${"px-1 btn btn-light"}">Transparent</button></div></div></div></div>

                <p class="${"my-3"}"><strong>Pr\xE9visualisation</strong></p>
                <div class="${escape$4(null_to_empty(`row gx-2 align-items-${alignContent} ${bgColor} ${padding} ${marginX} ${marginY} ${rounded} ${border} ${borderColor}`)) + " svelte-p27fjs"}">${each(values, (column, position) => `<div class="${escape$4(null_to_empty(`col-sm-12 col-md-${md.toString()} border border-light`)) + " svelte-p27fjs"}" style="${escape$4(`min-height: 5vh;`) + ";"}">Colonne ${escape$4(position)}                                
                        </div>`)}</div>`
      })}
        ${validate_component(ModalFooter, "ModalFooter").$$render($$result, {}, {}, {
        default: () => `<button class="${"btn btn-primary"}">Enregistrer</button>
            <button class="${"btn btn-secondary"}">Cancel</button>`
      })}`
    })} 
    
    <div class="${escape$4(null_to_empty(`row gx-2 content align-items-${alignContent} ${bgColor} ${padding} ${marginX} ${marginY} ${rounded} ${border} ${borderColor}`)) + " svelte-p27fjs"}">${each(values, (column, position) => `<div class="${escape$4(null_to_empty(`col-sm-12 col-md-${md.toString()}`)) + " svelte-p27fjs"}" style="${escape$4(`min-height: 5vh;`) + ";"}">${validate_component(MovingContent, "MovingContent").$$render($$result, {
      array: values,
      position,
      admin,
      updateMovedArray,
      addContent: null
    }, {}, {
      default: () => `${each(column.values, (content, pos) => `${validate_component(MovingContent, "MovingContent").$$render($$result, {
        array: column.values,
        position: pos,
        admin,
        updateMovedArray: async (array) => {
          values[position].values = array;
          updateContent && await updateContent();
        },
        addContent: null
      }, {}, {
        default: () => `${validate_component(DisplayCustomComponent, "DisplayCustomComponent").$$render($$result, {
          type: content.type,
          updateContent,
          admin,
          edit: false,
          city: "",
          value: content.value,
          values: content.values,
          styles: content.styles
        }, {
          value: ($$value) => {
            content.value = $$value;
            $$settled = false;
          },
          values: ($$value) => {
            content.values = $$value;
            $$settled = false;
          },
          styles: ($$value) => {
            content.styles = $$value;
            $$settled = false;
          }
        }, {})}
                    `
      })}`)}

                ${admin ? `
                    <div class="${"moving-container border-light rounded-3 mt-3 mb-1 py-1 px-3 bg-lavande shadow-lg text-center svelte-p27fjs"}">${validate_component(AddContent, "AddContent").$$render($$result, { admin, position, addToLayout }, {}, {})}
                    </div>` : ``}
                    
                `
    })}
            </div>`)}</div></div>`;
  } while (!$$settled);
  return $$rendered;
});
const DisplayCustomComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { type = "" } = $$props;
  let { updateContent = null } = $$props;
  let { admin = false } = $$props;
  let { styles = [] } = $$props;
  let { values = [] } = $$props;
  let { edit: edit2 = false } = $$props;
  let { city = "" } = $$props;
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.updateContent === void 0 && $$bindings.updateContent && updateContent !== void 0)
    $$bindings.updateContent(updateContent);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0)
    $$bindings.admin(admin);
  if ($$props.styles === void 0 && $$bindings.styles && styles !== void 0)
    $$bindings.styles(styles);
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.edit === void 0 && $$bindings.edit && edit2 !== void 0)
    $$bindings.edit(edit2);
  if ($$props.city === void 0 && $$bindings.city && city !== void 0)
    $$bindings.city(city);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${type === "textComponent" ? `${validate_component(TextComponent, "TextComponent").$$render($$result, {
      updateContent,
      admin,
      edit: edit2,
      values,
      styles
    }, {
      values: ($$value) => {
        values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        styles = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

${type === "imageComponent" ? `${validate_component(ImageComponent, "ImageComponent").$$render($$result, {
      updateContent,
      admin,
      edit: edit2,
      values,
      styles
    }, {
      values: ($$value) => {
        values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        styles = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

${type === "videoComponent" ? `${validate_component(VideoComponent, "VideoComponent").$$render($$result, {
      updateContent,
      admin,
      edit: edit2,
      values,
      styles
    }, {
      values: ($$value) => {
        values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        styles = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

${type === "carouselComponent" ? `${validate_component(CarouselComponent, "CarouselComponent").$$render($$result, {
      updateContent,
      admin,
      edit: edit2,
      values,
      styles
    }, {
      values: ($$value) => {
        values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        styles = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

${type === "editoComponent" ? `${validate_component(EditoComponent, "EditoComponent").$$render($$result, {
      updateContent,
      admin,
      edit: edit2,
      values,
      styles
    }, {
      values: ($$value) => {
        values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        styles = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

${type === "articlesComponent" ? `${validate_component(ArticlesComponent, "ArticlesComponent").$$render($$result, {
      updateContent,
      admin,
      edit: edit2,
      values,
      styles
    }, {
      values: ($$value) => {
        values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        styles = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

${type === "partenairesComponent" ? `${validate_component(PartenairesComponent, "PartenairesComponent").$$render($$result, {
      updateContent,
      admin,
      edit: edit2,
      values,
      styles
    }, {
      values: ($$value) => {
        values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        styles = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

${type === "infoComponent" ? `${validate_component(LieuxComponent, "LieuxComponent").$$render($$result, {
      updateContent,
      admin,
      edit: edit2,
      values,
      styles
    }, {
      values: ($$value) => {
        values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        styles = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

${type === "programmationComponent" ? `${validate_component(ProgrammationComponent, "ProgrammationComponent").$$render($$result, {
      updateContent,
      admin,
      edit: edit2,
      city,
      values,
      styles
    }, {
      values: ($$value) => {
        values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        styles = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

${type === "equipeComponent" ? `${validate_component(EquipeComponent, "EquipeComponent").$$render($$result, {
      updateContent,
      admin,
      edit: edit2,
      values,
      styles
    }, {
      values: ($$value) => {
        values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        styles = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

${type === "contactComponent" ? `${validate_component(ContactForm, "ContactForm").$$render($$result, {
      updateContent,
      admin,
      edit: edit2,
      values,
      styles
    }, {
      values: ($$value) => {
        values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        styles = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

${type === "layoutComponent" ? `${validate_component(LayoutComponent, "LayoutComponent").$$render($$result, {
      updateContent,
      admin,
      edit: edit2,
      values,
      styles
    }, {
      values: ($$value) => {
        values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        styles = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

${type === "test" ? `${validate_component(TestComponent, "TestComponent").$$render($$result, {
      updateContent,
      admin,
      edit: edit2,
      values,
      styles
    }, {
      values: ($$value) => {
        values = $$value;
        $$settled = false;
      },
      styles: ($$value) => {
        styles = $$value;
        $$settled = false;
      }
    }, {})}` : ``}`;
  } while (!$$settled);
  return $$rendered;
});
var ____data__svelte_svelte_type_style_lang = ".moving-container.svelte-187qscu{-webkit-transform:scale(1);transform:scale(1);transition:.5s ease;border:dashed 1px}.moving-container.svelte-187qscu:hover{-webkit-transform:scale(1.03);transform:scale(1.03);transition:.5s ease}";
const css = {
  code: ".moving-container.svelte-187qscu{-webkit-transform:scale(1);transform:scale(1);transition:.5s ease;border:dashed 1px}.moving-container.svelte-187qscu:hover{-webkit-transform:scale(1.03);transform:scale(1.03);transition:.5s ease}",
  map: `{"version":3,"file":"[...data].svelte","sources":["[...data].svelte"],"sourcesContent":["<script context='module'>\\n\\n    import { getContent } from '../actions/pagesActions';\\n    \\n    export const prerender = true;\\n\\n    export async function load({page, fetch, session, context}){\\n\\n        const params = {\xA0name: 'homeContent', city:'' }\\n        \\n        let [name, city] = page.params.data.split('/');\\n        params.name = name !== '' ? name : 'homeContent' ;\\n        params.city = city ? city : '';\\n\\n        //verify if login\\n        let redirection = page.path.split('/login');\\n        \\n        //const pageRequest = await getContent(params.name);\\n        let pageRequest = { content: { content: [], name: '' }, loading: true, message: '' };\\n        if (redirection.length === 1) {\\n            let pageName = page.path.substring(1).replace('/','-');\\n            pageName = pageName === '' ? 'homeContent' : pageName;\\n            pageRequest = await getContent(pageName);\\n        }\\n        return {status:200, props: {pageRequest, params, redirection, page}};\\n    }\\n\\n<\/script>\\n\\n<script>\\n    \\n    export let params;\\n    export let pageRequest;\\n    export let redirection;\\n    export let page;\\n\\n    import { updateOrCreateContent } from '../actions/pagesActions';\\n\\n    import CustomContainer from '../components/CustomContainer.svelte';\\n    import { Col, Row } from 'sveltestrap';\\n    import AdminButton from '../components/AdminButton.svelte';\\n    import MovingContent from '../components/MovingContent.svelte';\\n    import AddContent from '../components/AddContent.svelte';\\n\\n    import config from '../config.json';\\n    const SITE_URL = config.SVELTE_ENV === 'dev' ? config.SITE_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.SITE_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.SITE_URL_PROD : config.SITE_URL_DEV;\\n\\n\\n    import { \\n        userInfo, \\n    } from '../store';\\n    \\n    import DisplayCustomComponent from '../components/DisplayCustomComponent.svelte';\\n    import Message from '../components/Message.svelte';\\n    import Loading from '../components/Loading.svelte';\\n    import { goto } from '$app/navigation';\\n    import { onMount } from 'svelte';\\n    import { browser } from '$app/env';\\n    import SeoComponent from '../components/SeoComponent.svelte';\\n    \\n    // redirect to login page if requested\\n    onMount(() => {\\n        if (redirection.length > 1) {\\n                goto(\`/login?redirection=\${redirection[0]}\`);\\n        }\\n    });\\n\\n    $: isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;\\n    $: {\\n        if (browser && pageRequest.message && !isAuthenticate) {\\n            goto('/');\\n        }\\n    }\\n\\n    let admin = false;\\n\\n    const updateContent = async() => {\\n        pageRequest = await updateOrCreateContent(pageRequest.content);\\n    }\\n\\n    const updateMovedArray = async(array) => {\\n        const tempPageRequest = pageRequest\\n        tempPageRequest.content.content = array;\\n        pageRequest = await updateOrCreateContent(pageRequest.content);\\n    }\\n\\n    const addContent = async(item, position) => {\\n        pageRequest.content.content.splice(position, 0, item);\\n        pageRequest = await updateOrCreateContent(pageRequest.content);\\n    };\\n<\/script>\\n\\n{#if isAuthenticate}\\n    <AdminButton \\n        bind:admin={admin}\\n        isAuthenticate={isAuthenticate}\\n    />\\n{/if}\\n\\n{#if pageRequest.message}\\n    <Message color='warning'>{pageRequest.message}</Message>\\n{/if}\\n\\n{#if pageRequest.loading}\\n    <Loading color='secondary' number={3} />\\n{:else}\\n    <CustomContainer>\\n        <Row class='mt-3'>\\n            <Col>\\n                {#if pageRequest.content && pageRequest.content.content}\\n                    {#each pageRequest.content.content as section, position}\\n                        <MovingContent \\n                            array={pageRequest.content.content} \\n                            position={position} \\n                            admin={admin} \\n                            updateMovedArray={updateMovedArray}\\n                            addContent={addContent}\\n                        >\\n                            <DisplayCustomComponent \\n                                bind:value={section.value}\\n                                bind:values={section.values}\\n                                bind:styles={section.styles}\\n                                type={section.type}\\n                                updateContent={updateContent}\\n                                admin={admin}\\n                                edit={false}\\n                                city={params.city}\\n                            />   \\n                        </MovingContent>\\n                    {/each}\\n                {/if}\\n                {#if admin && pageRequest.content && !pageRequest.content.content.length}\\n                    <div class=\\"moving-container border-light rounded-3 mt-3 mb-1 p-3 bg-lavande shadow-lg text-center\\">\\n                        <AddContent admin={admin} addContent={addContent}/>\\n                    </div>\\n                {/if}\\n            </Col>\\n\\n            <SeoComponent \\n                pageContent={pageRequest.content}\\n                page={page}\\n                siteURL={SITE_URL}\\n                admin={admin}\\n                updateContent={updateContent}\\n            />\\n            \\n        </Row>\\n    </CustomContainer>\\n{/if}\\n\\n\\n<style>\\n    .moving-container {\\n        -webkit-transform: scale(1);\\n\\t    transform: scale(1);\\n        transition: .5s ease;\\n        border: dashed 1px;\\n    }\\n    .moving-container:hover {\\n        -webkit-transform: scale(1.03);\\n\\t    transform: scale(1.03);\\n        transition: .5s ease;\\n    }\\n</style>"],"names":[],"mappings":"AAwJI,iBAAiB,eAAC,CAAC,AACf,iBAAiB,CAAE,MAAM,CAAC,CAAC,CAC9B,SAAS,CAAE,MAAM,CAAC,CAAC,CAChB,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,MAAM,CAAE,MAAM,CAAC,GAAG,AACtB,CAAC,AACD,gCAAiB,MAAM,AAAC,CAAC,AACrB,iBAAiB,CAAE,MAAM,IAAI,CAAC,CACjC,SAAS,CAAE,MAAM,IAAI,CAAC,CACnB,UAAU,CAAE,GAAG,CAAC,IAAI,AACxB,CAAC"}`
};
const prerender = true;
async function load({ page: page2, fetch: fetch2, session, context }) {
  const params = { name: "homeContent", city: "" };
  let [name, city] = page2.params.data.split("/");
  params.name = name !== "" ? name : "homeContent";
  params.city = city ? city : "";
  let redirection = page2.path.split("/login");
  let pageRequest2 = {
    content: { content: [], name: "" },
    loading: true,
    message: ""
  };
  if (redirection.length === 1) {
    let pageName = page2.path.substring(1).replace("/", "-");
    pageName = pageName === "" ? "homeContent" : pageName;
    pageRequest2 = await getContent(pageName);
  }
  return {
    status: 200,
    props: { pageRequest: pageRequest2, params, redirection, page: page2 }
  };
}
const U5B_datau5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isAuthenticate;
  let $userInfo, $$unsubscribe_userInfo;
  $$unsubscribe_userInfo = subscribe(userInfo, (value) => $userInfo = value);
  let { params } = $$props;
  let { pageRequest: pageRequest2 } = $$props;
  let { redirection } = $$props;
  let { page: page2 } = $$props;
  const SITE_URL = config.SITE_URL_DEV;
  let admin = false;
  const updateContent = async () => {
    pageRequest2 = await updateOrCreateContent(pageRequest2.content);
  };
  const updateMovedArray = async (array) => {
    const tempPageRequest = pageRequest2;
    tempPageRequest.content.content = array;
    pageRequest2 = await updateOrCreateContent(pageRequest2.content);
  };
  const addContent = async (item, position) => {
    pageRequest2.content.content.splice(position, 0, item);
    pageRequest2 = await updateOrCreateContent(pageRequest2.content);
  };
  if ($$props.params === void 0 && $$bindings.params && params !== void 0)
    $$bindings.params(params);
  if ($$props.pageRequest === void 0 && $$bindings.pageRequest && pageRequest2 !== void 0)
    $$bindings.pageRequest(pageRequest2);
  if ($$props.redirection === void 0 && $$bindings.redirection && redirection !== void 0)
    $$bindings.redirection(redirection);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    isAuthenticate = $userInfo && $userInfo.profil === "admin" ? true : false;
    $$rendered = `${isAuthenticate ? `${validate_component(AdminButton, "AdminButton").$$render($$result, { isAuthenticate, admin }, {
      admin: ($$value) => {
        admin = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

${pageRequest2.message ? `${validate_component(Message, "Message").$$render($$result, { color: "warning" }, {}, {
      default: () => `${escape$4(pageRequest2.message)}`
    })}` : ``}

${pageRequest2.loading ? `${validate_component(Loading, "Loading").$$render($$result, { color: "secondary", number: 3 }, {}, {})}` : `${validate_component(CustomContainer, "CustomContainer").$$render($$result, {}, {}, {
      default: () => `${validate_component(Row, "Row").$$render($$result, { class: "mt-3" }, {}, {
        default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
          default: () => `${pageRequest2.content && pageRequest2.content.content ? `${each(pageRequest2.content.content, (section, position) => `${validate_component(MovingContent, "MovingContent").$$render($$result, {
            array: pageRequest2.content.content,
            position,
            admin,
            updateMovedArray,
            addContent
          }, {}, {
            default: () => `${validate_component(DisplayCustomComponent, "DisplayCustomComponent").$$render($$result, {
              type: section.type,
              updateContent,
              admin,
              edit: false,
              city: params.city,
              value: section.value,
              values: section.values,
              styles: section.styles
            }, {
              value: ($$value) => {
                section.value = $$value;
                $$settled = false;
              },
              values: ($$value) => {
                section.values = $$value;
                $$settled = false;
              },
              styles: ($$value) => {
                section.styles = $$value;
                $$settled = false;
              }
            }, {})}   
                        `
          })}`)}` : ``}
                ${admin && pageRequest2.content && !pageRequest2.content.content.length ? `<div class="${"moving-container border-light rounded-3 mt-3 mb-1 p-3 bg-lavande shadow-lg text-center svelte-187qscu"}">${validate_component(AddContent, "AddContent").$$render($$result, { admin, addContent }, {}, {})}</div>` : ``}`
        })}

            ${validate_component(SeoComponent, "SeoComponent").$$render($$result, {
          pageContent: pageRequest2.content,
          page: page2,
          siteURL: SITE_URL,
          admin,
          updateContent
        }, {}, {})}`
      })}`
    })}`}`;
  } while (!$$settled);
  $$unsubscribe_userInfo();
  return $$rendered;
});
var ____data_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5B_datau5D,
  prerender,
  load
});
export { init, render };
