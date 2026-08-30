import os, pickletools, re

for fn in sorted(os.listdir('models')):
    if not fn.endswith('.pkl'): continue
    path = os.path.join('models', fn)
    print('\n===', fn, '===')
    strings = []
    seen = set()
    with open(path, 'rb') as f:
        data = f.read()
    for op, arg, pos in pickletools.genops(data):
        if op.name in ('SHORT_BINUNICODE', 'BINUNICODE', 'UNICODE'):
            s = arg
            if isinstance(s, str) and len(s) > 0 and s not in seen:
                seen.add(s)
                strings.append(s)
    for s in strings:
        print(s)
