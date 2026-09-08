"""SWA Adaptive Exercise Engine Phase 1 foundation."""

from enum import Enum


# Keep enum string rendering aligned with their values so generated IDs and
# serialized codes match the project contract and test expectations.
Enum.__str__ = lambda self: str(self.value)

__version__ = "0.1.0"
