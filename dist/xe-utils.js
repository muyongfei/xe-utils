/**
 * xe-utils.js v1.7.4
 * (c) 2017-2018 Xu Liangzhan
 * ISC License.
 * @preserve
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory()
    : typeof define === 'function' && define.amd ? define(factory)
      : (global.XEUtils = factory())
}(this, function () {
  'use strict'

  function XEUtils () { }

  var formatString = 'yyyy-MM-dd HH:mm:ss'
  var setupDefaults = {
    cookies: null,
    treeOptions: {
      strict: false,
      parentKey: 'parentId',
      key: 'id',
      children: 'children'
    },
    formatDate: formatString + '.SSS',
    formatString: formatString,
    formatStringMatchs: null,
    dateDiffRules: [
      ['yyyy', 31536000000],
      ['MM', 2592000000],
      ['dd', 86400000],
      ['HH', 3600000],
      ['mm', 60000],
      ['ss', 1000],
      ['S', 0]
    ]
  }

  var FIND_PRO = 'find'
  var MAP_PRO = 'map'
  var FILTER_PRO = 'filter'
  var EVERY_PRO = 'every'
  var SOME_PRO = 'some'
  var REDUCE_PRO = 'reduce'

  function _objectHasOwnProperty (obj, key) {
    return obj.hasOwnProperty(key)
  }

  /**
    * 数组去重
    *
    * @param {Array} array 数组
    * @return {Array}
    */
  function arrayUniq (array) {
    var result = []
    if (baseExports.isArray(array)) {
      baseExports.each(array, function (value) {
        if (!result.includes(value)) {
          result.push(value)
        }
      })
    }
    return result
  }

  /**
    * 将多个数的值返回唯一的并集数组
    *
    * @param {...Array} 数组
    * @return {Array}
    */
  function arrayUnion () {
    var args = arguments
    var result = []
    var index = 0
    var len = args.length
    for (; index < len; index++) {
      result = result.concat(args[index])
    }
    return arrayUniq(result)
  }

  /**
    * 数组按属性值升序
    *
    * @param {Array} arr 数组
    * @param {Function/String} iterate 方法或属性
    * @return {Array}
    */
  function arraySort (arr, iterate, context) {
    if (baseExports.isArray(arr)) {
      return arr.sort(iterate ? baseExports.isFunction(iterate) ? iterate.bind(context || this) : function (v1, v2) {
        return v1[iterate] > v2[iterate] ? 1 : -1
      } : function (v1, v2) {
        return v1 > v2 ? 1 : -1
      })
    }
    return arr
  }

  /**
    * 将一个数组随机打乱，返回一个新的数组
    *
    * @param {Array} array 数组
    * @return {Array}
    */
  function arrayShuffle (array) {
    var index
    var result = []
    var list = baseExports.values(array)
    var len = list.length - 1
    for (; len >= 0; len--) {
      index = len > 0 ? XEUtils.random(0, len) : 0
      result.push(list[index])
      list.splice(index, 1)
    }
    return result
  }

  /**
    * 从一个数组中随机返回几个元素
    *
    * @param {Array} array 数组
    * @param {Number} number 个数
    * @return {Array}
    */
  function arraySample (array, number) {
    var result = arrayShuffle(array)
    if (arguments.length === 1) {
      return result[0]
    }
    if (number < result.length) {
      result.length = number || 0
    }
    return result
  }

  function isArrayPro (array, pro) {
    return baseExports.isArray(array) && array[pro]
  }

  /**
    * 对象中的值中的每一项运行给定函数,如果函数对任一项返回true,则返回true,否则返回false
    *
    * @param {Object} obj 对象/数组
    * @param {Function} iterate(item, index, obj) 回调
    * @param {Object} context 上下文
    * @return {Boolean}
    */
  function arraySome (obj, iterate, context) {
    if (obj && iterate) {
      context = context || this
      if (isArrayPro(SOME_PRO)) {
        return obj[SOME_PRO](iterate, context)
      } else {
        for (var key in obj) {
          if (_objectHasOwnProperty(obj, key)) {
            if (iterate.call(context, obj[key], key, obj)) {
              return true
            }
          }
        }
      }
    }
    return false
  }

  /**
    * 对象中的值中的每一项运行给定函数,如果该函数对每一项都返回true,则返回true,否则返回false
    *
    * @param {Object} obj 对象/数组
    * @param {Function} iterate(item, index, obj) 回调
    * @param {Object} context 上下文
    * @return {Boolean}
    */
  function arrayEvery (obj, iterate, context) {
    if (obj && iterate) {
      context = context || this
      if (isArrayPro(EVERY_PRO)) {
        return obj[EVERY_PRO](iterate, context)
      } else {
        for (var key in obj) {
          if (_objectHasOwnProperty(obj, key)) {
            if (!iterate.call(context, obj[key], key, obj)) {
              return false
            }
          }
        }
      }
    }
    return true
  }

  /**
    * 根据回调过滤数据
    *
    * @param {Object} obj 对象/数组
    * @param {Function} iterate(item, index, obj) 回调
    * @param {Object} context 上下文
    * @return {Object}
    */
  function arrayFilter (obj, iterate, context) {
    if (obj && iterate) {
      context = context || this
      if (isArrayPro(FILTER_PRO)) {
        return obj[FILTER_PRO](iterate, context)
      } else {
        var isArr = baseExports.isArray(obj)
        var result = isArr ? [] : {}
        baseExports.each(obj, isArr ? function (val, key) {
          if (iterate.call(context, val, key, obj)) {
            result.push(val)
          }
        } : function (val, key) {
          if (iterate.call(context, val, key, obj)) {
            result[key] = val
          }
        })
        return result
      }
    }
    return []
  }

  /**
    * 查找匹配第一条数据
    *
    * @param {Object} obj 对象/数组
    * @param {Function} iterate(item, index, obj) 回调
    * @param {Object} context 上下文
    * @return {Object}
    */
  function arrayFind (obj, iterate, context) {
    if (obj && iterate) {
      context = context || this
      if (isArrayPro(FIND_PRO)) {
        return obj[FIND_PRO](iterate, context)
      } else {
        for (var key in obj) {
          if (_objectHasOwnProperty(obj, key)) {
            if (iterate.call(context, obj[key], key, obj)) {
              return obj[key]
            }
          }
        }
      }
    }
  }

  /**
    * 查找匹配第一条数据的键
    *
    * @param {Object} obj 对象/数组
    * @param {Function} iterate(item, index, obj) 回调
    * @param {Object} context 上下文
    * @return {Object}
    */
  function findKey (obj, iterate, context) {
    if (obj && iterate) {
      context = context || this
      for (var key in obj) {
        if (_objectHasOwnProperty(obj, key)) {
          if (iterate.call(context, obj[key], key, obj)) {
            return key
          }
        }
      }
    }
  }

  /**
    * 指定方法后的返回值组成的新数组
    *
    * @param {Object} obj 对象/数组
    * @param {Function} iterate(item, index, obj) 回调
    * @param {Object} context 上下文
    * @return {Array}
    */
  function arrayMap (obj, iterate, context) {
    var result = []
    if (obj) {
      if (arguments.length > 1) {
        context = context || this
        if (!baseExports.isFunction(iterate)) {
          iterate = baseExports.property(iterate)
        }
        if (isArrayPro(MAP_PRO)) {
          return obj[MAP_PRO](iterate, context)
        } else {
          baseExports.each(obj, function () {
            result.push(iterate.apply(context, arguments))
          })
        }
      } else {
        return obj
      }
    }
    return result
  }

  /**
    * 求和函数，将数值相加
    *
    * @param {Array} array 数组
    * @param {Function/String} iterate 方法或属性
    * @param {Object} context 上下文
    * @return {Number}
    */
  function arraySum (array, iterate, context) {
    var result = 0
    var toNumber = XEUtils.toNumber
    context = context || this
    baseExports.each(array, iterate ? baseExports.isFunction(iterate) ? function () {
      result += toNumber(iterate.apply(context, arguments))
    } : function (val) {
      result += toNumber(val[iterate])
    } : function (val) {
      result += toNumber(val)
    })
    return result
  }

  /**
    * 求平均值函数
    *
    * @param {Array} array 数组
    * @param {Function/String} iterate 方法或属性
    * @param {Object} context 上下文
    * @return {Number}
    */
  function arrayMean (array, iterate, context) {
    return XEUtils.toNumber(arraySum(array, iterate, context || this) / baseExports.getSize(array))
  }

  /**
    * 接收一个函数作为累加器，数组中的每个值（从左到右）开始合并，最终为一个值。
    *
    * @param {Array} array 数组
    * @param {Function} callback 方法
    * @param {Object} initialValue 初始值
    * @return {Number}
    */
  /* eslint-disable valid-typeof */
  function arrayReduce (array, callback, initialValue, UNDEFINED) {
    if (array) {
      var len
      var index = 0
      var context = this
      var previous = initialValue
      var keyList = baseExports.keys(array)
      if (previous === UNDEFINED) {
        previous = array[keyList[0]]
        index = 1
      }
      if (isArrayPro(REDUCE_PRO)) {
        return array.reduce(function () {
          return callback.apply(context, arguments)
        }, previous)
      }
      for (len = keyList.length; index < len; index++) {
        previous = callback.call(context, previous, array[keyList[index]], index, array)
      }
      return previous
    }
  }

  /**
    * 浅复制数组的一部分到同一数组中的另一个位置,数组大小不变
    *
    * @param {Array} array 数组
    * @param {Number} target 从该位置开始替换数据
    * @param {Number} start 从该位置开始读取数据，默认为 0 。如果为负值，表示倒数
    * @param {Number} end 到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数
    * @return {Array}
    */
  function arrayCopyWithin (array, target, start, end) {
    if (baseExports.isArray(array) && array.copyWithin) {
      return array.copyWithin(target, start, end)
    }
    var replaceIndex
    var replaceArray
    var targetIndex = target >> 0
    var startIndex = start >> 0
    var len = array.length
    var endIndex = arguments.length > 3 ? end >> 0 : len
    if (targetIndex < len) {
      targetIndex = targetIndex >= 0 ? targetIndex : len + targetIndex
      if (targetIndex >= 0) {
        startIndex = startIndex >= 0 ? startIndex : len + startIndex
        endIndex = endIndex >= 0 ? endIndex : len + endIndex
        if (startIndex < endIndex) {
          for (replaceIndex = 0, replaceArray = array.slice(startIndex, endIndex); targetIndex < len; targetIndex++) {
            if (replaceArray.length <= replaceIndex) {
              break
            }
            array[targetIndex] = replaceArray[replaceIndex++]
          }
        }
      }
    }
    return array
  }

  /**
    * 将一个数组分割成大小的组。如果数组不能被平均分配，那么最后一块将是剩下的元素
    *
    * @param {Array} array 数组
    * @param {Number} size 每组大小
    * @return {Array}
    */
  function chunk (array, size) {
    var index
    var result = []
    var arrLen = size >> 0 || 1
    if (baseExports.isArray(array)) {
      if (arrLen >= 0 && array.length > arrLen) {
        index = 0
        while (index < array.length) {
          result.push(array.slice(index, index + arrLen))
          index += arrLen
        }
      } else {
        result = array.length ? [array] : array
      }
    }
    return result
  }

  /**
   * 将每个数组中相应位置的值合并在一起
   *
   * @param {Array*} array 数组
   */
  function zip () {
    return unzip(arguments)
  }

  /**
   * 与 zip 相反
   *
   * @param {Array} arrays 数组集合
   */
  function unzip (arrays) {
    var result = []
    var index = 0
    var len = XEUtils.max(arrays, function (item) {
      return item.length || 0
    }).length
    for (; index < len; index++) {
      result.push(arrayMap(arrays, index))
    }
    return result
  }

  /**
   * 将对象或者伪数组转为新数组
   *
   * @param {Array} obj 数组
   * @return {Array}
   */
  function toArray (array) {
    return arrayMap(array, function (item) {
      return item
    })
  }

  /**
    * 判断数组是否包含另一数组
    *
    * @param {Array} array1 数组
    * @param {Array} array2 被包含数组
    * @return {Boolean}
    */
  function includeArrays (array1, array2) {
    var len
    var index = 0
    var includes = baseExports.includes
    if (baseExports.isArray(array1) && baseExports.isArray(array2)) {
      for (len = array2.length; index < len; index++) {
        if (!includes(array1, array2[index])) {
          return false
        }
      }
      return true
    }
    return includes(array1, array2)
  }

  /**
    * 获取数组对象中某属性值，返回一个数组
    *
    * @param {Array} array 数组
    * @param {String} key 属性值
    * @return {Array}
    */
  function pluck (obj, key) {
    return arrayMap(obj, key)
  }

  function deepGetObj (obj, path) {
    var index = 0
    var len = path.length
    while (obj && index < len) {
      obj = obj[path[index++]]
    }
    return len && obj ? obj : 0
  }

  /**
   * 在list的每个元素上执行方法,任何传递的额外参数都会在调用方法的时候传递给它
   *
   * @param {Array} list
   * @param {Array/String/Function} path
   * @param {...Object} arguments
   * @return {Array}
   */
  function invokeMap (list, path) {
    var func
    var args = arguments
    var params = []
    var paths = []
    var index = 2
    var len = args.length
    for (; index < len; index++) {
      params.push(args[index])
    }
    if (baseExports.isArray(path)) {
      len = path.length - 1
      for (index = 0; index < len; index++) {
        paths.push(path[index])
      }
      path = path[len]
    }
    return arrayMap(list, function (context) {
      if (paths.length) {
        context = deepGetObj(context, paths)
      }
      func = context[path] || path
      if (func && func.apply) {
        return func.apply(context, params)
      }
    })
  }

  /**
    * 将一个带层级的数据列表转成树结构
    *
    * @param {Array} array 数组
    * @param {Object} options {strict: false, parentKey: 'parentId', key: 'id', children: 'children', data: 'data'}
    * @return {Array}
    */
  function toArrayTree (array, options) {
    var opts = baseExports.assign({}, setupDefaults.treeOptions, options)
    var optStrict = opts.strict
    var optKey = opts.key
    var optParentKey = opts.parentKey
    var optChildren = opts.children
    var optSortKey = opts.sortKey
    var optReverse = opts.reverse
    var optData = opts.data
    var result = []
    var treeMap = {}
    var idList, id, treeData, parentId

    if (optSortKey) {
      array = arraySort(baseExports.clone(array), optSortKey)
      if (optReverse) {
        array = array.reverse()
      }
    }

    idList = arrayMap(array, function (item) {
      return item[optKey]
    })

    baseExports.each(array, function (item) {
      id = item[optKey]

      if (optData) {
        treeData = {}
        treeData[optData] = item
      } else {
        treeData = item
      }

      parentId = item[optParentKey]
      treeMap[id] = treeMap[id] || []
      treeMap[parentId] = treeMap[parentId] || []
      treeMap[parentId].push(treeData)
      treeData[optKey] = id
      treeData[optParentKey] = parentId
      treeData[optChildren] = treeMap[id]

      if (!optStrict || (optStrict && !parentId)) {
        if (!baseExports.includes(idList, parentId)) {
          result.push(treeData)
        }
      }
    })

    if (optStrict) {
      strictTree(array, optChildren)
    }

    return result
  }

  function strictTree (array, optChildren) {
    baseExports.each(array, function (item) {
      if (item.children && !item.children.length) {
        baseExports.remove(item, optChildren)
      }
    })
  }

  function unTreeList (result, array, opts) {
    var children
    var optChildren = opts.children
    var optData = opts.data
    baseExports.each(array, function (item) {
      children = item[optChildren]
      if (optData) {
        item = item[optData]
      } else {
        baseExports.remove(item, optChildren)
      }
      result.push(item)
      if (children) {
        unTreeList(result, children, opts)
      }
    })
    return result
  }

  /**
    * 将一个树结构转成数组列表
    *
    * @param {Array} array 数组
    * @param {Object} options {children: 'children', data: 'data'}
    * @return {Array}
    */
  function toTreeArray (array, options) {
    return unTreeList([], array, baseExports.assign({}, setupDefaults.treeOptions, options))
  }

  var arrayExports = {
    uniq: arrayUniq,
    union: arrayUnion,
    sortBy: arraySort,
    shuffle: arrayShuffle,
    sample: arraySample,
    some: arraySome,
    every: arrayEvery,
    filter: arrayFilter,
    find: arrayFind,
    findKey: findKey,
    map: arrayMap,
    sum: arraySum,
    mean: arrayMean,
    reduce: arrayReduce,
    copyWithin: arrayCopyWithin,
    chunk: chunk,
    zip: zip,
    unzip: unzip,
    toArray: toArray,
    includeArrays: includeArrays,
    pluck: pluck,
    invoke: invokeMap,
    invokeMap: invokeMap,
    toArrayTree: toArrayTree,
    toTreeArray: toTreeArray
  }

  var STRING_UNDEFINED = 'undefined'
  var objectToString = Object.prototype.toString
  var objectAssignFns = Object.assign

  /* eslint-disable valid-typeof */
  function createInTypeof (type) {
    return function (obj) {
      return typeof obj === type
    }
  }

  function createInInObjectString (type) {
    return function (obj) {
      return '[object ' + type + ']' === objectToString.call(obj)
    }
  }

  /**
    * 指定方法后的返回值组成的新对象
    *
    * @param {Object} obj 对象/数组
    * @param {Function} iterate(item, index, obj) 回调
    * @param {Object} context 上下文
    * @return {Object}
    */
  function objectMap (obj, iterate, context) {
    var result = {}
    if (obj) {
      if (iterate) {
        context = context || this
        if (!isFunction(iterate)) {
          iterate = property(iterate)
        }
        each(obj, function (val, index) {
          result[index] = iterate.call(context, val, index, obj)
        })
      } else {
        return obj
      }
    }
    return result
  }

  function cloneObj (obj) {
    var result = {}
    each(obj, function (val, key) {
      result[key] = deepClone(val)
    })
    return result
  }

  function cloneArr (arr) {
    return XEUtils.map(arr, deepClone)
  }

  function deepClone (obj) {
    return isPlainObject(obj) ? cloneObj(obj) : isArray(obj) ? cloneArr(obj) : obj
  }

  /**
    * 浅拷贝/深拷贝
    *
    * @param {Object} obj 对象/数组
    * @param {Boolean} deep 是否深拷贝
    * @return {Object}
    */
  function clone (obj, deep) {
    if (obj) {
      return deep ? deepClone(obj) : objectAssign(isPlainObject(obj) ? {} : [], obj)
    }
    return obj
  }

  /**
    * 该方法和 setTimeout 一样的效果，区别就是支持上下文和额外参数
    *
    * @param {Function} callback 函数
    * @param {Number} wait 延迟毫秒
    * @param {*} args 额外的参数
    * @return {Number}
   */
  function delay (callback, wait) {
    var args = arraySlice(arguments, 2)
    var context = this
    return setTimeout(function () {
      callback.apply(context, args)
    }, wait)
  }

  /**
    * 创建一个绑定上下文的函数
    *
    * @param {Function} callback 函数
    * @param {Object} context 上下文
    * @param {*} args 额外的参数
    * @return {Object}
    */
  function bind (callback, context) {
    var args = arraySlice(arguments, 2)
    context = context || this
    return function () {
      return callback.apply(context, arraySlice(arguments).concat(args))
    }
  }

  /**
    * 创建一个只能调用一次的函数,只会返回第一次执行后的结果
    *
    * @param {Function} callback 函数
    * @param {Object} context 上下文
    * @param {*} args 额外的参数
    * @return {Object}
    */
  function once (callback, context) {
    var done = false
    var rest = null
    var args = arraySlice(arguments, 2)
    context = context || this
    return function () {
      if (done) {
        return rest
      }
      rest = callback.apply(context, arraySlice(arguments).concat(args))
      done = true
      return rest
    }
  }

  /**
    * 创建一个函数, 调用次数超过 count 次之后执行回调并将所有结果记住后返回
    *
    * @param {Number} count 调用次数
    * @param {Function} callback 完成回调
    * @return {Object}
    */
  function after (count, callback, context) {
    var runCount = 0
    var rests = []
    context = context || this
    return function () {
      runCount++
      if (runCount <= count) {
        rests.push(arguments[0])
      }
      if (runCount >= count) {
        callback.apply(context, [rests].concat(arraySlice(arguments)))
      }
    }
  }

  /**
    * 创建一个函数, 调用次数不超过 count 次之前执行回调并将所有结果记住后返回
    *
    * @param {Number} count 调用次数
    * @param {Function} callback 完成回调
    * @return {Object}
    */
  function before (count, callback, context) {
    var runCount = 0
    var rests = []
    context = context || this
    return function () {
      runCount++
      if (runCount < count) {
        rests.push(arguments[0])
        callback.apply(context, [rests].concat(arraySlice(arguments)))
      }
    }
  }

  /**
    * 判断是否Undefined
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  var isUndefined = createInTypeof(STRING_UNDEFINED)

  /**
    * 判断是否数组
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  var isArray = Array.isArray || createInInObjectString('Array')

  /**
    * 判断是否小数
    *
    * @param {Number} obj 数值
    * @return {Boolean}
    */
  function isFloat (obj) {
    return obj !== null && !isNaN(obj) && !isArray(obj) && !isInteger(obj)
  }

  /**
    * 判断是否整数
    *
    * @param {Number, String} number 数值
    * @return {Boolean}
    */
  var isInteger = Number.isInteger

  /**
    * 判断是否方法
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  var isFunction = createInTypeof('function')

  /**
    * 判断是否Boolean对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  var isBoolean = createInTypeof('boolean')

  /**
    * 判断是否String对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  var isString = createInTypeof('string')

  /**
    * 判断是否Number对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  var isNumber = createInTypeof('number')

  /**
    * 判断是否RegExp对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  var isRegExp = createInInObjectString('RegExp')

  /**
    * 判断是否Object对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  var isObject = createInTypeof('object')

  /**
    * 判断是否对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  function isPlainObject (obj) {
    return obj ? obj.constructor === Object : false
  }

  /**
    * 判断是否Date对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  var isDate = createInInObjectString('Date')

  /**
    * 判断是否Error对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  var isError = createInInObjectString('Error')

  /**
    * 判断是否TypeError对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  function isTypeError (obj) {
    return obj ? obj.constructor === TypeError : false
  }

  /**
    * 判断是否为空,包括空对象、空数值、空字符串
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  function isEmpty (obj) {
    for (var key in obj) {
      return false
    }
    return true
  }

  /**
    * 判断是否为Null
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  function isNull (obj) {
    return obj === null
  }

  /**
    * 判断是否Symbol对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  var supportSymbol = typeof Symbol !== STRING_UNDEFINED
  function isSymbol (obj) {
    return supportSymbol && Symbol.isSymbol ? Symbol.isSymbol(obj) : (typeof obj === 'symbol')
  }

  /**
    * 判断是否Arguments对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  var isArguments = createInInObjectString('Arguments')

  /**
    * 判断是否Element对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  function isElement (obj) {
    return obj && isString(obj.nodeName) && isNumber(obj.nodeType)
  }

  /**
    * 判断是否Document对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  var supportDocument = typeof document !== STRING_UNDEFINED
  function isDocument (obj) {
    return obj && obj.nodeType === 9 && supportDocument
  }

  /**
    * 判断是否Window对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  var supportWindow = typeof window !== STRING_UNDEFINED
  function isWindow (obj) {
    return obj && obj === obj.window && supportWindow
  }

  /**
    * 判断是否FormData对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
    */
  var supportFormData = typeof FormData !== STRING_UNDEFINED
  function isFormData (obj) {
    return supportFormData && obj instanceof FormData
  }

  /**
    * 判断是否Map对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
   */
  var supportMap = typeof Map !== STRING_UNDEFINED
  function isMap (obj) {
    return supportMap && obj instanceof Map
  }

  /**
    * 判断是否WeakMap对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
   */
  var supportWeakMap = typeof WeakMap !== STRING_UNDEFINED
  function isWeakMap (obj) {
    return supportWeakMap && obj instanceof WeakMap
  }

  /**
    * 判断是否Set对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
   */
  var supportSet = typeof Set !== STRING_UNDEFINED
  function isSet (obj) {
    return supportSet && obj instanceof Set
  }

  /**
    * 判断是否WeakSet对象
    *
    * @param {Object} obj 对象
    * @return {Boolean}
   */
  var supportWeakSet = typeof WeakSet !== STRING_UNDEFINED
  function isWeakSet (obj) {
    return supportWeakSet && obj instanceof WeakSet
  }

  /**
    * 判断是否闰年
    *
    * @param {Date} date 日期或数字
    * @return {Boolean}
    */
  function isLeapYear (date) {
    var currentDate = date ? XEUtils.toStringDate(date) : new Date()
    var year = currentDate.getFullYear()
    return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)
  }

  /**
   * 深度比较两个对象之间的值是否相等
   *
   * @param {Object} obj1 值1
   * @param {Object} obj2 值2
   * @return {Boolean}
   */
  function isEqual (obj1, obj2) {
    if (obj1 && obj2 && !isNumber(obj1) && !isNumber(obj2) && !isString(obj1) && !isString(obj2)) {
      if (isRegExp(obj1)) {
        return '' + obj1 === '' + obj2
      } if (isDate(obj1) || isBoolean(obj1)) {
        return +obj1 === +obj2
      } else if (isArray(obj1) || isArray(obj2) ? isArray(obj1) && isArray(obj2) : obj1.constructor === obj2.constructor) {
        var obj1Keys = objectKeys(obj1)
        var obj2Keys = objectKeys(obj2)
        if (obj1Keys.length === obj2Keys.length) {
          return XEUtils.every(obj1Keys, function (key, index) {
            return key === obj2Keys[index] && isEqual(obj1[key], obj2[obj2Keys[index]])
          })
        }
        return false
      }
    }
    return obj1 === obj2
  }

  /**
   * 返回一个获取对象属性的函数
   *
   * @param {String} name 属性名
   * @param {Object} defs 空值
   */
  function property (name, defs) {
    return function (obj) {
      return obj === null ? defs : obj[name]
    }
  }

  /**
    * 获取对象类型
    *
    * @param {Object} obj 对象
    * @return {String}
    */
  function getType (obj) {
    if (obj === null) {
      return '' + obj
    }
    if (isSymbol(obj)) {
      return 'symbol'
    }
    if (isDate(obj)) {
      return 'date'
    }
    if (isArray(obj)) {
      return 'array'
    }
    return typeof obj
  }

  /**
    * 获取一个全局唯一标识
    *
    * @param {String} prefix 前缀
    * @return {Number}
    */
  var __uniqueId = 0
  function uniqueId (prefix) {
    return (prefix ? '' + prefix : 0) + ++__uniqueId
  }

  /**
    * 返回对象的长度
    *
    * @param {Object} obj 对象
    * @return {Number}
    */
  function getSize (obj) {
    var len = 0
    if (isString(obj) || isArray(obj)) {
      return obj.length
    }
    each(obj, function () {
      len++
    })
    return len
  }

  /**
   * 裁剪 Arguments 或数组 array，从 start 位置开始到 end 结束，但不包括 end 本身的位置
   * @param {Array/Arguments} array 数组或Arguments
   * @param {Number} startIndex 开始索引
   * @param {Number} endIndex 结束索引
   */
  function arraySlice (array, startIndex, endIndex) {
    var result = []
    if (array) {
      for (startIndex = startIndex || 0, endIndex = endIndex || array.length; startIndex < endIndex; startIndex++) {
        result.push(array[startIndex])
      }
    }
    return result
  }

  function createIndexOf (name, callback) {
    return function (obj, val) {
      if (obj) {
        if (isString(obj) || isArray(obj)) {
          if (obj[name]) {
            return obj[name](val)
          }
          return callback(obj, val)
        }
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (val === obj[key]) {
              return key
            }
          }
        }
      }
      return -1
    }
  }

  /**
    * 返回对象第一个索引值
    *
    * @param {Object} obj 对象
    * @param {Object} val 值
    * @return {Number}
    */
  var indexOf = createIndexOf('indexOf', function (obj, val) {
    for (var index = 0, len = obj.length; index < len; index++) {
      if (val === obj[index]) {
        return index
      }
    }
  })

  /**
    * 从最后开始的索引值,返回对象第一个索引值
    *
    * @param {Object} array 对象
    * @param {Object} val 值
    * @return {Number}
    */
  var lastIndexOf = createIndexOf('lastIndexOf', function (obj, val) {
    for (var len = obj.length - 1; len >= 0; len--) {
      if (val === obj[len]) {
        return len
      }
    }
    return -1
  })

  function createiterateIndexOf (callback) {
    return function (obj, iterate, context) {
      if (obj && isFunction(iterate)) {
        context = this || context
        if (isArray(obj) || isString(obj)) {
          return callback(obj, iterate, context)
        }
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (obj[key] === iterate.call(context, obj[key], key, obj)) {
              return key
            }
          }
        }
      }
      return -1
    }
  }

  /**
    * 返回对象第一个索引值
    *
    * @param {Object} obj 对象/数组
    * @param {Function} iterate(item, index, obj) 回调
    * @param {Object} context 上下文
    * @return {Object}
    */
  var findIndexOf = createiterateIndexOf(function (obj, iterate, context) {
    for (var index = 0, len = obj.length; index < len; index++) {
      if (iterate.call(context, obj[index], index, obj)) {
        return index
      }
    }
    return -1
  })

  /**
    * 从最后开始的索引值,返回对象第一个索引值
    *
    * @param {Object} obj 对象/数组
    * @param {Function} iterate(item, index, obj) 回调
    * @param {Object} context 上下文
    * @return {Object}
    */
  var findLastIndexOf = createiterateIndexOf(function (obj, iterate, context) {
    for (var len = obj.length - 1; len >= 0; len--) {
      if (iterate.call(context, obj[len], len, obj)) {
        return len
      }
    }
    return -1
  })

  /**
    * 判断对象是否包含该值,成功返回true否则false
    *
    * @param {Object} obj 对象
    * @param {Object} val 值
    * @return {Boolean}
    */
  function includes (obj, val) {
    return indexOf(obj, val) !== -1
  }

  function extend (destination, args, isClone) {
    var len = args.length
    for (var source, index = 1; index < len; index++) {
      source = args[index]
      arrayEach(objectKeys(args[index]), function (key) {
        destination[key] = isClone ? clone(source[key], isClone) : source[key]
      })
    }
    return destination
  }

  /**
    * 将一个或者多个对象值解构到目标对象
    *
    * @param {Object} destination 目标对象
    * @param {...Object}
    * @return {Boolean}
    */
  function destructuring (destination, sources) {
    if (destination && sources) {
      var rest = objectAssign.apply(this, [{}].concat(arraySlice(arguments, 1)))
      var restKeys = objectKeys(rest)
      arrayEach(objectKeys(destination), function (key) {
        if (includes(restKeys, key)) {
          destination[key] = rest[key]
        }
      })
    }
    return destination
  }

  /**
    * 浅拷贝一个或者多个对象到目标对象中
    *
    * @param {Object} obj 目标对象
    * @param {...Object}
    * @return {Boolean}
    */
  var objectAssign = function (target) {
    if (target) {
      var args = arguments
      if (target === true) {
        if (args.length > 1) {
          target = isArray(target[1]) ? [] : {}
          return extend(target, args, true)
        }
      } else {
        return objectAssignFns ? objectAssignFns.apply(Object, args) : extend(target, args)
      }
    }
    return target
  }

  /**
    * 字符串转JSON
    *
    * @param {String} str 字符串
    * @return {Object} 返回转换后对象
    */
  function toStringJSON (str) {
    if (isObject(str)) {
      return str
    } else if (isString(str)) {
      try {
        return JSON.parse(str)
      } catch (e) { }
    }
    return {}
  }

  /**
    * JSON转字符串
    *
    * @param {Object} obj 对象
    * @return {String} 返回字符串
    */
  function toJSONString (obj) {
    return JSON.stringify(obj) || ''
  }

  function deleteProperty (obj, property) {
    try {
      delete obj[property]
    } catch (e) {
      obj[property] = undefined
    }
  }

  /**
    * 清空对象
    *
    * @param {Object} obj 对象
    * @param {*} defs 默认值,如果不传（清空所有属性）、如果传对象（清空并继承)、如果传值(给所有赋值)
    * @param {Object/Array} assigns 默认值
    * @return {Object}
    */
  function clearObject (obj, defs, assigns) {
    if (obj) {
      var len
      var isDefs = arguments.length > 1 && (defs === null || !isObject(defs))
      var extds = isDefs ? assigns : defs
      if (isPlainObject(obj)) {
        objectEach(obj, isDefs ? function (val, key) {
          obj[key] = defs
        } : function (val, key) {
          deleteProperty(obj, key)
        })
        if (extds) {
          objectAssign(obj, extds)
        }
      } else if (isArray(obj)) {
        if (isDefs) {
          len = obj.length
          while (len > 0) {
            len--
            obj[len] = defs
          }
        } else {
          obj.length = 0
        }
        if (extds) {
          obj.push.apply(obj, extds)
        }
      }
    }
    return obj
  }

  function pluckProperty (name) {
    return function (obj, key) {
      return key === name
    }
  }

  /**
    * 移除对象属性
    *
    * @param {Object/Array} obj 对象/数组
    * @param {Function/String} iterate 方法或属性
    * @param {Object} context 上下文
    * @return {Object/Array}
    */
  function removeObject (obj, iterate, context) {
    if (obj) {
      var removeKeys = []
      var rest = []
      context = context || this
      if (!isFunction(iterate)) {
        iterate = pluckProperty(iterate)
      }
      each(obj, function (item, index, rest) {
        if (iterate.call(context, item, index, rest)) {
          removeKeys.push(index)
        }
      })
      if (isArray(obj)) {
        lastEach(removeKeys, function (item, key) {
          rest.push(obj[item])
          obj.splice(item, 1)
        })
      } else {
        rest = {}
        arrayEach(removeKeys, function (key) {
          rest[key] = obj[key]
          deleteProperty(obj, key)
        })
      }
      return rest
    }
    return obj
  }

  function createGetObjects (name, getIndex) {
    var proMethod = Object[name]
    return function (obj) {
      var result = []
      if (obj) {
        if (proMethod) {
          return proMethod(obj)
        }
        each(obj, getIndex > 1 ? function (key) {
          result.push(['' + key, obj[key]])
        } : function () {
          result.push(arguments[getIndex])
        })
      }
      return result
    }
  }

  /**
    * 获取对象所有属性
    *
    * @param {Object} obj 对象/数组
    * @return {Array}
    */
  var objectKeys = createGetObjects('keys', 0)

  /**
    * 获取对象所有值
    *
    * @param {Object} obj 对象/数组
    * @return {Array}
    */
  var objectValues = createGetObjects('values', 1)

  /**
    * 获取对象所有属性、值
    *
    * @param {Object} obj 对象/数组
    * @return {Array}
    */
  var objectEntries = createGetObjects('entries', 2)

  function createPickOmit (case1, case2) {
    return function (obj, callback) {
      var item
      var rest = {}
      var result = []
      var context = this
      var args = arguments
      var index = 1
      var len = args.length
      if (!isFunction(callback)) {
        for (callback = 0; index < len; index++) {
          item = args[index]
          if (isArray(item)) {
            result = result.concat(item)
          } else {
            result.push(item)
          }
        }
      }
      each(obj, function (val, key) {
        if ((callback ? callback.call(context, val, key, obj) : findIndexOf(result, function (name) {
          return name === key
        }) > -1) ? case1 : case2) {
          rest[key] = val
        }
      })
      return rest
    }
  }

  /**
   * 根据 keys 过滤指定的属性值，返回一个新的对象
   *
   * @param {Object} obj 对象
   * @param {String/Array} keys 键数组
   * @return {Object}
   */
  var pick = createPickOmit(1, 0)

  /**
   * 根据 keys 排除指定的属性值，返回一个新的对象
   *
   * @param {Object} obj 对象
   * @param {String/Array} keys 键数组
   * @return {Object}
   */
  var omit = createPickOmit(0, 1)

  /**
    * 获取对象第一个值
    *
    * @param {Object} obj 对象/数组
    * @return {Object}
    */
  function getFirst (obj) {
    return objectValues(obj)[0]
  }

  /**
    * 获取对象最后一个值
    *
    * @param {Object} obj 对象/数组
    * @return {Object}
    */
  function getLast (obj) {
    var list = objectValues(obj)
    return list[list.length - 1]
  }

  function arrayEach (obj, iterate, context) {
    for (var index = 0, len = obj.length; index < len; index++) {
      iterate.call(context || this, obj[index], index, obj)
    }
  }

  function objectEach (obj, iterate, context) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        iterate.call(context || this, obj[key], key, obj)
      }
    }
  }

  function lastObjectEach (obj, iterate, context) {
    lastArrayEach(objectKeys(obj), function (key) {
      iterate.call(context || this, obj[key], key, obj)
    })
  }

  function lastArrayEach (obj, iterate, context) {
    for (var len = obj.length - 1; len >= 0; len--) {
      iterate.call(context || this, obj[len], len, obj)
    }
  }

  /**
    * 迭代器,支持 return false 跳出循环 break
    *
    * @param {Object} obj 对象/数组
    * @param {Function} iterate(item, index, obj) 回调
    * @param {Object} context 上下文
    * @return {Object}
    */
  function forOf (obj, iterate, context) {
    if (obj) {
      context = context || this
      if (isArray(obj)) {
        for (var index = 0, len = obj.length; index < len; index++) {
          if (iterate.call(context, obj[index], index, obj) === false) {
            break
          }
        }
      } else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (iterate.call(context, obj[key], key, obj) === false) {
              break
            }
          }
        }
      }
    }
  }

  /**
    * 迭代器
    *
    * @param {Object} obj 对象/数组
    * @param {Function} iterate(item, index, obj) 回调
    * @param {Object} context 上下文
    * @return {Object}
    */
  function each (obj, iterate, context) {
    if (obj) {
      context = context || this
      if (isArray(obj)) {
        if (isFunction(obj.forEach)) {
          return obj.forEach(iterate, context)
        }
        return arrayEach(obj, iterate, context)
      }
      return objectEach(obj, iterate, context)
    }
    return obj
  }

  /**
    * 迭代器,从最后开始迭代
    *
    * @param {Object} obj 对象/数组
    * @param {Function} iterate(item, index, obj) 回调
    * @param {Object} context 上下文
    * @return {Object}
    */
  function lastEach (obj, iterate, context) {
    if (obj) {
      return (isArray(obj) ? lastArrayEach : lastObjectEach)(obj, iterate, context || this)
    }
    return obj
  }

  /**
    * 迭代器,从最后开始迭代,支持 return false 跳出循环 break
    *
    * @param {Object} obj 对象/数组
    * @param {Function} iterate(item, index, obj) 回调
    * @param {Object} context 上下文
    * @return {Object}
    */
  function lastForOf (obj, iterate, context) {
    if (obj) {
      var len
      var list
      context = context || this
      if (isArray(obj)) {
        for (len = obj.length - 1; len >= 0; len--) {
          if (iterate.call(context, obj[len], len, obj) === false) {
            break
          }
        }
      } else {
        list = objectKeys(obj)
        for (len = list.length - 1; len >= 0; len--) {
          if (iterate.call(context, obj[list[len]], list[len], obj) === false) {
            break
          }
        }
      }
    }
  }

  function createiterateEmpty (iterate) {
    return function () {
      return isEmpty(iterate)
    }
  }

  /**
    * 集合分组,默认使用键值分组,如果有iterate则使用结果进行分组
    *
    * @param {Array} obj 对象
    * @param {Function} iterate 回调/对象属性
    * @param {Object} context 上下文
    * @return {Object}
    */
  function groupBy (obj, iterate, context) {
    var groupKey
    var result = {}
    if (obj) {
      context = this || context
      if (iterate && isObject(iterate)) {
        iterate = createiterateEmpty(iterate)
      } else if (!isFunction(iterate)) {
        iterate = property(iterate)
      }
      each(obj, function (val, key) {
        groupKey = iterate ? iterate.call(context, val, key, obj) : val
        if (result[groupKey]) {
          result[groupKey].push(val)
        } else {
          result[groupKey] = [val]
        }
      })
    }
    return result
  }

  /**
    * 集合分组统计,返回各组中对象的数量统计
    *
    * @param {Array} obj 对象
    * @param {Function} iterate 回调/对象属性
    * @param {Object} context 上下文
    * @return {Object}
    */
  function countBy (obj, iterate, context) {
    var result = groupBy(obj, iterate, context || this)
    objectEach(result, function (item, key) {
      result[key] = item.length
    })
    return result
  }

  /**
    * 序号列表生成函数
    *
    * @param {Number} start 起始值
    * @param {Number} stop 结束值
    * @param {Number} step 自增值
    * @return {Object}
    */
  function range (start, stop, step) {
    var index
    var len
    var result = []
    var args = arguments
    if (args.length < 2) {
      stop = args[0]
      start = 0
    }
    index = start >> 0
    len = stop >> 0
    if (index < stop) {
      step = step >> 0 || 1
      for (; index < len; index += step) {
        result.push(index)
      }
    }
    return result
  }

  /**
    * 创建一个策略函数，当被重复调用函数的时候，至少每隔多少秒毫秒调用一次该函数
    *
    * @param {Function} callback 回调
    * @param {Number} wait 多少秒毫
    * @param {Object} options 参数{leading: 是否在之前执行, trailing: 是否在之后执行}
    * @return {Function}
    */
  function throttle (callback, wait, options) {
    var args
    var context
    var opts = options || {}
    var runFlag = false
    var timeout = 0
    var optLeading = 'leading' in opts ? opts.leading : true
    var optTrailing = 'trailing' in opts ? opts.trailing : false
    var runFn = function () {
      runFlag = true
      callback.apply(context, args)
      timeout = setTimeout(endFn, wait)
    }
    var endFn = function () {
      timeout = 0
      if (!runFlag && optTrailing === true) {
        runFn()
      }
    }
    var cancelFn = function () {
      var rest = timeout !== 0
      clearTimeout(timeout)
      runFlag = false
      timeout = 0
      return rest
    }
    var throttled = function () {
      args = arguments
      context = this
      runFlag = false
      if (timeout === 0) {
        if (optLeading === true) {
          runFn()
        } else if (optTrailing === true) {
          timeout = setTimeout(endFn, wait)
        }
      }
    }
    throttled.cancel = cancelFn
    return throttled
  }

  /**
    * 创建一个防反跳策略函数，在函数最后一次调用多少毫秒之后才会再次执行，如果在期间内重复调用会重新计算延迟
    *
    * @param {Function} callback 回调
    * @param {Number} wait 多少秒毫
    * @param {Object} options 参数{leading: 是否在之前执行, trailing: 是否在之后执行}
    * @return {Function}
    */
  function debounce (callback, wait, options) {
    var args
    var context
    var opts = options || {}
    var runFlag = false
    var timeout = 0
    var isLeading = typeof options === 'boolean'
    var optLeading = 'leading' in opts ? opts.leading : isLeading
    var optTrailing = 'trailing' in opts ? opts.trailing : !isLeading
    var clearTimeoutFn = clearTimeout
    var runFn = function () {
      runFlag = true
      timeout = 0
      callback.apply(context, args)
    }
    var endFn = function () {
      if (optLeading === true) {
        timeout = 0
      }
      if (!runFlag && optTrailing === true) {
        runFn()
      }
    }
    var cancelFn = function () {
      var rest = timeout !== 0
      clearTimeoutFn(timeout)
      timeout = 0
      return rest
    }
    var debounced = function () {
      runFlag = false
      args = arguments
      context = this
      if (timeout === 0) {
        if (optLeading === true) {
          runFn()
        }
      } else {
        clearTimeoutFn(timeout)
      }
      timeout = setTimeout(endFn, wait)
    }
    debounced.cancel = cancelFn
    return debounced
  }

  var baseExports = {
    isNaN: isNaN,
    isFinite: isFinite,
    isUndefined: isUndefined,
    isArray: isArray,
    isFloat: isFloat,
    isInteger: isInteger,
    isFunction: isFunction,
    isBoolean: isBoolean,
    isString: isString,
    isNumber: isNumber,
    isRegExp: isRegExp,
    isObject: isObject,
    isPlainObject: isPlainObject,
    isDate: isDate,
    isError: isError,
    isTypeError: isTypeError,
    isEmpty: isEmpty,
    isNull: isNull,
    isSymbol: isSymbol,
    isArguments: isArguments,
    isElement: isElement,
    isDocument: isDocument,
    isWindow: isWindow,
    isFormData: isFormData,
    isMap: isMap,
    isWeakMap: isWeakMap,
    isSet: isSet,
    isWeakSet: isWeakSet,
    isLeapYear: isLeapYear,
    isEqual: isEqual,
    property: property,
    getType: getType,
    uniqueId: uniqueId,
    getSize: getSize,
    slice: arraySlice,
    indexOf: indexOf,
    lastIndexOf: lastIndexOf,
    findIndexOf: findIndexOf,
    findLastIndexOf: findLastIndexOf,
    includes: includes,
    contains: includes,
    assign: objectAssign,
    extend: objectAssign,
    toStringJSON: toStringJSON,
    toJSONString: toJSONString,
    keys: objectKeys,
    values: objectValues,
    entries: objectEntries,
    pick: pick,
    omit: omit,
    first: getFirst,
    last: getLast,
    each: each,
    forOf: forOf,
    arrayEach: arrayEach,
    forEach: arrayEach,
    objectEach: objectEach,
    lastForOf: lastForOf,
    lastEach: lastEach,
    lastForEach: lastArrayEach,
    lastArrayEach: lastArrayEach,
    lastObjectEach: lastObjectEach,
    groupBy: groupBy,
    countBy: countBy,
    objectMap: objectMap,
    clone: clone,
    delay: delay,
    bind: bind,
    once: once,
    after: after,
    before: before,
    clear: clearObject,
    remove: removeObject,
    range: range,
    throttle: throttle,
    debounce: debounce,
    destructuring: destructuring
  }

  /* eslint-disable valid-typeof */
  function isBrowseStorage (storage) {
    try {
      var testKey = '__xe_t'
      storage.setItem(testKey, 1)
      storage.removeItem(testKey)
      return true
    } catch (e) {
      return false
    }
  }

  /**
    * 获取浏览器内核
    * @return Object
    */
  function browse () {
    var $body
    var $dom
    var strUndefined = 'undefined'
    var result = {
      isNode: false,
      isMobile: false,
      isPC: false,
      isLocalStorage: false,
      isSessionStorage: false,
      isDoc: typeof document !== strUndefined
    }
    if (typeof window === strUndefined && typeof process !== strUndefined) {
      result.isNode = true
    } else {
      result.isMobile = /(Android|webOS|iPhone|iPad|iPod|SymbianOS|BlackBerry|Windows Phone)/.test(navigator.userAgent)
      result.isPC = !result.isMobile
      result.isLocalStorage = isBrowseStorage(window.localStorage)
      result.isSessionStorage = isBrowseStorage(window.sessionStorage)
      if (result.isDoc) {
        $dom = document
        $body = $dom.body || $dom.documentElement
        baseExports.each(['webkit', 'khtml', 'moz', 'ms', 'o'], function (core) {
          result['-' + core] = !!$body[core + 'MatchesSelector']
        })
      }
    }
    return result
  }

  var browseExports = {
    browse: browse
  }

  var isBowseDoc = typeof document !== 'undefined'

  function toCookieUnitTime (unit, expires) {
    var num = parseFloat(expires)
    var nowdate = new Date()
    var time = nowdate.getTime()
    switch (unit) {
      case 'y': return dateExports.getWhatYear(nowdate, num).getTime()
      case 'M': return dateExports.getWhatMonth(nowdate, num).getTime()
      case 'd': return dateExports.getWhatDay(nowdate, num).getTime()
      case 'h':
      case 'H': return time + num * 60 * 60 * 1000
      case 'm': return time + num * 60 * 1000
      case 's': return time + num * 1000
    }
    return time
  }

  function toCookieUTCString (date) {
    return (baseExports.isDate(date) ? date : new Date(date)).toUTCString()
  }

  /**
    * cookie操作函数
    * @param {String/Array/Object} name 键/数组/对象
    * @param {String} value 值
    * @param {Object} options 参数
    *   @param {String} name: 键
    *   @param {Object} value: 值
    *   @param {String} path: 路径
    *   @param {String} domain: 作用域
    *   @param {Boolean} secure: 设置为安全的,只能用https协议
    *   @param {Number} expires: 过期时间,可以指定日期或者字符串，默认天
    */
  function cookie (name, value, options) {
    if (isBowseDoc) {
      var opts
      var expires
      var values
      var result
      var cookies
      var keyIndex
      var inserts = []
      var args = arguments
      var decode = decodeURIComponent
      var encode = encodeURIComponent
      var $dom = document
      var arrayEach = baseExports.each
      var objectAssign = baseExports.assign
      var isObject = baseExports.isObject
      if (this && this.$context) {
        this.$context = null
      }
      if (baseExports.isArray(name)) {
        inserts = name
      } else if (args.length > 1) {
        inserts = [objectAssign({ name: name, value: value }, options)]
      } else if (isObject(name)) {
        inserts = [name]
      }
      if (inserts.length > 0) {
        arrayEach(inserts, function (obj) {
          opts = objectAssign({}, setupDefaults.cookies, obj)
          values = []
          if (opts.name) {
            expires = opts.expires
            values.push(encode(opts.name) + '=' + encode(isObject(opts.value) ? JSON.stringify(opts.value) : opts.value))
            if (expires) {
              if (isNaN(expires)) {
                // UTCString || Unit
                expires = expires.replace(/^([0-9]+)(y|M|d|H|h|m|s)$/, function (text, num, unit) {
                  return toCookieUTCString(toCookieUnitTime(unit, num))
                })
              } else if (/^[0-9]{11,13}$/.test(expires) || baseExports.isDate(expires)) {
                // Date || now
                expires = toCookieUTCString(expires)
              } else {
                // day
                expires = toCookieUTCString(toCookieUnitTime('d', expires))
              }
              opts.expires = expires
            }
            arrayEach(['expires', 'path', 'domain', 'secure'], function (key) {
              if (opts[key] !== undefined) {
                values.push(opts[key] && key === 'secure' ? key : (key + '=' + opts[key]))
              }
            })
          }
          $dom.cookie = values.join('; ')
        })
        return true
      } else {
        result = {}
        cookies = $dom.cookie
        if (cookies) {
          arrayEach(cookies.split('; '), function (val) {
            keyIndex = val.indexOf('=')
            result[decode(val.substring(0, keyIndex))] = decode(val.substring(keyIndex + 1) || '')
          })
        }
        return args.length === 1 ? result[name] : result
      }
    }
    return false
  }

  function isCookieKey (key) {
    return baseExports.includes(cookieKeys(), key)
  }

  function setCookieItem (name, key, options) {
    cookie(name, key, options)
    return cookie
  }

  function removeCookieItem (name, options) {
    cookie(name, 0, baseExports.assign({ expires: -1 }, setupDefaults.cookies, options))
  }

  function cookieKeys () {
    return baseExports.keys(cookie())
  }

  baseExports.assign(cookie, {
    _c: false,
    isKey: isCookieKey,
    set: setCookieItem,
    setItem: setCookieItem,
    get: cookie,
    getItem: cookie,
    remove: removeCookieItem,
    removeItem: removeCookieItem,
    keys: cookieKeys,
    getJSON: cookie
  })

  var cookieExports = {
    cookie: cookie
  }

  var DAY_TIME = 86400000
  var WEEK_TIME = DAY_TIME * 7
  var STRING_FIRST = 'first'
  var STRING_LAST = 'last'

  /**
   * 返回当前时间戳
   *
   * @returns Number
   */
  var now = Date.now || function () {
    return getDateTime(new Date())
  }

  /**
   * 将日期格式化为时间戳
   *
    * @param {String/Number/Date} str 日期或数字
    * @param {String} format 解析日期格式
   * @returns Number
   */
  var timestamp = function (date, format) {
    return date ? getDateTime(toStringDate(date, format)) : now()
  }

  var dateFormatRules = [
    { rules: [['yyyy', 4], ['yy', 2]] },
    { rules: [['MM', 2], ['M', 1]], offset: -1 },
    { rules: [['dd', 2], ['d', 1]] },
    { rules: [['HH', 2], ['H', 1]] },
    { rules: [['mm', 2], ['m', 1]] },
    { rules: [['ss', 2], ['s', 1]] },
    { rules: [['SSS', 3], ['SS', 2], ['S', 1]] }
  ]

  function getDateTime (date) {
    return date.getTime()
  }

  function _dateFullYear (date) {
    return date.getFullYear()
  }

  function _dateMonth (date) {
    return date.getMonth()
  }

  /**
   * 比较两个日期
   *
   * @param {Number/String/Date} date1 日期
   * @param {Number/String/Date} date2 日期
   * @param {String} format 格式化
   */
  function isDateSame (date1, date2, format) {
    if (date1 && date2) {
      return toDateString(date1, format) === toDateString(date2, format)
    }
    return false
  }

  /**
    * 字符串转为日期
    *
    * @param {String/Number/Date} str 日期或数字
    * @param {String} format 解析日期格式(yyyy年份、MM月份、dd天、hh(12)HH(24)小时、mm分钟、ss秒、SSS毫秒)
    * @return {String}
    */
  function toStringDate (str, format) {
    var arr
    var sIndex
    var index
    var rules
    var len
    var rest
    var isDate
    var dates = []
    if (str) {
      isDate = baseExports.isDate(str)
      if (isDate || /^[0-9]{11,13}$/.test(str)) {
        rest = new Date(isDate ? getDateTime(str) : str)
      } else if (baseExports.isString(str)) {
        format = format || setupDefaults.formatDate
        baseExports.each(dateFormatRules, function (item) {
          for (index = 0, rules = item.rules, len = rules.length; index < len; index++) {
            arr = rules[index]
            sIndex = format.indexOf(arr[0])
            if (sIndex > -1) {
              dates.push(parseFloat(str.substring(sIndex, sIndex + arr[1]) || 0) + (item.offset || 0))
              break
            } else if (index === len - 1) {
              dates.push(0)
            }
          }
        })
        rest = new Date(dates[0], dates[1], dates[2], dates[3], dates[4], dates[5], dates[6])
      }
    }
    return !rest || isNaN(getDateTime(rest)) ? 'Invalid Date' : rest
  }

  function handleCustomTemplate (date, formats, match, value) {
    var format = formats[match]
    if (format) {
      if (baseExports.isFunction(format)) {
        return format(value, match, date)
      } else {
        return format[value]
      }
    }
    return value
  }

  function formatPadStart (str, len, padStr) {
    str = '' + str
    var index = str.length
    while (index < len) {
      str = padStr + str
      index++
    }
    return str
  }

  /**
    * 日期格式化为字符串
    *
    * @param {Date} date 日期或数字
    * @param {String} format 输出日期格式(年份(yy|yyyy)、月份(M|MM自动补0)、天(d|dd自动补0)、12小时制(h|hh自动补0)、24小时制(H|HH自动补0)、分钟(m|mm自动补0)、秒(s|ss自动补0)、毫秒(S|SSS自动补0)、D当年的第几天、a/A上午下午、e/E星期几、w当年的第几周、W当月的第几周、q当年第几个季度、z时区、Z时区值)
    * @param {Object} options {formats: {q: ['日', '一', '二', '三', '四', '五', '六'], E: function (value, match, date) {return '三'}, }} 自定义格式化模板
    * @return {String}
    */
  function toDateString (date, format, options) {
    if (date) {
      date = toStringDate(date)
      if (baseExports.isDate(date)) {
        var result = format || setupDefaults.formatString
        var hours = date.getHours()
        var apm = hours < 12 ? 'am' : 'pm'
        var zoneHours = date.getTimezoneOffset() / 60 * -1
        var formats = baseExports.assign({}, setupDefaults.formatStringMatchs, options ? options.formats : null)
        var timeRules = [
          [/y{2,4}/g, '', function (match) { return ('' + _dateFullYear(date)).substr(4 - match.length) }],
          [/M{1,2}/g, _dateMonth(date) + 1],
          [/d{1,2}/g, date.getDate()],
          [/H{1,2}/g, hours],
          [/h{1,2}/g, hours <= 12 ? hours : hours - 12],
          [/m{1,2}/g, date.getMinutes()],
          [/s{1,2}/g, date.getSeconds()],
          [/S{1,3}/g, date.getMilliseconds()],
          [/a/g, '', function (match) { return handleCustomTemplate(date, formats, match, apm) }],
          [/A/g, '', function (match) { return handleCustomTemplate(date, formats, match, apm.toLocaleUpperCase()) }],
          [/z/g, '', function (match) { return handleCustomTemplate(date, formats, match, 'GMT') }],
          [/e/g, '', function (match) { return handleCustomTemplate(date, formats, match, date.getDay() - 1) }],
          [/E/g, '', function (match) { return handleCustomTemplate(date, formats, match, date.getDay()) }],
          [/q/g, '', function (match) { return handleCustomTemplate(date, formats, match, Math.floor((_dateMonth(date) + 3) / 3)) }],
          [/Z/g, '', function (match) { return handleCustomTemplate(date, formats, match, (zoneHours >= 0 ? '+' : '-') + formatPadStart(zoneHours, 2, 0) + '00') }],
          [/W/g, '', function (match) { return handleCustomTemplate(date, formats, match, getMonthWeek(date)) }],
          [/w/g, '', function (match) { return handleCustomTemplate(date, formats, match, getYearWeek(date)) }],
          [/D/g, '', function (match) { return handleCustomTemplate(date, formats, match, getYearDay(date)) }]
        ]
        var item
        var index = 0
        var len = timeRules.length
        for (; index < len; index++) {
          item = timeRules[index]
          result = result.replace(item[0], item[2] || function (match) {
            return formatPadStart(item[1], match.length, '0')
          })
        }
        return result
      }
      return date
    }
    return ''
  }

  /**
    * 返回前几年或后几年的日期
    *
    * @param {Date} date 日期或数字
    * @param {Number} year 年(默认当前年)、前几个年(数值)、后几个年(数值)
    * @param {Number/String} month 获取哪月(null默认当前年)、年初(first)、年末(last)、指定月份（0-11）
    * @return {Date}
    */
  function getWhatYear (date, year, month) {
    var number
    var currentDate = toStringDate(date)
    if (baseExports.isDate(currentDate)) {
      if (year) {
        number = year && !isNaN(year) ? year : 0
        currentDate.setFullYear(_dateFullYear(currentDate) + number)
      }
      if (month || !isNaN(month)) {
        if (month === STRING_FIRST) {
          return new Date(_dateFullYear(currentDate), 0, 1)
        } else if (month === STRING_LAST) {
          currentDate.setMonth(11)
          return getWhatMonth(currentDate, 0, STRING_LAST)
        } else {
          currentDate.setMonth(month)
        }
      }
    }
    return currentDate
  }

  /**
    * 返回前几月或后几月的日期
    *
    * @param {Date} date 日期或数字
    * @param {Number} month 月(默认当前月)、前几个月、后几个月
    * @param {Number/String} day 获取哪天(null默认当前天)、月初(first)、月末(last)、指定天数(数值)
    * @return {Date}
    */
  function getWhatMonth (date, month, day) {
    var currentDate = toStringDate(date)
    var monthOffset = month && !isNaN(month) ? month : 0
    if (baseExports.isDate(currentDate)) {
      if (day || !isNaN(day)) {
        if (day === STRING_FIRST) {
          return new Date(_dateFullYear(currentDate), _dateMonth(currentDate) + monthOffset, 1)
        } else if (day === STRING_LAST) {
          return new Date(getDateTime(getWhatMonth(currentDate, monthOffset + 1, STRING_FIRST)) - 1)
        } else {
          currentDate.setDate(day)
        }
      }
      if (monthOffset) {
        currentDate.setMonth(_dateMonth(currentDate) + monthOffset)
      }
    }
    return currentDate
  }

  /**
    * 返回前几周或后几周的星期几
    *
    * @param {Date} date 日期
    * @param {Number} week 周(默认当前周)、前几周、后几周
    * @param {Number} day 星期天(默认0)、星期一(1)、星期二(2)、星期三(3)、星期四(4)、星期五(5)、星期六(6)
    * @return {Date}
    */
  function getWhatWeek (date, week, day) {
    var time
    var whatDayTime
    var currentDay
    var customDay
    var currentDate = toStringDate(date)
    if (baseExports.isDate(currentDate)) {
      customDay = Number(/^[0-7]$/.test(day) ? day : currentDate.getDay())
      currentDay = currentDate.getDay()
      time = getDateTime(currentDate)
      whatDayTime = time + ((customDay === 0 ? 7 : customDay) - (currentDay === 0 ? 7 : currentDay)) * DAY_TIME
      if (week && !isNaN(week)) {
        whatDayTime += week * WEEK_TIME
      }
      return new Date(whatDayTime)
    }
    return currentDate
  }

  /**
    * 返回前几天或后几天的日期
    *
    * @param {Date} date 日期或数字
    * @param {Number} day 天(默认当天)、前几天、后几天
    * @param {String} mode 获取时分秒(null默认当前时分秒)、日初(first)、日末(last)
    * @return {Date}
    */
  function getWhatDay (date, day, mode) {
    var currentDate = toStringDate(date)
    if (baseExports.isDate(currentDate) && !isNaN(day)) {
      currentDate.setDate(currentDate.getDate() + Number(day))
      if (mode === STRING_FIRST) {
        return new Date(_dateFullYear(currentDate), _dateMonth(currentDate), currentDate.getDate())
      } else if (mode === STRING_LAST) {
        return new Date(getDateTime(getWhatDay(currentDate, 1, STRING_FIRST)) - 1)
      }
    }
    return currentDate
  }

  function calculateTime (startDate, endDate, timeGap) {
    return Math.floor((getDateTime(new Date(_dateFullYear(endDate), _dateMonth(endDate), endDate.getDate())) - getDateTime(new Date(_dateFullYear(startDate), _dateMonth(startDate), startDate.getDate()))) / timeGap) + 1
  }

  /**
    * 返回某个月的第几周
    *
    * @param {Date} date 日期或数字
    * @return {Number}
    */
  function getMonthWeek (date) {
    var monthFirst
    var monthFirstWeek
    var currentDate = toStringDate(date)
    if (baseExports.isDate(currentDate)) {
      monthFirst = getWhatMonth(currentDate, 0, STRING_FIRST)
      monthFirstWeek = getWhatWeek(monthFirst, 0, 1)
      if (monthFirstWeek < monthFirst) {
        monthFirstWeek = getWhatWeek(monthFirst, 1, 1)
      }
      if (currentDate >= monthFirstWeek) {
        return calculateTime(monthFirstWeek, currentDate, WEEK_TIME)
      }
      return 0
    }
    return currentDate
  }

  /**
    * 返回某个年份的第几天
    *
    * @param {Date} date 日期或数字
    * @return {Number}
    */
  function getYearDay (date) {
    var currentDate = toStringDate(date)
    if (baseExports.isDate(currentDate)) {
      return calculateTime(getWhatYear(currentDate, 0, STRING_FIRST), currentDate, DAY_TIME)
    }
    return currentDate
  }

  /**
    * 返回某个年份的第几周
    *
    * @param {Date} date 日期或数字
    * @return {Number}
    */
  function getYearWeek (date) {
    var currentDate = toStringDate(date)
    if (baseExports.isDate(currentDate)) {
      var yearFirst = getWhatYear(currentDate, 0, STRING_FIRST)
      var yearFirstWeek = getWhatWeek(yearFirst, 0, 1)
      if (yearFirstWeek < yearFirst) {
        yearFirstWeek = getWhatWeek(yearFirst, 1, 1)
      }
      if (currentDate >= yearFirstWeek) {
        return calculateTime(yearFirstWeek, currentDate, WEEK_TIME)
      }
      return 0
    }
    return currentDate
  }

  /**
    * 返回某个年份的天数
    *
    * @param {Date} date 日期或数字
    * @param {Number} year 年(默认当年)、前几个年、后几个年
    * @return {Number}
    */
  function getDayOfYear (date, year) {
    var currentDate = toStringDate(date)
    if (baseExports.isDate(currentDate)) {
      return baseExports.isLeapYear(getWhatYear(currentDate, year)) ? 366 : 365
    }
    return currentDate
  }

  /**
    * 返回某个月份的天数
    *
    * @param {Date} date 日期或数字
    * @param {Number} month 月(默认当月)、前几个月、后几个月
    * @return {Number}
    */
  function getDayOfMonth (date, month) {
    var currentDate = toStringDate(date)
    if (baseExports.isDate(currentDate)) {
      return Math.floor((getDateTime(getWhatMonth(currentDate, month, STRING_LAST)) - getDateTime(getWhatMonth(currentDate, month, STRING_FIRST))) / DAY_TIME) + 1
    }
    return currentDate
  }

  /**
    * 返回两个日期之间差距,如果结束日期小于开始日期done为fasle
    *
    * @param {Date} startDate 开始日期
    * @param {Date} endDate 结束日期或当期日期
    * @param {Date} rule 自定义计算规则
    * @return {Object}
    */
  function getDateDiff (startDate, endDate, rules) {
    var startTime
    var endTime
    var item
    var diffTime
    var rule
    var len
    var index
    var result = { done: false, time: 0 }
    startDate = toStringDate(startDate)
    endDate = endDate ? toStringDate(endDate) : new Date()
    if (baseExports.isDate(startDate) && baseExports.isDate(endDate)) {
      startTime = getDateTime(startDate)
      endTime = getDateTime(endDate)
      if (startTime < endTime) {
        diffTime = result.time = endTime - startTime
        rule = rules && rules.length > 0 ? rules : setupDefaults.dateDiffRules
        result.done = true
        for (index = 0, len = rule.length; index < len; index++) {
          item = rule[index]
          if (diffTime >= item[1]) {
            if (index === len - 1) {
              result[item[0]] = diffTime || 0
            } else {
              result[item[0]] = Math.floor(diffTime / item[1])
              diffTime -= result[item[0]] * item[1]
            }
          } else {
            result[item[0]] = 0
          }
        }
      }
    }
    return result
  }

  var dateExports = {
    now: now,
    timestamp: timestamp,
    isDateSame: isDateSame,
    toStringDate: toStringDate,
    toDateString: toDateString,
    getWhatYear: getWhatYear,
    getWhatMonth: getWhatMonth,
    getWhatWeek: getWhatWeek,
    getWhatDay: getWhatDay,
    getYearDay: getYearDay,
    getYearWeek: getYearWeek,
    getMonthWeek: getMonthWeek,
    getDayOfYear: getDayOfYear,
    getDayOfMonth: getDayOfMonth,
    getDateDiff: getDateDiff
  }

  var $locat = typeof location === 'undefined' ? 0 : location
  var decode = decodeURIComponent
  var encode = encodeURIComponent

  function parseURLQuery (uri) {
    return parseParams(uri.split('?')[1] || '')
  }

  /**
   * 查询参数序列化
   *
   * @param {String} query 反序列化的字符串
   */
  function parseParams (str) {
    var items
    var result = {}
    if (str) {
      baseExports.each(str.split('&'), function (param) {
        items = param.split('=')
        result[decode(items[0])] = decode(items[1] || '')
      })
    }
    return result
  }

  function stringifyParams (resultVal, resultKey, isArr) {
    var _arr
    var result = []
    baseExports.each(resultVal, function (item, key) {
      _arr = baseExports.isArray(item)
      if (baseExports.isPlainObject(item) || _arr) {
        result = result.concat(stringifyParams(item, resultKey + '[' + key + ']', _arr))
      } else {
        result.push(encode(resultKey + '[' + (isArr ? '' : key) + ']') + '=' + encode(item === null ? '' : item))
      }
    })
    return result
  }

  function getLocatOrigin () {
    return $locat ? ($locat.origin || ($locat.protocol + '//' + $locat.host)) : ''
  }

  function getBaseURL () {
    if ($locat) {
      var pathname = $locat.pathname
      var lastIndex = baseExports.lastIndexOf(pathname, '/') + 1
      return getLocatOrigin() + (lastIndex === pathname.length ? pathname : pathname.substring(0, lastIndex))
    }
    return ''
  }

  function parseUrl (url) {
    var hashs
    var portText
    var searchs
    var parsed
    var href = '' + url
    if (href.indexOf('//') === 0) {
      href = ($locat ? $locat.protocol : '') + href
    } else if (href.indexOf('/') === 0) {
      href = getLocatOrigin() + href
    }
    searchs = href.replace(/#.*/, '').match(/(\?.*)/)
    parsed = {
      href: href,
      hash: '',
      host: '',
      hostname: '',
      protocol: '',
      port: '',
      search: searchs && searchs[1] && searchs[1].length > 1 ? searchs[1] : ''
    }
    parsed.path = href.replace(/^([a-z0-9.+-]*:)\/\//, function (text, protocol) {
      parsed.protocol = protocol
      return ''
    }).replace(/^([a-z0-9.+-]*)(:\d+)?\//, function (text, hostname, port) {
      portText = port || ''
      parsed.port = portText.replace(':', '')
      parsed.hostname = hostname
      parsed.host = hostname + portText
      return '/'
    }).replace(/(#.*)/, function (text, hash) {
      parsed.hash = hash.length > 1 ? hash : ''
      return ''
    })
    hashs = parsed.hash.match(/#((.*)\?|(.*))/)
    parsed.pathname = parsed.path.replace(/(\?|#.*).*/, '')
    parsed.origin = parsed.protocol + '//' + parsed.host
    parsed.hashKey = hashs ? (hashs[2] || hashs[1] || '') : ''
    parsed.hashQuery = parseURLQuery(parsed.hash)
    parsed.searchQuery = parseURLQuery(parsed.search)
    return parsed
  }

  /**
    * 获取地址栏信息
    *
    * @return Object
    */
  function locat () {
    return $locat ? parseUrl($locat.href) : {}
  }

  /**
   * 查询参数序列化
   *
   * @param {Object} query 序列化的对象
   */
  function serialize (query) {
    var _arr
    var params = []
    baseExports.each(query, function (item, key) {
      if (item !== undefined) {
        _arr = baseExports.isArray(item)
        if (baseExports.isPlainObject(item) || _arr) {
          params = params.concat(stringifyParams(item, key, _arr))
        } else {
          params.push(encode(key) + '=' + encode(item === null ? '' : item))
        }
      }
    })
    return params.join('&').replace(/%20/g, '+')
  }

  var locatExports = {
    parseUrl: parseUrl,
    getBaseURL: getBaseURL,
    locat: locat,
    serialize: serialize,
    unserialize: parseParams
  }

  /**
    * 获取一个指定范围内随机数
    *
    * @param {Number} min 最小值
    * @param {Number} max 最大值
    * @return {Number}
    */
  function getRandom (min, max) {
    return min >= max ? min : ((min = min >> 0) + Math.round(Math.random() * ((max || 9) - min)))
  }

  function createMinMax (handle) {
    return function (arr, iterate) {
      var context = this
      var list = baseExports.clone(arr)
      var arraySort = XEUtils.sortBy
      if (baseExports.isFunction(iterate)) {
        return handle(arraySort(XEUtils.map(list, function (val, index) {
          return {
            d: val,
            v: iterate.call(context, val, index, list)
          }
        }), 'v')).d
      }
      return handle(arraySort(list, iterate))
    }
  }

  /**
    * 获取最小值
    *
    * @param {Array} arr 数组
    * @param {Function} iterate(item, index, obj) 回调
    * @return {Number}
    */
  var arrayMin = createMinMax(function (result) {
    return result[0]
  })

  /**
    * 获取最大值
    *
    * @param {Array} arr 数组
    * @param {Function} iterate(item, index, obj) 回调
    * @return {Number}
    */
  var arrayMax = createMinMax(function (result) {
    return result.reverse()[0]
  })

  /**
    * 千分位分隔符、小数点
    *
    * @param {String/Number} num 数值
    * @param {Object} 参数 {spaceNumber: 分割位数(默认3), separator: 分隔符(默认,), fixed: 小数位数(默认null)}
    * @return {String}
   */
  function commafy (num, options) {
    num = ('' + num).replace(/,/g, '')
    if (num) {
      var opts = baseExports.assign({ spaceNumber: 3, separator: ',' }, options)
      var optFixed = opts.fixed
      var result = (optFixed ? stringToNumber(num).toFixed(optFixed) : num).split('.')
      return result[0].replace(new RegExp('(?=(?!(\\b))(\\d{' + opts.spaceNumber + '})+$)', 'g'), opts.separator) + (result[1] ? '.' + result[1] : '')
    }
    return num
  }

  function createToNumber (handle) {
    return function (str) {
      if (str) {
        var num = handle(str)
        return isNaN(num) ? 0 : num
      }
      return 0
    }
  }

  /**
   * 和 Number.toFixed 类似，区别就是不会对小数进行四舍五入，结果返回字符串
   *
   * @param { String/Number } str 数值
   * @return {String}
   */
  function toFixedString (str, digits) {
    var nums = ('' + toFixedNumber(str, digits)).split('.')
    return digits ? [nums[0], '.', XEUtils.padEnd(nums[1] || '', digits, '0')].join('') : nums[0]
  }

  /**
   * 和 Number.toFixed 类似，区别就是不会对小数进行四舍五入，结果返回数值
   *
   * @param { String/Number } str 数值
   * @return {String}
   */
  function toFixedNumber (str, digits) {
    if (digits) {
      return stringToNumber(('' + stringToNumber(str)).replace(new RegExp('(\\d+.\\d{0,' + digits + '}).*'), '$1'))
    }
    return stringToInteger(str)
  }

  /**
   * 转数值
   * @param { String/Number } str 数值
   *
   * @return {Number}
   */
  var stringToNumber = createToNumber(parseFloat)

  /**
   * 转整数
   * @param { String/Number } str 数值
   *
   * @return {Number}
   */
  var stringToInteger = createToNumber(parseInt)

  var numberExports = {
    random: getRandom,
    min: arrayMin,
    max: arrayMax,
    commafy: commafy,
    toFixedString: toFixedString,
    toFixedNumber: toFixedNumber,
    toNumber: stringToNumber,
    toInteger: stringToInteger
  }

  /**
    * 去除字符串左右两边的空格
    *
    * @param {String} str 字符串
    * @return {String}
    */
  function stringTrim (str) {
    return str && str.trim ? str.trim() : stringTrimRight(stringTrimLeft(str))
  }

  /**
    * 去除字符串左边的空格
    *
    * @param {String} str 字符串
    * @return {String}
    */
  function stringTrimLeft (str) {
    return str && str.trimLeft ? str.trimLeft() : ('' + str).replace(/^[\s\uFEFF\xA0]+/g, '')
  }

  /**
    * 去除字符串右边的空格
    *
    * @param {String} str 字符串
    * @return {String}
    */
  function stringTrimRight (str) {
    return str && str.trimRight ? str.trimRight() : ('' + str).replace(/[\s\uFEFF\xA0]+$/g, '')
  }

  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  }

  var unescapeMap = {}
  baseExports.each(escapeMap, function (item, key) {
    unescapeMap[escapeMap[key]] = key
  })

  function formatEscaper (dataMap) {
    var replaceRegexp = new RegExp('(?:' + baseExports.keys(dataMap).join('|') + ')', 'g')
    return function (str) {
      return ('' + str).replace(replaceRegexp, function (match) {
        return dataMap[match]
      })
    }
  }

  /**
    * 转义HTML字符串，替换&, <, >, ", ', `字符
    *
    * @param {String} str 字符串
    * @return {String}
    */
  var escape = formatEscaper(escapeMap)

  /**
    * 反转escape
    *
    * @param {String} str 字符串
    * @return {String}
    */
  var unescape = formatEscaper(unescapeMap)

  /**
    * 将带字符串转成驼峰字符串,例如： project-name 转为 projectName
    *
    * @param {String} str 字符串
    * @return {String}
    */
  function camelCase (str) {
    return ('' + str).replace(/(-[a-zA-Z])/g, function (text, u) {
      return u.substring(1).toLocaleUpperCase()
    })
  }

  /**
    * 将带驼峰字符串转成字符串,例如： projectName 转为 project-name
    *
    * @param {String} str 字符串
    * @return {String}
    */
  function kebabCase (str) {
    return ('' + str).replace(/([A-Z])/g, function (text, u) {
      return '-' + u.toLowerCase()
    })
  }

  /**
    * 将字符串重复 n次
    *
    * @param {String} str 字符串
    * @param {Number} count 次数
    * @return {String}
    */
  function stringRepeat (str, count) {
    var rest = '' + str
    if (str.repeat) {
      return str.repeat(count)
    }
    var list = isNaN(count) ? [] : new Array(parseInt(count))
    return list.join(rest) + (list.length > 0 ? rest : '')
  }

  /**
    * 用指定字符从前面开始补全字符串
    *
    * @param {String} str 字符串
    * @param {Number} targetLength 结果长度
    * @param {Number} padString 补全字符
    * @return {String}
    */
  function stringPadStart (str, targetLength, padString, UNDEFINED) {
    var rest = '' + str
    targetLength = targetLength >> 0
    padString = padString === UNDEFINED ? ' ' : '' + padString
    if (rest.padStart) {
      return rest.padStart(targetLength, padString)
    }
    if (targetLength > rest.length) {
      targetLength -= rest.length
      if (targetLength > padString.length) {
        padString += stringRepeat(padString, targetLength / padString.length)
      }
      return padString.slice(0, targetLength) + rest
    }
    return rest
  }

  /**
    * 用指定字符从后面开始补全字符串
    *
    * @param {String} str 字符串
    * @param {Number} targetLength 结果长度
    * @param {Number} padString 补全字符
    * @return {String}
    */
  function stringPadEnd (str, targetLength, padString, UNDEFINED) {
    var rest = '' + str
    targetLength = targetLength >> 0
    padString = padString === UNDEFINED ? ' ' : '' + padString
    if (rest.padEnd) {
      return rest.padEnd(targetLength, padString)
    }
    if (targetLength > rest.length) {
      targetLength -= rest.length
      if (targetLength > padString.length) {
        padString += stringRepeat(padString, targetLength / padString.length)
      }
      return rest + padString.slice(0, targetLength)
    }
    return rest
  }

  /**
    * 判断字符串是否在源字符串的头部
    *
    * @param {String} str 字符串
    * @param {String/Number} val 值
    * @param {Number} startIndex 开始索引
    * @return {String}
    */
  function stringStartsWith (str, val, startIndex) {
    var rest = '' + str
    return (arguments.length === 1 ? rest : rest.substring(startIndex)).indexOf(val) === 0
  }

  /**
    * 判断字符串是否在源字符串的尾部
    *
    * @param {String} str 字符串
    * @param {String/Number} val 值
    * @param {Number} startIndex 开始索引
    * @return {String}
    */
  function stringEndsWith (str, val, startIndex) {
    var rest = '' + str
    return arguments.length === 1 ? rest.indexOf(val) === rest.length - 1 : rest.substring(0, startIndex).indexOf(val) === startIndex - 1
  }

  var stringExports = {
    trim: stringTrim,
    trimLeft: stringTrimLeft,
    trimRight: stringTrimRight,
    escape: escape,
    unescape: unescape,
    camelCase: camelCase,
    kebabCase: kebabCase,
    repeat: stringRepeat,
    padStart: stringPadStart,
    padEnd: stringPadEnd,
    startsWith: stringStartsWith,
    endsWith: stringEndsWith
  }

  var methodExports = {}

  baseExports.assign(
    methodExports,
    arrayExports,
    baseExports,
    browseExports,
    cookieExports,
    dateExports,
    locatExports,
    numberExports,
    stringExports
  )

  /**
   * functions of mixing
   *
   * @param {Object} methods
   */
  XEUtils.mixin = function (methods) {
    methodExports.each(methods, function (fn, name) {
      XEUtils[name] = methodExports.isFunction(fn) && fn._c !== false ? function () {
        var result = fn.apply(XEUtils.$context, arguments)
        XEUtils.$context = null
        return result
      } : fn
    })
    return XEUtils
  }

  XEUtils.setup = function (options) {
    methodExports.assign(setupDefaults, options)
  }

  XEUtils.mixin(methodExports)

  return XEUtils
}))
