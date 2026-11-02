import NativeFocusCore from "./native/NativeFocusCore";
import { FocusClient } from "./core-client";
export function createNativeFocusClient(): FocusClient {
  if (!NativeFocusCore)
    throw new Error(
      "NativeFocusCore is not linked. Complete the Android/iOS integration before mounting Focus.",
    );
  return new FocusClient(NativeFocusCore);
}
