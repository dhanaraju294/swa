package com.swafocus
import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
class FocusPackage : BaseReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? = if (name == NativeFocusCoreModule.NAME) NativeFocusCoreModule(reactContext) else null
    override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
        mapOf(NativeFocusCoreModule.NAME to ReactModuleInfo(NativeFocusCoreModule.NAME, NativeFocusCoreModule::class.java.name, false, false, false, true))
    }
}
