﻿module BABYLON.EDITOR.GUI {
    export class GUIPanel extends GUIElement<W2UI.IElement> {
        // Public memebers
        public tabs: Array<IGUITab> = new Array<IGUITab>();
        public type: string;
        public size: number = 70;
        public minSize: number = 10;
        public maxSize: any = undefined;
        public content: string;
        public resizable: boolean;
        public style: string = "background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 5px;";
        public toolbar: any = null;

        public _panelElement: W2UI.IPanelElement;

        public onTabChanged: (id: string) => void;
        public onTabClosed: (id: string) => void;

        /**
        * Constructor
        * @param name: panel name
        * @param type: panel type (left, right, etc.)
        * @param size: panel size
        * @param resizable: if the panel is resizable
        * @param core: the editor core
        */
        constructor(name: string, type: string, size: number, resizable: boolean, core: EditorCore) {
            super(name, core);

            this.type = type;
            this.size = size;
            this.resizable = resizable;
        }

        // Create tab
        public createTab(tab: IGUITab): GUIPanel {
            // Configure event
            (<any>tab).onClick = (event) => {
                if (this.onTabChanged)
                    this.onTabChanged(event.target);

                var ev = new Event();
                ev.eventType = EventType.GUI_EVENT
                ev.guiEvent = new GUIEvent(this, GUIEventType.TAB_CHANGED, event.target);
                this.core.sendEvent(ev);
            };

            (<any>tab).onClose = (event) => {
                if (this.onTabClosed)
                    this.onTabClosed(event.target);

                var ev = new Event();
                ev.eventType = EventType.GUI_EVENT
                ev.guiEvent = new GUIEvent(this, GUIEventType.TAB_CLOSED, event.target);
                this.core.sendEvent(ev);
            };

            // Add tab
            this.tabs.push(tab);

            if (this._panelElement !== null) {
                this._panelElement.tabs.add(tab);
            }

            return this;
        }

        // Remove tab from id
        public removeTab(id: string): boolean {
            if (this._panelElement !== null) {
                this._panelElement.tabs.remove(id);
            }

            for (var i = 0; i < this.tabs.length; i++) {
                if (this.tabs[i].id === id) {
                    this.tabs.splice(i, 1);
                    return true;
                }
            }

            return false;
        }

        // Get width
        public get width() {
            if (this._panelElement)
                return this._panelElement.width;

            return 0;
        }

        // Get height
        public get height() {
            if (this._panelElement)
                return this._panelElement.height;

            return 0;
        }

        // Set width
        public set width(width: number) {
            if (this._panelElement)
                this._panelElement.width = width;
        }

        // Set height
        public set height(height: number) {
            if (this._panelElement)
                this._panelElement.height = height;
        }

        // Return tab count
        public getTabCount(): number {
            return this.tabs.length;
        }

        // Set tab enabled
        public setTabEnabled(id: string, enable: boolean): GUIPanel {
            if (this._panelElement === null) {
                return this;
            }

            enable ? this._panelElement.tabs.enable(id) : this._panelElement.tabs.disable(id)

            return this;
        }

        // Sets the active tab
        public setActiveTab(id: string): void {
            this._panelElement.tabs.select(id);

            var ev = new Event();
            ev.eventType = EventType.GUI_EVENT
            ev.guiEvent = new GUIEvent(this, GUIEventType.TAB_CHANGED, id);
            this.core.sendEvent(ev);
        }

        // Return tab id from index
        public getTabIDFromIndex(index: number): string {
            if (index >= 0 && index < this.tabs.length) {
                return this.tabs[index].id;
            }
            
            return "";
        }

        // Returns the wanted tab
        public getTab(id: string): IGUITab {
            var tab = this._panelElement.tabs.get(id);
            return tab;
        }

        // Sets panel content (HTML)
        public setContent(content: string): GUIPanel {
            this.content = content;
            return this;
        }

        // Hides a tab
        public hideTab(id: string): boolean {
            return this._panelElement.tabs.hide(id) === 1;
        }

        // Show tab
        public showTab(id: string): boolean {
            return this._panelElement.tabs.show(id) === 1;
        }
    }
}