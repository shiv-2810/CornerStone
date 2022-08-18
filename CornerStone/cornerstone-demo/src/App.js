import React from "react";
import ReactDOM from "react-dom";
import { jsx, css } from "@emotion/core";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import cornerstoneTools from "cornerstone-tools";
import cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import Hammer from "hammerjs";

import {
  ViewerLayout,
  VIEWER_LAYOUT_OPTIONS,
  getViewCountFromLayout
} from "./ViewerLayout";
import { Viewer } from "./Viewer";


// Display an image
const imageId =
  "https://www.asteris.biz/Keystone/ImageDownload.aspx?ClinicCode=TESTKEYSTONE&ImageId=01b1755e-33d1-4b24-b9af-a4a019689d5f&ImageType=PreviewImage&FrameIndex=0";

const tools = [
  {
    name: "Length",
    func: cornerstoneTools.LengthTool,
    options: { mouseButtonMask: 1 }
  },
  {
    name: "Probe",
    func: cornerstoneTools.ProbeTool,
    options: { mouseButtonMask: 1 }
  },
  {
    name: "FreehandMouse",
    func: cornerstoneTools.FreehandMouseTool,
    options: { mouseButtonMask: 1 }
  },
  {
    name: "Eraser",
    func: cornerstoneTools.EraserTool,
    options: { mouseButtonMask: 1 }
  },
  {
    name: "Zoom",
    func: cornerstoneTools.ZoomTool,
    options: { mouseButtonMask: 1 }
  },
  {
    name: "Pan",
    func: cornerstoneTools.PanTool,
    options: { mouseButtonMask: 1 }
  },
  {
    name: "FreehandSculpterMouse",
    func: cornerstoneTools.FreehandSculpterMouseTool,
    options: { mouseButtonMask: 1 }
  }
];

function initCornerstone(element) {
  try {
    // Setup image loader
    cornerstoneWebImageLoader.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;

    cornerstone.registerImageLoader(
      "http",
      cornerstoneWebImageLoader.loadImage
    );
    cornerstone.registerImageLoader(
      "https",
      cornerstoneWebImageLoader.loadImage
    );

    cornerstoneTools.init({ globalToolSyncEnabled: true });
  } catch (err) {
    console.log("initCornerstone error", err);
    console.log(err.stack);
  } finally {
    console.log("we seem to be done here");
  }
}

export default class App extends React.Component {
  state = { activeTool: null, viewerLayout: "2x2" };


  componentDidMount() {
    console.log(cornerstoneTools.FreehandMouseTool);
    initCornerstone();

    tools.forEach(({ func }) => {
      cornerstoneTools.addTool(func);
    });

    // Setup event listeners
    // window.addEventListener("resize", this.onWindowResize);
  }

  componentWillUnmount() {
    console.log("unmounting");
    tools.forEach(({ func }) => {
      cornerstoneTools.removeTool(func);
    });
  }

  setTool = toolName => {
    this.setState({
      activeTool: toolName
    });
    const conf = tools.find(({ name }) => name === toolName);
    if (!conf) throw new Error(`Tool ${toolName} is not defined`);

    cornerstoneTools.setToolActive(toolName, conf.options);
  };

  setViewerLayout = event => {
    const viewerLayout = event.target.value;
    this.setState({
      viewerLayout
    });
  };

  logCSTState = () => {
    console.log(cornerstoneTools.store.state);
  };

  render() {
    const { viewerLayout } = this.state;
    const viewCount = getViewCountFromLayout(viewerLayout);
    const views = new Array(viewCount).fill(true);

    return (
      <DemoContainer>
        <Header />
        <DemoCell>
          <div>
            {tools.map(tool => (
              <button key={tool.name} onClick={() => this.setTool(tool.name)}>
                {tool.name}
              </button>
            ))}
            <span> - - </span>
            <select value={viewerLayout} onChange={this.setViewerLayout}>
              {VIEWER_LAYOUT_OPTIONS.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <button onClick={this.logCSTState}>State</button>
          </div>
        </DemoCell>

        <ViewerLayout layout={viewerLayout} cornerstone={cornerstone}>
          {views.map((_, index) => (
            <Viewer
              key={index}
              index={index}
              cornerstone={cornerstone}
              imageId={imageId}
            />
          ))}
        </ViewerLayout>
      </DemoContainer>
    );
  }
}

const DemoContainer = props => (
  <div
    css={{
      display: "flex",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: "column",
      justifyContent: "stretch",
      alignItems: "stretch",
      overflow: "hidden"
    }}
    {...props}
  />
);

const DemoCell = props => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      flexShrink: 0,
      height: 30,
      padding: 6
    }}
    {...props}
  />
);

const Header = () => (
  <DemoCell>
    <h1 css={{ margin: 0, padding: 0, fontSize: 20 }}>Hello Cornerstone</h1>
  </DemoCell>
);

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
