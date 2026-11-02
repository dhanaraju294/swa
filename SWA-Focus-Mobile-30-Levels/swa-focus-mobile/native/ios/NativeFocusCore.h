#import <Foundation/Foundation.h>
#if __has_include(<ReactCodegen/SwaFocusSpec/SwaFocusSpec.h>)
#import <ReactCodegen/SwaFocusSpec/SwaFocusSpec.h>
#else
#import <ReactCodegen/SwaFocusSpec.h>
#endif
@interface NativeFocusCore : NSObject <NativeFocusCoreSpec>
@end
