import { ConfigPlugin } from "@expo/config-plugins";
type Platform = "ios" | "android";
type Icon = {
    image: string;
    prerendered?: boolean;
    platforms?: Platform[];
};
type IconSet = Record<string, Icon>;
declare const withDynamicAppIcon: ConfigPlugin<string[] | IconSet | void>;
export default withDynamicAppIcon;
