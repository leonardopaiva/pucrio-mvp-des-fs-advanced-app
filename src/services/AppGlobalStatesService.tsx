/*
  # AppGlobalStatesService

  This service was an idea I came up with just for study purposes.  
  The idea is to manage the global state in a way that is a middle ground between **Context** and **Redux**.  
  To scale this idea, it would be necessary to create one of these services for each function of the app, for example:  
  - `AppThemeGlobalStatesService`  
  - `AppAuthGlobalStatesService`  
  - etc.  

  I recommend this approach only for study purposes. When it comes to a large app, the ideal solution is to use **Redux**.  

  ---

  ## Description

  - It is a global service for managing states like `optionCustomScheme`.  
  - It shares state between components without the need to manually pass props through the entire component tree.  

  ### Advantages

  - Simplicity: No need to set up a context or reducers. The code is straightforward and easy to understand.  

  ---

  ## Known Issue

  It still needs more testing. It doesn't seem to work properly when passing data from outside to inside an `<Outlet />` and vice versa.  

  ---

  **Leonardo Souza Paiva** – For study purposes only.  

*/
/*

  ## Example of Use

  When creating a state, its `set` function should be passed to the `AppGlobalStatesService`.

  ### Component A:

  const [optionCustomScheme, setOptionCustomScheme] = useState(false);

  useEffect(() => {
    AppGlobalStatesService.setSetOptionCustomSchemeFn(setOptionCustomScheme);
  }, []);

  Component B:

  AppGlobalStatesService.setOptionCustomScheme(!AppGlobalStatesService.getOptionCustomScheme());
  In this app, you can find an icon with a "?" in the footer that demonstrates the service working.

  Component C:
  const exampleGlobalState = AppGlobalStatesService.getExampleGlobalState();

  return (
    {exampleGlobalState && (
      <Tooltip title="Global state demo">
        <span>Global state demo</span>
      </Tooltip>
    )}
  );

*/

let optionCustomScheme: boolean = false;  
let setOptionCustomScheme: ((value: boolean) => void) | null = null;

let exampleGlobalState: boolean = false;
let setExampleGlobalState: ((value: boolean) => void) | null = null;

const AppGlobalStatesService = {
  /* OptionCustomScheme */
  setSetOptionCustomSchemeFn: (fn: (value: boolean) => void) => {
    setOptionCustomScheme = fn;
  },

  setOptionCustomScheme: (value: boolean) => {
    optionCustomScheme = value;  
    setOptionCustomScheme?.(value);
  },

  getOptionCustomScheme: () => optionCustomScheme,

  /* ExampleGlobalState */
  setExampleGlobalStateFn: (fn: (value: boolean) => void) => {
    setExampleGlobalState = fn;
  },

  setExampleGlobalState: (value: boolean) => {
    exampleGlobalState = value;  
    console.log(exampleGlobalState);
    setExampleGlobalState?.(value);
  },

  getExampleGlobalState: () => exampleGlobalState,

};

export default AppGlobalStatesService;