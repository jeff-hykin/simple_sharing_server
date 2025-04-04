#!/usr/bin/env -S deno run --allow-all
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// https://deno.land/std@0.128.0/_util/os.ts
var osType = (() => {
  const { Deno: Deno4 } = globalThis;
  if (typeof Deno4?.build?.os === "string") {
    return Deno4.build.os;
  }
  const { navigator } = globalThis;
  if (navigator?.appVersion?.includes?.("Win") ?? false) {
    return "windows";
  }
  return "linux";
})();
var isWindows = osType === "windows";

// https://deno.land/std@0.128.0/path/win32.ts
var win32_exports = {};
__export(win32_exports, {
  basename: () => basename,
  delimiter: () => delimiter,
  dirname: () => dirname,
  extname: () => extname,
  format: () => format,
  fromFileUrl: () => fromFileUrl,
  isAbsolute: () => isAbsolute,
  join: () => join,
  normalize: () => normalize,
  parse: () => parse,
  relative: () => relative,
  resolve: () => resolve,
  sep: () => sep,
  toFileUrl: () => toFileUrl,
  toNamespacedPath: () => toNamespacedPath
});

// https://deno.land/std@0.128.0/path/_constants.ts
var CHAR_UPPERCASE_A = 65;
var CHAR_LOWERCASE_A = 97;
var CHAR_UPPERCASE_Z = 90;
var CHAR_LOWERCASE_Z = 122;
var CHAR_DOT = 46;
var CHAR_FORWARD_SLASH = 47;
var CHAR_BACKWARD_SLASH = 92;
var CHAR_COLON = 58;
var CHAR_QUESTION_MARK = 63;

// https://deno.land/std@0.128.0/path/_util.ts
function assertPath(path5) {
  if (typeof path5 !== "string") {
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(path5)}`
    );
  }
}
function isPosixPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH;
}
function isPathSeparator(code) {
  return isPosixPathSeparator(code) || code === CHAR_BACKWARD_SLASH;
}
function isWindowsDeviceRoot(code) {
  return code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z || code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z;
}
function normalizeString(path5, allowAboveRoot, separator, isPathSeparator4) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i3 = 0, len = path5.length; i3 <= len; ++i3) {
    if (i3 < len) code = path5.charCodeAt(i3);
    else if (isPathSeparator4(code)) break;
    else code = CHAR_FORWARD_SLASH;
    if (isPathSeparator4(code)) {
      if (lastSlash === i3 - 1 || dots === 1) {
      } else if (lastSlash !== i3 - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i3;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i3;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) res += `${separator}..`;
          else res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) res += separator + path5.slice(lastSlash + 1, i3);
        else res = path5.slice(lastSlash + 1, i3);
        lastSegmentLength = i3 - lastSlash - 1;
      }
      lastSlash = i3;
      dots = 0;
    } else if (code === CHAR_DOT && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format(sep7, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir) return base;
  if (dir === pathObject.root) return dir + base;
  return dir + sep7 + base;
}
var WHITESPACE_ENCODINGS = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function encodeWhitespace(string) {
  return string.replaceAll(/[\s]/g, (c2) => {
    return WHITESPACE_ENCODINGS[c2] ?? c2;
  });
}

// https://deno.land/std@0.128.0/_util/assert.ts
var DenoStdInternalError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError(msg);
  }
}

// https://deno.land/std@0.128.0/path/win32.ts
var sep = "\\";
var delimiter = ";";
function resolve(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for (let i3 = pathSegments.length - 1; i3 >= -1; i3--) {
    let path5;
    const { Deno: Deno4 } = globalThis;
    if (i3 >= 0) {
      path5 = pathSegments[i3];
    } else if (!resolvedDevice) {
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a drive-letter-less path without a CWD.");
      }
      path5 = Deno4.cwd();
    } else {
      if (typeof Deno4?.env?.get !== "function" || typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path5 = Deno4.cwd();
      if (path5 === void 0 || path5.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
        path5 = `${resolvedDevice}\\`;
      }
    }
    assertPath(path5);
    const len = path5.length;
    if (len === 0) continue;
    let rootEnd = 0;
    let device = "";
    let isAbsolute7 = false;
    const code = path5.charCodeAt(0);
    if (len > 1) {
      if (isPathSeparator(code)) {
        isAbsolute7 = true;
        if (isPathSeparator(path5.charCodeAt(1))) {
          let j = 2;
          let last = j;
          for (; j < len; ++j) {
            if (isPathSeparator(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            const firstPart = path5.slice(last, j);
            last = j;
            for (; j < len; ++j) {
              if (!isPathSeparator(path5.charCodeAt(j))) break;
            }
            if (j < len && j !== last) {
              last = j;
              for (; j < len; ++j) {
                if (isPathSeparator(path5.charCodeAt(j))) break;
              }
              if (j === len) {
                device = `\\\\${firstPart}\\${path5.slice(last)}`;
                rootEnd = j;
              } else if (j !== last) {
                device = `\\\\${firstPart}\\${path5.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot(code)) {
        if (path5.charCodeAt(1) === CHAR_COLON) {
          device = path5.slice(0, 2);
          rootEnd = 2;
          if (len > 2) {
            if (isPathSeparator(path5.charCodeAt(2))) {
              isAbsolute7 = true;
              rootEnd = 3;
            }
          }
        }
      }
    } else if (isPathSeparator(code)) {
      rootEnd = 1;
      isAbsolute7 = true;
    }
    if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      continue;
    }
    if (resolvedDevice.length === 0 && device.length > 0) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = `${path5.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute7;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0) break;
  }
  resolvedTail = normalizeString(
    resolvedTail,
    !resolvedAbsolute,
    "\\",
    isPathSeparator
  );
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize(path5) {
  assertPath(path5);
  const len = path5.length;
  if (len === 0) return ".";
  let rootEnd = 0;
  let device;
  let isAbsolute7 = false;
  const code = path5.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code)) {
      isAbsolute7 = true;
      if (isPathSeparator(path5.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path5.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          const firstPart = path5.slice(last, j);
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path5.charCodeAt(j))) break;
            }
            if (j === len) {
              return `\\\\${firstPart}\\${path5.slice(last)}\\`;
            } else if (j !== last) {
              device = `\\\\${firstPart}\\${path5.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot(code)) {
      if (path5.charCodeAt(1) === CHAR_COLON) {
        device = path5.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path5.charCodeAt(2))) {
            isAbsolute7 = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator(code)) {
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString(
      path5.slice(rootEnd),
      !isAbsolute7,
      "\\",
      isPathSeparator
    );
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute7) tail = ".";
  if (tail.length > 0 && isPathSeparator(path5.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === void 0) {
    if (isAbsolute7) {
      if (tail.length > 0) return `\\${tail}`;
      else return "\\";
    } else if (tail.length > 0) {
      return tail;
    } else {
      return "";
    }
  } else if (isAbsolute7) {
    if (tail.length > 0) return `${device}\\${tail}`;
    else return `${device}\\`;
  } else if (tail.length > 0) {
    return device + tail;
  } else {
    return device;
  }
}
function isAbsolute(path5) {
  assertPath(path5);
  const len = path5.length;
  if (len === 0) return false;
  const code = path5.charCodeAt(0);
  if (isPathSeparator(code)) {
    return true;
  } else if (isWindowsDeviceRoot(code)) {
    if (len > 2 && path5.charCodeAt(1) === CHAR_COLON) {
      if (isPathSeparator(path5.charCodeAt(2))) return true;
    }
  }
  return false;
}
function join(...paths) {
  const pathsCount = paths.length;
  if (pathsCount === 0) return ".";
  let joined;
  let firstPart = null;
  for (let i3 = 0; i3 < pathsCount; ++i3) {
    const path5 = paths[i3];
    assertPath(path5);
    if (path5.length > 0) {
      if (joined === void 0) joined = firstPart = path5;
      else joined += `\\${path5}`;
    }
  }
  if (joined === void 0) return ".";
  let needsReplace = true;
  let slashCount = 0;
  assert(firstPart != null);
  if (isPathSeparator(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator(firstPart.charCodeAt(2))) ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
  }
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount) {
      if (!isPathSeparator(joined.charCodeAt(slashCount))) break;
    }
    if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize(joined);
}
function relative(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to) return "";
  const fromOrig = resolve(from);
  const toOrig = resolve(to);
  if (fromOrig === toOrig) return "";
  from = fromOrig.toLowerCase();
  to = toOrig.toLowerCase();
  if (from === to) return "";
  let fromStart = 0;
  let fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH) break;
  }
  for (; fromEnd - 1 > fromStart; --fromEnd) {
    if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH) break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 0;
  let toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH) break;
  }
  for (; toEnd - 1 > toStart; --toEnd) {
    if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH) break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i3 = 0;
  for (; i3 <= length; ++i3) {
    if (i3 === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i3) === CHAR_BACKWARD_SLASH) {
          return toOrig.slice(toStart + i3 + 1);
        } else if (i3 === 2) {
          return toOrig.slice(toStart + i3);
        }
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i3) === CHAR_BACKWARD_SLASH) {
          lastCommonSep = i3;
        } else if (i3 === 2) {
          lastCommonSep = 3;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i3);
    const toCode = to.charCodeAt(toStart + i3);
    if (fromCode !== toCode) break;
    else if (fromCode === CHAR_BACKWARD_SLASH) lastCommonSep = i3;
  }
  if (i3 !== length && lastCommonSep === -1) {
    return toOrig;
  }
  let out = "";
  if (lastCommonSep === -1) lastCommonSep = 0;
  for (i3 = fromStart + lastCommonSep + 1; i3 <= fromEnd; ++i3) {
    if (i3 === fromEnd || from.charCodeAt(i3) === CHAR_BACKWARD_SLASH) {
      if (out.length === 0) out += "..";
      else out += "\\..";
    }
  }
  if (out.length > 0) {
    return out + toOrig.slice(toStart + lastCommonSep, toEnd);
  } else {
    toStart += lastCommonSep;
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) ++toStart;
    return toOrig.slice(toStart, toEnd);
  }
}
function toNamespacedPath(path5) {
  if (typeof path5 !== "string") return path5;
  if (path5.length === 0) return "";
  const resolvedPath = resolve(path5);
  if (resolvedPath.length >= 3) {
    if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
      if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
        const code = resolvedPath.charCodeAt(2);
        if (code !== CHAR_QUESTION_MARK && code !== CHAR_DOT) {
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
        }
      }
    } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
      if (resolvedPath.charCodeAt(1) === CHAR_COLON && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
        return `\\\\?\\${resolvedPath}`;
      }
    }
  }
  return path5;
}
function dirname(path5) {
  assertPath(path5);
  const len = path5.length;
  if (len === 0) return ".";
  let rootEnd = -1;
  let end = -1;
  let matchedSlash = true;
  let offset = 0;
  const code = path5.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code)) {
      rootEnd = offset = 1;
      if (isPathSeparator(path5.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path5.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path5.charCodeAt(j))) break;
            }
            if (j === len) {
              return path5;
            }
            if (j !== last) {
              rootEnd = offset = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code)) {
      if (path5.charCodeAt(1) === CHAR_COLON) {
        rootEnd = offset = 2;
        if (len > 2) {
          if (isPathSeparator(path5.charCodeAt(2))) rootEnd = offset = 3;
        }
      }
    }
  } else if (isPathSeparator(code)) {
    return path5;
  }
  for (let i3 = len - 1; i3 >= offset; --i3) {
    if (isPathSeparator(path5.charCodeAt(i3))) {
      if (!matchedSlash) {
        end = i3;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) {
    if (rootEnd === -1) return ".";
    else end = rootEnd;
  }
  return path5.slice(0, end);
}
function basename(path5, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath(path5);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i3;
  if (path5.length >= 2) {
    const drive = path5.charCodeAt(0);
    if (isWindowsDeviceRoot(drive)) {
      if (path5.charCodeAt(1) === CHAR_COLON) start = 2;
    }
  }
  if (ext !== void 0 && ext.length > 0 && ext.length <= path5.length) {
    if (ext.length === path5.length && ext === path5) return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i3 = path5.length - 1; i3 >= start; --i3) {
      const code = path5.charCodeAt(i3);
      if (isPathSeparator(code)) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i3 + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i3;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) end = firstNonSlashEnd;
    else if (end === -1) end = path5.length;
    return path5.slice(start, end);
  } else {
    for (i3 = path5.length - 1; i3 >= start; --i3) {
      if (isPathSeparator(path5.charCodeAt(i3))) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i3 + 1;
      }
    }
    if (end === -1) return "";
    return path5.slice(start, end);
  }
}
function extname(path5) {
  assertPath(path5);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  if (path5.length >= 2 && path5.charCodeAt(1) === CHAR_COLON && isWindowsDeviceRoot(path5.charCodeAt(0))) {
    start = startPart = 2;
  }
  for (let i3 = path5.length - 1; i3 >= start; --i3) {
    const code = path5.charCodeAt(i3);
    if (isPathSeparator(code)) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path5.slice(startDot, end);
}
function format(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format("\\", pathObject);
}
function parse(path5) {
  assertPath(path5);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  const len = path5.length;
  if (len === 0) return ret;
  let rootEnd = 0;
  let code = path5.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code)) {
      rootEnd = 1;
      if (isPathSeparator(path5.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path5.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path5.charCodeAt(j))) break;
            }
            if (j === len) {
              rootEnd = j;
            } else if (j !== last) {
              rootEnd = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code)) {
      if (path5.charCodeAt(1) === CHAR_COLON) {
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path5.charCodeAt(2))) {
            if (len === 3) {
              ret.root = ret.dir = path5;
              return ret;
            }
            rootEnd = 3;
          }
        } else {
          ret.root = ret.dir = path5;
          return ret;
        }
      }
    }
  } else if (isPathSeparator(code)) {
    ret.root = ret.dir = path5;
    return ret;
  }
  if (rootEnd > 0) ret.root = path5.slice(0, rootEnd);
  let startDot = -1;
  let startPart = rootEnd;
  let end = -1;
  let matchedSlash = true;
  let i3 = path5.length - 1;
  let preDotState = 0;
  for (; i3 >= rootEnd; --i3) {
    code = path5.charCodeAt(i3);
    if (isPathSeparator(code)) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      ret.base = ret.name = path5.slice(startPart, end);
    }
  } else {
    ret.name = path5.slice(startPart, startDot);
    ret.base = path5.slice(startPart, end);
    ret.ext = path5.slice(startDot, end);
  }
  if (startPart > 0 && startPart !== rootEnd) {
    ret.dir = path5.slice(0, startPart - 1);
  } else ret.dir = ret.root;
  return ret;
}
function fromFileUrl(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  let path5 = decodeURIComponent(
    url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  ).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname != "") {
    path5 = `\\\\${url.hostname}${path5}`;
  }
  return path5;
}
function toFileUrl(path5) {
  if (!isAbsolute(path5)) {
    throw new TypeError("Must be an absolute path.");
  }
  const [, hostname2, pathname] = path5.match(
    /^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/
  );
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(pathname.replace(/%/g, "%25"));
  if (hostname2 != null && hostname2 != "localhost") {
    url.hostname = hostname2;
    if (!url.hostname) {
      throw new TypeError("Invalid hostname.");
    }
  }
  return url;
}

// https://deno.land/std@0.128.0/path/posix.ts
var posix_exports = {};
__export(posix_exports, {
  basename: () => basename2,
  delimiter: () => delimiter2,
  dirname: () => dirname2,
  extname: () => extname2,
  format: () => format2,
  fromFileUrl: () => fromFileUrl2,
  isAbsolute: () => isAbsolute2,
  join: () => join2,
  normalize: () => normalize2,
  parse: () => parse2,
  relative: () => relative2,
  resolve: () => resolve2,
  sep: () => sep2,
  toFileUrl: () => toFileUrl2,
  toNamespacedPath: () => toNamespacedPath2
});
var sep2 = "/";
var delimiter2 = ":";
function resolve2(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i3 = pathSegments.length - 1; i3 >= -1 && !resolvedAbsolute; i3--) {
    let path5;
    if (i3 >= 0) path5 = pathSegments[i3];
    else {
      const { Deno: Deno4 } = globalThis;
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path5 = Deno4.cwd();
    }
    assertPath(path5);
    if (path5.length === 0) {
      continue;
    }
    resolvedPath = `${path5}/${resolvedPath}`;
    resolvedAbsolute = path5.charCodeAt(0) === CHAR_FORWARD_SLASH;
  }
  resolvedPath = normalizeString(
    resolvedPath,
    !resolvedAbsolute,
    "/",
    isPosixPathSeparator
  );
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0) return `/${resolvedPath}`;
    else return "/";
  } else if (resolvedPath.length > 0) return resolvedPath;
  else return ".";
}
function normalize2(path5) {
  assertPath(path5);
  if (path5.length === 0) return ".";
  const isAbsolute7 = path5.charCodeAt(0) === CHAR_FORWARD_SLASH;
  const trailingSeparator = path5.charCodeAt(path5.length - 1) === CHAR_FORWARD_SLASH;
  path5 = normalizeString(path5, !isAbsolute7, "/", isPosixPathSeparator);
  if (path5.length === 0 && !isAbsolute7) path5 = ".";
  if (path5.length > 0 && trailingSeparator) path5 += "/";
  if (isAbsolute7) return `/${path5}`;
  return path5;
}
function isAbsolute2(path5) {
  assertPath(path5);
  return path5.length > 0 && path5.charCodeAt(0) === CHAR_FORWARD_SLASH;
}
function join2(...paths) {
  if (paths.length === 0) return ".";
  let joined;
  for (let i3 = 0, len = paths.length; i3 < len; ++i3) {
    const path5 = paths[i3];
    assertPath(path5);
    if (path5.length > 0) {
      if (!joined) joined = path5;
      else joined += `/${path5}`;
    }
  }
  if (!joined) return ".";
  return normalize2(joined);
}
function relative2(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to) return "";
  from = resolve2(from);
  to = resolve2(to);
  if (from === to) return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH) break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH) break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i3 = 0;
  for (; i3 <= length; ++i3) {
    if (i3 === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i3) === CHAR_FORWARD_SLASH) {
          return to.slice(toStart + i3 + 1);
        } else if (i3 === 0) {
          return to.slice(toStart + i3);
        }
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i3) === CHAR_FORWARD_SLASH) {
          lastCommonSep = i3;
        } else if (i3 === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i3);
    const toCode = to.charCodeAt(toStart + i3);
    if (fromCode !== toCode) break;
    else if (fromCode === CHAR_FORWARD_SLASH) lastCommonSep = i3;
  }
  let out = "";
  for (i3 = fromStart + lastCommonSep + 1; i3 <= fromEnd; ++i3) {
    if (i3 === fromEnd || from.charCodeAt(i3) === CHAR_FORWARD_SLASH) {
      if (out.length === 0) out += "..";
      else out += "/..";
    }
  }
  if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH) ++toStart;
    return to.slice(toStart);
  }
}
function toNamespacedPath2(path5) {
  return path5;
}
function dirname2(path5) {
  assertPath(path5);
  if (path5.length === 0) return ".";
  const hasRoot = path5.charCodeAt(0) === CHAR_FORWARD_SLASH;
  let end = -1;
  let matchedSlash = true;
  for (let i3 = path5.length - 1; i3 >= 1; --i3) {
    if (path5.charCodeAt(i3) === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        end = i3;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) return hasRoot ? "/" : ".";
  if (hasRoot && end === 1) return "//";
  return path5.slice(0, end);
}
function basename2(path5, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath(path5);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i3;
  if (ext !== void 0 && ext.length > 0 && ext.length <= path5.length) {
    if (ext.length === path5.length && ext === path5) return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i3 = path5.length - 1; i3 >= 0; --i3) {
      const code = path5.charCodeAt(i3);
      if (code === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i3 + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i3;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) end = firstNonSlashEnd;
    else if (end === -1) end = path5.length;
    return path5.slice(start, end);
  } else {
    for (i3 = path5.length - 1; i3 >= 0; --i3) {
      if (path5.charCodeAt(i3) === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i3 + 1;
      }
    }
    if (end === -1) return "";
    return path5.slice(start, end);
  }
}
function extname2(path5) {
  assertPath(path5);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i3 = path5.length - 1; i3 >= 0; --i3) {
    const code = path5.charCodeAt(i3);
    if (code === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path5.slice(startDot, end);
}
function format2(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format("/", pathObject);
}
function parse2(path5) {
  assertPath(path5);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path5.length === 0) return ret;
  const isAbsolute7 = path5.charCodeAt(0) === CHAR_FORWARD_SLASH;
  let start;
  if (isAbsolute7) {
    ret.root = "/";
    start = 1;
  } else {
    start = 0;
  }
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i3 = path5.length - 1;
  let preDotState = 0;
  for (; i3 >= start; --i3) {
    const code = path5.charCodeAt(i3);
    if (code === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (startPart === 0 && isAbsolute7) {
        ret.base = ret.name = path5.slice(1, end);
      } else {
        ret.base = ret.name = path5.slice(startPart, end);
      }
    }
  } else {
    if (startPart === 0 && isAbsolute7) {
      ret.name = path5.slice(1, startDot);
      ret.base = path5.slice(1, end);
    } else {
      ret.name = path5.slice(startPart, startDot);
      ret.base = path5.slice(startPart, end);
    }
    ret.ext = path5.slice(startDot, end);
  }
  if (startPart > 0) ret.dir = path5.slice(0, startPart - 1);
  else if (isAbsolute7) ret.dir = "/";
  return ret;
}
function fromFileUrl2(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return decodeURIComponent(
    url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}
function toFileUrl2(path5) {
  if (!isAbsolute2(path5)) {
    throw new TypeError("Must be an absolute path.");
  }
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(
    path5.replace(/%/g, "%25").replace(/\\/g, "%5C")
  );
  return url;
}

// https://deno.land/std@0.128.0/path/glob.ts
var path = isWindows ? win32_exports : posix_exports;
var { join: join3, normalize: normalize3 } = path;

// https://deno.land/std@0.128.0/path/mod.ts
var path2 = isWindows ? win32_exports : posix_exports;
var {
  basename: basename3,
  delimiter: delimiter3,
  dirname: dirname3,
  extname: extname3,
  format: format3,
  fromFileUrl: fromFileUrl3,
  isAbsolute: isAbsolute3,
  join: join4,
  normalize: normalize4,
  parse: parse3,
  relative: relative3,
  resolve: resolve3,
  sep: sep3,
  toFileUrl: toFileUrl3,
  toNamespacedPath: toNamespacedPath3
} = path2;

// https://deno.land/std@0.133.0/_util/os.ts
var osType2 = (() => {
  const { Deno: Deno4 } = globalThis;
  if (typeof Deno4?.build?.os === "string") {
    return Deno4.build.os;
  }
  const { navigator } = globalThis;
  if (navigator?.appVersion?.includes?.("Win") ?? false) {
    return "windows";
  }
  return "linux";
})();
var isWindows2 = osType2 === "windows";

// https://deno.land/std@0.133.0/path/win32.ts
var win32_exports2 = {};
__export(win32_exports2, {
  basename: () => basename4,
  delimiter: () => delimiter4,
  dirname: () => dirname4,
  extname: () => extname4,
  format: () => format4,
  fromFileUrl: () => fromFileUrl4,
  isAbsolute: () => isAbsolute4,
  join: () => join5,
  normalize: () => normalize5,
  parse: () => parse4,
  relative: () => relative4,
  resolve: () => resolve4,
  sep: () => sep4,
  toFileUrl: () => toFileUrl4,
  toNamespacedPath: () => toNamespacedPath4
});

// https://deno.land/std@0.133.0/path/_constants.ts
var CHAR_UPPERCASE_A2 = 65;
var CHAR_LOWERCASE_A2 = 97;
var CHAR_UPPERCASE_Z2 = 90;
var CHAR_LOWERCASE_Z2 = 122;
var CHAR_DOT2 = 46;
var CHAR_FORWARD_SLASH2 = 47;
var CHAR_BACKWARD_SLASH2 = 92;
var CHAR_COLON2 = 58;
var CHAR_QUESTION_MARK2 = 63;

// https://deno.land/std@0.133.0/path/_util.ts
function assertPath2(path5) {
  if (typeof path5 !== "string") {
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(path5)}`
    );
  }
}
function isPosixPathSeparator2(code) {
  return code === CHAR_FORWARD_SLASH2;
}
function isPathSeparator2(code) {
  return isPosixPathSeparator2(code) || code === CHAR_BACKWARD_SLASH2;
}
function isWindowsDeviceRoot2(code) {
  return code >= CHAR_LOWERCASE_A2 && code <= CHAR_LOWERCASE_Z2 || code >= CHAR_UPPERCASE_A2 && code <= CHAR_UPPERCASE_Z2;
}
function normalizeString2(path5, allowAboveRoot, separator, isPathSeparator4) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i3 = 0, len = path5.length; i3 <= len; ++i3) {
    if (i3 < len) code = path5.charCodeAt(i3);
    else if (isPathSeparator4(code)) break;
    else code = CHAR_FORWARD_SLASH2;
    if (isPathSeparator4(code)) {
      if (lastSlash === i3 - 1 || dots === 1) {
      } else if (lastSlash !== i3 - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT2 || res.charCodeAt(res.length - 2) !== CHAR_DOT2) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i3;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i3;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) res += `${separator}..`;
          else res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) res += separator + path5.slice(lastSlash + 1, i3);
        else res = path5.slice(lastSlash + 1, i3);
        lastSegmentLength = i3 - lastSlash - 1;
      }
      lastSlash = i3;
      dots = 0;
    } else if (code === CHAR_DOT2 && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format2(sep7, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir) return base;
  if (dir === pathObject.root) return dir + base;
  return dir + sep7 + base;
}
var WHITESPACE_ENCODINGS2 = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function encodeWhitespace2(string) {
  return string.replaceAll(/[\s]/g, (c2) => {
    return WHITESPACE_ENCODINGS2[c2] ?? c2;
  });
}

// https://deno.land/std@0.133.0/_util/assert.ts
var DenoStdInternalError2 = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert2(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError2(msg);
  }
}

// https://deno.land/std@0.133.0/path/win32.ts
var sep4 = "\\";
var delimiter4 = ";";
function resolve4(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for (let i3 = pathSegments.length - 1; i3 >= -1; i3--) {
    let path5;
    const { Deno: Deno4 } = globalThis;
    if (i3 >= 0) {
      path5 = pathSegments[i3];
    } else if (!resolvedDevice) {
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a drive-letter-less path without a CWD.");
      }
      path5 = Deno4.cwd();
    } else {
      if (typeof Deno4?.env?.get !== "function" || typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path5 = Deno4.cwd();
      if (path5 === void 0 || path5.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
        path5 = `${resolvedDevice}\\`;
      }
    }
    assertPath2(path5);
    const len = path5.length;
    if (len === 0) continue;
    let rootEnd = 0;
    let device = "";
    let isAbsolute7 = false;
    const code = path5.charCodeAt(0);
    if (len > 1) {
      if (isPathSeparator2(code)) {
        isAbsolute7 = true;
        if (isPathSeparator2(path5.charCodeAt(1))) {
          let j = 2;
          let last = j;
          for (; j < len; ++j) {
            if (isPathSeparator2(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            const firstPart = path5.slice(last, j);
            last = j;
            for (; j < len; ++j) {
              if (!isPathSeparator2(path5.charCodeAt(j))) break;
            }
            if (j < len && j !== last) {
              last = j;
              for (; j < len; ++j) {
                if (isPathSeparator2(path5.charCodeAt(j))) break;
              }
              if (j === len) {
                device = `\\\\${firstPart}\\${path5.slice(last)}`;
                rootEnd = j;
              } else if (j !== last) {
                device = `\\\\${firstPart}\\${path5.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot2(code)) {
        if (path5.charCodeAt(1) === CHAR_COLON2) {
          device = path5.slice(0, 2);
          rootEnd = 2;
          if (len > 2) {
            if (isPathSeparator2(path5.charCodeAt(2))) {
              isAbsolute7 = true;
              rootEnd = 3;
            }
          }
        }
      }
    } else if (isPathSeparator2(code)) {
      rootEnd = 1;
      isAbsolute7 = true;
    }
    if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      continue;
    }
    if (resolvedDevice.length === 0 && device.length > 0) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = `${path5.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute7;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0) break;
  }
  resolvedTail = normalizeString2(
    resolvedTail,
    !resolvedAbsolute,
    "\\",
    isPathSeparator2
  );
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize5(path5) {
  assertPath2(path5);
  const len = path5.length;
  if (len === 0) return ".";
  let rootEnd = 0;
  let device;
  let isAbsolute7 = false;
  const code = path5.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code)) {
      isAbsolute7 = true;
      if (isPathSeparator2(path5.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator2(path5.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          const firstPart = path5.slice(last, j);
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator2(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator2(path5.charCodeAt(j))) break;
            }
            if (j === len) {
              return `\\\\${firstPart}\\${path5.slice(last)}\\`;
            } else if (j !== last) {
              device = `\\\\${firstPart}\\${path5.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot2(code)) {
      if (path5.charCodeAt(1) === CHAR_COLON2) {
        device = path5.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator2(path5.charCodeAt(2))) {
            isAbsolute7 = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator2(code)) {
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString2(
      path5.slice(rootEnd),
      !isAbsolute7,
      "\\",
      isPathSeparator2
    );
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute7) tail = ".";
  if (tail.length > 0 && isPathSeparator2(path5.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === void 0) {
    if (isAbsolute7) {
      if (tail.length > 0) return `\\${tail}`;
      else return "\\";
    } else if (tail.length > 0) {
      return tail;
    } else {
      return "";
    }
  } else if (isAbsolute7) {
    if (tail.length > 0) return `${device}\\${tail}`;
    else return `${device}\\`;
  } else if (tail.length > 0) {
    return device + tail;
  } else {
    return device;
  }
}
function isAbsolute4(path5) {
  assertPath2(path5);
  const len = path5.length;
  if (len === 0) return false;
  const code = path5.charCodeAt(0);
  if (isPathSeparator2(code)) {
    return true;
  } else if (isWindowsDeviceRoot2(code)) {
    if (len > 2 && path5.charCodeAt(1) === CHAR_COLON2) {
      if (isPathSeparator2(path5.charCodeAt(2))) return true;
    }
  }
  return false;
}
function join5(...paths) {
  const pathsCount = paths.length;
  if (pathsCount === 0) return ".";
  let joined;
  let firstPart = null;
  for (let i3 = 0; i3 < pathsCount; ++i3) {
    const path5 = paths[i3];
    assertPath2(path5);
    if (path5.length > 0) {
      if (joined === void 0) joined = firstPart = path5;
      else joined += `\\${path5}`;
    }
  }
  if (joined === void 0) return ".";
  let needsReplace = true;
  let slashCount = 0;
  assert2(firstPart != null);
  if (isPathSeparator2(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator2(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator2(firstPart.charCodeAt(2))) ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
  }
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount) {
      if (!isPathSeparator2(joined.charCodeAt(slashCount))) break;
    }
    if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize5(joined);
}
function relative4(from, to) {
  assertPath2(from);
  assertPath2(to);
  if (from === to) return "";
  const fromOrig = resolve4(from);
  const toOrig = resolve4(to);
  if (fromOrig === toOrig) return "";
  from = fromOrig.toLowerCase();
  to = toOrig.toLowerCase();
  if (from === to) return "";
  let fromStart = 0;
  let fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH2) break;
  }
  for (; fromEnd - 1 > fromStart; --fromEnd) {
    if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH2) break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 0;
  let toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH2) break;
  }
  for (; toEnd - 1 > toStart; --toEnd) {
    if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH2) break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i3 = 0;
  for (; i3 <= length; ++i3) {
    if (i3 === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i3) === CHAR_BACKWARD_SLASH2) {
          return toOrig.slice(toStart + i3 + 1);
        } else if (i3 === 2) {
          return toOrig.slice(toStart + i3);
        }
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i3) === CHAR_BACKWARD_SLASH2) {
          lastCommonSep = i3;
        } else if (i3 === 2) {
          lastCommonSep = 3;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i3);
    const toCode = to.charCodeAt(toStart + i3);
    if (fromCode !== toCode) break;
    else if (fromCode === CHAR_BACKWARD_SLASH2) lastCommonSep = i3;
  }
  if (i3 !== length && lastCommonSep === -1) {
    return toOrig;
  }
  let out = "";
  if (lastCommonSep === -1) lastCommonSep = 0;
  for (i3 = fromStart + lastCommonSep + 1; i3 <= fromEnd; ++i3) {
    if (i3 === fromEnd || from.charCodeAt(i3) === CHAR_BACKWARD_SLASH2) {
      if (out.length === 0) out += "..";
      else out += "\\..";
    }
  }
  if (out.length > 0) {
    return out + toOrig.slice(toStart + lastCommonSep, toEnd);
  } else {
    toStart += lastCommonSep;
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH2) ++toStart;
    return toOrig.slice(toStart, toEnd);
  }
}
function toNamespacedPath4(path5) {
  if (typeof path5 !== "string") return path5;
  if (path5.length === 0) return "";
  const resolvedPath = resolve4(path5);
  if (resolvedPath.length >= 3) {
    if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH2) {
      if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH2) {
        const code = resolvedPath.charCodeAt(2);
        if (code !== CHAR_QUESTION_MARK2 && code !== CHAR_DOT2) {
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
        }
      }
    } else if (isWindowsDeviceRoot2(resolvedPath.charCodeAt(0))) {
      if (resolvedPath.charCodeAt(1) === CHAR_COLON2 && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH2) {
        return `\\\\?\\${resolvedPath}`;
      }
    }
  }
  return path5;
}
function dirname4(path5) {
  assertPath2(path5);
  const len = path5.length;
  if (len === 0) return ".";
  let rootEnd = -1;
  let end = -1;
  let matchedSlash = true;
  let offset = 0;
  const code = path5.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code)) {
      rootEnd = offset = 1;
      if (isPathSeparator2(path5.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator2(path5.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator2(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator2(path5.charCodeAt(j))) break;
            }
            if (j === len) {
              return path5;
            }
            if (j !== last) {
              rootEnd = offset = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot2(code)) {
      if (path5.charCodeAt(1) === CHAR_COLON2) {
        rootEnd = offset = 2;
        if (len > 2) {
          if (isPathSeparator2(path5.charCodeAt(2))) rootEnd = offset = 3;
        }
      }
    }
  } else if (isPathSeparator2(code)) {
    return path5;
  }
  for (let i3 = len - 1; i3 >= offset; --i3) {
    if (isPathSeparator2(path5.charCodeAt(i3))) {
      if (!matchedSlash) {
        end = i3;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) {
    if (rootEnd === -1) return ".";
    else end = rootEnd;
  }
  return path5.slice(0, end);
}
function basename4(path5, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath2(path5);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i3;
  if (path5.length >= 2) {
    const drive = path5.charCodeAt(0);
    if (isWindowsDeviceRoot2(drive)) {
      if (path5.charCodeAt(1) === CHAR_COLON2) start = 2;
    }
  }
  if (ext !== void 0 && ext.length > 0 && ext.length <= path5.length) {
    if (ext.length === path5.length && ext === path5) return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i3 = path5.length - 1; i3 >= start; --i3) {
      const code = path5.charCodeAt(i3);
      if (isPathSeparator2(code)) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i3 + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i3;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) end = firstNonSlashEnd;
    else if (end === -1) end = path5.length;
    return path5.slice(start, end);
  } else {
    for (i3 = path5.length - 1; i3 >= start; --i3) {
      if (isPathSeparator2(path5.charCodeAt(i3))) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i3 + 1;
      }
    }
    if (end === -1) return "";
    return path5.slice(start, end);
  }
}
function extname4(path5) {
  assertPath2(path5);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  if (path5.length >= 2 && path5.charCodeAt(1) === CHAR_COLON2 && isWindowsDeviceRoot2(path5.charCodeAt(0))) {
    start = startPart = 2;
  }
  for (let i3 = path5.length - 1; i3 >= start; --i3) {
    const code = path5.charCodeAt(i3);
    if (isPathSeparator2(code)) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT2) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path5.slice(startDot, end);
}
function format4(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format2("\\", pathObject);
}
function parse4(path5) {
  assertPath2(path5);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  const len = path5.length;
  if (len === 0) return ret;
  let rootEnd = 0;
  let code = path5.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code)) {
      rootEnd = 1;
      if (isPathSeparator2(path5.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator2(path5.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator2(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator2(path5.charCodeAt(j))) break;
            }
            if (j === len) {
              rootEnd = j;
            } else if (j !== last) {
              rootEnd = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot2(code)) {
      if (path5.charCodeAt(1) === CHAR_COLON2) {
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator2(path5.charCodeAt(2))) {
            if (len === 3) {
              ret.root = ret.dir = path5;
              return ret;
            }
            rootEnd = 3;
          }
        } else {
          ret.root = ret.dir = path5;
          return ret;
        }
      }
    }
  } else if (isPathSeparator2(code)) {
    ret.root = ret.dir = path5;
    return ret;
  }
  if (rootEnd > 0) ret.root = path5.slice(0, rootEnd);
  let startDot = -1;
  let startPart = rootEnd;
  let end = -1;
  let matchedSlash = true;
  let i3 = path5.length - 1;
  let preDotState = 0;
  for (; i3 >= rootEnd; --i3) {
    code = path5.charCodeAt(i3);
    if (isPathSeparator2(code)) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT2) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      ret.base = ret.name = path5.slice(startPart, end);
    }
  } else {
    ret.name = path5.slice(startPart, startDot);
    ret.base = path5.slice(startPart, end);
    ret.ext = path5.slice(startDot, end);
  }
  if (startPart > 0 && startPart !== rootEnd) {
    ret.dir = path5.slice(0, startPart - 1);
  } else ret.dir = ret.root;
  return ret;
}
function fromFileUrl4(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  let path5 = decodeURIComponent(
    url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  ).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname != "") {
    path5 = `\\\\${url.hostname}${path5}`;
  }
  return path5;
}
function toFileUrl4(path5) {
  if (!isAbsolute4(path5)) {
    throw new TypeError("Must be an absolute path.");
  }
  const [, hostname2, pathname] = path5.match(
    /^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/
  );
  const url = new URL("file:///");
  url.pathname = encodeWhitespace2(pathname.replace(/%/g, "%25"));
  if (hostname2 != null && hostname2 != "localhost") {
    url.hostname = hostname2;
    if (!url.hostname) {
      throw new TypeError("Invalid hostname.");
    }
  }
  return url;
}

// https://deno.land/std@0.133.0/path/posix.ts
var posix_exports2 = {};
__export(posix_exports2, {
  basename: () => basename5,
  delimiter: () => delimiter5,
  dirname: () => dirname5,
  extname: () => extname5,
  format: () => format5,
  fromFileUrl: () => fromFileUrl5,
  isAbsolute: () => isAbsolute5,
  join: () => join6,
  normalize: () => normalize6,
  parse: () => parse5,
  relative: () => relative5,
  resolve: () => resolve5,
  sep: () => sep5,
  toFileUrl: () => toFileUrl5,
  toNamespacedPath: () => toNamespacedPath5
});
var sep5 = "/";
var delimiter5 = ":";
function resolve5(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i3 = pathSegments.length - 1; i3 >= -1 && !resolvedAbsolute; i3--) {
    let path5;
    if (i3 >= 0) path5 = pathSegments[i3];
    else {
      const { Deno: Deno4 } = globalThis;
      if (typeof Deno4?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path5 = Deno4.cwd();
    }
    assertPath2(path5);
    if (path5.length === 0) {
      continue;
    }
    resolvedPath = `${path5}/${resolvedPath}`;
    resolvedAbsolute = path5.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  }
  resolvedPath = normalizeString2(
    resolvedPath,
    !resolvedAbsolute,
    "/",
    isPosixPathSeparator2
  );
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0) return `/${resolvedPath}`;
    else return "/";
  } else if (resolvedPath.length > 0) return resolvedPath;
  else return ".";
}
function normalize6(path5) {
  assertPath2(path5);
  if (path5.length === 0) return ".";
  const isAbsolute7 = path5.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  const trailingSeparator = path5.charCodeAt(path5.length - 1) === CHAR_FORWARD_SLASH2;
  path5 = normalizeString2(path5, !isAbsolute7, "/", isPosixPathSeparator2);
  if (path5.length === 0 && !isAbsolute7) path5 = ".";
  if (path5.length > 0 && trailingSeparator) path5 += "/";
  if (isAbsolute7) return `/${path5}`;
  return path5;
}
function isAbsolute5(path5) {
  assertPath2(path5);
  return path5.length > 0 && path5.charCodeAt(0) === CHAR_FORWARD_SLASH2;
}
function join6(...paths) {
  if (paths.length === 0) return ".";
  let joined;
  for (let i3 = 0, len = paths.length; i3 < len; ++i3) {
    const path5 = paths[i3];
    assertPath2(path5);
    if (path5.length > 0) {
      if (!joined) joined = path5;
      else joined += `/${path5}`;
    }
  }
  if (!joined) return ".";
  return normalize6(joined);
}
function relative5(from, to) {
  assertPath2(from);
  assertPath2(to);
  if (from === to) return "";
  from = resolve5(from);
  to = resolve5(to);
  if (from === to) return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH2) break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH2) break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i3 = 0;
  for (; i3 <= length; ++i3) {
    if (i3 === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i3) === CHAR_FORWARD_SLASH2) {
          return to.slice(toStart + i3 + 1);
        } else if (i3 === 0) {
          return to.slice(toStart + i3);
        }
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i3) === CHAR_FORWARD_SLASH2) {
          lastCommonSep = i3;
        } else if (i3 === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i3);
    const toCode = to.charCodeAt(toStart + i3);
    if (fromCode !== toCode) break;
    else if (fromCode === CHAR_FORWARD_SLASH2) lastCommonSep = i3;
  }
  let out = "";
  for (i3 = fromStart + lastCommonSep + 1; i3 <= fromEnd; ++i3) {
    if (i3 === fromEnd || from.charCodeAt(i3) === CHAR_FORWARD_SLASH2) {
      if (out.length === 0) out += "..";
      else out += "/..";
    }
  }
  if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH2) ++toStart;
    return to.slice(toStart);
  }
}
function toNamespacedPath5(path5) {
  return path5;
}
function dirname5(path5) {
  assertPath2(path5);
  if (path5.length === 0) return ".";
  const hasRoot = path5.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  let end = -1;
  let matchedSlash = true;
  for (let i3 = path5.length - 1; i3 >= 1; --i3) {
    if (path5.charCodeAt(i3) === CHAR_FORWARD_SLASH2) {
      if (!matchedSlash) {
        end = i3;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) return hasRoot ? "/" : ".";
  if (hasRoot && end === 1) return "//";
  return path5.slice(0, end);
}
function basename5(path5, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath2(path5);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i3;
  if (ext !== void 0 && ext.length > 0 && ext.length <= path5.length) {
    if (ext.length === path5.length && ext === path5) return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i3 = path5.length - 1; i3 >= 0; --i3) {
      const code = path5.charCodeAt(i3);
      if (code === CHAR_FORWARD_SLASH2) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i3 + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i3;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) end = firstNonSlashEnd;
    else if (end === -1) end = path5.length;
    return path5.slice(start, end);
  } else {
    for (i3 = path5.length - 1; i3 >= 0; --i3) {
      if (path5.charCodeAt(i3) === CHAR_FORWARD_SLASH2) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i3 + 1;
      }
    }
    if (end === -1) return "";
    return path5.slice(start, end);
  }
}
function extname5(path5) {
  assertPath2(path5);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i3 = path5.length - 1; i3 >= 0; --i3) {
    const code = path5.charCodeAt(i3);
    if (code === CHAR_FORWARD_SLASH2) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT2) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path5.slice(startDot, end);
}
function format5(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format2("/", pathObject);
}
function parse5(path5) {
  assertPath2(path5);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path5.length === 0) return ret;
  const isAbsolute7 = path5.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  let start;
  if (isAbsolute7) {
    ret.root = "/";
    start = 1;
  } else {
    start = 0;
  }
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i3 = path5.length - 1;
  let preDotState = 0;
  for (; i3 >= start; --i3) {
    const code = path5.charCodeAt(i3);
    if (code === CHAR_FORWARD_SLASH2) {
      if (!matchedSlash) {
        startPart = i3 + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i3 + 1;
    }
    if (code === CHAR_DOT2) {
      if (startDot === -1) startDot = i3;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (startPart === 0 && isAbsolute7) {
        ret.base = ret.name = path5.slice(1, end);
      } else {
        ret.base = ret.name = path5.slice(startPart, end);
      }
    }
  } else {
    if (startPart === 0 && isAbsolute7) {
      ret.name = path5.slice(1, startDot);
      ret.base = path5.slice(1, end);
    } else {
      ret.name = path5.slice(startPart, startDot);
      ret.base = path5.slice(startPart, end);
    }
    ret.ext = path5.slice(startDot, end);
  }
  if (startPart > 0) ret.dir = path5.slice(0, startPart - 1);
  else if (isAbsolute7) ret.dir = "/";
  return ret;
}
function fromFileUrl5(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return decodeURIComponent(
    url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}
function toFileUrl5(path5) {
  if (!isAbsolute5(path5)) {
    throw new TypeError("Must be an absolute path.");
  }
  const url = new URL("file:///");
  url.pathname = encodeWhitespace2(
    path5.replace(/%/g, "%25").replace(/\\/g, "%5C")
  );
  return url;
}

// https://deno.land/std@0.133.0/path/glob.ts
var path3 = isWindows2 ? win32_exports2 : posix_exports2;
var { join: join7, normalize: normalize7 } = path3;

// https://deno.land/std@0.133.0/path/mod.ts
var path4 = isWindows2 ? win32_exports2 : posix_exports2;
var {
  basename: basename6,
  delimiter: delimiter6,
  dirname: dirname6,
  extname: extname6,
  format: format6,
  fromFileUrl: fromFileUrl6,
  isAbsolute: isAbsolute6,
  join: join8,
  normalize: normalize8,
  parse: parse6,
  relative: relative6,
  resolve: resolve6,
  sep: sep6,
  toFileUrl: toFileUrl6,
  toNamespacedPath: toNamespacedPath6
} = path4;

// https://deno.land/std@0.133.0/fs/_util.ts
function isSubdir(src, dest, sep7 = sep6) {
  if (src === dest) {
    return false;
  }
  const srcArray = src.split(sep7);
  const destArray = dest.split(sep7);
  return srcArray.every((current, i3) => destArray[i3] === current);
}
function getFileInfoType(fileInfo) {
  return fileInfo.isFile ? "file" : fileInfo.isDirectory ? "dir" : fileInfo.isSymlink ? "symlink" : void 0;
}

// https://deno.land/std@0.133.0/fs/ensure_dir.ts
async function ensureDir(dir) {
  try {
    const fileInfo = await Deno.lstat(dir);
    if (!fileInfo.isDirectory) {
      throw new Error(
        `Ensure path exists, expected 'dir', got '${getFileInfoType(fileInfo)}'`
      );
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      await Deno.mkdir(dir, { recursive: true });
      return;
    }
    throw err;
  }
}
function ensureDirSync(dir) {
  try {
    const fileInfo = Deno.lstatSync(dir);
    if (!fileInfo.isDirectory) {
      throw new Error(
        `Ensure path exists, expected 'dir', got '${getFileInfoType(fileInfo)}'`
      );
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      Deno.mkdirSync(dir, { recursive: true });
      return;
    }
    throw err;
  }
}

// https://deno.land/std@0.133.0/fs/exists.ts
async function exists(filePath) {
  try {
    await Deno.lstat(filePath);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}
function existsSync(filePath) {
  try {
    Deno.lstatSync(filePath);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}

// https://deno.land/std@0.133.0/fs/move.ts
async function move(src, dest, { overwrite = false } = {}) {
  const srcStat = await Deno.stat(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(
      `Cannot move '${src}' to a subdirectory of itself, '${dest}'.`
    );
  }
  if (overwrite) {
    if (await exists(dest)) {
      await Deno.remove(dest, { recursive: true });
    }
  } else {
    if (await exists(dest)) {
      throw new Error("dest already exists.");
    }
  }
  await Deno.rename(src, dest);
  return;
}
function moveSync(src, dest, { overwrite = false } = {}) {
  const srcStat = Deno.statSync(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(
      `Cannot move '${src}' to a subdirectory of itself, '${dest}'.`
    );
  }
  if (overwrite) {
    if (existsSync(dest)) {
      Deno.removeSync(dest, { recursive: true });
    }
  } else {
    if (existsSync(dest)) {
      throw new Error("dest already exists.");
    }
  }
  Deno.renameSync(src, dest);
}

// https://deno.land/std@0.133.0/_deno_unstable.ts
function utime(...args2) {
  if (typeof Deno.utime == "function") {
    return Deno.utime(...args2);
  } else {
    return Promise.reject(new TypeError("Requires --unstable"));
  }
}
function utimeSync(...args2) {
  if (typeof Deno.utimeSync == "function") {
    return Deno.utimeSync(...args2);
  } else {
    throw new TypeError("Requires --unstable");
  }
}

// https://deno.land/std@0.133.0/fs/copy.ts
async function ensureValidCopy(src, dest, options) {
  let destStat;
  try {
    destStat = await Deno.lstat(dest);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return;
    }
    throw err;
  }
  if (options.isFolder && !destStat.isDirectory) {
    throw new Error(
      `Cannot overwrite non-directory '${dest}' with directory '${src}'.`
    );
  }
  if (!options.overwrite) {
    throw new Error(`'${dest}' already exists.`);
  }
  return destStat;
}
function ensureValidCopySync(src, dest, options) {
  let destStat;
  try {
    destStat = Deno.lstatSync(dest);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return;
    }
    throw err;
  }
  if (options.isFolder && !destStat.isDirectory) {
    throw new Error(
      `Cannot overwrite non-directory '${dest}' with directory '${src}'.`
    );
  }
  if (!options.overwrite) {
    throw new Error(`'${dest}' already exists.`);
  }
  return destStat;
}
async function copyFile(src, dest, options) {
  await ensureValidCopy(src, dest, options);
  await Deno.copyFile(src, dest);
  if (options.preserveTimestamps) {
    const statInfo = await Deno.stat(src);
    assert2(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    await utime(dest, statInfo.atime, statInfo.mtime);
  }
}
function copyFileSync(src, dest, options) {
  ensureValidCopySync(src, dest, options);
  Deno.copyFileSync(src, dest);
  if (options.preserveTimestamps) {
    const statInfo = Deno.statSync(src);
    assert2(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    utimeSync(dest, statInfo.atime, statInfo.mtime);
  }
}
async function copySymLink(src, dest, options) {
  await ensureValidCopy(src, dest, options);
  const originSrcFilePath = await Deno.readLink(src);
  const type = getFileInfoType(await Deno.lstat(src));
  if (isWindows2) {
    await Deno.symlink(originSrcFilePath, dest, {
      type: type === "dir" ? "dir" : "file"
    });
  } else {
    await Deno.symlink(originSrcFilePath, dest);
  }
  if (options.preserveTimestamps) {
    const statInfo = await Deno.lstat(src);
    assert2(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    await utime(dest, statInfo.atime, statInfo.mtime);
  }
}
function copySymlinkSync(src, dest, options) {
  ensureValidCopySync(src, dest, options);
  const originSrcFilePath = Deno.readLinkSync(src);
  const type = getFileInfoType(Deno.lstatSync(src));
  if (isWindows2) {
    Deno.symlinkSync(originSrcFilePath, dest, {
      type: type === "dir" ? "dir" : "file"
    });
  } else {
    Deno.symlinkSync(originSrcFilePath, dest);
  }
  if (options.preserveTimestamps) {
    const statInfo = Deno.lstatSync(src);
    assert2(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    utimeSync(dest, statInfo.atime, statInfo.mtime);
  }
}
async function copyDir(src, dest, options) {
  const destStat = await ensureValidCopy(src, dest, {
    ...options,
    isFolder: true
  });
  if (!destStat) {
    await ensureDir(dest);
  }
  if (options.preserveTimestamps) {
    const srcStatInfo = await Deno.stat(src);
    assert2(srcStatInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(srcStatInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    await utime(dest, srcStatInfo.atime, srcStatInfo.mtime);
  }
  for await (const entry of Deno.readDir(src)) {
    const srcPath = join8(src, entry.name);
    const destPath = join8(dest, basename6(srcPath));
    if (entry.isSymlink) {
      await copySymLink(srcPath, destPath, options);
    } else if (entry.isDirectory) {
      await copyDir(srcPath, destPath, options);
    } else if (entry.isFile) {
      await copyFile(srcPath, destPath, options);
    }
  }
}
function copyDirSync(src, dest, options) {
  const destStat = ensureValidCopySync(src, dest, {
    ...options,
    isFolder: true
  });
  if (!destStat) {
    ensureDirSync(dest);
  }
  if (options.preserveTimestamps) {
    const srcStatInfo = Deno.statSync(src);
    assert2(srcStatInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(srcStatInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    utimeSync(dest, srcStatInfo.atime, srcStatInfo.mtime);
  }
  for (const entry of Deno.readDirSync(src)) {
    assert2(entry.name != null, "file.name must be set");
    const srcPath = join8(src, entry.name);
    const destPath = join8(dest, basename6(srcPath));
    if (entry.isSymlink) {
      copySymlinkSync(srcPath, destPath, options);
    } else if (entry.isDirectory) {
      copyDirSync(srcPath, destPath, options);
    } else if (entry.isFile) {
      copyFileSync(srcPath, destPath, options);
    }
  }
}
async function copy(src, dest, options = {}) {
  src = resolve6(src);
  dest = resolve6(dest);
  if (src === dest) {
    throw new Error("Source and destination cannot be the same.");
  }
  const srcStat = await Deno.lstat(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(
      `Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`
    );
  }
  if (srcStat.isSymlink) {
    await copySymLink(src, dest, options);
  } else if (srcStat.isDirectory) {
    await copyDir(src, dest, options);
  } else if (srcStat.isFile) {
    await copyFile(src, dest, options);
  }
}
function copySync(src, dest, options = {}) {
  src = resolve6(src);
  dest = resolve6(dest);
  if (src === dest) {
    throw new Error("Source and destination cannot be the same.");
  }
  const srcStat = Deno.lstatSync(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(
      `Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`
    );
  }
  if (srcStat.isSymlink) {
    copySymlinkSync(src, dest, options);
  } else if (srcStat.isDirectory) {
    copyDirSync(src, dest, options);
  } else if (srcStat.isFile) {
    copyFileSync(src, dest, options);
  }
}

// https://deno.land/x/good@1.14.3.0/flattened/empty_generator_object.js
var emptyGeneratorObject = function* () {
}();
emptyGeneratorObject.length = 0;

// https://deno.land/x/good@1.14.3.0/flattened/make_iterator.js
var makeIterator = (value) => {
  if (typeof value?.next == "function") {
    return value;
  } else if (value == null) {
    return emptyGeneratorObject;
  } else if (typeof value[Symbol.iterator] == "function") {
    const iterator = value[Symbol.iterator]();
    if (!Number.isFinite(iterator?.length)) {
      if (Number.isFinite(value?.length)) {
        iterator.length = value.length;
      } else if (Number.isFinite(value?.size)) {
        iterator.length = value.size;
      }
    }
    return iterator;
  } else if (typeof value[Symbol.asyncIterator] == "function") {
    const iterator = value[Symbol.asyncIterator]();
    if (!Number.isFinite(iterator?.length)) {
      if (Number.isFinite(value?.length)) {
        iterator.length = value.length;
      } else if (Number.isFinite(value?.size)) {
        iterator.length = value.size;
      }
    }
    return iterator;
  } else if (typeof value == "function") {
    return value();
  } else if (Object.getPrototypeOf(value).constructor == Object) {
    const entries = Object.entries(value);
    const output = entries[Symbol.iterator]();
    output.length = entries.length;
    return output;
  }
  return emptyGeneratorObject;
};

// https://deno.land/x/good@1.14.3.0/flattened/iter_zip_long_sync.js
var innerIterZipLongSync = function* (...iterables) {
  const iterators = iterables.map(makeIterator);
  while (true) {
    const nexts = iterators.map((each2) => each2.next());
    if (nexts.every((each2) => each2.done)) {
      break;
    }
    yield nexts.map((each2) => each2.value);
  }
};
var iterZipLongSync = function(...iterables) {
  const generatorObject = innerIterZipLongSync(...iterables);
  const finalLength = Math.max(...iterables.map((each2) => typeof each2 != "function" && (typeof each2?.length == "number" ? each2?.length : each2.size)));
  if (finalLength == finalLength) {
    generatorObject.length = finalLength;
  }
  return generatorObject;
};

// https://deno.land/x/good@1.14.3.0/flattened/indent.js
var indent = ({ string, by = "    ", noLead = false }) => (noLead ? "" : by) + string.replace(/\n/g, "\n" + by);

// https://deno.land/x/good@1.14.3.0/flattened/typed_array__class.js
var TypedArray = typeof globalThis?.Uint8Array != "function" ? class {
} : Object.getPrototypeOf(Uint8Array.prototype).constructor;

// https://deno.land/x/good@1.14.3.0/flattened/typed_array_classes.js
var typedArrayClasses = [
  Uint16Array,
  Uint32Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Int32Array,
  Int8Array,
  Float32Array,
  Float64Array
];
if (globalThis.BigInt64Array) {
  typedArrayClasses.push(globalThis.BigInt64Array);
}
if (globalThis.BigUint64Array) {
  typedArrayClasses.push(globalThis.BigUint64Array);
}

// https://deno.land/x/good@1.14.3.0/flattened/all_keys.js
var allKeys = function(obj) {
  const listOfKeys = [];
  if (obj == null) {
    return [];
  }
  if (!(obj instanceof Object)) {
    obj = Object.getPrototypeOf(obj);
  }
  while (obj) {
    listOfKeys.push(Reflect.ownKeys(obj));
    obj = Object.getPrototypeOf(obj);
  }
  return [...new Set(listOfKeys.flat(1))];
};

// https://deno.land/x/good@1.14.3.0/flattened/is_valid_identifier.js
var regexIdentifier = /^(?:[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D])(?:[\$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF])*$/;
var regexIdentifierES5 = /^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|null|this|true|void|with|break|catch|class|const|false|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)(?:[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])(?:[\$0-9A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])*$/;
var regexES6ReservedWord = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|await|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/;
function isValidIdentifier(value) {
  if (typeof value != "string") {
    return false;
  }
  const tmp = value.replace(/\\u([a-fA-F0-9]{4})|\\u\{([0-9a-fA-F]{1,})\}/g, function($0, $1, $2) {
    var codePoint = parseInt($2 || $1, 16);
    if (codePoint >= 55296 && codePoint <= 57343) {
      return "\0";
    }
    return String.fromCodePoint(codePoint);
  });
  const es5Warning = !regexIdentifierES5.test(
    // Only Unicode escapes are allowed in ES5 identifiers.
    value.replace(/\\u([a-fA-F0-9]{4})/g, function($0, $1) {
      return String.fromCodePoint(parseInt($1, 16));
    })
  );
  var isReserved;
  if ((isReserved = regexES6ReservedWord.test(tmp)) || !regexIdentifier.test(tmp)) {
    return false;
  } else {
    return true;
  }
}

// https://deno.land/x/good@1.14.3.0/flattened/is_valid_key_literal.js
function isValidKeyLiteral(value) {
  if (typeof value != "string") {
    return false;
  }
  if (value.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/)) {
    return true;
  }
  return isValidIdentifier(value);
}

// https://deno.land/x/good@1.14.3.0/flattened/to_representation.js
var reprSymbol = Symbol.for("representation");
var denoInspectSymbol = Symbol.for("Deno.customInspect");
var RegExpPrototype = RegExp.prototype;
var BigIntPrototype = BigInt.prototype;
var DatePrototype = Date.prototype;
var ArrayPrototype = Array.prototype;
var SetPrototype = Set.prototype;
var MapPrototype = Map.prototype;
var ObjectPrototype = Object.prototype;
var ErrorPrototype = Error.prototype;
var PromisePrototype = Promise.prototype;
var UrlPrototype = globalThis.URL?.prototype;
var isProbablyAPrototype = (item) => typeof item?.constructor == "function" && item.constructor?.prototype == item && isValidIdentifier(item.constructor?.name);
var representSymbol = (item) => {
  if (!item.description) {
    return "Symbol()";
  } else {
    const description = item.description;
    let globalVersion = Symbol.for(description);
    if (globalVersion == item) {
      return `Symbol.for(${JSON.stringify(description)})`;
    } else if (description.startsWith("Symbol.") && Symbol[description.slice(7)]) {
      return description;
    } else {
      return `Symbol(${JSON.stringify(description)})`;
    }
  }
};
var reprKey = (key) => {
  if (typeof key == "symbol") {
    return `[${representSymbol(key)}]`;
  } else if (isValidKeyLiteral(key)) {
    return key;
  } else {
    return JSON.stringify(key);
  }
};
var allGlobalKeysAtInit = Object.freeze(allKeys(globalThis));
var toRepresentation = (item, { alreadySeen = /* @__PURE__ */ new Map(), debug: debug2 = false, simplified, indent: indent2 = "    ", globalValues } = {}) => {
  if (Number.isFinite(indent2)) {
    indent2 = " ".repeat(indent2);
  }
  const options = { alreadySeen, debug: debug2, simplified, indent: indent2 };
  const recursionWrapper = (item2, options2) => {
    let groupIsOn = false;
    try {
      if (item2 === void 0) {
        return "undefined";
      } else if (item2 === null) {
        return "null";
      }
      const { alreadySeen: alreadySeen2, simplified: simplified2, indent: indent3 } = options2;
      if (item2 instanceof Object) {
        if (alreadySeen2.has(item2)) {
          const output2 = alreadySeen2.get(item2);
          if (output2 != null) {
            return output2;
          } else {
            return `${String(item2)} /*Self Reference*/`;
          }
        } else {
          alreadySeen2.set(item2, null);
        }
      }
      const prototype = Object.getPrototypeOf(item2);
      if (typeof item2[reprSymbol] == "function") {
        try {
          const output2 = item2[reprSymbol](options2);
          alreadySeen2.set(item2, output2);
          return output2;
        } catch (error) {
          if (debug2) {
            console.error(`calling Symbol.for("representation") method failed (skipping)
Error was: ${error?.stack || error}`);
          }
        }
      }
      if (typeof item2[denoInspectSymbol] == "function") {
        try {
          const output2 = item2[denoInspectSymbol](options2);
          alreadySeen2.set(item2, output2);
          return output2;
        } catch (error) {
          if (debug2) {
            console.error(`calling Symbol.for("Deno.customInspect") method failed (skipping)
Error was: ${error?.stack || error}`);
          }
        }
      }
      if (debug2) {
        console.group();
        groupIsOn = true;
      }
      let output;
      if (typeof item2 == "number" || typeof item2 == "boolean" || prototype == RegExpPrototype) {
        output = String(item2);
      } else if (typeof item2 == "string") {
        output = JSON.stringify(item2);
      } else if (typeof item2 == "symbol") {
        output = representSymbol(item2);
      } else if (prototype == BigIntPrototype) {
        output = `BigInt(${item2.toString()})`;
      } else if (prototype == DatePrototype) {
        output = `new Date(${item2.getTime()})`;
      } else if (prototype == ArrayPrototype) {
        output = arrayLikeRepr(item2, options2);
        let nonIndexKeys;
        try {
          nonIndexKeys = Object.keys(item2).filter((each2) => !(Number.isInteger(each2 - 0) && each2 >= 0));
        } catch (error) {
          if (debug2) {
            console.error(`[toRepresentation] error checking nonIndexKeys
${error?.stack || error}`);
          }
        }
        if (nonIndexKeys.length > 0) {
          let extraKeys = {};
          for (const each2 of nonIndexKeys) {
            try {
              extraKeys[each2] = item2[each2];
            } catch (error) {
            }
          }
          if (Object.keys(extraKeys).length > 0) {
            output = `Object.assign(${output}, ${pureObjectRepr(extraKeys)})`;
          }
        }
      } else if (prototype == SetPrototype) {
        output = `new Set(${arrayLikeRepr(item2, options2)})`;
      } else if (prototype == MapPrototype) {
        output = `new Map(${mapLikeObject(item2.entries(), options2)})`;
      } else if (prototype == PromisePrototype) {
        output = `Promise.resolve(/*unknown*/)`;
      } else if (prototype == UrlPrototype) {
        output = `new URL(${JSON.stringify(item2?.href)})`;
      } else if (isGlobalValue(item2)) {
        const key = globalValueMap.get(item2);
        if (isValidIdentifier(key) || key == "eval") {
          output = key;
        } else {
          if (typeof key == "symbol") {
            output = `globalThis[${representSymbol(key)}]`;
          } else if (isValidKeyLiteral(key)) {
            output = `globalThis.${key}`;
          } else {
            output = `globalThis[${JSON.stringify(key)}]`;
          }
        }
      } else if (isProbablyAPrototype(item2)) {
        const name = item2.constructor.name;
        let isPrototypeOfGlobal;
        try {
          isPrototypeOfGlobal = globalThis[name]?.prototype == item2;
        } catch (error) {
        }
        if (isPrototypeOfGlobal) {
          output = `${name}.prototype`;
        } else {
          if (simplified2) {
            output = `${name}.prototype /*${name} is local*/`;
          } else {
            output = `/*prototype of ${name}*/ ${customObjectRepr(item2, options2)}`;
          }
        }
      } else if (prototype == ErrorPrototype && item2?.constructor != globalThis.DOMException) {
        try {
          output = `new Error(${JSON.stringify(item2?.message)})`;
        } catch (error) {
          output = `new Error(${JSON.stringify(item2)})`;
        }
      } else if (typeof item2 == "function") {
        let isNativeCode;
        let asString;
        let isClass;
        const getAsString = () => {
          if (asString != null) {
            return asString;
          }
          try {
            asString = Function.prototype.toString.call(item2);
          } catch (error) {
          }
          return asString;
        };
        const getIsNativeCode = () => {
          if (isNativeCode != null) {
            return isNativeCode;
          }
          try {
            isNativeCode = !!getAsString().match(/{\s*\[native code\]\s*}$/);
          } catch (error) {
          }
          return isNativeCode;
        };
        const getIsClass = () => {
          if (isClass != null) {
            return isClass;
          }
          try {
            isClass = item2.name && getAsString().match(/^class\b/);
          } catch (error) {
          }
          return isClass;
        };
        const name = item2.name;
        if (isValidIdentifier(name)) {
          if (getIsNativeCode()) {
            output = `${name} /*native function*/`;
          } else if (getIsClass()) {
            if (simplified2) {
              output = `${name} /*class*/`;
            } else {
              output = getAsString();
            }
          } else {
            if (simplified2) {
              output = `${item2.name} /*function*/`;
            } else {
              output = `(${getAsString()})`;
            }
          }
        } else if (getIsClass()) {
          if (typeof name == "string") {
            output = `/*name: ${JSON.stringify(name)}*/ class { /*...*/ }`;
          } else if (simplified2) {
            output = `class { /*...*/ }`;
          } else {
            output = getAsString();
          }
        } else if (typeof name == "string" && getAsString().match(/^(function )?(g|s)et\b/)) {
          const realName = name.slice(4);
          if (name[0] == "g") {
            output = `Object.getOwnPropertyDescriptor({/*unknown obj*/},${JSON.stringify(realName)}).get`;
          } else {
            output = `Object.getOwnPropertyDescriptor({/*unknown obj*/},${JSON.stringify(realName)}).set`;
          }
        } else if (name) {
          if (simplified2) {
            if (getIsNativeCode()) {
              if (name.startsWith("get ")) {
                const realName = name.slice(4);
                if (Object.getOwnPropertyDescriptor(globalThis, realName)?.get == item2) {
                  output = `Object.getOwnPropertyDescriptor(globalThis, ${JSON.stringify(realName)}).get /*native getter*/`;
                } else {
                  output = `Object.getOwnPropertyDescriptor({/*unknown obj*/}, ${JSON.stringify(realName)}).get`;
                }
              } else if (name.startsWith("set ")) {
                const realName = name.slice(4);
                if (Object.getOwnPropertyDescriptor(globalThis, realName)?.set == item2) {
                  output = `Object.getOwnPropertyDescriptor(globalThis, ${JSON.stringify(realName)}).set /*native setter*/`;
                } else {
                  output = `Object.getOwnPropertyDescriptor({/*unknown obj*/}, ${JSON.stringify(realName)}).set`;
                }
              } else {
                output = `(function(){/*name: ${recursionWrapper(name, options2)}, native function*/}})`;
              }
            } else {
              output = `(function(){/*name: ${recursionWrapper(name, options2)}*/}})`;
            }
          } else {
            output = `/*name: ${recursionWrapper(name, options2)}*/ (${getAsString()})`;
          }
        } else {
          if (simplified2) {
            if (getIsNativeCode()) {
              output = `(function(){/*native function*/}})`;
            } else {
              output = `(function(){/*...*/}})`;
            }
          } else {
            output = `(${getAsString()})`;
          }
        }
      } else {
        output = customObjectRepr(item2, options2);
      }
      if (groupIsOn) {
        console.groupEnd();
      }
      alreadySeen2.set(item2, output);
      return output;
    } catch (error) {
      if (groupIsOn) {
        console.groupEnd();
      }
      if (debug2) {
        console.debug(`[toRepresentation] error is: ${error}`, error?.stack || error);
      }
      try {
        return String(item2);
      } catch (error2) {
        return "{} /*error: catestrophic representation failure*/";
      }
    }
  };
  let globalValueMap;
  const isGlobalValue = (item2) => {
    if (globalValueMap == null) {
      globalValueMap = globalValueMap || new Map(allGlobalKeysAtInit.filter((each2) => {
        try {
          globalThis[each2];
        } catch (error) {
          return false;
        }
        return true;
      }).map((each2) => [globalThis[each2], each2]));
      for (const [key, value] of Object.entries(globalValues || {})) {
        globalValueMap.set(key, value);
      }
    }
    return globalValueMap.has(item2);
  };
  const pureObjectRepr = (item2) => {
    if (options.simplified == null) {
      options.simplified = true;
    }
    let string = "{";
    let propertyDescriptors;
    try {
      propertyDescriptors = Object.entries(Object.getOwnPropertyDescriptors(item2));
    } catch (error) {
      if (debug2) {
        console.error(`[toRepresentation] error getting Object.propertyDescriptor
${error?.stack || error}`);
      }
      try {
        return String(item2);
      } catch (error2) {
        return "undefined /*error: catestrophic representation failure*/";
      }
    }
    for (const [key, { value, writable, enumerable, configurable, get, set }] of propertyDescriptors) {
      const stringKey = reprKey(key);
      if (get) {
        string += `
${indent2}get ${stringKey}(){/*contents*/}`;
      } else {
        string += `
${indent2}${stringKey}: ${indent({ string: recursionWrapper(value, options), by: options.indent, noLead: true })},`;
      }
    }
    if (propertyDescriptors.length == 0) {
      string += "}";
    } else {
      string += "\n}";
    }
    return string;
  };
  const arrayLikeRepr = (item2, options2) => {
    if (options2.simplified == null) {
      options2.simplified = true;
    }
    const chunks = [];
    let oneHasNewLine = false;
    for (const each2 of item2) {
      const repr = recursionWrapper(each2, options2);
      chunks.push(repr);
      if (!oneHasNewLine && repr.includes("\n")) {
        oneHasNewLine = true;
      }
    }
    if (!oneHasNewLine) {
      return `[${chunks.join(",")}]`;
    } else {
      return `[
${chunks.map((each2) => indent({ string: each2, by: options2.indent, noLead: false })).join(",\n")}
]`;
    }
  };
  const mapLikeObject = (entries, options2) => {
    let string = "";
    for (const [key, value] of entries) {
      if (options2.simplified == null) {
        options2.simplified = true;
      }
      const stringKey = recursionWrapper(key, options2);
      const stringValue = recursionWrapper(value, options2);
      if (!stringKey.includes("\n")) {
        const formattedValue = stringValue.includes("\n") ? indent({ string: stringValue, by: options2.indent, noLead: true }) : indent({ string: stringValue, by: options2.indent, noLead: true });
        string += `
${options2.indent}[${stringKey}, ${formattedValue}],`;
      } else {
        const doubleIndent = options2.indent + options2.indent;
        string += `
${options2.indent}[
${indent({ string: stringKey, by: doubleIndent, noLead: false })},
${indent({ string: stringValue, by: doubleIndent, noLead: false })}
${options2.indent}],`;
      }
    }
    if (string.length == 0) {
      return "";
    } else {
      return `[${string}
]`;
    }
  };
  const customObjectRepr = (item2, options2) => {
    const prototype = Object.getPrototypeOf(item2);
    if (prototype == ObjectPrototype) {
      return pureObjectRepr(item2);
    }
    let className = prototype.constructor?.name;
    let output;
    if (typeof className != "string" || className == "Object" || className == "Function") {
      className = null;
    }
    const vanillaCustomObjRepr = () => {
      if (className) {
        if (options2.simplified) {
          return `new ${className}(/*...*/)`;
        } else {
          return `new ${className}(${pureObjectRepr(item2)})`;
        }
      } else {
        return pureObjectRepr(item2);
      }
    };
    if (item2 instanceof Array || item2 instanceof TypedArray || item2 instanceof Set) {
      let isAllIndexKeys;
      try {
        isAllIndexKeys = Object.keys(item2).every((each2) => Number.isInteger(each2 - 0) && each2 >= 0);
      } catch (error) {
        if (debug2) {
          console.error(`[toRepresentation] error checking isAllIndexKeys
${error?.stack || error}`);
        }
      }
      let arrayLikeReprString;
      if (isAllIndexKeys) {
        try {
          arrayLikeReprString = arrayLikeRepr(item2, options2);
        } catch (error) {
          isAllIndexKeys = false;
        }
      }
      if (isAllIndexKeys) {
        if (className) {
          output = `new ${className}(${arrayLikeReprString})`;
        } else {
          if (item2 instanceof Array) {
            output = arrayLikeReprString;
          } else if (item2 instanceof TypedArray) {
            for (const each2 of typedArrayClasses) {
              if (item2 instanceof each2) {
                output = `new ${each2.name}(${arrayLikeReprString})`;
                break;
              }
            }
          } else if (item2 instanceof Set) {
            output = `new Set(${arrayLikeReprString})`;
          }
        }
      } else {
        output = vanillaCustomObjRepr(item2);
      }
    } else if (item2 instanceof Map) {
      if (className && options2.simplified) {
        output = `new ${className}(/*...*/)`;
      } else {
        let entries = [];
        try {
          entries = Map.prototype.entries.call(item2);
        } catch (error) {
          if (debug2) {
            console.error(`[toRepresentation] error getting Map.prototype.entries
${error?.stack || error}`);
          }
        }
        const core = mapLikeObject(entries, options2);
        if (className) {
          output = `new ${className}(${core})`;
        } else {
          output = `new Map(${core})`;
        }
      }
    } else {
      try {
        output = vanillaCustomObjRepr(item2);
      } catch (error) {
        try {
          output = pureObjectRepr(item2);
        } catch (error2) {
          try {
            output = item2.toString();
          } catch (error3) {
            return "undefined /*error: catestrophic representation failure*/";
          }
        }
      }
    }
    return output;
  };
  try {
    const output = recursionWrapper(item, options);
    return output;
  } catch (error) {
    if (debug2) {
      console.debug(`[toRepresentation] error is:`, error);
    }
    return String(item);
  }
};

// https://deno.land/x/good@1.14.3.0/flattened/to_string.js
var toString = (value) => {
  if (typeof value == "symbol") {
    return toRepresentation(value);
  } else if (!(value instanceof Object)) {
    return value != null ? value.toString() : `${value}`;
  } else {
    return toRepresentation(value);
  }
};

// https://deno.land/x/good@1.14.3.0/flattened/find_all.js
var findAll = (regexPattern, sourceString) => {
  var output = [];
  var match;
  var regexPatternWithGlobal = regexPattern.global ? regexPattern : RegExp(regexPattern, regexPattern.flags + "g");
  while (match = regexPatternWithGlobal.exec(sourceString)) {
    output.push(match);
    if (match[0].length == 0) {
      regexPatternWithGlobal.lastIndex += 1;
    }
  }
  return output;
};

// https://deno.land/x/good@1.14.3.0/flattened/escape_regex_match.js
var reservedCharMap = {
  "&": "\\x26",
  "!": "\\x21",
  "#": "\\x23",
  "$": "\\$",
  "%": "\\x25",
  "*": "\\*",
  "+": "\\+",
  ",": "\\x2c",
  ".": "\\.",
  ":": "\\x3a",
  ";": "\\x3b",
  "<": "\\x3c",
  "=": "\\x3d",
  ">": "\\x3e",
  "?": "\\?",
  "@": "\\x40",
  "^": "\\^",
  "`": "\\x60",
  "~": "\\x7e",
  "(": "\\(",
  ")": "\\)",
  "[": "\\[",
  "]": "\\]",
  "{": "\\{",
  "}": "\\}",
  "/": "\\/",
  "-": "\\x2d",
  "\\": "\\\\",
  "|": "\\|"
};
var RX_REGEXP_ESCAPE = new RegExp(
  `[${Object.values(reservedCharMap).join("")}]`,
  "gu"
);
function escapeRegexMatch(str) {
  return str.replaceAll(
    RX_REGEXP_ESCAPE,
    (m3) => reservedCharMap[m3]
  );
}

// https://deno.land/x/good@1.14.3.0/flattened/regex.js
var regexpProxy = Symbol("regexpProxy");
var realExec = RegExp.prototype.exec;
RegExp.prototype.exec = function(...args2) {
  if (this[regexpProxy]) {
    return realExec.apply(this[regexpProxy], args2);
  }
  return realExec.apply(this, args2);
};
var proxyRegExp;
var regexProxyOptions = Object.freeze({
  get(original, key) {
    if (typeof key == "string" && key.match(/^[igmusyv]+$/)) {
      return proxyRegExp(original, key);
    }
    if (key == regexpProxy) {
      return original;
    }
    return original[key];
  },
  set(original, key, value) {
    original[key] = value;
    return true;
  }
});
proxyRegExp = (parent, flags) => {
  const regex2 = new RegExp(parent, flags);
  const output = new Proxy(regex2, regexProxyOptions);
  Object.setPrototypeOf(output, Object.getPrototypeOf(regex2));
  return output;
};
function regexWithStripWarning(shouldStrip) {
  return (strings, ...values) => {
    let newRegexString = "";
    for (const [string, value] of iterZipLongSync(strings, values)) {
      newRegexString += string;
      if (value instanceof RegExp) {
        if (!shouldStrip && value.flags.replace(/g/, "").length > 0) {
          console.warn(`Warning: flags inside of regex:
    The RegExp trigging this warning is: ${value}
    When calling the regex interpolater (e.g. regex\`something\${stuff}\`)
    one of the \${} values (the one above) was a RegExp with a flag enabled
    e.g. /stuff/i  <- i = ignoreCase flag enabled
    When the /stuff/i gets interpolated, its going to loose its flags
    (thats what I'm warning you about)
    
    To disable/ignore this warning do:
        regex.stripFlags\`something\${/stuff/i}\`
    If you want to add flags to the output of regex\`something\${stuff}\` do:
        regex\`something\${stuff}\`.i   // ignoreCase
        regex\`something\${stuff}\`.ig  // ignoreCase and global
        regex\`something\${stuff}\`.gi  // functionally equivlent
`);
        }
        newRegexString += `(?:${value.source})`;
      } else if (value != null) {
        newRegexString += escapeRegexMatch(toString(value));
      }
    }
    return proxyRegExp(newRegexString, "");
  };
}
var regex = regexWithStripWarning(false);
regex.stripFlags = regexWithStripWarning(true);

// https://deno.land/x/good@1.14.3.0/flattened/utf8_bytes_to_string.js
var textDecoder = new TextDecoder("utf-8");
var utf8BytesToString = textDecoder.decode.bind(textDecoder);

// https://deno.land/x/good@1.14.3.0/flattened/string_to_utf8_bytes.js
var textEncoder = new TextEncoder("utf-8");
var stringToUtf8Bytes = textEncoder.encode.bind(textEncoder);

// https://deno.land/x/good@1.14.3.0/flattened/async_function__class.js
var AsyncFunction = class {
};
try {
  AsyncFunction = eval("(async function(){}).constructor");
} catch (err) {
}

// https://deno.land/x/good@1.14.3.0/flattened/deferred_promise.js
function deferredPromise() {
  let methods;
  let state2 = "pending";
  const promise = new Promise((resolve7, reject) => {
    methods = {
      resolve(value) {
        if (value?.catch instanceof Function) {
          value.catch(reject);
        }
        if (value?.then instanceof Function) {
          value.then(methods.resolve);
        } else {
          state2 = "fulfilled";
          resolve7(value);
        }
      },
      reject(reason) {
        state2 = "rejected";
        reject(reason);
      },
      // give a more helpful error message
      [Symbol.iterator]() {
        throw Error(`You're trying to sync-iterate over a promise`);
      }
    };
  });
  Object.defineProperty(promise, "state", { get: () => state2 });
  return Object.assign(promise, methods);
}

// https://deno.land/x/good@1.14.3.0/flattened/is_iterator.js
var isIterator = function(value) {
  return typeof value?.next == "function";
};

// https://deno.land/x/good@1.14.3.0/flattened/async_generator_function__class.js
var AsyncGeneratorFunction = class {
};
try {
  AsyncGeneratorFunction = eval("(async function*(){}).constructor");
} catch (err) {
}

// https://deno.land/x/good@1.14.3.0/flattened/sync_generator_function__class.js
var SyncGeneratorFunction = class {
};
try {
  SyncGeneratorFunction = eval("(function*(){}).constructor");
} catch (err) {
}

// https://deno.land/x/good@1.14.3.0/flattened/stop_symbol.js
var stop = Symbol.for("iterationStop");

// https://deno.land/x/good@1.14.3.0/flattened/async_iterator_to_list.js
function asyncIteratorToList(asyncIterator) {
  const promise = deferredPromise();
  let iterator;
  try {
    iterator = makeIterator(asyncIterator);
    if (Number.isFinite(iterator?.length)) {
      promise.length = iterator.length;
    }
  } catch (error) {
    promise.reject(error);
    return promise;
  }
  promise[Symbol.asyncIterator] = () => iterator;
  const results = [];
  const callNext = () => {
    let nextPromise;
    try {
      nextPromise = iterator.next();
    } catch (error) {
      promise.reject(error);
      return;
    }
    if (nextPromise == null) {
      promise.reject(Error(`When iterating over an async iterator, the .next() returned null/undefined`));
      return;
    }
    if (!(typeof nextPromise.then == "function")) {
      const { value, done } = nextPromise;
      if (done) {
        promise.resolve(results);
      } else {
        results.push(value);
        callNext();
      }
      return;
    }
    nextPromise.catch(promise.reject);
    nextPromise.then(({ value, done }) => {
      if (done) {
        promise.resolve(results);
      } else {
        results.push(value);
        callNext();
      }
    });
  };
  promise.results = results;
  try {
    callNext();
  } catch (error) {
    promise.reject(error);
  }
  return promise;
}

// https://deno.land/x/good@1.14.3.0/flattened/concurrently_transform.js
var ERROR_WHILE_MAPPING_MESSAGE = "Threw while mapping";
function concurrentlyTransform({ iterator, transformFunction, poolLimit = null, awaitAll = false }) {
  poolLimit = poolLimit || concurrentlyTransform.defaultPoolLimit;
  const res = new TransformStream({
    async transform(p, controller) {
      try {
        const s2 = await p;
        controller.enqueue(s2);
      } catch (e) {
        if (e instanceof AggregateError && e.message == ERROR_WHILE_MAPPING_MESSAGE) {
          controller.error(e);
        }
      }
    }
  });
  const mainPromise = (async () => {
    const writer = res.writable.getWriter();
    const executing = [];
    try {
      let index = 0;
      for await (const item of iterator) {
        const p = Promise.resolve().then(() => transformFunction(item, index));
        index++;
        writer.write(p);
        const e = p.then(() => executing.splice(executing.indexOf(e), 1));
        executing.push(e);
        if (executing.length >= poolLimit) {
          await Promise.race(executing);
        }
      }
      await Promise.all(executing);
      writer.close();
    } catch {
      const errors2 = [];
      for (const result of await Promise.allSettled(executing)) {
        if (result.status == "rejected") {
          errors2.push(result.reason);
        }
      }
      writer.write(Promise.reject(new AggregateError(errors2, ERROR_WHILE_MAPPING_MESSAGE))).catch(() => {
      });
    }
  })();
  const asyncIterator = res.readable[Symbol.asyncIterator]();
  if (!awaitAll) {
    return asyncIterator;
  } else {
    return mainPromise.then(() => asyncIteratorToList(asyncIterator));
  }
}
concurrentlyTransform.defaultPoolLimit = 40;

// https://deno.land/std@0.214.0/path/_os.ts
var osType3 = (() => {
  const { Deno: Deno4 } = globalThis;
  if (typeof Deno4?.build?.os === "string") {
    return Deno4.build.os;
  }
  const { navigator } = globalThis;
  if (navigator?.appVersion?.includes?.("Win")) {
    return "windows";
  }
  return "linux";
})();
var isWindows3 = osType3 === "windows";

// https://deno.land/std@0.214.0/path/_common/glob_to_reg_exp.ts
var regExpEscapeChars = [
  "!",
  "$",
  "(",
  ")",
  "*",
  "+",
  ".",
  "=",
  "?",
  "[",
  "\\",
  "^",
  "{",
  "|"
];
var rangeEscapeChars = ["-", "\\", "]"];
function _globToRegExp(c2, glob2, {
  extended = true,
  globstar: globstarOption = true,
  // os = osType,
  caseInsensitive = false
} = {}) {
  if (glob2 === "") {
    return /(?!)/;
  }
  let newLength = glob2.length;
  for (; newLength > 1 && c2.seps.includes(glob2[newLength - 1]); newLength--) ;
  glob2 = glob2.slice(0, newLength);
  let regExpString = "";
  for (let j = 0; j < glob2.length; ) {
    let segment = "";
    const groupStack = [];
    let inRange = false;
    let inEscape = false;
    let endsWithSep = false;
    let i3 = j;
    for (; i3 < glob2.length && !c2.seps.includes(glob2[i3]); i3++) {
      if (inEscape) {
        inEscape = false;
        const escapeChars = inRange ? rangeEscapeChars : regExpEscapeChars;
        segment += escapeChars.includes(glob2[i3]) ? `\\${glob2[i3]}` : glob2[i3];
        continue;
      }
      if (glob2[i3] === c2.escapePrefix) {
        inEscape = true;
        continue;
      }
      if (glob2[i3] === "[") {
        if (!inRange) {
          inRange = true;
          segment += "[";
          if (glob2[i3 + 1] === "!") {
            i3++;
            segment += "^";
          } else if (glob2[i3 + 1] === "^") {
            i3++;
            segment += "\\^";
          }
          continue;
        } else if (glob2[i3 + 1] === ":") {
          let k2 = i3 + 1;
          let value = "";
          while (glob2[k2 + 1] !== void 0 && glob2[k2 + 1] !== ":") {
            value += glob2[k2 + 1];
            k2++;
          }
          if (glob2[k2 + 1] === ":" && glob2[k2 + 2] === "]") {
            i3 = k2 + 2;
            if (value === "alnum") segment += "\\dA-Za-z";
            else if (value === "alpha") segment += "A-Za-z";
            else if (value === "ascii") segment += "\0-";
            else if (value === "blank") segment += "	 ";
            else if (value === "cntrl") segment += "\0-";
            else if (value === "digit") segment += "\\d";
            else if (value === "graph") segment += "!-~";
            else if (value === "lower") segment += "a-z";
            else if (value === "print") segment += " -~";
            else if (value === "punct") {
              segment += `!"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_‘{|}~`;
            } else if (value === "space") segment += "\\s\v";
            else if (value === "upper") segment += "A-Z";
            else if (value === "word") segment += "\\w";
            else if (value === "xdigit") segment += "\\dA-Fa-f";
            continue;
          }
        }
      }
      if (glob2[i3] === "]" && inRange) {
        inRange = false;
        segment += "]";
        continue;
      }
      if (inRange) {
        if (glob2[i3] === "\\") {
          segment += `\\\\`;
        } else {
          segment += glob2[i3];
        }
        continue;
      }
      if (glob2[i3] === ")" && groupStack.length > 0 && groupStack[groupStack.length - 1] !== "BRACE") {
        segment += ")";
        const type = groupStack.pop();
        if (type === "!") {
          segment += c2.wildcard;
        } else if (type !== "@") {
          segment += type;
        }
        continue;
      }
      if (glob2[i3] === "|" && groupStack.length > 0 && groupStack[groupStack.length - 1] !== "BRACE") {
        segment += "|";
        continue;
      }
      if (glob2[i3] === "+" && extended && glob2[i3 + 1] === "(") {
        i3++;
        groupStack.push("+");
        segment += "(?:";
        continue;
      }
      if (glob2[i3] === "@" && extended && glob2[i3 + 1] === "(") {
        i3++;
        groupStack.push("@");
        segment += "(?:";
        continue;
      }
      if (glob2[i3] === "?") {
        if (extended && glob2[i3 + 1] === "(") {
          i3++;
          groupStack.push("?");
          segment += "(?:";
        } else {
          segment += ".";
        }
        continue;
      }
      if (glob2[i3] === "!" && extended && glob2[i3 + 1] === "(") {
        i3++;
        groupStack.push("!");
        segment += "(?!";
        continue;
      }
      if (glob2[i3] === "{") {
        groupStack.push("BRACE");
        segment += "(?:";
        continue;
      }
      if (glob2[i3] === "}" && groupStack[groupStack.length - 1] === "BRACE") {
        groupStack.pop();
        segment += ")";
        continue;
      }
      if (glob2[i3] === "," && groupStack[groupStack.length - 1] === "BRACE") {
        segment += "|";
        continue;
      }
      if (glob2[i3] === "*") {
        if (extended && glob2[i3 + 1] === "(") {
          i3++;
          groupStack.push("*");
          segment += "(?:";
        } else {
          const prevChar = glob2[i3 - 1];
          let numStars = 1;
          while (glob2[i3 + 1] === "*") {
            i3++;
            numStars++;
          }
          const nextChar = glob2[i3 + 1];
          if (globstarOption && numStars === 2 && [...c2.seps, void 0].includes(prevChar) && [...c2.seps, void 0].includes(nextChar)) {
            segment += c2.globstar;
            endsWithSep = true;
          } else {
            segment += c2.wildcard;
          }
        }
        continue;
      }
      segment += regExpEscapeChars.includes(glob2[i3]) ? `\\${glob2[i3]}` : glob2[i3];
    }
    if (groupStack.length > 0 || inRange || inEscape) {
      segment = "";
      for (const c3 of glob2.slice(j, i3)) {
        segment += regExpEscapeChars.includes(c3) ? `\\${c3}` : c3;
        endsWithSep = false;
      }
    }
    regExpString += segment;
    if (!endsWithSep) {
      regExpString += i3 < glob2.length ? c2.sep : c2.sepMaybe;
      endsWithSep = true;
    }
    while (c2.seps.includes(glob2[i3])) i3++;
    if (!(i3 > j)) {
      throw new Error("Assertion failure: i > j (potential infinite loop)");
    }
    j = i3;
  }
  regExpString = `^${regExpString}$`;
  return new RegExp(regExpString, caseInsensitive ? "i" : "");
}

// https://deno.land/std@0.214.0/path/posix/glob_to_regexp.ts
var constants = {
  sep: "/+",
  sepMaybe: "/*",
  seps: ["/"],
  globstar: "(?:[^/]*(?:/|$)+)*",
  wildcard: "[^/]*",
  escapePrefix: "\\"
};
function globToRegExp2(glob2, options = {}) {
  return _globToRegExp(constants, glob2, options);
}

// https://deno.land/std@0.214.0/path/windows/glob_to_regexp.ts
var constants2 = {
  sep: "(?:\\\\|/)+",
  sepMaybe: "(?:\\\\|/)*",
  seps: ["\\", "/"],
  globstar: "(?:[^\\\\/]*(?:\\\\|/|$)+)*",
  wildcard: "[^\\\\/]*",
  escapePrefix: "`"
};
function globToRegExp3(glob2, options = {}) {
  return _globToRegExp(constants2, glob2, options);
}

// https://deno.land/std@0.214.0/path/glob_to_regexp.ts
function globToRegExp4(glob2, options = {}) {
  return options.os === "windows" || !options.os && isWindows3 ? globToRegExp3(glob2, options) : globToRegExp2(glob2, options);
}

// https://deno.land/std@0.191.0/_util/asserts.ts
var DenoStdInternalError3 = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert4(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError3(msg);
  }
}

// https://deno.land/std@0.191.0/bytes/copy.ts
function copy2(src, dst, off = 0) {
  off = Math.max(0, Math.min(off, dst.byteLength));
  const dstBytesAvailable = dst.byteLength - off;
  if (src.byteLength > dstBytesAvailable) {
    src = src.subarray(0, dstBytesAvailable);
  }
  dst.set(src, off);
  return src.byteLength;
}

// https://deno.land/std@0.191.0/io/buf_reader.ts
var DEFAULT_BUF_SIZE = 4096;
var MIN_BUF_SIZE = 16;
var MAX_CONSECUTIVE_EMPTY_READS = 100;
var CR = "\r".charCodeAt(0);
var LF = "\n".charCodeAt(0);
var BufferFullError = class extends Error {
  constructor(partial) {
    super("Buffer full");
    this.partial = partial;
  }
  name = "BufferFullError";
};
var PartialReadError = class extends Error {
  name = "PartialReadError";
  partial;
  constructor() {
    super("Encountered UnexpectedEof, data only partially read");
  }
};
var BufReader = class _BufReader {
  #buf;
  #rd;
  // Reader provided by caller.
  #r = 0;
  // buf read position.
  #w = 0;
  // buf write position.
  #eof = false;
  // private lastByte: number;
  // private lastCharSize: number;
  /** return new BufReader unless r is BufReader */
  static create(r, size = DEFAULT_BUF_SIZE) {
    return r instanceof _BufReader ? r : new _BufReader(r, size);
  }
  constructor(rd, size = DEFAULT_BUF_SIZE) {
    if (size < MIN_BUF_SIZE) {
      size = MIN_BUF_SIZE;
    }
    this.#reset(new Uint8Array(size), rd);
  }
  /** Returns the size of the underlying buffer in bytes. */
  size() {
    return this.#buf.byteLength;
  }
  buffered() {
    return this.#w - this.#r;
  }
  // Reads a new chunk into the buffer.
  #fill = async () => {
    if (this.#r > 0) {
      this.#buf.copyWithin(0, this.#r, this.#w);
      this.#w -= this.#r;
      this.#r = 0;
    }
    if (this.#w >= this.#buf.byteLength) {
      throw Error("bufio: tried to fill full buffer");
    }
    for (let i3 = MAX_CONSECUTIVE_EMPTY_READS; i3 > 0; i3--) {
      const rr = await this.#rd.read(this.#buf.subarray(this.#w));
      if (rr === null) {
        this.#eof = true;
        return;
      }
      assert4(rr >= 0, "negative read");
      this.#w += rr;
      if (rr > 0) {
        return;
      }
    }
    throw new Error(
      `No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`
    );
  };
  /** Discards any buffered data, resets all state, and switches
   * the buffered reader to read from r.
   */
  reset(r) {
    this.#reset(this.#buf, r);
  }
  #reset = (buf, rd) => {
    this.#buf = buf;
    this.#rd = rd;
    this.#eof = false;
  };
  /** reads data into p.
   * It returns the number of bytes read into p.
   * The bytes are taken from at most one Read on the underlying Reader,
   * hence n may be less than len(p).
   * To read exactly len(p) bytes, use io.ReadFull(b, p).
   */
  async read(p) {
    let rr = p.byteLength;
    if (p.byteLength === 0) return rr;
    if (this.#r === this.#w) {
      if (p.byteLength >= this.#buf.byteLength) {
        const rr2 = await this.#rd.read(p);
        const nread = rr2 ?? 0;
        assert4(nread >= 0, "negative read");
        return rr2;
      }
      this.#r = 0;
      this.#w = 0;
      rr = await this.#rd.read(this.#buf);
      if (rr === 0 || rr === null) return rr;
      assert4(rr >= 0, "negative read");
      this.#w += rr;
    }
    const copied = copy2(this.#buf.subarray(this.#r, this.#w), p, 0);
    this.#r += copied;
    return copied;
  }
  /** reads exactly `p.length` bytes into `p`.
   *
   * If successful, `p` is returned.
   *
   * If the end of the underlying stream has been reached, and there are no more
   * bytes available in the buffer, `readFull()` returns `null` instead.
   *
   * An error is thrown if some bytes could be read, but not enough to fill `p`
   * entirely before the underlying stream reported an error or EOF. Any error
   * thrown will have a `partial` property that indicates the slice of the
   * buffer that has been successfully filled with data.
   *
   * Ported from https://golang.org/pkg/io/#ReadFull
   */
  async readFull(p) {
    let bytesRead = 0;
    while (bytesRead < p.length) {
      try {
        const rr = await this.read(p.subarray(bytesRead));
        if (rr === null) {
          if (bytesRead === 0) {
            return null;
          } else {
            throw new PartialReadError();
          }
        }
        bytesRead += rr;
      } catch (err) {
        if (err instanceof PartialReadError) {
          err.partial = p.subarray(0, bytesRead);
        }
        throw err;
      }
    }
    return p;
  }
  /** Returns the next byte [0, 255] or `null`. */
  async readByte() {
    while (this.#r === this.#w) {
      if (this.#eof) return null;
      await this.#fill();
    }
    const c2 = this.#buf[this.#r];
    this.#r++;
    return c2;
  }
  /** readString() reads until the first occurrence of delim in the input,
   * returning a string containing the data up to and including the delimiter.
   * If ReadString encounters an error before finding a delimiter,
   * it returns the data read before the error and the error itself
   * (often `null`).
   * ReadString returns err != nil if and only if the returned data does not end
   * in delim.
   * For simple uses, a Scanner may be more convenient.
   */
  async readString(delim) {
    if (delim.length !== 1) {
      throw new Error("Delimiter should be a single character");
    }
    const buffer = await this.readSlice(delim.charCodeAt(0));
    if (buffer === null) return null;
    return new TextDecoder().decode(buffer);
  }
  /** `readLine()` is a low-level line-reading primitive. Most callers should
   * use `readString('\n')` instead or use a Scanner.
   *
   * `readLine()` tries to return a single line, not including the end-of-line
   * bytes. If the line was too long for the buffer then `more` is set and the
   * beginning of the line is returned. The rest of the line will be returned
   * from future calls. `more` will be false when returning the last fragment
   * of the line. The returned buffer is only valid until the next call to
   * `readLine()`.
   *
   * The text returned from ReadLine does not include the line end ("\r\n" or
   * "\n").
   *
   * When the end of the underlying stream is reached, the final bytes in the
   * stream are returned. No indication or error is given if the input ends
   * without a final line end. When there are no more trailing bytes to read,
   * `readLine()` returns `null`.
   *
   * Calling `unreadByte()` after `readLine()` will always unread the last byte
   * read (possibly a character belonging to the line end) even if that byte is
   * not part of the line returned by `readLine()`.
   */
  async readLine() {
    let line = null;
    try {
      line = await this.readSlice(LF);
    } catch (err) {
      let partial;
      if (err instanceof PartialReadError) {
        partial = err.partial;
        assert4(
          partial instanceof Uint8Array,
          "bufio: caught error from `readSlice()` without `partial` property"
        );
      }
      if (!(err instanceof BufferFullError)) {
        throw err;
      }
      partial = err.partial;
      if (!this.#eof && partial && partial.byteLength > 0 && partial[partial.byteLength - 1] === CR) {
        assert4(this.#r > 0, "bufio: tried to rewind past start of buffer");
        this.#r--;
        partial = partial.subarray(0, partial.byteLength - 1);
      }
      if (partial) {
        return { line: partial, more: !this.#eof };
      }
    }
    if (line === null) {
      return null;
    }
    if (line.byteLength === 0) {
      return { line, more: false };
    }
    if (line[line.byteLength - 1] == LF) {
      let drop = 1;
      if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
        drop = 2;
      }
      line = line.subarray(0, line.byteLength - drop);
    }
    return { line, more: false };
  }
  /** `readSlice()` reads until the first occurrence of `delim` in the input,
   * returning a slice pointing at the bytes in the buffer. The bytes stop
   * being valid at the next read.
   *
   * If `readSlice()` encounters an error before finding a delimiter, or the
   * buffer fills without finding a delimiter, it throws an error with a
   * `partial` property that contains the entire buffer.
   *
   * If `readSlice()` encounters the end of the underlying stream and there are
   * any bytes left in the buffer, the rest of the buffer is returned. In other
   * words, EOF is always treated as a delimiter. Once the buffer is empty,
   * it returns `null`.
   *
   * Because the data returned from `readSlice()` will be overwritten by the
   * next I/O operation, most clients should use `readString()` instead.
   */
  async readSlice(delim) {
    let s2 = 0;
    let slice;
    while (true) {
      let i3 = this.#buf.subarray(this.#r + s2, this.#w).indexOf(delim);
      if (i3 >= 0) {
        i3 += s2;
        slice = this.#buf.subarray(this.#r, this.#r + i3 + 1);
        this.#r += i3 + 1;
        break;
      }
      if (this.#eof) {
        if (this.#r === this.#w) {
          return null;
        }
        slice = this.#buf.subarray(this.#r, this.#w);
        this.#r = this.#w;
        break;
      }
      if (this.buffered() >= this.#buf.byteLength) {
        this.#r = this.#w;
        const oldbuf = this.#buf;
        const newbuf = this.#buf.slice(0);
        this.#buf = newbuf;
        throw new BufferFullError(oldbuf);
      }
      s2 = this.#w - this.#r;
      try {
        await this.#fill();
      } catch (err) {
        if (err instanceof PartialReadError) {
          err.partial = slice;
        }
        throw err;
      }
    }
    return slice;
  }
  /** `peek()` returns the next `n` bytes without advancing the reader. The
   * bytes stop being valid at the next read call.
   *
   * When the end of the underlying stream is reached, but there are unread
   * bytes left in the buffer, those bytes are returned. If there are no bytes
   * left in the buffer, it returns `null`.
   *
   * If an error is encountered before `n` bytes are available, `peek()` throws
   * an error with the `partial` property set to a slice of the buffer that
   * contains the bytes that were available before the error occurred.
   */
  async peek(n) {
    if (n < 0) {
      throw Error("negative count");
    }
    let avail = this.#w - this.#r;
    while (avail < n && avail < this.#buf.byteLength && !this.#eof) {
      try {
        await this.#fill();
      } catch (err) {
        if (err instanceof PartialReadError) {
          err.partial = this.#buf.subarray(this.#r, this.#w);
        }
        throw err;
      }
      avail = this.#w - this.#r;
    }
    if (avail === 0 && this.#eof) {
      return null;
    } else if (avail < n && this.#eof) {
      return this.#buf.subarray(this.#r, this.#r + avail);
    } else if (avail < n) {
      throw new BufferFullError(this.#buf.subarray(this.#r, this.#w));
    }
    return this.#buf.subarray(this.#r, this.#r + n);
  }
};

// https://deno.land/std@0.191.0/bytes/concat.ts
function concat(...buf) {
  let length = 0;
  for (const b of buf) {
    length += b.length;
  }
  const output = new Uint8Array(length);
  let index = 0;
  for (const b of buf) {
    output.set(b, index);
    index += b.length;
  }
  return output;
}

// https://deno.land/std@0.191.0/io/read_lines.ts
async function* readLines(reader, decoderOpts) {
  const bufReader = new BufReader(reader);
  let chunks = [];
  const decoder = new TextDecoder(decoderOpts?.encoding, decoderOpts);
  while (true) {
    const res = await bufReader.readLine();
    if (!res) {
      if (chunks.length > 0) {
        yield decoder.decode(concat(...chunks));
      }
      break;
    }
    chunks.push(res.line);
    if (!res.more) {
      yield decoder.decode(concat(...chunks));
      chunks = [];
    }
  }
}

// https://deno.land/x/good@1.14.3.0/flattened/is_iterable_technically.js
var isIterableTechnically = function(value) {
  return value != null && (typeof value[Symbol.iterator] == "function" || typeof value[Symbol.asyncIterator] == "function");
};

// https://deno.land/x/good@1.14.3.0/flattened/is_generator_object.js
var isGeneratorObject = (value) => isIterator(value) && isIterableTechnically(value);

// https://deno.land/x/good@1.14.3.0/support/posix.js
var CHAR_FORWARD_SLASH4 = 47;
function assertPath4(path5) {
  if (typeof path5 !== "string") {
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(path5)}`
    );
  }
}
function basename7(path5, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath4(path5);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i3;
  if (ext !== void 0 && ext.length > 0 && ext.length <= path5.length) {
    if (ext.length === path5.length && ext === path5) return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i3 = path5.length - 1; i3 >= 0; --i3) {
      const code = path5.charCodeAt(i3);
      if (code === CHAR_FORWARD_SLASH4) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i3 + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i3;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) end = firstNonSlashEnd;
    else if (end === -1) end = path5.length;
    return path5.slice(start, end);
  } else {
    for (i3 = path5.length - 1; i3 >= 0; --i3) {
      if (path5.charCodeAt(i3) === CHAR_FORWARD_SLASH4) {
        if (!matchedSlash) {
          start = i3 + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i3 + 1;
      }
    }
    if (end === -1) return "";
    return path5.slice(start, end);
  }
}

// https://deno.land/x/good@1.14.3.0/flattened/path_pure_name.js
var Path = { basename: basename7 };
function pathPureName(path5) {
  const items = Path.basename(path5?.path || path5).split(".");
  if (items.length == 1) {
    return items[0];
  } else {
    return items.slice(0, -1);
  }
}

// https://deno.land/x/quickr@0.7.6/main/flat/_path_standardize.js
var pathStandardize = (path5) => {
  if (path5 instanceof Array) {
    return path5.map(pathStandardize);
  }
  path5 = path5.path || path5;
  if (typeof path5 == "string" && path5.startsWith("file:///")) {
    path5 = fromFileUrl3(path5);
  }
  return path5;
};

// https://deno.land/x/deno_deno@1.42.1.7/main.js
var fakeEnv = {
  HOME: "/fake/home",
  SHELL: "sh",
  PWD: "./"
};
var NotFound = class extends Error {
};
var PermissionDenied = class extends Error {
};
var ConnectionRefused = class extends Error {
};
var ConnectionReset = class extends Error {
};
var ConnectionAborted = class extends Error {
};
var NotConnected = class extends Error {
};
var AddrInUse = class extends Error {
};
var AddrNotAvailable = class extends Error {
};
var BrokenPipe = class extends Error {
};
var AlreadyExists = class extends Error {
};
var InvalidData = class extends Error {
};
var TimedOut = class extends Error {
};
var Interrupted = class extends Error {
};
var WriteZero = class extends Error {
};
var WouldBlock = class extends Error {
};
var UnexpectedEof = class extends Error {
};
var BadResource = class extends Error {
};
var Http = class extends Error {
};
var Busy = class extends Error {
};
var NotSupported = class extends Error {
};
var FilesystemLoop = class extends Error {
};
var IsADirectory = class extends Error {
};
var NetworkUnreachable = class extends Error {
};
var NotADirectory = class extends Error {
};
var PermissionStatus = class {
  constructor(state2) {
  }
};
var Permissions = class {
  async query() {
    return Promise.resolve(new PermissionStatus("granted"));
  }
  async revoke() {
    return Promise.resolve(new PermissionStatus("granted"));
  }
  async request() {
    return Promise.resolve(new PermissionStatus("granted"));
  }
};
var Stdin = class {
  static rid = 0;
  constructor() {
    this._inputs = [];
    this.isClosed = false;
  }
  isTerminal() {
    return false;
  }
  read(v) {
    return Promise.resolve(new Uint8Array());
  }
  readSync(v) {
  }
  setRaw(v) {
    this._inputs.push(v);
  }
  close() {
    this.isClosed = true;
  }
  readable() {
    if (globalThis.ReadableStream && !this.isClosed) {
      return new ReadableStream();
    }
  }
};
var Stdout = class {
  static rid = 1;
  constructor() {
    this._inputs = [];
  }
  write(v) {
    this._inputs.push(v);
    return Promise.resolve(v.length);
  }
  writeSync(v) {
    this._inputs.push(v);
    return v.length;
  }
  close() {
    this.isClosed = true;
  }
  writable() {
    if (globalThis.WritableStream && !this.isClosed) {
      return new WritableStream();
    }
  }
};
var Stderr = class {
  static rid = 2;
  constructor() {
    this._inputs = [];
  }
  write(v) {
    this._inputs.push(v);
    return Promise.resolve(v.length);
  }
  writeSync(v) {
    this._inputs.push(v);
    return v.length;
  }
  close() {
    this.isClosed = true;
  }
  writable() {
    if (globalThis.WritableStream && !this.isClosed) {
      return new WritableStream();
    }
  }
};
var Deno2 = globalThis.Deno ? globalThis.Deno : {
  mainModule: "file:///fake/$deno$repl.ts",
  internal: Symbol("Deno.internal"),
  version: { deno: "1.42.1", v8: "12.3.219.9", typescript: "5.4.3" },
  noColor: true,
  args: [],
  build: {
    target: "aarch64-apple-darwin",
    arch: "aarch64",
    os: "darwin",
    vendor: "apple",
    env: void 0
    // <- thats actually natively true
  },
  pid: 3,
  ppid: 2,
  env: {
    get(_) {
      return fakeEnv[_];
    },
    set(_, __) {
      fakeEnv[_] = __;
    }
  },
  errors: {
    NotFound,
    PermissionDenied,
    ConnectionRefused,
    ConnectionReset,
    ConnectionAborted,
    NotConnected,
    AddrInUse,
    AddrNotAvailable,
    BrokenPipe,
    AlreadyExists,
    InvalidData,
    TimedOut,
    Interrupted,
    WriteZero,
    WouldBlock,
    UnexpectedEof,
    BadResource,
    Http,
    Busy,
    NotSupported,
    FilesystemLoop,
    IsADirectory,
    NetworkUnreachable,
    NotADirectory
  },
  SeekMode: {
    0: "Start",
    1: "Current",
    2: "End",
    Start: 0,
    Current: 1,
    End: 2
  },
  stdin: new Stdin(),
  stdout: new Stdout(),
  stderr: new Stderr(),
  permissions: new Permissions(),
  resources() {
  },
  close() {
  },
  metrics() {
  },
  Process() {
  },
  run() {
  },
  isatty() {
  },
  writeFileSync() {
  },
  writeFile() {
  },
  writeTextFileSync() {
  },
  writeTextFile() {
  },
  readTextFile() {
  },
  readTextFileSync() {
  },
  readFile() {
  },
  readFileSync() {
  },
  watchFs() {
  },
  chmodSync() {
  },
  chmod() {
  },
  chown() {
  },
  chownSync() {
  },
  copyFileSync() {
  },
  cwd() {
    return fakeEnv["PWD"];
  },
  makeTempDirSync() {
  },
  makeTempDir() {
  },
  makeTempFileSync() {
  },
  makeTempFile() {
  },
  memoryUsage() {
  },
  mkdirSync() {
  },
  mkdir() {
  },
  chdir() {
  },
  copyFile() {
  },
  readDirSync() {
  },
  readDir() {
  },
  readLinkSync() {
  },
  readLink() {
  },
  realPathSync() {
  },
  realPath() {
  },
  removeSync() {
  },
  remove() {
  },
  renameSync() {
  },
  rename() {
  },
  statSync() {
  },
  lstatSync() {
  },
  stat() {
  },
  lstat() {
  },
  truncateSync() {
  },
  truncate() {
  },
  ftruncateSync() {
  },
  ftruncate() {
  },
  futime() {
  },
  futimeSync() {
  },
  inspect() {
  },
  exit() {
    throw Error(`Deno.exit() is not supported, so I'll just throw an error`);
  },
  execPath() {
  },
  Buffer() {
  },
  readAll() {
  },
  readAllSync() {
  },
  writeAll() {
  },
  writeAllSync() {
  },
  copy() {
  },
  iter() {
  },
  iterSync() {
  },
  read() {
  },
  readSync() {
  },
  write() {
  },
  writeSync() {
  },
  File() {
  },
  FsFile() {
  },
  open() {
  },
  openSync() {
  },
  create() {
  },
  createSync() {
  },
  seek() {
  },
  seekSync() {
  },
  connect() {
  },
  listen() {
  },
  loadavg() {
  },
  connectTls() {
  },
  listenTls() {
  },
  startTls() {
  },
  shutdown() {
  },
  fstatSync() {
  },
  fstat() {
  },
  fsyncSync() {
  },
  fsync() {
  },
  fdatasyncSync() {
  },
  fdatasync() {
  },
  symlink() {
  },
  symlinkSync() {
  },
  link() {
  },
  linkSync() {
  },
  Permissions() {
  },
  PermissionStatus() {
  },
  serveHttp() {
  },
  serve() {
  },
  resolveDns() {
  },
  upgradeWebSocket() {
  },
  utime() {
  },
  utimeSync() {
  },
  kill() {
  },
  addSignalListener() {
  },
  removeSignalListener() {
  },
  refTimer() {
  },
  unrefTimer() {
  },
  osRelease() {
    return "fake";
  },
  osUptime() {
  },
  hostname() {
    return "fake";
  },
  systemMemoryInfo() {
    return {
      total: 17179869184,
      free: 77104,
      available: 3279456,
      buffers: 0,
      cached: 0,
      swapTotal: 18253611008,
      swapFree: 878313472
    };
  },
  networkInterfaces() {
    return [];
  },
  consoleSize() {
    return { columns: 120, rows: 20 };
  },
  gid() {
    return 20;
  },
  uid() {
    return 501;
  },
  Command() {
  },
  ChildProcess() {
  },
  test() {
  },
  bench() {
  }
};
var internal = Deno2.internal;
var resources = Deno2.resources;
var close = Deno2.close;
var metrics = Deno2.metrics;
var Process = Deno2.Process;
var run = Deno2.run;
var isatty = Deno2.isatty;
var writeFileSync = Deno2.writeFileSync;
var writeFile = Deno2.writeFile;
var writeTextFileSync = Deno2.writeTextFileSync;
var writeTextFile = Deno2.writeTextFile;
var readTextFile = Deno2.readTextFile;
var readTextFileSync = Deno2.readTextFileSync;
var readFile = Deno2.readFile;
var readFileSync = Deno2.readFileSync;
var watchFs = Deno2.watchFs;
var chmodSync = Deno2.chmodSync;
var chmod = Deno2.chmod;
var chown = Deno2.chown;
var chownSync = Deno2.chownSync;
var copyFileSync2 = Deno2.copyFileSync;
var cwd = Deno2.cwd;
var makeTempDirSync = Deno2.makeTempDirSync;
var makeTempDir = Deno2.makeTempDir;
var makeTempFileSync = Deno2.makeTempFileSync;
var makeTempFile = Deno2.makeTempFile;
var memoryUsage = Deno2.memoryUsage;
var mkdirSync = Deno2.mkdirSync;
var mkdir = Deno2.mkdir;
var chdir = Deno2.chdir;
var copyFile2 = Deno2.copyFile;
var readDirSync = Deno2.readDirSync;
var readDir = Deno2.readDir;
var readLinkSync = Deno2.readLinkSync;
var readLink = Deno2.readLink;
var realPathSync = Deno2.realPathSync;
var realPath = Deno2.realPath;
var removeSync = Deno2.removeSync;
var remove = Deno2.remove;
var renameSync = Deno2.renameSync;
var rename = Deno2.rename;
var version = Deno2.version;
var build = Deno2.build;
var statSync = Deno2.statSync;
var lstatSync = Deno2.lstatSync;
var stat = Deno2.stat;
var lstat = Deno2.lstat;
var truncateSync = Deno2.truncateSync;
var truncate = Deno2.truncate;
var ftruncateSync = Deno2.ftruncateSync;
var ftruncate = Deno2.ftruncate;
var futime = Deno2.futime;
var futimeSync = Deno2.futimeSync;
var errors = Deno2.errors;
var inspect = Deno2.inspect;
var env = Deno2.env;
var exit = Deno2.exit;
var execPath = Deno2.execPath;
var Buffer2 = Deno2.Buffer;
var readAll = Deno2.readAll;
var readAllSync = Deno2.readAllSync;
var writeAll = Deno2.writeAll;
var writeAllSync = Deno2.writeAllSync;
var copy3 = Deno2.copy;
var iter = Deno2.iter;
var iterSync = Deno2.iterSync;
var SeekMode = Deno2.SeekMode;
var read = Deno2.read;
var readSync = Deno2.readSync;
var write = Deno2.write;
var writeSync = Deno2.writeSync;
var File = Deno2.File;
var FsFile = Deno2.FsFile;
var open = Deno2.open;
var openSync = Deno2.openSync;
var create = Deno2.create;
var createSync = Deno2.createSync;
var stdin = Deno2.stdin;
var stdout = Deno2.stdout;
var stderr = Deno2.stderr;
var seek = Deno2.seek;
var seekSync = Deno2.seekSync;
var connect = Deno2.connect;
var listen = Deno2.listen;
var loadavg = Deno2.loadavg;
var connectTls = Deno2.connectTls;
var listenTls = Deno2.listenTls;
var startTls = Deno2.startTls;
var shutdown = Deno2.shutdown;
var fstatSync = Deno2.fstatSync;
var fstat = Deno2.fstat;
var fsyncSync = Deno2.fsyncSync;
var fsync = Deno2.fsync;
var fdatasyncSync = Deno2.fdatasyncSync;
var fdatasync = Deno2.fdatasync;
var symlink = Deno2.symlink;
var symlinkSync = Deno2.symlinkSync;
var link = Deno2.link;
var linkSync = Deno2.linkSync;
var permissions = Deno2.permissions;
var serveHttp = Deno2.serveHttp;
var serve = Deno2.serve;
var resolveDns = Deno2.resolveDns;
var upgradeWebSocket = Deno2.upgradeWebSocket;
var utime2 = Deno2.utime;
var utimeSync2 = Deno2.utimeSync;
var kill = Deno2.kill;
var addSignalListener = Deno2.addSignalListener;
var removeSignalListener = Deno2.removeSignalListener;
var refTimer = Deno2.refTimer;
var unrefTimer = Deno2.unrefTimer;
var osRelease = Deno2.osRelease;
var osUptime = Deno2.osUptime;
var hostname = Deno2.hostname;
var systemMemoryInfo = Deno2.systemMemoryInfo;
var networkInterfaces = Deno2.networkInterfaces;
var consoleSize = Deno2.consoleSize;
var gid = Deno2.gid;
var uid = Deno2.uid;
var Command = Deno2.Command;
var ChildProcess = Deno2.ChildProcess;
var test = Deno2.test;
var bench = Deno2.bench;
var pid = Deno2.pid;
var ppid = Deno2.ppid;
var noColor = Deno2.noColor;
var args = Deno2.args;
var mainModule = Deno2.mainModule;
try {
  globalThis.Deno = Deno2;
} catch (error) {
}
var DenoPermissions = Deno2.Permissions;
var DenoPermissionStatus = Deno2.PermissionStatus;

// https://deno.land/x/quickr@0.7.6/main/flat/make_absolute_path.js
var makeAbsolutePath = (path5) => {
  if (!isAbsolute3(path5)) {
    return normalize4(join4(cwd(), path5));
  } else {
    return normalize4(path5);
  }
};

// https://deno.land/x/quickr@0.7.6/main/flat/normalize_path.js
var normalizePath = (path5) => normalize4(pathStandardize(path5)).replace(/\/$/, "");

// https://deno.land/x/quickr@0.7.6/main/flat/path.js
var Deno3 = { lstatSync, statSync, readLinkSync };
var PathTools = { parse: parse3, basename: basename3, dirname: dirname3, relative: relative3, isAbsolute: isAbsolute3 };
var Path2 = class {
  constructor({ path: path5, _lstatData, _statData }) {
    this.path = path5;
    this._lstat = _lstatData;
    this._data = _statData;
  }
  // 
  // core data sources
  // 
  refresh() {
    this._lstat = null;
    this._data = null;
  }
  get lstat() {
    if (!this._lstat) {
      try {
        this._lstat = Deno3.lstatSync(this.path);
      } catch (error) {
        this._lstat = { doesntExist: true };
      }
    }
    return this._lstat;
  }
  get stat() {
    if (!this._stat) {
      const lstat2 = this.lstat;
      if (!lstat2.isSymlink) {
        this._stat = {
          isBrokenLink: false,
          isLoopOfLinks: false
        };
      } else {
        try {
          this._stat = Deno3.statSync(this.path);
        } catch (error) {
          this._stat = {};
          if (error.message.match(/^Too many levels of symbolic links/)) {
            this._stat.isBrokenLink = true;
            this._stat.isLoopOfLinks = true;
          } else if (error.message.match(/^No such file or directory/)) {
            this._stat.isBrokenLink = true;
          } else {
            throw error;
          }
        }
      }
    }
    return this._stat;
  }
  // 
  // main attributes
  // 
  get exists() {
    const lstat2 = this.lstat;
    return !lstat2.doesntExist;
  }
  get name() {
    return PathTools.parse(this.path).name;
  }
  get extension() {
    return PathTools.parse(this.path).ext;
  }
  get basename() {
    return this.path && PathTools.basename(this.path);
  }
  get parentPath() {
    return this.path && PathTools.dirname(this.path);
  }
  relativePathFrom(parentPath) {
    return PathTools.relative(parentPath, this.path);
  }
  get link() {
    const lstat2 = this.lstat;
    if (lstat2.isSymlink) {
      return Deno3.readLinkSync(this.path);
    } else {
      return null;
    }
  }
  get isSymlink() {
    const lstat2 = this.lstat;
    return !!lstat2.isSymlink;
  }
  get isRelativeSymlink() {
    const lstat2 = this.lstat;
    const isNotSymlink = !lstat2.isSymlink;
    if (isNotSymlink) {
      return false;
    }
    const relativeOrAbsolutePath = Deno3.readLinkSync(this.path);
    return !PathTools.isAbsolute(relativeOrAbsolutePath);
  }
  get isAbsoluteSymlink() {
    const lstat2 = this.lstat;
    const isNotSymlink = !lstat2.isSymlink;
    if (isNotSymlink) {
      return false;
    }
    const relativeOrAbsolutePath = Deno3.readLinkSync(this.path);
    return PathTools.isAbsolute(relativeOrAbsolutePath);
  }
  get isBrokenLink() {
    const stat2 = this.stat;
    return !!stat2.isBrokenLink;
  }
  get isLoopOfLinks() {
    const stat2 = this.stat;
    return !!stat2.isLoopOfLinks;
  }
  get isFile() {
    const lstat2 = this.lstat;
    if (lstat2.doesntExist) {
      return false;
    }
    if (!lstat2.isSymlink) {
      return lstat2.isFile;
    } else {
      return !!this.stat.isFile;
    }
  }
  get isFolder() {
    const lstat2 = this.lstat;
    if (lstat2.doesntExist) {
      return false;
    }
    if (!lstat2.isSymlink) {
      return lstat2.isDirectory;
    } else {
      return !!this.stat.isDirectory;
    }
  }
  get sizeInBytes() {
    const lstat2 = this.lstat;
    return lstat2.size;
  }
  get permissions() {
    const { mode } = this.lstat;
    return {
      owner: {
        //          rwxrwxrwx
        canRead: !!(256 & mode),
        canWrite: !!(128 & mode),
        canExecute: !!(64 & mode)
      },
      group: {
        canRead: !!(32 & mode),
        canWrite: !!(16 & mode),
        canExecute: !!(8 & mode)
      },
      others: {
        canRead: !!(4 & mode),
        canWrite: !!(2 & mode),
        canExecute: !!(1 & mode)
      }
    };
  }
  // aliases
  get isDirectory() {
    return this.isFolder;
  }
  get dirname() {
    return this.parentPath;
  }
  toJSON() {
    return {
      exists: this.exists,
      name: this.name,
      extension: this.extension,
      basename: this.basename,
      parentPath: this.parentPath,
      isSymlink: this.isSymlink,
      isBrokenLink: this.isBrokenLink,
      isLoopOfLinks: this.isLoopOfLinks,
      isFile: this.isFile,
      isFolder: this.isFolder,
      sizeInBytes: this.sizeInBytes,
      permissions: this.permissions,
      isDirectory: this.isDirectory,
      dirname: this.dirname
    };
  }
};

// https://deno.land/x/quickr@0.7.6/main/flat/escape_glob_for_posix.js
var escapeGlobForPosix = (glob2) => {
  return glob2.replace(/[\[\\\*\{\?@\+\!]/g, `\\$&`);
};

// https://deno.land/x/quickr@0.7.6/main/flat/escape_glob_for_windows.js
var escapeGlobForWindows = (glob2) => {
  return glob2.replace(/[\[`\*\{\?@\+\!]/g, "`$&");
};

// https://deno.land/x/quickr@0.7.6/main/flat/escape_glob.js
var escapeGlob = build.os == "windows" ? escapeGlobForWindows : escapeGlobForPosix;

// https://esm.sh/gh/jeff-hykin/good-js@40797ac/denonext/source/flattened/common_prefix.mjs
function i(e) {
  for (let l2 of e) {
    for (let o2 of e) {
      if (o2 !== l2) return false;
      l2 = o2;
    }
    break;
  }
  return true;
}
function m(e) {
  let l2 = Math.max(...e.map((a) => a.length));
  if (l2 === 0 || e.length == 0) return "";
  let o2 = 0, r, t = 0;
  for (; o2 <= l2; ) r = Math.floor((o2 + l2) / 2), i(e.map((f3) => f3.slice(0, r))) ? (t = r, o2 = r + 1) : l2 = r - 1;
  return e[0].slice(0, t);
}

// https://deno.land/x/quickr@0.7.6/main/file_system.js
var cache = {};
function setTrueBit(n, bit) {
  return n | 1 << bit;
}
function setFalseBit(n, bit) {
  return ~(~n | 1 << bit);
}
var defaultOptionsHelper = (options) => ({
  renameExtension: options.renameExtension || FileSystem.defaultRenameExtension,
  overwrite: options.overwrite
});
var fileLockSymbol = Symbol.for("fileLock");
var locker = globalThis[fileLockSymbol] || {};
var grabPathLock = async (path5) => {
  while (locker[path5]) {
    await new Promise((resolve7) => setTimeout(resolve7, 70));
  }
  locker[path5] = true;
};
var logicalExtensionWrapper = (promise, path5) => {
  return promise;
};
var FileSystem = {
  defaultRenameExtension: ".old",
  denoExecutablePath: Deno.execPath(),
  parentPath: dirname3,
  dirname: dirname3,
  basename: basename3,
  extname: extname3,
  join: join4,
  normalize: normalizePath,
  normalizePath,
  pureNameOf: pathPureName,
  isAbsolutePath: isAbsolute3,
  isRelativePath: (...args2) => !isAbsolute3(...args2),
  makeRelativePath: ({ from, to }) => relative3(from.path || from, to.path || to),
  makeAbsolutePath,
  pathDepth(path5) {
    path5 = FileSystem.normalizePath(path5);
    let count2 = 0;
    for (const eachChar of path5.path || path5) {
      if (eachChar == "/") {
        count2++;
      }
    }
    if (path5[0] == "/") {
      count2--;
    }
    return count2 + 1;
  },
  pathPieces(path5) {
    path5 = path5.path || path5;
    const result = parse3(path5);
    const folderList = [];
    let dirname7 = result.dir;
    while (true) {
      folderList.push(basename3(dirname7));
      if (dirname7 == dirname3(dirname7)) {
        break;
      }
      dirname7 = dirname3(dirname7);
    }
    folderList.reverse();
    return [folderList, result.name, result.ext];
  },
  /**
   * add to name, preserve file extension
   *
   * @example
   * ```js
   * let newName = FileSystem.extendName({ path: "a/blah.thing.js", string: ".old" })
   * newName == "a/blah.old.thing.js"
   * ```
   *
   * @param arg1.path - item path
   * @param arg1.string - the string to append to the name
   * @return {string} - the new path
   */
  extendName({ path: path5, string }) {
    path5 = pathStandardize(path5);
    const [name, ...extensions] = basename3(path5).split(".");
    return `${dirname3(path5)}/${name}${string}${extensions.length == 0 ? "" : `.${extensions.join(".")}`}`;
  },
  /**
   * All Parent Paths
   *
   * @param {String} path - path doesnt need to exist
   * @return {[String]} longest to shortest parent path
   */
  allParentPaths(path5) {
    const pathStartsWithDotSlash = path5.startsWith("./");
    path5 = FileSystem.normalizePath(path5);
    if (path5 === ".") {
      return [];
    }
    const dotGotRemoved = pathStartsWithDotSlash && !path5.startsWith("./");
    let previousPath = null;
    let allPaths = [];
    while (1) {
      previousPath = path5;
      path5 = FileSystem.parentPath(path5);
      if (previousPath === path5) {
        break;
      }
      allPaths.push(path5);
    }
    allPaths.reverse();
    allPaths = allPaths.filter((each2) => each2 != ".");
    if (dotGotRemoved) {
      allPaths.push(".");
    }
    return allPaths;
  },
  pathOfCaller(callerNumber = void 0) {
    const err = new Error();
    let filePaths = findAll(/^.+file:\/\/(\/[\w\W]*?):/gm, err.stack).map((each2) => each2[1]);
    if (callerNumber) {
      filePaths = filePaths.slice(callerNumber);
    }
    try {
      const secondPath = filePaths[1];
      if (secondPath) {
        try {
          if (Deno.statSync(secondPath).isFile) {
            return secondPath;
          }
        } catch (error) {
        }
      }
    } catch (error) {
    }
    return Deno.cwd();
  },
  get home() {
    if (!cache.home) {
      if (Deno.build.os != "windows") {
        cache.home = Deno.env.get("HOME");
      } else {
        cache.home = Deno.env.get("HOMEPATH");
      }
    }
    return cache.home;
  },
  get workingDirectory() {
    return Deno.cwd();
  },
  set workingDirectory(value) {
    Deno.chdir(value);
  },
  get cwd() {
    return FileSystem.workingDirectory;
  },
  set cwd(value) {
    return FileSystem.workingDirectory = value;
  },
  get pwd() {
    return FileSystem.cwd;
  },
  set pwd(value) {
    return FileSystem.cwd = value;
  },
  cd(path5) {
    Deno.chdir(path5);
  },
  changeDirectory(path5) {
    Deno.chdir(path5);
  },
  get thisFile() {
    const err = new Error();
    const filePaths = [...err.stack.matchAll(/^.+(file:\/\/\/[\w\W]*?):/gm)].map((each2) => each2[1] && fromFileUrl3(each2[1]));
    const firstPath = filePaths[0];
    if (firstPath) {
      try {
        if (Deno.statSync(firstPath).isFile) {
          return firstPath;
        }
      } catch (error) {
      }
    }
    return ":<interpreter>:";
  },
  get thisFolder() {
    const err = new Error();
    const filePaths = [...err.stack.matchAll(/^.+(file:\/\/\/[\w\W]*?):/gm)].map((each2) => each2[1] && fromFileUrl3(each2[1]));
    const firstPath = filePaths[0];
    if (firstPath) {
      try {
        if (Deno.statSync(firstPath).isFile) {
          return dirname3(firstPath);
        }
      } catch (error) {
      }
    }
    return Deno.cwd();
  },
  async read(path5) {
    path5 = pathStandardize(path5);
    await grabPathLock(path5);
    let output;
    try {
      output = await Deno.readTextFile(path5);
    } catch (error) {
    }
    delete locker[path5];
    return output;
  },
  async readBytes(path5) {
    path5 = pathStandardize(path5);
    await grabPathLock(path5);
    let output;
    try {
      output = await Deno.readFile(path5);
    } catch (error) {
    }
    delete locker[path5];
    return output;
  },
  async *readLinesIteratively(path5) {
    path5 = pathStandardize(path5);
    await grabPathLock(path5);
    try {
      const file = await Deno.open(path5);
      try {
        yield* readLines(file);
      } finally {
        Deno?.close?.(file.rid);
      }
    } finally {
      delete locker[path5];
    }
  },
  async info(fileOrFolderPath, _cachedLstat = null) {
    fileOrFolderPath = pathStandardize(fileOrFolderPath);
    await grabPathLock(fileOrFolderPath);
    try {
      const lstat2 = _cachedLstat || await Deno.lstat(fileOrFolderPath).catch(() => ({ doesntExist: true }));
      let stat2 = {};
      if (!lstat2.isSymlink) {
        stat2 = {
          isBrokenLink: false,
          isLoopOfLinks: false
        };
      } else {
        try {
          stat2 = await Deno.stat(fileOrFolderPath);
        } catch (error) {
          if (error.message.match(/^Too many levels of symbolic links/)) {
            stat2.isBrokenLink = true;
            stat2.isLoopOfLinks = true;
          } else if (error.message.match(/^No such file or directory/)) {
            stat2.isBrokenLink = true;
          } else {
            if (!error.message.match(/^PermissionDenied:/)) {
              return { doesntExist: true, permissionDenied: true };
            }
            throw error;
          }
        }
      }
      return new Path2({ path: fileOrFolderPath, _lstatData: lstat2, _statData: stat2 });
    } finally {
      delete locker[fileOrFolderPath];
    }
  },
  exists(path5) {
    return logicalExtensionWrapper(Deno.lstat(path5?.path || path5).catch(() => false), path5);
  },
  isSymlink(path5) {
    return logicalExtensionWrapper(Deno.lstat(path5?.path || path5).catch(() => false).then((item) => item.isSymlink), path5);
  },
  isFileOrSymlinkToNormalFile(path5) {
    return logicalExtensionWrapper(Deno.stat(path5?.path || path5).catch(() => false).then((item) => item.isFile), path5);
  },
  isFolderOrSymlinkToFolder(path5) {
    return logicalExtensionWrapper(Deno.stat(path5?.path || path5).catch(() => false).then((item) => item.isDirectory), path5);
  },
  isFileHardlink(path5) {
    return logicalExtensionWrapper(Deno.lstat(path5?.path || path5).catch(() => false).then((item) => item.isFile), path5);
  },
  isFolderHardlink(path5) {
    return logicalExtensionWrapper(Deno.lstat(path5?.path || path5).catch(() => false).then((item) => item.isDirectory), path5);
  },
  isNonFolderHardlink(path5) {
    return logicalExtensionWrapper(Deno.lstat(path5?.path || path5).catch(() => false).then((item) => !item.isDirectory), path5);
  },
  isWeirdItem(path5) {
    return logicalExtensionWrapper(Deno.lstat(path5?.path || path5).catch(() => false).then((item) => each.isBlockDevice || each.isCharDevice || each.isFifo || each.isSocket), path5);
  },
  async move({ path: path5, item, newParentFolder, newName, force = true, overwrite = false, renameExtension = null }) {
    item = item || path5;
    const oldPath = item.path || item;
    const oldName = FileSystem.basename(oldPath);
    const pathInfo = item instanceof Object || FileSystem.sync.info(oldPath);
    const newPath = `${newParentFolder || FileSystem.parentPath(oldPath)}/${newName || oldName}`;
    if (pathInfo.isSymlink && !item.isBrokenLink) {
      const link2 = Deno.readLinkSync(pathInfo.path);
      if (!isAbsolute3(link2)) {
        const linkTargetBeforeMove = `${FileSystem.parentPath(pathInfo.path)}/${link2}`;
        await FileSystem.relativeLink({
          existingItem: linkTargetBeforeMove,
          newItem: newPath,
          force,
          overwrite,
          renameExtension
        });
        await FileSystem.remove(pathInfo);
      }
    }
    if (force) {
      FileSystem.sync.clearAPathFor(newPath, { overwrite, renameExtension });
    }
    await move(oldPath, newPath);
  },
  async rename({ from, to, force = true, overwrite = false, renameExtension = null }) {
    return FileSystem.move({ path: from, newParentFolder: FileSystem.parentPath(to), newName: FileSystem.basename(to), force, overwrite, renameExtension });
  },
  async remove(fileOrFolder) {
    fileOrFolder = pathStandardize(fileOrFolder);
    if (fileOrFolder instanceof Array) {
      return Promise.all(fileOrFolder.map(FileSystem.remove));
    }
    let exists2 = false;
    let item;
    try {
      item = await Deno.lstat(fileOrFolder);
      exists2 = true;
    } catch (error) {
    }
    if (exists2) {
      if (item.isFile || item.isSymlink || !item.isDirectory) {
        return Deno.remove(fileOrFolder.replace(/\/+$/, ""));
      } else {
        return Deno.remove(fileOrFolder.replace(/\/+$/, ""), { recursive: true });
      }
    }
  },
  async finalTargetOf(path5, options = {}) {
    const { _parentsHaveBeenChecked, cache: cache2 } = { _parentsHaveBeenChecked: false, cache: {}, ...options };
    const originalWasItem = path5 instanceof Path2;
    path5 = path5.path || path5;
    let result = await Deno.lstat(path5).catch(() => ({ doesntExist: true }));
    if (result.doesntExist) {
      return null;
    }
    path5 = await FileSystem.makeHardPathTo(path5, { cache: cache2 });
    const pathChain = [];
    while (result.isSymlink) {
      const relativeOrAbsolutePath = await Deno.readLink(path5);
      if (isAbsolute3(relativeOrAbsolutePath)) {
        path5 = relativeOrAbsolutePath;
      } else {
        path5 = `${FileSystem.parentPath(path5)}/${relativeOrAbsolutePath}`;
      }
      result = await Deno.lstat(path5).catch(() => ({ doesntExist: true }));
      if (result.doesntExist) {
        return null;
      }
      path5 = await FileSystem.makeHardPathTo(path5, { cache: cache2 });
      if (pathChain.includes(path5)) {
        return null;
      }
      pathChain.push(path5);
    }
    path5 = FileSystem.normalizePath(path5);
    if (originalWasItem) {
      return new Path2({ path: path5 });
    } else {
      return path5;
    }
  },
  async nextTargetOf(path5, options = {}) {
    const originalWasItem = path5 instanceof Path2;
    const item = originalWasItem ? path5 : new Path2({ path: path5 });
    const lstat2 = item.lstat;
    if (lstat2.isSymlink) {
      const relativeOrAbsolutePath = Deno.readLinkSync(item.path);
      if (isAbsolute3(relativeOrAbsolutePath)) {
        if (originalWasItem) {
          return new Path2({ path: relativeOrAbsolutePath });
        } else {
          return relativeOrAbsolutePath;
        }
      } else {
        const path6 = `${await FileSystem.makeHardPathTo(dirname3(item.path))}/${relativeOrAbsolutePath}`;
        if (originalWasItem) {
          return new Path2({ path: path6 });
        } else {
          return path6;
        }
      }
    } else {
      if (originalWasItem) {
        return item;
      } else {
        return item.path;
      }
    }
  },
  async ensureIsFile(path5, options = { overwrite: false, renameExtension: null }) {
    const { overwrite, renameExtension } = defaultOptionsHelper(options);
    await FileSystem.ensureIsFolder(FileSystem.parentPath(path5), { overwrite, renameExtension });
    path5 = path5.path || path5;
    const pathInfo = await FileSystem.info(path5);
    if (pathInfo.isFile && !pathInfo.isDirectory) {
      return path5;
    } else {
      await FileSystem.write({ path: path5, data: "" });
      return path5;
    }
  },
  async ensureIsFolder(path5, options = { overwrite: false, renameExtension: null }) {
    const { overwrite, renameExtension } = defaultOptionsHelper(options);
    path5 = path5.path || path5;
    path5 = FileSystem.makeAbsolutePath(path5);
    const parentPath = dirname3(path5);
    if (parentPath == path5) {
      return;
    }
    const parent = await FileSystem.info(parentPath);
    if (!parent.isDirectory) {
      FileSystem.sync.ensureIsFolder(parentPath, { overwrite, renameExtension });
    }
    let pathInfo = FileSystem.sync.info(path5);
    if (pathInfo.exists && !pathInfo.isDirectory) {
      if (overwrite) {
        await FileSystem.remove(path5);
      } else {
        await FileSystem.moveOutOfTheWay(eachPath, { extension: renameExtension });
      }
    }
    await Deno.mkdir(path5, { recursive: true });
    return path5;
  },
  /**
   * Move/Remove everything and Ensure parent folders
   *
   * @param path
   * @param options.overwrite - if false, then things in the way will be moved instead of deleted
   * @param options.renameExtension - the string to append when renaming files to get them out of the way
   * 
   * @note
   *     very agressive: will change whatever is necessary to make sure a parent exists
   * 
   * @example
   * ```js
   * await FileSystem.clearAPathFor("./something")
   * ```
   */
  async clearAPathFor(path5, options = { overwrite: false, renameExtension: null }) {
    const { overwrite, renameExtension } = defaultOptionsHelper(options);
    const originalPath = path5;
    const paths = [];
    while (dirname3(path5) !== path5) {
      paths.push(path5);
      path5 = dirname3(path5);
    }
    for (const eachPath2 of paths.reverse()) {
      const info = await FileSystem.info(eachPath2);
      if (!info.exists) {
        break;
      } else if (!info.isDirectory) {
        if (overwrite) {
          await FileSystem.remove(eachPath2);
        } else {
          await FileSystem.moveOutOfTheWay(eachPath2, { extension: renameExtension });
        }
      }
    }
    await Deno.mkdir(dirname3(originalPath), { recursive: true });
    return originalPath;
  },
  async moveOutOfTheWay(path5, options = { extension: null }) {
    const extension = options?.extension || FileSystem.defaultRenameExtension;
    const info = await FileSystem.info(path5);
    if (info.exists) {
      const newPath = path5 + extension;
      await FileSystem.moveOutOfTheWay(newPath, { extension });
      await move(path5, newPath);
    }
  },
  /**
   * find a root folder based on a child path
   *
   * @example
   * ```js
   *     import { FileSystem } from "https://deno.land/x/quickr/main/file_system.js"
   * 
   *     // option1: single subpath
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil(".git")
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil(".git/config")
   *     // option2: multiple subpaths
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil([".git/config", ".git/refs/heads/master"])
   *     // option3: function checker
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil(path=>FileSystem.exists(`${path}/.git`))
   *
   *     // change the startPath with a subPath
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil({startPath: FileSystem.pwd, subPath:".git"})
   *     // change the startPath with a function checker
   *     var gitParentFolderOrNull = await FileSystem.walkUpUntil({startPath: FileSystem.pwd}, path=>FileSystem.exists(`${path}/.git`))
   *```
   */
  async walkUpUntil(subPath, startPath = null) {
    var func, subPathStrs, startPath;
    if (subPath instanceof Function) {
      func = subPath;
      subPathStrs = [];
    } else if (subPath instanceof Array) {
      subPathStrs = subPath;
    } else if (subPath instanceof Object) {
      func = startPath;
      var { subPath, startPath } = subPath;
      subPathStrs = [subPath];
    } else {
      subPathStrs = [subPath];
    }
    subPathStrs = subPathStrs.map((each2) => each2 instanceof Path2 ? each2.path : each2);
    if (!startPath) {
      startPath = Deno.cwd();
    } else if (isAbsolute3(startPath)) {
      startPath = startPath;
    } else {
      startPath = join4(here, startPath);
    }
    let here = startPath;
    while (1) {
      const check = func ? await func(here) : (await Promise.all(subPathStrs.map((each2) => Deno.lstat(join4(here, each2)).catch(() => false)))).some((each2) => each2);
      if (check) {
        return here;
      }
      if (here == dirname3(here)) {
        return null;
      } else {
        here = dirname3(here);
      }
    }
  },
  async copy({ from, to, preserveTimestamps = true, force = true, overwrite = false, renameExtension = null }) {
    const existingItemDoesntExist = (await Deno.stat(from).catch(() => ({ doesntExist: true }))).doesntExist;
    if (existingItemDoesntExist) {
      throw Error(`
Tried to copy from:${from}, to:${to}
but "from" didn't seem to exist

`);
    }
    if (force) {
      FileSystem.sync.clearAPathFor(to, { overwrite, renameExtension });
    }
    return copy(from, to, { force, preserveTimestamps: true });
  },
  async relativeLink({ existingItem, newItem, force = true, overwrite = false, allowNonExistingTarget = false, renameExtension = null }) {
    const existingItemPath = (existingItem.path || existingItem).replace(/\/+$/, "");
    const newItemPath = FileSystem.normalizePath((newItem.path || newItem).replace(/\/+$/, ""));
    const existingItemDoesntExist = (await Deno.lstat(existingItemPath).catch(() => ({ doesntExist: true }))).doesntExist;
    if (!allowNonExistingTarget && existingItemDoesntExist) {
      throw Error(`
Tried to create a relativeLink between existingItem:${existingItemPath}, newItem:${newItemPath}
but existingItem didn't actually exist`);
    } else {
      const parentOfNewItem = FileSystem.parentPath(newItemPath);
      await FileSystem.ensureIsFolder(parentOfNewItem, { overwrite, renameExtension });
      const hardPathToNewItem = `${await FileSystem.makeHardPathTo(parentOfNewItem)}/${FileSystem.basename(newItemPath)}`;
      const hardPathToExistingItem = await FileSystem.makeHardPathTo(existingItemPath);
      const pathFromNewToExisting = relative3(hardPathToNewItem, hardPathToExistingItem).replace(/^\.\.\//, "");
      if (force) {
        FileSystem.sync.clearAPathFor(hardPathToNewItem, { overwrite, renameExtension });
      }
      return Deno.symlink(
        pathFromNewToExisting,
        hardPathToNewItem
      );
    }
  },
  async absoluteLink({ existingItem, newItem, force = true, allowNonExistingTarget = false, overwrite = false, renameExtension = null }) {
    existingItem = (existingItem.path || existingItem).replace(/\/+$/, "");
    const newItemPath = FileSystem.normalizePath(newItem.path || newItem).replace(/\/+$/, "");
    const existingItemDoesntExist = (await Deno.lstat(existingItem).catch(() => ({ doesntExist: true }))).doesntExist;
    if (!allowNonExistingTarget && existingItemDoesntExist) {
      throw Error(`
Tried to create a relativeLink between existingItem:${existingItem}, newItemPath:${newItemPath}
but existingItem didn't actually exist`);
    } else {
      const parentOfNewItem = FileSystem.parentPath(newItemPath);
      await FileSystem.ensureIsFolder(parentOfNewItem, { overwrite, renameExtension });
      const hardPathToNewItem = `${await FileSystem.makeHardPathTo(parentOfNewItem)}/${FileSystem.basename(newItemPath)}`;
      if (force) {
        FileSystem.sync.clearAPathFor(hardPathToNewItem, { overwrite, renameExtension });
      }
      return Deno.symlink(
        FileSystem.makeAbsolutePath(existingItem),
        newItemPath
      );
    }
  },
  async hardLink({ existingItem, newItem, force = true, overwrite = false, renameExtension = null, hardLink = false }) {
    existingItem = (existingItem.path || existingItem).replace(/\/+$/, "");
    const newItemPath = FileSystem.normalizePath(newItem.path || newItem).replace(/\/+$/, "");
    const existingItemDoesntExist = (await Deno.lstat(existingItem).catch(() => ({ doesntExist: true }))).doesntExist;
    if (existingItemDoesntExist) {
      throw Error(`
Tried to create a relativeLink between existingItem:${existingItem}, newItemPath:${newItemPath}
but existingItem didn't actually exist`);
    } else {
      const parentOfNewItem = FileSystem.parentPath(newItemPath);
      await FileSystem.ensureIsFolder(parentOfNewItem, { overwrite, renameExtension });
      if (force) {
        FileSystem.sync.clearAPathFor(newItem, { overwrite, renameExtension });
      }
      return Deno.link(
        FileSystem.makeAbsolutePath(existingItem),
        newItemPath
      );
    }
  },
  async *iterateBasenamesIn(pathOrFileInfo) {
    const info = pathOrFileInfo instanceof Path2 ? pathOrFileInfo : await FileSystem.info(pathOrFileInfo);
    if (info.isFolder) {
      for await (const dirEntry of Deno.readDir(info.path)) {
        yield dirEntry.name;
      }
    }
  },
  listBasenamesIn(pathOrFileInfo) {
    return asyncIteratorToList(FileSystem.iterateBasenamesIn(pathOrFileInfo));
  },
  async *iteratePathsIn(pathOrFileInfo, options = { recursively: false, shouldntInclude: null, shouldntExplore: null, searchOrder: "breadthFirstSearch", maxDepth: Infinity, dontFollowSymlinks: false, dontReturnSymlinks: false, maxDepthFromRoot: null }) {
    let info;
    try {
      info = pathOrFileInfo instanceof Path2 ? pathOrFileInfo : await FileSystem.info(pathOrFileInfo);
    } catch (error) {
      if (!error.message.match(/^PermissionDenied:/)) {
        throw error;
      }
    }
    const path5 = info.path;
    const startingDepth = FileSystem.makeAbsolutePath(path5).split("/").length - 1;
    options.recursively = options.recursively == false && options.maxDepth == 1 ? false : options.recursively;
    if (options.maxDepthFromRoot == null) {
      options.maxDepthFromRoot = Infinity;
    }
    if (options.maxDepth != Infinity && options.maxDepth != null) {
      options.maxDepthFromRoot = startingDepth + options.maxDepth;
    }
    options.maxDepth = null;
    if (startingDepth < options.maxDepthFromRoot) {
      if (!options.recursively) {
        if (info.isFolder) {
          if (!options.shouldntInclude) {
            for await (const each2 of Deno.readDir(path5)) {
              if (options.dontReturnSymlinks && each2.isSymlink) {
                continue;
              }
              yield join4(path5, each2.name);
            }
          } else {
            const shouldntInclude = options.shouldntInclude;
            for await (const each2 of Deno.readDir(path5)) {
              const eachPath2 = join4(path5, each2.name);
              if (options.dontReturnSymlinks && each2.isSymlink) {
                continue;
              }
              const shouldntIncludeThis = shouldntInclude && await shouldntInclude(eachPath2);
              if (!shouldntIncludeThis) {
                yield eachPath2;
              }
            }
          }
        }
      } else {
        options = { exclude: /* @__PURE__ */ new Set(), searchOrder: "breadthFirstSearch", maxDepth: Infinity, ...options };
        options.searchOrder = options.searchOrder || "breadthFirstSearch";
        const { shouldntExplore, shouldntInclude } = options;
        if (!["breadthFirstSearch", "depthFirstSearch"].includes(options.searchOrder)) {
          throw Error(`when calling FileSystem.iterateItemsIn('${path5}', { searchOrder: ${options.searchOrder} })

    The searchOrder currently can only be 'depthFirstSearch' or 'breadthFirstSearch'
    However, it was not either of those: ${options.searchOrder}`);
        }
        const useBreadthFirstSearch = options.searchOrder == "breadthFirstSearch";
        const shouldntExploreThis = shouldntExplore && await shouldntExplore(info.path, info);
        if (!shouldntExploreThis && info.isFolder) {
          options.exclude = options.exclude instanceof Set ? options.exclude : new Set(options.exclude);
          if (!options.exclude.has(path5)) {
            const followSymlinks = !options.dontFollowSymlinks;
            const absolutePathVersion = FileSystem.makeAbsolutePath(path5);
            options.exclude.add(absolutePathVersion);
            const searchAfterwords = [];
            for await (const entry of Deno.readDir(path5)) {
              const eachPath2 = join4(path5, entry.name);
              if (options.dontReturnSymlinks && each.isSymlink) {
                continue;
              }
              const shouldntIncludeThis = shouldntInclude && await shouldntInclude(eachPath2);
              if (!shouldntIncludeThis) {
                yield eachPath2;
              }
              const isNormalFileHardlink = entry.isFile;
              const isWeirdItem = !entry.isDirectory && !isNormalFileHardlink && !entry.isSymlink;
              if (isNormalFileHardlink || isWeirdItem) {
                continue;
              }
              if (followSymlinks && !entry.isDirectory) {
                let isSymlinkToDirectory = false;
                try {
                  isSymlinkToDirectory = (await Deno.stat(eachPath2)).isDirectory;
                } catch (error) {
                }
                if (!isSymlinkToDirectory) {
                  continue;
                }
              }
              if (useBreadthFirstSearch) {
                searchAfterwords.push(eachPath2);
              } else {
                for await (const eachSubPath of FileSystem.iteratePathsIn(eachPath2, options)) {
                  yield eachSubPath;
                }
              }
            }
            options.recursively = false;
            while (searchAfterwords.length > 0) {
              const next2 = searchAfterwords.shift();
              for await (const eachSubPath of FileSystem.iteratePathsIn(next2, options)) {
                yield eachSubPath;
                searchAfterwords.push(eachSubPath);
              }
            }
          }
        }
      }
    }
  },
  listPathsIn(pathOrFileInfo, options) {
    return asyncIteratorToList(FileSystem.iteratePathsIn(pathOrFileInfo, options));
  },
  async *iterateItemsIn(pathOrFileInfo, options = { recursively: false, shouldntInclude: null, shouldntExplore: null, searchOrder: "breadthFirstSearch", maxDepth: Infinity }) {
    options = { exclude: /* @__PURE__ */ new Set(), searchOrder: "breadthFirstSearch", maxDepth: Infinity, ...options };
    options.searchOrder = options.searchOrder || "breadthFirstSearch";
    options.recursively = options.recursively == false && options.maxDepth == 1 ? false : options.recursively;
    const { shouldntExplore, shouldntInclude } = options;
    const info = pathOrFileInfo instanceof Path2 ? pathOrFileInfo : await FileSystem.info(pathOrFileInfo);
    const path5 = info.path;
    if (!["breadthFirstSearch", "depthFirstSearch"].includes(options.searchOrder)) {
      throw Error(`when calling FileSystem.iterateItemsIn('${path5}', { searchOrder: ${options.searchOrder} })

    The searchOrder currently can only be 'depthFirstSearch' or 'breadthFirstSearch'
    However, it was not either of those: ${options.searchOrder}`);
    }
    const useBreadthFirstSearch = options.searchOrder == "breadthFirstSearch";
    const shouldntExploreThis = shouldntExplore && await shouldntExplore(info);
    if (!shouldntExploreThis && options.maxDepth > 0 && info.isFolder) {
      options.exclude = options.exclude instanceof Set ? options.exclude : new Set(options.exclude);
      if (!options.exclude.has(path5)) {
        const absolutePathVersion = FileSystem.makeAbsolutePath(path5);
        options.exclude.add(absolutePathVersion);
        options.maxDepth -= 1;
        const searchAfterwords = [];
        for await (const entry of Deno.readDir(path5)) {
          const eachItem = await FileSystem.info(join4(path5, entry.name));
          const shouldntIncludeThis = shouldntInclude && await shouldntInclude(eachItem);
          if (!shouldntIncludeThis) {
            yield eachItem;
          }
          if (options.recursively) {
            if (eachItem.isFolder) {
              if (useBreadthFirstSearch) {
                searchAfterwords.push(eachItem);
              } else {
                for await (const eachSubPath of FileSystem.iterateItemsIn(eachItem, options)) {
                  yield eachSubPath;
                }
              }
            }
          }
        }
        options.recursively = false;
        while (searchAfterwords.length > 0) {
          const next2 = searchAfterwords.shift();
          for await (const eachSubItem of FileSystem.iterateItemsIn(next2, options)) {
            yield eachSubItem;
            if (eachSubItem.isFolder) {
              searchAfterwords.push(eachSubItem);
            }
          }
        }
      }
    }
  },
  async listItemsIn(pathOrFileInfo, options) {
    const outputPromises = [];
    for await (const eachPath2 of FileSystem.iteratePathsIn(pathOrFileInfo, options)) {
      outputPromises.push(FileSystem.info(eachPath2));
    }
    return Promise.all(outputPromises);
  },
  // includes symlinks if they link to files and pipes
  async listFileItemsIn(pathOrFileInfo, options = { treatAllSymlinksAsFiles: false }) {
    const { treatAllSymlinksAsFiles } = { treatAllSymlinksAsFiles: false, ...options };
    const items = await FileSystem.listItemsIn(pathOrFileInfo, options);
    if (treatAllSymlinksAsFiles) {
      return items.filter((eachItem) => eachItem.isFile || eachItem.isSymlink);
    } else {
      return items.filter((eachItem) => eachItem.isFile);
    }
  },
  async listFilePathsIn(pathOrFileInfo, options = { treatAllSymlinksAsFiles: false }) {
    return (await FileSystem.listFileItemsIn(pathOrFileInfo, options)).map((each2) => each2.path);
  },
  async listFileBasenamesIn(pathOrFileInfo, options = { treatAllSymlinksAsFiles: false }) {
    return (await FileSystem.listFileItemsIn(pathOrFileInfo, options)).map((each2) => each2.basename);
  },
  async listFolderItemsIn(pathOrFileInfo, options = { ignoreSymlinks: false }) {
    const { ignoreSymlinks } = { ignoreSymlinks: false, ...options };
    const items = await FileSystem.listItemsIn(pathOrFileInfo, options);
    if (ignoreSymlinks) {
      return items.filter((eachItem) => eachItem.isFolder && !eachItem.isSymlink);
    } else {
      return items.filter((eachItem) => eachItem.isFolder);
    }
  },
  async listFolderPathsIn(pathOrFileInfo, options = { ignoreSymlinks: false }) {
    return (await FileSystem.listFolderItemsIn(pathOrFileInfo, options)).map((each2) => each2.path);
  },
  async listFolderBasenamesIn(pathOrFileInfo, options = { ignoreSymlinks: false }) {
    return (await FileSystem.listFolderItemsIn(pathOrFileInfo, options)).map((each2) => each2.basename);
  },
  recursivelyIterateItemsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
    options.recursively = true;
    if (options.onlyHardlinks) {
      if (options.shouldntInclude) {
        const originalshouldntInclude = options.shouldntInclude;
        options.shouldntInclude = (each2) => each2.isSymlink || originalshouldntInclude(each2);
      } else {
        options.shouldntInclude = (each2) => each2.isSymlink;
      }
    }
    if (options.dontFollowSymlinks) {
      if (options.shouldntExplore) {
        const originalShouldntExplore = options.shouldntInclude;
        options.shouldntExplore = (each2) => each2.isSymlink || originalShouldntExplore(each2);
      } else {
        options.shouldntExplore = (each2) => each2.isSymlink;
      }
    }
    return FileSystem.iterateItemsIn(pathOrFileInfo, options);
  },
  recursivelyIteratePathsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
    options.recursively = true;
    if (options.onlyHardlinks) {
      if (options.shouldntInclude) {
        const originalshouldntInclude = options.shouldntInclude;
        options.shouldntInclude = (each2) => each2.isSymlink || originalshouldntInclude(each2);
      } else {
        options.shouldntInclude = (each2) => each2.isSymlink;
      }
    }
    return FileSystem.iteratePathsIn(pathOrFileInfo, options);
  },
  recursivelyListPathsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
    return asyncIteratorToList(FileSystem.recursivelyIteratePathsIn(pathOrFileInfo, options));
  },
  recursivelyListItemsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
    return asyncIteratorToList(FileSystem.recursivelyIterateItemsIn(pathOrFileInfo, options));
  },
  async *globIterator(pattern, options = { startPath: null, returnFullPaths: false }) {
    pattern = FileSystem.normalizePath(pattern);
    var { startPath, ...iteratePathsOptions } = options;
    startPath = startPath || "./";
    const originalStartPath = startPath;
    const firstGlob = pattern.match(/[\[\*\{\?]/);
    let extendedStartPath = startPath;
    if (firstGlob) {
      const startingString = pattern.slice(0, firstGlob.index);
      const furthestConstantSlash = startingString.lastIndexOf("/");
      if (furthestConstantSlash != -1) {
        if (pattern[0] == "/") {
          extendedStartPath = pattern.slice(0, furthestConstantSlash);
        } else {
          extendedStartPath = `${extendedStartPath}/${pattern.slice(0, furthestConstantSlash)}`;
        }
      }
      pattern = pattern.slice(furthestConstantSlash + 1);
    }
    extendedStartPath = FileSystem.makeAbsolutePath(extendedStartPath);
    let maxDepthFromRoot;
    if (pattern.match(/\*\*/)) {
      maxDepthFromRoot = Infinity;
    } else {
      maxDepthFromRoot = `${extendedStartPath}/${pattern}`.split("/").length - 1;
    }
    const fullPattern = `${escapeGlob(extendedStartPath)}/${pattern}`;
    const regex2 = globToRegExp4(fullPattern);
    const partials = fullPattern.split("/");
    let partialPattern = partials.shift();
    let partialRegexString = `^\\.$|${globToRegExp4(partialPattern || "/").source}`;
    for (const each2 of partials) {
      partialPattern += "/" + each2;
      partialRegexString += "|" + globToRegExp4(partialPattern).source;
    }
    const partialRegex = new RegExp(partialRegexString);
    for await (const eachPath2 of FileSystem.iteratePathsIn(extendedStartPath, { recursively: true, maxDepthFromRoot, ...iteratePathsOptions, shouldntExplore: (eachInnerPath) => !eachInnerPath.match(partialRegex) })) {
      if (eachPath2.match(regex2) || FileSystem.makeAbsolutePath(eachPath2).match(regex2)) {
        if (options.returnFullPaths) {
          yield eachPath2;
        } else {
          yield FileSystem.makeRelativePath({
            from: originalStartPath,
            to: eachPath2
          });
        }
      }
    }
  },
  glob(pattern, options = { startPath: null }) {
    return asyncIteratorToList(FileSystem.globIterator(pattern, options));
  },
  async getPermissions(path5) {
    const { mode } = await Deno.lstat(path5?.path || path5);
    return {
      owner: {
        //          rwxrwxrwx
        canRead: !!(256 & mode),
        canWrite: !!(128 & mode),
        canExecute: !!(64 & mode)
      },
      group: {
        canRead: !!(32 & mode),
        canWrite: !!(16 & mode),
        canExecute: !!(8 & mode)
      },
      others: {
        canRead: !!(4 & mode),
        canWrite: !!(2 & mode),
        canExecute: !!(1 & mode)
      }
    };
  },
  /**
  * Add/set file permissions
  *
  * @param {String} args.path - 
  * @param {Object|Boolean} args.recursively - 
  * @param {Object} args.permissions - 
  * @param {Object} args.permissions.owner - 
  * @param {Boolean} args.permissions.owner.canRead - 
  * @param {Boolean} args.permissions.owner.canWrite - 
  * @param {Boolean} args.permissions.owner.canExecute - 
  * @param {Object} args.permissions.group - 
  * @param {Boolean} args.permissions.group.canRead - 
  * @param {Boolean} args.permissions.group.canWrite - 
  * @param {Boolean} args.permissions.group.canExecute - 
  * @param {Object} args.permissions.others - 
  * @param {Boolean} args.permissions.others.canRead - 
  * @param {Boolean} args.permissions.others.canWrite - 
  * @param {Boolean} args.permissions.others.canExecute - 
  * @return {null} 
  *
  * @example
  * ```js
  *  await FileSystem.addPermissions({
  *      path: fileOrFolderPath,
  *      permissions: {
  *          owner: {
  *              canExecute: true,
  *          },
  *      }
  *  })
  * ```
  */
  async addPermissions({ path: path5, permissions: permissions2 = { owner: {}, group: {}, others: {} }, recursively = false }) {
    permissions2 = { owner: {}, group: {}, others: {}, ...permissions2 };
    let permissionNumber = 0;
    let fileInfo;
    if ([permissions2.owner, permissions2.group, permissions2.others].some((each2) => !each2 || Object.keys(each2).length != 3)) {
      fileInfo = await FileSystem.info(path5);
      permissionNumber = fileInfo.lstat.mode & 511;
    }
    if (permissions2.owner.canRead != null) {
      permissionNumber = permissions2.owner.canRead ? setTrueBit(permissionNumber, 8) : setFalseBit(permissionNumber, 8);
    }
    if (permissions2.owner.canWrite != null) {
      permissionNumber = permissions2.owner.canWrite ? setTrueBit(permissionNumber, 7) : setFalseBit(permissionNumber, 7);
    }
    if (permissions2.owner.canExecute != null) {
      permissionNumber = permissions2.owner.canExecute ? setTrueBit(permissionNumber, 6) : setFalseBit(permissionNumber, 6);
    }
    if (permissions2.group.canRead != null) {
      permissionNumber = permissions2.group.canRead ? setTrueBit(permissionNumber, 5) : setFalseBit(permissionNumber, 5);
    }
    if (permissions2.group.canWrite != null) {
      permissionNumber = permissions2.group.canWrite ? setTrueBit(permissionNumber, 4) : setFalseBit(permissionNumber, 4);
    }
    if (permissions2.group.canExecute != null) {
      permissionNumber = permissions2.group.canExecute ? setTrueBit(permissionNumber, 3) : setFalseBit(permissionNumber, 3);
    }
    if (permissions2.others.canRead != null) {
      permissionNumber = permissions2.others.canRead ? setTrueBit(permissionNumber, 2) : setFalseBit(permissionNumber, 2);
    }
    if (permissions2.others.canWrite != null) {
      permissionNumber = permissions2.others.canWrite ? setTrueBit(permissionNumber, 1) : setFalseBit(permissionNumber, 1);
    }
    if (permissions2.others.canExecute != null) {
      permissionNumber = permissions2.others.canExecute ? setTrueBit(permissionNumber, 0) : setFalseBit(permissionNumber, 0);
    }
    if (!recursively || // init fileInfo if doesnt exist
    (fileInfo || (fileInfo = await FileSystem.info(path5))) && !fileInfo.isDirectory) {
      return Deno.chmod(path5?.path || path5, permissionNumber);
    } else {
      const promises = [];
      const paths = await FileSystem.recursivelyListPathsIn(path5, { onlyHardlinks: false, dontFollowSymlinks: false, ...recursively });
      for (const eachPath2 of paths) {
        promises.push(
          Deno.chmod(eachPath2, permissionNumber).catch(console.error)
        );
      }
      return Promise.all(promises);
    }
  },
  // alias
  setPermissions(...args2) {
    return FileSystem.addPermissions(...args2);
  },
  async write({ path: path5, data, force = true, overwrite = false, renameExtension = null }) {
    path5 = pathStandardize(path5);
    await grabPathLock(path5);
    if (force) {
      FileSystem.sync.ensureIsFolder(FileSystem.parentPath(path5), { overwrite, renameExtension });
      const info = FileSystem.sync.info(path5);
      if (info.isDirectory) {
        FileSystem.sync.remove(path5);
      }
    }
    let output;
    if (typeof data == "string") {
      output = await Deno.writeTextFile(path5, data);
    } else if (typedArrayClasses.some((dataClass) => data instanceof dataClass)) {
      output = await Deno.writeFile(path5, data);
    } else if (isGeneratorObject(data) || data[Symbol.iterator] || data[Symbol.asyncIterator]) {
      const file = await Deno.open(path5, { read: true, write: true, create: true, truncate: true });
      const encoder = new TextEncoder();
      const encode = encoder.encode.bind(encoder);
      try {
        let index = 0;
        for await (let packet of data) {
          if (typeof packet == "string") {
            packet = encode(packet);
          }
          await Deno.write(file.rid, packet);
        }
      } finally {
        Deno?.close?.(file.rid);
      }
    }
    delete locker[path5];
    return output;
  },
  async append({ path: path5, data, force = true, overwrite = false, renameExtension = null }) {
    path5 = pathStandardize(path5);
    await grabPathLock(path5);
    if (force) {
      FileSystem.sync.ensureIsFolder(FileSystem.parentPath(path5), { overwrite, renameExtension });
      const info = FileSystem.sync.info(path5);
      if (info.isDirectory) {
        FileSystem.sync.remove(path5);
      }
    }
    if (typeof data == "string") {
      data = new TextEncoder().encode(data);
    }
    const file = Deno.openSync(path5, { read: true, write: true, create: true });
    file.seekSync(0, Deno.SeekMode.End);
    file.writeSync(data);
    file.close();
    delete locker[path5];
  },
  async makeHardPathTo(path5, options = {}) {
    var { cache: cache2 } = { cache: {}, ...options };
    if (cache2[path5]) {
      return cache2[path5];
    }
    const [folders, name, extension] = FileSystem.pathPieces(FileSystem.makeAbsolutePath(path5));
    let topDownPath = ``;
    for (const eachFolderName of folders) {
      topDownPath += `/${eachFolderName}`;
      if (cache2[topDownPath]) {
        topDownPath = cache2[topDownPath];
        continue;
      }
      const unchangedPath = topDownPath;
      const info = await FileSystem.info(topDownPath);
      if (info.isSymlink) {
        const absolutePathToIntermediate = await FileSystem.finalTargetOf(info.path, { _parentsHaveBeenChecked: true, cache: cache2 });
        if (absolutePathToIntermediate == null) {
          return null;
        }
        topDownPath = topDownPath.slice(0, -(eachFolderName.length + 1));
        const relativePath = FileSystem.makeRelativePath({
          from: topDownPath,
          to: absolutePathToIntermediate
        });
        topDownPath += `/${relativePath}`;
        topDownPath = normalize4(topDownPath);
      }
      cache2[unchangedPath] = topDownPath;
    }
    const hardPath = normalize4(`${topDownPath}/${name}${extension}`);
    cache2[path5] = hardPath;
    return hardPath;
  },
  async walkUpImport(path5, start) {
    const startPath = start || FileSystem.pathOfCaller(1);
    const nearestPath = await FileSystem.walkUpUntil(path5, startPath);
    if (nearestPath) {
      const absolutePath = FileSystem.makeAbsolutePath(`${nearestPath}/${path5}`);
      return import(toFileUrl3(absolutePath).href);
    } else {
      throw Error(`Tried to walkUpImport ${path5}, starting at ${startPath}, but was unable to find any files`);
    }
  },
  async withPwd(tempPwd, func) {
    const originalPwd = FileSystem.pwd;
    const originalPwdEnvVar = Deno.env.get("PWD");
    tempPwd = FileSystem.makeAbsolutePath(tempPwd);
    try {
      FileSystem.pwd = tempPwd;
      Deno.env.set("PWD", tempPwd);
      await func(originalPwd);
    } finally {
      FileSystem.pwd = originalPwd;
      Deno.env.set("PWD", originalPwdEnvVar);
    }
  },
  parentOfAllPaths(paths) {
    let parentPaths = [];
    if (!paths.every(FileSystem.isRelativePath)) {
      paths = paths.map(FileSystem.makeAbsolutePath);
    }
    for (let eachPath2 of paths) {
      const [folders, itemName, itemExtensionWithDot] = FileSystem.pathPieces(eachPath2);
      parentPaths.push(folders.join("/") + "/");
    }
    let possiblyBrokenPath = m(parentPaths);
    if (!possiblyBrokenPath.endsWith("/")) {
      possiblyBrokenPath = possiblyBrokenPath.split("/").slice(0, -1).join("/") + "/";
    }
    return FileSystem.normalizePath(possiblyBrokenPath);
  },
  sync: {
    // things that are already sync
    get parentPath() {
      return FileSystem.parentPath;
    },
    get dirname() {
      return FileSystem.dirname;
    },
    get basename() {
      return FileSystem.basename;
    },
    get extname() {
      return FileSystem.extname;
    },
    get join() {
      return FileSystem.join;
    },
    get thisFile() {
      return FileSystem.thisFile;
    },
    get pureNameOf() {
      return pathPureName;
    },
    get thisFolder() {
      return FileSystem.thisFolder;
    },
    get normalize() {
      return FileSystem.normalizePath;
    },
    get isAbsolutePath() {
      return FileSystem.isAbsolutePath;
    },
    get isRelativePath() {
      return FileSystem.isRelativePath;
    },
    get makeRelativePath() {
      return FileSystem.makeRelativePath;
    },
    get makeAbsolutePath() {
      return FileSystem.makeAbsolutePath;
    },
    get pathDepth() {
      return FileSystem.pathDepth;
    },
    get pathPieces() {
      return FileSystem.pathPieces;
    },
    get extendName() {
      return FileSystem.extendName;
    },
    get allParentPaths() {
      return FileSystem.allParentPaths;
    },
    get pathOfCaller() {
      return FileSystem.pathOfCaller;
    },
    get home() {
      return FileSystem.home;
    },
    get workingDirectory() {
      return FileSystem.workingDirectory;
    },
    get cwd() {
      return FileSystem.cwd;
    },
    get pwd() {
      return FileSystem.pwd;
    },
    get cd() {
      return FileSystem.cd;
    },
    get changeDirectory() {
      return FileSystem.changeDirectory;
    },
    set workingDirectory(value) {
      return FileSystem.workingDirectory = value;
    },
    set cwd(value) {
      return FileSystem.workingDirectory = value;
    },
    set pwd(value) {
      return FileSystem.workingDirectory = value;
    },
    info(fileOrFolderPath, _cachedLstat = null) {
      let lstat2 = _cachedLstat;
      try {
        lstat2 = Deno.lstatSync(fileOrFolderPath);
      } catch (error) {
        lstat2 = { doesntExist: true };
      }
      let stat2 = {};
      if (!lstat2.isSymlink) {
        stat2 = {
          isBrokenLink: false,
          isLoopOfLinks: false
        };
      } else {
        try {
          stat2 = Deno.statSync(fileOrFolderPath);
        } catch (error) {
          if (error.message.match(/^Too many levels of symbolic links/)) {
            stat2.isBrokenLink = true;
            stat2.isLoopOfLinks = true;
          } else if (error.message.match(/^No such file or directory/)) {
            stat2.isBrokenLink = true;
          } else {
            throw error;
          }
        }
      }
      return new Path2({ path: fileOrFolderPath, _lstatData: lstat2, _statData: stat2 });
    },
    read(path5) {
      path5 = pathStandardize(path5);
      let output;
      try {
        output = Deno.readTextFileSync(path5);
      } catch (error) {
      }
      return output;
    },
    readBytes(path5) {
      path5 = pathStandardize(path5);
      let output;
      try {
        output = Deno.readFileSync(path5);
      } catch (error) {
      }
      return output;
    },
    *readLinesIteratively(path5) {
      path5 = pathStandardize(path5);
      const file = Deno.openSync(path5);
      try {
        yield* readLines(file);
      } finally {
        Deno?.close?.(file.rid);
      }
    },
    /**
     * find a root folder based on a child path
     *
     * @example
     * ```js
     *     import { FileSystem } from "https://deno.land/x/quickr/main/file_system.js"
     * 
     *     var gitParentFolderOrNull = FileSystem.sync.walkUpUntil(".git")
     *     var gitParentFolderOrNull = FileSystem.sync.walkUpUntil({
     *         subPath:".git",
     *         startPath: FileSystem.pwd,
     *     })
     *
     *     // below will result in that^ same folder (assuming all your .git folders have config files)
     *     var gitParentFolderOrNull = FileSystem.sync.walkUpUntil(".git/config")
     * 
     *     // below will result in the same folder, but only if theres a local master branch
     *     var gitParentFolderOrNull = FileSystem.sync.walkUpUntil(".git/refs/heads/master")
     *```
     */
    walkUpUntil(subPath, startPath = null) {
      subPath = subPath instanceof Path2 ? subPath.path : subPath;
      if (subPath instanceof Object) {
        var { subPath, startPath } = subPath;
      }
      let here;
      if (!startPath) {
        here = Deno.cwd();
      } else if (isAbsolute3(startPath)) {
        here = startPath;
      } else {
        here = join4(here, startPath);
      }
      while (1) {
        let checkPath = join4(here, subPath);
        const pathInfo = Deno.lstatSync(checkPath).catch(() => ({ doesntExist: true }));
        if (!pathInfo.doesntExist) {
          return here;
        }
        if (here == dirname3(here)) {
          return null;
        } else {
          here = dirname3(here);
        }
      }
    },
    nextTargetOf(path5, options = {}) {
      const originalWasItem = path5 instanceof Path2;
      const item = originalWasItem ? path5 : new Path2({ path: path5 });
      const lstat2 = item.lstat;
      if (lstat2.isSymlink) {
        const relativeOrAbsolutePath = Deno.readLinkSync(item.path);
        if (isAbsolute3(relativeOrAbsolutePath)) {
          if (originalWasItem) {
            return new Path2({ path: relativeOrAbsolutePath });
          } else {
            return relativeOrAbsolutePath;
          }
        } else {
          const path6 = `${FileSystem.sync.makeHardPathTo(dirname3(item.path))}/${relativeOrAbsolutePath}`;
          if (originalWasItem) {
            return new Path2({ path: path6 });
          } else {
            return path6;
          }
        }
      } else {
        if (originalWasItem) {
          return item;
        } else {
          return item.path;
        }
      }
    },
    finalTargetOf(path5, options = {}) {
      const { _parentsHaveBeenChecked, cache: cache2 } = { _parentsHaveBeenChecked: false, cache: {}, ...options };
      const originalWasItem = path5 instanceof Path2;
      path5 = path5.path || path5;
      let result = Deno.lstatSync(path5).catch(() => ({ doesntExist: true }));
      if (result.doesntExist) {
        return null;
      }
      path5 = FileSystem.sync.makeHardPathTo(path5, { cache: cache2 });
      const pathChain = [];
      while (result.isSymlink) {
        const relativeOrAbsolutePath = Deno.readLinkSync(path5);
        if (isAbsolute3(relativeOrAbsolutePath)) {
          path5 = relativeOrAbsolutePath;
        } else {
          path5 = `${FileSystem.parentPath(path5)}/${relativeOrAbsolutePath}`;
        }
        result = Deno.lstatSync(path5).catch(() => ({ doesntExist: true }));
        if (result.doesntExist) {
          return null;
        }
        path5 = FileSystem.sync.makeHardPathTo(path5, { cache: cache2 });
        if (pathChain.includes(path5)) {
          return null;
        }
        pathChain.push(path5);
      }
      path5 = FileSystem.normalizePath(path5);
      if (originalWasItem) {
        return new Path2({ path: path5 });
      } else {
        return path5;
      }
    },
    makeHardPathTo(path5, options = {}) {
      var { cache: cache2 } = { cache: {}, ...options };
      if (cache2[path5]) {
        return cache2[path5];
      }
      const [folders, name, extension] = FileSystem.pathPieces(FileSystem.makeAbsolutePath(path5));
      let topDownPath = ``;
      for (const eachFolderName of folders) {
        topDownPath += `/${eachFolderName}`;
        if (cache2[topDownPath]) {
          topDownPath = cache2[topDownPath];
          continue;
        }
        const unchangedPath = topDownPath;
        const info = FileSystem.sync.info(topDownPath);
        if (info.isSymlink) {
          const absolutePathToIntermediate = FileSystem.sync.finalTargetOf(info.path, { _parentsHaveBeenChecked: true, cache: cache2 });
          if (absolutePathToIntermediate == null) {
            return null;
          }
          topDownPath = topDownPath.slice(0, -(eachFolderName.length + 1));
          const relativePath = FileSystem.makeRelativePath({
            from: topDownPath,
            to: absolutePathToIntermediate
          });
          topDownPath += `/${relativePath}`;
          topDownPath = normalize4(topDownPath);
        }
        cache2[unchangedPath] = topDownPath;
      }
      const hardPath = normalize4(`${topDownPath}/${name}${extension}`);
      cache2[path5] = hardPath;
      return hardPath;
    },
    remove(fileOrFolder) {
      fileOrFolder = pathStandardize(fileOrFolder);
      if (fileOrFolder instanceof Array) {
        return fileOrFolder.map(FileSystem.sync.remove);
      }
      let exists2 = false;
      let item;
      try {
        item = Deno.lstatSync(fileOrFolder);
        exists2 = true;
      } catch (error) {
      }
      if (exists2) {
        if (item.isFile || item.isSymlink || !item.isDirectory) {
          return Deno.removeSync(fileOrFolder.replace(/\/+$/, ""));
        } else {
          return Deno.removeSync(fileOrFolder.replace(/\/+$/, ""), { recursive: true });
        }
      }
    },
    moveOutOfTheWay(path5, options = { extension: null }) {
      path5 = pathStandardize(path5);
      const extension = options?.extension || FileSystem.defaultRenameExtension;
      const info = FileSystem.sync.info(path5);
      if (info.exists) {
        const newPath = path5 + extension;
        FileSystem.sync.moveOutOfTheWay(newPath, { extension });
        moveSync(path5, newPath);
      }
    },
    ensureIsFolder(path5, options = { overwrite: false, renameExtension: null }) {
      path5 = pathStandardize(path5);
      const { overwrite, renameExtension } = defaultOptionsHelper(options);
      path5 = path5.path || path5;
      path5 = FileSystem.makeAbsolutePath(path5);
      const parentPath = dirname3(path5);
      if (parentPath == path5) {
        return;
      }
      const parent = FileSystem.sync.info(parentPath);
      if (!parent.isDirectory) {
        FileSystem.sync.ensureIsFolder(parentPath, { overwrite, renameExtension });
      }
      let pathInfo = FileSystem.sync.info(path5);
      if (pathInfo.exists && !pathInfo.isDirectory) {
        if (overwrite) {
          FileSystem.sync.remove(path5);
        } else {
          FileSystem.sync.moveOutOfTheWay(path5, { extension: renameExtension });
        }
      }
      Deno.mkdirSync(path5, { recursive: true });
      return path5;
    },
    ensureIsFile(path5, options = { overwrite: false, renameExtension: null }) {
      const { overwrite, renameExtension } = defaultOptionsHelper(options);
      FileSystem.sync.ensureIsFolder(FileSystem.parentPath(path5), { overwrite, renameExtension });
      path5 = path5.path || path5;
      const pathInfo = FileSystem.sync.info(path5);
      if (pathInfo.isFile && !pathInfo.isDirectory) {
        return path5;
      } else {
        FileSystem.sync.write({ path: path5, data: "" });
        return path5;
      }
    },
    /**
     * Move/Remove everything and Ensure parent folders
     *
     * @param path
     * @param options.overwrite - if false, then things in the way will be moved instead of deleted
     * @param options.extension - the string to append when renaming files to get them out of the way
     * 
     * @example
     * ```js
     *     FileSystem.sync.clearAPathFor("./something")
     * ```
     */
    clearAPathFor(path5, options = { overwrite: false, renameExtension: null }) {
      const { overwrite, renameExtension } = defaultOptionsHelper(options);
      const originalPath = path5;
      const paths = [];
      while (dirname3(path5) !== path5) {
        paths.push(path5);
        path5 = dirname3(path5);
      }
      for (const eachPath2 of paths.reverse()) {
        const info = FileSystem.sync.info(eachPath2);
        if (!info.exists) {
          break;
        } else if (info.isFile) {
          if (overwrite) {
            FileSystem.sync.remove(eachPath2);
          } else {
            FileSystem.sync.moveOutOfTheWay(eachPath2, { extension: renameExtension });
          }
        }
      }
      Deno.mkdirSync(dirname3(originalPath), { recursive: true });
      return originalPath;
    },
    append({ path: path5, data, force = true, overwrite = false, renameExtension = null }) {
      path5 = pathStandardize(path5);
      if (force) {
        FileSystem.sync.ensureIsFolder(FileSystem.parentPath(path5), { overwrite, renameExtension });
        const info = FileSystem.sync.info(path5);
        if (info.isDirectory) {
          FileSystem.sync.remove(path5);
        }
      }
      const file = Deno.openSync(path5, { read: true, write: true, create: true });
      file.seekSync(0, Deno.SeekMode.End);
      if (typeof data == "string") {
        file.writeSync(new TextEncoder().encode(data));
      } else {
        file.writeSync(data);
      }
      file.close();
    },
    write({ path: path5, data, force = true, overwrite = false, renameExtension = null }) {
      path5 = pathStandardize(path5);
      if (force) {
        FileSystem.sync.ensureIsFolder(FileSystem.parentPath(path5), { overwrite, renameExtension });
        const info = FileSystem.sync.info(path5);
        if (info.isDirectory) {
          FileSystem.sync.remove(path5);
        }
      }
      let output;
      if (typeof data == "string") {
        output = Deno.writeTextFileSync(path5, data);
      } else if (typedArrayClasses.some((dataClass) => data instanceof dataClass)) {
        output = Deno.writeFileSync(path5, data);
      } else if (isGeneratorObject(data) || data[Symbol.iterator] || data[Symbol.asyncIterator]) {
        const file = Deno.openSync(path5, { read: true, write: true, create: true, truncate: true });
        const encoder = new TextEncoder();
        const encode = encoder.encode.bind(encoder);
        try {
          let index = 0;
          for (let packet of data) {
            if (typeof packet == "string") {
              packet = encode(packet);
            }
            Deno.writeSync(file.rid, packet);
          }
        } finally {
          Deno?.close?.(file.rid);
        }
      }
      return output;
    },
    absoluteLink({ existingItem, newItem, force = true, allowNonExistingTarget = false, overwrite = false, renameExtension = null }) {
      existingItem = (existingItem.path || existingItem).replace(/\/+$/, "");
      const newItemPath = FileSystem.normalizePath(newItem.path || newItem).replace(/\/+$/, "");
      const existingItemDoesntExist = Deno.lstatSync(existingItem).catch(() => ({ doesntExist: true })).doesntExist;
      if (!allowNonExistingTarget && existingItemDoesntExist) {
        throw Error(`
Tried to create a relativeLink between existingItem:${existingItem}, newItemPath:${newItemPath}
but existingItem didn't actually exist`);
      } else {
        const parentOfNewItem = FileSystem.parentPath(newItemPath);
        FileSystem.sync.ensureIsFolder(parentOfNewItem, { overwrite, renameExtension });
        const hardPathToNewItem = `${FileSystem.syncmakeHardPathTo(parentOfNewItem)}/${FileSystem.basename(newItemPath)}`;
        if (force) {
          FileSystem.sync.clearAPathFor(hardPathToNewItem, { overwrite, renameExtension });
        }
        return Deno.symlinkSync(
          FileSystem.makeAbsolutePath(existingItem),
          newItemPath
        );
      }
    },
    relativeLink({ existingItem, newItem, force = true, overwrite = false, allowNonExistingTarget = false, renameExtension = null }) {
      const existingItemPath = (existingItem.path || existingItem).replace(/\/+$/, "");
      const newItemPath = FileSystem.normalizePath((newItem.path || newItem).replace(/\/+$/, ""));
      const existingItemDoesntExist = Deno.lstatSync(existingItemPath).catch(() => ({ doesntExist: true })).doesntExist;
      if (!allowNonExistingTarget && existingItemDoesntExist) {
        throw Error(`
Tried to create a relativeLink between existingItem:${existingItemPath}, newItem:${newItemPath}
but existingItem didn't actually exist`);
      } else {
        const parentOfNewItem = FileSystem.parentPath(newItemPath);
        FileSystem.sync.ensureIsFolder(parentOfNewItem, { overwrite, renameExtension });
        const hardPathToNewItem = `${FileSystem.sync.makeHardPathTo(parentOfNewItem)}/${FileSystem.basename(newItemPath)}`;
        const hardPathToExistingItem = FileSystem.sync.makeHardPathTo(existingItemPath);
        const pathFromNewToExisting = relative3(hardPathToNewItem, hardPathToExistingItem).replace(/^\.\.\//, "");
        if (force) {
          FileSystem.sync.clearAPathFor(hardPathToNewItem, { overwrite, renameExtension });
        }
        return Deno.symlinkSync(
          pathFromNewToExisting,
          hardPathToNewItem
        );
      }
    },
    move({ path: path5, item, newParentFolder, newName, force = true, overwrite = false, renameExtension = null }) {
      item = item || path5;
      const oldPath = item.path || item;
      const oldName = FileSystem.basename(oldPath);
      const pathInfo = item instanceof Object || FileSystem.sync.info(oldPath);
      const newPath = `${newParentFolder || FileSystem.parentPath(oldPath)}/${newName || oldName}`;
      if (pathInfo.isSymlink && !item.isBrokenLink) {
        const link2 = Deno.readLinkSync(pathInfo.path);
        if (!isAbsolute3(link2)) {
          const linkTargetBeforeMove = `${FileSystem.parentPath(pathInfo.path)}/${link2}`;
          FileSystem.sync.relativeLink({
            existingItem: linkTargetBeforeMove,
            newItem: newPath,
            force,
            overwrite,
            renameExtension
          });
          FileSystem.sync.remove(pathInfo);
        }
      }
      if (force) {
        FileSystem.sync.clearAPathFor(newPath, { overwrite, renameExtension });
      }
      return moveSync(oldPath, newPath);
    },
    rename({ from, to, force = true, overwrite = false, renameExtension = null }) {
      return FileSystem.sync.move({ path: from, newParentFolder: FileSystem.parentPath(to), newName: FileSystem.basename(to), force, overwrite, renameExtension });
    },
    copy({ from, to, preserveTimestamps = true, force = true, overwrite = false, renameExtension = null }) {
      const existingItemDoesntExist = Deno.statSync(from).catch(() => ({ doesntExist: true })).doesntExist;
      if (existingItemDoesntExist) {
        throw Error(`
Tried to copy from:${from}, to:${to}
but "from" didn't seem to exist

`);
      }
      if (force) {
        FileSystem.sync.clearAPathFor(to, { overwrite, renameExtension });
      }
      return copySync(from, to, { force, preserveTimestamps: true });
    },
    *iterateBasenamesIn(pathOrFileInfo) {
      const info = pathOrFileInfo instanceof Path2 ? pathOrFileInfo : FileSystem.sync.info(pathOrFileInfo);
      if (info.isFolder) {
        for (const dirEntry of Deno.readDirSync(info.path)) {
          yield dirEntry.name;
        }
      }
    },
    listBasenamesIn(pathOrFileInfo) {
      return [...FileSystem.sync.iterateBasenamesIn(pathOrFileInfo)];
    },
    *iteratePathsIn(pathOrFileInfo, options = { recursively: false, shouldntInclude: null, shouldntExplore: null, searchOrder: "breadthFirstSearch", maxDepth: Infinity, dontFollowSymlinks: false, dontReturnSymlinks: false, maxDepthFromRoot: null }) {
      let info;
      try {
        info = pathOrFileInfo instanceof Path2 ? pathOrFileInfo : FileSystem.sync.info(pathOrFileInfo);
      } catch (error) {
        if (!error.message.match(/^PermissionDenied:/)) {
          throw error;
        }
      }
      const path5 = info.path;
      const startingDepth = FileSystem.makeAbsolutePath(path5).split("/").length - 1;
      options.recursively = options.recursively == false && options.maxDepth == 1 ? false : options.recursively;
      if (options.maxDepthFromRoot == null) {
        options.maxDepthFromRoot = Infinity;
      }
      if (options.maxDepth != Infinity && options.maxDepth != null) {
        options.maxDepthFromRoot = startingDepth + options.maxDepth;
      }
      options.maxDepth = null;
      if (startingDepth < options.maxDepthFromRoot) {
        if (!options.recursively) {
          if (info.isFolder) {
            if (!options.shouldntInclude) {
              for (const each2 of Deno.readDirSync(path5)) {
                if (options.dontReturnSymlinks && each2.isSymlink) {
                  continue;
                }
                yield join4(path5, each2.name);
              }
            } else {
              const shouldntInclude = options.shouldntInclude;
              for (const each2 of Deno.readDirSync(path5)) {
                const eachPath2 = join4(path5, each2.name);
                if (options.dontReturnSymlinks && each2.isSymlink) {
                  continue;
                }
                const shouldntIncludeThis = shouldntInclude && shouldntInclude(eachPath2);
                if (!shouldntIncludeThis) {
                  yield eachPath2;
                }
              }
            }
          }
        } else {
          options = { exclude: /* @__PURE__ */ new Set(), searchOrder: "breadthFirstSearch", maxDepth: Infinity, ...options };
          options.searchOrder = options.searchOrder || "breadthFirstSearch";
          const { shouldntExplore, shouldntInclude } = options;
          if (!["breadthFirstSearch", "depthFirstSearch"].includes(options.searchOrder)) {
            throw Error(`when calling FileSystem.sync.iterateItemsIn('${path5}', { searchOrder: ${options.searchOrder} })

    The searchOrder currently can only be 'depthFirstSearch' or 'breadthFirstSearch'
    However, it was not either of those: ${options.searchOrder}`);
          }
          const useBreadthFirstSearch = options.searchOrder == "breadthFirstSearch";
          const shouldntExploreThis = shouldntExplore && shouldntExplore(info.path, info);
          if (!shouldntExploreThis && info.isFolder) {
            options.exclude = options.exclude instanceof Set ? options.exclude : new Set(options.exclude);
            if (!options.exclude.has(path5)) {
              const followSymlinks = !options.dontFollowSymlinks;
              const absolutePathVersion = FileSystem.makeAbsolutePath(path5);
              options.exclude.add(absolutePathVersion);
              const searchAfterwords = [];
              for (const entry of Deno.readDirSync(path5)) {
                const eachPath2 = join4(path5, entry.name);
                if (options.dontReturnSymlinks && each.isSymlink) {
                  continue;
                }
                const shouldntIncludeThis = shouldntInclude && shouldntInclude(eachPath2);
                if (!shouldntIncludeThis) {
                  yield eachPath2;
                }
                const isNormalFileHardlink = entry.isFile;
                const isWeirdItem = !entry.isDirectory && !isNormalFileHardlink && !entry.isSymlink;
                if (isNormalFileHardlink || isWeirdItem) {
                  continue;
                }
                if (followSymlinks && !entry.isDirectory) {
                  let isSymlinkToDirectory = false;
                  try {
                    isSymlinkToDirectory = Deno.statSync(eachPath2).isDirectory;
                  } catch (error) {
                  }
                  if (!isSymlinkToDirectory) {
                    continue;
                  }
                }
                if (useBreadthFirstSearch) {
                  searchAfterwords.push(eachPath2);
                } else {
                  for (const eachSubPath of FileSystem.sync.iteratePathsIn(eachPath2, options)) {
                    yield eachSubPath;
                  }
                }
              }
              options.recursively = false;
              while (searchAfterwords.length > 0) {
                const next2 = searchAfterwords.shift();
                for (const eachSubPath of FileSystem.sync.iteratePathsIn(next2, options)) {
                  yield eachSubPath;
                  searchAfterwords.push(eachSubPath);
                }
              }
            }
          }
        }
      }
    },
    listPathsIn(pathOrFileInfo, options) {
      return [...FileSystem.sync.iteratePathsIn(pathOrFileInfo, options)];
    },
    *iterateItemsIn(pathOrFileInfo, options = { recursively: false, shouldntInclude: null, shouldntExplore: null, searchOrder: "breadthFirstSearch", maxDepth: Infinity }) {
      options = { exclude: /* @__PURE__ */ new Set(), searchOrder: "breadthFirstSearch", maxDepth: Infinity, ...options };
      options.searchOrder = options.searchOrder || "breadthFirstSearch";
      options.recursively = options.recursively == false && options.maxDepth == 1 ? false : options.recursively;
      const { shouldntExplore, shouldntInclude } = options;
      const info = pathOrFileInfo instanceof Path2 ? pathOrFileInfo : FileSystem.sync.info(pathOrFileInfo);
      const path5 = info.path;
      if (!["breadthFirstSearch", "depthFirstSearch"].includes(options.searchOrder)) {
        throw Error(`when calling FileSystem.iterateItemsIn('${path5}', { searchOrder: ${options.searchOrder} })

    The searchOrder currently can only be 'depthFirstSearch' or 'breadthFirstSearch'
    However, it was not either of those: ${options.searchOrder}`);
      }
      const useBreadthFirstSearch = options.searchOrder == "breadthFirstSearch";
      const shouldntExploreThis = shouldntExplore && shouldntExplore(info);
      if (!shouldntExploreThis && options.maxDepth > 0 && info.isFolder) {
        options.exclude = options.exclude instanceof Set ? options.exclude : new Set(options.exclude);
        if (!options.exclude.has(path5)) {
          const absolutePathVersion = FileSystem.makeAbsolutePath(path5);
          options.exclude.add(absolutePathVersion);
          options.maxDepth -= 1;
          const searchAfterwords = [];
          for (const entry of Deno.readDirSync(path5)) {
            const eachItem = FileSystem.sync.info(join4(path5, entry.name));
            const shouldntIncludeThis = shouldntInclude && shouldntInclude(eachItem);
            if (!shouldntIncludeThis) {
              yield eachItem;
            }
            if (options.recursively) {
              if (eachItem.isFolder) {
                if (useBreadthFirstSearch) {
                  searchAfterwords.push(eachItem);
                } else {
                  for (const eachSubPath of FileSystem.sync.iterateItemsIn(eachItem, options)) {
                    yield eachSubPath;
                  }
                }
              }
            }
          }
          options.recursively = false;
          while (searchAfterwords.length > 0) {
            const next2 = searchAfterwords.shift();
            for (const eachSubItem of FileSystem.sync.iterateItemsIn(next2, options)) {
              yield eachSubItem;
              if (eachSubItem.isFolder) {
                searchAfterwords.push(eachSubItem);
              }
            }
          }
        }
      }
    },
    listItemsIn(pathOrFileInfo, options) {
      const output = [];
      for (const eachPath2 of FileSystem.sync.iteratePathsIn(pathOrFileInfo, options)) {
        output.push(FileSystem.sync.info(eachPath2));
      }
      return output;
    },
    // includes symlinks if they link to files and pipes
    listFileItemsIn(pathOrFileInfo, options = { treatAllSymlinksAsFiles: false }) {
      const { treatAllSymlinksAsFiles } = { treatAllSymlinksAsFiles: false, ...options };
      const items = FileSystem.sync.listItemsIn(pathOrFileInfo, options);
      if (treatAllSymlinksAsFiles) {
        return items.filter((eachItem) => eachItem.isFile || eachItem.isSymlink);
      } else {
        return items.filter((eachItem) => eachItem.isFile);
      }
    },
    listFilePathsIn(pathOrFileInfo, options = { treatAllSymlinksAsFiles: false }) {
      return FileSystem.sync.listFileItemsIn(pathOrFileInfo, options).map((each2) => each2.path);
    },
    listFileBasenamesIn(pathOrFileInfo, options = { treatAllSymlinksAsFiles: false }) {
      return FileSystem.sync.listFileItemsIn(pathOrFileInfo, options).map((each2) => each2.basename);
    },
    listFolderItemsIn(pathOrFileInfo, options = { ignoreSymlinks: false }) {
      const { ignoreSymlinks } = { ignoreSymlinks: false, ...options };
      const items = FileSystem.sync.listItemsIn(pathOrFileInfo, options);
      if (ignoreSymlinks) {
        return items.filter((eachItem) => eachItem.isFolder && !eachItem.isSymlink);
      } else {
        return items.filter((eachItem) => eachItem.isFolder);
      }
    },
    listFolderPathsIn(pathOrFileInfo, options = { ignoreSymlinks: false }) {
      return FileSystem.sync.listFolderItemsIn(pathOrFileInfo, options).map((each2) => each2.path);
    },
    listFolderBasenamesIn(pathOrFileInfo, options = { ignoreSymlinks: false }) {
      return FileSystem.sync.listFolderItemsIn(pathOrFileInfo, options).map((each2) => each2.basename);
    },
    recursivelyIterateItemsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
      options.recursively = true;
      if (options.onlyHardlinks) {
        if (options.shouldntInclude) {
          const originalshouldntInclude = options.shouldntInclude;
          options.shouldntInclude = (each2) => each2.isSymlink || originalshouldntInclude(each2);
        } else {
          options.shouldntInclude = (each2) => each2.isSymlink;
        }
      }
      if (options.dontFollowSymlinks) {
        if (options.shouldntExplore) {
          const originalShouldntExplore = options.shouldntInclude;
          options.shouldntExplore = (each2) => each2.isSymlink || originalShouldntExplore(each2);
        } else {
          options.shouldntExplore = (each2) => each2.isSymlink;
        }
      }
      return FileSystem.sync.iterateItemsIn(pathOrFileInfo, options);
    },
    recursivelyIteratePathsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
      options.recursively = true;
      if (options.onlyHardlinks) {
        if (options.shouldntInclude) {
          const originalshouldntInclude = options.shouldntInclude;
          options.shouldntInclude = (each2) => each2.isSymlink || originalshouldntInclude(each2);
        } else {
          options.shouldntInclude = (each2) => each2.isSymlink;
        }
      }
      return FileSystem.sync.iteratePathsIn(pathOrFileInfo, options);
    },
    recursivelyListPathsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
      return [...FileSystem.sync.recursivelyIteratePathsIn(pathOrFileInfo, options)];
    },
    recursivelyListItemsIn(pathOrFileInfo, options = { onlyHardlinks: false, dontFollowSymlinks: false, searchOrder: "breadthFirstSearch", maxDepth: Infinity, shouldntExplore: null, shouldntInclude: null }) {
      return [...FileSystem.sync.recursivelyIterateItemsIn(pathOrFileInfo, options)];
    }
    // sync TODO:
    // globIterator
    // getPermissions
    // addPermissions
    // Note:
    // cannot be sync:
    // walkUpImport 
  }
};
var glob = FileSystem.glob;

// https://esm.sh/gh/jeff-hykin/good-js@40797ac/denonext/source/flattened/parse_args.mjs
var R = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/[^a-zA-Z0-9 _.-]/, "_").toLowerCase().split(/[ _.-]+/g).filter((o2) => o2);
var Z = (n) => {
  let a = R(n).map((o2) => o2.replace(/^\w/, (l2) => l2.toUpperCase()));
  return a.length > 0 && (a[0] = a[0].toLowerCase()), a.join("");
};
function C(n, r) {
  n.length > r.length && ([n, r] = [r, n]);
  let a = Array.from({ length: n.length + 1 }, (o2, l2) => +l2);
  for (let o2 = 0; o2 < r.length; o2++) {
    let l2 = [o2 + 1];
    for (let d2 = 0; d2 < n.length; d2++) {
      let y = n[d2], f3 = r[o2];
      y === f3 ? l2.push(a[d2]) : l2.push(1 + Math.min(a[d2], a[d2 + 1], l2[l2.length - 1]));
    }
    a = l2;
  }
  return a[a.length - 1];
}
var x = class extends Error {
  constructor(r, { givenWord: a, givenWords: o2, possibleWords: l2 }) {
    super(r), this.givenWord = a, this.givenWords = o2, this.possibleWords = l2;
  }
};
function I(n) {
  var { givenWord: r, givenWords: a, possibleWords: o2, caseSensitive: l2, autoThrow: d2, suggestionLimit: y } = { suggestionLimit: 1 / 0, ...n };
  if (a instanceof Array) {
    let f3 = {};
    for (let v of a) f3[v] = I({ ...n, givenWord: v, givenWords: void 0 });
    return f3;
  }
  if (l2 || (o2 = o2.map((f3) => f3.toLowerCase()), r = r.toLowerCase()), !o2.includes(r) && d2) {
    let f3 = I({ givenWord: r, possibleWords: o2, caseSensitive: l2, suggestionLimit: y });
    throw y == 1 && f3.length > 0 ? new x(`For ${JSON.stringify(r)}, did you mean ${JSON.stringify(f3[0])}?`, { givenWord: r, possibleWords: f3 }) : new x(`For ${JSON.stringify(r)}, did you mean one of ${JSON.stringify(f3)}?`, { givenWords: a, possibleWords: f3 });
  }
  return [...o2].sort((f3, v) => C(r, f3) - C(r, v)).slice(0, y);
}
var Q = Symbol("flagArg");
var X = Symbol("requiredArg");
var m2 = Symbol("unset");
var k = class {
  constructor(r) {
    this.val = r;
  }
};
var $ = class extends Error {
  constructor(r, a) {
    super(r), Object.assign(this, a);
  }
};
var ae = (n) => new k(n);
var Y = (n, r) => {
  if (n instanceof Array) try {
    return r(n);
  } catch {
    let o2 = [];
    for (let l2 of n) try {
      o2.push(r(l2));
    } catch {
      o2.push(l2);
    }
    return o2;
  }
  else if (n !== void 0 && n !== m2) try {
    return r(n);
  } catch {
  }
  return n;
};
function le({ rawArgs: n, fields: r, namedArgsStopper: a = "--", allowNameRepeats: o2 = true, nameTransformer: l2 = Z, valueTransformer: d2 = JSON.parse, isolateArgsAfterStopper: y = false, argsByNameSatisfiesNumberedArg: f3 = true, allowImplicitNamedArgs: v = true, allowImplicitNumberedArgs: K = true, implicitNamePattern: F = /^(--|-)[a-zA-Z0-9\-_]+$/, implictFlagPattern: T = null }) {
  let D = [], _ = [], u2 = /* @__PURE__ */ new Map();
  for (let [e, ...t] of r) {
    let s2 = t.includes(Q), i3 = t.includes(X), c2 = t.some((g) => g instanceof k), b = t.some((g) => g instanceof Function), W = { isRequired: i3, isFlag: s2, isExplicit: true, hasTransformer: b, wasNamed: false, keys: e, kind: t, realIndices: [], value: m2, hasDefaultValue: c2, default: c2 ? t.filter((g) => g instanceof k)[0].val : void 0 };
    for (let g of e) {
      if (u2.has(g)) throw Error(`When calling parseArgs(), there's at least two arguments that are both trying to use this name ${JSON.stringify(g)}. A name can only belong to one argument.`);
      u2.set(g, W), typeof g == "string" && D.push(g);
    }
    if (s2) for (let g of e) typeof g == "string" && _.push(g);
  }
  let q = [], U = [], G = [], S = [], O = {}, M = false, A = null, p = -1, h2 = -1, j = null, J = [], H = (e, t) => {
    S.push(t);
    e: for (; ; ) {
      if (p += 1, u2.has(p)) {
        let s2 = u2.get(p);
        if (s2.value != m2) {
          if (f3) continue e;
          if (o2) s2.value = [s2.value, t];
          else {
            let i3 = s2.keys.filter((b) => typeof b == "string"), c2 = i3.reduce((b, W) => b.length > W.length ? b : W);
            throw new $(`When calling parseArgs(), two values were given for the same entry (ex: "count $thisVal 5 --min $thisVal" instead of "count --min $thisVal --max 5" or "count $thisVal 5"). The second occurance was ${JSON.stringify(t)}, and the field was ${JSON.stringify(i3)}`, { reason: "argNotAllowed", badArg: t, badArgRealIndex: e, badArgName: c2, badArgNames: i3 });
          }
        } else O[p] = t, s2.value = t;
        s2.realIndices.push(e);
      } else {
        if (!K) {
          let s2 = Math.max(0, ...u2.keys().filter((c2) => Number.isInteger(c2) && c2 >= 0)), i3 = "";
          throw e > 0 && (i3 = `
The previous argument was ${JSON.stringify(n[e - 1])}`), s2 == 0 ? new $(`Sorry, numbered arguments are not allowed.
The bad argument was ${JSON.stringify(t)}${i3}`, { reason: "argNotAllowed", badArg: t, badArgRealIndex: e }) : new $(`Sorry, only ${s2} numbered arguments are allowed.
The bad argument was ${JSON.stringify(t)}${i3}`, { reason: "argNotAllowed", badArg: t, badArgRealIndex: e });
        }
        U.push(p), u2.set(p, { kind: [], keys: [p], realIndices: [e], value: t });
      }
      break;
    }
  };
  for (let e of n) {
    if (h2 += 1, A != null) {
      let s2 = A;
      if (A = null, !u2.has(s2)) v || I({ givenWord: s2, possibleWords: [...u2.keys()].filter((i3) => typeof i3 == "string"), autoThrow: true, suggestionLimit: 3 }), G.push(s2), u2.set(s2, { wasNamed: true, kind: [], keys: [s2], realIndices: [h2], value: e });
      else {
        let i3 = u2.get(s2);
        if (i3.wasNamed = true, i3.value !== m2) if (o2) i3.value = [i3.value, e];
        else throw Error(`When calling parseArgs(), two values (ex: "--min 5 --minimum 5" or "--m 5 --m 5") were given to the same field. The second occurance was ${s2}, and the field was ${JSON.stringify(i3.keys)} `);
        else i3.value = e;
        i3.realIndices.push(h2 - 1), i3.realIndices.push(h2);
      }
      continue;
    }
    if (e == a) {
      M = true, j = h2;
      continue;
    }
    if (M) {
      q.push(e), y || J.push([h2, e]);
      continue;
    }
    let t;
    if (_.includes(e)) {
      let s2 = u2.get(e);
      if (s2.value != m2) {
        if (!o2) throw Error(`When calling parseArgs(), two values (ex: "--min 5 --minimum 5" or "--m 5 --m 5") were given to the same field. The second occurance was ${e}, and the field was ${JSON.stringify(s2.keys)} `);
      } else s2.value = true;
      s2.realIndices.push(h2);
    } else D.includes(e) || F && (t = e.match(F)) ? A = e : T && (t = e.match(T)) ? u2.has(e) ? u2.get(e).realIndices.push(h2) : u2.set(p, { isFlag: true, kind: [], keys: [e], realIndices: [h2], value: true }) : J.push([h2, e]);
  }
  for (let [e, t] of J) H(e, t);
  let w = {}, L = {}, N = new Set(u2.values());
  for (let e of N) {
    let t = e.keys.filter((s2) => typeof s2 == "string");
    if (t.length > 0) if (!l2) w[t[0]] = null;
    else {
      let s2 = t.map(l2).flat(1);
      w[s2[0]] = null;
      let i3 = s2.filter((c2) => !t.includes(c2));
      e.keys = e.keys.concat(i3);
      for (let c2 of i3) u2.set(c2, e);
    }
  }
  for (let e of N) {
    if (e.isRequired && e.value == m2) throw Error(`

The ${e.keys.map((s2) => typeof s2 == "number" ? `[Arg #${s2}]` : s2).join(" ")} field is required but it was not provided
`);
    if (e.hasDefaultValue && e.value == m2) e.value = e.default;
    else if (e.hasTransformer) for (let s2 of e.kind) s2 instanceof Function && (e.value = s2(e.value));
    else d2 && !e.isFlag && (e.value = Y(e.value, d2));
    e.isFlag && (e.value == m2 ? e.value = false : e.value = !!e.value);
    for (let s2 of e.keys) typeof s2 == "number" ? O[s2] = e.value : typeof s2 == "string" && (L[s2] = e.value);
  }
  let V = {}, B = [];
  for (let { isExplicit: e, value: t, keys: s2 } of N) e || (typeof s2[0] == "number" ? B.push(t) : (V[s2[0]] = t, V[l2(s2[0])] = t));
  let z = {}, E = [];
  for (let { isExplicit: e, kind: t, value: s2, keys: i3 } of N) if (e) for (let c2 of i3) typeof c2 == "number" ? E[c2] = s2 : z[c2] = s2;
  for (let e of Object.keys(w)) w[e] = L[e], w[e] === m2 && (w[e] = void 0);
  return d2 && (S = S.map((e) => Y(e, d2))), { simplifiedNames: w, argList: E.concat(B), explicitArgsByNumber: E, implicitArgsByNumber: B, directArgList: S, argsAfterStopper: q, arg: (e) => typeof e == "number" ? O[e] : L[e], fields: [...N], field: (e) => u2.get(e), explicitArgsByName: z, implicitArgsByName: V, nameStopIndex: j };
}

// https://esm.sh/gh/jeff-hykin/good-js@40797ac/denonext/source/flattened/did_you_mean.mjs
function f(s2, e) {
  s2.length > e.length && ([s2, e] = [e, s2]);
  let i3 = Array.from({ length: s2.length + 1 }, (t, o2) => +o2);
  for (let t = 0; t < e.length; t++) {
    let o2 = [t + 1];
    for (let r = 0; r < s2.length; r++) {
      let l2 = s2[r], n = e[t];
      l2 === n ? o2.push(i3[r]) : o2.push(1 + Math.min(i3[r], i3[r + 1], o2[o2.length - 1]));
    }
    i3 = o2;
  }
  return i3[i3.length - 1];
}
var d = class extends Error {
  constructor(e, { givenWord: i3, givenWords: t, possibleWords: o2 }) {
    super(e), this.givenWord = i3, this.givenWords = t, this.possibleWords = o2;
  }
};
function h(s2) {
  var { givenWord: e, givenWords: i3, possibleWords: t, caseSensitive: o2, autoThrow: r, suggestionLimit: l2 } = { suggestionLimit: 1 / 0, ...s2 };
  if (i3 instanceof Array) {
    let n = {};
    for (let g of i3) n[g] = h({ ...s2, givenWord: g, givenWords: void 0 });
    return n;
  }
  if (o2 || (t = t.map((n) => n.toLowerCase()), e = e.toLowerCase()), !t.includes(e) && r) {
    let n = h({ givenWord: e, possibleWords: t, caseSensitive: o2, suggestionLimit: l2 });
    throw l2 == 1 && n.length > 0 ? new d(`For ${JSON.stringify(e)}, did you mean ${JSON.stringify(n[0])}?`, { givenWord: e, possibleWords: n }) : new d(`For ${JSON.stringify(e)}, did you mean one of ${JSON.stringify(n)}?`, { givenWords: i3, possibleWords: n });
  }
  return [...t].sort((n, g) => f(e, n) - f(e, g)).slice(0, l2);
}

// https://esm.sh/gh/jeff-hykin/good-js@2e7999c/denonext/source/flattened/merge.mjs
var c = ({ oldData: r, newData: e }) => {
  if (!(e instanceof Object) || !(r instanceof Object)) return e;
  let n = {};
  e instanceof Array && (n = []), Object.assign(n, r);
  for (let i3 in e) i3 in r ? n[i3] = c({ oldData: r[i3], newData: e[i3] }) : n[i3] = e[i3];
  return n;
};

// https://esm.sh/gh/jeff-hykin/good-js@2e7999c/denonext/source/flattened/get.mjs
var l = function(e) {
  let t = [];
  if (e == null) return [];
  for (e instanceof Object || (e = Object.getPrototypeOf(e)); e; ) t.push(Reflect.ownKeys(e)), e = Object.getPrototypeOf(e);
  return [...new Set(t.flat(1))];
};
var f2 = ({ keyList: e, from: t, failValue: r }) => {
  let s2 = e.slice(-1)[0];
  for (let c2 of e.slice(0, -1)) {
    if (t == null) return r;
    try {
      t = t[c2];
    } catch {
      return r;
    }
  }
  if (t == null) return r;
  let n;
  try {
    if (n = t[s2], n !== void 0) return n;
  } catch {
    return r;
  }
  return l(t).includes(s2) ? n : r;
};

// https://esm.sh/gh/jeff-hykin/good-js@2e7999c/denonext/source/flattened/set.mjs
var i2 = ({ keyList: r, to: a, on: t }) => {
  let n = r;
  try {
    r = [...r];
    let s2 = r.pop();
    for (var e of r) t[e] instanceof Object || (t[e] = {}), t = t[e];
    t[s2] = a;
  } catch (s2) {
    throw new Error(`
the set function was unable to set the value for some reason
    the set obj was: ${JSON.stringify(t)}
    the keyList was: ${JSON.stringify(n)}
    the value was: ${JSON.stringify(a)}
the original error message was:

`, s2);
  }
  return t;
};

// https://esm.sh/gh/jeff-hykin/good-js@2e7999c/denonext/source/flattened/remove.mjs
var s = function(e) {
  let t = [];
  if (e == null) return [];
  for (e instanceof Object || (e = Object.getPrototypeOf(e)); e; ) t.push(Reflect.ownKeys(e)), e = Object.getPrototypeOf(e);
  return [...new Set(t.flat(1))];
};
var o = ({ keyList: e, from: t, failValue: r }) => {
  let n = e.slice(-1)[0];
  for (let l2 of e.slice(0, -1)) {
    if (t == null) return r;
    try {
      t = t[l2];
    } catch {
      return r;
    }
  }
  if (t == null) return r;
  let c2;
  try {
    if (c2 = t[n], c2 !== void 0) return c2;
  } catch {
    return r;
  }
  return s(t).includes(n) ? c2 : r;
};
var u = ({ keyList: e, from: t }) => {
  if (e.length == 1) try {
    delete t[e[0]];
  } catch {
    return false;
  }
  else if (e.length > 1) {
    e = [...e];
    let r = e.pop(), n = o({ keyList: e, from: t });
    return u({ keyList: [r], from: n });
  }
};

// main.js
var argsInfo = le({
  rawArgs: Deno.args,
  fields: [
    [["--help"], Q],
    [["--version"], Q],
    [["--debug", "-d"], Q],
    [["--port"], ae(`7070`), (str) => str],
    [["--address"], ae(`127.0.0.1`), (str) => str],
    [["--overrideAddressCheck"], Q],
    [["--noFallbackPort"], Q]
  ],
  namedArgsStopper: "--",
  allowNameRepeats: true,
  valueTransformer: JSON.parse,
  isolateArgsAfterStopper: false,
  argsByNameSatisfiesNumberedArg: true,
  implicitNamePattern: /^(--|-)[a-zA-Z0-9\-_]+$/,
  implictFlagPattern: null
});
h({
  givenWords: Object.keys(argsInfo.implicitArgsByName).filter((each2) => each2.startsWith(`-`)),
  possibleWords: Object.keys(argsInfo.explicitArgsByName).filter((each2) => each2.startsWith(`-`)),
  autoThrow: true,
  suggestionLimit: 1
});
var { help, version: version2, debug, port, address, overrideAddressCheck, noFallbackPort } = argsInfo.simplifiedNames;
if (help) {
  console.log(`
    Usage: sss
    
    Options:
        --help, -h
            Show this help message and exit.
        --version, -v
            Show version and exit.
        --debug, -d
            Enable debug mode.
        --port, -p
            Default port to use for the server (defaults to 7070)
            (it will increment up by 1 until it finds an available port up to 10000)
        --address, -a
            Address to use for the server.
            Defaults to 127.0.0.1
    `);
  Deno.exit(0);
}
if (version2) {
  console.log(`0.0.1`);
  Deno.exit(0);
}
var shouldWarn = true;
var addr;
var server;
var hostIp = address;
if (!overrideAddressCheck) {
  const hostIps = Deno.networkInterfaces().filter((each2) => each2.family == "IPv4").map((each2) => each2.address);
  if (hostIps.length == 0) {
    throw new Error(`No valid network interfaces found (I listed all available ip addresses, and it was empty according to Deno.networkInterfaces)
Use --overrideAddressCheck to override this check`);
  }
  if (hostIp != "localhost" && !hostIps.some((each2) => each2 == hostIp)) {
    hostIp = hostIps[0];
    if (shouldWarn) {
      console.warn(`The selected ${address} is not a valid ip, valid addresses are
${JSON.stringify(hostIps)}
Falling back on ${hostIp}
Use --overrideAddressCheck to override this behavior / check`);
    }
  }
}
var state = {};
var returnJson = (value) => {
  return new Response(
    JSON.stringify(value),
    { headers: { "Content-Type": "application/json" } }
  );
};
var getKeyList = (url) => {
  url = new URL(url);
  let pathname = url.pathname;
  if (pathname == "/" || pathname.length == 0) {
    return [];
  }
  if (pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  if (pathname.startsWith("/")) {
    pathname = pathname.slice(1);
  }
  return pathname.split("/").map(decodeURIComponent);
};
while (port < 1e4) {
  try {
    addr = `${hostIp}:${port}`;
    server = Deno.serve(
      {
        port,
        hostname: hostIp,
        onListen: () => {
          console.log(`Server listening on http://${addr}`);
        }
      },
      // (req) => new Response(stringForPdfExtractionHtml, { headers: { "Content-Type": "text/html" } }),
      async (req) => {
        if (req.url?.endsWith?.("/@ping")) {
          return new Response("pong");
        }
        if (req.url?.endsWith?.("/@shutdown")) {
          Deno.exit(0);
        }
        if (req.method == "GET") {
          const keyList2 = getKeyList(req.url);
          if (keyList2.length == 0) {
            return returnJson({ t: Date.now(), v: state });
          }
          const output = f2({ from: state, keyList: keyList2, failValue: null });
          return returnJson({ t: Date.now(), v: output });
        } else if (req.method == "POST") {
          let value;
          try {
            value = await req.json();
          } catch (error) {
            return new Response(`Request needs to be json, but was not (happened during ${req.url})`, { status: 405 });
          }
          const keyList2 = getKeyList(req.url);
          i2({ on: state, keyList: keyList2, to: value });
          return returnJson({ t: Date.now() });
        } else if (req.method == "PUT") {
          let value;
          try {
            value = await req.json();
          } catch (error) {
            return new Response(`Request needs to be json, but was not (happened during ${req.url})`, { status: 405 });
          }
          const keyList2 = getKeyList(req.url);
          let existingValue;
          const needToMerge = value instanceof Object && (existingValue = f2({ from: state, keyList: keyList2, failValue: null })) instanceof Object;
          if (needToMerge) {
            value = c({ oldData: existingValue, newData: value });
          }
          i2({ on: state, keyList: keyList2, to: value });
          return returnJson({ t: Date.now() });
        } else if (req.method == "DELETE") {
          u({ from: state, keyList });
          return returnJson({ t: Date.now() });
        } else {
          return new Response(`Method not allowed (${req.method})`, { status: 405 });
        }
      }
    );
    break;
  } catch (error) {
    if (!error.stack.includes("AddrInUse: Address already in use (os error 48)")) {
      throw error;
    } else {
      if (noFallbackPort) {
        throw error;
      }
      shouldWarn && console.warn(`error when trying to start server on port ${port}, trying next port`, error);
    }
    port++;
  }
}
if (port >= 1e4) {
  throw new Error(`giving up, tried every port and couldn't start server`);
}
await new Promise(async (resolve7, reject) => {
  while (1) {
    try {
      const response = await (await fetch(`http://${addr}/@ping`)).text();
      if (response == "pong") {
        resolve7();
      }
    } catch (error) {
    }
    break;
  }
});
console.log(`Server ready`);
