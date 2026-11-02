import Foundation
import UIKit

/// Generated UniFFI focus_core.swift is compiled into the same SwaFocus pod.
@objc(SwaFocusRustBridge)
public final class SwaFocusRustBridge: NSObject {
    private let engine = FocusEngine()
    private var observer: NSObjectProtocol?
    public override init() {
        super.init()
        observer = NotificationCenter.default.addObserver(forName: UIApplication.willResignActiveNotification, object: nil, queue: nil) { [weak self] _ in
            // Rust's mutex serializes lifecycle notifications with pending input.
            _ = self?.engine.dispatch(commandJson: "{\"cmd\":\"interrupt\"}")
        }
    }
    @objc public func dispatchJSON(_ command: String) -> String { engine.dispatch(commandJson: command) }
    deinit { if let observer { NotificationCenter.default.removeObserver(observer) } }
}
