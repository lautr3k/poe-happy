const { app } = require("electron");
const path = require("path");
const fs = require("fs");

let state = null;

class Store {
  constructor(initialState = {}) {
    if (state === null) {
      state = initialState;
    } else if (initialState !== {}) {
      console.log("Warning: Store initialState can not be set twice.");
    }
    this.state = state;
  }

  has(key) {
    return key in this.state;
  }

  get(key, defaultValue = null) {
    if (this.has(key)) {
      return this.state[key];
    }
    return defaultValue;
  }

  set(key, value) {
    this.state[key] = value;
  }

  merge(key, value) {
    const oldValue = this.get(key, {});
    this.set(key, { ...oldValue, ...value });
  }

  delete(key) {
    delete this.state[key];
  }

  getFilePath() {
    return path.join(app.getPath("userData"), "state.json");
  }

  save() {
    try {
      const stateFile = this.getFilePath();
      const json = JSON.stringify(this.state, null, "  ");
      fs.writeFileSync(stateFile, json);
    } catch (error) {
      console.log("store.save.error", error);
    }
  }

  load(merge = true) {
    try {
      const stateFile = this.getFilePath();
      const json = fs.readFileSync(stateFile, "utf8");
      const data = JSON.parse(json);
      if (merge) {
        state = { ...state, ...data };
      } else {
        state = data;
      }
    } catch (e) {
      // skip error
    }
  }
}

module.exports = Store;
