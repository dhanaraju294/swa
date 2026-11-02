"""Actual generated UniFFI C-ABI invocation; not a stub transport."""
import json
import time
from concurrent.futures import ThreadPoolExecutor
from focus_core import FocusEngine

engine = FocusEngine()
call = lambda command: json.loads(engine.dispatch(json.dumps(command)))
assert len(call({'cmd': 'levels'})['levels']) == 30
for level in (1, 11, 21):
    snapshot = call({'cmd': 'start', 'levelId': level})['snapshot']
    assert snapshot['levelId'] == level
    assert snapshot['startedAtMs'] > 0
    assert call({'cmd': 'pause', 'sessionId': snapshot['sessionId']})['snapshot']['phase'] == 'paused'
    with ThreadPoolExecutor(max_workers=4) as workers:
        results = list(workers.map(lambda _: call({'cmd': 'poll', 'sessionId': snapshot['sessionId']}), range(40)))
    assert all(r['ok'] and r['snapshot']['phase'] == 'paused' for r in results)
assert not call({'cmd': 'start', 'levelId': 31})['ok']
start = time.perf_counter()
for _ in range(2000):
    call({'cmd': 'poll', 'sessionId': snapshot['sessionId']})
print('PASS: native UniFFI C-ABI, catalogue, three games, timestamps, pause, concurrent calls and controlled invalid commands.')
print(f'2000 native C-ABI snapshot calls (Python overhead included): {(time.perf_counter()-start)*1000:.1f} ms')
