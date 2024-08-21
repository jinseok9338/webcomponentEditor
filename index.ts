const app = async () => {
  // Dynamically import and register AppContext
  const { registerAppContext } = await import(
    "./src/domain/App/context/AppContext"
  );
  const { registerCanvasComponent } = await import(
    "./src/domain/Canvas/view/x-canvas"
  );

  const { registerMenuComponent } = await import(
    "./src/domain/Canvas/view/x-menu"
  );

  const { registerMenuWrapperComponent } = await import(
    "./src/domain/Canvas/view/x-menu-wrapper"
  );

  registerAppContext();
  registerCanvasComponent();
  registerMenuWrapperComponent();
  registerMenuComponent();
};

document.addEventListener("DOMContentLoaded", app);
