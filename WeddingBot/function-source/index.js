// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Image, Suggestion, Payload } = require('dialogflow-fulfillment');
const { dialogflow } = require('actions-on-google');
const axios = require('axios');
const app = dialogflow();
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements


exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function getSpreadsheetData() {
    return axios.get('https://sheetdb.io/api/v1/whqe3rigamh1y');
  }


  //Table Intent
  function Table(agent) {

    let nameBeforeEdit = agent.parameters.name;
    const name = nameBeforeEdit.toUpperCase();

    let count = 0;
    let tableNum = '';

function CountSameName(guest) {
      if ((guest.FirstName + ' ' + guest.SecondName) === name) {
        count += 1;
      } else if ((guest.FirstName) === name) {
        count += 1;
      } else if (guest.SecondName === name) {
        count += 1;
      } else if((guest.SecondName + ' ' + guest.FirstName) === name){
        count += 1;
      }else {
        count += 0;
      }

    }

    function GetTableName(guest) {
      if ((guest.Name).includes(name)) {
        tableNum = guest.Table;
      }
    }

      const payload = {
        "text": "Please try again by pressing the 'Try again' button or the 'Cancel' button to cancel. Thank you ☺️",
        "reply_markup": {
          "inline_keyboard": [
            [
              {
                "text": "Try again",
                "callback_data": "Table"
              }
            ],
            [
              {
                "text": "Cancel",
                "callback_data": "Cancel"
              }
            ]
          ]
        }
      };
    
    return getSpreadsheetData().then(res => {
      const guest = res.data;

      guest.forEach(CountSameName);
      if (count > 1) {
        agent.add(`Hi ${name.toLowerCase()}!, it seems like your name is common as there are ${count} ${name.toLowerCase()}s 🤣`);
        agent.add(
          new Payload(agent.TELEGRAM, payload, {rawPayload: false, sendAsMessage: true})
        );
      } else if (count === 0) {
        agent.add(`Your name is not in our list! Maybe it is registered with another name!`);
        agent.add(
          new Payload(agent.TELEGRAM, payload, {rawPayload: false, sendAsMessage: true})
        );
      } else {
        guest.forEach(GetTableName);
        if (tableNum === '0') {
          agent.add(`Hey! i'm sorry but you are not invited to the dinner reception because of the lack of space 😢`);

        } else {
          agent.add(`Hi ${name.toLowerCase()}! your table number is ${tableNum}`);
          agent.add(new Image('https://imgur.com/a/ZQkMR18'));
          agent.add(new Image('https://imgur.com/a/78ftxT7'));
        }
      }
    });
  }

  //ScheduleDinnerInfoTable intent
  function ScheduleDinnerInfoTable(agent) {
    let params = agent.getContext("contextname").parameters;
    let ContextName = params.param1;

    const name = ContextName.toUpperCase();

    let count = 0;
    let tableNum = '';

    function GetTableName(guest) {
      if ((guest.Name).includes(name)) {
        tableNum = guest.Table;
      }
    }

    return getSpreadsheetData().then(res => {
      const guest = res.data;
      guest.forEach(GetTableName);
      if (tableNum === '0') {
        agent.add(`Hey! i'm sorry but you are not invited to the dinner reception because of the lack of space 😢`);

      } else {
        agent.add(`Hi ${name.toLowerCase()}! your table number is ${tableNum}`);
        agent.add(new Image('https://imgur.com/a/ZQkMR18'));
        agent.add(new Image('https://imgur.com/a/78ftxT7'));
      }

    });

  }

  //Schedule intent
  function Schedule(agent) {

    let nameBeforeEdit = agent.parameters.name;
    const name = nameBeforeEdit.toUpperCase();

    let count = 0;
    let church = '';
    let tea = '';
    let dinner = '';

    let ctx = { 'name': 'contextname', 'lifespan': 5, 'parameters': { 'param1': name } };
    agent.setContext(ctx);

function CountSameName(guest) {
      if ((guest.FirstName + ' ' + guest.SecondName) === name) {
        count += 1;
      } else if ((guest.FirstName) === name) {
        count += 1;
      } else if (guest.SecondName === name) {
        count += 1;
      } else if((guest.SecondName + ' ' + guest.FirstName) === name){
        count += 1;
      }else {
        count += 0;
      }

    }
    function GetSchedule(guest) {
      if ((guest.Name).includes(name)) {
        church = guest.Church;
        tea = guest.Tea;
        dinner = guest.Dinner;
      }
    }

    const payload = {
      "text": "Please try again by pressing the 'Try again' button or the 'Cancel' button to cancel. Thank you ☺️",
      "reply_markup": {
        "inline_keyboard": [
          [
            {
              "text": "Try again",
              "callback_data": "Schedule"
            }
          ],
          [
            {
              "text": "Cancel",
              "callback_data": "Cancel"
            }
          ]
        ]
      }
    };

    return getSpreadsheetData().then(res => {
      const guest = res.data;

      guest.forEach(CountSameName);

      if (count > 1) {
        agent.add(`Hi ${name.toLowerCase()}!, it seems like your name is common as there are ${count} ${name.toLowerCase()}s 🤣`);
        agent.add(
          new Payload(agent.TELEGRAM, payload, {rawPayload: false, sendAsMessage: true})
        );
      } else if (count === 0) {
        agent.add(`Your name is not in our list! Maybe it is registered with another name!☺️`);
        agent.add(
          new Payload(agent.TELEGRAM, payload, {rawPayload: false, sendAsMessage: true})
        );


      } else {
        guest.forEach(GetSchedule);

        const ChurchCard = new Card({
          title: `Church ⛪️`,
          text: `10am - 12pm`,
          buttonText: 'Info 🔔',
          buttonUrl: 'church'
        });

        const TeaCard = new Card({
          title: `Tea Ceremony 🍵`,
          text: `11.40am - 1pm`,
          buttonText: 'Info 🫖',
          buttonUrl: 'tea'
        });

        const DinnerCard = new Card({
          title: `Dinner reception 🍽`,
          text: `6.30pm - 10.30pm`,
          buttonText: 'Info🍴',
          buttonUrl: 'ScheduleDinnerInfo'
        });

        if (dinner === 'TRUE' && church === 'TRUE' && tea === 'TRUE') {
          agent.add(`Hello ${name.toLowerCase()}!😄\n`);
          agent.add(ChurchCard);
          agent.add(TeaCard);
          agent.add(DinnerCard);
        }
        if (dinner === 'TRUE' && church === 'TRUE' && tea === 'FALSE') {
          agent.add(`Hello ${name.toLowerCase()}!😄\n`);
          agent.add(ChurchCard);
          agent.add(DinnerCard);
        }
        if (dinner === 'FALSE' && church === 'TRUE' && tea === 'FALSE') {
          agent.add(`Hello ${name.toLowerCase()}!😄\n`);
          agent.add(ChurchCard);
        }
      }
    });
  }



  let intentMap = new Map();
  intentMap.set('Table', Table);
  intentMap.set('Schedule', Schedule);
  intentMap.set('ScheduleDinnerInfoTable', ScheduleDinnerInfoTable);



  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
