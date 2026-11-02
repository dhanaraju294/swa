package com.swafocus

import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.swafocus.rust.FocusEngine
import java.util.concurrent.Executors
import java.util.concurrent.RejectedExecutionException

@ReactModule(name = NativeFocusCoreModule.NAME)
class NativeFocusCoreModule(context: ReactApplicationContext) : NativeFocusCoreSpec(context), LifecycleEventListener {
    companion object { const val NAME = "NativeFocusCore" }
    private val worker = Executors.newSingleThreadExecutor()
    // JNI loading happens on the worker, not the UI thread. Missing ABI/loading errors reject the Promise.
    private var engine: FocusEngine? = null
    init { context.addLifecycleEventListener(this) }
    override fun getName() = NAME
    override fun dispatch(commandJson: String, promise: Promise) {
        try {
            worker.execute {
                try {
                    val core = engine ?: FocusEngine().also { engine = it }
                    promise.resolve(core.dispatch(commandJson))
                } catch (e: Throwable) { promise.reject("FOCUS_NATIVE_ERROR", "Could not execute the on-device Focus engine.", e) }
            }
        } catch (e: RejectedExecutionException) { promise.reject("FOCUS_INVALIDATED", "The Focus native module has been invalidated.", e) }
    }
    override fun onHostPause() {
        try { worker.execute { try { engine?.dispatch("{\"cmd\":\"interrupt\"}") } catch (_: Throwable) {} } } catch (_: RejectedExecutionException) {}
    }
    override fun onHostResume() {} // Do not silently resume a user-paused round.
    override fun onHostDestroy() { onHostPause() }
    override fun invalidate() {
        reactApplicationContext.removeLifecycleEventListener(this)
        try { worker.execute { engine?.destroy(); engine = null } } catch (_: RejectedExecutionException) {}
        worker.shutdown()
        super.invalidate()
    }
}
