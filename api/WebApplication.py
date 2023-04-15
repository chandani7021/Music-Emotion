#!/usr/bin/env python
# coding: utf-8

# In[33]:


# - *- coding: utf- 8 - *-
from flask import Flask, render_template, redirect, url_for, request,json
from flask_cors import CORS, cross_origin
import requests as rq
from flask_wtf import Form
from werkzeug.utils import secure_filename
from wtforms import RadioField
from wtforms import validators, ValidationError
#from sklearn.externals import joblib
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
from nltk.corpus import stopwords
# from google.cloud import translate
from googletrans import Translator
import keras
import librosa
import numpy as np
import nltk
import os
import re


path = os.getcwd()
# file Upload
UPLOAD_FOLDER = os.path.join(path, 'uploads')

if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)


# #### Functions defined for web page

# In[35]:


porter_stemmer = nltk.stem.porter.PorterStemmer()

#spilts the sentences into words
def porter_tokenizer(text, stemmer=porter_stemmer):
    lower_txt = text.lower()
    tokens = nltk.wordpunct_tokenize(lower_txt)
    stems = [porter_stemmer.stem(t) for t in tokens]
    no_punct = [s for s in stems if re.match('^[a-zA-Z]+$', s) is not None]
    return no_punct

stop_words = set(stopwords.words('english')) 

#vectorize the data
def vectorizer():
    
    # Load the model from the file 
    vect = joblib.load('./data/vectorizer.pkl')
    return vect

#with the machine learning model
def classifier():
    # Load the model from the file 
    model_from_joblib = joblib.load('./data/classifier.pkl')
    return model_from_joblib

# #for translating a non-english into english
# def translate_text(text,target='en'):
#     translator = Translator()
# #     translate_client = translate.Client()
# #     data = translate_client.translate(text,target_language=target)
#     result = translator.translate(text, dest = target)
# #     result = data['translatedText']
#     print(result.text)
#     return result.text


# #### Web Application

# In[ ]:


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/about')
# def about():
#     return render_template('about.html')


#to handle the behavior of an english song

# @app.after_request
# def add_security_headers(resp):
#     resp.headers['Access-Control-Allow-Origin']='*'
#     resp.headers['Access-Control-Allow-Methods']='GET, POST, PUT, OPTIONS'
#     resp.headers["Access-Control-Allow-Headers"]="Access-Control-Request-Headers,Access-Control-Allow-Methods,Access-Control-Allow-Headers,Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept"
#     return resp
# @cross_origin()

@app.route('/english',methods=['GET','POST']) 
def bynontranslating():
    if request.method =='GET':
        methods='GET'
        return 'Hellolo Therejkkj'
    elif request.method =='POST':
        methods='POST'
        song = request.json['lyrics']
        data = [song]
        vector = vectorizer()
        cleanedtxt = vector.transform(data).toarray()
        model = classifier()
        # return str(model.predict(cleanedtxt))
        my_prediction = model.predict(cleanedtxt)
        # return str(my_prediction)
        val = model.predict_proba(cleanedtxt)
        # return str(val)
        prob = 0
        if (val[:,0] > val[:,1]):
            prob = val[:,0]
            prob = round(prob[0]*100,2)
        else:
            prob = val[:,1]
            prob = round(prob[0]*100,2)
        
        json_data = json.dumps([my_prediction,prob],default=str)

        return json_data
    else:
        return 'Go to '
        #return my_prediction


@app.route('/audio-predict',methods=['POST']) 
def test_model():
    path = '../server/SER_model.h5'
    filee = request.files['audioFile']
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(filee.filename))
    filee.save(filepath)

    def load_model():
        loaded_model = keras.models.load_model(path)
        return loaded_model

    def makepredictions(model):
        data, sampling_rate = librosa.load(filepath)
        mfccs = np.mean(librosa.feature.mfcc(y=data, sr=sampling_rate, n_mfcc=40).T, axis=0)
        x = np.expand_dims(mfccs, axis=1)
        x = np.expand_dims(x, axis=0)
        predictions = (model.predict(x) > 0.5).astype("int32")
        return (convertclasstoemotion(predictions))
    
    def convertclasstoemotion(pred):  
        label_conversion = {'0': 'neutral',
                            '1': 'calm',
                            '2': 'happy',
                            '3': 'sad',
                            '4': 'angry',
                            '5': 'fearful',
                            '6': 'disgust',
                            '7': 'surprised'}
      
        for key, value in label_conversion.items():
            if (int(key) == np.where(pred == 1)[1][0]).any():    
                label = value
        return label
    
    
    return (makepredictions(load_model())) 


# #to handle the behavior of a non-english song
# @app.route('/translator',methods=['GET','POST']) 
# def bytranslating():
#     if request.method =='GET':
#         methods='GET'
#         return render_template('translator.html',methods=methods)
#     elif request.method =='POST':
#         methods='POST'
#         song = request.form['lyrics']
#         transsong = translate_text(song)
#         data = [transsong]
# #         print(data)
#         vector = vectorizer()
# #         print(vector)
#         cleanedtxt = vector.transform(data).todense()
# #         print(cleanedtxt)
#         model = classifier()
#         my_prediction = model.predict(cleanedtxt)
#         val = model.predict_proba(cleanedtxt)
#         if (val[:,0] > val[:,1]):
#             prob = val[:,0]
#             prob = round(prob[0]*100,2)
#         else:
#             prob = val[:,1]
#             prob = round(prob[0]*100,2)
#         return render_template('translator.html', methods=methods,prediction = my_prediction,lyrics=song, probability=prob)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
#host='0.0.0.0'


# %%
