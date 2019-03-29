/** @jsx h */
import "./figma-plugin-ui.scss";
import h from "vhtml";
import $ from "jquery";
import { until, isEmpty } from "./utilities";
import { getDomNode, createHtmlNodes } from "./utils";
import { textTransform } from "text-transform";
import { getDataWithParams } from "./service";

export default class ExamplePlugin {
  constructor() {
    this.pluginName = "Wendy Plugin";
    this.urlParams = [];
    // SETUP PLUGIN
    const shortcut = {
      mac: {
        command: true,
        shift: true,
        key: "G"
      },
      windows: {
        alt: true,
        shift: true,
        key: "H"
      }
    };

    const options = [this.pluginName, this.showUI, null, shortcut];

    window.figmaPlus.createPluginsMenuItem(...options);
    window.figmaPlus.createKeyboardShortcut(shortcut, this.showUI);

    // The UI follows a strict structure to utlize the CSS shipped with this boilerplate
    // But you can freely play with the css in figma-plugin-ui.scss

    this.UI = (
      <div class="figma-plugin-ui">
        <div class="scrollable">
          <h2>Wendy's Test Plugin</h2>

          <h2>Hot Keys</h2>
          <p>Select area to input text</p>
          <div class="field">
            <label for="numOfItems"># of Items</label>
            <input id="numOfItems" type="number" placeholder="input number" />
          </div>

          {/* <h2>Section 2</h2>

          <div class="field-row">
            <label for="input2">Label</label>
            <input id="input2" type="text" />
          </div>

          <div class="field-row">
            <label for="input3">Label</label>
            <input id="input3" type="text" />
          </div>

          <div class="field-row">
            <label for="input4">Label</label>
            <input id="input4" type="text" />
          </div>

          <h2>Section 3</h2>

          <div class="field">
            <label for="select1">Select</label>
            <select id="select1">
              <option>First</option>
              <option>Second</option>
              <option>Third</option>
            </select>
          </div>

          <div class="field">
            <label for="select2">Select with wrapper</label>
            <div class="select">
              <select id="select2">
                <option>First TEST TEST</option>
                <option>Second</option>
                <option>Third</option>
              </select>
            </div>
          </div> */}

          {/* <h2>Section 3</h2> */}
          <div class="field-row">
            <button id="fullNameHotKey">Full Name</button>
            <button id="emailHotKey">Email</button>
            <button id="button3">Button 3</button>
            <button id="button4">Button 4</button>
          </div>
          <hr />
          <h2>Generate your own list</h2>
          <div class="field-row">
            <button id="fullName">Full Name</button>
            <button id="email">Email</button>
            <button id="username">Username</button>
            <button id="city">City</button>
            <button id="phone">Phone</button>
          </div>
          <div id="dynamicList" />
          <h2>Options</h2>
          <div class="field-row">
            <div class="field">
              <label for="numOfItemsOption"># of Items</label>
              <input
                id="numOfItemsOption"
                type="number"
                placeholder="(default 20)"
              />
            </div>
          </div>
        </div>
        <footer>
          <button id="submitList">Generate List</button>
        </footer>
      </div>
    );
  }

  attachEvents = () => {
    // No need to removeEventListeners because
    // the hideUI removes your plugin from the DOM.

    // ["#input1", "#input2", "#input3", "#input4"].map(id =>
    //   getDomNode(id).addEventListener("input", this.onInteract)
    // );

    // ["#select1", "#select2"].map(id =>
    //   getDomNode(id).addEventListener("change", this.onInteract)
    // );

    // [
    //   "#fullName",
    //   "#button2",
    //   "#button3",
    //   "#button4",
    //   "#button-secondary",
    //   "#button-primary"
    // ].map(id => getDomNode(id).addEventListener("click", this.onInteract));

    ["#fullNameHotKey"].map(id =>
      getDomNode(id).addEventListener("click", this.getFullNameList)
    );
    ["#emailHotKey"].map(id =>
      getDomNode(id).addEventListener("click", this.getEmailList)
    );

    ["#fullName", "#email", "#username", "#city", "#phone"].map(id =>
      getDomNode(id).addEventListener("click", () => {
        this.addToSearchBox(id);
      })
    );

    ["#submitList"].map(id =>
      getDomNode(id).addEventListener("click", this.generateList)
    );
  };

  showUI = () => {
    // Show the plugin modal using figmaPlugin API.
    window.figmaPlus.showUI(
      this.pluginName,
      modalElement => {
        const htmlNodes = createHtmlNodes(this.UI);
        modalElement.parentNode.replaceChild(htmlNodes, modalElement);

        // Hookup onInteract to handle all UI events.
        // You can also use a separate handler for each UI element..
        // it's just plain ol javascript.

        this.attachEvents();
      },
      460,
      600,
      0.5,
      0.5,
      false,
      false
    );
  };

  deleteItem(itemName) {
    console.log("item", itemName);
  }

  addToSearchBox(itemId) {
    event.stopPropagation();
    let arr = itemId.split("");
    arr.shift();
    const itemName = arr.join("");
    const searchBox = $("#dynamicList");
    const htmlStr = `<button class="dy-buttons">${itemName}<span onclick="this.deleteItem.bind(this, ${itemName})">x</span></button>`;
    searchBox.append(htmlStr);

    this.urlParams.push(itemName);
    console.log("url params", this.urlParams);
  }

  generateList = async () => {
    const numOfItems = document.getElementById("numOfItemsOption").value
      ? document.getElementById("numOfItemsOption").value
      : 20;
    const items = await getDataWithParams(this.urlParams, numOfItems);

    const selectedNodes = Object.keys(
      window.App._state.mirror.sceneGraphSelection
    );
    if (selectedNodes.length === 0) {
      this.showToast("⚠️ You must select at least one layer.");
      return;
    }
    console.log("items", items.results);
    let res = items.results;

    let filteredItems = res.map(item => {
      console.log('item', item)
      if (item.name) {
        return `${item.name.first} ${item.name.last}`;
      } else if (item.location)
    });

    console.log('hi', filteredItems); 
    // let finalList = filteredItems.forEach(item => {
    //   this.urlParams.forEach(param => {

    //   }) 
    // })

  };

  fillData = type => {
    const selectedNodes = Object.keys(
      window.App._state.mirror.sceneGraphSelection
    );

    if (selectedNodes.length === 0) {
      this.showToast("⚠️ You must select at least one layer.");
      return;
    }

    let filteredItems;

    switch (itemType) {
      case "fullName":
        filteredItems = items.map(item =>
          textTransform(`${item.name.first} ${item.name.last}`, "capitalize")
        );
        break;
      case "email":
        filteredItems = items.map(item => item.email);
        break;
      case "city":
        filteredItems = items.map(
          item => `${textTransform(item.location.city, "capitalize")}`
        );
        break;
      case "phone":
        filteredItems = items.map(item => item.login.username);
        break;
      default:
        break;
    }

    // await this.setLayersText(selectedNodes, filteredItems);
    // this.showToast('✅ Filled');
  };

  getEmailList = () => {
    const numOfItems = document.getElementById("numOfItems").value;
    const selectedNodes = Object.keys(
      window.App._state.mirror.sceneGraphSelection
    );

    const emailUrl = `https://randomuser.me/api/?inc=,email&results=${numOfItems}`;

    fetch(emailUrl)
      .then(res => res.json())
      .then(data => {
        console.log("data", data);
        let emails = data.results.map(res => `${res.email}`);
        this.setLayersText(selectedNodes, emails);
      });
  };

  getFullNameList = () => {
    // if (isEmpty(window.App._state.mirror.sceneGraphSelection)) {
    //   window.App._state.mirror.sceneGraphSelection = {"0:0": true}
    //   console.log('in here', window.App._state.mirror.sceneGraphSelection)
    // }
    const numOfItems = document.getElementById("numOfItems").value;
    const selectedNodes = Object.keys(
      window.App._state.mirror.sceneGraphSelection
    );

    // for assets
    const currentFill = window.App._state.mirror.selectionProperties.fillPaints;

    const fullNameUrl = `https://randomuser.me/api/?inc=,name&results=${numOfItems}`;
    fetch(fullNameUrl)
      .then(res => res.json())
      .then(data => {
        console.log("data", data);
        let names = data.results.map(
          res => `${res.name.title} ${res.name.first} ${res.name.last}`
        );
        console.log("names here", names);
        this.setLayersText(selectedNodes, names);
      });
  };

  setLayersText = (selectedNodes, filteredItems) => {
    for (const [index, nodeId] of selectedNodes.entries()) {
      const node = window.figmaPlus.scene.getNodeById(nodeId);
      if (node.type === "TEXT") {
        node.characters = filteredItems;
      }
    }
  };

  onInteract = event => {
    console.log(event.target.id, event);

    if (event.target.id === "button-primary") {
      window.figmaPlus.hideUI(this.pluginName);
    }
  };
}

window.examplePlugin = new ExamplePlugin();
