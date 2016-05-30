
import { List, Iterable, Collection } from 'immutable'

export default function ArrayRecord(values) {
  if (values instanceof ArrayRecord) {
    return values;
  }
  if (!(this instanceof ArrayRecord)) {
    return new ArrayRecord(values);
  }
  this._list = List(values);
}

var ArrayRecordPrototype = ArrayRecord.prototype =
  Object.create(Collection.Indexed.prototype);
ArrayRecordPrototype.constructor = ArrayRecord;

Object.assign(ArrayRecordPrototype, {
  toString() {
    return this.__toString(recordName(this) + ' {', '}');
  },

  // @pragma Access

  get(index, notSetValue) {
    return this._list.get(index, notSetValue);
  },

  // @pragma Modification

  set(k, v) {
    var newList = this._list.set(k, v);
    if (this.__ownerID || newList === this._list) {
      return this;
    }
    return makeRecord(this, newList);
  },

  clear() {
    if (this.__ownerID) {
      this._list && this._list.clear();
      return this;
    }
    var RecordType = this.constructor;
    return RecordType._empty || (RecordType._empty = makeRecord(this, List()));
  },

  remove(index) {
    var newList = this._list && this._list.remove(index);
    if (this.__ownerID || newList === this._list) {
      return this;
    }
    return makeRecord(this, newList);
  },

  insert(index, value) {
    var newList = this._list.insert(index, value);
    if (this.__ownerID) {
      return this;
    }
    return makeRecord(this, newList);
  },

  push(/*...values*/) {
    var newList = this._list.push(arguments);
    if (this.__ownerID) {
      return this;
    }
    return makeRecord(this, newList);
  },

  pop() {
    var newList = this._list.pop();
    if (this.__ownerID) {
      return this;
    }
    return makeRecord(this, newList);
  },

  unshift(/*...values*/) {
    var newList = this._list.unshift(arguments);
    if (this.__ownerID) {
      return this;
    }
    return makeRecord(this, newList);
  },

  shift() {
    var newList = this._list.shift();
    if (this.__ownerID) {
      return this;
    }
    return makeRecord(this, newList);
  },

  // @pragma Composition

  merge(/*...iters*/) {
    return makeRecord(this, this._list.merge(arguments));
  },

  mergeWith(merger, ...iters) {
    return makeRecord(this, this._list.mergeWith(merger, ...iters));
  },

  mergeDeep(/*...iters*/) {
    return makeRecord(this, this._list.mergeDeep(arguments));
  },

  mergeDeepWith(merger, ...iters) {
    return makeRecord(this, this._list.mergeDeepWith(merger, ...iters));
  },

  setSize(size) {
    return makeRecord(this, this._list.setSize(size));
  },

  wasAltered() {
    return this._list.wasAltered();
  },

  // @pragma Iteration

  slice(begin, end) {
    return makeRecord(this, this._list.slice(begin, end));
  },

  __iterator(type, reverse) {
    return this._list.__iterator(type, reverse);
  },

  __iterate(fn, reverse) {
    return this._list.__iterate(fn, reverse);
  },

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
  },
});

var ListPrototype = List.prototype;

ArrayRecordPrototype['delete'] = ArrayRecordPrototype.remove;
ArrayRecordPrototype.deleteIn =
ArrayRecordPrototype.removeIn = ListPrototype.removeIn;
ArrayRecordPrototype.merge = ListPrototype.merge;
ArrayRecordPrototype.mergeWith = ListPrototype.mergeWith;
ArrayRecordPrototype.mergeIn = ListPrototype.mergeIn;
ArrayRecordPrototype.mergeDeep = ListPrototype.mergeDeep;
ArrayRecordPrototype.mergeDeepWith = ListPrototype.mergeDeepWith;
ArrayRecordPrototype.mergeDeepIn = ListPrototype.mergeDeepIn;
ArrayRecordPrototype.setIn = ListPrototype.setIn;
ArrayRecordPrototype.update = ListPrototype.update;
ArrayRecordPrototype.updateIn = ListPrototype.updateIn;
ArrayRecordPrototype.withMutations = ListPrototype.withMutations;
ArrayRecordPrototype.asMutable = ListPrototype.asMutable;
ArrayRecordPrototype.asImmutable = ListPrototype.asImmutable;


function makeRecord(likeRecord, list, ownerID) {
  var record = Object.create(Object.getPrototypeOf(likeRecord));
  record._list = list;
  record.__ownerID = ownerID;
  return record;
}

function recordName(record) {
  return record.constructor.name || 'Record';
}
