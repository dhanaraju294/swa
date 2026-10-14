// Preserve app data in OS backups, but never restore device-bound credentials.
const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');
const legacy = `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
  <exclude domain="sharedpref" path="SecureStore" />
  <exclude domain="file" path="swa-native-restore.json" />
</full-backup-content>
`;
const modern = `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
  <cloud-backup>
    <exclude domain="sharedpref" path="SecureStore" />
    <exclude domain="file" path="swa-native-restore.json" />
  </cloud-backup>
  <device-transfer>
    <exclude domain="sharedpref" path="SecureStore" />
    <exclude domain="file" path="swa-native-restore.json" />
  </device-transfer>
</data-extraction-rules>
`;
module.exports = function withDeviceBackup(config) {
  config = withAndroidManifest(config, result => {
    const app = result.modResults.manifest.application[0].$;
    app['android:allowBackup'] = 'true';
    app['android:fullBackupContent'] = '@xml/swa_backup_rules';
    app['android:dataExtractionRules'] = '@xml/swa_data_extraction_rules';
    return result;
  });
  return withDangerousMod(config, ['android', async result => {
    const dir = path.join(result.modRequest.platformProjectRoot, 'app/src/main/res/xml');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'swa_backup_rules.xml'), legacy);
    fs.writeFileSync(path.join(dir, 'swa_data_extraction_rules.xml'), modern);
    return result;
  }]);
};
