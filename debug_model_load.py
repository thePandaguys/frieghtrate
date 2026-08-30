import os, sys, types, joblib, traceback
m = types.ModuleType('__main__')
sys.modules['__main__'] = m
class FreightForecastWrapper:
    """Wrapper class for the pickled forecast model—acts as a transparent proxy."""
    def __init__(self, model=None):
        object.__setattr__(self, 'model', model)
    
    def predict(self, X, *args, **kwargs):
        return self.model.predict(X, *args, **kwargs)
    
    def __getattr__(self, name):
        model = object.__getattribute__(self, 'model')
        return getattr(model, name)
    
    def __setattr__(self, name, value):
        if name == 'model':
            object.__setattr__(self, name, value)
        else:
            model = object.__getattribute__(self, 'model')
            setattr(model, name, value)

m.FreightForecastWrapper = FreightForecastWrapper
print('SET', sys.modules['__main__'])
for fn in sorted(os.listdir('models')):
    if not fn.endswith('.pkl'):
        continue
    path = os.path.join('models', fn)
    print('TRY', fn)
    try:
        obj = joblib.load(path)
        print('OK', type(obj), hasattr(obj, 'predict'))
    except Exception as e:
        print('ERR', type(e).__name__, repr(e))
        traceback.print_exc(limit=20)
