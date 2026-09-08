def shadow_predict(current_model, candidate_model, rows):
    current = [float(value) for value in current_model.predict(rows)]
    candidate = [float(value) for value in candidate_model.predict(rows)]
    return [{"current_prediction": old, "candidate_prediction": new} for old, new in zip(current, candidate)]