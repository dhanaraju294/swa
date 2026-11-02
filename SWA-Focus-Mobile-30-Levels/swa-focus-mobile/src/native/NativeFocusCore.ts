import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";
export interface Spec extends TurboModule {
  dispatch(commandJson: string): Promise<string>;
}
export default TurboModuleRegistry.get<Spec>("NativeFocusCore");
