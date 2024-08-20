import { registerCanvasComponent } from "./src/domain/Canvas/view/x-canvas";
import { registerAppContext } from "./src/domain/App/context/AppContext";

const app = () => {
  registerAppContext();
  registerCanvasComponent();
};
document.addEventListener("DOMContentLoaded", app);
