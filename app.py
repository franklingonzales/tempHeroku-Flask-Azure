import os

import mysql.connector
from mysql.connector import errorcode

import pandas as pd
import numpy as np



from flask import Flask, jsonify, render_template

app = Flask(__name__)



#################################################
# Database Setup
#################################################
# Obtain connection string information from the portal
config = {
 'host':'gtbootcamp.mysql.database.azure.com',
 'user':'harish@gtbootcamp',
 'password':'JsOverload!23'
}

@app.route("/")
def index():
    try:
        conn = mysql.connector.connect(**config)
        conn.close()
        return "Connection established"
    except mysql.connector.Error as err:
        return "Something went wrong: {}".format(err)
    
    # Return the homepage.
    # return render_template("index.html")


@app.route("/names")
def names():
    return "A query"
    # Return a list of sample names."""
    conn = mysql.connector.connect(**config)
    # print("Connection established")

    df = pd.read_sql_query("SELECT * FROM jsoverload.survey_results_public WHERE Respondent=1", conn)
    conn.close()
    return list( df.MainBranch )[0]

    # Use Pandas to perform the sql query
    # stmt = db.session.query(Samples).statement
    # df = pd.read_sql_query(stmt, db.session.bind)
    # print( stmt )
    # Return a list of the column names (sample names)
    # return jsonify(list(df.columns)[2:])
    # return jsonify(list(df.columns))



if __name__ == "__main__":
    app.run()
