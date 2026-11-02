require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))
Pod::Spec.new do |s|
  s.name = 'SwaFocus'
  s.module_name = 'SwaFocus'
  s.version = package['version']
  s.summary = 'SWA Focus: React Native attention games with an on-device Rust core.'
  s.homepage = 'https://example.invalid/swa-focus-local-module'
  s.license = { :type => 'MIT', :file => 'LICENSE' }
  s.author = { 'SWA' => 'local-module@example.invalid' }
  # This is a local/path pod; replace source metadata before publishing a remote pod.
  s.source = { :git => 'https://example.invalid/swa-focus-local-module.git', :tag => s.version.to_s }
  s.platforms = { :ios => '15.1' }
  s.swift_version = '5.0'
  s.source_files = 'native/ios/**/*.{h,m,mm,swift}'
  s.exclude_files = 'native/ios/Frameworks/**/*'
  s.private_header_files = 'native/ios/NativeFocusCore.h', 'native/ios/generated/*.h'
  s.vendored_frameworks = 'native/ios/Frameworks/FocusCore.xcframework'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }
  install_modules_dependencies(s)
end
