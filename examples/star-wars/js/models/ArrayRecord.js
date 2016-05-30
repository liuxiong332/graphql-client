
import { KeyedIterable } from './Iterable'
import { IndexedCollection } from './Collection'
import { List, Iterable } from 'immutable'
import { Map, MapPrototype, emptyMap } from './Map'
import { DELETE } from './TrieUtils'

import invariant from './utils/invariant'

class ArrayRecord extends IndexedCollection {
  constructor(values) {
    if (values instanceof ArrayRecord) {
      return values;
    }
    if (!(this instanceof ArrayRecord)) {
      return new ArrayRecord(values);
    }
    this._list = List(values);
  }

  toString() {
    return this.__toString(recordName(this) + ' {', '}');
  }

  // @pragma Access

  get(index, notSetValue) {
    return this._list.get(index, notSetValue);
  }

  // @pragma Modification

  set(k, v) {
    var newList = this._list.set(k, v);
    if (this.__ownerID || newList === this._list) {
      return this;
    }
    return makeRecord(this, newList);
  }

  clear() {
    if (this.__ownerID) {
      this._list && this._list.clear();
      return this;
    }
    var RecordType = this.constructor;
    return RecordType._empty || (RecordType._empty = makeRecord(this, List()));
  }

  remove(index) {
    var newList = this._list && this._list.remove(index);
    if (this.__ownerID || newList === this._list) {
      return this;
    }
    return makeRecord(this, newList);
  }

  insert(index, value) {
    return makeRecord(this, this._list.insert(index, value));
  }

  push(/*...values*/) {
    return makeRecord(this, this._list.push(arguments));
  }

  pop() {
    return makeRecord(this, this._list.pop());
  }

  unshift(/*...values*/) {
    return makeRecord(this, this._list.unshift(arguments));
  }

  shift() {
    return makeRecord(this, this._list.shift());
  }

  // @pragma Composition

  merge(/*...iters*/) {
    return makeRecord
  }

  mergeWith(merger, ...iters) {
    return mergeIntoListWith(this, merger, iters);
  }

  mergeDeep(/*...iters*/) {
    return mergeIntoListWith(this, deepMerger, arguments);
  }

  mergeDeepWith(merger, ...iters) {
    return mergeIntoListWith(this, deepMergerWith(merger), iters);
  }

  setSize(size) {
    return setListBounds(this, 0, size);
  }

  wasAltered() {
    return this._list.wasAltered();
  }

  // @pragma Iteration

  slice(begin, end) {
    return makeRecord(this._list.slice(begin, end));
  }

  __iterator(type, reverse) {
    return Iterable.Indexed(this._list).map((_, k) => this.get(k)).__iterator(type, reverse);
  }

  __iterate(fn, reverse) {
    return Iterable.Indexed(this._list).map((_, k) => this.get(k)).__iterate(fn, reverse);
  }

  __ensureOwner(ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    var newList = this._list && this._list.__ensureOwner(ownerID);
    if (!ownerID) {
      this.__ownerID = ownerID;
      this._list = newList;
      return this;
    }
    return makeRecord(this, newList, ownerID);
  }
}

var ArrayRecordPrototype = ArrayRecord.prototype;
var ListPrototype = List.prototype

ArrayRecordPrototype[DELETE] = ArrayRecordPrototype.remove;
ArrayRecordPrototype.get = ListPrototype.get;
ArrayRecordPrototype.deleteIn =
ArrayRecordPrototype.removeIn = MapPrototype.removeIn;
ArrayRecordPrototype.merge = MapPrototype.merge;
ArrayRecordPrototype.mergeWith = MapPrototype.mergeWith;
ArrayRecordPrototype.mergeIn = MapPrototype.mergeIn;
ArrayRecordPrototype.mergeDeep = MapPrototype.mergeDeep;
ArrayRecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
ArrayRecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
ArrayRecordPrototype.setIn = MapPrototype.setIn;
ArrayRecordPrototype.update = MapPrototype.update;
ArrayRecordPrototype.updateIn = MapPrototype.updateIn;
ArrayRecordPrototype.withMutations = MapPrototype.withMutations;
ArrayRecordPrototype.asMutable = MapPrototype.asMutable;
ArrayRecordPrototype.asImmutable = MapPrototype.asImmutable;


function makeRecord(likeRecord, list, ownerID) {
  var record = Object.create(Object.getPrototypeOf(likeRecord));
  record._list = list;
  record.__ownerID = ownerID;
  return record;
}

function recordName(record) {
  return record.constructor.name || 'Record';
}
