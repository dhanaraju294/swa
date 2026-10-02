const {
  createRunOncePlugin,
  withAndroidManifest,
  withDangerousMod,
  withMainApplication,
  withStringsXml,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const RECEIVER_NAME = '.StreakWidgetProvider';
const ACTIONS = [
  'android.appwidget.action.APPWIDGET_UPDATE',
  'android.intent.action.DATE_CHANGED',
  'android.intent.action.TIME_CHANGED',
  'android.intent.action.TIMEZONE_CHANGED',
];
const NATIVE_FILES = [
  'java/com/inwardjourney/app/StreakWidgetModule.kt',
  'java/com/inwardjourney/app/StreakWidgetProvider.kt',
  'res/drawable/streak_widget_background.xml',
  'res/drawable/widget_blossom_happy.xml',
  'res/drawable/widget_blossom_sad.xml',
  'res/drawable/widget_blossom_sprout.xml',
  'res/drawable/widget_blossom_steady.xml',
  'res/drawable/widget_blossom_blooming.xml',
  'res/layout/streak_widget.xml',
  'res/xml/streak_widget_info.xml',
];

function withWidgetReceiver(config) {
  return withAndroidManifest(config, (mod) => {
    const application = mod.modResults.manifest.application?.[0];
    if (!application) throw new Error('[withStreakWidget] Android application entry is missing.');

    const receivers = application.receiver || (application.receiver = []);
    const hasReceiver = receivers.some((receiver) => {
      const name = receiver.$?.['android:name'];
      return name === RECEIVER_NAME || name === 'com.inwardjourney.app.StreakWidgetProvider';
    });
    if (!hasReceiver) {
      receivers.push({
        $: { 'android:name': RECEIVER_NAME, 'android:exported': 'false' },
        'intent-filter': [{ action: ACTIONS.map((name) => ({ $: { 'android:name': name } })) }],
        'meta-data': [
          {
            $: {
              'android:name': 'android.appwidget.provider',
              'android:resource': '@xml/streak_widget_info',
            },
          },
        ],
      });
    }
    return mod;
  });
}

function withWidgetPackage(config) {
  return withMainApplication(config, (mod) => {
    const source = mod.modResults.contents;
    if (source.includes('packages.add(StreakWidgetPackage())')) return mod;

    const anchor = 'val packages = PackageList(this).packages';
    if (!source.includes(anchor)) {
      throw new Error('[withStreakWidget] Could not locate the Kotlin React Native package list.');
    }
    mod.modResults.contents = source.replace(anchor, `${anchor}\n            packages.add(StreakWidgetPackage())`);
    return mod;
  });
}

function withWidgetDescription(config) {
  return withStringsXml(config, (mod) => {
    const strings = mod.modResults.resources.string || (mod.modResults.resources.string = []);
    if (!strings.some((item) => item.$?.name === 'streak_widget_description')) {
      strings.push({
        $: { name: 'streak_widget_description' },
        _: 'Blossom shows your current streak and its mood',
      });
    }
    return mod;
  });
}

function withWidgetNativeFiles(config) {
  return withDangerousMod(config, [
    'android',
    async (mod) => {
      const projectRoot = mod.modRequest.projectRoot;
      const sourceRoot = path.join(projectRoot, 'plugins', 'streak-widget', 'android', 'app', 'src', 'main');
      const targetRoot = path.join(projectRoot, 'android', 'app', 'src', 'main');
      if (!fs.existsSync(sourceRoot)) throw new Error('[withStreakWidget] Missing Android widget source files.');

      for (const relative of NATIVE_FILES) {
        const source = path.join(sourceRoot, relative);
        const target = path.join(targetRoot, relative);
        if (!fs.existsSync(source)) throw new Error(`[withStreakWidget] Missing native source: ${relative}`);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(source, target);
      }
      return mod;
    },
  ]);
}

function withStreakWidget(config) {
  config = withWidgetReceiver(config);
  config = withWidgetPackage(config);
  config = withWidgetDescription(config);
  config = withWidgetNativeFiles(config);
  return config;
}

module.exports = createRunOncePlugin(withStreakWidget, 'withStreakWidget', '1.0.0');
