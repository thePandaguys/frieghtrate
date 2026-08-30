import os, pickletools

for fn in sorted(os.listdir('models')):
    if not fn.endswith('.pkl'):
        continue
    path=os.path.join('models', fn)
    print('\n===', fn, '===')
    with open(path, 'rb') as f:
        data = f.read(200000)
    seen=[]
    for op, arg, pos in pickletools.genops(data):
        if op.name in ('GLOBAL', 'STACK_GLOBAL', 'INST', 'OBJ', 'NEWOBJ', 'NEWOBJ_EX', 'REDUCE', 'BUILD'):
            # print enough info to identify classes/modules
            print(pos, op.name, repr(arg))
            if isinstance(arg, tuple) and len(arg) == 2:
                seen.append(arg)
    print('count', len(seen))
    print('sample', seen[:10])
