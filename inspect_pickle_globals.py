import os, pickletools

base = os.path.join('models')
for fn in sorted(os.listdir(base)):
    if not fn.endswith('.pkl'):
        continue
    p = os.path.join(base, fn)
    print('\nFILE:', fn)
    with open(p, 'rb') as f:
        data = f.read(50000)
    seen = []
    for op, arg, pos in pickletools.genops(data):
        if op.name in ('GLOBAL','STACK_GLOBAL','INST','OBJ','NEWOBJ','NEWOBJ_EX','REDUCE','BUILD'):
            if arg not in seen:
                seen.append(arg)
    for x in seen[:50]:
        print(x)
    print('TOTA L GLOBAL ITEMS:', len(seen))
