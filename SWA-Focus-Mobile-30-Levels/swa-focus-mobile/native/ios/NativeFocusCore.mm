#import "NativeFocusCore.h"
#import <SwaFocus/SwaFocus-Swift.h>

@implementation NativeFocusCore {
  SwaFocusRustBridge *_rust;
  dispatch_queue_t _worker;
}
RCT_EXPORT_MODULE(NativeFocusCore)
+ (BOOL)requiresMainQueueSetup { return NO; }
- (instancetype)init {
  if ((self = [super init])) {
    _worker = dispatch_queue_create("com.swa.focus.rust", DISPATCH_QUEUE_SERIAL);
    _rust = [[SwaFocusRustBridge alloc] init];
  }
  return self;
}
- (void)dispatch:(NSString *)commandJson resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  dispatch_async(_worker, ^{
    @try { resolve([self->_rust dispatchJSON:commandJson]); }
    @catch (NSException *exception) { reject(@"FOCUS_NATIVE_ERROR", exception.reason, nil); }
  });
}
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeFocusCoreSpecJSI>(params);
}
@end
