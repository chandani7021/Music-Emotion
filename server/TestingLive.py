"""
This file can be used to try a live prediction. 
"""
from flask import Flask, render_template, redirect, url_for, request,json
from flask_cors import CORS, cross_origin
import requests as rq
from flask_wtf import Form
from wtforms import RadioField
from wtforms import validators, ValidationError
import keras
import numpy as np
import librosa

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app)

class livePredictions:
    """
    Main class of the application.
    """

    def __init__(self, path, file):
        """
        Init method is used to initialize the main parameters.
        """
        self.path = path
        self.file = file

    def load_model(self):
        """
        Method to load the chosen model.
        :param path: path to your h5 model.
        :return: summary of the model with the .summary() function.
        """
        self.loaded_model = keras.models.load_model(self.path)
        return self.loaded_model.summary()

    def makepredictions(self):
        """
        Method to process the files and create your features.
        """
        data, sampling_rate = librosa.load(self.file)
        mfccs = np.mean(librosa.feature.mfcc(y=data, sr=sampling_rate, n_mfcc=40).T, axis=0)
        x = np.expand_dims(mfccs, axis=1)
        x = np.expand_dims(x, axis=0)
        predictions = (self.loaded_model.predict(x) > 0.5).astype("int32")
        print("Prediction is", " ", self.convertclasstoemotion(predictions))

    @staticmethod
    def convertclasstoemotion(pred):
        """
        Method to convert the predictions (int) into human readable strings.
        """
        
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



pred = livePredictions(path='/content/SER_model.h5',file='/content/16b10Wb.wav')

pred.load_model()
pred.makepredictions()

