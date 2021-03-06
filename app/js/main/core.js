const { globalShortcut } = require("electron");
const store = require("./store");
const i18n = require("./i18n");

class Core {
  constructor() {
    this.store = store;
    this.i18n = i18n;
    this.ui = {};
  }

  updateLanguage() {
    const language = require("./poe/getLanguage")();
    this.store.set("language", language);
    this.i18n.setLocale(language);
  }

  async updateLeagues() {
    const getLeagues = require("./poe/getLeagues");
    const leagues = await getLeagues();
    this.store.set("leagues", leagues);
    const league = this.store.get("league");
    if (!leagues.find(l => l.id === league)) {
      this.store.set("league", leagues[0].id);
      // TODO: notify league change to user
    }
  }

  showItemInfo() {
    require("./ui/showItem")();
  }

  registerShortcuts() {
    globalShortcut.unregisterAll();
    const shortcuts = this.store.get("shortcuts");
    Object.entries(shortcuts).forEach((item, id) => {
      globalShortcut.register(item[1], () => this[item[0]]());
    });
  }

  async init() {
    this.store.load();
    this.updateLanguage();
    await this.updateLeagues();
    this.ui = require("./ui");
    this.registerShortcuts();
  }

  quit() {
    this.store.save();
    globalShortcut.unregisterAll();
  }
}

const core = new Core();

module.exports = core;
