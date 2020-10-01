from flask import Flask, render_template, request, jsonify
from datetime import datetime
import json
from fbprophet import Prophet
import pandas as pd

app = Flask(__name__)

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

# Flask App
@app.route('/api/forecast/', methods=["POST"])
def api_forecast():
   
    try:
        body = request.get_json()

        
        period = int(body['period'])
        print(period)

        print(body['data'])

        
        df = pd.read_json(json.dumps(body['data']), orient="records")

        df['ds'] = pd.to_datetime(df['ds'], format='%Y-%m-%d').dt.strftime("%Y-%m-%d")

    # df = df.from_records(df)
        print(df)
        m = Prophet()
        m.fit(df)
        future = m.make_future_dataframe(periods=period)
        forecast = m.predict(future)

        df = pd.DataFrame(data=forecast)
        df["ds"]= pd.to_datetime(df["ds"], unit='s').dt.strftime('%Y-%m-%d')
        response = forecast.to_json(orient="records")
        return response
    except KeyError as error:
        return "KeyError", 400

if __name__ == '__main__':
    app.run(host="0.0.0.0")