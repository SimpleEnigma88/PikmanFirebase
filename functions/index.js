const functions = require('firebase-functions');
const logger = require('firebase-functions/logger');
const express = require('express');
const cors = require('cors');

const admin = require('firebase-admin');
admin.initializeApp();

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.post('/', async (req, res) => {
    const question = req.body;

    try {
        await admin.firestore().collection('questions').add(question);
        res.status(201).send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

app.get('/', async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection('questions').get();

        let questions = [];

        snapshot.forEach((doc) => {
            let id = doc.id;
            let data = doc.data();

            questions.push({ id: id, ...data });
        });

        res.status(200).send(JSON.stringify(questions));

    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});


app.get('/questions/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const question = await admin.firestore().collection('questions').doc(id).get();

        if (!question.exists) {
            res.status(404).send();
        } else {
            res.status(200).send(JSON.stringify({ id: question.id, question: question.data().question, answer: question.data().answer }));
        }
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

app.put('/questions/:id', async (req, res) => {
    const id = req.params.id;
    const question = req.body;

    try {
        await admin.firestore().collection('questions').doc(id).set(question);
        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

app.delete('/questions/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await admin.firestore().collection('questions').doc(id).delete();
        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

exports.pikmanTrivia = functions.https.onRequest(app);
