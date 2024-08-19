import { registerCanvasComponent } from "./src/domain/Canvas/view/x-canvas";
import { registerAppContext } from "./src/domain/context/AppContext";

const app = () => {
  registerCanvasComponent();
  registerAppContext();
};
document.addEventListener("DOMContentLoaded", app);
