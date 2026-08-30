import os, joblib, json

base = 'models'
for fn in sorted(os.listdir(base)):
    if not fn.endswith('.pkl'):
        continue
    path = os.path.join(base, fn)
    print('\n' + '='*80)
    print('FILE:', fn)
    obj = joblib.load(path)
    print('TYPE:', type(obj))

    for attr in ['feature_names_in_', 'n_features_in_', 'classes_', 'is_fitted', 'steps', 'named_steps']:
        if hasattr(obj, attr):
            val = getattr(obj, attr)
            if isinstance(val, (list, tuple, set)):
                val = list(val)[:20]
            print(f'{attr}: {val}')

    if hasattr(obj, 'named_steps'):
        print('NAMED_STEPS:', list(obj.named_steps.keys()))
        for name, step in obj.named_steps.items():
            print(' STEP', name, 'TYPE', type(step))
            for attr in ['feature_names_in_', 'n_features_in_', 'classes_']:
                if hasattr(step, attr):
                    val = getattr(step, attr)
                    if isinstance(val, (list, tuple, set)):
                        val = list(val)[:20]
                    print(f'  {attr}: {val}')

    for method in ['predict', 'predict_proba', 'predict_log_proba', 'transform']:
        if hasattr(obj, method):
            print('HAS METHOD:', method)

    try:
        sample = obj.predict([[0]*10]) if hasattr(obj, 'predict') else None
        print('SAMPLE_PREDICT:', sample)
    except Exception as e:
        print('SAMPLE_PREDICT_ERROR:', repr(e))

    try:
        if hasattr(obj, 'predict_proba'):
            sample = obj.predict_proba([[0]*10])
            print('SAMPLE_PREDICT_PROBA:', sample)
    except Exception as e:
        print('SAMPLE_PREDICT_PROBA_ERROR:', repr(e))
