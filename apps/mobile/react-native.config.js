// uniffi-bindgen-react-native is linked from the Podfile only when the
// InwardCore XCFramework is present (see plugins/withRustCore.js).
// Autolinking it here would add a :podspec path that crashes CocoaPods
// when the project folder contains a space (e.g. "swa 2").
module.exports = {
  dependencies: {
    'uniffi-bindgen-react-native': {
      platforms: {
        ios: null,
        android: null,
      },
    },
  },
};
