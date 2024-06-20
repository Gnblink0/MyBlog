'use strict';

var obsidian = require('obsidian');

//此插件套改自obsidian-comments插件，蚕子于2022年3月19日。

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class CommentsSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: '注释插件说明' });
        new obsidian.Setting(containerEl)
            .setName('此插件套改自obsidian-comments插件')
            .setDesc("点击左侧按钮【打开注释面板】，点击注释文字可在笔记区跳转，按下Tab键切换窗口焦点后可以修改...");        
    }
}

const VIEW_TYPE_OB_ZHUSHI = 'ob_zhushi';
const DEFAULT_SETTINGS = {
    SHOW_RIBBON: true
};

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        let context = this;
        let args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = +setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
};

var 注释列表 = [];

class CommentsView extends obsidian.ItemView {
    constructor(leaf) {
        super(leaf);
        this.redraw_debounced = debounce(function () {
            this.redraw();
        }, 1000);
        this.redraw = this.redraw.bind(this);
        this.redraw_debounced = this.redraw_debounced.bind(this);
        this.containerEl = this.containerEl;
        this.registerEvent(this.app.workspace.on("layout-ready", this.redraw_debounced));
        this.registerEvent(this.app.workspace.on("file-open", this.redraw_debounced));
        this.registerEvent(this.app.workspace.on("quick-preview", this.redraw_debounced));
        this.registerEvent(this.app.workspace.on("editor-change", this.redraw));
        this.registerEvent(this.app.vault.on("delete", this.redraw));
    }
    getViewType() {
        return VIEW_TYPE_OB_ZHUSHI;
    }
    getDisplayText() {
        return "注释内容";
    }
    getIcon() {
        return "lines-of-text";
    }
    onClose() {
        return Promise.resolve();
    }
    onOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            this.redraw();
        });
    }
    redraw() {
        return __awaiter(this, void 0, void 0, function* () {
            let active_leaf = this.app.workspace.getActiveFile();
            this.containerEl.empty();
            this.containerEl.setAttribute('class', 'comment-panel');
            if (active_leaf) {
                let page_content = yield this.app.vault.read(active_leaf);
                let page_html = document.createElement('Div');
                page_html.innerHTML = page_content;
                let El = document.createElement("H4");
                El.setAttribute('class', 'comment-count');
                this.containerEl.appendChild(El);
                El.setText('共计' + 注释列表.length + '条注释内容，点击文本可跳转');
                for (let i = 0; i < 注释列表.length; i++) {
                    let div = document.createElement('Div');
                    div.setAttribute('class', 'comment-pannel-bubble');
                    let pEl = document.createElement("p");
                    pEl.setAttribute('class', 'comment-pannel-p1');
                    let showText = 注释列表[i];
                    let lineId = showText.replace(/\-.*$/,"");
                    showText = showText.replace(/^\d+\-/,"");
                    pEl.setText("➥ "+showText);
                    pEl.onclick = () => {
                        let view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                        if (!view)
                            return;
                        let editor = view.sourceMode.cmEditor;
                        let 目标行号 = Number(lineId);
                        editor.setSelection({line:目标行号,ch:2}, {line:目标行号,ch:showText.length+1});
                        this.app.commands.executeCommandById('editor:focus-left');
                    };
                    div.appendChild(pEl);
                    this.containerEl.appendChild(div);
                }
            }
        });
    }
}

class CommentsPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.showPanel = function () {
            this.app.workspace.getRightLeaf(true)
                .setViewState({ type: VIEW_TYPE_OB_ZHUSHI });
        };
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            console.log('Loaded Comments Plugin');
            this.addSettingTab(new CommentsSettingTab(this.app, this));
            this.registerEvent(this.app.workspace.on('file-open', (file) => {
                if (file) {
                    注释列表 = this.提取注释列表();
                }
            }));
            this.registerEvent(this.app.workspace.on('editor-change', (file) => {
                if (file) {
                    注释列表 = this.提取注释列表();
                }
            }));
            
            this.registerView(VIEW_TYPE_OB_ZHUSHI, (leaf) => this.view = new CommentsView(leaf));
            
            if (this.settings.SHOW_RIBBON) {
                this.addRibbonIcon('lines-of-text', "打开注释面板", (e) => this.showPanel());
            }
        });
    }

    onunload() {
        console.log('unloading plugin');
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }

    提取注释列表() {
        let txtList = [];
        let editor = this.获取编辑模式();
        let Value = this.获取笔记正文();
        if (!Value)
            return;
        const reg = /(?<=^\s*%%)[^%\n]+?(?=%%\s*$)/;
        let 末行行号 = editor.lastLine();
        for(var i= 0;i<末行行号;i++){
            var 本行文本 = editor.getLine(i);
            if(reg.test(本行文本)){
                txtList.push(i+"- "+本行文本.replace(/^\s*%%/,"").replace(/%%\s*$/,""));
            };
        }
        if(!txtList){return;};
        return txtList;
    }

    获取笔记正文() {
        var cmEditor = this.获取编辑模式 ();
    	if (!cmEditor) return;
        if (cmEditor.getSelection() == "") {
       		return cmEditor.getValue();
        } else {
            return cmEditor.getSelection();
        }
    };

    获取编辑模式() {
        let view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!view){return;};
        let cm = view.sourceMode.cmEditor;
        return cm;
    };
}

module.exports = CommentsPlugin;