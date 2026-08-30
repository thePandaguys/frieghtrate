import pickletools, os
for fn in sorted(os.listdir('models')):
    if fn.endswith('.pkl'):
        path=os.path.join('models',fn)
        print('\nFILE', fn)
        with open(path,'rb') as f:
            data=f.read()
        print('SIZE', len(data))
        # print disassembly of only first ~200 ops
        counts=0
        for op,arg,pos in pickletools.genops(data):
            if counts>220: break
            if op.name in ('GLOBAL','STACK_GLOBAL','REDUCE','INST','OBJ','BUILD','TUPLE','MARK','NEWOBJ','NEWOBJ_EX','LIST','DICT','SETITEM','SETITEMS','FRAME','MEMOIZE','PUSH','POP','APPENDS','APPEND'):
                print(f'{pos:06d}: {op.name} {arg}' if arg is not None else f'{pos:06d}: {op.name}')
            counts+=1
